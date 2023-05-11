import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { neutralColor, secondColor, primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        marginTop: convertHeightToVH(36),
        boxShadow: "0px 2px 2px rgba(0,0,0,0.25)",
      },
      header: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#ffffff",
        marginTop: 30,
        marginBottom: 45,
        height: 42,
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 14),
      },
      tableBody: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        alignitems: "flex-start",
      },
      skeletonRowStyle: {
        marginTop: convertHeightToVH(10),
      },
      noDataContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        color: secondColor(500),
        height: 200,
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 22),
      },
      line: {
        borderBottom: `0.4px solid ${neutralColor(600)}`,
      },
      filterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContainer: "flex-start",
        alignItems: "center",
        justifyContent: "space-around",
      },
      autoComplateStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 160,
        border: "1px solid #FFFFFF",
        backgroundColor: "#FFFFFF",
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 0,
        paddingLeft: 0,
        color: secondColor(400),
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.08)",
      },
      headerMainCointaner: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
      },
      listTitle: {
        width: 275,
        height: 25,
        ...FONT_FAMILY.Lexend(700, 20),
        fontStyle: "normal",
        lineHeight: "25px",
        display: "flex",
        alignItems: "center",
        textalign: "center",
        color: primaryColor(500),
      },
      filtersCointaner: {
        display: "flex",
        gap: 20,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
