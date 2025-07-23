import { useTranslation } from "react-i18next";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { ReceiptItem } from "./receipt-summary-content";
import { useDateFormat } from "@/hooks/use-date-format";

const useReceiptSummaryContent = (
  items: ReceiptItem[],
  totalPayment: number
) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const { formatISODateTime } = useDateFormat();
  const { getCurrencyUnitText, quoteItemValue } = useQuoteGetData();
  const currencySymbol = getCurrencyUnitText(quoteItemValue?.currency);

  const totalAgreement = items.reduce((sum, item) => sum + item.sumApplied, 0);
  const remainingToPay = totalAgreement - totalPayment;

  const tableHeaders = [
    t("payment.documentDate"),
    t("payment.documentNumber"),
    t("payment.documentType"),
    t("payment.sum"),
  ];

  return {
    t,
    tableHeaders,
    currencySymbol,
    isRTL,
    totalAgreement,
    remainingToPay,
    formatISODateTime,
  };
};

export { useReceiptSummaryContent };
