import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      modalInsideStyle: {
        width: "600px",
        minWidth: "500px",
        maxHeight: "80vh",
        padding: "20px",
      },
      errorBox: {
        padding: "10px",
        backgroundColor: "#FEE4E2",
        color: "#D92D20",
        borderRadius: "8px",
        ...FONT_FAMILY.Inter(400, 14),
      },
      sectionTitle: {
        ...FONT_FAMILY.Inter(500, 16),
        color: "#344054",
      },
      addButtonStyle: {
        borderRadius: "8px",
        height: "36px",
        width: "fit-content",
      },
      scrollableContainer: {
        maxHeight: "60vh",
        overflowY: "auto" as "auto",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#cccdcf",
          borderRadius: "10px",
        },
      },
      emptyStateBox: {
        padding: "40px",
        textAlign: "center" as "center",
        color: "#98A2B3",
        ...FONT_FAMILY.Inter(400, 14),
      },
      stepCard: {
        padding: "16px",
        border: "1px solid #D0D5DD",
        borderRadius: "8px",
        backgroundColor: "#FAFAFA",
      },
      labelStyle: {
        ...FONT_FAMILY.Inter(500, 14),
        color: "#344054",
        display: "block",
        marginBottom: "8px",
      },
      textInputStyle: {
        width: "100%",
        borderRadius: "8px",
        "& .MuiOutlinedInput-root": {
          "& input": {
            height: "44px",
          },
        },
      },
      colorPickerContainer: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        border: "1px solid #D0D5DD",
        borderRadius: "8px",
        backgroundColor: "white",
        cursor: "pointer",
        width: "140px",
      },
      colorCircle: {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        border: "1px solid #D0D5DD",
      },
      colorCircleLarge: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: "1px solid #D0D5DD",
      },
      colorText: {
        ...FONT_FAMILY.Inter(400, 14),
        color: "#344054",
        flex: 1,
      },
      arrowIcon: {
        color: "#98A2B3",
        fontSize: "18px",
      },
      cancelButtonStyle: {
        borderRadius: "8px",
        height: "36px",
        background: "white",
        color: "#000000",
        border: "1px solid #D0D5DD",
      },
      saveButtonStyle: {
        borderRadius: "8px",
        height: "36px",
      },
      stepTitle: {
        ...FONT_FAMILY.Inter(500, 14),
        color: "#344054",
      },
      stepSubtitle: {
        ...FONT_FAMILY.Inter(400, 12),
        color: "#98A2B3",
      },
      editIconButton: {
        color: primaryColor(700) || "#344054",
        padding: "8px",
        borderRadius: "8px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: primaryColor(50) || "#F2F4F7",
          color: primaryColor(800) || "#344054",
        },
      },
      deleteIconButton: {
        color: "#D92D20",
        padding: "8px",
        borderRadius: "8px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "#FEE4E2",
          color: "#B42318",
        },
      },
      dividerStyle: {
        marginTop: "12px",
      },
    };
  }, [primaryColor]);

  return {
    classes,
  };
};

export { useStyle };
