import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import Badge from "../common/Badge";
import Button from "../common/Button";
import Container from "../common/Container";

import MetricCard from "../dashboard/MetricCard";
import ExpenseChart from "../dashboard/ExpenseChart";
import LandingAIInsights from "./LandingAIInsights";

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="
            absolute
            top-20
            left-20
            h-72
            w-72
            rounded-full
            bg-blue-600/20
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-10
            right-10
            h-96
            w-96
            rounded-full
            bg-cyan-500/20
            blur-3xl
          "
        />
      </div>

      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge>✨ AI Powered Finance</Badge>

            <h1 className="mt-6 text-5xl font-black leading-tight lg:text-7xl">
              Track Every
              <span className="text-blue-500"> Rupee.</span>
              <br />
              Predict Every Expense.
            </h1>

            <p className="mt-8 max-w-xl text-lg text-slate-400">
              Upload your bank statements. Analyse spending. Detect
              subscriptions. Receive AI-powered financial insights in seconds.
            </p>

            <div className="mt-10 flex gap-4">
              <Button onClick={handleGetStarted}>Get Started</Button>

              <Button variant="secondary">Watch Demo</Button>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
          >
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              {/* Metric Cards */}
              <div className="grid grid-cols-3 gap-4">
                <MetricCard
                  title="Income"
                  value="₹85K"
                  color="text-green-400"
                />

                <MetricCard
                  title="Expense"
                  value="₹42K"
                  color="text-red-400"
                />

                <MetricCard
                  title="Savings"
                  value="₹43K"
                  color="text-blue-400"
                />
              </div>

              {/* Chart */}
              <ExpenseChart />

              {/* AI Insight */}
              <LandingAIInsights />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;