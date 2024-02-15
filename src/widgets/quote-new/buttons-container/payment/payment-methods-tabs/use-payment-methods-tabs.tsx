import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { MoreMenuWidget } from "../more-circle";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { CheckData, ERPAccountsData, ERPAccountsState, checksRowState, totalBitState, totalCashState, totalChecksState, totalPaymentState, totalTransferState } from "../../states";

const usePaymentMethodsTabs = () => {
    const { t } = useTranslation();
    const setTotalPayment = useSetRecoilState<number>(totalPaymentState);
    const [totalChecks, setTotalChecks] = useRecoilState<number>(totalChecksState);
    const [data , setData] = useRecoilState<CheckData[]>(checksRowState);
    const ERPAccounts= useRecoilValue<ERPAccountsData[]>(ERPAccountsState);

    const addRow = () => {
        const newRow = {
            dueDate: new Date().toISOString().split('T')[0],
            checkNumber: "",
            bankName: "",
            branch: "",
            account: "",
            sum: 0,
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
                value={row.bankName}
                placeholder={t("payment.bankName")}
                onChange={(e) => handleInputChange(index, "bankName", e.target.value)}
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
                value={row.account}
                placeholder={t("payment.account")}
                onChange={(e) => handleInputChange(index, "account", e.target.value)}
            />,
            <input
                style={{ width: "100px" }}
                type="number"
                value={row.sum}
                placeholder={t("payment.sum")}
                onChange={(e) => handleInputChange(index, "sum", e.target.value)}
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
        setTotalPayment(Number(value) + Number(totalBit) + Number(totalTransfer) + Number(totalChecks)
        );
    };

    // Bit tab //
    const [totalBit, setTotalBit] = useRecoilState<number>(totalBitState);
    const handleTotalBitChange = (value) => {
        setTotalBit(value);
        setTotalPayment(Number(value) + Number(totalCash) + Number(totalTransfer) + Number(totalChecks))
    };

    // transfer tab //
    const [totalTransfer, setTotalTransfer] = useRecoilState<number>(totalTransferState);
    const handleTotalTransferChange = (value) => {
        setTotalTransfer(value);
        setTotalPayment(Number(value) + Number(totalCash) + Number(totalBit) + Number(totalChecks))
    };



    useEffect(() => {
        const newTotalChecks = data.reduce((total, row) => total + Number(row.sum), 0);
        setTotalChecks(newTotalChecks);
        setTotalPayment(Number(newTotalChecks) + Number(totalCash) + Number(totalBit) + Number(totalTransfer));
    }, [data, totalCash, totalBit, totalTransfer]);



    const mapERPAccountsOptions = ERPAccounts.map((account) => ({
        label: `${account.name} - ${account.code}`,
        value: account.code,
      }));


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
    };

};

export { usePaymentMethodsTabs };