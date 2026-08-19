import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
} from "../../services/dashboardService";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: "",
    category: "Others",
    type: "expense",
    amount: "",
  });

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

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleAddTransaction = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const response = await addTransaction({
        ...form,
        amount: Number(form.amount),
      });
      setTransactions((currentTransactions) => [
        response.transaction,
        ...currentTransactions,
      ]);
      setForm({
        date: new Date().toISOString().slice(0, 10),
        description: "",
        category: "Others",
        type: "expense",
        amount: "",
      });
      setShowForm(false);
      toast.success("Transaction added successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add transaction.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      setDeletingId(transactionId);
      await deleteTransaction(transactionId);
      setTransactions((currentTransactions) => (
        currentTransactions.filter((transaction) => transaction._id !== transactionId)
      ));
      toast.success("Transaction deleted successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete transaction.");
    } finally {
      setDeletingId(null);
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
          type="button"
          onClick={() => setShowForm(true)}
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
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleAddTransaction}
            className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Add Transaction</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                aria-label="Close add transaction form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-slate-300">
                Date
                <input
                  required
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                />
              </label>

              <label className="text-sm text-slate-300">
                Type
                <select
                  name="type"
                  value={form.type}
                  onChange={handleFormChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </label>

              <label className="text-sm text-slate-300 sm:col-span-2">
                Description
                <input
                  required
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="e.g. Grocery shopping"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600"
                />
              </label>

              <label className="text-sm text-slate-300">
                Category
                <input
                  required
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                />
              </label>

              <label className="text-sm text-slate-300">
                Amount
                <input
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleFormChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Transaction"}
            </button>
          </form>
        </div>
      )}

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

                  <th className="px-6 py-4 text-right">
                    Action
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

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        disabled={deletingId === transaction._id}
                        className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                        aria-label={`Delete ${transaction.description}`}
                        title="Delete transaction"
                      >
                        <Trash2 size={18} />
                      </button>
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