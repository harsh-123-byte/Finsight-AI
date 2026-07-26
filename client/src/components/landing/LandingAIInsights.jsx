const LandingAIInsights = () => {
  const dummyInsights = [
    "Seed your financial habits with AI-powered spending summaries.",
    "Track recurring subscriptions, manage bills, and spot savings opportunities.",
    "See how smart categorization helps you control monthly expenses.",
    "Turn every transaction into action with instant budgeting hints.",
  ];

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-slate-900 p-6 shadow-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-blue-500/10 p-2 text-blue-400">
          AI
        </div>
        <h2 className="text-xl font-bold">AI Insights</h2>
      </div>

      <div className="space-y-5">
        {dummyInsights.map((text, idx) => (
          <div key={idx} className="flex gap-4 rounded-xl bg-slate-950 p-4">
            <p className="text-slate-300">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingAIInsights;
