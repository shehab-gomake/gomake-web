import { useState } from "react";
import { IconButton, Modal, Button, Box, TextField } from "@mui/material";
import { DateRangePicker } from "react-date-range";
import { PrimaryButton } from "@/components/button/primary-button";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {
  format,
  subMonths,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subDays,
  parse,
  isValid,
} from "date-fns";
import { CalendarIcon } from "./icons";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface IControlledDateRangePicker {
  label?: string;
  startDate: Date | null;
  endDate: Date | null;
  onChange: (startDate: Date | null, endDate: Date | null) => void;
  allowClear?: boolean;
  allowManualInput?: boolean;
  dateFormat?: string;
  buttonStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
}

// ? new component DATE RANGE PICKER USE THIS COMPONENT INSTEAD OF THE DATEPICKER COMPONENT
const ControlledDateRangePicker = ({
  label = "",
  startDate,
  endDate,
  onChange,
  allowClear = true,
  allowManualInput = false,
  dateFormat = "dd-MM-yyyy",
  buttonStyle,
  textStyle,
}: IControlledDateRangePicker) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const [openPicker, setOpenPicker] = useState(false);
  const [tempRange, setTempRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  // State for manual input
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);

  const handleOpenPicker = () => {
    const initialStartDate = startDate || new Date();
    const initialEndDate = endDate || new Date();

    setTempRange({
      startDate: initialStartDate,
      endDate: initialEndDate,
      key: "selection",
    });

    // Set input values when opening picker
    if (startDate && isValid(startDate)) {
      setStartDateInput(format(startDate, dateFormat));
    } else {
      setStartDateInput("");
    }
    if (endDate && isValid(endDate)) {
      setEndDateInput(format(endDate, dateFormat));
    } else {
      setEndDateInput("");
    }

    setStartDateError(false);
    setEndDateError(false);
    setOpenPicker(true);
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString.trim()) return null;

    try {
      const parsedDate = parse(dateString, dateFormat, new Date());
      return isValid(parsedDate) ? parsedDate : null;
    } catch {
      return null;
    }
  };

  const handleStartDateChange = (value: string) => {
    setStartDateInput(value);
    const parsedDate = parseDate(value);

    if (value.trim() && !parsedDate) {
      setStartDateError(true);
    } else {
      setStartDateError(false);
      if (parsedDate) {
        setTempRange((prev) => ({
          ...prev,
          startDate: parsedDate,
        }));
      }
    }
  };

  const handleEndDateChange = (value: string) => {
    setEndDateInput(value);
    const parsedDate = parseDate(value);

    if (value.trim() && !parsedDate) {
      setEndDateError(true);
    } else {
      setEndDateError(false);
      if (parsedDate) {
        setTempRange((prev) => ({
          ...prev,
          endDate: parsedDate,
        }));
      }
    }
  };

  const handleSelectDates = () => {
    // Always use tempRange as the source of truth
    // tempRange gets updated from both calendar selection and manual input
    onChange(tempRange.startDate, tempRange.endDate);
    setOpenPicker(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null, null);
  };

  // Predefined ranges
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const yesterdayStart = startOfDay(subDays(now, 1));
  const yesterdayEnd = endOfDay(subDays(now, 1));
  const thisWeekStart = startOfWeek(now);
  const thisWeekEnd = endOfWeek(now);
  const lastWeekStart = startOfWeek(subWeeks(now, 1));
  const lastWeekEnd = endOfWeek(subWeeks(now, 1));
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  const last30DaysStart = startOfDay(subDays(now, 30));
  const pastMonthStart = startOfDay(subMonths(now, 1));

  // Helper function to check if dates match a range
  const isSameDay = (date1: Date | null, date2: Date) => {
    if (!date1) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isRangeSelected = (rangeStart: Date, rangeEnd: Date) => {
    // When modal is open, check against tempRange, otherwise check against saved dates
    if (openPicker) {
      return (
        isSameDay(tempRange.startDate, rangeStart) &&
        isSameDay(tempRange.endDate, rangeEnd)
      );
    }
    return isSameDay(startDate, rangeStart) && isSameDay(endDate, rangeEnd);
  };

  const staticRanges = [
    {
      label: t("general.today") || "Today",
      range: () => ({
        startDate: todayStart,
        endDate: todayEnd,
      }),
      isSelected: () => isRangeSelected(todayStart, todayEnd),
    },
    {
      label: t("general.yesterday") || "Yesterday",
      range: () => ({
        startDate: yesterdayStart,
        endDate: yesterdayEnd,
      }),
      isSelected: () => isRangeSelected(yesterdayStart, yesterdayEnd),
    },
    {
      label: t("general.thisWeek") || "This Week",
      range: () => ({
        startDate: thisWeekStart,
        endDate: thisWeekEnd,
      }),
      isSelected: () => isRangeSelected(thisWeekStart, thisWeekEnd),
    },
    {
      label: t("general.lastWeek") || "Last Week",
      range: () => ({
        startDate: lastWeekStart,
        endDate: lastWeekEnd,
      }),
      isSelected: () => isRangeSelected(lastWeekStart, lastWeekEnd),
    },
    {
      label: t("general.thisMonth") || "This Month",
      range: () => ({
        startDate: thisMonthStart,
        endDate: thisMonthEnd,
      }),
      isSelected: () => isRangeSelected(thisMonthStart, thisMonthEnd),
    },
    {
      label: t("general.lastMonth") || "Last Month",
      range: () => ({
        startDate: lastMonthStart,
        endDate: lastMonthEnd,
      }),
      isSelected: () => isRangeSelected(lastMonthStart, lastMonthEnd),
    },
    {
      label: t("general.last30Days") || "Last 30 Days",
      range: () => ({
        startDate: last30DaysStart,
        endDate: todayEnd,
      }),
      isSelected: () => isRangeSelected(last30DaysStart, todayEnd),
    },
    // {
    //   label: t("general.pastMonth") || "Past Month to Today",
    //   range: () => ({
    //     startDate: pastMonthStart,
    //     endDate: todayEnd,
    //   }),
    //   isSelected: () => isRangeSelected(pastMonthStart, todayEnd),
    // },
  ];

  const defaultButtonStyle = {
    textTransform: "none" as const,
    border: "1px solid rgba(208, 213, 221, 1)",
    padding: "10px 16px",
    justifyContent: "space-between" as const,
    color: "#333",
    width: "100%",
    maxWidth: "280px",
    height: "40px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      border: "1px solid rgba(180, 185, 195, 1)",
    },
  };

  const dateButtonStyle = {
    ...defaultButtonStyle,
    ...buttonStyle,
  };

  const defaultTextStyle: React.CSSProperties = {
    lineHeight: "20px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...FONT_FAMILY.Lexend(500, 14),
    color:
      startDate && endDate ? "rgba(52, 64, 84, 1)" : "rgba(150, 150, 150, 1)",
    flex: 1,
    textAlign: isRTL ? "right" : "left",
    direction: "ltr" as const,
  };

  const buttonTextStyle: React.CSSProperties = {
    ...defaultTextStyle,
    ...textStyle,
  };

  const modalContainerStyle = {
    direction: dir,
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflow: "auto",
    outline: "none",
  };

  return (
    <div>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: 8,
            ...FONT_FAMILY.Lexend(500, 15),
          }}
        >
          {label}
        </label>
      )}
      <Box sx={{ position: "relative", width: "100%", maxWidth: "280px" }}>
        <Button
          onClick={handleOpenPicker}
          style={dateButtonStyle}
          startIcon={!isRTL ? <CalendarIcon /> : undefined}
          endIcon={isRTL ? <CalendarIcon /> : undefined}
          sx={{
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <span style={buttonTextStyle}>
            {startDate && endDate && isValid(startDate) && isValid(endDate)
              ? isRTL
                ? `${format(endDate, dateFormat)} - ${format(
                    startDate,
                    dateFormat
                  )}`
                : `${format(startDate, dateFormat)} - ${format(
                    endDate,
                    dateFormat
                  )}`
              : t("general.chooseDate")}
          </span>
          {allowClear && startDate && endDate && (
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{
                padding: "2px",
                marginLeft: "4px",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Button>
      </Box>

      <Modal open={openPicker} onClose={() => setOpenPicker(false)}>
        <Box sx={modalContainerStyle}>
          <Box
            sx={{
              display: "flex",
              flexDirection: isRTL ? "row-reverse" : "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              borderBottom: "1px solid #e0e0e0",
              paddingBottom: "12px",
            }}
          >
            <span style={{ ...FONT_FAMILY.Lexend(600, 18), color: "#344054" }}>
              {t("general.selectDateRange") || "Select Date Range"}
            </span>
            <IconButton
              onClick={() => setOpenPicker(false)}
              size="small"
              sx={{
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              "& .rdrCalendarWrapper": {
                width: "100%",
                maxWidth: "100%",
              },
              "& .rdrDateDisplayWrapper": {
                backgroundColor: "#f9fafb",
              },
              "& .rdrDefinedRangesWrapper": {
                "@media (max-width: 600px)": {
                  display: "none",
                },
              },
              "& .rdrMonth": {
                width: "100%",
                "@media (max-width: 600px)": {
                  fontSize: "0.9rem",
                },
              },
              "& .rdrStaticRange": {
                borderBottom: "1px solid #e0e0e0",
                padding: "10px 20px",
                "&:hover": {
                  backgroundColor: "#f5f7fa",
                },
              },
              "& .rdrStaticRangeSelected": {
                backgroundColor: "#e3f2fd !important",
                color: "#1976d2 !important",
                fontWeight: 600,
                borderLeft: "3px solid #1976d2",
                "&:hover": {
                  backgroundColor: "#e3f2fd !important",
                },
              },
              "& .rdrStaticRangeLabel": {
                padding: "0",
              },
            }}
          >
            {allowManualInput && (
              <Box
                sx={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "16px",
                  padding: "12px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <TextField
                  label={t("general.startDate") || "Start Date"}
                  value={startDateInput}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  error={startDateError}
                  helperText={
                    startDateError
                      ? `${
                          t("general.invalidDateFormat") ||
                          "Invalid date format"
                        }. ${t("general.use") || "Use"}: ${dateFormat}`
                      : `${t("general.format") || "Format"}: ${dateFormat}`
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    style: { textAlign: isRTL ? "right" : "left" },
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "#fff",
                      direction: dir,
                    },
                    "& .MuiInputBase-input": {
                      textAlign: isRTL ? "right" : "left",
                    },
                  }}
                />
                <TextField
                  label={t("general.endDate") || "End Date"}
                  value={endDateInput}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  error={endDateError}
                  helperText={
                    endDateError
                      ? `${
                          t("general.invalidDateFormat") ||
                          "Invalid date format"
                        }. ${t("general.use") || "Use"}: ${dateFormat}`
                      : `${t("general.format") || "Format"}: ${dateFormat}`
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    style: { textAlign: isRTL ? "right" : "left" },
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "#fff",
                      direction: dir,
                    },
                    "& .MuiInputBase-input": {
                      textAlign: isRTL ? "right" : "left",
                    },
                  }}
                />
              </Box>
            )}

            <DateRangePicker
              onChange={(item: any) => {
                const newRange = item.selection;
                setTempRange(newRange);

                // Update input fields when calendar selection changes
                if (
                  allowManualInput &&
                  newRange.startDate &&
                  newRange.endDate
                ) {
                  if (isValid(newRange.startDate)) {
                    setStartDateInput(format(newRange.startDate, dateFormat));
                    setStartDateError(false);
                  }
                  if (isValid(newRange.endDate)) {
                    setEndDateInput(format(newRange.endDate, dateFormat));
                    setEndDateError(false);
                  }
                }
              }}
              months={1}
              direction="vertical"
              scroll={{ enabled: false }}
              ranges={[tempRange]}
              staticRanges={staticRanges}
              inputRanges={[]}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: isRTL ? "row-reverse" : "row",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <PrimaryButton
              variant="outlined"
              onClick={() => setOpenPicker(false)}
              sx={{
                textTransform: "none",
                ...FONT_FAMILY.Lexend(500, 14),
                padding: "8px 20px",
                width: "fit-content",
              }}
            >
              {t("general.cancel") || "Cancel"}
            </PrimaryButton>
            <PrimaryButton variant="contained" onClick={handleSelectDates}>
              {t("general.apply") || "Apply"}
            </PrimaryButton>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export { ControlledDateRangePicker };
