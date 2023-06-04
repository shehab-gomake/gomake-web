import {useStyle} from "@/widgets/dashboard-widget/dates/style";
import {GomakePrimaryButton} from "@/components";
import {MachineList} from "@/widgets";
import {IDashboardDates} from "@/widgets/dashboard-widget/dates/interface";
import {GoMakeDatepicker} from "@/components/datepicker";
import Button from "@mui/material/Button";
import {useGomakeDateRange} from "@/hooks";
import {useTranslation} from "react-i18next";
import {LateMissionsButton} from "@/widgets/dashboard-widget/components/late-missions-button";


const DashboardDates = ({children}: IDashboardDates) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const {
        setTodayDateRange,
        setTomorrowDateRange,
        isTomorrow,
        isToday,
        setNullDate,
        isNullDate,
        isLateToday,
        setLateToday
    } = useGomakeDateRange();
    return (
        <div style={classes.container}>
            <div style={classes.datesContainer}>
                {
                    isLateToday() ? <GomakePrimaryButton
                            style={classes.activeButton}>{t('dashboard-widget.today') + ' & ' + t('dashboard-widget.lateMissions') }</GomakePrimaryButton> :
                <Button variant={'outlined'} onClick={setLateToday} style={classes.button}>{t('dashboard-widget.today') + ' & ' + t('dashboard-widget.lateMissions') }</Button>
                }
                {
                    isToday() ? <GomakePrimaryButton
                            style={classes.activeButton}>{t('dashboard-widget.today')}</GomakePrimaryButton> :
                        <Button variant={'outlined'} onClick={() => setTodayDateRange()}
                                style={classes.button}>{t('dashboard-widget.today')}</Button>
                }
                {
                    isTomorrow() ?
                        <GomakePrimaryButton
                            style={classes.activeButton}>{t('dashboard-widget.tomorrow')}</GomakePrimaryButton> :
                        <Button variant={'outlined'} onClick={() => setTomorrowDateRange()}
                                style={classes.button}>{t('dashboard-widget.tomorrow')}</Button>
                }
                {
                    <LateMissionsButton onClick={setNullDate}
                                        selected={isNullDate()}>{t('dashboard-widget.lateMissions')}</LateMissionsButton>
                }
                <GoMakeDatepicker/>

            </div>
            {children}
            <div style={classes.machinesWrapper}>
                <MachineList/>
            </div>
        </div>
    );
}


export {
    DashboardDates
}