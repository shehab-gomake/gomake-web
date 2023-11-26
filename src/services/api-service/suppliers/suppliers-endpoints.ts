import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const GET_PRINT_HOUSE_SUPPLIERS_URL = '/v1/suppliers/get-suppliers';

const getPrintHouseSuppliersListApi: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_PRINT_HOUSE_SUPPLIERS_URL, setState);
}


export {getPrintHouseSuppliersListApi}
