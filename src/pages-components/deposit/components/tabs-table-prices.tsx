import { useStyle } from "../style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslation } from "react-i18next";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";

interface IDepositTabProps {
    tableHeaders: any;
    tableRows: any;
    itemsCount: number;
    total: number;
    onClickMakePayment?: () => void;
    handleSelectAll?: any;
    selectAllChecked?: any;
}

const DepositTabTable = ({ tableHeaders, tableRows, itemsCount, total, onClickMakePayment, handleSelectAll, selectAllChecked }: IDepositTabProps) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const direction = t('direction');
    const footerDirection = direction === "ltr" ? "rtl" : "ltr"

    return (
        <div style={classes.tabContainerStyle}>
            <div>
                <Checkbox
                    icon={<CheckboxIcon />}
                    checkedIcon={<CheckboxCheckedIcon />}
                    onChange={handleSelectAll}
                    checked={selectAllChecked}
                />
                {t("deposits.selectAll")}
            </div>
            <PrimaryTable
                stickyFirstCol={false}
                stickyHeader={true}
                maxHeight={470}
                rows={tableRows}
                headers={tableHeaders}
            />
            <div dir={footerDirection}>
                <div dir={direction} style={classes.tabFooterStyle}>
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
        </div>

    );
};

export { DepositTabTable };