import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      default: "Others",
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Transaction",
  transactionSchema
);