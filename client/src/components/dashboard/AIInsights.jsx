import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import api from "../../services/api";

const AIInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await api.get("/ai/insights");
        setInsights(response.data.insights || []);
      } catch (err) {
        console.error("AI Insights error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-slate-900 p-6 shadow-xl">
      <div className="mb-6 flex items-center gap-3">
        <Brain className="text-blue-400" />

        <h2 className="text-xl font-bold">AI Insights</h2>
      </div>

      {loading ? (
        <p className="text-slate-400">Generating insights...</p>
      ) : insights.length === 0 ? (
        <p className="text-slate-400">No insights available yet.</p>
      ) : (
        <div className="space-y-5">
          {insights.map((item, idx) => (
            <div key={idx} className="flex gap-4 rounded-xl bg-slate-950 p-4">
              <p className="text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInsights;