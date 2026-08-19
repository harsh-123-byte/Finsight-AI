import api from "./api";

// ==========================================
// Get Complete Dashboard Data
// ==========================================
export const getDashboardData = async () => {
  try {
    const response = await api.get("/dashboard");

    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==========================================
// Upload Bank Statement
// ==========================================
export const uploadStatement = async (formData) => {
  try {
    const response = await api.post(
      "/statement/upload",
      formData
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==========================================
// Get All Transactions
// ==========================================
export const getTransactions = async () => {
  try {
    const response = await api.get("/transactions");

    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==========================================
// Get Gemini Financial Insights
// ==========================================
export const getAIInsights = async () => {
  try {
    const response = await api.get("/ai/insights");

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addTransaction = async (transaction) => {
  const response = await api.post("/transactions", transaction);
  return response.data;
};

export const deleteTransaction = async (transactionId) => {
  const response = await api.delete(`/transactions/${transactionId}`);
  return response.data;
};