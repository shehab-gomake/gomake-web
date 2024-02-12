import { IconButton } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { MoreMenuWidget } from "../more-circle";


const usePaymentMethodsTabs = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([
        {
            dueDate: new Date().toISOString().split('T')[0],
            checkNumber: "",
            bankName: "",
            branch: "",
            account: "",
            sum: "",
        },
    ]);

    const addRow = () => {
        const newRow = {
            dueDate: new Date().toISOString().split('T')[0],
            checkNumber: "",
            bankName: "",
            branch: "",
            account: "",
            sum: "",
        };
        setData((prevData) => [...prevData, newRow]);
    };

    const duplicateRow = (index) => {
        const rowToDuplicate = data[index];
        setData((prevData) => [...prevData, { ...rowToDuplicate }]);
    };

    const deleteRow = (index) => {
        setData((prevData) => prevData.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, fieldName, value) => {
        setData((prevData) => {
            const newData = [...prevData];
            newData[index][fieldName] = value;
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

    return {
        t,
        data,
        tableHeaders,
        getTableRow,
    };

};

export { usePaymentMethodsTabs };