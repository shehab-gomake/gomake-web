import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { useDatePicker } from "@/components/date-picker/use-date-picker";
import { Clear } from "@mui/icons-material";
import { staticDateRange } from "@/components/date-picker/const";
import { endOfToday, startOfYear } from "date-fns";
import { useIsMobile } from "@/hooks/use-responsive";
import moment from "moment";
import { GoMakeDatepickerProps, DateSelectionState } from "./date-picker.types";
import {
  DatePickerContainer,
  DateInputStack,
  DateInput,
  ClearButton,
  ModalContentStack,
  DateRangePickerWrapper,
  ChooseButton,
} from "./date-picker.styles";

export const GoMakeDatepicker = ({
  onChange,
  placeholder,
  reset,
  style,
  value,
}: GoMakeDatepickerProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [state, setState] = useState<DateSelectionState>({
    selection: {
      startDate: startOfYear(new Date()),
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
  }, [state, dateStringFormat]);

  return (
    <DatePickerContainer style={style}>
      <DateInputStack direction="row" gap="3px" alignItems="center">
        <DateInput
          value={dateString()}
          placeholder={placeholder}
          onClick={handleInputClick}
          readOnly
        />
        {state.selection.endDate && state.selection.startDate && (
          <ClearButton onClick={handleClear}>
            <Clear />
          </ClearButton>
        )}
      </DateInputStack>

      <GoMakeModal
        modalTitle={t("datepicker.datepicker")}
        insideStyle={{
          width: isMobile ? "95vw" : "fit-content",
          maxWidth: isMobile ? "95vw" : "none",
          height: "auto",
          padding: isMobile ? "10px" : "10px 20px",
        }}
        openModal={openDatepicker}
        onClose={handleSelectDates}
        withRoundedCloseIcon={false}
      >
        <ModalContentStack gap={isMobile ? "5px" : "10px"}>
          <DateRangePickerWrapper
            className={isMobile ? "custom-date-range-picker" : ""}
          >
            <DateRangePicker
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
          </DateRangePickerWrapper>
          <ChooseButton onClick={handleSelectDates}>
            {t("datepicker.choose")}
          </ChooseButton>
        </ModalContentStack>
      </GoMakeModal>
    </DatePickerContainer>
  );
};
