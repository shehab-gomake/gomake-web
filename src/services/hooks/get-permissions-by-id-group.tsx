import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";

export const getPermissionRolesRelationsByGroupId = async (
    callApi: ICallApi,
    setState?: ISetState,
    data?: any
  ) => {
    const result: any = await callApi(
      "GET",
      "/v1/crm-service/permissions/get-permissions-group-byID",
      data
    );
    return returnResult(result, setState);
  };