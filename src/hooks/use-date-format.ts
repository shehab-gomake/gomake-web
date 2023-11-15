import moment from "moment-timezone";


const useDateFormat = () => {
    const GetDateFormat = (date: Date) => {
        debugger;
        const utcDate = moment.utc(date).tz("UTC");
        return utcDate.local().format();
    }
    return {
        GetDateFormat: GetDateFormat
    };
};

export {useDateFormat};
