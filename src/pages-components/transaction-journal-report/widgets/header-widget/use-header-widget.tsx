import { useTranslation } from "react-i18next";

import { useStyle } from "./style";

export interface TransactionJournalReportHeaderWidgetProps {
  onSelectDeliveryTimeDates: any;
  resetDatePicker: any;
  handleDocumentTypeChange: any,
  documentType: any;
  documentsTypeList: any
  isPayment: boolean;

}
const useAgingReportHeader = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation()
  return {
    clasess, t
  };
};

export { useAgingReportHeader };
