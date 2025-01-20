import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/utils/mongodb";
import CreateInvestment from "@/models/CreateInvestment";
import InvestmentInformation from "@/models/InvestmentInformation";

const DAILY_PROFIT_RATE = 0.149;
const INVESTMENT_DURATION_DAYS = 7;

interface ExtendedInvestment {
  _id: string;
  userId: string;
  amount: number;
  plan: string;
  createdAt: Date;
  lastProfitUpdate?: Date;
  lastReturnUpdate: Date;
  currentReturn: number;
  dailyReturn: number;
  maturityDate: Date;
  completionDate?: Date;
  status: "active" | "completed";
  percentageReturn: string;
}

interface DetailedInvestmentResponse {
  investments: {
    active: ExtendedInvestment[];
    completed: ExtendedInvestment[];
  };
  stats: {
    totalActiveInvestments: number;
    totalCompletedInvestments: number;
    totalInvestmentAmount: number;
    totalCurrentReturns: number;
    totalProfit: number;
  };
  account: {
    userId: string;
    accountBalance: number;
    package: string;
    totalReturnsEarned: number;
    lastInvestmentDate?: Date;
  };
  summary: {
    activeInvestmentsCount: number;
    completedInvestmentsCount: number;
    cancelledInvestmentsCount: number;
    totalLifetimeInvestments: number;
  };
}

interface InvestmentInfoType {
  _id: string;
  userId: string;
  accountBalance: number;
  investmentAmount: number;
  totalProfit: number;
  package: string;
  updatedAt: Date;
}

