import { Divider } from "@mui/joy";
import { VatReportHeaderWidget } from "./widgets/header-widget";
import { VatReportButtonWidget } from "./widgets/button-widget";

import { PrimaryTable } from "@/components/tables/primary-table";
import { HeaderTitle } from "@/widgets/header-title/header-title";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { useStyle } from "./style";
import { useVatReport } from "./use-vat-report";

interface IProps {
    clientType: CLIENT_TYPE;
}

const VatReportWidget = () => {
    const {
        t,
        onClickBtn1,
        onClickBtn2,
        showTable,
        fromDate,
        toDate,
        setFromDate,
        setToDate,
        handleFromDateChange,
        handleToDateChange,
    } = useVatReport();

    const { classes } = useStyle();

    return (
        <div style={classes.mainContainer}>
            <HeaderTitle
                title={t("tabs.vatReport")}
                marginTop={"0px"}
                marginBottom={"0px"}
            />

            <VatReportHeaderWidget
                handleFromDateChange={handleFromDateChange}
                handleToDateChange={handleToDateChange}
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
            />

            <Divider />

            <VatReportButtonWidget
                onClickBtn1={onClickBtn1}
                onClickBtn2={onClickBtn2}
            />

            {/* {showTable && (
                <PrimaryTable
                    rows={getTableDataRows(onClickOpenCustomerModal)}
                    headers={transformedHeaders}
                    maxHeight={"100vh"}
                    stickyHeader={true}
                    variant={detailedReport ? "PrimaryTable " : "OddEvenTable"}
                    isDescOrder={isDescOrder}
                />
            )} */}

            {/* <CustomerCardWidget
                customerAction={CUSTOMER_ACTIONS.Edit}
                typeClient={
                    isPurchaseReport ? CLIENT_TYPE.SUPPLIER : CLIENT_TYPE.CUSTOMER
                }
                codeFlag={true}
                isgetAllCustomers={false}
                openModal={showCustomerModal}
                onClose={() => setShowCustomerModal(false)}
                customer={customerForEdit}
                setCustomer={setCustomerForEdit}
            /> */}
        </div>
    );
};

export { VatReportWidget }; 