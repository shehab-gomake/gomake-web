import {useStyle} from "@/widgets/dashboard-widget/dates/style";
import {GomakePrimaryButton} from "@/components";
import {MachineList} from "@/widgets";
import {IDashboardDates} from "@/widgets/dashboard-widget/dates/interface";
import {GoMakeDatepicker} from "@/components/datepicker";
import Button from "@mui/material/Button";
import {useGomakeDateRange} from "@/hooks";
import {useTranslation} from "react-i18next";


const DashboardDates = ({children}: IDashboardDates) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const { setTodayDateRange, setTomorrowDateRange, isTomorrow, isToday } = useGomakeDateRange();
    return (
        <div style={classes.container}>
            <div style={classes.datesContainer}>
                {
                    isToday() ? <GomakePrimaryButton style={classes.activeButton}>{t('dashboard-widget.today')}</GomakePrimaryButton> :
                        <Button variant={'outlined'} onClick={() => setTodayDateRange()}
                                style={classes.button}>{t('dashboard-widget.today')}</Button>
                }
                {
                    isTomorrow() ?
                        <GomakePrimaryButton style={classes.activeButton}>{t('dashboard-widget.tomorrow')}</GomakePrimaryButton> :
                        <Button variant={'outlined'} onClick={() => setTomorrowDateRange()}
                                style={classes.button}>{t('dashboard-widget.tomorrow')}</Button>
                }
                <GoMakeDatepicker/>
            </div>
            {children}
            <MachineList/>
        </div>
    );
}


export {
    DashboardDates
}