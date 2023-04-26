import {useRecoilValue, useSetRecoilState} from "recoil";
import {dashboardDateState} from "@/store";
import {useCallback} from "react";
import {IDateRange} from "@/shared";
import {dateStringFormat, TODAY_DATE_RANGE, TOMORROW_DATE_RANGE} from "@/shared/constant";
import {endOfDay} from "date-fns/fp";
import {useTranslation} from "react-i18next";

const useGomakeDateRange = () => {
    const {t} = useTranslation();
    const date = useRecoilValue(dashboardDateState);
    const setDate = useSetRecoilState(dashboardDateState);

    const newDateSelected = useCallback((dateRange: IDateRange) => {
        if (dateRange.endDate) {
            setDate({...dateRange, endDate: endOfDay(dateRange.endDate)});
        }
    }, []);

    const setTodayDateRange = useCallback(() => {
        newDateSelected(TODAY_DATE_RANGE);
    }, []);

    const setTomorrowDateRange = useCallback(() => {
        newDateSelected(TOMORROW_DATE_RANGE);
    }, []);

    const setNullDate = useCallback(() => {
        setDate({startDate: null, endDate: null})
    }, [])

    const isNullDate = useCallback(() => {
        return date.endDate === undefined && date.startDate === undefined
    }, [date]);

    const isToday = useCallback(() => {
        return TODAY_DATE_RANGE?.startDate?.getTime() === date?.startDate?.getTime() && TODAY_DATE_RANGE.endDate?.getTime() === date?.endDate?.getTime()
    }, [date]);

    const isTomorrow = useCallback(() => {
        return TOMORROW_DATE_RANGE?.startDate?.getTime() === date?.startDate?.getTime() && TOMORROW_DATE_RANGE.endDate?.getTime() === date.endDate?.getTime()
    }, [date]);


    const selectedDateText = useCallback(() => {
        if (isToday()) {
            return t('dashboard-widget.today') + ' ' + t('dashboard-widget.tasks');
        }
        if (isTomorrow()) {
            return t('dashboard-widget.tomorrow') + ' ' + t('dashboard-widget.tasks');
        }

        if (date.startDate === undefined && date.endDate === undefined) {
            return t('dashboard-widget.tasks') + ' ' + t('dashboard-widget.lateMissions')
        }

        return date.endDate && date.startDate && dateStringFormat(date.startDate) + ' - ' + dateStringFormat(date.endDate) + ' ' + t('dashboard-widget.tasks');
    }, [date])
    return {
        newDateSelected,
        date,
        setTodayDateRange,
        setTomorrowDateRange,
        isToday,
        isTomorrow,
        isNullDate,
        selectedDateText,
        setNullDate
    };
}

export {useGomakeDateRange};