import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { grayColor, theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      dateFiled: {
        display: "flex",
        position: "relative" as "relative",
        ...FONT_FAMILY.Lexend(400, 16),
        color: grayColor(500),
        cursor: "pointer",
        gap: "5px",
      },
      dateValue: {
        color: "black",
      },
      datePickerContainer: {
        display: "flex",
        position: "absolute" as "absolute",
        top: 0,
        right: 100,
        visibility: "hidden" as "hidden",
      },
      datesContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 17,
        paddingBottom: 14,
        borderBottom: `1px solid ${grayColor(200)}`,
        marginBottom: 14,
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
