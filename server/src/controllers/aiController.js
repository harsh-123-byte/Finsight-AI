import Transaction from "../models/Transaction.js";

const formatCurrency = (value, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export const getAIInsights = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;
    const currency = user.currency || "INR";

    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 }).limit(200);

    if (!transactions || transactions.length === 0) {
      return res.status(200).json({ success: true, insights: [] });
    }

    let totalExpense = 0;
    let totalIncome = 0;
    let largestExpense = null;
    let smallestIncome = null;
    const categorySums = {};
    const descriptionCounts = {};

    transactions.forEach((t) => {
      if (t.type === "expense") {
        totalExpense += t.amount;
        categorySums[t.category] = (categorySums[t.category] || 0) + t.amount;

        if (!largestExpense || t.amount > largestExpense.amount) {
          largestExpense = t;
        }
      } else {
        totalIncome += t.amount;

        if (!smallestIncome || t.amount < smallestIncome.amount) {
          smallestIncome = t;
        }
      }

      const desc = (t.description || "").toLowerCase();
      descriptionCounts[desc] = (descriptionCounts[desc] || 0) + 1;
    });

    const topCategory = Object.keys(categorySums).sort((a, b) => categorySums[b] - categorySums[a])[0];

    const recurring = Object.entries(descriptionCounts)
      .filter(([desc, cnt]) => cnt >= 3 && desc.length > 3)
      .slice(0, 5)
      .map(([desc]) => desc);

    const averageExpense = totalExpense / Math.max(1, transactions.filter((t) => t.type === "expense").length);
    const averageIncome = totalIncome / Math.max(1, transactions.filter((t) => t.type === "income").length);
    const expenseRatio = totalIncome > 0 ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : 0;

    const insights = [];
    insights.push({ text: `Hi ${user.name}, here are your latest personalized financial highlights.` });
    insights.push({ text: `You have spent ${formatCurrency(totalExpense, currency)} across ${transactions.length} recent transactions.` });

    if (totalIncome > 0) {
      insights.push({ text: `Your income over the same period is ${formatCurrency(totalIncome, currency)}, so spending is ${expenseRatio}% of your income.` });
    }

    if (topCategory) {
      insights.push({ text: `Your top expense category is ${topCategory}, totaling ${formatCurrency(categorySums[topCategory], currency)}.` });
    }

    if (largestExpense) {
      insights.push({ text: `Largest recent expense: ${formatCurrency(largestExpense.amount, currency)} on "${largestExpense.description}".` });
    }

    if (smallestIncome) {
      insights.push({ text: `Smallest income transaction was ${formatCurrency(smallestIncome.amount, currency)} on "${smallestIncome.description}".` });
    }

    if (recurring.length > 0) {
      insights.push({ text: `Recurring charges detected: ${recurring.slice(0, 3).join(", ")}. Review subscriptions to optimize savings.` });
    }

    if (user.monthlyBudget > 0) {
      const budgetUsed = Math.min(100, Math.round((totalExpense / user.monthlyBudget) * 100));
      insights.push({ text: `Your monthly budget is ${formatCurrency(user.monthlyBudget, currency)} and you have used about ${budgetUsed}% of it.` });
    }

    if (user.savingsGoal > 0) {
      const progress = Math.round((Math.max(user.monthlyBudget - totalExpense, 0) / user.savingsGoal) * 100);
      insights.push({ text: `With your savings goal of ${formatCurrency(user.savingsGoal, currency)}, you're approximately ${Math.min(progress, 100)}% of the way to meeting it this month.` });
    }

    insights.push({ text: `Try setting one smaller spending target for the week to keep your budget on track.` });

    if (!user.isPremium) {
      insights.push({ text: `Upgrade to premium for more personalized forecasts and AI-powered budgeting suggestions.` });
    }

    res.status(200).json({ success: true, insights });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
