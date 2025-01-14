import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/utils/mongodb";
import CreateInvestment from "@/models/CreateInvestment";
import InvestmentInformation from "@/models/InvestmentInformation";

const DAILY_PROFIT_RATE = 0.149;
const INVESTMENT_DURATION_DAYS = 7;

interface Investment {
  _id: string;
  userId: string;
  amount: number;
  createdAt: Date;
  lastProfitUpdate?: Date;
  status: string;
  toObject(): Investment;
}

interface InvestmentInfo {
  _id: string;
  userId: string;
  accountBalance: number;
  investmentAmount: number;
  totalProfit: number;
  package: string;
  updatedAt: Date;
}

// Function to calculate investment profit
function calculateInvestmentProfit(investment: Investment) {
  const now = new Date();
  const startDate = new Date(investment.createdAt);
  const lastUpdateDate = investment.lastProfitUpdate
    ? new Date(investment.lastProfitUpdate)
    : startDate;

  // Calculate total days since investment started
  const totalDaysActive = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate days since last profit update
  const daysSinceLastUpdate = Math.floor(
    (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate remaining days until investment period is complete
  const daysRemaining = Math.max(0, INVESTMENT_DURATION_DAYS - totalDaysActive);

  // Only calculate new profits if there are days to process
  const daysToCalculate = Math.min(daysSinceLastUpdate, daysRemaining);

  const dailyProfit = investment.amount * DAILY_PROFIT_RATE;
  const profitToAdd = Math.max(0, dailyProfit * daysToCalculate);

  return {
    profitToAdd,
    isCompleted: totalDaysActive >= INVESTMENT_DURATION_DAYS,
    daysActive: Math.min(totalDaysActive, INVESTMENT_DURATION_DAYS),
    daysRemaining,
    dailyProfit,
  };
}

// Function to handle completed investments
async function handleCompletedInvestment(
  investment: Investment,
  investmentInfo: InvestmentInfo
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

// GET endpoint to fetch current profit statistics
export async function GET() {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const investmentInfo = await InvestmentInformation.findOne({
      userId: session.user.id,
    });

    if (!investmentInfo) {
      return NextResponse.json(
        { error: "Investment information not found" },
        { status: 404 }
      );
    }

    // Get active investments
    const activeInvestments = await CreateInvestment.find({
      userId: session.user.id,
      status: "active",
    });

    // Calculate current progress for each active investment
    const investmentsWithProgress = activeInvestments.map((investment) => {
      const { isCompleted, daysActive, daysRemaining, dailyProfit } =
        calculateInvestmentProfit(investment);

      return {
        ...investment.toObject(),
        daysActive,
        daysRemaining,
        isCompleted,
        dailyProfit,
        expectedTotalProfit: dailyProfit * INVESTMENT_DURATION_DAYS,
      };
    });

    // Get recently completed investments
    const completedInvestments = await CreateInvestment.find({
      userId: session.user.id,
      status: "completed",
    })
      .sort({ updatedAt: -1 })
      .limit(5);

    return NextResponse.json({
      accountBalance: investmentInfo.accountBalance || 0,
      totalProfit: investmentInfo.totalProfit || 0,
      investmentAmount: investmentInfo.investmentAmount || 0,
      activeInvestments: investmentsWithProgress,
      recentlyCompleted: completedInvestments,
    });
  } catch (error) {
    console.error("Error fetching profit information:", error);
    return NextResponse.json(
      { error: "Failed to fetch profit information" },
      { status: 500 }
    );
  }
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

    // Get all investment information records
    const investmentInfos = await InvestmentInformation.find({});
    const updateResults = [];

    for (const info of investmentInfos) {
      // Get active investments for current user
      const activeInvestments = await CreateInvestment.find({
        userId: info.userId,
        status: "active",
      });

      for (const investment of activeInvestments) {
        try {
          // Skip if already updated today
          if (investment.lastProfitUpdate) {
            const lastUpdate = new Date(investment.lastProfitUpdate);
            if (lastUpdate.toDateString() === new Date().toDateString()) {
              continue;
            }
          }

          const { profitToAdd, isCompleted } =
            calculateInvestmentProfit(investment);

          if (isCompleted) {
            const totalProfit = await handleCompletedInvestment(
              investment,
              info
            );
            updateResults.push({
              investmentId: investment._id,
              status: "completed",
              totalProfit,
            });
          } else if (profitToAdd > 0) {
            // Update investment's last profit update time
            await CreateInvestment.findByIdAndUpdate(investment._id, {
              lastProfitUpdate: new Date(),
            });

            // Add profit to total
            await InvestmentInformation.findByIdAndUpdate(info._id, {
              $inc: { totalProfit: profitToAdd },
              $set: { updatedAt: new Date() },
            });

            updateResults.push({
              investmentId: investment._id,
              status: "updated",
              profitAdded: profitToAdd,
            });
          }
        } catch (error) {
          console.error(
            `Error processing investment ${investment._id}:`,
            error
          );
          updateResults.push({
            investmentId: investment._id,
            status: "error",
            error: (error as Error).message,
          });
        }
      }
    }

    return NextResponse.json({
      message:
        "Daily profits updated and completed investments processed successfully",
      results: updateResults,
    });
  } catch (error) {
    console.error("Error updating daily profits:", error);
    return NextResponse.json(
      { error: "Failed to update daily profits" },
      { status: 500 }
    );
  }
}
