import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const GET_MACHINES_COLORS_URL = '/v1/materials/get-machines-colors';
const getPrintHouseMachineColors: ICallAndSetData = async (callApi, setState, machineId) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, `${GET_MACHINES_COLORS_URL}?machineId=${machineId}`, setState);
};



export {getPrintHouseMachineColors};