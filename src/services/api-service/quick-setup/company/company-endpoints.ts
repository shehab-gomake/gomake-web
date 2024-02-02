import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const CREATE_NEW_COMPANY_URL = "/v1/quick-setup/company";
const createNewCompanyApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(
        callApi,
        EHttpMethod.POST,
        CREATE_NEW_COMPANY_URL,
        setState,
        data
    );
};

export {createNewCompanyApi}