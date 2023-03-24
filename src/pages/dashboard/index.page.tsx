import {useTranslation} from "react-i18next";
import {useStyle} from "@/pages/dashboard/style";
import {DashboardWidget} from "@/widgets";
import {CustomerAuthLayout} from "@/layouts";

export default function Dashboard() {
    const {t} = useTranslation();
    const {classes} = useStyle();
    return (
        <CustomerAuthLayout>
            <div style={classes.container}>
                <h1 style={{...classes.header}}>{t("dashboard-page.welcome")}</h1>
                <DashboardWidget/>
            </div>
        </CustomerAuthLayout>
    );
}