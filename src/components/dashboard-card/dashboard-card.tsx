import {Card} from "@mui/material";
import {IDashboardCard} from "@/components/dashboard-card/interface";
import {useStyle} from "@/components/dashboard-card/style";
import {CircularProgressWithLabel} from "@/components/progress-label-circle/progress";
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {boardsMissionsStatusFilterState} from "@/store/boards-missions-status-filter";
import {useCallback} from "react";

const DashboardCard = ({
                           label,
                           value,
                           bgColor,
                           children,
                           progressValue = 0,
                           withProgressBar = false,
                           status
                       }: IDashboardCard) => {
    const [selectedStatus, setStatus] = useRecoilState(boardsMissionsStatusFilterState);
    const isSelected = useCallback(() => {return status === selectedStatus}, [selectedStatus])
    const {classes} = useStyle(bgColor, isSelected());
    const {t} = useTranslation();
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

        <Card onClick={handleOnClick} style={classes.container} variant={'outlined'}>
            <div style={{
                display: 'flex',
            }}>
                <div style={{width: '60px'}}>
                    <div style={classes.iconWrapper}>
                        {children}
                    </div>
                </div>

                <div style={classes.value}>{value}</div>

                <div style={classes.progressWrapper}>
                    {
                        withProgressBar && <div>
                            <CircularProgressWithLabel value={progressValue}/>
                        </div>
                    }
                </div>
            </div>
            <div style={classes.label}><span>{t(label)}</span></div>
        </Card>
    );
}

export {DashboardCard}