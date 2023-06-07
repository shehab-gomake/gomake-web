import {useStyle} from "@/widgets/dashboard-widget/dates/style";
import {GomakePrimaryButton} from "@/components";
import {MachineList} from "@/widgets";
import {IDashboardDates} from "@/widgets/dashboard-widget/dates/interface";
import {GoMakeDatepicker} from "@/components/datepicker";
import Button from "@mui/material/Button";
import {useGomakeDateRange} from "@/hooks";
import {useTranslation} from "react-i18next";
import {LateMissionsButton} from "@/widgets/dashboard-widget/components/late-missions-button";
import {DashboardActions} from "@/store";


const DashboardDates = ({children}: IDashboardDates) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const {
        setTodayDateRange,
        setTomorrowDateRange,
        setLateToday,
        action,
        setLateBoardsMissions,
        setAllBoardsMissions
    } = useGomakeDateRange();
    return (
        <div style={classes.container}>
            <div style={classes.datesContainer}>
                {
                    action === DashboardActions.LATE_TODAY_BOARDS_MISSIONS ? <GomakePrimaryButton
                            style={classes.activeButton}>{t('dashboard-widget.today') + ' & ' + t('dashboard-widget.lateMissions') }</GomakePrimaryButton> :
                <Button variant={'outlined'} onClick={setLateToday} style={classes.button}>{t('dashboard-widget.today') + ' & ' + t('dashboard-widget.lateMissions') }</Button>
                }
                {
                    action === DashboardActions.TODAY_BOARDS_MISSIONS ? <GomakePrimaryButton
                            style={classes.activeButton}>{t('dashboard-widget.today')}</GomakePrimaryButton> :
                        <Button variant={'outlined'} onClick={() => setTodayDateRange()}
                                style={classes.button}>{t('dashboard-widget.today')}</Button>
                }
                {
                    action === DashboardActions.TOMORROW_BOARDS_MISSIONS ?
                        <GomakePrimaryButton
                            style={classes.activeButton}>{t('dashboard-widget.tomorrow')}</GomakePrimaryButton> :
                        <Button variant={'outlined'} onClick={() => setTomorrowDateRange()}
                                style={classes.button}>{t('dashboard-widget.tomorrow')}</Button>
                }
                {
                    <LateMissionsButton onClick={setLateBoardsMissions}
                                        selected={action === DashboardActions.LATE_BOARDS_MISSIONS}>{t('dashboard-widget.lateMissions')}</LateMissionsButton>
                }
                {
                    action === DashboardActions.ALL_BOARDS_MISSIONS ? <GomakePrimaryButton
                            style={classes.activeButton}>{t('dashboard-widget.all')}</GomakePrimaryButton> :
                        <Button variant={'outlined'} onClick={setAllBoardsMissions} style={classes.button}>{t('dashboard-widget.all')}</Button>
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