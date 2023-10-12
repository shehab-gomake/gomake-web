import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import React, {useEffect, useState} from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import Spreadsheet, {Matrix,CellBase} from "react-spreadsheet";
import {useRouter} from "next/router";
import "@silevis/reactgrid/styles.css";
import {
    useMaterialsSpreadSheetsView
} from "@/pages/admin/materials/SpreadsheetMaterial/use-materials-spreadSheets-view";
import {EmployeeActions} from "@/widgets/settings-users/users/enums/employee-actions";
import Button from "@mui/material/Button";
import {useStyle} from "@/widgets/settings-users/users/components/add-employee/style";


export default function SpreadsheetMaterial() {
    const { t } = useTranslation();
    const router = useRouter();
    const {classes} = useStyle();
    const {materialType} = router.query;
    const {
        columns,
        getSpreadSheetColumns,
        data,
        setSpreadSheetData
    } = useMaterialsSpreadSheetsView();
    useEffect(() => {
        if(materialType && typeof materialType === "string"){
            getSpreadSheetColumns(materialType).then();
        }
        
    }, [materialType]);
    return (
        <AdminAuthLayout>
            <HeaderTitle title={materialType} />
            <Spreadsheet data={data} columnLabels={columns} onChange={res => setSpreadSheetData(res)} />
            <div style={classes.btnContainer}>
                <Button sx={classes.actionBtn} onClick={()=>alert("s")}>{t('usersSettings.add')}</Button>
            </div>
        </AdminAuthLayout>
    );
}


