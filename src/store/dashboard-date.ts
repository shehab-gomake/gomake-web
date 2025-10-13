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

// Calculate last 30 days for production dashboard default
const today = new Date();
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(today.getDate() - 30);

const dashboardDateState = atom<{
  dates: IDateRange;
  action: DashboardActions;
}>({
  key: "dashboardSelectedDate", // unique ID (with respect to other atoms/selectors)
  default: {
    dates: {
      startDate: thirtyDaysAgo,
      endDate: today,
    },
    action: DashboardActions.LATE_TODAY_BOARDS_MISSIONS,
  }, // default value (aka initial value)
});

const productionCreationDateState = atom<{
  dates: IDateRange;
}>({
  key: "productionCreationDate",
  default: {
    dates: {
      startDate: undefined,
      endDate: undefined,
    },
  },
});

export { dashboardDateState, productionCreationDateState };
