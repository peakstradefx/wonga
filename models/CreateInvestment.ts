import mongoose from "mongoose";

const CreateInvestmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["inactive", "active", "completed"],
    default: "inactive",
  },
  lastProfitUpdate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

CreateInvestmentSchema.pre("save", function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.models.CreateInvestment ||
  mongoose.model("CreateInvestment", CreateInvestmentSchema);
