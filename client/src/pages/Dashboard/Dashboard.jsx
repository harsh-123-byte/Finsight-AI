import { useEffect, useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import SummaryCards from "../../components/dashboard/SummaryCards";
import ExpenseChart from "../../components/dashboard/ExpenseChart";
import CategoryChart from "../../components/dashboard/CategoryChart";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import AIInsights from "../../components/dashboard/AIInsights";
import StatementUpload from "../../components/dashboard/StatementUpload";

import { getDashboardData } from "../../services/dashboardService";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      totalTransactions: 0,
    },
    monthlyExpenses: [],
    categoryExpenses: [],
    recentTransactions: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await getDashboardData();

      console.log("=========== DASHBOARD RESPONSE ===========");
      console.log(response);

      setDashboardData({
        summary: response.summary || {
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
          totalTransactions: 0,
        },
        monthlyExpenses: response.monthlyExpenses || [],
        categoryExpenses: response.categoryExpenses || [],
        recentTransactions: response.recentTransactions || [],
      });
    } catch (err) {
      console.error("Dashboard Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  console.log("dashboardData =", dashboardData);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-lg">
          Loading Dashboard...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-red-500">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {/* Heading */}
      <h1 className="text-4xl font-bold">
        Welcome Back 👋
      </h1>

      <p className="mt-2 text-slate-400">
        Here's your financial overview for this month.
      </p>

      {/* Summary */}
      <div className="mt-10">
        <SummaryCards summary={dashboardData.summary} />
      </div>

      {/* Charts */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <ExpenseChart
          data={dashboardData.monthlyExpenses}
        />

        <CategoryChart
          data={dashboardData.categoryExpenses}
        />
      </div>

      {/* Recent Transactions + AI */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <RecentTransactions
          transactions={dashboardData.recentTransactions.filter((transaction) => {
            const query = searchQuery.toLowerCase().trim();
            if (!query) return true;
            return [
              transaction.description,
              transaction.category,
              transaction.type,
            ]
              .filter(Boolean)
              .some((field) =>
                String(field).toLowerCase().includes(query)
              );
          })}
        />

        <AIInsights />
      </div>

      {/* Statement Upload */}
      <div className="mt-10">
        <StatementUpload />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;