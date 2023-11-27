import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
import {EStatus} from "@/widgets/production-floor-widget/components/status-btn";

const GET_ALL_WORK_JOBS_URL = '/v1/production-floor/get-all-work-job';
const UPDATE_WORK_JOB_STATUS_URL = '/v1/update-work-job-status';

const getAllWorkJobsApi: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_WORK_JOBS_URL, setState);
};

const updateWorkJobStatusApi: ICallAndSetData = async (callApi, setState, data: {id: string, status: EStatus}) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, UPDATE_WORK_JOB_STATUS_URL, setState, data);
};



export {getAllWorkJobsApi, updateWorkJobStatusApi};