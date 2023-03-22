import {Modal} from "@mui/material";
import {DateRangePicker} from "react-date-range";
import {GomakePrimaryButton} from "@/components";
import {useStyle} from "@/components/datepicker/style";
import {useState} from "react";
import {IGoMakeDatepicker} from "@/components/datepicker/interface";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Button from "@mui/material/Button";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import {TODAY_DATE_RANGE} from "@/shared/constant";
import {useGomakeDateRange} from "@/hooks";

const GoMakeDatepicker = ({}: IGoMakeDatepicker) => {
    const [state, setState] = useState({
        selection: {
            ...TODAY_DATE_RANGE,
            key: 'selection'
        }
    });
    const [openDatepicker, setOpenDatepicker] = useState<boolean>(false);
    const {classes} = useStyle();
    const {newDateSelected} = useGomakeDateRange();
    const handleSelectDates = () => {
        setOpenDatepicker(false);
        newDateSelected(state.selection);
    }
    return (
        <div>
            <Button style={classes.button} onClick={() => setOpenDatepicker(true)}>
                <AddBoxOutlinedIcon/>
                <span>Choose date</span>
            </Button>
            <Modal
                open={openDatepicker}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <div style={classes.datepickerContainer}>
                    <DateRangePicker
                        onChange={item => setState({...state, ...item})}
                        months={1}
                        direction="vertical"
                        scroll={{enabled: false}}
                        ranges={[state.selection]}

                    />
                    <div>
                        <div style={{textAlign: 'center'}}>
                            <GomakePrimaryButton onClick={handleSelectDates}>Choose</GomakePrimaryButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export {GoMakeDatepicker}