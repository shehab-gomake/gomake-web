import moment from "moment-timezone";
import { useTranslation } from "react-i18next";

const useDateFormat = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");

  // Used to format dates for the API request body and url filters
  const GetDateFormat = (date: Date) => {
    const utcDate = moment.utc(date, "DD-MM-YYYY h:mm");
    let format = "YYYY-MM-DD HH:mm";
    if (dir == "rtl") {
      format = "HH:mm YYYY-MM-DD";
    }
    return utcDate.local().format(format);
  };

  // The input date format looks like: 2024-11-04T15:22:48.818687 (ISO format)
  // Convert to UTC first, then to local time
  const formatISODateTime = (date: Date | string) => {
    const utcDate = moment.utc(date);
    const format = "DD/MM/YYYY H:mm";
    // const format = "DD/MM/YYYY, H:mm"; // Adding a comma between date and time

    return utcDate.local().format(format);
  };

  // The input date format looks like: "04-11-2024 15:22"
  // The output will be formatted as: "04/11/2024 15:22"
  const formatCustomDateTime = (date: Date) => {
    const utcDate = moment.utc(date, "DD-MM-YYYY H:mm");
    const format = "DD/MM/YYYY HH:mm";
    return utcDate.local().format(format);
  };

  /*******************************************************************************************************************/

  const GetDateWithoutHoursFormat = (date: Date) => {
    if (date) {
      const formattedDate = new Date(date).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      return formattedDate;
    }
    return "N/A";
  };

  return {
    GetDateFormat,
    GetDateWithoutHoursFormat,
    formatISODateTime,
    formatCustomDateTime,
  };
};

export { useDateFormat };
