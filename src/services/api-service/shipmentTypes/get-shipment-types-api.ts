import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
const GET_ALL_SHIPMENT_TYPES_URL = '/v1/erp-service/shipmentTypes/get-shipment-types';

const getAllShipmentTypesApi: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_SHIPMENT_TYPES_URL, setState)
}

export {
    getAllShipmentTypesApi,
};