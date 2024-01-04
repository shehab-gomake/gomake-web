import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor, secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: 444,
        borderRadius: 12,
        height: 747,
        backgroundColor: "#FFFFFF",
        padding: 20,
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
      },
      closeIcon: {
        zIndex: 10000,
        position: "absolute" as "absolute",
        right: 10,
        top: 10,
      },
      titleStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
        width: "100%",
        marginBottom: 6,
      },
      multiSelectContainer: {
        border: "1px solid rgba(208, 213, 221, 1)",
        width: "100%",
        height: 44,
      },
      multiSelectMainContainer: { width: "100%", marginBottom: 16 },
      tableContainer: {
        border: "1px solid rgba(208, 213, 221, 1)",
        borderRadius: 8,
        width: "100%",
        height: 565,
      },
      headerTableContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 44,
        background: "rgba(244, 241, 246, 1)",
        paddingLeft: 24,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottom: "1px solid rgba(208, 213, 221, 1)",
      },
      headerTableStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        width: "100%",
      },
      childernTableContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: 521,
        overflow: "scroll",
      },
      childernTableRowContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
      },
      childLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        position: "relative" as "relative",
      },
      saveBtnContainerStyle: {
        marginTop: 16,
        height: 40,
        backgroundColor: secondColor(500),
      },
      textInputStyle: {
        width: 90,
        height: 34,
        boxShadow: "none",
        color: "black",
        ...FONT_FAMILY.Lexend(500, 14),
        // border: "1px solid rgba(237, 2, 140, 1)",
        borderRadius: 4,
      },
      childRowContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        height: 40,
        borderBottom: "1px solid rgba(208, 213, 221, 1)",
      },
      iconsContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        position: "absolute",
        top: 2,
        right: 15,
      },
      iconContainer: {
        width: 12,
        height: 12,
        cursor: "pointer",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
