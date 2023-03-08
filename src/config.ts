import getConfig from "next/config";

let config: any = {};
if (getConfig()) {
  const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

  config = {
    api_server:
      publicRuntimeConfig.API_SERVER || serverRuntimeConfig.API_SERVER,
    google_place_service:
      publicRuntimeConfig.GOOGLE_PLACE_SERVICE ||
      serverRuntimeConfig.GOOGLE_PLACE_SERVICE,
    enviroment: publicRuntimeConfig.ENVIROMENT,
    user_app:
      publicRuntimeConfig.USER_APP_URL || serverRuntimeConfig.USER_APP_URL,
    hs_token: publicRuntimeConfig.HS_TOKEN || serverRuntimeConfig.HS_TOKEN,
    hs_service_name:
      publicRuntimeConfig.HS_SERVICE_NAME ||
      serverRuntimeConfig.HS_SERVICE_NAME,
    hs_environment:
      publicRuntimeConfig.HS_ENVIRONMENT || serverRuntimeConfig.HS_ENVIRONMENT,
  };
}

export default config;
