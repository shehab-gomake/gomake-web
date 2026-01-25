import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useStyle as useBaseStyle } from "@/widgets/machines/components/categories-table/style";

export const useStyle = () => {
  const { classes: baseClasses } = useBaseStyle();
  const { t } = useTranslation();
  const isRTL = t("direction") === "rtl";

  const classes = useMemo(() => {
    return {
      mainContainer: {
        ...baseClasses.mainContainer,
        display: "flex",
        flexDirection: "column" as "column",
        height: "100%",
        overflow: "hidden",
      },
      loadingContainer: {
        ...baseClasses.mainContainer,
        padding: "16px 20px",
      },
      loadingText: {
        fontFamily: "'Forma DJR UI', sans-serif",
        fontSize: "14px",
        color: "#1A1A1A",
      },
      scrollableContent: {
        width: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        gap: "8px",
        flex: 1,
        overflowY: "auto" as "auto",
        overflowX: "hidden" as "hidden",
        padding: "16px 20px",
      },
      emptyStateContainer: {
        padding: "24px",
        alignItems: "center",
        justifyContent: "center",
      },
      emptyStateTitle: {
        fontFamily: "'Forma DJR UI', sans-serif",
        fontSize: "16px",
        fontWeight: 500,
        color: "#1A1A1A",
        textAlign: "center" as "center",
      },
      emptyStateSubtitle: {
        fontFamily: "'Forma DJR UI', sans-serif",
        fontSize: "14px",
        fontWeight: 400,
        color: "#666666",
        textAlign: "center" as "center",
        marginTop: "8px",
      },
      searchInputAdornment: {
        margin: "0px 3px",
      },
      searchInputDirection: {
        direction: isRTL ? ("rtl" as "rtl") : ("ltr" as "ltr"),
      },
      machineItemBorderBottom: (isLast: boolean) => ({
        borderBottom: isLast ? "none" : "1px solid #E0E0E0",
      }),
      deleteModalContainer: {
        position: "relative" as "relative",
      },
      deleteModalIconContainer: {
        textAlign: "center" as "center",
        marginBottom: 2,
      },
      deleteModalTitle: {
        fontWeight: 600,
        color: "#333",
        marginBottom: 2,
        fontFamily: "'Forma DJR UI', sans-serif",
      },
      deleteModalMessage: {
        color: "#666",
        marginBottom: 3,
        lineHeight: 1.5,
        fontFamily: "'Forma DJR UI', sans-serif",
      },
      deleteModalActions: {
        display: "flex",
        gap: 2,
        justifyContent: "center" as "center",
      },
      cancelButton: {
        minWidth: "100px",
        borderColor: "#ccc",
        color: "#333",
        "&:hover": {
          borderColor: "#999",
          backgroundColor: "#f5f5f5",
        },
      },
      deleteButton: {
        minWidth: "100px",
        backgroundColor: "#CC2C00",
        color: "white",
        "&:hover": {
          backgroundColor: "#b71c1c",
        },
      },
      addMachineModalStyle: {
        width: "800px",
        height: "fit-content",
      },
      deleteModalStyle: {
        width: "500px",
        height: "fit-content",
        padding: "24px",
        textAlign: "center" as "center",
      },
    };
  }, [baseClasses.mainContainer, isRTL]);

  return { classes };
};
