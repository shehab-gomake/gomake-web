import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  return {
    mainContainer: {
      display: "flex",
      flexDirection: "column" as "column",
      gap: "20px",
    },
    tableContainer: {
      maxHeight: "400px",
      overflow: "auto",
      "& table thead th:first-of-type": {
        textAlign: "center",
      },
      "& table tbody td:first-of-type": {
        textAlign: "center",
      },
      "& table tbody td:last-of-type": {
        textAlign: "center",
      },
      "& table thead th:last-of-type": {
        textAlign: "center",
      },
    },
    inputContainer: {
      display: "flex",
      flexDirection: "row" as "row",
      alignItems: "center",
      gap: "16px",
    },
    sendingMethodsContainer: {
      display: "flex",
      flexDirection: "row" as "row",
      gap: "24px",
      alignItems: "center",
    },
    totalPaymentContainer: {
      padding: "16px",
      borderRadius: "4px",
    },
  };
};

export { useStyle };

