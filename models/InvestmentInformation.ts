import mongoose from "mongoose";

const InvestmentInformationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  accountBalance: {
    type: Number,
    default: 0,
  },
  investmentAmount: {
    type: Number,
    default: 0,
  },
  totalProfit: {
    type: Number,
    default: 0,
  },
  package: {
    type: String,
    default: "No investment",
  },
  lastInvestmentDate: {
    type: Date,
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

export default mongoose.models.InvestmentInformation ||
  mongoose.model("InvestmentInformation", InvestmentInformationSchema);
