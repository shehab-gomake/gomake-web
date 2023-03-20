import {atom, selector} from "recoil";
import {IDateRange} from "@/shared";
import {getApiRequest} from "@/services/api-request";
import {TODAY_DATE_RANGE} from "@/shared/constant";

const dashboardDateState = atom<IDateRange>({
    key: 'dashboardSelectedDate', // unique ID (with respect to other atoms/selectors)
    default: TODAY_DATE_RANGE, // default value (aka initial value)
});

const boardMissions = selector({
    key: 'getBoardMissionsByDate',
    get: async ({get}) => {
        return  await getApiRequest('/boardMissions', get(dashboardDateState), true)
    }
});




export {dashboardDateState, boardMissions}