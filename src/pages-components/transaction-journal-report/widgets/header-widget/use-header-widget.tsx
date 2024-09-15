import { useTranslation } from "react-i18next";

import { useStyle } from "./style";

export interface TransactionJournalReportHeaderWidgetProps {
  onSelectDeliveryTimeDates: any;
  resetDatePicker: any;
  handleDocumentTypeChange: any,
  documentType: any;
  documentsTypeList: any
  isPayment: boolean;
  handleDateChange: any
  fromDate: Date | null,
  toDate: Date | null

}
const useAgingReportHeader = () => {
  const { classes } = useStyle();
  const { t } = useTranslation()
  return {
    classes, t
  };
};

export { useAgingReportHeader };
