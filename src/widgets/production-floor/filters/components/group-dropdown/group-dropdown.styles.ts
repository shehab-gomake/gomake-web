import { styled } from "@mui/system";
import { FormControl, MenuItem, Box } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";

export const GroupDropdown = styled(FormControl)<{ dir?: string }>(
  ({ theme, dir }) => ({
    minWidth: "120px",
    // border: "1px solid #d0d5dd",
    // borderRadius: "8px",
    "& .MuiOutlinedInput-root": {
      height: "35px",
      borderRadius: "4px",
      "& fieldset": {
        borderColor: "#EAECF0",
      },
      "&:hover fieldset": {
        borderColor: "#2E3092",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2E3092",
      },
    },
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      ...FONT_FAMILY.Inter(400, 14),
    },
    "& .MuiSelect-icon": {
      ...(dir === "rtl" && {
        right: "auto",
        left: "7px",
      }),
    },
    "& .MuiInputBase-input": {
      ...(dir === "rtl" && {
        paddingLeft: "32px",
        paddingRight: "12px !important",
      }),
    },
  })
);

export const ColorIndicator = styled(Box)<{ color: string }>(({ color }) => ({
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: color,
  flexShrink: 0,
}));

export const GroupMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  minHeight: "40px",
  "&:hover": {
    backgroundColor: "#F8F8F8",
  },
}));
