import {ICards} from "@/widgets/dashboard-widget/cards/interface";
import {DashboardCard} from "@/components/dashboard-card";
import {useStyle} from "@/widgets/dashboard-widget/cards/style";
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {EStatus} from "@/shared";
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
const Cards = ({data}: ICards) => {
    const {classes} = useStyle();
    const {successColor, warningColor, errorColor, secondColor} = useGomakeTheme();
    const iconStyle = {
        width: '20px',
        height: '20px'
    }
    return (
        <div style={classes.container}>
            <div style={classes.statistics}>

                <DashboardCard label={data?.progress?.labelTranslationKey || ''}
                               value={(data?.progress?.value) || 0}
                               progressValue={((data?.done?.value / data?.progress?.value) * 100) || 0}
                               bgColor={'#9747FF'}
                               productionTime={data?.progress?.productionTime}
                               withProgressBar={true}>
                    <LocalPrintshopOutlinedIcon style={{...iconStyle, color: '#9747FF'}}/>
                </DashboardCard>


                <DashboardCard label={data?.new?.labelTranslationKey || ''}
                               value={data?.new?.value || 0}
                               productionTime={data?.new?.productionTime}
                               bgColor={'#3DB2F9'}>
                    <LocalFireDepartmentOutlinedIcon style={{...iconStyle, color: '#3DB2F9'}}/>
                </DashboardCard>


                <DashboardCard label={data?.done?.labelTranslationKey || ''}
                               value={data?.done?.value || 0}
                               status={EStatus.DONE}
                               productionTime={data?.done?.productionTime}
                               bgColor={successColor(500)}>
                    <VerifiedOutlinedIcon style={{...iconStyle, color: successColor(500)}}/>
                </DashboardCard>


                <DashboardCard label={data?.inProcess?.labelTranslationKey || ''}
                               value={data?.inProcess?.value || 0}
                               status={EStatus.IN_PROCESS}
                               productionTime={data?.inProcess?.productionTime}
                               bgColor={warningColor(500)}>
                    <HistoryOutlinedIcon style={{...iconStyle, color: warningColor(500)}}/>
                </DashboardCard>

                <DashboardCard label={data?.waiting?.labelTranslationKey || ''}
                               value={data?.waiting?.value || 0}
                               status={EStatus.WAITING}
                               productionTime={data?.waiting?.productionTime}
                               bgColor={secondColor(300)}>
                    <HourglassTopIcon style={{...iconStyle, color: secondColor(500)}}/>
                </DashboardCard>

                <DashboardCard label={data?.faults?.labelTranslationKey || ''}
                               value={data?.faults?.value || 0}
                               status={EStatus.FAULT}
                               productionTime={data?.faults?.productionTime}
                               bgColor={errorColor(500)}>

                        <DoNotDisturbOnOutlinedIcon style={{...iconStyle, color: errorColor(500)}}/>
                </DashboardCard>

            </div>
        </div>
    );
}
export {Cards}