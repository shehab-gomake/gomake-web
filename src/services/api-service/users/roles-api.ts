import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

const UPDATE_ROLE_NAME_URL = "/v1/crm-service/roles/update-role";
const ADD_NEW_ROLE_URL = "/v1/crm-service/roles/add-roles";
const DELETE_ROLE_URL = "/v1/crm-service/roles/delete-role";
const GET_ALL_ROLES_URL = "/v1/crm-service/roles/get-all-roles-for-table";
const GET_ALL_ROLES_DROPDOWN_URL = "/v1/crm-service/roles/get-all-roles";

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

const getAllRolesApi = async (callApi, callBack) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_ROLES_URL,
    callBack
  );
};

const deleteRoleApi = async (callApi, callBack, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    DELETE_ROLE_URL,
    callBack,
    data
  );
};

const getAllRolesForDropdownApi = async (callApi, callBack) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_ROLES_DROPDOWN_URL,
    callBack
  );
};

export {
  updateRoleNameApi,
  addNewRoleApi,
  deleteRoleApi,
  getAllRolesApi,
  getAllRolesForDropdownApi,
};
