import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { errorColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      writeCommentContainer: {
        display: "flex",
        // flexDirection: "row" as "row",
        // justifyContent: "space-between",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        padding: "14px 29px",
        background: "#F4F1F6",
      },
      firstContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        flexWrap: "wrap" as "wrap",
        gap: 5,
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap" as "wrap",
        gap: 12,
      },
      rejectBtn: {
        ...FONT_FAMILY.Inter(600, 14),
        height: 40,
        width: "fit-content",
        // width: "114px",
        padding: "8px 14px",
        borderRadius: 8,
        lineHeight: "14px",
        color: "#C5372C",
        borderColor: "#C5372C"
      },
      rejectBtnClicked: {
        ...FONT_FAMILY.Inter(600, 14),
        height: 40,
        width: "fit-content",
        // width: "114px",
        padding: "8px 14px",
        borderRadius: 8,
        lineHeight: "14px",
        color: "#C5372C",
        borderColor: "#C5372C",
        background: errorColor(100)
      },

      btnStyle: {
        ...FONT_FAMILY.Inter(600, 14),
        height: 40,
        width: "fit-content",
        padding: "8px 14px",
        borderRadius: 8,
        lineHeight: "14px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
