import { ETabsIcon } from "@/enums";
import { FinishingIcon, PricingIcon, PrintingDetailsIcon } from "@/icons";
import { QUOTE_STATUSES } from "@/pages-components/quotes/enums";
import { useTranslation } from "react-i18next";
export const _renderActiveIcon = (icon) => {
  if (icon === ETabsIcon.PRINTING_DETAILS) {
    return <PrintingDetailsIcon />;
  }
  if (icon === ETabsIcon.FINISHING) {
    return <FinishingIcon />;
  }
  if (icon === ETabsIcon.PRICING) {
    return <PricingIcon />;
  }
};
export const _renderUnActiveIcon = (icon) => {
  if (icon === ETabsIcon.PRINTING_DETAILS) {
    return <PrintingDetailsIcon stroke="#1C1D58" />;
  }
  if (icon === ETabsIcon.FINISHING) {
    return <FinishingIcon stroke="#1C1D58" />;
  }
  if (icon === ETabsIcon.PRICING) {
    return <PricingIcon stroke="#1C1D58" />;
  }
};

export const compareStrings = (string1, string2) => {
  return string1?.toLowerCase() === string2?.toLowerCase();
};

export const _renderQuoteStatus = (status: number, quote: any, t: any) => {
  if (status === QUOTE_STATUSES.Create) {
    if (quote?.agentId) {
      return t("sales.quote.create");
    } else {
      return t("sales.quote.createdBy", { name: quote?.userName });
    }
  }
  if (status === QUOTE_STATUSES.Open) {
    return t("sales.quote.open");
  }
  if (status === QUOTE_STATUSES.Closed) {
    return t("sales.quote.closed");
  }
  if (status === QUOTE_STATUSES.Canceled) {
    return t("sales.quote.canceled");
  }
  if (status === QUOTE_STATUSES.Waiting) {
    return t("sales.quote.waiting");
  }
  if (status === QUOTE_STATUSES.Approved) {
    return t("sales.quote.approved");
  }
  if (status === QUOTE_STATUSES.CanceledIrrelvant) {
    return t("sales.quote.canceledIrrelvant");
  }
  if (status === QUOTE_STATUSES.CanceledPrice) {
    return t("sales.quote.canceledPrice");
  }
  if (status === QUOTE_STATUSES.CanceledDeliveryTime) {
    return t("sales.quote.canceledDeliveryTime");
  }
  if (status === QUOTE_STATUSES.CanceledOther) {
    return t("sales.quote.canceledOther");
  }
  if (status === QUOTE_STATUSES.ApprovedByManager) {
    return t("sales.quote.approvedByManager");
  }
  if (status === QUOTE_STATUSES.RejectedByManager) {
    return t("sales.quote.rejectedByManager");
  }
  if (status === QUOTE_STATUSES.PartialClosed) {
    return t("sales.quote.partialClosed");
  }
  if (status === QUOTE_STATUSES.WaitForPrintHouseConfirm) {
    return t("sales.quote.waitForPrintHouseConfirm");
  }
};
