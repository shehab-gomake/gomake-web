import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

const ADD_CLIENT_GROUP_URL = "/v1/crm-service/customer/add-client-group";
const DELETE_CLIENT_GROUP_URL = "/v1/crm-service/clients/delete-client-group";
const UPDATE_CLIENT_GROUP_URL = "/v1/crm-service/clients/update-client-group";

const addClientGroupApi: ICallAndSetData = async (
  callApi,
  setState,
  data: {
    groupName: string;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_CLIENT_GROUP_URL,
    setState,
    data
  );
};

const deleteClientGroupApi: ICallAndSetData = async (
  callApi,
  setState,
  data: {
    groupName: string;
    id: string;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    DELETE_CLIENT_GROUP_URL,
    setState,
    data
  );
};

const updateClientGroupApi: ICallAndSetData = async (
  callApi,
  setState,
  id: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_CLIENT_GROUP_URL,
    setState,
    id
  );
};

export { deleteClientGroupApi, updateClientGroupApi, addClientGroupApi };
