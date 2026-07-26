import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Target,
} from "lucide-react";

import { motion } from "framer-motion";

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: "Total Income",
      value: `₹${summary?.totalIncome?.toLocaleString() || 0}`,
      icon: Wallet,
      color: "from-emerald-500 to-green-600",
    },
    {
      title: "Total Expenses",
      value: `₹${summary?.totalExpense?.toLocaleString() || 0}`,
      icon: TrendingDown,
      color: "from-red-500 to-rose-600",
    },
    {
      title: "Current Balance",
      value: `₹${summary?.balance?.toLocaleString() || 0}`,
      icon: PiggyBank,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Transactions",
      value: summary?.totalTransactions || 0,
      icon: Target,
      color: "from-purple-500 to-indigo-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.12,
              duration: 0.45,
            }}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl"
          >
            <div
              className={`h-2 bg-gradient-to-r ${card.color}`}
            />

            <div className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  {card.value}
                </h2>
              </div>

              <div
                className={`
                  rounded-2xl
                  bg-gradient-to-r
                  ${card.color}
                  p-4
                `}
              >
                <Icon
                  size={30}
                  className="text-white"
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SummaryCards;