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
    // borderColor: "var(--theme-primary-color, #2E3092)",
  },
  "&:focus": {
    outline: "none",
    // borderColor: "var(--theme-primary-color, #2E3092)",
    boxShadow: "0 0 0 2px rgba(46, 48, 146, 0.1)",
  },
  "&::placeholder": {
    color: "#9CA3AF",
    fontFamily: "Heebo",
    ...FONT_FAMILY.Heebo(500, 12),
  },
  // Mobile-specific styles
  "@media (max-width: 768px)": {
    height: "44px",
    fontSize: "16px", // Prevents zoom on iOS
    padding: "12px 16px",
    minWidth: "150px",
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
  minWidth: "32px",
  minHeight: "32px",
  "&:hover": {
    backgroundColor: "#F3F4F6",
  },
  "& svg": {
    fontSize: "20px",
    color: "#6B7280",
  },
  // Mobile-specific styles
  "@media (max-width: 768px)": {
    minWidth: "44px",
    minHeight: "44px",
    padding: "8px",
    "& svg": {
      fontSize: "24px",
    },
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
      width: "100%",
    },
    "& .rdrCalendarWrapper": {
      fontSize: "12px",
      width: "100%",
    },
    "& .rdrDateDisplayWrapper": {
      fontSize: "12px",
    },
    "& .rdrStaticRangeLabel": {
      fontSize: "12px",
      padding: "8px 12px",
    },
    "& .rdrStaticRange": {
      padding: "4px 8px",
    },
    "& .rdrDay": {
      width: "32px",
      height: "32px",
      fontSize: "14px",
    },
    "& .rdrDayNumber": {
      fontSize: "14px",
    },
    "& .rdrWeekDay": {
      fontSize: "12px",
      padding: "8px 4px",
    },
    "& .rdrMonthAndYearWrapper": {
      padding: "8px 12px",
    },
    "& .rdrMonthAndYearPickers": {
      fontSize: "14px",
    },
    "& .rdrNextPrevButton": {
      width: "32px",
      height: "32px",
    },
  },
}));

export const ChooseButton = styled("button")(({ theme }) => ({
  backgroundColor: "var(--theme-primary-color, #2E3092)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 24px",
  fontSize: "14px",
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  cursor: "pointer",
  transition: "background-color 0.2s ease, transform 0.1s ease",
  minHeight: "44px", // Better touch target for mobile
  width: "100%", // Full width on mobile
  "&:hover": {
    backgroundColor: "#1E1F7A",
    transform: "translateY(-1px)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  // Mobile-specific styles
  "@media (max-width: 768px)": {
    padding: "16px 24px",
    fontSize: "16px",
    minHeight: "48px",
  },
}));
