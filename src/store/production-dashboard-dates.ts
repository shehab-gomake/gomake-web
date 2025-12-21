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

// Default date for Activity Date: today
const today = new Date();
today.setHours(0, 0, 0, 0); // Start of day
const endOfToday = new Date();
endOfToday.setHours(23, 59, 59, 999); // End of day

const productionDeliveryDateState = atom<{
  dates: IDateRange;
  action: DashboardActions;
}>({
  key: "productionDeliveryDate", // unique ID (with respect to other atoms/selectors)
  default: {
    dates: {
      startDate: undefined,
      endDate: undefined,
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

const productionActivityDateState = atom<{
  dates: IDateRange;
}>({
  key: "productionActivityDate",
  default: {
    dates: {
      startDate: today,
      endDate: endOfToday,
    },
  },
});

const productionStatusesState = atom<string[]>({
  key: "productionStatuses",
  default: [],
});

export {
  productionDeliveryDateState,
  productionCreationDateState,
  productionActivityDateState,
  productionStatusesState,
};
