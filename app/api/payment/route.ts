import { NextRequest, NextResponse } from "next/server";
import PaymentProof from "@/models/PaymentProof";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/utils/mongodb";
import User from "@/models/User";
import mongoose, { ClientSession } from "mongoose";
import InvestmentInformation from "@/models/InvestmentInformation";

type PaymentStatus = "pending" | "validated" | "rejected";
interface UpdatePaymentRequest {
  paymentId: string;
  status: PaymentStatus;
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function validateUser(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found in database");
  }
  return user;
}

export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Validate user exists in database
    try {
      await validateUser(session.user.id);
    } catch (error) {
      console.error("User account not found:", error);
      return NextResponse.json(
        { message: "You are not authorized to carry out this operation!" },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const wallet = formData.get("wallet") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const proofFile = formData.get("proof") as File;

    // Validate inputs
    if (!wallet || !amount || !proofFile) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!proofFile.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Invalid file type. Only images are allowed" },
        { status: 400 }
      );
    }

    // Convert File to base64
    const bytes = await proofFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${proofFile.type};base64,${buffer.toString(
      "base64"
    )}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: "payment_proofs",
      resource_type: "auto",
    });

    // Create payment proof record
    const paymentProof = await PaymentProof.create({
      userId: session.user.id,
      wallet,
      amount,
      proofURL: uploadResponse.secure_url,
      status: "pending",
    });

    return NextResponse.json(
      {
        message: "Payment proof submitted successfully",
        paymentProof,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Payment proof submission error:", error);
    return NextResponse.json(
      { message: "Failed to process payment proof" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  let mongoSession: ClientSession | null = null;

  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const adminUser = await User.findById(session.user.id);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { message: "Only admins can update payment status" },
        { status: 403 }
      );
    }

    const body = (await req.json()) as UpdatePaymentRequest;
    const { paymentId, status } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { message: "Payment ID and status are required" },
        { status: 400 }
      );
    }

    if (!["pending", "validated", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const paymentProof = await PaymentProof.findById(paymentId);
    if (!paymentProof) {
      return NextResponse.json(
        { message: "Payment proof not found" },
        { status: 404 }
      );
    }

    if (paymentProof.status === "validated") {
      return NextResponse.json(
        { message: "This payment is already validated" },
        { status: 400 }
      );
    }

    mongoSession = await mongoose.startSession();
    if (!mongoSession) {
      throw new Error("Failed to start database session");
    }
    await mongoSession.startTransaction();

    try {
      paymentProof.status = status;
      await paymentProof.save({ session: mongoSession });

      if (status === "validated") {
        let investmentInfo = await InvestmentInformation.findOne({
          userId: paymentProof.userId,
        }).session(mongoSession);

        if (!investmentInfo) {
          investmentInfo = new InvestmentInformation({
            userId: paymentProof.userId,
            accountBalance: 0,
          });
        }

        investmentInfo.accountBalance += paymentProof.amount;
        await investmentInfo.save({ session: mongoSession });
      }

      await mongoSession.commitTransaction();

      return NextResponse.json({
        message: `Payment ${status} successfully`,
        paymentProof,
      });
    } catch (error) {
      if (mongoSession) {
        await mongoSession.abortTransaction();
      }
      throw error;
    } finally {
      if (mongoSession) {
        await mongoSession.endSession();
        mongoSession = null;
      }
    }
  } catch (error) {
    console.error("Payment status update error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update payment status",
      },
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

    // Validate user exists in database
    try {
      await validateUser(session.user.id);
    } catch (error) {
      console.error("An error occurred:", error);
      return NextResponse.json(
        { message: "User account not found" },
        { status: 404 }
      );
    }

    const paymentProofs = await PaymentProof.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(paymentProofs);
  } catch (error) {
    console.error("Error fetching payment proofs:", error);
    return NextResponse.json(
      { message: "Failed to fetch payment proofs" },
      { status: 500 }
    );
  }
}
