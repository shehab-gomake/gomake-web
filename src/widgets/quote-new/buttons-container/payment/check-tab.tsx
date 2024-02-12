import { PrimaryTable } from "@/components/tables/primary-table";
import { IconButton, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreMenuWidget } from "./more-circle";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CheckTab = () => {
    const { t } = useTranslation();
    const initialData = [
        [
            <input style={{width:"100px"}} value={"asa"} type="text" placeholder={t("payment.dueDate")} />,
            <input style={{width:"100px"}} type="text" placeholder={t("payment.checkNumber")} />,
            <input style={{width:"100px"}} type="text" placeholder={t("payment.bankName")} />,
            <input style={{width:"100px"}} type="text" placeholder={ t("payment.branch")} />,
            <input style={{width:"100px"}} type="text" placeholder={t("payment.account")} />,
            <input style={{width:"100px"}} type="text" placeholder={t("payment.sum")} />,
            <MoreMenuWidget
            onClickDuplicate={() => duplicateRow(initialData[0])}
            onClickDelete={() => deleteRow(initialData[0])}
        />,
        ],
    ];
    const [data, setData] = useState<any>(initialData);
  
    const addRow = () => {
        const newRow = [
            <input style={{width:"100px"}} type="text" placeholder={t("payment.dueDate")} />,
            <input style={{width:"100px"}} type="text" placeholder={t("payment.checkNumber")} />,
            <input style={{width:"100px"}} type="text" placeholder={t("payment.bankName")} />,
            <input style={{width:"100px"}} type="text" placeholder={ t("payment.branch")} />,
            <input style={{width:"100px"}} type="text" placeholder={t("payment.account")} />,
            <input style={{width:"100px"}} type="text" placeholder={t("payment.sum")} />,
            <MoreMenuWidget
                onClickDuplicate={() => duplicateRow(newRow)} // Pass the duplicate function
                onClickDelete={() => deleteRow(newRow)} // Pass the delete function
            />,
        ];
        setData((prevData) => [...prevData, newRow]);
    };

     const duplicateRow = (row) => {
        setData((prevData) => [...prevData, [...row]]);
    };

    const deleteRow = (row) => {
        setData((prevData) => prevData.filter((r) => r !== row));
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





    return (
        <Stack display={"flex"} direction={"column"} justifyContent={"space-between"} padding={"0 5px"}  >
            <PrimaryTable
                maxHeight={650}
                rows={data}
                headers={tableHeaders}
            />
        </Stack>

    );
}
export { CheckTab }