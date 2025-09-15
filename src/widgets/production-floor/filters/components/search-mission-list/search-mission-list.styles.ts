import { styled } from "@mui/system";
import { Paper, MenuItem } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";

export const ScrollableDiv = styled("div")(({ theme }) => ({
  maxHeight: "35vh",
  overflowY: "auto",
  overflowX: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "white",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#EAECF0",
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#b0b0b0",
  },
  "&::-webkit-scrollbar-button": {
    display: "none",
  },
}));

export const SearchMissionPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  zIndex: 99999,
  padding: "10px",
  gap: "10px",
  marginTop: "40px",
  marginLeft: "10px",
  minWidth: "200px",
  height: "fit-content",
  maxHeight: "216px",
  overflowX: "scroll",
  overflowY: "scroll",
  position: "absolute",
  borderRadius: "var(--radius-md, 8px)",
  border: "1px solid var(--Colors-Border-border-secondary, #EAECF0)",
  background: "var(--Colors-Background-bg-primary, #FFF)",
  boxShadow:
    "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
}));

export const MissionRowStyle = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  padding: "8px",
  alignItems: "center",
  flex: "1 0 0",
  color: "var(--colors-text-text-primary-900, #101828)",
  fontStyle: "normal",
  lineHeight: "24px",
  ...FONT_FAMILY.Inter(500, 16),
}));

export const LabelListStyle = {
  display: "inline-block",
  maxWidth: "280px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  verticalAlign: "middle",
};
