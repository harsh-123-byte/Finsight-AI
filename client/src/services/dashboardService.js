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