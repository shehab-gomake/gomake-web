import {ICards} from "@/widgets/dashboard-widget/cards/interface";
import {DashboardCard} from "@/components/dashboard-card";
import {useStyle} from "@/widgets/dashboard-widget/cards/style";
import AddTaskIcon from '@mui/icons-material/AddTask';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useRecoilValue} from "recoil";
import {dashboardDateState} from "@/store";
import {dateStringFormat, TODAY_DATE_RANGE, TOMORROW_DATE_RANGE} from "@/shared/constant";

const Cards = ({data}: ICards) => {
    const {classes} = useStyle();
    const selectedDate = useRecoilValue(dashboardDateState);
    const {successColor, warningColor, errorColor} = useGomakeTheme();
    const getDateRangeText = (): string => {
        if (selectedDate === TODAY_DATE_RANGE) {
            return 'Today\'s Tasks'
        }
        if (selectedDate === TOMORROW_DATE_RANGE) {
            return 'Tomorrow\'s Tasks'
        }

        return dateStringFormat(selectedDate.startDate) + ' - ' + dateStringFormat(selectedDate.endDate) + '  Task\'s';
    }
    return (
        <div style={classes.container}>
            <h2 style={classes.header}>{getDateRangeText()}</h2>
            <div style={classes.statistics}>

                <DashboardCard label={data?.progress?.label || ''}
                               value={(data?.inProcess?.value + data?.done?.value + data?.faults?.value) || 0}
                               progressValue={(data?.progress?.value * 100) || 0}
                               bgColor={'#9747FF'}
                withProgressBar={true}>
                    <FactCheckOutlinedIcon/>
                </DashboardCard>


                <DashboardCard label={data?.new?.label || ''}
                               value={data?.new?.value || 0}
                               bgColor={'#3DB2F9'}>
                    <AddTaskIcon/>
                </DashboardCard>


                <DashboardCard label={data?.done?.label || ''}
                               value={data?.done?.value || 0}
                               bgColor={successColor(500)}>
                    <AssignmentTurnedInOutlinedIcon/>
                </DashboardCard>


                <DashboardCard label={data?.inProcess?.label || ''}
                               value={data?.inProcess?.value || 0}
                               bgColor={warningColor(500)}>
                    <LocalPrintshopOutlinedIcon/>
                </DashboardCard>

                <DashboardCard label={data?.faults?.label || ''}
                               value={data?.faults?.value || 0}
                               bgColor={errorColor(500)}>
                    <DoNotDisturbOnOutlinedIcon/>
                </DashboardCard>

            </div>
        </div>
    );
}
export {Cards}