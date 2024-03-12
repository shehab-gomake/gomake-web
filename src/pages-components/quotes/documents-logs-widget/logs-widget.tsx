import Stack from "@mui/material/Stack";
import { GoMakeAutoComplate } from "@/components";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useRecoilValue } from "recoil";
import { employeesListsState } from "../states";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";

interface IQuoteLogsProps {
    employeeId: any;
    handleSelectEmployee: (e, value) => void;
    onClickClearLogsFilter: any;
    onClickSearchLogsFilter: any;
    onSelectDateRange :any ;
    resetLogsDatePicker :any;
    logsTableHeaders: string[];
    logsTableRows?: any;
}
const DocumentLogsWidget = ({ logsTableHeaders ,
    employeeId,
    handleSelectEmployee,
    resetLogsDatePicker,
    onSelectDateRange,
    onClickSearchLogsFilter,
    onClickClearLogsFilter
 }: IQuoteLogsProps) => {

    const { t } = useTranslation();
    const { classes } = useStyle();
    const employeeListValue = useRecoilValue<string[]>(employeesListsState);

    return (
        <Stack direction={'column'} gap={'20px'} paddingTop={'10px'}>
            <Stack direction={'row'} gap={'10px'} alignItems={"baseline"} >
                <GoMakeAutoComplate
                    key={employeeId?.id}
                    options={employeeListValue}
                    style={classes.dropDownListStyle}
                    getOptionLabel={(option: any) => option.label}
                    placeholder={t("sales.quote.selectEmployee")}
                    onChange={handleSelectEmployee}
                    value={employeeId}
                />
                <GoMakeDatepicker onChange={onSelectDateRange} placeholder={t("boardMissions.chooseDate")} reset={resetLogsDatePicker} style={{width:"50%"}} />
                <SecondaryButton variant="contained" onClick={onClickSearchLogsFilter} style={{ height: "35px" }}>{t('sales.quote.search')}</SecondaryButton>
                <SecondaryButton variant="outlined" onClick={onClickClearLogsFilter} style={{ width: "10%" , height:"35px" }}>{t('sales.quote.clear')}</SecondaryButton>
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
export { DocumentLogsWidget }