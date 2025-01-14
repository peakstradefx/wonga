import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/utils/mongodb";
import CreateInvestment from "@/models/CreateInvestment";
import InvestmentInformation from "@/models/InvestmentInformation";

const INVESTMENT_PLANS = {
  BASIC: { name: "Basic", min: 1000, max: 1999 },
  DELUXE: { name: "Deluxe", min: 2000, max: 4999 },
  ENTERPRISE: { name: "Enterprise", min: 5000, max: 9999 },
  GOLD: { name: "Gold", min: 10000, max: 14999 },
  PREMIUM: { name: "Premium", min: 15000, max: 19999 },
  PLATINUM: { name: "Platinum", min: 20000, max: 100000 },
} as const;

async function validateInvestment(userId: string, amount: number) {
  const investmentInfo = await InvestmentInformation.findOne({ userId }).exec();

  if (!investmentInfo) {
    throw new Error("Investment information not found");
  }

  // Check for existing investment
  if (investmentInfo.investmentAmount > 0) {
    throw new Error("You have an active investment already");
  }

  // Check balance
  if (investmentInfo.accountBalance < amount) {
    throw new Error("You do not have enough balance for this plan");
  }

  return investmentInfo;
}

async function updateInvestmentInfo(
  userId: string,
  amount: number,
  planName: string
) {
  const investmentInfo = await InvestmentInformation.findOneAndUpdate(
    { userId },
    {
      $inc: {
        accountBalance: -amount,
        investmentAmount: amount,
      },
      $set: {
        package: planName,
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

    // Validate investment and balance
    try {
      await validateInvestment(session.user.id, amount);
    } catch (error) {
      return NextResponse.json(
        { message: (error as Error).message },
        { status: 400 }
      );
    }

    const planKey = Object.keys(INVESTMENT_PLANS).find(
      (key) =>
        INVESTMENT_PLANS[key as keyof typeof INVESTMENT_PLANS].name === planName
    );

    if (!planKey) {
      return NextResponse.json(
        { message: "Invalid investment plan" },
        { status: 400 }
      );
    }

    const plan = INVESTMENT_PLANS[planKey as keyof typeof INVESTMENT_PLANS];

    if (!amount || amount < plan.min || amount > plan.max) {
      return NextResponse.json(
        {
          message: `Amount must be between $${plan.min} and $${plan.max} for ${plan.name} plan`,
        },
        { status: 400 }
      );
    }

    // Create investment and update investment info
    const investment = await CreateInvestment.create({
      userId: session.user.id,
      plan: planName,
      amount,
      status: "active",
    });

    // Update investment information
    const updatedInfo = await updateInvestmentInfo(
      session.user.id,
      amount,
      planName
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
      { messsage: (error as Error).message || "Failed to process investment" },
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

    return NextResponse.json(investments);
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

    const investment = await CreateInvestment.findOneAndUpdate(
      { _id: investmentId, userId: session.user.id },
      { status },
      { new: true }
    );

    if (!investment) {
      return NextResponse.json(
        { message: "Investment not found" },
        { status: 404 }
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
