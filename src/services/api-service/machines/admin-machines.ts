import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const ADMIN_ADD_MACHINE_URL = '/v1/administrator/add-machine';
const ADMIN_UPDATE_MACHINE_URL = '/v1/administrator/update-machine';
const ADMIN_GET_ALL_MACHINES_URL = '/v1/administrator/machines/category/'
const adminAddNewMachine: ICallAndSetData<any, any> = async (callApi, setState, machine) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.POST, ADMIN_ADD_MACHINE_URL, setState, machine);
}

const adminUpdateMachine: ICallAndSetData<any, any> = async (callApi, setState, machine) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.POST, ADMIN_UPDATE_MACHINE_URL, setState, machine);
}

const adminGetAllMachineByCategory: ICallAndSetData<any, any> = async (callApi, setState, category) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.GET, ADMIN_GET_ALL_MACHINES_URL + category, setState);
}

export {adminAddNewMachine, adminUpdateMachine, adminGetAllMachineByCategory};