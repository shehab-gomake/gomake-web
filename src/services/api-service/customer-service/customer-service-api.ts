import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";

const GET_ISSUES_URL = "/v1/customer-service/issue";
const CREATE_ISSUE_URL = "/v1/customer-service/issue";
const GET_ALL_PRINTHOUSES = "/v1/customer-service/printHouses";
const GET_ALL_PRINTHOUSES_ADMIN = "/v1/customer-service/allIssues";

//Fetches all issues for non-admin users.
const getAllIssuesApi = async (callApi, setState) => {
  const res = await getSetApiData(callApi, EHttpMethod.GET, GET_ISSUES_URL, setState);
  return res;
};

const createIssueApi = async (callApi, callback, issueData) => {
  return await getSetApiData(callApi, EHttpMethod.POST, CREATE_ISSUE_URL, callback, issueData, true);
};

//Fetches the list of all print houses.
const getAllPrintHousesApi = async (callApi, setState) => {
  const res = await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_PRINTHOUSES, setState);
  return res.data;
};

//Fetches all issues for a specific print house.
const getAllPrintHousesIssuesApi = async (callApi, setState) => {
  const res = await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_PRINTHOUSES_ADMIN, setState);
  return res;
};

//Fetches all issues for admin users.
//If a print house is selected, it includes the printHouseName in the query parameters.
const getAllIssuesAdminApi = async (callApi, setState, selectedPrintHouseName) => {
  const url = selectedPrintHouseName
    ? `${GET_ALL_PRINTHOUSES_ADMIN}?printHouseName=${selectedPrintHouseName}`
    : `${GET_ALL_PRINTHOUSES_ADMIN}`;
  const res = await getSetApiData(callApi, EHttpMethod.GET, url, setState);
  return res;
};

export { getAllIssuesApi, createIssueApi, getAllPrintHousesApi, getAllIssuesAdminApi, getAllPrintHousesIssuesApi };
