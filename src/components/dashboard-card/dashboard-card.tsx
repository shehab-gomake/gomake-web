import {Card, CardContent} from "@mui/material";
import {IDashboardCard} from "@/components/dashboard-card/interface";
import {useStyle} from "@/components/dashboard-card/style";

const DashboardCard = ({label, value, bgColor}: IDashboardCard) => {
    const {classes} = useStyle();
    return (
        <Card style={{...classes.container, backgroundColor: bgColor}} variant={'outlined'}>
            <CardContent style={classes.value}>{value}</CardContent>
            <CardContent style={classes.label}>{label}</CardContent>
        </Card>
    );
}

export {DashboardCard}