import { atom } from "recoil";
import { IDateRange } from "@/shared";
import { THIS_MONTH_DATE_RANGE, TODAY_DATE_RANGE } from "@/shared/constant";

export enum DashboardActions {
  ALL_BOARDS_MISSIONS,
  LATE_TODAY_BOARDS_MISSIONS,
  LATE_BOARDS_MISSIONS,
  TODAY_BOARDS_MISSIONS,
  TOMORROW_BOARDS_MISSIONS,
  DATE_RANGE_BOARDS,
}

const dashboardDateState = atom<{
  dates: IDateRange;
  action: DashboardActions;
}>({
  key: "dashboardSelectedDate", // unique ID (with respect to other atoms/selectors)
  default: {
    dates: THIS_MONTH_DATE_RANGE,
    action: DashboardActions.LATE_TODAY_BOARDS_MISSIONS,
  }, // default value (aka initial value)
});

export { dashboardDateState };
