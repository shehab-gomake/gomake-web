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
        gap: convertWidthToVW(50),
        marginTop: convertHeightToVH(40),
      },
      autoComplateStyle: {
        width: convertWidthToVW(200),
      },
      buttonStyle: {
        width: convertWidthToVW(100),
        height: convertHeightToVH(50),
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
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
