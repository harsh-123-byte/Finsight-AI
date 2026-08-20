import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      default: "",
    },

    currency: {
      type: String,
      default: "INR",
    },

    monthlyBudget: {
      type: Number,
      default: 0,
    },

    savingsGoal: {
      type: Number,
      default: 0,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },
    aiInsights: {
      type: [
        {
          _id: false,
          type: String,
          title: String,
          text: String,
          action: String,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;