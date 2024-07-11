import axios, { AxiosRequestConfig, ResponseType } from "axios";
import config from "@/config";
import { getUserToken } from "./storage-data";
import log from "@/utils/logger";
import { addRequestToSession } from "@/utils/sessionManager";

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
        ...(getUserToken() && { Authorization: "Bearer " + getUserToken() }),
        ...(data.customAuth && { "auth-token": data.customAuth }),
        lang: language ? language : "en",
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
    log.error("Request Error", err);
    addRequestToSession({ method, url, data, error: err });

    // const summary = "API request error";
    // const description = `An error occurred during an API request:\n\nRequest: ${JSON.stringify(err.config)}\n\nResponse: ${
    //   err.response ? JSON.stringify(err.response) : "No response"
    // }`;

    // await createJiraIssue(summary, description).catch(error => {
    //   log.error('Failed to create Jira issue:', error);
    // });

    // console.log("summary, description", summary, description);

    return {
      success: false,
      status: err?.response?.status,
      message: err?.response?.data?.message,
      errors: err?.response?.data?.error?.error,
      msg: err?.response?.data?.msg,
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
