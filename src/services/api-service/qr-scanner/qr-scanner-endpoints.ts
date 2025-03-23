import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";
import { ICallAndSetData } from "../interface";
const GET_ORDER_ID_FROM_QR_CODE = "/v1/erp-service/Orders/GetOrderIdFromQrCode";

const getOrderIdFromQrCode: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ORDER_ID_FROM_QR_CODE,
    setState,
    data
  );
};

export { getOrderIdFromQrCode };
