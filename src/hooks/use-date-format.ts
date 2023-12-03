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
    return {
        GetDateFormat: GetDateFormat
    };
};

export {useDateFormat};
