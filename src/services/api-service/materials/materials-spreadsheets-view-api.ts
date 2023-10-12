import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const GET_SPREADSHEETS_COLUMNS_URL = '/v1/spreadsheet-material-view/get-spreadsheet-columns';
const getSpreadSheetColumnsApi: ICallAndSetData = async (callApi, callBack, data) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_SPREADSHEETS_COLUMNS_URL,callBack , data);
};
export {
    getSpreadSheetColumnsApi,
};