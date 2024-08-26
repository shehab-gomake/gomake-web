import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const PRINT_HOUSE_ADD_MACHINE_URL = '/v1/add-machine';
const PRINT_HOUSE_DUPLICATE_MACHINE_URL = '/v1/duplicate-machine';
const PRINT_HOUSE_UPDATE_MACHINE_URL = '/v1/update-machine';
const PRINT_HOUSE_DELETE_MACHINES_URL = '/v1/delete-machine'
const QUICK_SETUP_ADD_MACHINES_URL = '/v1/machines/quick-setup/add-machines'
const printHouseAddNewMachine: ICallAndSetData = async (callApi, setState, machine) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, PRINT_HOUSE_ADD_MACHINE_URL, setState, machine);
};
const printHouseDuplicateMachine: ICallAndSetData = async (callApi, setState, machine) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, PRINT_HOUSE_DUPLICATE_MACHINE_URL, setState, machine);
};
const printHouseDeleteMachine: ICallAndSetData = async (callApi, setState, id) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, PRINT_HOUSE_DELETE_MACHINES_URL, setState, id);
};
const printHouseUpdateMachine: ICallAndSetData = async (callApi, setState, machine) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, PRINT_HOUSE_UPDATE_MACHINE_URL, setState, machine);
};
const quickSetupAddMachines: ICallAndSetData = async (callApi, setState, machines) => {
    return await getSetApiData(callApi, EHttpMethod.POST, QUICK_SETUP_ADD_MACHINES_URL, setState, machines);
};

export {printHouseAddNewMachine, printHouseDeleteMachine, printHouseUpdateMachine, quickSetupAddMachines, printHouseDuplicateMachine};