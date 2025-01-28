import { useTranslation } from "react-i18next";
import { Stack, TableCell, styled, tableCellClasses } from "@mui/material";
import { useCallback, useState } from "react";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  totalDocumentsState,
  totalPaymentState,
  finalTotalPaymentState,
  totalCashState,
  totalBitState,
  totalTransferState,
  totalChecksState,
  checksRowState,
  CheckData,
  checkedItemsIdsState,
  transferTabState,
  prevStateState,
  prevStateStateData,
  taxDeductionState,
  checksAccountCodeState,
  totalCreditCardState,
  CreditCardData,
  creditCardState,
  ReceiptCreditCardData,
  receiptCreditCardState,
  selectedCreditTransactionState,
  transactionOptionsData,
  cashAccountCodeState,
  allocatedSumsState,
} from "../buttons-container/states";
import { quoteItemState } from "@/store";
import { useRouter } from "next/router";
import {
  firstWidgetState,
  isTransactedState,
  secondWidgetState,
  thirdWidgetState,
} from "./states";
import CustomMethodsTable from "./Payment-methods-details/methods-table";
import { usePaymentMethodsTabs } from "../buttons-container/payment/payment-methods-tabs/use-payment-methods-tabs";

const usePaymentsTable = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [documentItemValue, setDocumentItemValue] =
    useRecoilState<any>(quoteItemState);
  const tableRows = documentItemValue?.receiptItems;
  const setCheckedItemsIds = useSetRecoilState(checkedItemsIdsState);
  const resetCheckedItemsIds = useResetRecoilState(checkedItemsIdsState);
  // total documents
  const [totalSum, setTotalSum] = useRecoilState<number>(totalDocumentsState);
  const resetTotalSum = useResetRecoilState(totalDocumentsState);
  // final total payment
  const [finalTotalPayment, setFinalTotalPayment] = useRecoilState<number>(
    finalTotalPaymentState
  );
  const resetFinalTotalPayment = useResetRecoilState(finalTotalPaymentState);
  // total payment
  const [totalPayment, setTotalPayment] =
    useRecoilState<number>(totalPaymentState);
  const resetTotalPayment = useResetRecoilState(totalPaymentState);
  //bit
  const [totalBit, setTotalBit] = useRecoilState<number>(totalBitState);
  const resetTotalBit = useResetRecoilState(totalBitState);
  //cash
  const [totalCash, setTotalCash] = useRecoilState<number>(totalCashState);
  const resetTotalCash = useResetRecoilState(totalCashState);
  // transfer
  const [totalTransfer, setTotalTransfer] =
    useRecoilState<number>(totalTransferState);
  const [transferState, setTransferState] =
    useRecoilState<any>(transferTabState);
  const resetTotalTransfer = useResetRecoilState(totalTransferState);
  const resetTransferTabState = useResetRecoilState(transferTabState);
  //checks
  const [totalChecks, setTotalChecks] =
    useRecoilState<number>(totalChecksState);
  const [checksReceipt, setChecksReceipt] =
    useRecoilState<CheckData[]>(checksRowState);
  const resetTotalChecks = useResetRecoilState(totalChecksState);
  const resetChecksReceipt = useResetRecoilState(checksRowState);
  // withholding tax
  const [taxDeduction, setTaxDeduction] =
    useRecoilState<number>(taxDeductionState);
  const resetTaxDeduction = useResetRecoilState(taxDeductionState);
  // accounts code
  const [checkAccountCode, setCheckAccountCode] = useRecoilState<any>(
    checksAccountCodeState
  );
  const resetCheckAccountCode = useResetRecoilState(checksAccountCodeState);
  const [cashAccountCode, setCashAccountCode] =
    useRecoilState<any>(cashAccountCodeState);
  const resetCashAccountCode = useResetRecoilState(cashAccountCodeState);
  // creditCard
  const [totalCreditCard, setTotalCreditCard] =
    useRecoilState<number>(totalCreditCardState);
  const resetTotalCreditCard = useResetRecoilState(totalCreditCardState);
  const [creditCardSate, setCreditCardState] =
    useRecoilState<CreditCardData>(creditCardState);
  const resetCreditCardState = useResetRecoilState(creditCardState);
  const [secondCreditCard, setSecondCreditCard] =
    useRecoilState<ReceiptCreditCardData>(receiptCreditCardState);
  const resetSecondCreditCardState = useResetRecoilState(
    receiptCreditCardState
  );
  const [transactionSelected, setTransactionSelected] =
    useRecoilState<transactionOptionsData>(selectedCreditTransactionState);
  const resetSelectedCreditTransaction = useResetRecoilState(
    selectedCreditTransactionState
  );
  // flag isTransacted
  const resetIsTransactedState = useResetRecoilState(isTransactedState);

  const { onClickMakePayment } = usePaymentMethodsTabs();
  const isNewReceipt = router?.query?.isNewCreation;
  const columnWidths = isNewReceipt
    ? ["5%", "15%", "15%", "15%", "15%", "15%", "15%"]
    : ["16%", "16%", "16%", "16%", "18%", "16%"];

  const tableHeaders = [
    isNewReceipt && "#",
    t("payment.documentDate"),
    t("reports.valueDate"),
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

  //!here
  const handleCheckboxChange = (index, itemId) => {
    const newTableRow = tableRows.map((row) =>
      row.id === itemId ? { ...row, isChecked: false } : row
    );
    setDocumentItemValue({ ...documentItemValue, receiptItems: newTableRow });
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

  const handleCheckboxChangeNew = (index, itemId) => {
    const newTableRow = tableRows.map((row) => {
      if (row.id === itemId) {
        // Add the newSumApplied field to the item, taking its value from allocatedSums
        const newSumApplied = allocatedSums[index] || 0;
        return { ...row, isChecked: !row.isChecked, newSumApplied }; // Add the new field
      }
      return row;
    });

    setDocumentItemValue({ ...documentItemValue, receiptItems: newTableRow });

    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = {
        ...prevCheckedItems,
        [index]: !prevCheckedItems[index], // Toggle checked state
      };

      // Update checked item IDs
      setCheckedItemsIds((prevCheckedItemsIds) => {
        const updatedCheckedItemsIds = { ...prevCheckedItemsIds };
        if (updatedCheckedItems[index]) {
          updatedCheckedItemsIds[index] = itemId;
        } else {
          delete updatedCheckedItemsIds[index];
        }
        return updatedCheckedItemsIds;
      });

      // Recalculate total sum for checked items
      let sum = 0;
      tableRows.forEach((item, idx) => {
        if (updatedCheckedItems[idx]) {
          sum += item.sumApplied;
        }
      });

      setTotalSum(sum);

      // Now, when the item is checked, calculate its allocated sum
      if (updatedCheckedItems[index]) {
        // Calculate allocated sum for the newly checked item
        setAllocatedSums((prev) => {
          const updated = { ...prev };
          let remaining = remainingTotal;
          const allocatable = Math.min(remaining, tableRows[index].sumApplied);
          updated[index] = allocatable;
          remaining -= allocatable;
          setRemainingTotal(remaining); // Update remaining total

          return updated;
        });
      } else {
        // If unchecked, clear the allocated sum and adjust remaining total
        setAllocatedSums((prev) => {
          const updated = { ...prev };
          const releasedAmount = updated[index] || 0;
          delete updated[index];
          setRemainingTotal((prevRemaining) => prevRemaining + releasedAmount); // Restore the released amount

          return updated;
        });
      }

      return updatedCheckedItems;
    });
  };

  const isTransacted = useRecoilValue<boolean>(isTransactedState);

  const handleSave = (transactionData?, isResetTotal = false) => {
    const creditCardTotalValue = isResetTotal ? 0 : totalCreditCard; // Use 0 if reset

    const finalTotalPayment = isResetTotal
      ? totalPayment - totalCreditCard
      : totalPayment; // Use 0 if reset

    const isSecondCreditCardEmpty =
      Object.keys(secondCreditCard).length === 0 &&
      secondCreditCard.constructor === Object;
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
      // creditCardTotal: totalCreditCard,
      creditCardTotal: creditCardTotalValue,
      receiptCreditCards: isSecondCreditCardEmpty
        ? transactionData
          ? [transactionData]
          : []
        : [secondCreditCard],
    };
    setDocumentItemValue(receiptItemCopy);
    //setFinalTotalPayment(totalPayment);

    setFinalTotalPayment(finalTotalPayment);

    savePreviousState(); // save previous state
  };

  const handleTaxDeductionChange = (event) => {
    setTaxDeduction(event.target.value);
  };

  // Previous State //

  const [previousState, setPreviousState] =
    useRecoilState<prevStateStateData>(prevStateState);
  const resetPreviousState = useResetRecoilState(prevStateState);

  const savePreviousState = () => {
    let cardWidgetValue;

    if (firstWidget) {
      cardWidgetValue = 1;
    } else if (secondWidget) {
      cardWidgetValue = 2;
    } else if (thirdWidget) {
      cardWidgetValue = 3;
    }
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
      creditCardState: creditCardSate,
      secondCreditCard: secondCreditCard,
      cardWidget: cardWidgetValue,
      selectedCreditTransaction: transactionSelected,
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
    setSecondCreditCard(previousState.secondCreditCard);
    setTransactionSelected(previousState.selectedCreditTransaction);
    setFirstWidget(previousState.cardWidget === 1);
    setSecondWidget(previousState.cardWidget === 2);
    setThirdWidget(previousState.cardWidget === 3);
  };

  const resetReceiptState = () => {
    // Clear the previous state as it’s not needed when changing the client
    resetPreviousState();
    // Clear the previous state as it’s not needed when changing the client

    setCheckedItems([]);
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
    resetSecondCreditCardState();
    resetIsTransactedState();
    resetSelectedCreditTransaction();
  };

  // Credit card widgets //
  const [firstWidget, setFirstWidget] =
    useRecoilState<boolean>(firstWidgetState);
  const [secondWidget, setSecondWidget] =
    useRecoilState<boolean>(secondWidgetState);
  const [thirdWidget, setThirdWidget] =
    useRecoilState<boolean>(thirdWidgetState);

  const setActiveWidget = (first: boolean, second: boolean, third: boolean) => {
    setFirstWidget(first);
    setSecondWidget(second);
    setThirdWidget(third);
  };

  const handleFirstButtonClick = () => {
    setTotalPayment(totalPayment - totalCreditCard);
    resetTotalCreditCard();
    resetCreditCardState();
    resetSecondCreditCardState();
    /*  Open manual credit card method */
    setActiveWidget(true, false, false);
    /*  Open manual credit card method */
  };

  const handleSecondButtonClick = () => {
    setTotalPayment(totalPayment - totalCreditCard);
    resetTotalCreditCard();
    resetCreditCardState();
    resetSecondCreditCardState();

    /*  Open credit details without swipe method */
    setActiveWidget(false, true, false);
    /*  Open credit details without swipe method */
  };

  const handleThirdButtonClick = () => {
    setTotalPayment(totalPayment - totalCreditCard);
    resetTotalCreditCard();
    resetCreditCardState();
    resetSecondCreditCardState();

    /*  Open processing via PinPad method */
    setActiveWidget(false, false, true);
    /*  Open processing via PinPad method */
  };

  const isShowReceiptTransference =
    !isNewReceipt &&
    documentItemValue?.receiptTransfers?.length > 0 &&
    documentItemValue?.transferSum > 0;
  const ReceiptTransferenceComponent: React.FC = () => {
    const transferenceHeaders = [
      "transferDate",
      "transferAccount",
      "transferSum",
    ]; // Define headers
    const transferenceRows = documentItemValue?.receiptTransfers; // Use your method to render rows
    const columnWidths = ["30%", "30%", "30%"];

    return (
      <CustomMethodsTable
        headers={transferenceHeaders}
        rows={transferenceRows}
        columnWidths={columnWidths}
      />
    );
  };

  const isShowReceiptCreditCards =
    !isNewReceipt &&
    documentItemValue?.receiptCreditCards?.length > 0 &&
    documentItemValue?.creditCardTotal > 0;
  const ReceiptCreditCardsComponent: React.FC = () => {
    const creditCardHeaders = [
      "creditCardNum",
      "installments",
      "creditCardSum",
    ];
    const creditCardRows = documentItemValue?.receiptCreditCards;
    const columnWidths = ["30%", "30%", "30%"];

    return (
      <CustomMethodsTable
        headers={creditCardHeaders}
        rows={creditCardRows}
        columnWidths={columnWidths}
      />
    );
  };

  const isShowReceiptChecks =
    !isNewReceipt &&
    documentItemValue?.receiptChecks?.length > 0 &&
    documentItemValue?.checksTotal > 0;
  const ReceiptChecksComponent: React.FC = () => {
    const checkHeaders = [
      "dueDate",
      "checkNumber",
      "bankCode",
      "branch",
      "checkSum",
    ];
    const checkRows = documentItemValue?.receiptChecks;
    const columnWidths = ["20%", "20%", "20%", "20%", "20%"];

    return (
      <CustomMethodsTable
        headers={checkHeaders}
        rows={checkRows}
        columnWidths={columnWidths}
      />
    );
  };

  const [openMethodsDetailsModal, setOpenMethodsDetailsModal] =
    useState<boolean>(false);

  const handleOpenMethodsDetailsModal = () => {
    setOpenMethodsDetailsModal(true);
  };

  const handleCloseMethodsDetailsModal = () => {
    setOpenMethodsDetailsModal(false);
  };

  const [openTransactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const handleOpenTransactionModal = () => {
    setOpenTransactionModal(true);
  };

  //!here
  // const [allocatedSums, setAllocatedSums] = useState<Record<string, number>>(
  //   {}
  // );
  const [allocatedSums, setAllocatedSums] = useRecoilState(allocatedSumsState);

  const [remainingTotal, setRemainingTotal] = useState(0);

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
    resetReceiptState,
    setCheckedItems,
    isShowReceiptTransference,
    ReceiptTransferenceComponent,
    isShowReceiptCreditCards,
    ReceiptCreditCardsComponent,
    isShowReceiptChecks,
    ReceiptChecksComponent,
    openMethodsDetailsModal,
    handleOpenMethodsDetailsModal,
    handleCloseMethodsDetailsModal,

    totalCreditCard,
    isTransacted,
    onClickMakePayment,
    creditCardSate,
    setFirstWidget,
    setSecondWidget,
    setThirdWidget,
    setActiveWidget,
    transactionSelected,

    openTransactionModal,
    handleOpenTransactionModal,
    setOpenTransactionModal,
    resetTotalCreditCard,
    resetCreditCardState,

    remainingTotal,
    setRemainingTotal,
    allocatedSums,
    setAllocatedSums,
  };
};

export { usePaymentsTable };
