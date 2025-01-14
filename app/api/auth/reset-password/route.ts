import { NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { createEmailService } from "@/utils/emailService";

// Helper function to generate a random 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Request password reset
export async function POST(request: Request) {
  let session: mongoose.ClientSession | null = null;
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email" },
        { status: 404 }
      );
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const codeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    session = await mongoose.startSession();
    session.startTransaction();

    // Update user with verification code
    await User.updateOne(
      { email },
      {
        resetPasswordCode: verificationCode,
        resetPasswordExpires: codeExpiry,
      },
      { session }
    );

    // Send verification code email
    const emailService = await createEmailService();
    try {
      await emailService.sendPasswordResetEmail({
        firstName: user.firstName,
        email: user.email,
        code: verificationCode,
      });
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      throw new Error("Failed to send verification code");
    }

    await session.commitTransaction();

    return NextResponse.json(
      { message: "Password reset instructions sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Something went wrong", error: errorMessage },
      { status: 500 }
    );
  } finally {
    if (session) {
      session.endSession();
    }
  }
}

// Reset password with verification code
export async function PUT(request: Request) {
  let session: mongoose.ClientSession | null = null;
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { message: "Email, code, and new password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user and verify code
    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    session = await mongoose.startSession();
    session.startTransaction();

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password and clear reset code
    await User.updateOne(
      { email },
      {
        password: hashedPassword,
        resetPasswordCode: null,
        resetPasswordExpires: null,
      },
      { session }
    );

    await session.commitTransaction();

    return NextResponse.json(
      { message: "Password successfully reset" },
      { status: 200 }
    );
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Something went wrong", error: errorMessage },
      { status: 500 }
    );
  } finally {
    if (session) {
      session.endSession();
    }
  }
}
