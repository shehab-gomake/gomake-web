import {Card} from "@mui/material";
import {IDashboardCard} from "@/components/dashboard-card/interface";
import {useStyle} from "@/components/dashboard-card/style";
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {boardsMissionsStatusFilterState} from "@/store/boards-missions-status-filter";
import {useCallback} from "react";
import Stack from "@mui/material/Stack";
import {adaptRight} from "@/utils/adapter";
import {ShutterIcon} from "@/components/icons/shutter-icon";

const DashboardCard = ({
                           label,
                           value,
                           bgColor,
                           children,
                           status, productionTime
                       }: IDashboardCard) => {
    const [selectedStatus, setStatus] = useRecoilState(boardsMissionsStatusFilterState);
    const isSelected = useCallback(() => {
        return status === selectedStatus
    }, [selectedStatus])
    const {classes} = useStyle(bgColor, isSelected());
    const {t} = useTranslation();
    const direction = t('direction');
    const handleOnClick = () => {
        if (status) {
            if (selectedStatus === status) {
                setStatus(null);
            } else {
                setStatus(status ? status : null);
            }
        }
    }
    return (

        <Card onClick={handleOnClick} style={{...classes.container, cursor: !!status && 'pointer', backgroundColor: isSelected() && bgColor}} variant={'outlined'}>
            <div style={{
                width: '3px',
                backgroundColor: bgColor,
                position: 'absolute',
                top: '20px',
                bottom: '20px', ...adaptRight(direction, 0)
            }}/>
            <Stack direction={'row'} gap={'10px'} padding={'10px'}>
                <div style={classes.iconWrapper}>
                    <Stack width={'26px'} height={'26px'} alignItems={'center'} justifyContent={'center'}
                           borderRadius={'6px'} border={`1px solid ${bgColor}`} bgcolor={bgColor + '40'}>
                        {children}
                    </Stack>
                </div>
                <Stack gap={'4px'}>
                    <span style={classes.label}>{t('dashboard-widget.' + label)}</span>
                    <Stack direction={'row'} gap={'5px'} alignItems={'center'}>
                        <ShutterIcon/>
                        <div style={classes.value}>{`${productionTime > 60 ? (productionTime / 60).toFixed(1) : productionTime}${productionTime > 0 ? t('measurementUnits.shortHours') : t('measurementUnits.shortMinute')} (${value}J)`}</div>
                    </Stack>
                </Stack>
            </Stack>
            <Stack alignItems={'center'} justifyContent={'center'} textAlign={'center'}>
            </Stack>
        </Card>
    );
}

export {DashboardCard}