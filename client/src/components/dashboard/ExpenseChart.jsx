import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const ExpenseChart = ({ data }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData =
    data?.map((item) => ({
      month: months[item.month - 1],
      expense: item.totalExpense,
    })) || [];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <h2 className="mb-6 text-xl font-bold">
        Monthly Expense Trend
      </h2>

      <div className="h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id="expenseGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#3B82F6"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="#3B82F6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="month"
              stroke="#94A3B8"
            />

            <YAxis stroke="#94A3B8" />

            <Tooltip
              formatter={(value) => [`₹${value}`, "Expense"]}
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#3B82F6"
              fill="url(#expenseGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;