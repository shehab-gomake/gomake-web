import getConfig from "next/config";

let config: any = {};
if (getConfig()) {
  const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

  config = {
    api_server: publicRuntimeConfig.API_SERVER || serverRuntimeConfig.API_SERVER,
    erp_server: publicRuntimeConfig.ERP_SERVER || serverRuntimeConfig.ERP_SERVER,
    messaging_server: publicRuntimeConfig.MESSAGING_SERVER || serverRuntimeConfig.MESSAGING_SERVER,
    calculation_server: publicRuntimeConfig.CALCAULATION_SERVER || serverRuntimeConfig.CALCAULATION_SERVER,
    google_place_service: publicRuntimeConfig.GOOGLE_PLACE_SERVICE || serverRuntimeConfig.GOOGLE_PLACE_SERVICE,
    enviroment: publicRuntimeConfig.ENVIROMENT || serverRuntimeConfig.API_SERVER,
    user_app: publicRuntimeConfig.USER_APP_URL || serverRuntimeConfig.USER_APP_URL,
    hs_token: publicRuntimeConfig.HS_TOKEN || serverRuntimeConfig.HS_TOKEN,
    hs_service_name: publicRuntimeConfig.HS_SERVICE_NAME || serverRuntimeConfig.HS_SERVICE_NAME,
    hs_environment: publicRuntimeConfig.HS_ENVIRONMENT || serverRuntimeConfig.HS_ENVIRONMENT,
    MONDAY_API_TOKEN: publicRuntimeConfig.MONDAY_API_TOKEN || serverRuntimeConfig.MONDAY_API_TOKEN,
    MONDAY_BOARD_ID: publicRuntimeConfig.MONDAY_BOARD_ID || serverRuntimeConfig.MONDAY_BOARD_ID,
    TOPICS_GROUP_ID: publicRuntimeConfig.TOPICS_GROUP_ID || serverRuntimeConfig.TOPICS_GROUP_ID,
  };
}

export default config;
