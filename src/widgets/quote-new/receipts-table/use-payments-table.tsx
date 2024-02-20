import { useTranslation } from "react-i18next";
import { TableCell, styled, tableCellClasses } from "@mui/material";
import { useState } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { totalDocumentsState, totalPaymentState, finalTotalPaymentState, totalCashState, totalBitState, totalTransferState, totalChecksState, checksRowState, CheckData, isSavedPaymentState, checkedItemsIdsState, transferTabState, prevStateState, prevStateStateData } from "../buttons-container/states";
import { quoteItemState } from "@/store";

const usePaymentsTable = () => {
    const { t } = useTranslation();
    const [checkedItems, setCheckedItems] = useState({});
    const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
    const tableRows = quoteItemValue?.receiptItems;
    const [isSavePayment,setIsSavePayment] = useRecoilState<boolean>(isSavedPaymentState);
    const [checkedItemsIds, setCheckedItemsIds] = useRecoilState(checkedItemsIdsState);
    const [totalSum, setTotalSum] = useRecoilState<number>(totalDocumentsState);
    const [finalTotalPayment, setFinalTotalPayment] = useRecoilState<number>(finalTotalPaymentState);

    // total payment
    const resetTotalPayment = useResetRecoilState(totalPaymentState);
    const [totalPayment, setTotalPayment] = useRecoilState<number>(totalPaymentState);
    //bit
    const resetTotalBit = useResetRecoilState(totalBitState);
    const [totalBit, setTotalBit] = useRecoilState<number>(totalBitState);
    //cash
    const resetTotalCash = useResetRecoilState(totalCashState);
    const [totalCash,setTotalCash] = useRecoilState<number>(totalCashState);
    // transfer
    const resetTotalTransfer = useResetRecoilState(totalTransferState);
    const resetTransferTabState = useResetRecoilState(transferTabState);
    const [totalTransfer, setTotalTransfer] = useRecoilState<number>(totalTransferState);
    //checks
    const resetTotalChecks = useResetRecoilState(totalChecksState);
    const [totalChecks,setTotalChecks] = useRecoilState<number>(totalChecksState);
    const [checksReceipt, setChecksReceipt] = useRecoilState<CheckData[]>(checksRowState);
    const resetChecksTable = useResetRecoilState(checksRowState);

    const columnWidths = [
        "5%",
        "19%",
        "19%",
        "19%",
        "19%",
        "19%"
    ];
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


    const [transferState, setTransferState] = useRecoilState<any>(transferTabState);

    const handleSave = () => {
        const receiptItemCopy = {
            ...quoteItemValue,
            bitSum: Number(totalBit),
            cashSum: Number(totalCash),
            checksTotal: Number(totalChecks),
            receiptChecks: checksReceipt, 
            transferAccount: transferState?.transferAccount,
            transferDate: transferState?.transferDate,
            transferReference:transferState?.transferReference,
            transferSum: Number(totalTransfer),
        };
        setQuoteItemValue(receiptItemCopy);
        setFinalTotalPayment(totalPayment);

        // save previous state
        savePreviousState();
    };




////////////////////////////////////////////////////////////////

const [previousState, setPreviousState] = useRecoilState<prevStateStateData>(prevStateState);
const savePreviousState = () => {
    setPreviousState({
        totalBit: totalBit,
        totalCash: totalCash,
        totalChecks:totalChecks,
        totalTransfer: totalTransfer,
        transferState :transferState,
        checksReceipt :checksReceipt
    });
};

const revertToPreviousState = () => {
     setTotalBit(previousState.totalBit);
     setTotalCash(previousState.totalCash);
     setTotalTransfer(previousState.totalTransfer);
     setTransferState(previousState.transferState);
     setTotalChecks(previousState.totalChecks);
     setChecksReceipt(previousState.checksReceipt);

};

///////////////////////////////////////////////////////////////

    // ??????????????? how it affect
    const [taxDeduction, setTaxDeduction] = useState("");
    const handleTaxDeductionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaxDeduction(event.target.value);
        setQuoteItemValue((prev: any) => ({
            ...prev,
            wtTaxableAmount: event.target.value,
        }));
    };

    return {
        t,
        quoteItemValue,
        setQuoteItemValue,
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
        resetChecksTable,
        handleTaxDeductionChange,
        taxDeduction,
        isSavePayment,
        resetTransferTabState,
        setIsSavePayment,
        savePreviousState,
        revertToPreviousState,
        setTotalTransfer,
        setTotalCash,
        setTotalBit,
        previousState
    };
};

export { usePaymentsTable };