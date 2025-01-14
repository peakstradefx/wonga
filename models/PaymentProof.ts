import mongoose from "mongoose";

const PaymentProofSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  wallet: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  proofURL: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "validated", "rejected"],
    default: "pending",
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

PaymentProofSchema.pre("save", function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.models.PaymentProof ||
  mongoose.model("PaymentProof", PaymentProofSchema);
