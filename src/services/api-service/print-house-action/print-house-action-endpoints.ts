import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

const GET_NUMBER_VALUE_TYPE_PROPERTIES_URL =
  "/v1/printhouse-config/print-house-action/get-number-value-type-properties";

const getNumberValueTypeProperties: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_NUMBER_VALUE_TYPE_PROPERTIES_URL,
    setState
  );
};

export { getNumberValueTypeProperties };

