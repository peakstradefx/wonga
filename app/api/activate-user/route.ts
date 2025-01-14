import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import mongoose, { ClientSession } from "mongoose";
import connectDB from "@/utils/mongodb";
import User from "@/models/User";

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
        { message: "Only admins can activate users" },
        { status: 403 }
      );
    }

    const { userId, activate } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (existingUser.isActivatedByAdmin === activate) {
      return NextResponse.json(
        {
          message: `User is already ${activate ? "activated" : "deactivated"}`,
          user: {
            _id: existingUser._id,
            isActivatedByAdmin: existingUser.isActivatedByAdmin,
          },
        },
        { status: 400 }
      );
    }

    mongoSession = await mongoose.startSession();
    await mongoSession.startTransaction();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isActivatedByAdmin: activate },
      { new: true, session: mongoSession }
    );

    await mongoSession.commitTransaction();

    // Return only the required fields
    return NextResponse.json({
      message: `User ${activate ? "activated" : "deactivated"} successfully`,
      user: {
        _id: updatedUser._id,
        isActivatedByAdmin: updatedUser.isActivatedByAdmin,
      },
    });
  } catch (error) {
    if (mongoSession) {
      await mongoSession.abortTransaction();
    }
    console.error("User activation error:", error);
    return NextResponse.json(
      { message: "Failed to update user activation status" },
      { status: 500 }
    );
  } finally {
    if (mongoSession) {
      await mongoSession.endSession();
    }
  }
}
