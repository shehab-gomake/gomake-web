import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
import { BoardMissionFilters } from "@/pages-components/board-missions/interfaces";
const SET_BOARD_MISSION_FILTER_URL = '/v1/erp-service/board-missions-tables/set-table-filters';


const setBoardMissionsFiltersApi: ICallAndSetData = async (callApi, setState, data: BoardMissionFilters) => {
    return await getSetApiData(callApi, EHttpMethod.POST, SET_BOARD_MISSION_FILTER_URL, setState , data)
}

export {
    setBoardMissionsFiltersApi,
};