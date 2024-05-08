import {useRecoilValue, useSetRecoilState} from "recoil";
import {DashboardActions, dashboardDateState} from "@/store";
import {useCallback} from "react";
import {IDateRange} from "@/shared";
import {dateStringFormat, TODAY_DATE_RANGE, TOMORROW_DATE_RANGE} from "@/shared/constant";
import {endOfDay} from "date-fns/fp";
import {useTranslation} from "react-i18next";

const useGomakeDateRange = () => {
    const {t} = useTranslation();
    const {dates, action} = useRecoilValue(dashboardDateState);
    const setDate = useSetRecoilState(dashboardDateState);

    const newDateSelected = (dateRange: IDateRange) => {
        if (dateRange.endDate) {
            dateRange.endDate = endOfDay(dateRange.endDate)
            if (dateRange === TODAY_DATE_RANGE) {
                setTodayDateRange();
                return;
            }
            if (dateRange === TOMORROW_DATE_RANGE) {
                setTomorrowDateRange();
                return;
            }
            setDate({
                dates: {...dateRange, endDate: endOfDay(dateRange.endDate)},
                action: DashboardActions.DATE_RANGE_BOARDS
            });
        }
    }

    const setTodayDateRange = () => {
        setDate({dates: TODAY_DATE_RANGE, action: DashboardActions.TODAY_BOARDS_MISSIONS});
    }

    const setTomorrowDateRange = () => {
        setDate({dates: TOMORROW_DATE_RANGE, action: DashboardActions.TOMORROW_BOARDS_MISSIONS});
    }

    const setLateBoardsMissions = () => {
        setDate({
            dates: {startDate: undefined, endDate: undefined},
            action: DashboardActions.LATE_BOARDS_MISSIONS
        })
    }

    const setAllBoardsMissions = () => {
        setDate({
            dates: {startDate: undefined, endDate: undefined},
            action: DashboardActions.ALL_BOARDS_MISSIONS
        })
    }

    const setLateToday = () => {
        setDate({
            dates: {startDate: undefined, endDate: undefined},
            action: DashboardActions.LATE_TODAY_BOARDS_MISSIONS
        });
    }

    const selectedDateText = useCallback(() => {
        switch (action) {
            case DashboardActions.TODAY_BOARDS_MISSIONS:
                return t('dashboard-widget.today') + ' ' + t('dashboard-widget.tasks');
            case DashboardActions.TOMORROW_BOARDS_MISSIONS:
                return t('dashboard-widget.tomorrow') + ' ' + t('dashboard-widget.tasks');
            case DashboardActions.LATE_BOARDS_MISSIONS:
                return t('dashboard-widget.tasks') + ' ' + t('dashboard-widget.lateMissions')
            case DashboardActions.LATE_TODAY_BOARDS_MISSIONS:
                return t('dashboard-widget.tasks') + ' ' + t('dashboard-widget.today') + ' & ' + t('dashboard-widget.lateMissions')
            case DashboardActions.ALL_BOARDS_MISSIONS:
                return t('dashboard-widget.allTasks');
            case DashboardActions.DATE_RANGE_BOARDS:
                return dates.endDate && dates.startDate && dateStringFormat(dates.startDate) + ' - ' + dateStringFormat(dates.endDate) + ' ' + t('dashboard-widget.tasks');
            default:
                return ''
        }
    }, [dates, action])

    return {
        newDateSelected,
        dates,
        setTodayDateRange,
        setTomorrowDateRange,
        selectedDateText,
        setLateBoardsMissions,
        setLateToday,
        action,
        setAllBoardsMissions
    };
}

export {useGomakeDateRange};