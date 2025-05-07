import { IconButton, Modal } from "@mui/material";
import { DateRangePicker } from "react-date-range";
import { GomakePrimaryButton } from "@/components";
import { useStyle } from "@/components/datepicker/style";
import { useEffect, useState } from "react";
import { IGoMakeDatepicker } from "@/components/datepicker/interface";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Button from "@mui/material/Button";
import { useGomakeDateRange } from "@/hooks";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { CalendarIcon } from "./icons";

const GoMakeDatepicker = ({}: IGoMakeDatepicker) => {
  const { t } = useTranslation();
  const [openDatepicker, setOpenDatepicker] = useState(false);
  const { classes } = useStyle();
  const { newDateSelected, dates } = useGomakeDateRange();

  const [state, setState] = useState({
    selection: {
      startDate: dates?.startDate || startOfMonth(new Date()),
      endDate: dates?.endDate || endOfMonth(new Date()),
      key: "selection",
    },
  });

  const [tempSelection, setTempSelection] = useState(state.selection);

  const handleSelectDates = () => {
    setState({ selection: tempSelection });
    newDateSelected(tempSelection);
    setOpenDatepicker(false);
  };

  useEffect(() => {
    setState({
      selection: {
        startDate: dates?.startDate || startOfMonth(new Date()),
        endDate: dates?.endDate || endOfMonth(new Date()),
        key: "selection",
      },
    });
  }, [dates]);

  const handleOpenModal = () => {
    setTempSelection(state.selection);
    setOpenDatepicker(true);
  };

  return (
    <div>
      <Button style={classes.button} onClick={handleOpenModal}>
        <CalendarIcon />
        <span style={classes.buttonText}>
          {state.selection.startDate && state.selection.endDate
            ? `${format(state.selection.startDate, "MMM d, yyyy")} - ${format(
                state.selection.endDate,
                "MMM d, yyyy"
              )}`
            : t("dashboard-widget.chooseDate")}
        </span>
      </Button>

      <Modal
        open={openDatepicker}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={() => setOpenDatepicker(false)}
      >
        <div style={classes.datepickerContainer}>
          <div>
            <IconButton onClick={() => setOpenDatepicker(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <DateRangePicker
            onChange={(item) => setTempSelection(item.selection)}
            months={1}
            direction="vertical"
            scroll={{ enabled: false }}
            ranges={[tempSelection]}
          />
          <div style={{ textAlign: "center" }}>
            <GomakePrimaryButton onClick={handleSelectDates}>
              {t("dashboard-widget.chooseDate")}
            </GomakePrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export { GoMakeDatepicker };
