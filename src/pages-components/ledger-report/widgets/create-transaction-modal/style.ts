import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "40%",
        borderRadius: 5,
        height: "auto",
        maxHeight: 750,
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 20,
        paddingTop: "20px",
      },
      inputsRowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        flexWrap: "wrap" as "wrap",
        gap: 15,
      },
      inputsColumnStyle: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        width: "100%",
        flexWrap: "wrap" as "wrap",
        gap: 15,
      },
      date2FilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "200px",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
      textInputStyle: {
        width: "100%",
        border: "none",
        height: 40,
      },
      createBtnStyle: {
        height: 40,
        width: "fit-content",
      },
      dateStyle: {
        display: "flex",
        position: "relative" as "relative",
        ...FONT_FAMILY.Lexend(500, 14),
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
      },

      datePickerContainer: {
        width: "50%",
        display: "flex",
        position: "absolute" as "absolute",
        top: 0,
        left: 60,
        visibility: "hidden" as "hidden",
      },

      datePickerinvidualContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--theme-bg-primary, #FFF)",
        boxShadow: "var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
        height: "var(--theme-input-height, 40px)", 
        width: "100%",
        paddingLeft: 10,
        paddingRight: 10,
        cursor: "pointer",
        position: "relative" as "relative",
        border:
        "var(--theme-input-border-hover, 1px solid var(--theme-input-border-color, #FFFFFF))",
        borderRadius: "var(--theme-radius-md, 8px)",
      },
      descriptionStyle: {
        width: "100%",
        minHeight: "120px",
      },
      descriptionSx:{
        "& .MuiOutlinedInput-root": {
          minHeight: "120px",
          alignItems: "flex-start",
          borderRadius: "var(--radius-md, 8px)",
          background: "var(--Colors-Background-bg-primary, #FFF)",
          border: "1px solid var(--Colors-Border-border-primary, #D0D5DD)",
          "& fieldset": {
            border: "none",
            
          },
          "&:hover fieldset": {
            border: "none",
          },
          "&.Mui-focused fieldset": {
            border: "none",
          },
        },
        "& .MuiInputBase-input": {
          minHeight: "120px !important",
          padding: "var(--spacing-lg, 12px) 14px",

        },
      }
      
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
