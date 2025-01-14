import User from "@/models/User";
import connectDB from "@/utils/mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import InvestmentInformation from "@/models/InvestmentInformation";
import { createEmailService } from "@/utils/emailService";

export async function POST(request: Request) {
  let session: mongoose.ClientSession | null = null;
  try {
    const body = await request.json();
    const { firstName, lastName, email, country, phoneNumber, password } = body;
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with same email already exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    session = await mongoose.startSession();
    session.startTransaction();

    const newUser = await User.create(
      [
        {
          firstName,
          lastName,
          email,
          phoneNumber,
          country,
          password: hashedPassword,
          isActive: true,
          isActivatedByAdmin: false,
        },
      ],
      { session }
    );

    await InvestmentInformation.create(
      [
        {
          userId: newUser[0]._id,
        },
      ],
      { session }
    );

    // Send welcome email
    const emailService = await createEmailService();
    try {
      await emailService.sendWelcomeEmail({
        firstName: newUser[0].firstName,
        email: newUser[0].email,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    await session.commitTransaction();

    return NextResponse.json(
      {
        message:
          "Registration successful! Check your email for instructions on account activation",
        user: newUser[0],
      },
      { status: 201 }
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
