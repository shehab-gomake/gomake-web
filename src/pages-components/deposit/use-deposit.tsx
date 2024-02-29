
import { useTranslation } from "react-i18next";
import { TableCell, styled, tableCellClasses } from "@mui/material";

const useDeposit = () => {
    const { t } = useTranslation();

    const tableHeaders = [
        t("deposits.date"),
        t("deposits.client"),
        t("deposits.checkNum"),
        t("deposits.bank"),
        t("deposits.branch"),
        t("deposits.receiptNum"),
        t("properties.total")
    ];

    const PrimaryTableCell = styled(TableCell)(() => {
        return {
            [`&.${tableCellClasses.head}`]: {
                padding: 0,
            },
            [`&.${tableCellClasses.body}`]: {
                padding: 0,
            },
        };
    });

    return {
        t,
        tableHeaders,
        PrimaryTableCell
    };
};

export { useDeposit };
