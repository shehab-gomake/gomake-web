import { ICallApi, ISetState } from "./call-api.interface";
import { returnResult } from "@/utils/helpers";

const getAndSetRoles = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/crm-service/roles/get-all-roles", data);
  return returnResult(result, setState);
};
const getAndSetPermissions = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/crm-service/permissions/get-all-permissions", data);
  return returnResult(result, setState);
};
const getAndSetPermissionsRolesRelation = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any

)=>{
  const result: any = await callApi("GET", "/v1/crm-service/permissionsRolesRealtionship/get-all-permission-roles-relation", data);
  return returnResult(result, setState);
};

export {
  getAndSetRoles,
  getAndSetPermissions,
  getAndSetPermissionsRolesRelation
};
