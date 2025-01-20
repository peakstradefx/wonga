import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/utils/mongodb";
import CreateInvestment from "@/models/CreateInvestment";
import InvestmentInformation from "@/models/InvestmentInformation";
import { INVESTMENT_PLANS } from "@/data/investmentPlan";

async function validateInvestment(userId: string, amount: number) {
  const investmentInfo = await InvestmentInformation.findOne({ userId }).exec();

  if (!investmentInfo) {
    throw new Error("Investment information not found");
  }

  if (investmentInfo.accountBalance < amount) {
    throw new Error("You do not have enough balance for this plan");
  }

  return investmentInfo;
}

function calculateInvestmentDetails(amount: number, planName: string) {
  const plan = INVESTMENT_PLANS.find((p) => p.planName === planName);

  if (!plan) {
    throw new Error("Invalid investment plan");
  }

  const expectedReturn = amount * plan.returnRate;
  const maturityAmount = amount + expectedReturn;
  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + plan.durationInDay);

  const dailyReturn = expectedReturn / plan.durationInDay;

  return {
    initialAmount: amount,
    expectedReturn,
    maturityAmount,
    maturityDate,
    dailyReturn,
    returnRate: plan.returnRate,
    durationInDays: plan.durationInDay,
  };
}

async function updateInvestmentInfo(
  userId: string,
  amount: number,
  planName: string,
  investmentDetails: ReturnType<typeof calculateInvestmentDetails>
) {
  const investmentInfo = await InvestmentInformation.findOneAndUpdate(
    { userId },
    {
      $inc: {
        accountBalance: -amount,
        totalInvestmentAmount: amount,
        "investmentStats.activeInvestmentsCount": 1,
        "investmentStats.totalLifetimeInvestments": 1,
      },
      $push: {
        activeInvestments: {
          amount,
          plan: planName,
          startDate: new Date(),
          maturityDate: investmentDetails.maturityDate,
          expectedReturn: investmentDetails.expectedReturn,
          dailyReturn: investmentDetails.dailyReturn,
          currentReturn: 0,
          status: "active",
          lastReturnUpdate: new Date(),
        },
      },
      $set: {
        lastInvestmentDate: new Date(),
        updatedAt: new Date(),
      },
    },
    { new: true }
  );

  if (!investmentInfo) {
    throw new Error("Failed to update investment information");
  }

  return investmentInfo;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const planName = formData.get("plan") as string;
    const amount = Number(formData.get("amount"));

    try {
      await validateInvestment(session.user.id, amount);
    } catch (error) {
      return NextResponse.json(
        { message: (error as Error).message },
        { status: 400 }
      );
    }

    const plan = INVESTMENT_PLANS.find((p) => p.planName === planName);

    if (!plan) {
      return NextResponse.json(
        { message: "Invalid investment plan" },
        { status: 400 }
      );
    }

    if (!amount || amount < plan.min || amount > plan.max) {
      return NextResponse.json(
        {
          message: `Amount must be between $${plan.min} and $${plan.max} for ${plan.planName} plan`,
        },
        { status: 400 }
      );
    }

    const investmentDetails = calculateInvestmentDetails(amount, planName);

    const investment = await CreateInvestment.create({
      userId: session.user.id,
      plan: planName,
      amount: investmentDetails.initialAmount,
      expectedReturn: investmentDetails.expectedReturn,
      maturityAmount: investmentDetails.maturityAmount,
      maturityDate: investmentDetails.maturityDate,
      dailyReturn: investmentDetails.dailyReturn,
      returnRate: investmentDetails.returnRate,
      durationInDays: investmentDetails.durationInDays,
      currentReturn: 0,
      lastReturnUpdate: new Date(),
      startDate: new Date(),
      status: "active",
      returnHistory: [],
      completionDate: null,
    });

    const updatedInfo = await updateInvestmentInfo(
      session.user.id,
      amount,
      planName,
      investmentDetails
    );

    return NextResponse.json(
      {
        message: "Investment created successfully",
        investment,
        investmentInfo: updatedInfo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Investment creation error:", error);
    return NextResponse.json(
      { message: (error as Error).message || "Failed to process investment" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const investments = await CreateInvestment.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    // Calculate current returns for active investments
    const updatedInvestments = investments.map((investment) => {
      if (investment.status === "active") {
        const daysSinceLastUpdate = Math.floor(
          (new Date().getTime() -
            new Date(investment.lastReturnUpdate).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastUpdate > 0) {
          investment.currentReturn +=
            investment.dailyReturn * daysSinceLastUpdate;
          investment.lastReturnUpdate = new Date();
          investment.returnHistory.push({
            date: new Date(),
            amount: investment.currentReturn,
          });
        }
      }
      return investment;
    });

    // Save any updates
    await Promise.all(
      updatedInvestments.map((investment) => investment.save())
    );

    return NextResponse.json(updatedInvestments);
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      { message: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const data = await req.json();
    const { investmentId, status } = data;

    if (!investmentId || !status) {
      return NextResponse.json(
        { message: "Investment ID and status are required" },
        { status: 400 }
      );
    }

    const investment = await CreateInvestment.findOne({
      _id: investmentId,
      userId: session.user.id,
    });

    if (!investment) {
      return NextResponse.json(
        { message: "Investment not found" },
        { status: 404 }
      );
    }

    // Calculate final return if completing investment
    if (status === "completed") {
      const daysSinceLastUpdate = Math.floor(
        (new Date().getTime() -
          new Date(investment.lastReturnUpdate).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      investment.currentReturn += investment.dailyReturn * daysSinceLastUpdate;
      investment.completionDate = new Date();
      investment.returnHistory.push({
        date: new Date(),
        amount: investment.currentReturn,
      });
    }

    investment.status = status;
    await investment.save();

    // Update InvestmentInformation
    if (status === "completed" || status === "cancelled") {
      await InvestmentInformation.findOneAndUpdate(
        { userId: session.user.id },
        {
          $pull: {
            activeInvestments: {
              amount: investment.amount,
              plan: investment.plan,
            },
          },
          $inc: {
            activeInvestmentsCount: -1,
            completedInvestmentsCount: status === "completed" ? 1 : 0,
            cancelledInvestmentsCount: status === "cancelled" ? 1 : 0,
            totalReturnsEarned:
              status === "completed" ? investment.currentReturn : 0,
          },
        }
      );
    }

    return NextResponse.json(investment);
  } catch (error) {
    console.error("Error updating investment:", error);
    return NextResponse.json(
      { message: "Failed to update investment" },
      { status: 500 }
    );
  }
}
