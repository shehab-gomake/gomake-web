import { useTranslation } from "react-i18next";
import { TableCell, styled, tableCellClasses } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { totalDocumentsState, totalPaymentState, finalTotalPaymentState, totalCashState, totalBitState, totalTransferState, totalChecksState, checksRowState } from "../buttons-container/states";
import { quoteItemState } from "@/store";

const usePaymentsTable = () => {
    const { t } = useTranslation();
    const [checkedItems, setCheckedItems] = useState({});
    const [totalSum, setTotalSum] = useRecoilState<number>(totalDocumentsState);
    const [totalPayment, setTotalPayment] = useRecoilState<number>(totalPaymentState);
    const [finalTotalPayment, setFinalTotalPayment] = useRecoilState<number>(finalTotalPaymentState);
    const resetTotalPayment = useResetRecoilState(totalPaymentState);
    const resetTotalBit = useResetRecoilState(totalBitState);
    const resetTotalCash = useResetRecoilState(totalCashState);
    const resetTotalTransfer = useResetRecoilState(totalTransferState);
    const resetTotalChecks = useResetRecoilState(totalChecksState);
    const resetChecksTable = useResetRecoilState(checksRowState);

    const columnWidths = ["5%", "19%", "19%", "19%", "19%", "19%"];

    const tableHeaders = [
        "#",
        t("payment.documentDate"),
        t("payment.documentNumber"),
        t("payment.documentType"),
        t("payment.detail"),
        t("payment.sum"),

    ];

    const quoteItemValue = useRecoilValue<any>(quoteItemState);
    const tableRows =  quoteItemValue?.receiptItems;
    //const tableRowss = useMemo(() => quoteItemValue?.receiptItems, [quoteItemValue]);

  

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

    const handleCheckboxChange = (index) => {
        setCheckedItems((prevCheckedItems) => {
            const updatedCheckedItems = {
                ...prevCheckedItems,
                [index]: !prevCheckedItems[index],
            };

            let sum = 0;
            tableRows.forEach((item, index) => {
                if (updatedCheckedItems[index]) {
                    sum += item.sumApplied;
                }
            });

             setTotalSum(sum);
            return updatedCheckedItems;
        });
    };
    
    const handleSave = () => {
        setFinalTotalPayment(totalPayment);
    };

    return {
        t,
        columnWidths,
        tableHeaders,
        tableRows,
        PrimaryTableCell,
        totalSum,
        checkedItems,
        handleCheckboxChange,
        totalPayment,
        setTotalPayment,
        resetTotalPayment,
        handleSave,
        finalTotalPayment,
        resetTotalCash,
        resetTotalBit,
        resetTotalTransfer,
        resetTotalChecks,
        resetChecksTable
    };
};

export { usePaymentsTable };
