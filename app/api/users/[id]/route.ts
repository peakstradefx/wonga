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

    // Fetch Deposit information
    const withdrawalDetails = await Withdrawal.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(1);

    // Fetch investment information
    const investmentInfo = await InvestmentInformation.findOne({
      userId: id,
    });

    // Get active investments
    const activeInvestments = await CreateInvestment.find({
      userId: id,
      status: "active",
    });

    // Calculate investment progress
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

      return {
        ...investment.toObject(),
        daysActive: Math.min(daysActive, 7),
        daysRemaining: Math.max(0, 7 - daysActive),
        isCompleted: daysActive >= 7,
        expectedProfit: investment.amount * 0.149 * 7,
        currentProfit: investment.amount * 0.149 * maxDaysToCalculate,
      };
    });

    // Calculate total current profit from active investments
    const totalCurrentProfit = investmentsWithProgress.reduce(
      (total, investment) => total + investment.currentProfit,
      0
    );

    // Get completed investments
    const completedInvestments = await CreateInvestment.find({
      userId: id,
      status: "completed",
    })
      .sort({ updatedAt: -1 })
      .limit(5);

    // Combine and return all data
    return NextResponse.json(
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          country: user.country,
          createdAt: user.createdAt,
          status: user.status,
          isActivatedByAdmin: user.isActivatedByAdmin,
        },
        depositDetails: depositDetails[0] || null,
        withdrawalDetails: withdrawalDetails[0] || null,
        kyc: kycDetails[0] || null,
        investment: {
          accountBalance: investmentInfo?.accountBalance || 0,
          totalProfit: totalCurrentProfit, // Updated to sum of currentProfit
          investmentAmount: investmentInfo?.totalInvestmentAmount || 0,
          package: investmentInfo?.package || "No investment",
          activeInvestments: investmentsWithProgress,
          recentlyCompleted: completedInvestments,
        },
      },
      { status: 200 }
    );
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
