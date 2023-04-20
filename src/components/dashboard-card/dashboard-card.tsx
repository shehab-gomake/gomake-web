import {Card} from "@mui/material";
import {IDashboardCard} from "@/components/dashboard-card/interface";
import {useStyle} from "@/components/dashboard-card/style";
import {CircularProgressWithLabel} from "@/components/progress-label-circle/progress";
import {useTranslation} from "react-i18next";

const DashboardCard = ({
                           label,
                           value,
                           bgColor,
                           children,
                           progressValue = 0,
                           withProgressBar = false
                       }: IDashboardCard) => {
    const {classes} = useStyle(bgColor);
    const {t} = useTranslation();
    return (

        <Card style={classes.container} variant={'outlined'}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between' as 'space-between',

            }}>
                <div>
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