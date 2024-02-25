import { useTranslation } from "react-i18next";
import { TableCell, styled, tableCellClasses } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import { totalDocumentsState, totalPaymentState, finalTotalPaymentState, totalCashState, totalBitState, totalTransferState, totalChecksState, checksRowState, CheckData, checkedItemsIdsState, transferTabState, prevStateState, prevStateStateData, taxDeductionState, checksAccountCodeState,  totalCreditCardState, CreditCardData, creditCardState } from "../buttons-container/states";
import { quoteItemState } from "@/store";
import { useRouter } from "next/router";

const usePaymentsTable = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [checkedItems, setCheckedItems] = useState({});
    const [documentItemValue, setDocumentItemValue] = useRecoilState<any>(quoteItemState);
    const tableRows = documentItemValue?.receiptItems;
    const setCheckedItemsIds = useSetRecoilState(checkedItemsIdsState);
    const resetCheckedItemsIds = useResetRecoilState(checkedItemsIdsState);
    // total documents
    const [totalSum, setTotalSum] = useRecoilState<number>(totalDocumentsState);
    const resetTotalSum = useResetRecoilState(totalDocumentsState);
    // final total payment
    const [finalTotalPayment, setFinalTotalPayment] = useRecoilState<number>(finalTotalPaymentState);
    const resetFinalTotalPayment = useResetRecoilState(finalTotalPaymentState);
    // total payment
    const [totalPayment, setTotalPayment] = useRecoilState<number>(totalPaymentState);
    const resetTotalPayment = useResetRecoilState(totalPaymentState);
    //bit
    const [totalBit, setTotalBit] = useRecoilState<number>(totalBitState);
    const resetTotalBit = useResetRecoilState(totalBitState);
    //cash
    const [totalCash, setTotalCash] = useRecoilState<number>(totalCashState);
    const resetTotalCash = useResetRecoilState(totalCashState);
    // transfer
    const [totalTransfer, setTotalTransfer] = useRecoilState<number>(totalTransferState);
    const [transferState, setTransferState] = useRecoilState<any>(transferTabState);
    const resetTotalTransfer= useResetRecoilState(totalTransferState);
    const resetTransferTabState = useResetRecoilState(transferTabState);
    //checks
    const [totalChecks, setTotalChecks] = useRecoilState<number>(totalChecksState);
    const [checksReceipt, setChecksReceipt] = useRecoilState<CheckData[]>(checksRowState);
    const resetTotalChecks = useResetRecoilState(totalChecksState);
    const resetChecksReceipt = useResetRecoilState(checksRowState);
    // withholding tax
    const [taxDeduction, setTaxDeduction] = useRecoilState<number>(taxDeductionState);
    const resetTaxDeduction = useResetRecoilState(taxDeductionState);
    // accounts code
    const [checkAccountCode, setCheckAccountCode] = useRecoilState<any>(checksAccountCodeState);
    const resetCheckAccountCode = useResetRecoilState(checksAccountCodeState);
    const [cashAccountCode, setCashAccountCode] = useRecoilState<any>(checksAccountCodeState);
    const resetCashAccountCode = useResetRecoilState(checksAccountCodeState);
    // creditCard 
    const [totalCreditCard, setTotalCreditCard] = useRecoilState<number>(totalCreditCardState);
    const resetTotalCreditCard= useResetRecoilState(totalCreditCardState);
    const [creditCardSate , setCreditCardState] = useRecoilState<CreditCardData>(creditCardState);
    const resetCreditCardState= useResetRecoilState(creditCardState);

    const isNewReceipt = router?.query?.isNewCreation;
    const columnWidths =
    isNewReceipt ? 
     [
        "5%",
        "19%",
        "19%",
        "19%",
        "19%",
        "19%"
    ] : [
        "20%",
        "20%",
        "20%",
        "20%",
        "20%",
        "20%"
    ];
    
    const tableHeaders = [
        isNewReceipt && "#",
        t("payment.documentDate"),
        t("payment.documentNumber"),
        t("payment.documentType"),
        t("payment.detail"),
        t("payment.sum"),
    ].filter(Boolean);

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
            ...documentItemValue,
            bitSum: Number(totalBit),
            cashSum: Number(totalCash),
            checksTotal: Number(totalChecks),
            receiptChecks: Number(totalChecks) === 0 ? [] : checksReceipt,
            transferAccount: transferState?.transferAccount,
            transferDate: transferState?.transferDate,
            transferReference: transferState?.transferReference,
            transferSum: Number(totalTransfer),
            wtTaxableAmount: Number(taxDeduction),
            checksAccount: checkAccountCode,
            cashAccount: cashAccountCode,
            creditCardTotal: totalCreditCard,

        };
        setDocumentItemValue(receiptItemCopy);
        setFinalTotalPayment(totalPayment);
        savePreviousState(); // save previous state
    };

    const handleTaxDeductionChange = (event) => {
        setTaxDeduction(event.target.value);
    };

    // Previous State // 
    const [previousState, setPreviousState] = useRecoilState<prevStateStateData>(prevStateState);
    const savePreviousState = () => {
        setPreviousState({
            totalBit: totalBit,
            totalCash: totalCash,
            totalChecks: totalChecks,
            totalTransfer: totalTransfer,
            transferState: transferState,
            checksReceipt: checksReceipt,
            taxDeduction: taxDeduction,
            checkAccountCode: checkAccountCode,
            cashAccountCode: cashAccountCode,
            totalCreditCard: totalCreditCard,
            creditCardState:creditCardSate
        });
    };

    const revertToPreviousState = () => {
        setTotalBit(previousState.totalBit);
        setTotalCash(previousState.totalCash);
        setTotalTransfer(previousState.totalTransfer);
        setTransferState(previousState.transferState);
        setTotalChecks(previousState.totalChecks);
        setChecksReceipt(previousState.checksReceipt);
        setTaxDeduction(previousState.taxDeduction);
        setCheckAccountCode(previousState.checkAccountCode);
        setCashAccountCode(previousState.cashAccountCode);
        setTotalCreditCard(previousState.totalCreditCard);
        setCreditCardState(previousState.creditCardState);
    };

    const resetReceiptState = () => {
        setCheckedItems(null);
        resetCheckedItemsIds();
        resetTotalPayment();
        resetFinalTotalPayment();
        resetTotalSum();
        resetTotalBit();
        resetTotalCash();
        resetTotalTransfer();
        resetTransferTabState();
        resetTotalChecks();
        resetChecksReceipt();
        resetTaxDeduction();
        setCheckAccountCode(previousState.checkAccountCode);
        setCashAccountCode(previousState.cashAccountCode);
        resetCheckAccountCode();
        resetCashAccountCode();
        resetTotalCreditCard();
        resetCreditCardState();
    };

    const [firstWidget, setFirstWidget] = useState(true);
    const [secondWidget, setSecondWidget] = useState(false);
    const [thirdWidget, setThirdWidget] = useState(false);


    const handleFirstButtonClick = () => {
        setTotalPayment(totalPayment - totalCreditCard);
        resetTotalCreditCard();
        resetCreditCardState();

        setFirstWidget(true);
        setSecondWidget(false);
        setThirdWidget(false);
    };

    const handleSecondButtonClick = () => {
        setTotalPayment(totalPayment - totalCreditCard);
        resetTotalCreditCard();
        resetCreditCardState();

        setFirstWidget(false);
        setSecondWidget(true);
        setThirdWidget(false);
    };

    const handleThirdButtonClick = () => {
        setTotalPayment(totalPayment - totalCreditCard);
        resetTotalCreditCard();
        resetCreditCardState();

        setFirstWidget(false);
        setSecondWidget(false);
        setThirdWidget(true);
    };

    return {
        t,
        documentItemValue,
        columnWidths,
        tableHeaders,
        tableRows,
        PrimaryTableCell,
        totalSum,
        checkedItems,
        handleCheckboxChange,
        totalPayment,
        setTotalPayment,
        handleSave,
        finalTotalPayment,
        handleTaxDeductionChange,
        taxDeduction,
        savePreviousState,
        revertToPreviousState,
        setTotalTransfer,
        setTotalCash,
        setTotalBit,
        previousState,
        isNewReceipt,
        firstWidget,
        secondWidget,
        thirdWidget,
        handleFirstButtonClick,
        handleSecondButtonClick,
        handleThirdButtonClick,
        resetReceiptState
    };
};

export { usePaymentsTable };