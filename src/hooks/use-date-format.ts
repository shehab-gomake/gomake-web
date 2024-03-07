import moment from "moment-timezone";
import {useTranslation} from "react-i18next";


const useDateFormat = () => {
    const {t} = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");

    const GetDateFormat = (date: Date) => {
        const utcDate = moment.utc(date,"DD-MM-YYYY h:mm");
        let format = "YYYY-MM-DD HH:mm";
        if(dir == "rtl"){
            format = "HH:mm YYYY-MM-DD"
        }
        return utcDate.local().format(format);
    }


      const GetShortDateFormat = (date : Date) => {
        if (date) {
        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });

          return formattedDate
        }
        return "N/A";
      };

    return {
        GetDateFormat,
        GetShortDateFormat 
    };
};

export {useDateFormat};
