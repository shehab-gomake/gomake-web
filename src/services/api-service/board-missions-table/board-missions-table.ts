import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
import {BoardMissionFilters} from "@/pages-components/board-missions/widgets/interfaces";

const SET_BOARD_MISSION_FILTER_URL = '/v1/erp-service/board-missions-tables/set-table-filters';
const GET_ORDER_SUMMERY_PDF_URL = '/v1/erp-service/board-missions-tables/get-order-summery-pdf';
const GET_WORK_MISSION_PDF_URL = '/v1/erp-service/board-missions-tables/get-work-mission-pdf';
const GET_DELIVERY_TICKER_PDF_URL = '/v1/erp-service/board-missions-tables/get-delivery-ticker-pdf';

const setBoardMissionsFiltersApi: ICallAndSetData = async (callApi, setState, data: BoardMissionFilters) => {
    return await getSetApiData(callApi, EHttpMethod.POST, SET_BOARD_MISSION_FILTER_URL, setState , data)
}

const getOrderSummeryPdfApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_ORDER_SUMMERY_PDF_URL, setState , data)
}

const getWorkMissionPdfApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_WORK_MISSION_PDF_URL, setState , data)
}


const getDeliveryTickerPdfApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_DELIVERY_TICKER_PDF_URL, setState , data)
}

export {
    setBoardMissionsFiltersApi,
    getOrderSummeryPdfApi,
    getWorkMissionPdfApi,
    getDeliveryTickerPdfApi
};