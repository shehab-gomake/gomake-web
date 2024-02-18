import { useTranslation } from "react-i18next";
import { TableCell, styled, tableCellClasses } from "@mui/material";
import { useEffect,useState } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { totalDocumentsState, totalPaymentState, finalTotalPaymentState, totalCashState, totalBitState, totalTransferState, totalChecksState, checksRowState, CheckData } from "../buttons-container/states";
import { quoteItemState } from "@/store";

const usePaymentsTable = () => {
    const { t } = useTranslation();
    const [quoteItemValue , setQuoteItemValue] = useRecoilState<any>(quoteItemState);
    const [checkedItems, setCheckedItems] = useState({});
    const [checkedItemsIds, setCheckedItemsIds] = useState({});
    const [totalSum, setTotalSum] = useRecoilState<number>(totalDocumentsState);
    const [totalPayment, setTotalPayment] = useRecoilState<number>(totalPaymentState);
    const [finalTotalPayment, setFinalTotalPayment] = useRecoilState<number>(finalTotalPaymentState);
    const resetTotalPayment = useResetRecoilState(totalPaymentState);
    const resetTotalBit = useResetRecoilState(totalBitState);
    const totalBit = useRecoilValue<number>(totalBitState);
    const resetTotalCash = useResetRecoilState(totalCashState);
    const totalCash = useRecoilValue<number>(totalCashState);
    const resetTotalTransfer = useResetRecoilState(totalTransferState);
    const resetTotalChecks = useResetRecoilState(totalChecksState);
    const checksReceipt = useRecoilState<CheckData[]>(checksRowState);
    const resetChecksTable = useResetRecoilState(checksRowState);
    const resetFinalTotalPayment = useResetRecoilState(finalTotalPaymentState);
    const tableRows =  quoteItemValue?.receiptItems;
    const columnWidths = ["5%", "19%", "19%", "19%", "19%", "19%"];

    const tableHeaders = [
        "#",
        t("payment.documentDate"),
        t("payment.documentNumber"),
        t("payment.documentType"),
        t("payment.detail"),
        t("payment.sum"),

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

    const handleCheckboxChange = (index, itemId) => {
        setCheckedItems((prevCheckedItems) => {
            const updatedCheckedItems = {
                ...prevCheckedItems,
                [index]: !prevCheckedItems[index],
            };

            setCheckedItemsIds((prevCheckedItemsIds) => {
                const updatedCheckedItemsIds = {
                    ...prevCheckedItemsIds,
                };

                if (updatedCheckedItems[index]) {
                    updatedCheckedItemsIds[index] = itemId;
                } else {
                    delete updatedCheckedItemsIds[index];
                }

                return updatedCheckedItemsIds;
            });

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
        const receiptItemCopy = {
            ...quoteItemValue,
            bitTotal: totalBit,
            cashTotal: totalCash,
            receiptChecks: checksReceipt,
            checkedItemsIds :checkedItemsIds

        };
        setQuoteItemValue(receiptItemCopy);
        setFinalTotalPayment(totalPayment);
    };

    useEffect(() => {
        if (totalSum === 0)
            resetFinalTotalPayment();
    }, [totalSum])

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
