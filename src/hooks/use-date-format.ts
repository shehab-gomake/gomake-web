import moment from "moment-timezone";
import { useTranslation } from "react-i18next";

const useDateFormat = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");

  // keep it to format dates for the API request body and url filters
  const GetDateFormat = (date: Date) => {
    const utcDate = moment.utc(date, "DD-MM-YYYY h:mm");
    let format = "YYYY-MM-DD HH:mm";
    if (dir == "rtl") {
      format = "HH:mm YYYY-MM-DD";
    }
    return utcDate.local().format(format);
  };

  // The input date format looks like: 2024-11-04T15:22:48.818687 (ISO format)
  // The output will be formatted as: "DD/MM/YYYY H:mm"
  const formatISODateTime = (date: Date | string) => {
    const utcDate = moment.utc(date);
    const format = "DD/MM/YYYY H:mm";
    // const format = "DD/MM/YYYY, H:mm"; // Adding a comma between date and time
    return utcDate.local().format(format);
  };

  // The input date format looks like: "04-11-2024 15:22"
  // The output will be formatted as: "DD/MM/YYYY H:mm"
  const formatCustomDateTime = (date: Date) => {
    const utcDate = moment.utc(date, "DD-MM-YYYY H:mm");
    const format = "DD/MM/YYYY HH:mm";
    return utcDate.local().format(format);
  };

  // Notes:
  // - To extract just the date from formatISODateTime or formatCustomDateTime, you can use .split(" ")[0].
  //   Example: formatISODateTime(quote?.creationDate).split(" ")[0] will give you just the date (e.g., "04/11/2024").
  // - This works because both functions return the formatted date-time string, and .split(" ")[0] will give you the part before the space.

  return {
    GetDateFormat,
    formatISODateTime,
    formatCustomDateTime,
  };
};

export { useDateFormat };
