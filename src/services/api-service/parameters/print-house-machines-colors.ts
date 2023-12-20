import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const GET_PRINT_COLORS__PARAMETER_VALUES_URL = '/v1/print-house-config/parameters/print-colors';
const getPrintColorsParametersValues: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_PRINT_COLORS__PARAMETER_VALUES_URL, setState);
};

export {getPrintColorsParametersValues};