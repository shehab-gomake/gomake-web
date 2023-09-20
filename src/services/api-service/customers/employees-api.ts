import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
const GET_EMPLOYEE_URL = '/v1/employee/get-all-employees2';

const getAndSetEmployees2: ICallAndSetData = async (callApi, setState, data: {isAgent: boolean}) => {
  return await getSetApiData(callApi, EHttpMethod.GET, GET_EMPLOYEE_URL, setState , data); 
}  
export { getAndSetEmployees2 };
