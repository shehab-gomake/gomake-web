import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { adaptLeft } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { primaryColor, secondColor } = useGomakeTheme();
  const { t } = useTranslation();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "60%",
        borderRadius: 5,
        height: "100%",
        maxHeight: 900,
        backgroundColor: "#F6F6F6",
        padding: 45,
      },
      firstContainer: {
        position: "absolute" as "absolute",
        ...adaptLeft(t("direction"), 47),
        top: 45,
      },
      headerContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
      },
      bodyContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        height: "90%",
        overflow: "scroll",
        marginBottom: 15,
        marginTop: 20,
      },
      footerContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
      },
      switchContainer:{ display: "flex", flexDirection: "row" as "row", justifyContent: "flex-start", alignItems: "center" },
      switchlabel:{
        ...FONT_FAMILY.Lexend(400,12),
        color:"#000"
      },
      switchlabelSelected:{
        ...FONT_FAMILY.Lexend(400,12),
        color:secondColor(500)
      },
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap" as "wrap",
        width: "100%",
        gap: 16,
        marginTop: 24,
        marginBottom: 20,
      },
      shapeContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: 250,
        height: 375,
        backgroundColor: "white",
        gap: 12,
        cursor: "pointer",
        "box-shadow": "0px 4px 20px 0px rgba(0, 0, 0, 0.08)",
      },
      fixdCard: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        width: 250,
        height: 375,
        backgroundColor: "white",
        gap: 12,
        cursor: "pointer",
        "box-shadow": "0px 4px 20px 0px rgba(0, 0, 0, 0.08)",
        padding: "15px 23px",
      },
      cardItemStyle: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #FFFF",
        width: "100%",
        height: "100%",
        gap: 15,
      },
      cardIconStyle: {
        height: 55,
      },
      cardNameStyle: {
        ...FONT_FAMILY.Lexend(500, 20),
        color: "#FFFFFF",
        textAlign: "center" as "center",
        height: 55,
      },
      shapeSelectedContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: 250,
        height: 375,
        backgroundColor: "white",
        gap: 12,
        border: `1px solid ${secondColor(500)}`,
        cursor: "pointer",
      },
      shapeNameStyle: {
        ...FONT_FAMILY.Lexend(500, 20),
        color: primaryColor(500),
        paddingLeft: 16,
      },
      shapeWidthHeightStyle: {
        ...FONT_FAMILY.Lexend(400, 16),
        color: primaryColor(900),
        paddingLeft: 16,
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        gap: 16,
        marginTop: 8,
      },
      customizeBtnStyle: {
        width: "15%",
        height: 40,
      },
      chooseBtnStyle: {
        width: "15%",
        height: 40,
        backgroundColor: secondColor(500),
      },
    };
  }, [t]);
  return {
    clasess,
  };
};
export { useStyle };
