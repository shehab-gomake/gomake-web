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
const GET_ALL_USERS_CAN_APPROVE_QUOTE_URL = '/v1/crm-service/employee/get-all-users-can-approve-quote';
const GET_EMPLOYEES_WORKING_HOURS_URL = '/v1/crm-service/employee/get-employees-working-hours';
const UPDATE_EMPLOYEE_DEFAULT_WORKING_HOURS_URL = '/v1/crm-service/employee/update-default-employee-working-hours/';
const UPDATE_EMPLOYEE_DAY_WORKING_HOURS_URL = '/v1/crm-service/employee/update-employee-day-working-hours';
const RESET_EMPLOYEE_DAY_WORKING_HOURS_URL = '/v1/crm-service/employee/reset-employee-day-working-hours';
const GET_ALL_EMPLOYEES_URL = '/v1/crm-service/employee/get-all-employees-for-dropdown';
const INVITE_EMPLOYEE_URL = '/v1/crm-service/employee/invite-employee';
const ACCEPT_INVITATION_URL = '/v1/crm-service/employee/accept-invitation';


const getAllUsersApi: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_USERS_URL, setState)
}

const getAllEmployeesApi: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_EMPLOYEES_URL, setState);
}

const getEmployeeApi: ICallAndSetData = async (callApi, setState, id: string) => {
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

const getAllUsersCanApproveQuoteApi: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_USERS_CAN_APPROVE_QUOTE_URL, setState);
}
const getEmployeesWorkingHoursApi: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_EMPLOYEES_WORKING_HOURS_URL, setState);
}
const updateEmployeesWorkingHoursApi: ICallAndSetData = async (callApi, setState, {employeeId, data}) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_EMPLOYEE_DEFAULT_WORKING_HOURS_URL + employeeId, setState, data);
}
const updateEmployeesDayWorkingHoursApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_EMPLOYEE_DAY_WORKING_HOURS_URL, setState, data);
}
const resetEmployeesDayWorkingHoursApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, RESET_EMPLOYEE_DAY_WORKING_HOURS_URL, setState, data);
}

const inviteEmployeeApi: ICallAndSetData = async (callApi, setState, data: { firstname: string; lastname: string; email: string; roleID: string }) => {
    return await getSetApiData(callApi, EHttpMethod.POST, INVITE_EMPLOYEE_URL, setState, data);
}

const acceptInvitationApi: ICallAndSetData = async (callApi, setState, data: { token: string; password: string }) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ACCEPT_INVITATION_URL, setState, data);
}


export {
    getAllUsersApi,
    getEmployeeApi,
    toggleEmployeeStatus,
    addNewEmployee,
    updateEmployee,
    inactiveUserFirstLogin,
    getAllUsersCanApproveQuoteApi,
    getEmployeesWorkingHoursApi,
    updateEmployeesWorkingHoursApi,
    updateEmployeesDayWorkingHoursApi,
    resetEmployeesDayWorkingHoursApi,
    getAllEmployeesApi,
    inviteEmployeeApi,
    acceptInvitationApi
};