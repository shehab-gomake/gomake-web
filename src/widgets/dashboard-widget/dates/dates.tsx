import {useStyle} from "@/widgets/dashboard-widget/dates/style";
import {GomakePrimaryButton} from "@/components";
import {MachineList} from "@/widgets";
import {IDashboardDates} from "@/widgets/dashboard-widget/dates/interface";
import {GoMakeDatepicker} from "@/components/datepicker";
import {IDateRange} from "@/shared";
import Button from "@mui/material/Button";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {dashboardDateState} from "@/store";
import {TODAY_DATE_RANGE, TOMORROW_DATE_RANGE} from "@/shared/constant";


const DashboardDates = ({}: IDashboardDates) => {
    const {classes} = useStyle();
    const setDate = useSetRecoilState(dashboardDateState);
    const date = useRecoilValue(dashboardDateState);
    const handleSelectDates = (dateRange: IDateRange) => {
        if (date === dateRange) {
            return;
        }
        setDate(dateRange);
    };
    return (
        <div style={classes.container}>
            <div style={classes.datesContainer}>
                {
                    date === TODAY_DATE_RANGE ?
                        <GomakePrimaryButton style={classes.activeButton}>Today</GomakePrimaryButton> :
                        <Button variant={'outlined'} onClick={() => setDate(TODAY_DATE_RANGE)}
                                style={classes.button}>Today</Button>
                }
                {
                    date === TOMORROW_DATE_RANGE ?
                        <GomakePrimaryButton style={classes.activeButton}>Tomorrow</GomakePrimaryButton> :
                        <Button variant={'outlined'} onClick={() => setDate(TOMORROW_DATE_RANGE)}
                                style={classes.button}>Tomorrow</Button>
                }
                <GoMakeDatepicker onChange={handleSelectDates}/>
            </div>
            <MachineList/>
        </div>
    );
}


export {
    DashboardDates
}