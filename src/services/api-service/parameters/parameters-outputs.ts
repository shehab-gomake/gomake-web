import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const GET_ALL_PARAMETERS_URL = '/v1/printhouse-config/parameters/get-all-parameters';
const GET_ALL_OUTPUTS_URL = '/v1/printhouse-config/Output/get-all-Outputs';


const getAllParameters: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_PARAMETERS_URL, setState);
};
const getAllOutputs: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_OUTPUTS_URL, setState);
};

export {getAllParameters, getAllOutputs};