import {useTranslation} from "react-i18next";
import {useStyle} from "@/pages/dashboard/style";
import {DashboardWidget} from "@/widgets";

export default function Dashboard() {
    const {t} = useTranslation();
    const {classes} = useStyle();
    return (
            <div style={classes.container}>
                <h1 style={{...classes.header}}>{t("dashboard-page.welcome")}</h1>
                <DashboardWidget/>
            </div>
    );
}