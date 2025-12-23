import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        padding: "20px",
      },
      paper: {
        borderRadius: "8px",
        border: `1px solid ${primaryColor(100)}`,
        overflow: "hidden",
      },
      tableRow: {
        backgroundColor: primaryColor(50),
      },
      headerCell: {
        ...FONT_FAMILY.Lexend(600, 14),
        color: primaryColor(900),
        borderBottom: `1px solid ${primaryColor(200)}`,
      },
      bodyRow: {
        "&:nth-of-type(even)": {
          backgroundColor: primaryColor(25),
        },
        "&:hover": {
          backgroundColor: primaryColor(100),
        },
        cursor: "default",
        "&:hover td": {
          cursor: "default",
        },
      },
      bodyCell: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(700),
        padding: "12px",
      },
      emptyState: {
        textAlign: "center" as const,
        padding: "40px",
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(500),
      },
      buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "20px",
      },
    };
  }, [primaryColor]);

  return {
    classes,
  };
};

export { useStyle };
