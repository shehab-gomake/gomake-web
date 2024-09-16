import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const IMPORT_MACHINES_URL = '/machines/import-machines';
const IMPORT_MATERIALS_URL = '/v1/materials/import-materials';
const IMPORT_PROFITS_URL = '/v1/print-house-config/profits/import-profits';

const importMachinesApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, IMPORT_MACHINES_URL, setState, data);
}
const importMaterialsApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, IMPORT_MATERIALS_URL, setState, data);
}
const importProfitsApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, IMPORT_PROFITS_URL, setState, data);
}


export {importMachinesApi, importProfitsApi, importMaterialsApi};