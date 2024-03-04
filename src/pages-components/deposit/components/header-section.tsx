
import { HeaderTitle } from "@/widgets/header-title/header-title";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { depositState } from "@/pages-components/deposits/components/states";
import { DEPOSIT_ACTIONS } from "../enums";

interface IHeaderSection {
    actionType: DEPOSIT_ACTIONS;
}

const DepositHeaderSection = ({ actionType }: IHeaderSection) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const deposit = useRecoilValue<any>(depositState);

    return (
        <div style={classes.titleContainer}>
            <HeaderTitle
                title={actionType === DEPOSIT_ACTIONS.Show ? t("deposits.deposit") : t("deposits.createNew")}
                marginBottom={1}
                marginTop={1}
                color="rgba(241, 53, 163, 1)"
            />
            {actionType === DEPOSIT_ACTIONS.Show &&
                <div style={classes.depositNumberStyle}>
                    {" - "} {deposit?.number}
                </div>
            }
            
        </div>
    )
}
export { DepositHeaderSection }