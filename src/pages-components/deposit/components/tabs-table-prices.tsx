import { useStyle } from "../style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslation } from "react-i18next";

interface IDepositTabProps {
    tableHeaders: any;
    tableRows: any;
    itemsCount: number;
    total: number;
    onClickMakePayment?: () => void;
}

const DepositTabTable = ({ tableHeaders, tableRows, itemsCount, total, onClickMakePayment }: IDepositTabProps) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    return (
        <div style={classes.tabContainerStyle}>
            <PrimaryTable
                stickyFirstCol={false}
                stickyHeader={true}
                maxHeight={470}
                rows={tableRows}
                headers={tableHeaders}
            />
            <div style={classes.tabFooterStyle}>
                <PrimaryTable
                    rows={[
                        [t("deposits.depositAmount"), itemsCount],
                        [t("deposits.totalDeposit"), total]]}
                    headers={null}
                />
                <SecondaryButton
                    variant={'contained'}
                    style={{ width: "100%" }}
                    onClick={onClickMakePayment}>
                    {t('deposits.makeDeposit')}
                </SecondaryButton>
            </div>
        </div>
    );
};

export { DepositTabTable };