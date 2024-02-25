import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { MoreMenuWidget } from "../more-circle";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { CheckData, CreditCardData, ERPAccountsData, ERPAccountsState, checksRowState, creditCardState, totalBitState, totalCashState, totalChecksState, totalCreditCardState, totalPaymentState, totalTransferState } from "../../states";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { createCreditTransactionApi } from "@/services/api-service/generic-doc/receipts-api";

const usePaymentMethodsTabs = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
    const setTotalPayment = useSetRecoilState<number>(totalPaymentState);
    const [totalChecks, setTotalChecks] = useRecoilState<number>(totalChecksState);
    const [data, setData] = useRecoilState<CheckData[]>(checksRowState);
    const ERPAccounts = useRecoilValue<ERPAccountsData[]>(ERPAccountsState);

    const addRow = () => {
        const newRow = {
            dueDate: new Date().toISOString().split('T')[0],
            checkNumber: "",
            bankCode: "",
            branch: "",
            accountNum: "",
            checkSum: 0,
        };
        setData((prevData) => [...prevData, newRow]);
    };

    const deleteRow = (index) => {
        setData((prevData) => {
            const newData = prevData.filter((_, i) => i !== index);
            return newData;
        });
    };

    const duplicateRow = (index) => {
        const rowToDuplicate = data[index];
        setData((prevData) => {
            const newData = [...prevData, { ...rowToDuplicate }];
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
        <IconButton onClick={addRow} style={{ color: '#5859A8' }}>
            <AddCircleOutlineIcon />
        </IconButton>,
    ];

    const getTableRow = (row, index) => (
        [
            <input
                style={{ width: "100px" }}
                type="date"
                value={row.dueDate}
                onChange={(e) => handleInputChange(index, "dueDate", e.target.value)}
            />,
            <input
                style={{ width: "100px" }}
                type="text"
                value={row.checkNumber}
                placeholder={t("payment.checkNumber")}
                onChange={(e) => handleInputChange(index, "checkNumber", e.target.value)}
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
        ]
    );

    // Cash tab ///
    const [totalCash, setTotalCash] = useRecoilState<number>(totalCashState);
    const handleTotalCashChange = (value) => {
        setTotalCash(value);
        setTotalPayment(Number(value) + Number(totalBit) + Number(totalTransfer) + Number(totalChecks) + Number(totalCreditCard));
    };

    // Bit tab //
    const [totalBit, setTotalBit] = useRecoilState<number>(totalBitState);
    const handleTotalBitChange = (value) => {
        setTotalBit(value);
        setTotalPayment(Number(value) + Number(totalCash) + Number(totalTransfer) + Number(totalChecks) + Number(totalCreditCard))
    };

    // transfer tab //
    const [totalTransfer, setTotalTransfer] = useRecoilState<number>(totalTransferState);
    const handleTotalTransferChange = (value) => {
        setTotalTransfer(value);
        setTotalPayment(Number(value) + Number(totalCash) + Number(totalBit) + Number(totalChecks) + Number(totalCreditCard))
    };

    // credit card tab //
    const [totalCreditCard, setTotalTotalCreditCard] = useRecoilState<number>(totalCreditCardState);
    const handleTotalCreditCardChange = (value) => {
        handleChangeInputs("transactionSum", value)
        setTotalTotalCreditCard(value);
        setTotalPayment(Number(value) + Number(totalCash) + Number(totalBit) + Number(totalChecks) + Number(totalTransfer))
    };

    useEffect(() => {
        const newTotalChecks = data.reduce((total, row) => total + Number(row.checkSum), 0);
        setTotalChecks(newTotalChecks);
        setTotalPayment(Number(newTotalChecks) + Number(totalCash) + Number(totalBit) + Number(totalTransfer) + Number(totalCreditCard));
    }, [data, totalCash, totalBit, totalTransfer]);


    const mapERPAccountsOptions = ERPAccounts.map((account) => ({
        label: `${account.name} - ${account.code}`,
        value: account.code,
    }));

    const formattedOptions = mapERPAccountsOptions.map((code) => ({
        text: code.label,
        value: code.value,
    }))

    ////////////////////////////////////// CREDIT CARD /////////////////////////////////////////

    const [creditCard, setCreditCard] = useRecoilState<CreditCardData>(creditCardState);

    const handleExpiryDateChange = (e) => {
        const formattedInput = e.target.value.replace(/\D/g, '');
        if (formattedInput.length <= 4) {
            setCreditCard({
                ...creditCard,
                expDate_MMYY: formattedInput
            });
        }
    };

    const handleCVVChange = (e) => {
        const formattedInput = e.target.value.replace(/\D/g, '');
        if (formattedInput.length <= 3) {
            setCreditCard({
                ...creditCard,
                cvv: formattedInput
            });
        }
    };

    const handleCardNumberChange = (e) => {
        const formattedInput = e.target.value.replace(/\D/g, '');
        if (formattedInput.length <= 16) {
            setCreditCard({
                ...creditCard,
                cardNumber: formattedInput
            });
        }
    };

    const handleChangeInputs = (key, value) => {
        setCreditCard((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    /////////////////////////////////////////////////////////////////////////////
    const transactionTypes = [
        { label: t("payment.regular"), value: 1 },
        { label: t("payment.installments"), value: 2 }
    ];

    const numberOfPayments = Array.from({ length: 13 }, (_, index) => ({
        label: index + 1,
        value: index + 1,
    }));



    const onClickMakePayment = async (transactionState) => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        };
        await createCreditTransactionApi(callApi, callBack, creditCard);
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
        mapERPAccountsOptions,
        handleCardNumberChange,
        handleExpiryDateChange,
        handleCVVChange,
        formattedOptions,
        onClickMakePayment,
        numberOfPayments,
        transactionTypes,
        totalCreditCard,
        handleTotalCreditCardChange,
        handleChangeInputs,
        creditCard
    };

};

export { usePaymentMethodsTabs };