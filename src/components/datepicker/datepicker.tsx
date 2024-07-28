import { IconButton, Modal } from "@mui/material";
import { DateRangePicker } from "react-date-range";
import { GomakePrimaryButton } from "@/components";
import { useStyle } from "@/components/datepicker/style";
import { useState } from "react";
import { IGoMakeDatepicker } from "@/components/datepicker/interface";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Button from "@mui/material/Button";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
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
                <AddBoxOutlinedIcon />
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