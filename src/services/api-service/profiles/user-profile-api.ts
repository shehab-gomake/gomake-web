import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";


const GET_USER_PROFILE_URL = '/v1/crm-service/users/get-user/34D57E82-5236-43BC-BB0D-5B8E95129617';
const UPDATE_USER_PROFILE_URL = '/v1/crm-service/update-user-profile';
const UPDATE_USER_LOGO_URL = '/v1/crm-service/update-user-profile-image';
const RESET_USER_PASSWORD = '/v1/crm-service/reset-user-password';
const UPDATE_USER_INITIALS = '/v1/crm-service/update-user-initials';
const getUserProfile: ICallAndSetData<any, any> = async (callApi, setState) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.GET, GET_USER_PROFILE_URL , setState);
};

const updateUserProfile: ICallAndSetData<any, any> = async (callApi, setState, profile) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.POST, UPDATE_USER_PROFILE_URL, setState, profile);
};

const updateUserProfileImage: ICallAndSetData<any, any> = async (callApi, setState, data) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.POST, UPDATE_USER_LOGO_URL, setState,  data);
};

const resetUserPassword: ICallAndSetData<any, any> = async (callApi, setState, data) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.POST, RESET_USER_PASSWORD, setState,  data);
};
const resetUserInitials: ICallAndSetData<any, any> = async (callApi, setState, data) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.POST, UPDATE_USER_INITIALS, setState,  data);
};

export {getUserProfile, updateUserProfile, updateUserProfileImage, resetUserPassword, resetUserInitials};