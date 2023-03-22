import { useRecoilValue, useSetRecoilState} from "recoil";
import {dashboardDateState} from "@/store";
import {useCallback} from "react";
import {IDateRange} from "@/shared";
import {dateStringFormat, TODAY_DATE_RANGE, TOMORROW_DATE_RANGE} from "@/shared/constant";

const useGomakeDateRange = () => {
    const date = useRecoilValue(dashboardDateState);
    const  setDate = useSetRecoilState(dashboardDateState);

    const newDateSelected = useCallback((dateRange: IDateRange) => {
        if (date === dateRange) return;
        setDate(dateRange);
    }, []);

    const setTodayDateRange = useCallback(() => {
        newDateSelected(TODAY_DATE_RANGE);
    }, []);

    const setTomorrowDateRange = useCallback(() => {
        newDateSelected(TOMORROW_DATE_RANGE);
    }, []);

    const isToday = useCallback(() => {
        return TODAY_DATE_RANGE === date
    }, [date]);

    const isTomorrow = useCallback(() => {
        return TOMORROW_DATE_RANGE === date;
    }, [date]);


    const selectedDateText = useCallback(() => {
        if (date === TODAY_DATE_RANGE) {
            return 'Today\'s Tasks'
        }
        if (date === TOMORROW_DATE_RANGE) {
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