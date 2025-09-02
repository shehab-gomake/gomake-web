import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const PRINT_HOUSE_ADD_MACHINE_URL = "/v1/add-machine";
const PRINT_HOUSE_DUPLICATE_MACHINE_URL = "/v1/duplicate-machine";
const PRINT_HOUSE_UPDATE_MACHINE_URL = "/v1/update-machine";
const PRINT_HOUSE_DELETE_MACHINES_URL = "/v1/delete-machine";
const QUICK_SETUP_ADD_MACHINES_URL = "/quick-setup-add-machines";
const GET_ALL_PRINT_HOUSE_MACHINES_URL = "/v1/machines/get-all";
const GET_CONNECTED_MACHINES_URL = "/v1/machines/get-connected-machines/";
const UPDATE_CONNECTED_MACHINES_URL = "/v1/machines/update-connected-machines/";
const GET_CATEGORY_MACHINES_LIST_URL = "/v1/machines-list/category/";

const GET_PRINT_HOUSE_MACHINE_CATEGORIES_URL =
  "/v1/machines/get-print-house-machine-categories";
const TOGGLE_PRINT_HOUSE_MACHINE_CATEGORY_URL =
  "/v1/machines/toggle-print-house-machine-category";

const printHouseAddNewMachine: ICallAndSetData = async (
  callApi,
  setState,
  machine
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    PRINT_HOUSE_ADD_MACHINE_URL,
    setState,
    machine
  );
};
const printHouseDuplicateMachine: ICallAndSetData = async (
  callApi,
  setState,
  machine
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    PRINT_HOUSE_DUPLICATE_MACHINE_URL,
    setState,
    machine
  );
};
const printHouseDeleteMachine: ICallAndSetData = async (
  callApi,
  setState,
  id
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    PRINT_HOUSE_DELETE_MACHINES_URL,
    setState,
    id
  );
};
const printHouseUpdateMachine: ICallAndSetData = async (
  callApi,
  setState,
  machine
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    PRINT_HOUSE_UPDATE_MACHINE_URL,
    setState,
    machine
  );
};
const quickSetupAddMachines: ICallAndSetData = async (
  callApi,
  setState,
  machines
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    QUICK_SETUP_ADD_MACHINES_URL,
    setState,
    machines
  );
};
const getAllPrintHouseMachines: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_PRINT_HOUSE_MACHINES_URL,
    setState
  );
};
const getMachineConnectedMachines: ICallAndSetData = async (
  callApi,
  setState,
  machineId
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_CONNECTED_MACHINES_URL + machineId,
    setState
  );
};
const updateMachineConnectedMachines: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_CONNECTED_MACHINES_URL,
    setState,
    data
  );
};
const getCategoryMachinesList: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_CATEGORY_MACHINES_LIST_URL + data,
    setState
  );
};
const togglePrintHouseMachineCategory: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    TOGGLE_PRINT_HOUSE_MACHINE_CATEGORY_URL,
    setState,
    data
  );
};
const getPrintHouseMachineCategories: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRINT_HOUSE_MACHINE_CATEGORIES_URL,
    setState
  );
};

export {
  printHouseAddNewMachine,
  printHouseDeleteMachine,
  printHouseUpdateMachine,
  quickSetupAddMachines,
  printHouseDuplicateMachine,
  getAllPrintHouseMachines,
  getMachineConnectedMachines,
  updateMachineConnectedMachines,
  getCategoryMachinesList,
  togglePrintHouseMachineCategory,
  getPrintHouseMachineCategories,
};
