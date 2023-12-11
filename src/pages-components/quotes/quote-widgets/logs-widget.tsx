import Stack from "@mui/material/Stack";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useState } from "react";
import { useStyle } from "./style";
import { useQuotes } from "../use-quote";
import { PrimaryTable } from "@/components/tables/primary-table";

interface IQuoteLogsProps {
    setEmployeeId?: any;
    employeeId?: any;
    logsTableHeaders: string[]


}
const QuoteLogsWidget = ({ setEmployeeId, employeeId, logsTableHeaders }: IQuoteLogsProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();

    const statuses = [
        { label: t("employee1"), value: "123" },
        { label: t("employee2"), value: "1234" },
        { label: t("employee3"), value: "1234" },
    ];

    return (
        <Stack direction={'column'} gap={'20px'} paddingTop={'10px'}>
            <Stack direction={'row'} gap={'20px'} width={"80%"}>
                <GoMakeAutoComplate
                    options={statuses}
                    style={classes.dropDownListStyle}
                    getOptionLabel={(option: any) => option.label}
                    placeholder={t("select employee")}
                    onChange={(e: any, value: any) => {
                        setEmployeeId(value);
                    }}
                    value={employeeId}
                />
                <GoMakeAutoComplate
                    options={statuses}
                    style={classes.dropDownListStyle}
                    getOptionLabel={(option: any) => option.label}
                    placeholder={t("select employee")}
                    onChange={(e: any, value: any) => {
                        setEmployeeId(value);
                    }}
                    value={employeeId}
                />
                <SecondaryButton variant="contained" onClick={() => null} style={{width:"20%"}}>{t('search')}</SecondaryButton>
                <SecondaryButton variant="outlined" onClick={() => null}>{t('clear')}</SecondaryButton>
            </Stack>
            <PrimaryTable
                stickyFirstCol={false}
                stickyHeader={false}
                rows={null}
                headers={logsTableHeaders}
            />
        </Stack>
    )
}
export { QuoteLogsWidget }