import { useTranslation } from "react-i18next";
import { useQuoteGetData } from "./use-quote-get-data";

const useQuote = () => {
  const { t } = useTranslation();
  const {} = useQuoteGetData();

  const tableHeaders = [
    "ID",
    "Item name",
    "Details",
    "Amount",
    "Unit price",
    "Discount",
    "Final price",
    "More",
  ];
  const tableRowPercent = [
    "35px",
    "20%",
    "30%",
    "10%",
    "10%",
    "10%",
    "10%",
    "10%",
  ];
  return {
    t,
    tableHeaders,
    tableRowPercent,
  };
};

export { useQuote };
