import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, secondColor, neutralColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      subHeader: {
        ...FONT_FAMILY.Lexend(500, 24),
        color: secondColor(500),
        paddingBottom: 12,
      },
      noData: {
        width: "100%",
        alignItems: "center",
        backgroundColor: primaryColor(10),
        textAlign: "center" as "center",
        marginTop: 20,
        height: 42,
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 14),
      },
      noDataSpan: {
        width: "100%",
        alignItems: "center",
        backgroundColor: primaryColor(10),
        textAlign: "center" as "center",
        marginTop: 20,
        height: 42,
        color: secondColor(500),
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 14),
        cursor: "pointer",
      },
      clickableData: {
        padding: '0 10px',
        height: '26px',
        borderRadius: '4',
        ...FONT_FAMILY.Lexend(400, 14),
        '&:hover': {
          backgroundColor: neutralColor(200)
        }
      },
      buttonsContainerStyle: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "10px"
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
