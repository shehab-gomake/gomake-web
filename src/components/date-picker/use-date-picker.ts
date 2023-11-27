import {IDateRange} from "@/components/date-picker/interface";
import {endOfDay} from "date-fns/fp";
const useDatePicker = () => {

    const onSelectDateRange = (dateRange: IDateRange) => {
        if (dateRange.endDate) {
            dateRange.endDate = endOfDay(dateRange.endDate)
        }
    }
    const dateStringFormat = (inputDate: Date): string => {
        if (inputDate === null) {
            return ''
        }
        let date, month, year;

        date = inputDate.getDate();
        month = inputDate.getMonth() + 1;
        year = inputDate.getFullYear();
        if (date < 10) {
            date = '0' + date;
        }

        if (month < 10) {
            month = '0' + month;
        }
        date = date
            .toString()
            .padStart(2, '0');

        month = month
            .toString()
            .padStart(2, '0');

        return `${date}/${month}/${year}`
    }
    return {
        dateStringFormat,
        onSelectDateRange
    }
}

export {useDatePicker}