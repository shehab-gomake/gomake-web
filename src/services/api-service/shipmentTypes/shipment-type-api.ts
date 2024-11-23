import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";
const DELETE_SHIPMENT_TYPE_BY_ID_URL =
  "/v1/erp-service/shipmentTypes/delete-shipment-type";

const ADD_SHIPMENT_TYPE_URL = "/v1/erp-service/shipmentTypes/add-shipment-type";
const GET_ALL_SHIPMENT_TYPES_URL =
  "/v1/erp-service/shipmentTypes/get-shipment-types";

const addShipmentTypeApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_SHIPMENT_TYPE_URL,
    setState,
    data
  );
};

const getAllShipmentTypesApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_SHIPMENT_TYPES_URL,
    setState
  );
};

const deleteShipmentTypeByIdApi: ICallAndSetData = async (
  callApi,
  setState,
  id
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    DELETE_SHIPMENT_TYPE_BY_ID_URL,
    setState,
    id
  );
};

export {
  addShipmentTypeApi,
  getAllShipmentTypesApi,
  deleteShipmentTypeByIdApi,
};
