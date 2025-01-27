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

    // Get active investments
    const activeInvestments = await CreateInvestment.find({
      userId: id,
      status: "active",
    });

    let totalCurrentProfit = 0;
    let totalActiveInvestmentAmount = 0;
    const completedInvestmentIds: string[] = [];
    const remainingActiveInvestments: ProcessedInvestment[] = [];

    // Calculate investment progress and identify completed investments
    const investmentsWithProgress = activeInvestments.map((investment) => {
      const daysActive = Math.ceil(
        Math.abs(new Date().getTime() - investment.createdAt.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const startDate = new Date(investment.createdAt);
      const lastUpdateDate = investment.lastProfitUpdate
        ? new Date(investment.lastProfitUpdate)
        : startDate;

      const maxDaysToCalculate = Math.min(
        7 -
          Math.ceil(
            Math.abs(lastUpdateDate.getTime() - startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          ),
        Math.ceil(
          Math.abs(new Date().getTime() - lastUpdateDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );

      const isCompleted = daysActive >= 7;
      const expectedProfit = investment.amount * 0.143 * 7;
      const currentProfit = investment.amount * 0.143 * maxDaysToCalculate;

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

      if (isCompleted) {
        completedInvestmentIds.push(investment._id.toString());
      } else {
        remainingActiveInvestments.push(processedInvestment);
        totalCurrentProfit += currentProfit;
        totalActiveInvestmentAmount += investment.amount;
      }

      return processedInvestment;
    });

    // Process completed investments
    if (completedInvestmentIds.length > 0) {
      // Calculate total amount to add to account balance
      const completedInvestmentsTotal = investmentsWithProgress
        .filter((inv) => completedInvestmentIds.includes(inv._id))
        .reduce((total, inv) => total + inv.amount + inv.expectedProfit, 0);

      // Update investment statuses to completed
      await CreateInvestment.updateMany(
        { _id: { $in: completedInvestmentIds } },
        { $set: { status: "completed" } }
      );

      // Update account balance and reset totalInvestmentAmount for completed investments
      investmentInfo = await InvestmentInformation.findOneAndUpdate(
        { userId: id },
        {
          $inc: { accountBalance: completedInvestmentsTotal },
          $set: { totalInvestmentAmount: totalActiveInvestmentAmount },
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
        investmentAmount: totalActiveInvestmentAmount,
        package:
          remainingActiveInvestments.length > 0
            ? investmentInfo?.package
            : "No investment",
        activeInvestments: remainingActiveInvestments,
        recentlyCompleted,
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
