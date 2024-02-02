import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
const QUICK_SETUP_GET_MATERIALS_ROUTE =
    "/v1/materials/quick-setup/get-materials";
const quickSetupGetMaterials: ICallAndSetData = async (
    callApi,
    setState,
) => {
    return await getSetApiData(
        callApi,
        EHttpMethod.GET,
        `${QUICK_SETUP_GET_MATERIALS_ROUTE}`,
        setState
    );
};


export {quickSetupGetMaterials};
