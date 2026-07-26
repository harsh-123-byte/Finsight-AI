import api from "./api";

export const updateUserSettings = async (settings) => {
  const response = await api.put("/auth/me", settings);
  return response.data;
};
