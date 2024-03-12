import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
import {Employee} from "@/widgets/settings-users/users/interface/employee";

const GET_ALL_USERS_URL = '/v1/crm-service/employee/get-employees';
const GET_EMPLOYEE_BY_ID_URL = '/v1/crm-service/employee/get-employee/';
const TOGGLE_USER_STATUS_URL = '/v1/crm-service/employee/toggle-employee-active/';
const ADD_NEW_EMPLOYEE_URL = '/v1/crm-service/employee/add-employee';
const UPDATE_EMPLOYEE_URL = '/v1/crm-service/employee/update-employee';
const INACTIVE_USER_FIRST_LOGIN_URL = '/v1/crm-service/users/inactive-first-login';
const getAllUsersApi: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_USERS_URL, setState)
}

const getEmployeeApi: ICallAndSetData = async (callApi, setState,id: string) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_EMPLOYEE_BY_ID_URL + id, setState);
}
const toggleEmployeeStatus: ICallAndSetData = async (callApi, setState, userId: string) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, TOGGLE_USER_STATUS_URL + userId, setState);
}
const addNewEmployee: ICallAndSetData = async (callApi, setState, employee: Employee) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_NEW_EMPLOYEE_URL, setState, employee);
}

const updateEmployee: ICallAndSetData = async (callApi, setState, employee: Employee) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_EMPLOYEE_URL, setState, employee);
}
const inactiveUserFirstLogin: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, INACTIVE_USER_FIRST_LOGIN_URL, setState, {}, false);
}


export {getAllUsersApi, getEmployeeApi, toggleEmployeeStatus, addNewEmployee, updateEmployee, inactiveUserFirstLogin};