// Helper function to calculate daily returns
function calculateDailyReturns(investment: ExtendedInvestment) {
  const now = new Date();
  const lastUpdate = new Date(investment.lastReturnUpdate);

  // Skip if already updated today
  if (lastUpdate.toDateString() === now.toDateString()) {
    return {
      newReturn: investment.currentReturn,
      daysProcessed: 0,
    };
  }

  // Calculate days since last update
  const daysSinceUpdate = Math.floor(
    (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate remaining days until maturity
  const daysUntilMaturity = Math.floor(
    (new Date(investment.maturityDate).getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Only process days up to maturity date
  const daysToProcess = Math.min(
    daysSinceUpdate,
    Math.max(0, daysUntilMaturity + 1)
  );

  // Calculate new return amount
  const newReturn =
    investment.currentReturn + investment.dailyReturn * daysToProcess;

  return {
    newReturn,
    daysProcessed: daysToProcess,
  };
}

// POST endpoint (CRON job) to handle profit updates
export async function POST(req: NextRequest) {
  try {
    // Verify authorization
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all active investments
    const activeInvestments = await CreateInvestment.find({ status: "active" });
    const results = [];

    for (const investment of activeInvestments) {
      try {
        const { newReturn, daysProcessed } = calculateDailyReturns(investment);

        if (daysProcessed > 0) {
          // Update investment returns
          await CreateInvestment.findByIdAndUpdate(investment._id, {
            $set: {
              currentReturn: newReturn,
              lastReturnUpdate: new Date(),
            },
          });

          // Update user's investment information
          await InvestmentInformation.findOneAndUpdate(
            { userId: investment.userId },
            {
              $inc: {
                totalReturnsEarned: newReturn - investment.currentReturn,
              },
            }
          );

          results.push({
            investmentId: investment._id,
            profitAdded: newReturn - investment.currentReturn,
            daysProcessed,
          });
        }

        // Check if investment has matured
        if (new Date() >= new Date(investment.maturityDate)) {
          // Get investment info for the user
          const investmentInfo = (await InvestmentInformation.findOne({
            userId: investment.userId,
          })) as unknown as InvestmentInfoType;

          if (!investmentInfo) {
            throw new Error("Investment information not found");
          }

          // Handle the completed investment
          const totalProfit = await handleCompletedInvestment(
            investment,
            investmentInfo
          );

          results.push({
            investmentId: investment._id,
            status: "completed",
            totalProfit,
          });
        }
      } catch (error) {
        console.error(`Error processing investment ${investment._id}:`, error);
        results.push({
          investmentId: investment._id,
          error: (error as Error).message,
        });
      }
    }

    return NextResponse.json({
      message: "Daily profits updated successfully",
      results,
    });
  } catch (error) {
    console.error("Error updating daily profits:", error);
    return NextResponse.json(
      { error: "Failed to update daily profits" },
      { status: 500 }
    );
  }
}

async function handleCompletedInvestment(
  investment: ExtendedInvestment,
  investmentInfo: InvestmentInfoType
) {
  const totalProfit =
    investment.amount * DAILY_PROFIT_RATE * INVESTMENT_DURATION_DAYS;
  try {
    // Update investment status
    await CreateInvestment.findByIdAndUpdate(investment._id, {
      status: "completed",
      updatedAt: new Date(),
    });

    // Update investment information
    await InvestmentInformation.findByIdAndUpdate(investmentInfo._id, {
      $inc: {
        accountBalance: investment.amount + totalProfit,
        investmentAmount: -investment.amount,
        totalProfit: totalProfit,
      },
      $set: {
        updatedAt: new Date(),
        ...(investmentInfo.investmentAmount - investment.amount === 0 && {
          package: "No investment",
        }),
      },
    });

    console.log(`Investment ${investment._id} completed successfully`, {
      totalProfit,
      investmentAmount: investment.amount,
      userId: investment.userId,
    });
    return totalProfit;
  } catch (error) {
    console.error(`Error completing investment ${investment._id}:`, error);
    throw error;
  }
}

export async function GET() {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all investments for the user
    const activeInvestments = await CreateInvestment.find({
      userId: session.user.id,
      status: "active",
    }).sort({ createdAt: -1 });

    // Get completed investments (no time limit)
    const completedInvestments = await CreateInvestment.find({
      userId: session.user.id,
      status: "completed",
    }).sort({ completionDate: -1 });

    // Get user's investment information
    const investmentInfo = await InvestmentInformation.findOne({
      userId: session.user.id,
    });

    // Process active investments with updated returns
    const processedActiveInvestments = await Promise.all(
      activeInvestments.map(async (investment) => {
        const { newReturn } = calculateDailyReturns(investment);
        return {
          ...investment.toObject(),
          currentReturn: newReturn,
          percentageReturn: ((newReturn / investment.amount) * 100).toFixed(2),
        };
      })
    );

    // Process completed investments
    const processedCompletedInvestments = completedInvestments.map(
      (investment) => ({
        ...investment.toObject(),
        percentageReturn: (
          (investment.currentReturn / investment.amount) *
          100
        ).toFixed(2),
      })
    );

    // Calculate overall statistics
    const totalActiveInvestments = processedActiveInvestments.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    const totalCompletedInvestments = processedCompletedInvestments.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    const totalCurrentReturns = processedActiveInvestments.reduce(
      (sum, inv) => sum + inv.currentReturn,
      0
    );
    const totalProfit = processedCompletedInvestments.reduce(
      (sum, inv) => sum + inv.currentReturn,
      0
    );

    const response: DetailedInvestmentResponse = {
      investments: {
        active: processedActiveInvestments,
        completed: processedCompletedInvestments,
      },
      stats: {
        totalActiveInvestments,
        totalCompletedInvestments,
        totalInvestmentAmount:
          totalActiveInvestments + totalCompletedInvestments,
        totalCurrentReturns,
        totalProfit,
      },
      account: {
        userId: session.user.id,
        accountBalance: investmentInfo?.accountBalance || 0,
        package: investmentInfo?.package || "No investment",
        totalReturnsEarned: investmentInfo?.totalReturnsEarned || 0,
        lastInvestmentDate: investmentInfo?.lastInvestmentDate,
      },
      summary: {
        activeInvestmentsCount: processedActiveInvestments.length,
        completedInvestmentsCount: processedCompletedInvestments.length,
        cancelledInvestmentsCount:
          investmentInfo?.investmentStats?.cancelledInvestmentsCount || 0,
        totalLifetimeInvestments:
          investmentInfo?.investmentStats?.totalLifetimeInvestments || 0,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching investment information:", error);
    return NextResponse.json(
      { error: "Failed to fetch investment information" },
      { status: 500 }
    );
  }
}
