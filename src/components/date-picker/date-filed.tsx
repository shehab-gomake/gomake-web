import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  TextField,
  Box,
  Typography,
  InputAdornment,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { useSnackBar } from "@/hooks";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface IDateFieldProps {
  label: string;
  date: string;
  handleChange: (newDate: string | null) => void;
  isEditable?: boolean;
  inputRef?: any;
  preventOpenCondition?: boolean | null;
  preventOpenMessage?: string;
  withTime?: boolean; // New prop to toggle time selection
  format?: string;
  inputWidth?: string;
  openPicker?: boolean;
  onClose?: () => void;
  isHidden?: boolean;
  direction?: "row" | "column";
  compactMode?: boolean;
}

const DateField: React.FC<IDateFieldProps> = ({
  label,
  date,
  handleChange,
  isEditable = false,
  inputRef,
  preventOpenCondition = null,
  preventOpenMessage = "home.admin.pleaseSelectCustomer",
  withTime = false,
  format = "DD/MM/YYYY HH:mm",
  inputWidth = null,
  openPicker = false,
  onClose = null,
  isHidden = false,
  direction = "row",
  compactMode = false,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const { alertFault } = useSnackBar();
  const [open, setOpen] = useState(openPicker);

  const theme = createTheme({
    direction: dir, // Ensure the theme is in RTL mode
  });

  useEffect(() => {
    setOpen(openPicker);
  }, [openPicker]);

  useEffect(() => {
    if (!open && onClose) {
      onClose();
    }
  }, [open]);

  const handleDateChange = (newDate: any) => {
    const formattedDate = newDate
      ? withTime
        ? moment(newDate).format("YYYY-MM-DDTHH:mm:ss") // Include time
        : moment(newDate).format("YYYY-MM-DD") // Date only
      : null;
    handleChange(formattedDate);
  };

  const handleOpenPicker = (event: React.MouseEvent) => {
    if (preventOpenCondition) {
      event.stopPropagation();
      event.preventDefault();
      alertFault(preventOpenMessage);
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const textFieldSlot = useMemo(
    () => (params: any) =>
      (
        <TextField
          {...params}
          size={compactMode ? "small" : "medium"}
          placeholder={t("sales.quote.selectDate")}
          disabled={!isEditable}
          InputProps={{
            ...params.InputProps,
            endAdornment: isEditable && (
              <InputAdornment position="end">
                {params.InputProps?.endAdornment}
              </InputAdornment>
            ),
          }}
          // onClick={!compactMode ? handleOpenPicker : undefined}
          onClick={handleOpenPicker}
          sx={{
            marginRight: isRTL ? "6px" : isEditable ? "0px" : "-100px",
            marginLeft: !isRTL ? "0px" : isEditable ? "0px" : "-100px",
            "& .MuiInputAdornment-root": {
              marginLeft: isRTL ? "0px" : withTime ? "-10px" : "-30px",
              marginRight: isRTL ? (withTime ? "-10px" : "-30px") : "0px",
            },
          }}
        />
      ),
    [t, isEditable, preventOpenCondition, withTime]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        ref={inputRef}
        sx={{
          display: "flex",
          flexDirection: direction,
          alignItems: direction === "row" ? "center" : "flex-start",
          padding: 0,
          ...(inputWidth && { width: inputWidth }),
          ...(compactMode && {
            gap: "6px",
          }),
        }}
      >
        <Typography
          variant={compactMode ? "subtitle1" : "subtitle2"}
          sx={{
            whiteSpace: "nowrap",
            padding: "0px",
            color: compactMode ? "black" : "#667085",
            fontSize: compactMode ? "14px" : undefined,
            fontWeight: compactMode ? 500 : undefined,
          }}
        >
          {label}
        </Typography>
        {withTime ? (
          <DateTimePicker
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            value={date ? moment(date) : null}
            // onChange={handleDateChange}
            onAccept={handleDateChange}
            disabled={!isEditable}
            slots={{
              textField: textFieldSlot,
            }}
            sx={isHidden && { display: "none" }}
            format={format}
            ampm={false}
          />
        ) : (
          <DatePicker
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            value={date ? moment(date) : null}
            onChange={handleDateChange}
            disabled={!isEditable}
            slots={{
              textField: textFieldSlot,
            }}
            format="DD/MM/YYYY"
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export { DateField };
