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
        gap: convertWidthToVW(50),
        marginTop: convertHeightToVH(40),
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
      addCustomerBtnText: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: "#101020",
      },
      addCustomerBtnStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "#DCDCEC",
        borderRadius: 4,
        cursor: "pointer",
        width: 180,
        height: 40,
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
