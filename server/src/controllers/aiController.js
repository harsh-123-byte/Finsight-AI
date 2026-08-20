import Transaction from "../models/Transaction.js";
import { generateGeminiInsights } from "../services/geminiService.js";
import User from "../models/User.js";

export const getAIInsights = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;
    const currency = user.currency || "INR";

    if (user.aiInsights?.length) {
      return res.status(200).json({
        success: true,
        provider: "cache",
        insights: user.aiInsights,
      });
    }

    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });

    if (!transactions || transactions.length === 0) {
      return res.status(200).json({ success: true, insights: [] });
    }

    const insights = await generateGeminiInsights({
      userName: user.name,
      currency,
      monthlyBudget: user.monthlyBudget || 0,
      savingsGoal: user.savingsGoal || 0,
      transactionCount: transactions.length,
      transactions: transactions.map((transaction) => ({
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
      })),
    });

    await User.findByIdAndUpdate(userId, {
      $set: { aiInsights: insights },
    });

    res.status(200).json({ success: true, provider: "gemini", insights });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
