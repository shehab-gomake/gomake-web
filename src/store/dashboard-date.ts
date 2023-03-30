import {atom} from "recoil";
import {IDateRange} from "@/shared";
import {TODAY_DATE_RANGE} from "@/shared/constant";

const dashboardDateState = atom<IDateRange>({
    key: 'dashboardSelectedDate', // unique ID (with respect to other atoms/selectors)
    default: TODAY_DATE_RANGE, // default value (aka initial value)
});





export {dashboardDateState}