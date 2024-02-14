import { useTranslation } from "react-i18next";
import { TableCell, styled, tableCellClasses } from "@mui/material";
import { useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { totalDocumentsState, totalPaymentState, finalTotalPaymentState, totalCashState, totalBitState, totalTransferState, totalChecksState, checksRowState } from "../buttons-container/states";

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



    const tableRows = [
        {
            "finalPrice": -0.001,
            "isRefund": false,
            "docTypeText": "תנועת יומן",
            "docNumber": "855",
            "docLine": 3,
            "content": "Hello",
            "docDate": "3/30/2023 12:00:00 AM",
            "docEntry": 4413,
            "documentNumber": null,
            "occasionalClientName": "",
            "occasionalBusinessNumber": "",
            "documentType": 7
        },
        {
            "finalPrice": 585,
            "isRefund": false,
            "docTypeText": "חשבונית",
            "docNumber": "1844",
            "docLine": 0,
            "content": "World",
            "docDate": "4/5/2023 12:00:00 AM",
            "docEntry": 1848,
            "documentNumber": null,
            "occasionalClientName": "",
            "occasionalBusinessNumber": "",
            "documentType": 2
        },
        {
            "finalPrice": 235,
            "isRefund": false,
            "docTypeText": "חשבונית",
            "docNumber": "1854",
            "docLine": 0,
            "content": "!!",
            "docDate": "4/6/2023 12:00:00 AM",
            "docEntry": 1858,
            "documentNumber": null,
            "occasionalClientName": "",
            "occasionalBusinessNumber": "",
            "documentType": 2
        },
        
    ]

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
                    sum += item.finalPrice;
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
