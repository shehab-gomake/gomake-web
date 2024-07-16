import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
const GET_EMPLOYEE_URL = '/v1/crm-service/employee/get-all-employees';

const getAndSetEmployees2: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(callApi, EHttpMethod.GET, GET_EMPLOYEE_URL, setState , data); 
}  
export { getAndSetEmployees2 };
