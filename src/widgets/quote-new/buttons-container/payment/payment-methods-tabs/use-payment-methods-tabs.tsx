import { IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { MoreMenuWidget } from "../more-circle";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  CheckData,
  CreditCardData,
  ReceiptCreditCardData,
  checksRowState,
  creditCardState,
  creditTransactionsState,
  receiptCreditCardState,
  selectedCreditTransactionState,
  taxDeductionState,
  totalBitState,
  totalCashState,
  totalChecksState,
  totalCreditCardState,
  totalPaymentState,
  totalSupplierCreditCardState,
  totalTransferState,
  transactionOptionsData,
  transferTabState,
} from "../../states";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { createCreditTransactionApi } from "@/services/api-service/generic-doc/receipts-api";
import {
  firstWidgetState,
  isTransactedState,
  secondWidgetState,
  thirdWidgetState,
} from "@/widgets/quote-new/receipts-table/states";
import { loadingWithShadowState, quoteItemState } from "@/store";
import { useRouter } from "next/router";

const usePaymentMethodsTabs = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const isOutgoingPayments = router.query.isOutgoingPayments === "true";
  const { alertSuccessUpdate, alertFault } = useSnackBar();
  const setTotalPayment = useSetRecoilState<number>(totalPaymentState);
  const [totalChecks, setTotalChecks] =
    useRecoilState<number>(totalChecksState);
  const [data, setData] = useRecoilState<CheckData[]>(checksRowState);
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const resetTotalBit = useResetRecoilState(totalBitState);
  const resetTotalTransfer = useResetRecoilState(totalTransferState);
  const resetTransferTabState = useResetRecoilState(transferTabState);

  const checkNumberBase = useMemo(() => {
    return isOutgoingPayments && quoteItemValue?.checksSerialNumber
      ? quoteItemValue?.checksSerialNumber
      : 0;
  }, [isOutgoingPayments, quoteItemValue]);

  useEffect(() => {
    if (isOutgoingPayments && data.length === 1 && !data[0].checkNumber) {
      const initialRow = {
        ...data[0],
        checkNumber: Number(checkNumberBase),
      };
      setData([initialRow]);
    }
  }, []);

  const addRow = () => {
    if (isOutgoingPayments) {
      const lastRow = data[data.length - 1];
      const newRow = {
        ...lastRow,
        checkNumber: Number(checkNumberBase) + data.length,
      };
      setData((prevData) => [...prevData, newRow]);
    } else {
      const newRow = {
        dueDate: new Date().toISOString().split("T")[0],
        checkNumber: 0,
        bankCode: "",
        branch: "",
        accountNum: "",
        checkSum: 0,
      };
      setData((prevData) => [...prevData, newRow]);
    }
  };

  const duplicateRow = (index) => {
    const rowToDuplicate = data[index];
    if (isOutgoingPayments) {
      const duplicatedRow = {
        ...rowToDuplicate,
        checkNumber: Number(checkNumberBase) + data.length,
      };
      setData((prevData) => [...prevData, duplicatedRow]);
    } else {
      setData((prevData) => [...prevData, { ...rowToDuplicate }]);
    }
  };

  const deleteRow = (index) => {
    setData((prevData) => {
      const newData = prevData.filter((_, i) => i !== index);
      if (isOutgoingPayments) {
        return newData.map((row, idx) => ({
          ...row,
          checkNumber: Number(checkNumberBase) + idx,
        }));
      }
      return newData;
    });
  };

  const handleInputChange = (index, fieldName, value) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [fieldName]: value,
      };
      return newData;
    });
  };

  const tableHeaders = [
    t("payment.dueDate"),
    t("payment.checkNumber"),
    t("payment.bankName"),
    t("payment.branch"),
    t("payment.account"),
    t("payment.sum"),
    <IconButton onClick={addRow} style={{ color: "#5859A8" }}>
      <AddCircleOutlineIcon />
    </IconButton>,
  ];

  const getTableRow = (row, index) => [
    <input
      style={{ width: "100px" }}
      type="date"
      value={row.dueDate}
      onChange={(e) => handleInputChange(index, "dueDate", e.target.value)}
    />,
    <input
      style={{ width: "100px" }}
      type="number"
      value={row.checkNumber}
      placeholder={t("payment.checkNumber")}
      onChange={(e) => handleInputChange(index, "checkNumber", e.target.value)}
      readOnly={!!isOutgoingPayments && quoteItemValue?.checksSerialNumber}
    />,
    <input
      style={{ width: "100px" }}
      type="text"
      value={row.bankCode}
      placeholder={t("payment.bankName")}
      onChange={(e) => handleInputChange(index, "bankCode", e.target.value)}
    />,
    <input
      style={{ width: "100px" }}
      type="text"
      value={row.branch}
      placeholder={t("payment.branch")}
      onChange={(e) => handleInputChange(index, "branch", e.target.value)}
    />,
    <input
      style={{ width: "100px" }}
      type="text"
      value={row.accountNum}
      placeholder={t("payment.account")}
      onChange={(e) => handleInputChange(index, "accountNum", e.target.value)}
    />,
    <input
      style={{ width: "100px" }}
      type="number"
      value={row.checkSum}
      placeholder={t("payment.sum")}
      onChange={(e) => handleInputChange(index, "checkSum", e.target.value)}
    />,
    <MoreMenuWidget
      onClickDuplicate={() => duplicateRow(index)}
      onClickDelete={() => deleteRow(index)}
    />,
  ];

  const [taxDeduction, setTaxDeduction] =
    useRecoilState<number>(taxDeductionState);

  // Cash tab ///
  const [totalCash, setTotalCash] = useRecoilState<number>(totalCashState);
  const handleTotalCashChange = (value) => {
    setTotalCash(value);
    setTotalPayment(
      Number(value) +
        Number(totalBit) +
        Number(totalTransfer) +
        Number(totalChecks) +
        (isOutgoingPayments
          ? Number(totalSupplierCreditCard)
          : Number(totalCreditCard)) +
        Number(taxDeduction)
    );
  };

  // Bit tab //
  const [totalBit, setTotalBit] = useRecoilState<number>(totalBitState);
  const handleTotalBitChange = (value) => {
    setTotalBit(value);
    resetTotalTransfer();
    resetTransferTabState();
    setTotalPayment(
      Number(value) +
        Number(totalCash) +
        Number(totalChecks) +
        Number(totalCreditCard) +
        Number(taxDeduction)
    );
  };

  // transfer tab //
  const [totalTransfer, setTotalTransfer] =
    useRecoilState<number>(totalTransferState);

  const handleTotalTransferChange = (value) => {
    setTotalTransfer(value);
    resetTotalBit();
    setTotalPayment(
      Number(value) +
        Number(totalCash) +
        Number(totalChecks) +
        (isOutgoingPayments
          ? Number(totalSupplierCreditCard)
          : Number(totalCreditCard)) +
        Number(taxDeduction)
    );
  };

  // supplier credit card tab //
  const [totalSupplierCreditCard, setTotalSupplierCreditCard] =
    useRecoilState<number>(totalSupplierCreditCardState);
  const handleTotalSupplierCreditCardChange = (value) => {
    setTotalSupplierCreditCard(value);
    setTotalPayment(
      Number(value) +
        Number(totalCash) +
        Number(totalChecks) +
        Number(totalTransfer) +
        Number(taxDeduction)
    );
  };

  // credit card tab //
  const [totalCreditCard, setTotalTotalCreditCard] =
    useRecoilState<number>(totalCreditCardState);
  const handleTotalCreditCardChange = (value) => {
    setTotalTotalCreditCard(Number(value));
    setTotalPayment(
      Number(value) +
        Number(totalCash) +
        Number(totalBit) +
        Number(totalChecks) +
        Number(totalTransfer) +
        Number(taxDeduction)
    );
  };

  useEffect(() => {
    const newTotalChecks = data.reduce(
      (total, row) => total + Number(row.checkSum),
      0
    );
    setTotalChecks(newTotalChecks);
    setTotalPayment(
      Number(newTotalChecks) +
        Number(totalCash) +
        Number(totalBit) +
        Number(totalTransfer) +
        (isOutgoingPayments
          ? Number(totalSupplierCreditCard)
          : Number(totalCreditCard)) +
        Number(taxDeduction)
    );
  }, [
    data,
    totalCash,
    totalBit,
    totalTransfer,
    isOutgoingPayments,
    taxDeduction,
  ]);

  /************************ Account code ************************/

  const cashAccountsOptions = quoteItemValue?.cashAccounts?.map((account) => ({
    label: `${account.name} - ${account.code}`,
    value: account.code,
    isSelected: account.isSelected,
  }));

  const checksAccountsOptions = quoteItemValue?.checksAccounts?.map(
    (account) => ({
      label: `${account.name} - ${account.code}`,
      value: account.code,
      isSelected: account.isSelected,
    })
  );

  const transferAccountsOptions = quoteItemValue?.transferAccounts?.map(
    (account) => ({
      text: `${account.name} - ${account.code}`,
      value: account.code,
      isSelected: account.isSelected,
    })
  );

  const creditCardAccountsOptions = quoteItemValue?.creditCardAccounts?.map(
    (account) => ({
      text: `${account?.name} - ${account?.code}`,
      value: account?.code,
      isSelected: account?.isSelected,
    })
  );

  /************************ CREDIT CARD ************************/

  const [creditCard, setCreditCard] =
    useRecoilState<CreditCardData>(creditCardState);
  const [secondCreditCard, setSecondCreditCard] =
    useRecoilState<ReceiptCreditCardData>(receiptCreditCardState);
  const resetSecondCreditCardState = useResetRecoilState(
    receiptCreditCardState
  );
  const [isTransacted, setIsTransacted] =
    useRecoilState<boolean>(isTransactedState);

  const handleExpiryDateChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");

    if (input.length > 4) {
      input = input.slice(0, 4);
    }

    if (input.length > 2) {
      input = `${input.slice(0, 2)}/${input.slice(2)}`;
    }

    setCreditCard({
      ...creditCard,
      expDate_MMYY: input,
    });
  };

  const handleCVVChange = (e) => {
    const formattedInput = e.target.value.replace(/\D/g, "");
    if (formattedInput.length <= 3) {
      setCreditCard({
        ...creditCard,
        cvv: formattedInput,
      });
    }
  };

  const handleCardNumberChange = (e) => {
    const formattedInput = e.target.value.replace(/\D/g, "");
    if (formattedInput.length <= 16) {
      setCreditCard({
        ...creditCard,
        cardNumber: formattedInput,
      });
    }
  };

  const handleChangeInputs = (key, value) => {
    setCreditCard((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChangeCreditCardInputs = (key, value) => {
    let formattedValue = value;

    if (key === "creditCardNum") {
      // Remove any non-numeric characters
      formattedValue = value.replace(/\D/g, "");

      // Limit the input to 16 digits
      if (formattedValue.length > 16) {
        formattedValue = formattedValue.slice(0, 16);
      }

      // Optionally, you could format the credit card number with spaces (e.g., "1234 5678 9012 3456")
      formattedValue = formattedValue.replace(/(.{4})/g, "$1 ").trim();
    }

    if (key === "creditCardExpDate") {
      formattedValue = value.replace(/\D/g, "");

      if (formattedValue.length > 4) {
        formattedValue = formattedValue.slice(0, 4);
      }

      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(
          2
        )}`;
      }
    }

    setSecondCreditCard((prev) => ({
      ...prev,
      [key]: formattedValue,
    }));
  };

  const transactionTypes = [
    { label: t("payment.regular"), value: 1 },
    { label: t("payment.installments"), value: 2 },
    { label: t("payment.credit"), value: 6 },
  ];

  const pinPadsOptions =
    quoteItemValue?.pinPads?.map((pinPad) => ({
      label: pinPad?.name,
      value: pinPad?.number,
    })) || [];

  const numberOfPayments = Array.from({ length: 13 }, (_, index) => ({
    label: index + 1,
    value: index + 1,
  }));

  const setLoadingWithLockScreen = useSetRecoilState(loadingWithShadowState);

  const isFirstWidget = useRecoilValue<boolean>(firstWidgetState);
  const isThirdWidget = useRecoilValue<boolean>(thirdWidgetState);

  const [errors, setErrors] = useState<any>({});
  const validateCreditCardForm = (): string[] => {
    const newErrors: any = {};
    const messages: string[] = [];

    if (!creditCard.cardNumber || creditCard.cardNumber.length < 13) {
      newErrors.cardNumber = "alerts.invalidCardNumber";
      messages.push("alerts.invalidCardNumber");
    }

    if (
      !creditCard.expDate_MMYY ||
      !/^\d{2}\/\d{2}$/.test(creditCard.expDate_MMYY)
    ) {
      newErrors.expDate_MMYY = "alerts.invalidExpirationDate";
      messages.push("alerts.invalidExpirationDate");
    }

    if (!creditCard.cvv || creditCard.cvv.length < 3) {
      newErrors.cvv = "alerts.invalidCVV";
      messages.push("alerts.invalidCVV");
    }

    if (creditCard.holderID && creditCard.holderID.length !== 9) {
      newErrors.holderID = "alerts.invalidID";
      messages.push("alerts.invalidID");
    }

    if (creditCard.transactionSum <= 0) {
      newErrors.transactionSum = "alerts.totalPaymentZero";
      messages.push("alerts.totalPaymentZero");
    }

    if (
      creditCard.customerEmail &&
      !/^\S+@\S+\.\S+$/.test(creditCard.customerEmail)
    ) {
      newErrors.customerEmail = "alerts.invalidEmail";
      messages.push("alerts.invalidEmail");
    }

    setErrors(newErrors);
    return messages;
  };

  const validateCreditCardFormSec = (): string[] => {
    const newErrors: any = {};
    const messages: string[] = [];

    if (creditCard.transactionSum <= 0) {
      newErrors.transactionSumSec = "alerts.totalPaymentZero";
      messages.push("alerts.totalPaymentZero");
    }

    setErrors(newErrors);
    return messages;
  };

  const onClickMakePayment = async (handleSaveAndClose, isPinPadUsed) => {
    if (isFirstWidget) {
      const errorMessages = validateCreditCardForm();
      if (errorMessages.length > 0) {
        return;
      }
    }

    if (isThirdWidget) {
      const errorMessages = validateCreditCardFormSec();
      if (errorMessages.length > 0) {
        return;
      }
    }

    setLoadingWithLockScreen(true);
    const callBack = (res) => {
      if (res?.success) {
        setIsTransacted(true);
        // setSecondCreditCard({
        //     creditCardTransactionID:res?.data,
        //     creditCardSum:totalCreditCard
        // });
        alertSuccessUpdate();
        handleSaveAndClose({
          creditCardTransactionID: res?.data,
          creditCardSum: totalCreditCard,
        });
      } else {
        alertFault(res?.message || "payment.makePaymentError");
      }
      setLoadingWithLockScreen(false);
    };
    await createCreditTransactionApi(callApi, callBack, {
      ClientID: quoteItemValue?.client?.id,
      creditCard,
      ...(isPinPadUsed && { isPinPadUsed }),
    });
  };

  const cardTransactionsOptions = useRecoilValue<transactionOptionsData[]>(
    creditTransactionsState
  );
  const [transactionSelected, setTransactionSelected] =
    useRecoilState<transactionOptionsData>(selectedCreditTransactionState);

  const handleChooseExistingCard = (value) => {
    if (value) {
      handleTotalCreditCardChange(value?.transactionSum);
      setSecondCreditCard({
        creditCardTransactionID: value?.value,
        creditCardSum: value?.transactionSum,
      });
    } else {
      resetSecondCreditCardState();
      handleTotalCreditCardChange(0);
    }
    setTransactionSelected(value);
  };

  return {
    t,
    data,
    tableHeaders,
    getTableRow,
    handleTotalCashChange,
    totalCash,
    handleTotalBitChange,
    totalBit,
    handleTotalTransferChange,
    totalTransfer,
    handleCardNumberChange,
    handleExpiryDateChange,
    handleCVVChange,
    onClickMakePayment,
    numberOfPayments,
    transactionTypes,
    totalCreditCard,
    handleTotalCreditCardChange,
    handleChangeInputs,
    creditCard,
    isTransacted,
    handleChangeCreditCardInputs,
    secondCreditCard,
    transactionSelected,
    cardTransactionsOptions,
    handleChooseExistingCard,
    cashAccountsOptions,
    checksAccountsOptions,
    transferAccountsOptions,
    creditCardAccountsOptions,
    totalSupplierCreditCard,
    handleTotalSupplierCreditCardChange,
    pinPadsOptions,
    dir,
    setCreditCard,
    errors,
    validateCreditCardForm,
    alertFault,
  };
};

export { usePaymentMethodsTabs };
