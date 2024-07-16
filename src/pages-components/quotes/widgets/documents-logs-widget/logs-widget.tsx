import Stack from "@mui/material/Stack";
import { GoMakeAutoComplate } from "@/components";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { useEmployeeList } from "@/hooks/use-employee-list";

interface IQuoteLogsProps {
    employeeId: any;
    handleSelectEmployee: (e: React.ChangeEvent<{}>, value: any) => void;
    onClickClearLogsFilter?: () => void;
    onClickSearchLogsFilter?: () => void;
    onSelectDateRange: (fromData: Date, toDate: Date) => void;
    resetLogsDatePicker: boolean;
    logsTableHeaders: string[];
    logsTableRows: any;
}
const DocumentLogsWidget = ({ logsTableHeaders,
    employeeId,
    handleSelectEmployee,
    resetLogsDatePicker,
    onSelectDateRange,
    onClickSearchLogsFilter,
    onClickClearLogsFilter,
    logsTableRows,
}: IQuoteLogsProps) => {
    
    const { t } = useTranslation();
    const { classes } = useStyle();
    const {employeesCategories} = useEmployeeList();

    return (
        <Stack direction={'column'} gap={'20px'} paddingTop={'10px'}>
            <Stack direction={'row'} gap={'10px'} alignItems={"baseline"} >
                <GoMakeAutoComplate
                    key={employeeId?.id}
                    options={employeesCategories}
                    style={classes.dropDownListStyle}
                    getOptionLabel={(option: any) => option.label}
                    placeholder={t("sales.quote.selectEmployee")}
                    onChange={handleSelectEmployee}
                    value={employeeId}
                />
                <GoMakeDatepicker onChange={onSelectDateRange} placeholder={t("boardMissions.chooseDate")} reset={resetLogsDatePicker} style={{ width: "50%" }} />
                <SecondaryButton variant="contained" onClick={onClickSearchLogsFilter} style={{ height: "35px" }}>{t('sales.quote.search')}</SecondaryButton>
                <SecondaryButton variant="outlined" onClick={onClickClearLogsFilter} style={{ width: "10%", height: "35px" }}>{t('sales.quote.clear')}</SecondaryButton>
            </Stack>
            <PrimaryTable
                stickyFirstCol={false}
                stickyHeader={true}
                maxHeight={400}
                rows={logsTableRows}
                headers={logsTableHeaders}
                columnWidths={["25%", "25%", "50%"]}
            />
        </Stack>
    )
}
export { DocumentLogsWidget }