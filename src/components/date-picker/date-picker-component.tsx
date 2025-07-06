import { useTranslation } from "react-i18next";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { useDatePicker } from "@/components/date-picker/use-date-picker";
import Stack from "@mui/material/Stack";
import { Clear } from "@mui/icons-material";
import { staticDateRange } from "@/components/date-picker/const";
import { endOfToday, startOfYear } from "date-fns";
import { useIsMobile } from "@/hooks/use-responsive";
import { PrimaryButton } from "../button/primary-button";
import moment from "moment";

interface IGoMakeDatepicker {
  onChange: (fromDate: Date, toDate: Date) => void;
  placeholder?: string;
  reset?: boolean;
  style?: CSSProperties;
  value?: any;
}

const GoMakeDatepicker = ({
  onChange,
  placeholder,
  reset,
  style,
  value,
}: IGoMakeDatepicker) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [state, setState] = useState({
    selection: {
      startDate: startOfYear(new Date()), // Start date set to the first day of the current year
      endDate: endOfToday(),
      key: "selection",
    },
  });
  const [openDatepicker, setOpenDatepicker] = useState<boolean>(false);
  const { dateStringFormat } = useDatePicker();
  const handleSelectDates = () => {
    onChange(state.selection.startDate, state.selection.endDate);
    setOpenDatepicker(false);
  };
  const handleInputClick = () => {
    setOpenDatepicker(true);
  };

  const handleClear = () => {
    onChange(null, null);
    setState({
      ...state,
      selection: {
        ...state.selection,
        endDate: null,
        startDate: null,
      },
    });
  };

  useEffect(() => {
    if (reset) {
      handleClear();
    }
  }, [reset]);

  useEffect(() => {
    if (value) {
      if (value && value.fromDate && value.toDate) {
        let mom1 = moment(value.fromDate);
        let mom2 = moment(value.toDate);
        setState({
          ...state,
          selection: {
            ...state.selection,
            endDate: mom1.toDate(),
            startDate: mom2.toDate(),
          },
        });
      } else {
        setState({
          ...state,
          selection: {
            ...state.selection,
            endDate: undefined,
            startDate: undefined,
          },
        });
      }
    }
  }, [value]);

  const dateString = useCallback(() => {
    if (!state.selection.startDate || !state.selection.endDate) {
      return "";
    }
    const startDate = dateStringFormat(new Date(state.selection.startDate));
    const endDate = dateStringFormat(new Date(state.selection.endDate));
    return !!endDate && !!startDate ? `${startDate} - ${endDate}` : "";
  }, [state]);

  return (
    <div style={style}>
      <Stack direction={"row"} gap={"3px"} alignItems={"center"}>
        <GomakeTextInput
          disabled={false}
          style={{ height: "40px", cursor: "pointer" }}
          value={dateString()}
          // labelText={"select"}
          placeholder={placeholder}
          onClick={handleInputClick}
        />
        {state.selection.endDate && state.selection.startDate && (
          <Clear style={{ cursor: "pointer" }} onClick={handleClear} />
        )}
      </Stack>
      <GoMakeModal
        modalTitle={t("datepicker.datepicker")}
        insideStyle={{
          width: "fit-content",
          height: "auto",
          padding: isMobile ? "10px" : "10px 20px",
        }}
        openModal={openDatepicker}
        onClose={handleSelectDates}
        withRoundedCloseIcon={false}
      >
        <Stack gap={isMobile ? "5px" : undefined}>
          <DateRangePicker
            className={isMobile ? "custom-date-range-picker" : ""}
            onChange={(item) => setState({ ...state, ...item })}
            months={1}
            direction="vertical"
            scroll={{ enabled: false }}
            ranges={[state.selection]}
            staticRanges={staticDateRange.map((range) => ({
              ...range,
              label: t(range.label),
              isSelected: () =>
                range.range().startDate === state.selection.startDate &&
                range.range().endDate === state.selection.endDate,
            }))}
            inputRanges={[]}
          />
          <PrimaryButton variant="contained" onClick={handleSelectDates}>
            {t("datepicker.choose")}
          </PrimaryButton>
        </Stack>
      </GoMakeModal>
    </div>
  );
};

export { GoMakeDatepicker };
