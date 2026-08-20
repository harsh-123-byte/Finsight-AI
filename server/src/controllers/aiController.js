import Transaction from "../models/Transaction.js";
import {
  generateFallbackInsights,
  generateGeminiInsights,
} from "../services/geminiService.js";
import User from "../models/User.js";

export const getAIInsights = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;
    const currency = user.currency || "INR";

    if (user.aiInsightsProvider === "gemini" && user.aiInsights?.length) {
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

    let insights;
    let provider = "gemini";

    try {
      insights = await generateGeminiInsights({
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
    } catch (error) {
      if (error.statusCode !== 429 && !/quota|rate limit|resource exhausted/i.test(error.message)) {
        throw error;
      }

      provider = "fallback";
      insights = generateFallbackInsights(transactions, currency);
    }

    if (provider === "gemini") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          aiInsights: insights,
          aiInsightsProvider: "gemini",
        },
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $set: { aiInsights: [] },
        $unset: { aiInsightsProvider: 1 },
      });
    }

    res.status(200).json({ success: true, provider, insights });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
