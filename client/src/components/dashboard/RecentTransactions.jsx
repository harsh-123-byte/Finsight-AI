const RecentTransactions = ({ transactions = [] }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-4 text-xl font-bold">Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-slate-400">No transactions found.</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction._id || transaction.id}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-100">
                    {transaction.description || "No description"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(transaction.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {transaction.category ? ` • ${transaction.category}` : ""}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${
                      transaction.type === "income"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₹
                    {Number(transaction.amount || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {transaction.type || "expense"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;