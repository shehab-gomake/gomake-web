import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
const GET_EMPLOYEE_URL = '/v1/crm-service/employee/get-all-employees';


const GET_EMPLOYEE_BY_ACTION_ID_URL = '/v1/crm-service/employee/get-employees-by-action-id';
const GET_MACHINE_BY_ACTION_ID_URL = '/v1/machine/get-machine-by-action-id';

const getAndSetEmployees2: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(callApi, EHttpMethod.GET, GET_EMPLOYEE_URL, setState , data); 
}  

const getEmployeesByActionIdApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(callApi, EHttpMethod.GET, GET_EMPLOYEE_BY_ACTION_ID_URL, setState , data); 
}  

const getMachineByActionIdNewApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(callApi, EHttpMethod.GET, GET_MACHINE_BY_ACTION_ID_URL, setState , data); 
}  
export { getAndSetEmployees2,getEmployeesByActionIdApi,getMachineByActionIdNewApi };
