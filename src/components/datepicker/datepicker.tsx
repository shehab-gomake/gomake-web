import { IconButton, Modal } from "@mui/material";
import { DateRangePicker } from "react-date-range";
import { GomakePrimaryButton } from "@/components";
import { useStyle } from "@/components/datepicker/style";
import { useState } from "react";
import { IGoMakeDatepicker } from "@/components/datepicker/interface";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Button from "@mui/material/Button";
import { TODAY_DATE_RANGE } from "@/shared/constant";
import { useGomakeDateRange } from "@/hooks";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";

const GoMakeDatepicker = ({ }: IGoMakeDatepicker) => {
    const { t } = useTranslation();
    const [state, setState] = useState({
        selection: {
            ...TODAY_DATE_RANGE,
            key: 'selection'
        }
    });
    const [openDatepicker, setOpenDatepicker] = useState<boolean>(false);
    const { classes } = useStyle();
    const { newDateSelected } = useGomakeDateRange();
    const handleSelectDates = () => {
        setOpenDatepicker(false);
        newDateSelected(state.selection);
    }
    return (
        <div>
            <Button style={classes.button} onClick={() => setOpenDatepicker(true)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="calendar-plus-02">
                        <path id="Icon" d="M12.25 6.70866V5.13366C12.25 4.15357 12.25 3.66352 12.0593 3.28918C11.8915 2.95989 11.6238 2.69218 11.2945 2.5244C10.9201 2.33366 10.4301 2.33366 9.45 2.33366H4.55C3.56991 2.33366 3.07986 2.33366 2.70552 2.5244C2.37623 2.69218 2.10852 2.95989 1.94074 3.28918C1.75 3.66352 1.75 4.15357 1.75 5.13366V10.0337C1.75 11.0138 1.75 11.5038 1.94074 11.8781C2.10852 12.2074 2.37623 12.4751 2.70552 12.6429C3.07986 12.8337 3.56991 12.8337 4.55 12.8337H7.29167M12.25 5.83366H1.75M9.33333 1.16699V3.50033M4.66667 1.16699V3.50033M10.5 12.2503V8.75033M8.75 10.5003H12.25" stroke="#667085" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                </svg>

                <span>{t('dashboard-widget.chooseDate')}</span>
            </Button>
            <Modal
                open={openDatepicker}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <div style={classes.datepickerContainer}>
                    <div><IconButton onClick={() => setOpenDatepicker(false)}><CloseIcon /></IconButton></div>
                    <DateRangePicker
                        onChange={item => setState({ ...state, ...item })}
                        months={1}
                        direction="vertical"
                        scroll={{ enabled: false }}
                        ranges={[state.selection]}
                    />
                    <div>
                        <div style={{ textAlign: 'center' }}>
                            <GomakePrimaryButton onClick={handleSelectDates}>{t('dashboard-widget.chooseDate')}</GomakePrimaryButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export { GoMakeDatepicker }