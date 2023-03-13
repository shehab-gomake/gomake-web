import {useTranslation} from "react-i18next";
import {useStyle} from "@/pages/dashboard/style";
import {DashboardCard} from "@/components/dashboard-card";

export default function Dashboard() {
    const {t} = useTranslation();
    const {classes} = useStyle();
    return (
        <div style={classes.container}>
            <h1 style={{...classes.header}}>{t("dashboard.welcome")}</h1>
            <DashboardCard bgColor={'#9747FF'} value={10} label={'new'}/>
        </div>
    );
}