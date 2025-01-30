import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Checkbox,
  TableRow,
} from "@mui/material";
import { useStyle } from "./style";
import { RowMappingWidget } from "./row-mapping";
import { usePaymentsTable } from "./use-payments-table";
import { TotalPricesNewReceipts } from "./total-prices-new-receipt";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { TotalPricesReceipts } from "./total-prices-receipt";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
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
    handleCloseMethodsDetailsModal,
    remainingTotal,
    setRemainingTotal,
    allocatedSums,
    setAllocatedSums,
  } = usePaymentsTable();

  //-----------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    // Recalculate allocations when finalTotalPayment or tableRows change
    setRemainingTotal(finalTotalPayment);

    setAllocatedSums(() => {
      const updatedSums = {};
      let remaining = finalTotalPayment;

      // Initialize allocated sums with sumApplied or adjust based on remaining total
      tableRows.forEach((item, index) => {
        if (checkedItems[index]) {
          const allocatable = Math.min(remaining, item.sumApplied);
          updatedSums[index] = allocatable;
          remaining -= allocatable;
        } else {
          // Default allocation to sumApplied for unchecked rows
          updatedSums[index] = item.sumApplied;
        }
      });

      return updatedSums;
    });
  }, [finalTotalPayment, tableRows, checkedItems]);

  const setAllocatedSum = (index, newAllocatedSum) => {
    setAllocatedSums((prev) => {
      const prevAllocated = prev[index] || 0;

      // Update the remaining total
      const difference = newAllocatedSum - prevAllocated;

      setRemainingTotal((prevRemaining) => prevRemaining - difference);

      return {
        ...prev,
        [index]: newAllocatedSum, // Update the allocated sum for the index
      };
    });
  };

  const renderReceiptsItems = useCallback(() => {
    return tableRows?.map((item, index) => (
      <RowMappingWidget
        key={item.id}
        item={item}
        index={index}
        columnWidths={columnWidths}
        headerHeight={headerHeight}
        isChecked={checkedItems[index] || item?.isChecked}
        allocatedSum={allocatedSums[index] || 0}
        onCheckboxChange={() => {
          handleCheckboxChange(index, item?.id);
          handleAllocationChange(index, !checkedItems[index], item?.sumApplied);
        }}
        setAllocatedSum={setAllocatedSum}
      />
    ));
  }, [allocatedSums, checkedItems, tableRows, remainingTotal]);

  // const handleAllocationChange = (index, isChecked, sumApplied) => {
  //   setAllocatedSums((prev) => {
  //     const updated = { ...prev };
  //     let remaining = remainingTotal;

  //     if (isChecked) {
  //       // Allocate sum when checked
  //       const allocatable = Math.min(remaining, sumApplied);
  //       updated[index] = allocatable;
  //       remaining -= allocatable;
  //     } else {
  //       // Release allocated sum when unchecked
  //       const releasedAmount = updated[index] || 0;
  //       delete updated[index];
  //       remaining += releasedAmount;

  //       // Reallocate released amount to remaining checked items
  //       const sortedCheckedIndexes = tableRows
  //         .map((_, i) => i)
  //         .filter((i) => i !== index && checkedItems[i]);

  //       sortedCheckedIndexes.forEach((i) => {
  //         const allocatable = Math.min(
  //           remaining,
  //           tableRows[i].sumApplied - (updated[i] || 0)
  //         );
  //         if (allocatable > 0) {
  //           updated[i] = (updated[i] || 0) + allocatable;
  //           remaining -= allocatable;
  //         }
  //       });
  //     }

  //     setRemainingTotal(remaining);
  //     return updated;
  //   });
  // };

  const handleAllocationChange = (index, isChecked, sumApplied) => {
    setAllocatedSums((prev) => {
      const updated = { ...prev };
      let remaining = remainingTotal;

      if (isChecked) {
        // Allocate sum when checked (allow negative allocation)
        const allocatable = Math.min(remaining, sumApplied);
        updated[index] = allocatable;
        remaining -= allocatable;
      } else {
        // Release allocated sum when unchecked (allow negative allocation)
        const releasedAmount = updated[index] || 0;
        delete updated[index];
        remaining += releasedAmount;

        // Reallocate released amount to remaining checked items
        const sortedCheckedIndexes = tableRows
          .map((_, i) => i)
          .filter((i) => i !== index && checkedItems[i]);

        sortedCheckedIndexes.forEach((i) => {
          const allocatable = Math.min(
            remaining,
            tableRows[i].sumApplied - (updated[i] || 0)
          );
          if (allocatable > 0) {
            updated[i] = (updated[i] || 0) + allocatable;
            remaining -= allocatable;
          }
        });
      }

      setRemainingTotal(remaining);
      return updated;
    });
  };

  const calculateTotalAllocatedSum = () => {
    let totalAllocated = 0;
    tableRows.forEach((item, index) => {
      if (checkedItems[index] && allocatedSums[index]) {
        totalAllocated += allocatedSums[index];
      }
    });
    return totalAllocated;
  };

  /*---------------------------------------------------------------------------------------- */

  useEffect(() => {
    if (
      router?.query?.isNewCreation &&
      router?.query?.documentNumber &&
      tableRows
    ) {
      const documentNumber = router.query.documentNumber;
      if (documentNumber) {
        const foundRow = tableRows.find((row) => row.docNum === documentNumber);
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
    <div style={{ display: "flex", flexDirection: "column" }}>
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
        <TableContainer
          style={{
            maxHeight: 400,
            overflow: "scroll",
            border: "1px solid #EAECF0",
          }}
        >
          <Table stickyHeader={true}>
            <TableHead>
              <TableRow style={classes.tableRowStyle}>
                {tableHeaders.map((header, index) => (
                  <PrimaryTableCell
                    key={index}
                    style={{
                      ...classes.tableHeaderStyle,
                      width: columnWidths[index],
                    }}
                  >
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
        {isNewReceipt ? (
          <TotalPricesNewReceipts
            // sum={totalSum}
            sum={calculateTotalAllocatedSum()}
            totalPayment={finalTotalPayment}
            taxDeduction={taxDeduction}
          />
        ) : (
          <TotalPricesReceipts
            receiptItemValue={documentItemValue}
            handleOpenModal={handleOpenMethodsDetailsModal}
          />
        )}
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
