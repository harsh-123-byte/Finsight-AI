import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F97316",
  "#A855F7",
  "#EF4444",
  "#EAB308",
  "#06B6D4",
];

const CategoryChart = ({ data }) => {
  const chartData =
    data?.map((item) => ({
      name: item.category,
      value: item.amount,
    })) || [];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <h2 className="mb-6 text-xl font-bold">
        Spending Categories
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius="68%"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`₹${value}`, "Amount"]}
            />

            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              wrapperStyle={{
                maxHeight: 72,
                overflowY: "auto",
                overflowX: "hidden",
                paddingTop: 8,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;