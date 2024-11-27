import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Box, Typography, InputAdornment } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { useSnackBar } from "@/hooks";

interface IDateFieldProps {
  label: string;
  date: string; // Expected to be in "YYYY-MM-DD" format
  handleChange: (newDate) => void;
  isEditable?: boolean;
  inputRef?: any;
  preventOpenCondition?: boolean | null;
  preventOpenMessage?: string;
}

const DateField: React.FC<IDateFieldProps> = ({
  label,
  date,
  handleChange,
  isEditable = false,
  inputRef,
  preventOpenCondition = null,
  preventOpenMessage = "home.admin.pleaseSelectCustomer",
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const { alertFault } = useSnackBar();
  const [open, setOpen] = useState(false);

  const handleDateChange = (newDate: any) => {
    const formattedDate = newDate ? moment(newDate).format("YYYY-MM-DD") : null;
    handleChange(formattedDate);
  };

  const handleOpenPicker = (event: React.MouseEvent) => {
    if (preventOpenCondition) {
      event.stopPropagation();
      event.preventDefault();
      alertFault(t(preventOpenMessage));
      setOpen(false); // Ensure the picker does not open
    } else {
      setOpen(true);
    }
  };

  const textFieldSlot = useMemo(
    () => (params: any) =>
      (
        <TextField
          {...params}
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
          onClick={handleOpenPicker}
          sx={{
            marginRight: isRTL ? "6px" : isEditable ? "0px" : "-100px",
            marginLeft: !isRTL ? "0px" : isEditable ? "0px" : "-100px",

            "& .MuiInputAdornment-root": {
              marginLeft: isRTL ? "0px" : "-30px",
              marginRight: isRTL ? "-30px" : "0px",
            },
          }}
        />
      ),
    [t, isEditable, preventOpenCondition]
  );

  return (
    <Box
      ref={inputRef}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 0,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ whiteSpace: "nowrap", color: "#667085" }}
      >
        {label}
      </Typography>
      <DatePicker
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={date ? moment(date).toDate() : null}
        onChange={handleDateChange}
        disabled={!isEditable}
        slots={{
          textField: textFieldSlot,
        }}
      />
    </Box>
  );
};

export { DateField };
