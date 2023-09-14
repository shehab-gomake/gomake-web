import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";

const useStyle = () => {
  const { t } = useTranslation();
  const clasess = useMemo(() => {
    return {
      filterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContainer: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: "20px",
        marginBottom: "20px",
      },
      autoComplateStyle: {
        width: convertWidthToVW(200),
      },
      tableContainer: {
        width: "100%",
      },
      autoButtonStyle: {
        width: convertWidthToVW(100),
        height: convertHeightToVH(30),
        marginRight: convertWidthToVW(1),
      },
      sameRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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
        width: "100%",
        gap: "20px",
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
        backgroundColor: "#F8F8F8"
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
