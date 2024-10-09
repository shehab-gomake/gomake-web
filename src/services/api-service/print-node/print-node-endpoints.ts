import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
const GET_ALL_PRINTERS_FROM_PRINT_NODE_URL = '/v1/print-house-config/products-SKU/get-all-printers-from-print-node';


const getAllPrintersFromPrintNodeApi: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_PRINTERS_FROM_PRINT_NODE_URL, setState);
}


export {getAllPrintersFromPrintNodeApi};