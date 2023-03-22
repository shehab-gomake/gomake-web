import {useStyle} from "@/widgets/dashboard-widget/dates/style";
import {GomakePrimaryButton} from "@/components";
import {MachineList} from "@/widgets";
import {IDashboardDates} from "@/widgets/dashboard-widget/dates/interface";
import {GoMakeDatepicker} from "@/components/datepicker";
import Button from "@mui/material/Button";
import {useGomakeDateRange} from "@/hooks";


const DashboardDates = ({}: IDashboardDates) => {
    const {classes} = useStyle();
    const { setTodayDateRange, setTomorrowDateRange, isTomorrow, isToday } = useGomakeDateRange();

    return (
        <div style={classes.container}>
            <div style={classes.datesContainer}>
                {
                    isToday() ? <GomakePrimaryButton style={classes.activeButton}>Today</GomakePrimaryButton> :
                        <Button variant={'outlined'} onClick={() => setTodayDateRange()}
                                style={classes.button}>Today</Button>
                }
                {
                    isTomorrow() ?
                        <GomakePrimaryButton style={classes.activeButton}>Tomorrow</GomakePrimaryButton> :
                        <Button variant={'outlined'} onClick={() => setTomorrowDateRange()}
                                style={classes.button}>Tomorrow</Button>
                }
                <GoMakeDatepicker/>
            </div>
            <MachineList/>
        </div>
    );
}


export {
    DashboardDates
}