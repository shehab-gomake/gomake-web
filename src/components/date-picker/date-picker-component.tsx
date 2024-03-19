import { useTranslation } from "react-i18next";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import { useDatePicker } from "@/components/date-picker/use-date-picker";
import Stack from "@mui/material/Stack";
import { Clear } from "@mui/icons-material";
import { staticDateRange } from "@/components/date-picker/const";
import { endOfToday } from "date-fns";

interface IGoMakeDatepicker {
    onChange: (fromDate: Date, toDate: Date) => void;
    placeholder?: string;
    reset?: boolean;
    style?:CSSProperties;
}

const GoMakeDatepicker = ({ onChange, placeholder, reset , style}: IGoMakeDatepicker) => {
    const { t } = useTranslation();
    const [state, setState] = useState({
        selection: {
            startDate: endOfToday(),
            endDate: endOfToday(),
            key: 'selection'
        }
    });
    const [openDatepicker, setOpenDatepicker] = useState<boolean>(false);
    const { dateStringFormat } = useDatePicker()
    const handleSelectDates = () => {
        onChange(state.selection.startDate, state.selection.endDate);
        setOpenDatepicker(false);
    }
    const handleInputClick = () => {
        setOpenDatepicker(true);
    }

    const handleClear = () => {
        onChange(null, null);
        setState({
            ...state,
            selection: {
                ...state.selection,
                endDate: null,
                startDate: null
            }
        })
    }

    useEffect(() => {
        if (reset) {
            handleClear();
        }
    }, [reset]);

    const dateString = useCallback(() => {
        if (state.selection.startDate === null || state.selection.endDate === null) {
            return '';
        }
        const startDate = dateStringFormat(new Date(state.selection.startDate));
        const endDate = dateStringFormat(new Date(state.selection.endDate));
        return !!endDate && !!startDate ? `${startDate} - ${endDate}` : ''
    }, [state])
    return (
        <div style={style}>
            <Stack direction={'row'} gap={'3px'} alignItems={'center'}>
                <GomakeTextInput disabled={false} style={{ height: '40px', cursor: 'pointer' }}
                    value={dateString()} labelText={'select'} placeholder={placeholder}
                    onClick={handleInputClick} />
                <Clear onClick={handleClear} />
            </Stack>
            <GoMakeModal modalTitle={t('datepicker.datepicker')} insideStyle={{ width: 'fit-content', height: 'fit-content' }}
                openModal={openDatepicker} onClose={handleSelectDates}>
                <div>
                    <DateRangePicker
                        onChange={item => setState({ ...state, ...item })}
                        months={1}
                        direction="vertical"
                        scroll={{ enabled: false }}
                        ranges={[state.selection]}
                        staticRanges={staticDateRange.map(range => ({ ...range, label: t(range.label), isSelected: () => range.range().startDate === state.selection.startDate && range.range().endDate === state.selection.endDate }))}
                        inputRanges={[]}
                    />
                    <div>
                        <div style={{ textAlign: 'center' }}>
                            <GomakePrimaryButton
                                onClick={handleSelectDates}>{t('datepicker.choose')}</GomakePrimaryButton>
                        </div>
                    </div>
                </div>
            </GoMakeModal>
        </div>
    );
}

export { GoMakeDatepicker }