import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";

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
      },
      autoComplateStyle: {
        width: convertWidthToVW(200),
      },
      buttonStyle: {
        width: convertWidthToVW(100),
        height: convertHeightToVH(50),
        marginRight: convertWidthToVW(10),
        backgroundColor: "#F135A3",
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
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
