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

const VatReportWidget = ({ clientType }: IProps) => {
    const {
        t,
        handleClickSelectDate,
        selectDate,
        setSelectDate,
        dateRef,
        agent,
        agentsCategories,
        handleAgentChange,
        customer,
        renderOptions,
        checkWhatRenderArray,
        handleCustomerChange,
        onClickBtn1,
        onClickBtn2,
        onClickBtn3,
        showTable,
        detailedReport,
        getTableDataRows,
        onChangeDetailedReport,
        onChangeByReferenceDate,
        transformedHeaders,
        handleDateChange,
        fromDate,
        toDate,
        showCustomerModal,
        setShowCustomerModal,
        customerForEdit,
        setCustomerForEdit,
        onClickOpenCustomerModal,
        isFetching,
        tableHeader,
        handleSortVatReport,
        isDescOrder,
        isPurchaseReport,
        setFromDate,
        setToDate,
        vatReportByCreationDate,
        onChangeVatReportByCreationDate
    } = useVatReport(clientType);

    const { classes } = useStyle();

    return (
        <div style={classes.mainContainer}>
            <HeaderTitle
                title={
                    clientType === CLIENT_TYPE.SUPPLIER
                        ? t("tabs.supplierVat")
                        : t("tabs.vatReport")
                }
                marginTop={"0px"}
                marginBottom={"0px"}
            />

            <VatReportHeaderWidget
                handleClickSelectDate={handleClickSelectDate}
                selectDate={selectDate}
                setSelectDate={setSelectDate}
                dateRef={dateRef}
                agent={agent}
                agentsCategories={agentsCategories}
                handleAgentChange={handleAgentChange}
                customer={customer}
                isFetchingCustomers={isFetching}
                renderOptions={renderOptions}
                checkWhatRenderArray={checkWhatRenderArray}
                handleCustomerChange={handleCustomerChange}
                detailedReport={detailedReport}
                onChangeDetailedReport={onChangeDetailedReport}
                vatReportByCreationDate={vatReportByCreationDate}
                onChangeVatReportByCreationDate={onChangeVatReportByCreationDate}
                onChangeByReferenceDate={onChangeByReferenceDate}
                handleDateChange={handleDateChange}
                fromDate={fromDate}
                toDate={toDate}
                isPurchaseReport={isPurchaseReport}
                setFromDate={setFromDate}
                setToDate={setToDate}
            />

            <Divider />

            <VatReportButtonWidget
                onClickBtn1={onClickBtn1}
                onClickBtn2={onClickBtn2}
                onClickBtn3={onClickBtn3}
            />

            {showTable && (
                <PrimaryTable
                    rows={getTableDataRows(onClickOpenCustomerModal)}
                    headers={transformedHeaders}
                    maxHeight={"100vh"}
                    stickyHeader={true}
                    variant={detailedReport ? "PrimaryTable " : "OddEvenTable"}
                    isDescOrder={isDescOrder}
                />
            )}

            <CustomerCardWidget
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
            />
        </div>
    );
};

export { VatReportWidget }; 