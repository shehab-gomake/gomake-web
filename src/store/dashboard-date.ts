import {atom} from "recoil";
import {IDateRange} from "@/shared";
import {TODAY_DATE_RANGE} from "@/shared/constant";

const dashboardDateState = atom<IDateRange>({
    key: 'dashboardSelectedDate', // unique ID (with respect to other atoms/selectors)
    default: {startDate: undefined, endDate: TODAY_DATE_RANGE.startDate}, // default value (aka initial value)
});





export {dashboardDateState}