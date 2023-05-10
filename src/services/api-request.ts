import axios from "axios";
import config from "@/config";
import {getPrintHouseId, getUserToken} from "./storage-data";
// import { clearStorage } from './storage'
export const apiRequest = async (method = "GET", url: string, data: any = {}, secondServer: boolean = false) => {
    try {
        const SERVER = config.api_server;
        // // if(safdsa){
        // //     trh
        // // }
        // const SERVER = 'http://localhost:3010';
        const SERVER2 = 'http://localhost:5000';
        const reqUrl = secondServer ? SERVER2 + url : SERVER + url;
        const options: any = {
            method,
            url: reqUrl,
            data,
            responseType: "json",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "project-name": "business-dashboard-widget",
                ...(getUserToken() && {"auth-token": getUserToken()}),
                ...(data.customAuth && {"auth-token": data.customAuth}),
                ...(getPrintHouseId() && { "printhouseid": getPrintHouseId() }),
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
                const offlineResponse = await axios(options);
                localStorage.setItem(
                    data?.offline,
                    JSON.stringify(offlineResponse?.data)
                );
            } else {
                localStorage.setItem(data?.offline, JSON.stringify(response?.data));
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

export const getApiRequest = async (url: string, data: any, secondServer?: boolean) => {
    return await apiRequest("GET", url, data, !!secondServer);
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

export const goMakeClientPrintHouseId = async (method = "GET", code: string, data: any = {}) => {
    try {
        const qaHost = 'https://qa.gomake.co.il';
        const reqUrl = "/account/DashBoardLogin?code=" + code;
        const options: any = {
            method,
            url: reqUrl,
            data,
            responseType: "json",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
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
                const offlineResponse = await axios(options);
                localStorage.setItem(
                    data?.offline,
                    JSON.stringify(offlineResponse?.data)
                );
            } else {
                localStorage.setItem(data?.offline, JSON.stringify(response?.data));
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