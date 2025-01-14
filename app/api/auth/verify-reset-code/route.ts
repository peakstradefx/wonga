// app/api/auth/verify-reset-code/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json(
                { message: "Email and code are required" },
                { status: 400 }
            );
        }

        await connectDB();

        // Find user with matching code that hasn't expired
        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired verification code" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Code verified successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { message: "Something went wrong", error: errorMessage },
            { status: 500 }
        );
    }
}