import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const PRINT_HOUSE_ADD_MACHINE_URL = '/v1/add-machine';
const PRINT_HOUSE_UPDATE_MACHINE_URL = '/v1/update-machine';
const PRINT_HOUSE_DELETE_MACHINES_URL = '/v1/delete-machine'
const printHouseAddNewMachine: ICallAndSetData<any, any> = async (callApi, setState, machine) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.POST, PRINT_HOUSE_ADD_MACHINE_URL, setState, machine);
};
const printHouseDeleteMachine: ICallAndSetData<any, any> = async (callApi, setState, id) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.POST, PRINT_HOUSE_DELETE_MACHINES_URL, setState, id);
};
const printHouseUpdateMachine: ICallAndSetData<any, any> = async (callApi, setState, machine) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.POST, PRINT_HOUSE_UPDATE_MACHINE_URL, setState, machine);
};


export {printHouseAddNewMachine, printHouseDeleteMachine, printHouseUpdateMachine};