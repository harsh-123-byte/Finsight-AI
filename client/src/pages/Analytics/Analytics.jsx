import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getDashboardData } from "../../services/dashboardService";

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: {},
    monthlyExpenses: [],
    categoryExpenses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await getDashboardData();
        setDashboardData({
          summary: response.summary || {},
          monthlyExpenses: response.monthlyExpenses || [],
          categoryExpenses: response.categoryExpenses || [],
        });
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Analytics</h1>
          <p className="mt-2 text-slate-400">
            Deep insights into your spending patterns and trends.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 text-center text-lg">
          Loading analytics...
        </div>
      ) : error ? (
        <div className="mt-10 text-center text-red-500">{error}</div>
      ) : (
        <div className="mt-10 space-y-8">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h2 className="text-2xl font-semibold">Summary</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-3xl bg-slate-950 p-6">
                <p className="text-sm text-slate-400">Total Income</p>
                <p className="mt-3 text-3xl font-semibold text-green-400">
                  ₹{dashboardData.summary.totalIncome?.toLocaleString() || 0}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-950 p-6">
                <p className="text-sm text-slate-400">Total Expense</p>
                <p className="mt-3 text-3xl font-semibold text-red-400">
                  ₹{dashboardData.summary.totalExpense?.toLocaleString() || 0}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-950 p-6">
                <p className="text-sm text-slate-400">Balance</p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  ₹{dashboardData.summary.balance?.toLocaleString() || 0}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-950 p-6">
                <p className="text-sm text-slate-400">Transactions</p>
                <p className="mt-3 text-3xl font-semibold text-blue-400">
                  {dashboardData.summary.totalTransactions || 0}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h2 className="text-2xl font-semibold">Category Breakdown</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {dashboardData.categoryExpenses.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                  No category expense data available.
                </div>
              ) : (
                dashboardData.categoryExpenses.map((item) => (
                  <div
                    key={item.category}
                    className="rounded-3xl bg-slate-950 p-6"
                  >
                    <p className="text-sm text-slate-400">{item.category}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      ₹{item.amount?.toLocaleString() || 0}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h2 className="text-2xl font-semibold">Trend Highlights</h2>
            <p className="mt-4 text-slate-400">
              Your spending trends are updated automatically from your transaction history.
            </p>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Analytics;
