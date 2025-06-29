import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

export interface VatReportHeaderWidgetProps {
    handleFromDateChange: any;
    handleToDateChange: any;
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