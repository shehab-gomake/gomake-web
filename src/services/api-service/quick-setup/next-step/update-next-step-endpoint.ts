import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const QUICK_SETUP_UPDATE_NEXT_STEP_URL = "/v1/print-house-config/quick-setup/update-next-step";
const quickSetupUpdateNextStep: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(
        callApi,
        EHttpMethod.POST,
        QUICK_SETUP_UPDATE_NEXT_STEP_URL,
        setState,
        data
    );
};

export {quickSetupUpdateNextStep}