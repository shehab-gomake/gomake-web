import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      financialDiv: {
        paddingTop: "30px",
        position: "relative" as "relative",
        height: "78vh",
        overflow: "auto",
        gap: "30px",
        display: "flex",
        flexDirection: "column" as "column",
      },
      connectedBtn: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        color: "green",
        fontWeight: 600,
        marginTop: "8px",
        alignSelf: "end",
        backgroundColor: "#e6ffe6",
        padding: "4px 8px",
        borderRadius: "8px",
      },
      bankAccountsContainer: {
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        overflow: "hidden" as "hidden",
      },
      bankAccountItemContainer: {
        marginTop: "16px",
        paddingBottom: "16px",
        borderBottom: "1px solid #E5E7EB",
      },
      bankAccountLabel: {
        fontSize: "16px",
        fontWeight: "600",
        margin: "0 0 16px 0",
        color: "#374151",
        borderBottom: "1px solid #E5E7EB",
        paddingBottom: "8px",
      },
      bankAccountInputsRow: {
        display: "flex",
        alignItems: "center" as "center",
        gap: "16px",
        flexWrap: "wrap" as "wrap",
        paddingTop: 0,
      },
      stickyButtonContainer: {
        position: "sticky" as "sticky",
        top: 0,
        zIndex: 10,
        marginBottom: "8px",
        display: "flex",
        justifyContent: "flex-start",
      },
      scrollableTransitionGroup: {
        flex: 1,
        overflowY: "auto" as "auto",
        paddingRight: "8px",
        minHeight: 0,
      },
      addButton: {
        width: "fit-content" as "fit-content",
        height: "40px",
        borderRadius: "8px",
        fontWeight: 500,
        padding: "8px 16px",
      },
      multiInputLabel: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#374151",
      },
      modalInsideStyle: {
        width: "30%",
        borderRadius: 8,
        gap: "8px",
        height: "auto",
        maxHeight: 500,
        backgroundColor: "#f7f7f7",
      },
      modalTextInputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "15px",
      },
      modalAddButtonContainer: {
        marginTop: "10px",
        display: "flex",
        justifyContent: "center" as "center",
        width: "100%",
      },
      required: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#d32f2f",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
