import Stack from "@mui/material/Stack";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useEffect, useRef, useState } from "react";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useRecoilState, useRecoilValue , useResetRecoilState} from "recoil";
import { employeesListsState, employeeListState } from "../states";
import { DateFormatter } from "@/utils/adapter";

interface IQuoteLogsProps {
    logsTableHeaders: string[]
}
const QuoteLogsWidget = ({ logsTableHeaders }: IQuoteLogsProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const employeeListValue = useRecoilValue<string[]>(employeesListsState);
    const [employeeId, setEmployeeId] = useRecoilState<string>(employeeListState);
    const resetEmployeeId = useResetRecoilState(employeeListState);
    const [selectDate, setSelectDate] = useState<string>();
    const [activeClickAway, setActiveClickAway] = useState<boolean>(false);
    const dateRef = useRef(null);

    const handleClickSelectDate = () => {
        dateRef?.current?.showPicker();
    };

    const onClickClearFilter = () => {
        setSelectDate(null);
     //  setEmployeeId("");
       resetEmployeeId();
    };

    return (
        <Stack direction={'column'} gap={'20px'} paddingTop={'10px'}>
            <Stack direction={'row'} gap={'20px'} width={"80%"}>
                <GoMakeAutoComplate
                    options={employeeListValue}
                    style={classes.dropDownListStyle}
                    getOptionLabel={(option: any) => option.label}
                    placeholder={t("sales.quote.selectEmployee")}
                    onChange={(e: any, value: any) => {
                        setEmployeeId(value);
                    }}
                    value={employeeId}
                />

                <div
                    style={classes.dateStyle}
                    onClick={handleClickSelectDate}
                >
                    {selectDate ? DateFormatter(selectDate) : t("sales.quote.selectDate")}
                    <div style={classes.datePickerContainer}>
                        <input
                            type="date"
                            onChange={(e) => {
                                setSelectDate(e.target.value);
                                setActiveClickAway(true);
                            }}
                            ref={dateRef}
                        />
                    </div>
                </div>
                <SecondaryButton variant="contained" onClick={() => null} style={{ width: "20%" }}>{t('sales.quote.search')}</SecondaryButton>
                <SecondaryButton variant="outlined" onClick={onClickClearFilter} style={{ width: "10%" }}>{t('sales.quote.clear')}</SecondaryButton>
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