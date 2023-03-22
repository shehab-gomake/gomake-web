import { useRecoilValue, useSetRecoilState} from "recoil";
import {dashboardDateState} from "@/store";
import {useCallback} from "react";
import {IDateRange} from "@/shared";
import {dateStringFormat, TODAY_DATE_RANGE, TOMORROW_DATE_RANGE} from "@/shared/constant";
import {endOfDay} from "date-fns/fp";

const useGomakeDateRange = () => {
    const date = useRecoilValue(dashboardDateState);
    const  setDate = useSetRecoilState(dashboardDateState);

    const newDateSelected = useCallback((dateRange: IDateRange) => {
        if (date === dateRange) return;

        setDate({...dateRange, endDate: endOfDay(dateRange.endDate)});
    }, []);

    const setTodayDateRange = useCallback(() => {
        newDateSelected(TODAY_DATE_RANGE);
    }, []);

    const setTomorrowDateRange = useCallback(() => {
        newDateSelected(TOMORROW_DATE_RANGE);
    }, []);

    const isToday = useCallback(() => {
        return TODAY_DATE_RANGE.startDate.getTime() === date.startDate.getTime() && TODAY_DATE_RANGE.endDate.getTime() === date.endDate.getTime()
    }, [date]);

    const isTomorrow = useCallback(() => {
        return TOMORROW_DATE_RANGE.startDate.getTime() === date.startDate.getTime() && TOMORROW_DATE_RANGE.endDate.getTime() === date.endDate.getTime()
    }, [date]);


    const selectedDateText = useCallback(() => {
        if (isToday()) {
            return 'Today\'s Tasks'
        }
        if (isTomorrow()) {
            return 'Tomorrow\'s Tasks'
        }

        return dateStringFormat(date.startDate) + ' - ' + dateStringFormat(date.endDate) + '  Task\'s';
    }, [date])
    return {
        newDateSelected,
        date,
        setTodayDateRange,
        setTomorrowDateRange,
        isToday,
        isTomorrow,
        selectedDateText
    };
}

export { useGomakeDateRange };