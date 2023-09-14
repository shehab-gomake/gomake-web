import axios from "axios";
import config from "@/config";
import { getUserToken } from "./storage-data";
// import { clearStorage } from './storage'
const apiRequest = async (method = "GET", url: string, data: any = {}) => {
  try {
    const SERVER = config.api_server;
    // if(safdsa){
    //     trh
    // }
    //const SERVER = 'http://localhost:3010'
    const reqUrl = SERVER + url;
    const options: any = {
      method,
      url: reqUrl,
      data,
      responseType: "json",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "project-name": "business-dashboard",
        ...(getUserToken() && { "Authorization": "Bearer "+ getUserToken() }),
        ...(data.customAuth && { "auth-token": data.customAuth }),
        lang: "en",
      },
    };
    if (method === "GET") {
      delete options["data"];
      options.params = {
        ...data,
      };
    }
    const response = await axios(options);
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
    return {
      success: false,
      status: err?.response?.status,
      message: err?.response?.data?.message,
      errors: err?.response?.data?.errors,
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
