import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";

const GET_ALL_ISSUES_URL = "/v1/customer-service/get-all-print-houses-issues";
const CREATE_ISSUE_URL = "/v1/customer-service/create-issue";
const GET_ALL_PRINT_HOUSES = "/v1/customer-service/printHouses";
const GET_ALL_PRINT_HOUSES_ADMIN = "/v1/customer-service/allIssues";

//Fetches all issues for non-admin users.
const getAllIssuesApi = async (callApi, setState) => {
  const res = await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_ISSUES_URL,
    setState
  );
  return res;
};

const createIssueApi = async (callApi, callback, issueData) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_ISSUE_URL,
    callback,
    issueData,
    true,
    null,
    true
  );
};

//Fetches the list of all print houses.
const getAllPrintHousesApi = async (callApi, setState) => {
  const res = await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_PRINT_HOUSES,
    setState
  );
  return res.data;
};

//Fetches all issues for a specific print house.
const getAllPrintHousesIssuesApi = async (callApi, setState) => {
  const res = await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_PRINT_HOUSES_ADMIN,
    setState
  );
  return res;
};

//Fetches all issues for admin users.
//If a print house is selected, it includes the printHouseName in the query parameters.
const getAllIssuesAdminApi = async (
  callApi,
  setState,
  selectedPrintHouseName
) => {
  const url = selectedPrintHouseName
    ? `${GET_ALL_PRINT_HOUSES_ADMIN}?printHouseName=${selectedPrintHouseName}`
    : `${GET_ALL_PRINT_HOUSES_ADMIN}`;
  const res = await getSetApiData(callApi, EHttpMethod.GET, url, setState);
  return res;
};

export {
  getAllIssuesApi,
  createIssueApi,
  getAllPrintHousesApi,
  getAllIssuesAdminApi,
  getAllPrintHousesIssuesApi,
};
