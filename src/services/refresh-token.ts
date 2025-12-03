import {
  getRefreshToken,
  updateTokenStorage,
  updateRefreshTokenStorage,
  removeRefreshTokenStorage,
  removeItem,
} from "./storage-data";
import apiRequest from "./api-request";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Export to check if we're currently refreshing (used by apiRequest to prevent loops)
export const getIsRefreshing = () => isRefreshing;

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  // If already refreshing, queue this request
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    // Use apiRequest directly for consistency
    // The refresh endpoint doesn't need Authorization header (uses refresh token in body)
    const result = await apiRequest("POST", "/v1/auth/refresh-token", {
      refreshToken: refreshToken,
    });

    if (!result.success) {
      throw new Error(result.message || "Failed to refresh token");
    }

    // Handle response format: result.data.data.token or result.data.token
    let newAccessToken: string | null = null;
    let newRefreshToken: string | null = null;

    if (result.data?.data?.token) {
      newAccessToken = result.data.data.token;
      newRefreshToken = result.data.data.refreshToken;
    } else if (result.data?.token) {
      newAccessToken = result.data.token;
      newRefreshToken = result.data.refreshToken;
    }

    if (newAccessToken) {
      // Update tokens in storage
      updateTokenStorage(newAccessToken);
      if (newRefreshToken) {
        updateRefreshTokenStorage(newRefreshToken);
      }

      processQueue(null, newAccessToken);
      isRefreshing = false;
      return newAccessToken;
    } else {
      throw new Error("Invalid refresh token response");
    }
  } catch (error: any) {
    // Clear tokens on refresh failure
    removeItem("auth-token");
    removeRefreshTokenStorage();
    processQueue(error, null);
    isRefreshing = false;
    throw error;
  }
};
