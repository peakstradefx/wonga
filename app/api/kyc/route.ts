import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/utils/mongodb";
import KYC from "@/models/KYC";
import User from "@/models/User";

type KYCStatus = "pending" | "validated" | "rejected";
interface UpdateKYCRequest {
  kycId: string;
  status: KYCStatus;
  rejectionReason?: string;
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

async function uploadImageToCloudinary(file: File) {
  // Convert File to base64
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  // Upload to Cloudinary
  const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
    folder: "kyc_documents",
    resource_type: "auto",
  });

  return uploadResponse.secure_url;
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
      console.error("An error occurred:", error);
      return NextResponse.json(
        { message: "You are not authorized to carry out this operation!" },
        { status: 404 }
      );
    }

    // Check if user already has a pending or validated KYC
    const existingKYC = await KYC.findOne({
      userId: session.user.id,
      status: { $in: ["pending", "validated"] },
    });

    if (existingKYC) {
      return NextResponse.json(
        {
          message:
            "You already have a KYC submission that is pending or validated",
        },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const documentType = formData.get("documentType") as string;
    const idFrontFile = formData.get("idFront") as File;
    const idBackFile = formData.get("idBack") as File;

    // Validate inputs
    if (!documentType || !idFrontFile || !idBackFile) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file types
    if (
      !idFrontFile.type.startsWith("image/") ||
      !idBackFile.type.startsWith("image/")
    ) {
      return NextResponse.json(
        { message: "Invalid file type. Only images are allowed" },
        { status: 400 }
      );
    }

    // Upload both images to Cloudinary
    const [idFrontUrl, idBackUrl] = await Promise.all([
      uploadImageToCloudinary(idFrontFile),
      uploadImageToCloudinary(idBackFile),
    ]);

    // Create KYC record
    const kyc = await KYC.create({
      userId: session.user.id,
      documentType,
      idFrontImg: idFrontUrl,
      idBackImg: idBackUrl,
      status: "pending",
    });

    return NextResponse.json(
      {
        message: "KYC documents submitted successfully",
        kyc,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("KYC submission error:", error);
    return NextResponse.json(
      { message: "Failed to process KYC submission" },
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

    const kycSubmissions = await KYC.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(kycSubmissions);
  } catch (error) {
    console.error("Error fetching KYC submissions:", error);
    return NextResponse.json(
      { message: "Failed to fetch KYC submissions" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Verify admin status
    const adminUser = await User.findById(session.user.id);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { message: "Only admins can update KYC status" },
        { status: 403 }
      );
    }

    const body = (await req.json()) as UpdateKYCRequest;
    const { kycId, status, rejectionReason } = body;

    if (!kycId || !status) {
      return NextResponse.json(
        { message: "KYC ID and status are required" },
        { status: 400 }
      );
    }

    if (!["pending", "validated", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const kyc = await KYC.findById(kycId);
    if (!kyc) {
      return NextResponse.json(
        { message: "KYC submission not found" },
        { status: 404 }
      );
    }

    if (kyc.status === "validated") {
      return NextResponse.json(
        { message: "This KYC is already validated" },
        { status: 400 }
      );
    }

    // Update KYC status
    kyc.status = status;
    if (status === "rejected" && rejectionReason) {
      kyc.rejectionReason = rejectionReason;
    }

    // If status is validated, update the user's verification status
    if (status === "validated") {
      await User.findByIdAndUpdate(kyc.userId, {
        isVerified: true,
        verificationDate: new Date(),
      });
    }

    await kyc.save();

    return NextResponse.json({
      message: `KYC ${status} successfully`,
      kyc,
    });
  } catch (error) {
    console.error("KYC status update error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update KYC status",
      },
      { status: 500 }
    );
  }
}
