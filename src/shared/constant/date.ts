import { IDateRange } from "@/shared";
import {
  addDays,
  endOfDay,
  endOfToday,
  startOfDay,
  startOfToday,
  startOfMonth,
  endOfMonth,
} from "date-fns";

const TODAY_DATE_RANGE: IDateRange = {
  startDate: startOfToday(),
  endDate: endOfToday(),
};

const TOMORROW_DATE_RANGE: IDateRange = {
  startDate: startOfDay(addDays(new Date(), 1)),
  endDate: endOfDay(addDays(new Date(), 1)),
};

const THIS_MONTH_DATE_RANGE: IDateRange = {
  startDate: startOfMonth(new Date()),
  endDate: endOfMonth(new Date()),
};

const dateStringFormat = (inputDate: Date): string => {
  let date, month, year;

  date = inputDate.getDate();
  month = inputDate.getMonth() + 1;
  year = inputDate.getFullYear();
  if (date < 10) {
    date = "0" + date;
  }

  if (month < 10) {
    month = "0" + month;
  }
  date = date.toString().padStart(2, "0");

  month = month.toString().padStart(2, "0");

  return `${date}/${month}/${year}`;
};

export {
  TODAY_DATE_RANGE,
  TOMORROW_DATE_RANGE,
  THIS_MONTH_DATE_RANGE,
  dateStringFormat,
};
