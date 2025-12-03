import axios, { AxiosRequestConfig, ResponseType, AxiosError } from "axios";
import config from "@/config";
import { getTempUserToken, getUserToken } from "./storage-data";
import log from "@/utils/logger";
import { addRequestToSession } from "@/utils/sessionManager";
import { refreshAccessToken, getIsRefreshing } from "./refresh-token";
// import { clearStorage } from './storage'

const apiRequest = async (
  method = "GET",
  url: string,
  data: any = {},
  language?: string,
  requestAbortController?: AbortController,
  responseType: ResponseType = undefined
) => {
  try {
    //please don't change the server url!!!
    const SERVER = config.api_server;
    const reqUrl = SERVER + url;
    const controller = new AbortController();
    let userToken = getUserToken();
    if (!userToken) {
      userToken = getTempUserToken();
    }

    // Don't add Authorization header for refresh token endpoint (it uses refresh token in body)
    const isRefreshEndpoint = url.includes("/v1/auth/refresh-token");

    const options: AxiosRequestConfig = {
      method,
      url: reqUrl,
      data,
      responseType: responseType ?? "json",
      signal: requestAbortController?.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "project-name": "business-dashboard",
        ...(!isRefreshEndpoint &&
          userToken && { Authorization: "Bearer " + userToken }),
        ...(data.customAuth && { "auth-token": data.customAuth }),
        lang: "en",
        domain: "",
      },
    };
    if (method === "GET") {
      delete options["data"];
      options.params = {
        ...data,
      };
    }

    // log.info("Starting Request", options);
    addRequestToSession({ method, url, data, options });

    const response = await axios(options);
    // log.info("Response:", response);
    addRequestToSession({ method, url, data, options, response });

    if (response) {
      if (method === "GET") {
        delete options["data"];
        options.params = {
          ...data,
        };
      }
      return {
        success: true,
        status: response?.status,
        message: response?.data?.message,
        data: response?.data,
      };
    }
  } catch (err: any) {
    const axiosError = err as AxiosError;

    // Handle 401 Unauthorized - try to refresh token
    // Skip refresh if we're already refreshing (prevents infinite loop)
    // Skip refresh if this is the refresh token endpoint itself
    const isRefreshEndpoint = url.includes("/v1/auth/refresh-token");
    if (
      axiosError.response?.status === 401 &&
      getUserToken() &&
      !getIsRefreshing() &&
      !isRefreshEndpoint
    ) {
      try {
        // Attempt to refresh the token
        const newToken = await refreshAccessToken();

        if (newToken) {
          // Reconstruct request options for retry
          const SERVER = config.api_server;
          const reqUrl = SERVER + url;
          const retryOptions: AxiosRequestConfig = {
            method,
            url: reqUrl,
            data: method !== "GET" ? data : undefined,
            params: method === "GET" ? data : undefined,
            responseType: responseType ?? "json",
            signal: requestAbortController?.signal,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "project-name": "business-dashboard",
              Authorization: "Bearer " + newToken,
              ...(data.customAuth && { "auth-token": data.customAuth }),
              lang: "en",
              domain: "",
            },
          };

          const retryResponse = await axios(retryOptions);
          addRequestToSession({
            method,
            url,
            data,
            options: retryOptions,
            response: retryResponse,
          });

          return {
            success: true,
            status: retryResponse?.status,
            message: retryResponse?.data?.message,
            data: retryResponse?.data,
          };
        }
      } catch (refreshError) {
        log.error("Token refresh failed", refreshError);
        // If refresh fails, continue to return the original error
      }
    }

    log.error("Request Error", err);
    addRequestToSession({ method, url, data, error: err });

    return {
      success: false,
      status: err?.response?.status,
      message: err?.response?.data?.error?.ErrorMessage,
      errors: err?.response?.data?.error,
      msg: err?.response?.data?.message,
      statusCode: err?.response?.data?.error?.statusCode,
    };
  }
};

export const getApiRequest = async (url: string, data: any) => {
  return await apiRequest("GET", url, data);
};
export const postApiRequest = async (url: string, data: any) => {
  return await apiRequest("POST", url, data);
};
export const putApiRequest = async (url: string, data: any) => {
  return await apiRequest("PUT", url, data);
};
export const patchApiRequest = async (url: string, data: any) => {
  return await apiRequest("PATCH", url, data);
};
export const deleteApiRequest = async (url: string, data: any = {}) => {
  return await apiRequest("DELETE", url, data);
};

export default apiRequest;
