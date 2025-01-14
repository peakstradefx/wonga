import mongoose from "mongoose";

const KYCSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  documentType: {
    type: String,
    required: true,
  },
  idFrontImg: {
    type: String,
    required: true,
  },
  idBackImg: {
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

KYCSchema.pre("save", function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.models.KYC ||
  mongoose.model("KYC", KYCSchema);
