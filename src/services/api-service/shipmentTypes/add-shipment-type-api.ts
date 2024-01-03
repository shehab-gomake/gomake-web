import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
const ADD_SHIPMENT_TYPE_URL = '/v1/erp-service/shipmentTypes/add-shipment-type';

const addShipmentTypeApi: ICallAndSetData = async (callApi, setState, type) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, ADD_SHIPMENT_TYPE_URL, setState, type);
}
export {addShipmentTypeApi};