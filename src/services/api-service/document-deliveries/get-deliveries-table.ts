import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";
import { ICallAndSetData } from "../interface";

const GET_DELIVERIES_TABLE_URL =
  "/v1/erp-service/document-deliveries/get-deliveries-table";

const getDeliveriesTableApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_DELIVERIES_TABLE_URL,
    setState,
    data
  );
};

export { getDeliveriesTableApi };
