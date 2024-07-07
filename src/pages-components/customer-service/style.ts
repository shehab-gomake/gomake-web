import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const { secondColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      cleanBtnStyle: {
        backgroundColor: "#FFFFFF",
        border: `1px solid ${secondColor(500)}`,
      },
      sameRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      },
      filterSectionContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
      },
      labelFilterStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
      dropDownListStyle: {
        width: convertWidthToVW(500),
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
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
      filterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContainer: "flex-start",
        alignItems: "flex-end",
        // width: "100%",
        gap: "20px",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        // alignItems: "flex-start",
        gap: 20,
        paddingLeft: 20,
        paddingRight: 20,
        position: "relative" as "relative",
        paddingBottom: 40,
      },
      btnContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        width: "fit-content",
        alignSelf: "flex-end",
        height: 40,
      },
      insideStyle: {
        width: "600px",
        height: "fit-content",
      },
      mainModalContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20,
        marginTop: 15,
      },
      multiTextInput: {
        height: "150px",
        width: "100%",
        border: "none",
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
        padding: 10,
        overflow: "scroll",
      },
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
