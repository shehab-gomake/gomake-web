import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const UPDATE_PERMISSION_URL = '/v1/crm-service/RolesPermissionsRelationships/UpdateRolesPermissionsRelationship';
const updatePermissionApi: ICallAndSetData = async (callApi, callBack) => {
    return  await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_PERMISSION_URL, callBack)
}

export {updatePermissionApi}