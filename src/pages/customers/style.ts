import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const { secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      filterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContainer: "flex-start",
        alignItems: "flex-end",
        // width: "100%",
        gap: "20px",
      },
      autoComplateStyle: {
        width: convertWidthToVW(200),
      },
      tableContainer: {
        width: "100%",
      },
      labelFilterStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
      filterSectionContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
      },
      autoButtonStyle: {
        width: convertWidthToVW(100),
        height: convertHeightToVH(30),
        marginRight: convertWidthToVW(1),
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        paddingLeft: 20,
        paddingRight: 20,
        height: "100%",
        overflowY: "auto" as "auto",
        marginBottom: "20px",
      },
      sameRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      },
      searchInputContainer: {
        width: convertWidthToVW(375),
        backgroundColor: "#F8F8F8",
        borderRadius: 10,
        height: 30,
      },
      subHeaderRightSide: {
        display: "flex",
        alignSelf: "flex-end",
      },
      subHeaderContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
        gap: "20px",
        marginBottom: 20,
      },
      dropDownListStyle: {
        width: convertWidthToVW(200),
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
      },
      cleanBtnStyle: {
        backgroundColor: "#FFFFFF",
        border: `1px solid ${secondColor(500)}`,
      },
      paginationStyle: {
        display: "flex",
        paddingLeft: 20,
        paddingRight: 20,
        height: "50px",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
      },
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
