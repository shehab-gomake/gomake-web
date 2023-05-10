import {useTranslation} from "react-i18next";
import {useStyle} from "@/pages/dashboard/style";
import {DashboardWidget} from "@/widgets";
import {useEffect, useState} from "react";
import {GoMakeModal} from "@/components/modal/modal";
import {getPrintHouseId} from "@/services/storage-data";
export default function Dashboard() {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const [modal, setModal] = useState<boolean>(true);
    useEffect(() => {
        setModal(!getPrintHouseId());
    }, [])
    return (
            <div style={classes.container}>
                <GoMakeModal show={modal} onSubmit={() => setModal(false)} ></GoMakeModal>
                <h1 style={{...classes.header}}>{t("dashboard-page.welcome")}</h1>
                {!modal && <DashboardWidget/>}
            </div>
    );
}