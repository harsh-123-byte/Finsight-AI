import { useEffect, useState } from "react";
import { Brain, Lightbulb, ShieldAlert, Sparkles, Target, TrendingUp } from "lucide-react";
import api from "../../services/api";

const AIInsights = ({ refreshKey = 0 }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/ai/insights");
        setInsights(response.data.insights || []);
      } catch (err) {
        console.error("AI Insights error", err);
        setError(
          err.response?.data?.message ||
            "Unable to load AI insights. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [refreshKey, retryKey]);

  const iconByType = {
    pattern: TrendingUp,
    anomaly: ShieldAlert,
    opportunity: Lightbulb,
    risk: ShieldAlert,
    recommendation: Target,
  };

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-slate-900 p-6 shadow-xl">
      <div className="mb-6 flex items-center gap-3">
        <Brain className="text-blue-400" />

        <h2 className="text-xl font-bold">AI Insights</h2>
      </div>

      {loading ? (
        <p className="text-slate-400">Generating insights...</p>
      ) : error ? (
        <div>
          <p className="text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => setRetryKey((currentKey) => currentKey + 1)}
            className="mt-4 text-sm font-semibold text-blue-300 hover:text-blue-200"
          >
            Try again
          </button>
        </div>
      ) : insights.length === 0 ? (
        <p className="text-slate-400">
          Add some transactions to generate personalized insights.
        </p>
      ) : (
        <div className="max-h-[36rem] space-y-5 overflow-y-auto pr-2">
          {insights.map((item, idx) => {
            const InsightIcon = iconByType[item.type] || Sparkles;

            return (
            <div key={`${item.title}-${idx}`} className="rounded-xl bg-slate-950 p-4">
              <div className="flex gap-3">
                <InsightIcon className="mt-1 shrink-0 text-blue-400" size={18} />
                <div>
                  <h3 className="font-semibold text-slate-100">{item.title || "Financial insight"}</h3>
                  <p className="mt-1 text-slate-300">{item.text}</p>
                  {item.action && (
                    <p className="mt-3 text-sm text-blue-300">Next step: {item.action}</p>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AIInsights;