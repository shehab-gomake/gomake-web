import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

export interface VatReportHeaderWidgetProps {
    handleClickSelectDate: () => void;
    selectDate: string | null;
    setSelectDate: (date: string) => void;
    dateRef: React.RefObject<HTMLInputElement>;
    agent: any;
    agentsCategories: any[];
    handleAgentChange: any;
    customer: any;
    renderOptions: () => any[];
    checkWhatRenderArray: (arg: any) => void;
    handleCustomerChange: any;
    detailedReport: boolean;
    onChangeDetailedReport: any;
    vatReportByCreationDate: any,
    onChangeVatReportByCreationDate: any,
    onChangeByReferenceDate: any;
    handleDateChange?: any;
    fromDate?: Date | null;
    toDate?: Date | null;
    isFetchingCustomers?: boolean;
    supplierList?: any[];
    isPurchaseReport?: boolean;
    setFromDate?: any;
    setToDate?: any;
}
const useVatReportHeader = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    return {
        classes,
        t,
    };
};

export { useVatReportHeader }; 