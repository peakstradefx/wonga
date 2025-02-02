import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import User from "@/models/User";
import CreateInvestment from "@/models/CreateInvestment";
import InvestmentInformation from "@/models/InvestmentInformation";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import KYC from "@/models/KYC";
import PaymentProof from "@/models/PaymentProof";
import Withdrawal from "@/models/Withdrawal";
import { Types } from "mongoose";

interface BaseInvestment {
  _id: Types.ObjectId;
  userId: string;
  amount: number;
  status: "active" | "completed" | "pending";
  createdAt: Date;
  updatedAt: Date;
  lastProfitUpdate?: Date;
}
interface CompletedInvestment extends BaseInvestment {
  profit: number;
}

interface ProcessedInvestment extends Omit<BaseInvestment, "_id"> {
  _id: string;
  daysActive: number;
  daysRemaining: number;
  isCompleted: boolean;
  expectedProfit: number;
  currentProfit: number;
}

interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  createdAt: Date;
  status: string;
  isActivatedByAdmin: boolean;
}

interface InvestmentResponse {
  accountBalance: number;
  totalProfit: number;
  investmentAmount: number;
  package: string;
  activeInvestments: ProcessedInvestment[];
  recentlyCompleted: BaseInvestment[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch user details
    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Fetch KYC information
    const kycDetails = await KYC.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(1);

    // Fetch Deposit information
    const depositDetails = await PaymentProof.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(1);

    // Fetch Withdrawal information
    const withdrawalDetails = await Withdrawal.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(1);

    // Fetch investment information
    let investmentInfo = await InvestmentInformation.findOne({
      userId: id,
    });

    // Get all investments
    const allInvestments = await CreateInvestment.find({
      userId: id,
    }).sort({ updatedAt: -1 });

    // Get active investments
    const activeInvestments = allInvestments.filter(
      (inv) => inv.status === "active"
    );

    // Calculate current investment amount
    const currentInvestmentAmount = activeInvestments.reduce(
      (total, inv) => total + inv.amount,
      0
    );

    let totalCurrentProfit = 0;
    const completedInvestmentIds: string[] = [];
    const remainingActiveInvestments: ProcessedInvestment[] = [];

    // Process and calculate profits for all investments
    const processInvestment = (investment: BaseInvestment) => {
      const daysActive = Math.ceil(
        Math.abs(new Date().getTime() - investment.createdAt.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // For completed investments, use full profit
      if (investment.status === "completed") {
        const profit = investment.amount * 0.143 * 7;
        totalCurrentProfit += profit;
        return profit;
      }

      // Calculate effective days for profit (starting from day 2)
      const effectiveDaysActive = Math.max(0, daysActive - 1);

      // Calculate remaining days and profit rate
      // Increase daily rate to maintain same total profit over 6 days instead of 7
      const dailyProfitRate = (0.143 * 7) / 6; // Distribute total profit over 6 days

      // For active investments, calculate based on effective days
      const maxDaysToCalculate = Math.min(
        6, // Max 6 days of profit accumulation
        effectiveDaysActive
      );

      const isCompleted = daysActive >= 7;
      const expectedProfit = investment.amount * 0.143 * 7; // Keep same total expected profit
      const currentProfit = isCompleted
        ? expectedProfit
        : investment.amount * dailyProfitRate * maxDaysToCalculate;

      if (isCompleted) {
        completedInvestmentIds.push(investment._id.toString());
        totalCurrentProfit += expectedProfit;
      } else {
        const processedInvestment: ProcessedInvestment = {
          _id: investment._id.toString(),
          userId: investment.userId,
          amount: investment.amount,
          status: investment.status as "active" | "completed" | "pending",
          createdAt: investment.createdAt,
          updatedAt: investment.updatedAt,
          lastProfitUpdate: investment.lastProfitUpdate,
          daysActive: Math.min(daysActive, 7),
          daysRemaining: Math.max(0, 7 - daysActive),
          isCompleted,
          expectedProfit,
          currentProfit,
        };
        remainingActiveInvestments.push(processedInvestment);
        totalCurrentProfit += currentProfit;
      }

      return currentProfit;
    };

    // Process all investments to calculate total profit
    allInvestments.forEach(processInvestment);

    // Process completed investments
    if (completedInvestmentIds.length > 0) {
      // Update investment statuses to completed
      await CreateInvestment.updateMany(
        { _id: { $in: completedInvestmentIds } },
        { $set: { status: "completed" } }
      );

      // Calculate profits for newly completed investments
      const newlyCompletedInvestments = activeInvestments.filter((inv) =>
        completedInvestmentIds.includes(inv._id.toString())
      );

      const newlyCompletedProfit = newlyCompletedInvestments.reduce(
        (total, inv) => total + inv.amount * 0.143 * 7,
        0
      );

      // Update account balance with only the new profits
      investmentInfo = await InvestmentInformation.findOneAndUpdate(
        { userId: id },
        {
          $inc: { accountBalance: newlyCompletedProfit },
          $set: { totalInvestmentAmount: currentInvestmentAmount },
        },
        { new: true }
      );
    }

    // Get recently completed investments
    const recentlyCompleted = await CreateInvestment.find({
      userId: id,
      status: "completed",
    })
      .sort({ updatedAt: -1 })
      .limit(5);

    // Add profit calculation for completed investments
    const recentlyCompletedWithProfits: CompletedInvestment[] =
      recentlyCompleted.map((investment) => ({
        ...investment.toObject(),
        profit: investment.amount * 0.143 * 7, // Calculate total profit for completed investment
      }));

    const response = {
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        country: user.country,
        createdAt: user.createdAt,
        status: user.status,
        isActivatedByAdmin: user.isActivatedByAdmin,
      } as UserResponse,
      depositDetails: depositDetails[0] || null,
      withdrawalDetails: withdrawalDetails[0] || null,
      kyc: kycDetails[0] || null,
      investment: {
        accountBalance: investmentInfo?.accountBalance || 0,
        totalProfit: totalCurrentProfit,
        investmentAmount: currentInvestmentAmount,
        package:
          remainingActiveInvestments.length > 0
            ? investmentInfo?.package
            : "No active investment",
        activeInvestments: remainingActiveInvestments,
        recentlyCompleted: recentlyCompletedWithProfits, // Use the new array with profits
      } as InvestmentResponse,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();

    const body = await request.json();

    // Prevent role updates for security
    delete body.role;
    // Prevent password updates through this endpoint
    delete body.password;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
