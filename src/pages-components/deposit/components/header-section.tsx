
import { HeaderTitle } from "@/widgets/header-title/header-title";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const DepositHeaderSection = ({ actionType }) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const [depositState , setDepositState] = useState<any>();

    return (
        <div style={classes.titleContainer}>
            <HeaderTitle
                title={actionType === "show" ? t("deposits.deposit") : t("deposits.createNew")}
                marginBottom={1}
                marginTop={1}
                color="rgba(241, 53, 163, 1)"
            />
            {actionType === "show" &&
             <div style={classes.depositNumberStyle}>
                {" - "} {depositState?.number}
            </div>}
        </div>
    )
}
export { DepositHeaderSection }