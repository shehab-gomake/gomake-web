import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { EReportType } from "@/enums";
import { FilterState } from "../../use-transaction-journal-report";

export interface TransactionJournalReportHeaderWidgetProps {
  handleDocumentTypeChange: any;
  documentType: any;
  documentsTypeList: any;
  reportType: EReportType;
  handleDateChange: any;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface AccountingTransactionReportHeaderProps {
  handleDateChange: any;
  filterState: FilterState;
  setFilterState: any;

  renderOptions: any;
  checkWhatRenderArray: any;
  isFetching: boolean;
  customer: any;
  handleCustomerChange: any;
}

const useAgingReportHeader = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  return {
    classes,
    t,
  };
};

export { useAgingReportHeader };
