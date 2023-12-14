import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const GET_PRINT_HOUSE_SUPPLIERS_URL = '/v1/suppliers/get-suppliers';
const GET_OUTSOURCING_SUPPLIERS_URL = '/v1/erp-service/outsource/get-suppliers';

const getPrintHouseSuppliersListApi: ICallAndSetData<any, any> = async (callApi, setState) => {
    return await getSetApiData<any>(callApi, EHttpMethod.GET, GET_PRINT_HOUSE_SUPPLIERS_URL, setState);
}

const getOutsourcingSuppliersListApi: ICallAndSetData<any, any> = async (callApi, setState, data) => {
    return await getSetApiData<any>(callApi, EHttpMethod.POST, GET_OUTSOURCING_SUPPLIERS_URL, setState, data);
}


export {getPrintHouseSuppliersListApi, getOutsourcingSuppliersListApi}
