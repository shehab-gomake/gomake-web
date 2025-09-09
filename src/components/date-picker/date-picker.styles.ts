import { styled } from "@mui/material/styles";
import { Stack } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";

export const DatePickerContainer = styled("div")(({ theme }) => ({
  position: "relative",
}));

export const DateInputStack = styled(Stack)(({ theme }) => ({
  gap: "3px",
  alignItems: "center",
}));

export const DateInput = styled("input")(({ theme }) => ({
  height: "36px",
  minWidth: "190px",
  width: "100%",
  cursor: "pointer",
  border: "1px solid #d0d5dd",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "14px",
  fontFamily: "Inter, sans-serif",
  backgroundColor: "#fff",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    // borderColor: "#2E3092",
  },
  "&:focus": {
    outline: "none",
    // borderColor: "#2E3092",
    boxShadow: "0 0 0 2px rgba(46, 48, 146, 0.1)",
  },
  "&::placeholder": {
    color: "#9CA3AF",
    fontFamily: "Heebo",
    ...FONT_FAMILY.Heebo(500, 12),
  },
}));

export const ClearButton = styled("button")(({ theme }) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "#F3F4F6",
  },
  "& svg": {
    fontSize: "20px",
    color: "#6B7280",
  },
}));

export const ModalContentStack = styled(Stack)(({ theme }) => ({
  gap: "10px",
  "&.mobile": {
    gap: "5px",
  },
}));

export const DateRangePickerWrapper = styled("div")(({ theme }) => ({
  "&.custom-date-range-picker": {
    "& .rdrDateRangePickerWrapper": {
      fontSize: "12px",
    },
    "& .rdrCalendarWrapper": {
      fontSize: "12px",
    },
    "& .rdrDateDisplayWrapper": {
      fontSize: "12px",
    },
    "& .rdrStaticRangeLabel": {
      fontSize: "12px",
    },
  },
}));

export const ChooseButton = styled("button")(({ theme }) => ({
  backgroundColor: "#2E3092",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 24px",
  fontSize: "14px",
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  cursor: "pointer",
  transition: "background-color 0.2s ease, transform 0.1s ease",
  "&:hover": {
    backgroundColor: "#1E1F7A",
    transform: "translateY(-1px)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));
