import Transaction from "../models/Transaction.js";

// ==========================================
// Dashboard Summary
// ==========================================
export const getDashboardSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        balance,
        totalTransactions: transactions.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Complete Dashboard
// ==========================================
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // ---------------- Summary ----------------
    const transactions = await Transaction.find({
      user: userId,
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    const summary = {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      totalTransactions: transactions.length,
    };

    // ---------------- Category ----------------
    const categoryExpenses = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          amount: 1,
        },
      },
      {
        $sort: {
          amount: -1,
        },
      },
    ]);

    // ---------------- Monthly ----------------
    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "expense",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalExpense: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalExpense: 1,
        },
      },
    ]);

    // ---------------- Recent ----------------
    const recentTransactions = await Transaction.find({
      user: userId,
    })
      .sort({
        date: -1,
        createdAt: -1,
      })
      .limit(5);

    res.status(200).json({
      success: true,
      summary,
      categoryExpenses,
      monthlyExpenses,
      recentTransactions,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Category Wise Expenses
// ==========================================
export const getCategoryExpenses = async (req, res) => {
  try {
    const categories = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          amount: 1,
        },
      },
      {
        $sort: {
          amount: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Monthly Expense Trend
// ==========================================
export const getMonthlyExpenses = async (req, res) => {
  try {
    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "expense",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalExpense: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalExpense: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      monthlyExpenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Recent Transactions
// ==========================================
export const getRecentTransactions = async (req, res) => {
  try {

    const transactions = await Transaction.find({
      user: req.user.id,
    })
      .sort({
        date: -1,
        createdAt: -1,
      })
      .limit(5);

    res.status(200).json({
      success: true,
      transactions,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};