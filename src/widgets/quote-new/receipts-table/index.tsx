import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Checkbox,
    TableRow
} from "@mui/material";
import { useStyle } from "./style";
import { RowMappingWidget } from "./row-mapping";
import { usePaymentsTable } from "./use-payments-table";
import { TotalPricesNewReceipts } from "./total-prices-new-receipt";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { TotalPricesReceipts } from "./total-prices-receipt";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { PaymentMethodsDetailsModal } from "./Payment-methods-details/payment-methods-details-modal";

const ReceiptsTable = () => {
    let indexs = 0;
    const headerHeight = "44px";
    const { classes } = useStyle({ headerHeight });
    const router = useRouter();
    const {
        t,
        resetReceiptState,
        isNewReceipt,
        documentItemValue,
        tableHeaders,
        tableRows,
        columnWidths,
        PrimaryTableCell,
        checkedItems,
        handleCheckboxChange,
        totalSum,
        finalTotalPayment,
        taxDeduction,
        isShowReceiptTransference,
        ReceiptTransferenceComponent,
        isShowReceiptCreditCards,
        ReceiptCreditCardsComponent,
        isShowReceiptChecks,
        ReceiptChecksComponent,
        openMethodsDetailsModal,
        handleOpenMethodsDetailsModal,
        handleCloseMethodsDetailsModal
    } = usePaymentsTable();

    const renderReceiptsItems = useCallback(() => {
        return tableRows?.map((item: any, index: number) => {
            indexs++;
            return (
                <>
                    <RowMappingWidget
                        key={item.id}
                        item={item}
                        index={index}
                        columnWidths={columnWidths}
                        headerHeight={headerHeight}
                        isChecked={checkedItems[index] || item?.isChecked}
                        onCheckboxChange={() => {
                            handleCheckboxChange(index, item?.id);
                        }}
                    />
                </>
            );
        })
    }, [checkedItems, documentItemValue, tableRows]);

    useEffect(() => {
        if (router?.query?.isNewCreation && router?.query?.documentNumber && tableRows) {
            const documentNumber = router.query.documentNumber;
            if (documentNumber) {
                const foundRow = tableRows.find(row => row.docNum === documentNumber);
                if (foundRow) {
                    handleCheckboxChange(tableRows.indexOf(foundRow), foundRow.id);
                }
            }
        }
    }, []);

    // Triggered when the client is changed
    useEffect(() => {
        if (router?.query?.isNewCreation && !router?.query?.documentNumber) {
            resetReceiptState();
        }
    }, [documentItemValue?.customerID, router]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {/* <div>
                <Checkbox
                    icon={<CheckboxIcon />}
                    checkedIcon={<CheckboxCheckedIcon />}
                    checked={selectAllChecked}
                    onChange={handleSelectAllCheckboxChange}
                />
                Select All
            </div> */}
            <div>
                <TableContainer style={{ maxHeight: 420, overflow: "scroll", border: "1px solid #EAECF0" }} >
                    <Table stickyHeader={true}>
                        <TableHead>
                            <TableRow style={classes.tableRowStyle}>
                                {tableHeaders.map((header, index) => (
                                    <PrimaryTableCell
                                        key={index}
                                        style={{ ...classes.tableHeaderStyle, width: columnWidths[index] }}>
                                        {header}
                                    </PrimaryTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody style={{ border: "1px solid #EAECF0" }}>
                            {renderReceiptsItems()}
                        </TableBody>
                    </Table>
                </TableContainer>
                {isNewReceipt ?
                    <TotalPricesNewReceipts sum={totalSum} totalPayment={finalTotalPayment} taxDeduction={taxDeduction} /> :
                    <TotalPricesReceipts receiptItemValue={documentItemValue} handleOpenModal={handleOpenMethodsDetailsModal} />}
            </div>
            <PaymentMethodsDetailsModal
                modalTitle={t("payment.paymentMethodsDetails")}
                openModal={openMethodsDetailsModal}
                handleModalClose={handleCloseMethodsDetailsModal}
                isShowFirstTabContent={isShowReceiptTransference}
                firstTabContent={ReceiptTransferenceComponent}
                isShowSecondTabContent={isShowReceiptChecks}
                secondTabContent={ReceiptChecksComponent}
                isShowThirdTabContent={isShowReceiptCreditCards}
                thirdTabContent={ReceiptCreditCardsComponent}
            />
        </div>
    );
};

export { ReceiptsTable };