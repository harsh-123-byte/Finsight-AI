import { useEffect, useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getTransactions } from "../../services/dashboardService";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await getTransactions();

      setTransactions(response.transactions);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Transactions
          </h1>

          <p className="mt-2 text-slate-400">
            Manage all your income and expenses.
          </p>
        </div>

        <button
          className="
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-semibold
            transition
            hover:bg-blue-700
          "
        >
          + Add Transaction
        </button>
      </div>

      <div className="mt-10">
        {loading && (
          <p className="text-center">
            Loading Transactions...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left">
                    Description
                  </th>

                  <th className="px-6 py-4 text-left">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left">
                    Type
                  </th>

                  <th className="px-6 py-4 text-right">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b border-slate-800 hover:bg-slate-800"
                  >
                    <td className="px-6 py-4">
                      {new Date(
                        transaction.date
                      ).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-6 py-4">
                      {transaction.description}
                    </td>

                    <td className="px-6 py-4">
                      {transaction.category}
                    </td>

                    <td className="px-6 py-4 capitalize">
                      {transaction.type}
                    </td>

                    <td
                      className={`px-6 py-4 text-right font-semibold ${
                        transaction.type === "income"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.type === "income"
                        ? "+"
                        : "-"}
                      ₹
                      {transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transactions;