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
      startDate: thirtyDaysAgo,
      endDate: today,
    },
  },
});

const productionActivityDateState = atom<{
  dates: IDateRange;
}>({
  key: "productionActivityDate",
  default: {
    dates: {
      startDate: undefined,
      endDate: undefined,
    },
  },
});

export {
  productionDeliveryDateState,
  productionCreationDateState,
  productionActivityDateState,
};
