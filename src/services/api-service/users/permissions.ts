import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

const UPDATE_PERMISSION_URL =
  "/v1/crm-service/RolesPermissionsRelationships/UpdateRolesPermissionsRelationship";
const GROUP_PERMISSIONS_RELATIONS_URL =
  "/v1/crm-service/Permissions/get-permissions-group-byID";
const GET_ALL_PERMISSIONS_ROLES_GROUPS_URL =
  "/v1/crm-service/permissionsRolesRealtionship/get-all-permission-roles-relation";
const UPDATE_ROLE_NAME_URL = "/v1/crm-service/roles/update-role";
const ADD_NEW_ROLE_URL = "/v1/crm-service/roles/add-roles";
const updatePermissionApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_PERMISSION_URL,
    callBack,
    data
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

const updateRoleNameApi = async (callApi, callBack, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_ROLE_NAME_URL,
    callBack,
    data
  );
};
const addNewRoleApi = async (callApi, callBack, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_NEW_ROLE_URL,
    callBack,
    data
  );
};
export {
  updatePermissionApi,
  getPermissionRolesRelationsByGroupIdApi,
  getAllPermissionRolesRelationsApi,
  updateRoleNameApi,
  addNewRoleApi,
};
