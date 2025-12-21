// lib/api.js
import { axiosInstance } from "./axios";

/* -------------------- AUTH APIs -------------------- */
export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

/* -------------------- USER & FRIEND APIs -------------------- */
export const getUserFriends = async () => {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
};

export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const getOutgoingFriendReqs = async () => {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
};

export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
};

export const getFriendRequests = async () => {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
};

export const acceptFriendRequest = async (requestId) => {
  const response = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  return response.data;
};

export const dismissSuggestedUser = async (userId) => {
  try {
    const response = await axiosInstance.post(`/users/dismiss/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error dismissing suggested user:",
      error?.response?.data || error?.message
    );
    throw error;
  }
};

/* -------------------- CHAT TOKEN -------------------- */
export const getStreamToken = async () => {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
};

/* -------------------- AI RECOMMENDATIONS -------------------- */
export const getAIRecommendations = async () => {
  try {
    const response = await axiosInstance.get("/ai/recommend");

    if (!response.data || !Array.isArray(response.data)) {
      console.warn("Groq AI returned unexpected data:", response.data);
      return [];
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching AI Recommendations:",
      error?.response?.data || error?.message
    );
    throw error;
  }
};
