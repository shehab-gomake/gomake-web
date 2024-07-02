import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";

const GET_ISSUES_URL = "/v1/customer-service/issue";
const CREATE_ISSUE_URL = "/v1/customer-service/issue";
// const UPDATE_ISSUE_URL = "/rest/api/3/issue";
// const DELETE_ISSUE_URL = "/rest/api/3/issue";

const getAllIssuesApi = async (callApi, setState) => {
  const res = await getSetApiData(callApi, EHttpMethod.GET, GET_ISSUES_URL, setState);
  return res;
};

const createIssueApi = async (callApi, callback, issueData) => {
  return await getSetApiData(callApi, EHttpMethod.POST, CREATE_ISSUE_URL, callback, issueData);
};

export { getAllIssuesApi, createIssueApi };
