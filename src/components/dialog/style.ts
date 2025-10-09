import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

interface UseStyleProps {
  customStyles?: {
    paper?: React.CSSProperties;
    header?: React.CSSProperties;
    title?: React.CSSProperties;
    content?: React.CSSProperties;
    footer?: React.CSSProperties;
  };
  isRTL?: boolean;
}

const useStyle = ({ customStyles, isRTL = false }: UseStyleProps) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      paper: {
        borderRadius: "12px",
        maxHeight: "90vh",
        ...customStyles?.paper,
      },
      header: {
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `1px solid #E0E0E0`,
        padding: "8px 16px",
        backgroundColor: "#F5F5F5",
        ...customStyles?.header,
      },
      title: {
        fontSize: "18px",
        fontWeight: 600,
        color: "#000",
        ...FONT_FAMILY.Lexend(600, 18),
        ...customStyles?.title,
      },
      closeButton: {
        color: neutralColor(600),
        "&:hover": {
          backgroundColor: neutralColor(100),
        },
      },
      content: {
        padding: "8px 16px",
        backgroundColor: "#fafafa",
        ...customStyles?.content,
      },
      footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        padding: "8px 16px",
        borderTop: `1px solid #E0E0E0`,
        backgroundColor: "#F5F5F5",
        ...customStyles?.footer,
      },
      footerButtonsContainer: {
        display: "flex",
        flexDirection: "row-reverse" as "row-reverse",
        gap: "12px",
        ...(isRTL ? { marginRight: "auto" } : { marginLeft: "auto" }),
      },
      additionalButtonsContainer: {
        display: "flex",
        gap: "12px",
      },
      primaryButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "100px",
        height: "40px",
        borderRadius: "8px",
        ...FONT_FAMILY.Lexend(500, 14),
        backgroundColor: primaryColor(500),
        color: "#FFFFFF",
        textTransform: "none" as const,
        "&:hover": {
          backgroundColor: primaryColor(600),
        },
        "&:disabled": {
          backgroundColor: neutralColor(300),
          color: neutralColor(500),
        },
      },
      cancelButton: {
        minWidth: "100px",
        height: "40px",
        borderRadius: "8px",
        ...FONT_FAMILY.Lexend(500, 14),
        backgroundColor: "transparent",
        color: neutralColor(700),
        border: `1px solid ${neutralColor(300)}`,
        textTransform: "none" as const,
        "&:hover": {
          backgroundColor: neutralColor(100),
          borderColor: neutralColor(400),
        },
      },
      primaryButtonIconContainer: {
        width: "16px",
        height: "16px", 
      },
      primaryButtonContainer: {
     display: "flex",
     flexDirection: "row" as "row",
     justifyContent: "center",
     alignItems: "center",
     gap: "8px",
     width: "100%",
      },
    };
  }, [primaryColor, neutralColor, customStyles, isRTL]);

  return {
    classes,
  };
};

export { useStyle };

