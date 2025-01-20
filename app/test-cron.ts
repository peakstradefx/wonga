import { config } from "dotenv";
import mongoose from "mongoose";

// Load environment variables
config();

async function testInvestmentUpdates() {
  try {
    console.log("🚀 Starting Investment Update Test...\n");

    // 1. Environment Check
    console.log("📋 Environment Check:");
    const requiredEnvVars = [
      "VERCEL_CRON_SECRET",
      "CRON_SECRET_KEY",
      "NEXT_PUBLIC_API_URL",
      "MONGODB_URI",
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );
    if (missingVars.length > 0) {
      console.error(
        "❌ Missing environment variables:",
        missingVars.join(", ")
      );
      return;
    }
    console.log("✅ All required environment variables are set\n");

    // 2. Database Connection Test
    console.log("🔌 Testing Database Connection...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Database connected successfully\n");

    // 3. Test CRON Endpoint
    console.log("⚡ Testing CRON Endpoint...");
    const cronResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cron/update-profits`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_CRON_SECRET}`,
        },
      }
    );

    const cronResult = await cronResponse.json();
    console.log("CRON Response Status:", cronResponse.status);
    console.log("CRON Result:", JSON.stringify(cronResult, null, 2));

    if (!cronResponse.ok) {
      throw new Error(`CRON endpoint failed: ${cronResponse.statusText}`);
    }
    console.log("✅ CRON endpoint test completed\n");

    // 4. Validate Investment Updates
    console.log("🔍 Validating Investment Updates...");
    const Investment = mongoose.model(
      "CreateInvestment",
      new mongoose.Schema({
        userId: String,
        amount: Number,
        currentReturn: Number,
        lastReturnUpdate: Date,
        status: String,
      })
    );

    const updatedInvestments = await Investment.find({
      status: "active",
      lastReturnUpdate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    console.log(
      `Found ${updatedInvestments.length} recently updated investments`
    );

    updatedInvestments.forEach((investment) => {
      console.log("\nInvestment Details:");
      console.log("- ID:", investment._id);
      console.log("- Current Return:", investment.currentReturn);
      console.log("- Last Update:", investment.lastReturnUpdate);
    });

    // 5. Check Completed Investments
    const completedToday = await Investment.find({
      status: "completed",
      completionDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    console.log(`\nCompleted Investments Today: ${completedToday.length}`);

    // Cleanup
    await mongoose.disconnect();
    console.log("\n✅ Test completed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

// Run the test
testInvestmentUpdates();
