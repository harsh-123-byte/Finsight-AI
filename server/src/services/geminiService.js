const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

const getResponseText = (data) => {
  return data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();
};

const parseInsights = (text) => {
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  const jsonText = text.replace(/^```json\s*|\s*```$/g, "").trim();
  const parsed = JSON.parse(jsonText);

  if (!Array.isArray(parsed.insights)) {
    throw new Error("Gemini returned an invalid insights format");
  }

  return parsed.insights
    .filter((insight) => insight && typeof insight === "object")
    .map((insight) => ({
        title: String(insight.title || "Financial observation").trim(),
        text: String(insight.text || insight.explanation || "").trim(),
        action: String(insight.action || "").trim(),
        type: String(insight.type || "observation").trim(),
      }))
    .filter((insight) => insight.text.length > 0)
    .filter((insight, index, allInsights) => (
      allInsights.findIndex((candidate) => candidate.text === insight.text) === index
    ));
};

const parseTransactions = (text) => {
  if (!text) {
    throw new Error("Gemini returned an empty transaction response");
  }

  const jsonText = text.replace(/^```json\s*|\s*```$/g, "").trim();
  const parsed = JSON.parse(jsonText);

  if (!Array.isArray(parsed.transactions)) {
    throw new Error("Gemini returned an invalid transaction format");
  }

  return parsed.transactions
    .map((transaction) => ({
      date: new Date(transaction.date),
      description: String(transaction.description || "Statement transaction").trim(),
      amount: Math.abs(Number(transaction.amount)),
      category: String(transaction.category || "Others").trim(),
      type: transaction.type === "income" ? "income" : "expense",
    }))
    .filter((transaction) => (
      !Number.isNaN(transaction.date.getTime()) &&
      transaction.description &&
      Number.isFinite(transaction.amount) &&
      transaction.amount > 0
    ));
};

const requestGemini = async (model, apiKey, body) => {
  const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const providerMessage = data.error?.message || "";
    const modelUnavailable = /model.*(not found|not supported|invalid)|unknown model/i.test(
      providerMessage
    );

    if ((response.status === 400 || response.status === 404) && modelUnavailable && model !== "gemini-2.5-flash") {
      return requestGemini("gemini-2.5-flash", apiKey, body);
    }

    const error = new Error(providerMessage || "Gemini request failed");
    error.statusCode = response.status === 429
      ? 429
      : response.status >= 500
      ? 502
      : 503;
    throw error;
  }

  return getResponseText(data);
};

export const generateGeminiTransactions = async (statementText) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error("GEMINI_API_KEY is not configured");
    error.statusCode = 503;
    throw error;
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const text = await requestGemini(model, apiKey, {
      systemInstruction: {
        parts: [{
          text: "You extract every bank statement transaction. Return only valid JSON in the format {\"transactions\":[{\"date\":\"YYYY-MM-DD\",\"description\":\"...\",\"amount\":0,\"category\":\"...\",\"type\":\"income|expense\"}]}. Preserve every row and never skip valid transactions. For statements where Amount is positive and Type is Credit or Debit, map Credit exactly to income and Debit exactly to expense; do not infer the type from the amount sign in that case. Credit means money received, Debit means money spent. Interpret signed amounts only when no credit/debit type is present. Preserve the absolute amount, original category, and currency context. Do not invent missing transactions. Normalize categories only when no category is provided.",
        }],
      },
      contents: [{
        role: "user",
        parts: [{ text: `Extract every transaction from this complete uploaded statement:\n${statementText}` }],
      }],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

  return parseTransactions(text);
};

export const generateGeminiInsights = async (financialData) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error("GEMINI_API_KEY is not configured");
    error.statusCode = 503;
    throw error;
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const text = await requestGemini(model, apiKey, {
      systemInstruction: {
        parts: [{
          text: "You are an analytical personal finance coach. Produce every useful, genuinely personalized insight supported by ALL supplied transactions, not generic budgeting tips. Never invent data, and do not provide regulated financial advice. Return only valid JSON in this format: {\"insights\":[{\"type\":\"pattern|anomaly|opportunity|risk|recommendation\",\"title\":\"Short specific title\",\"text\":\"Evidence-based explanation with relevant amounts, dates, categories, or merchant descriptions\",\"action\":\"One concrete next step\"}]}. Include every distinct insight the data justifies. There is no fixed minimum or maximum: do not stop at 9 insights or any other arbitrary count, and do not summarize multiple unrelated findings into one item. Avoid greetings, disclaimers, repeated totals, and statements that merely restate the dashboard. Cover non-obvious patterns, anomalies, recurring behavior, opportunities, risks, and connections to the user's budget or savings goal when the data supports them. Make every insight materially different from the others.",
        }],
      },
      contents: [{
        role: "user",
        parts: [{ text: `Analyze this user's recent financial data. Current request timestamp: ${new Date().toISOString()}\n${JSON.stringify(financialData)}` }],
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 16384,
        responseMimeType: "application/json",
      },
  });

  return parseInsights(text);
};

export const generateFallbackInsights = (transactions, currency = "INR") => {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
  const expenses = transactions
    .filter((transaction) => transaction.type !== "income")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
  const categoryTotals = transactions
    .filter((transaction) => transaction.type !== "income")
    .reduce((totals, transaction) => {
      const category = transaction.category || "Others";
      totals[category] = (totals[category] || 0) + Number(transaction.amount || 0);
      return totals;
    }, {});
  const topCategory = Object.entries(categoryTotals).sort(([, first], [, second]) => second - first)[0];
  const largestExpense = transactions
    .filter((transaction) => transaction.type !== "income")
    .sort((first, second) => Number(second.amount || 0) - Number(first.amount || 0))[0];
  const formatAmount = (amount) => `${currency} ${amount.toLocaleString()}`;
  const insights = [];

  if (income > 0 || expenses > 0) {
    insights.push({
      type: expenses > income ? "risk" : "pattern",
      title: expenses > income ? "Expenses are above income" : "Cash flow is positive",
      text: `Recorded income is ${formatAmount(income)} and expenses are ${formatAmount(expenses)} across your transactions.`,
      action: expenses > income ? "Review your largest expense categories this month." : "Keep monitoring expenses to protect your surplus.",
    });
  }

  if (topCategory) {
    insights.push({
      type: "pattern",
      title: `${topCategory[0]} is your top spending category`,
      text: `You have spent ${formatAmount(topCategory[1])} in ${topCategory[0]}, more than any other recorded category.`,
      action: `Set a spending limit for ${topCategory[0]} and review it weekly.`,
    });
  }

  if (largestExpense) {
    insights.push({
      type: "opportunity",
      title: "Review your largest expense",
      text: `${largestExpense.description} is your largest recorded expense at ${formatAmount(Number(largestExpense.amount || 0))}.`,
      action: "Check whether this expense is recurring or can be reduced.",
    });
  }

  return insights;
};