import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

const UPDATE_PERMISSION_URL =
  "/v1/crm-service/RolesPermissionsRelationships/UpdateRolesPermissionsRelationship";
const GROUP_PERMISSIONS_RELATIONS_URL =
  "/v1/crm-service/Permissions/get-permissions-group-byID";
const GET_ALL_PERMISSIONS_ROLES_GROUPS_URL =
  "/v1/crm-service/permissionsRolesRealtionship/get-all-permission-roles-relation";

const updatePermissionApi: ICallAndSetData = async (
  callApi,
  callBack,
  data,
  lock
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_PERMISSION_URL,
    callBack,
    data,
    lock
  );
};
const getPermissionRolesRelationsByGroupIdApi = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GROUP_PERMISSIONS_RELATIONS_URL,
    callBack,
    data
  );
};
const getAllPermissionRolesRelationsApi = async (callApi, callBack) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_PERMISSIONS_ROLES_GROUPS_URL,
    callBack
  );
};

export {
  updatePermissionApi,
  getPermissionRolesRelationsByGroupIdApi,
  getAllPermissionRolesRelationsApi,
};
