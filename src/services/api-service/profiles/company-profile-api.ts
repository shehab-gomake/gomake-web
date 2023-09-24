import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";


const GET_COMPANY_PROFILE_URL = '/v1/get-print-house-profile';
const UPDATE_COMPANY_PROFILE_URL = '/v1/update-print-house-profile';
const UPDATE_COMPANY_LOGO_URL = '/v1/update-print-house-profile-image';
const GET_COMPANY_LOGIN_LOGO_URL = '/v1/get-print-house-login-logo';

const getCompanyProfile: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_COMPANY_PROFILE_URL, setState);
};
const getCompanyLoginLogo: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_COMPANY_LOGIN_LOGO_URL, setState);
};

const updateCompanyProfile: ICallAndSetData = async (callApi, setState, profile) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, UPDATE_COMPANY_PROFILE_URL, setState, profile);
};

const updateCompanyLogo: ICallAndSetData = async (callApi, setState, data) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, UPDATE_COMPANY_LOGO_URL, setState,  data);
};

export {getCompanyProfile, updateCompanyProfile, updateCompanyLogo, getCompanyLoginLogo};