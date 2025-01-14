import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/utils/mongodb";
import Withdrawal from "@/models/Withdrawal";
import InvestmentInformation from "@/models/InvestmentInformation";
import KYC from "@/models/KYC";

async function validateKYC(userId: string) {
  const kyc = await KYC.findOne({
    userId,
    status: "validated",
  });

  if (!kyc) {
    throw new Error(
      "KYC verification is required before making withdrawals. Please complete your KYC verification first."
    );
  }

  return kyc;
}

async function validateWithdrawal(userId: string, amount: number) {
  const investmentInfo = await InvestmentInformation.findOne({ userId }).exec();
  if (!investmentInfo) {
    throw new Error("Investment information not found");
  }
  if (investmentInfo.accountBalance < amount) {
    throw new Error("Insufficient balance for the requested withdrawal");
  }
  return investmentInfo;
}

async function updateBalance(userId: string, amount: number) {
  const updatedInfo = await InvestmentInformation.findOneAndUpdate(
    { userId },
    {
      $inc: { accountBalance: -amount },
      $set: { updatedAt: new Date() },
    },
    { new: true }
  );
  if (!updatedInfo) {
    throw new Error("Failed to update account balance");
  }
  return updatedInfo;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Check KYC status first
    try {
      await validateKYC(session.user.id);
    } catch (error) {
      return NextResponse.json(
        { message: (error as Error).message },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const amount = Number(formData.get("amount"));
    const paymentMethod = formData.get("paymentMethod") as string;
    const walletAddress = formData.get("walletAddress") as string;

    // Validate input
    if (!amount || !paymentMethod || !walletAddress) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { message: "Withdrawal amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Validate balance
    try {
      await validateWithdrawal(session.user.id, amount);
    } catch (error) {
      return NextResponse.json(
        { message: (error as Error).message },
        { status: 400 }
      );
    }

    // Create withdrawal request and update balance
    const withdrawal = await Withdrawal.create({
      userId: session.user.id,
      amount,
      paymentMethod,
      walletAddress,
      status: "pending",
      updatedAt: new Date(),
    });

    // Update investment information
    const updatedBalance = await updateBalance(session.user.id, amount);

    return NextResponse.json(
      {
        message: "Withdrawal request submitted successfully",
        withdrawal,
        updatedBalance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Withdrawal request error:", error);
    return NextResponse.json(
      { message: "Failed to process withdrawal request" },
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

    const withdrawals = await Withdrawal.find({
      userId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .select("amount paymentMethod walletAddress status createdAt updatedAt");

    // Get KYC status for informational purposes
    const kyc = await KYC.findOne({
      userId: session.user.id,
      status: "validated",
    });

    return NextResponse.json({
      withdrawals,
      kycStatus: kyc ? "validated" : "not_validated",
    });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { message: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
