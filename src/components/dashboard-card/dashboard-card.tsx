import {Card} from "@mui/material";
import {IDashboardCard} from "@/components/dashboard-card/interface";
import {useStyle} from "@/components/dashboard-card/style";
import {CircularProgressWithLabel} from "@/components/progress-label-circle/progress";

const DashboardCard = ({
                           label,
                           value,
                           bgColor,
                           children,
                           progressValue = 0,
                           withProgressBar = false
                       }: IDashboardCard) => {
    const {classes} = useStyle(bgColor);
    return (
        <Card style={classes.container} variant={'outlined'}>
            {
                withProgressBar && <div style={classes.progressWrapper}>
                <CircularProgressWithLabel value={progressValue}/>
            </div>
            }
            <div style={classes.iconWrapper}>
                {children}
            </div>
            <div style={classes.value}>{value}</div>
            <div style={classes.label}>{label}</div>
        </Card>
    );
}

export {DashboardCard}