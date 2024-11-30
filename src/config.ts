import getConfig from "next/config";

let config = {
    api_server: process.env.NEXT_PUBLIC_API_SERVER,
    erp_server: process.env.NEXT_PUBLIC_ERP_SERVER,
    enviroment: process.env.NEXT_PUBLIC_ENVIROMENT,
};

export default config;
