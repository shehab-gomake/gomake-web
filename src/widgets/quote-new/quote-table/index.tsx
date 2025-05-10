import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import { useStyle } from "./style";
import { RowMappingWidget } from "./row-mapping";
import { RowMappingChildWidget } from "../quote-child-table/row-mapping";
import { TotalPriceComp } from "../total-price";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { NotCalculatingIcon } from "@/icons";
import { ECalculationStatus } from "@/enums";
import { CalculatingIcon } from "@/icons";
import { useTranslation } from "react-i18next";

const QuoteForPriceTable = ({
  documentItems,
  columnWidths,
  tableHeaders,
  headerHeight,
  changedocumentItems,
  getCalculateQuoteItem,
  getCalculateQuoteConfirmationItem,
  onClickDuplicateWithDifferentQTY,
  onClickQuickDuplicate,
  onClickDeleteQouteItem,
  quoteItems,
  changeQuoteItems,
  getCalculateQuote,
  changedocumentItemsChild,
  documentType,
  getQuote,
  isQuoteConfirmation = false,
  isPrePaymentPage,
  onChangeSelectedItemRowForQoute,
}) => {
  const { t } = useTranslation();
  let indexs = 0;
  const { classes } = useStyle({ headerHeight });
  const PrimaryTableCell = styled(TableCell)(() => {
    return {
      [`&.${tableCellClasses.head}`]: {
        padding: 0,
      },
      [`&.${tableCellClasses.body}`]: {
        padding: 0,
      },
    };
  });
  const adjustedColumnWidths = quoteItems?.isShowDetails
    ? columnWidths
    : ["2%", "8%", "12%", "8%", "8%", "8%", "8%", "8%"];
  const isDeliveryNote =
    documentType === DOCUMENT_TYPE.deliveryNote ||
    documentType === DOCUMENT_TYPE.deliveryNoteRefund;
  const isInvoice =
    documentType === DOCUMENT_TYPE.invoice ||
    documentType === DOCUMENT_TYPE.invoiceRefund;

  const [visibleChilds, setVisibleChilds] = useState<{
    [key: number]: boolean;
  }>(
    documentItems?.reduce((acc, _, index) => ({ ...acc, [index]: true }), {}) ||
    {}
  );
  // Function to toggle visibility of child items for a specific parent item
  const toggleChildVisibility = (parentIndex: number) => {
    setVisibleChilds((prev) => ({
      ...prev,
      [parentIndex]: !prev[parentIndex], // Toggle the visibility
    }));
  };

  const _renderIconcalculationStatus = (calculationStatus) => {
    if (calculationStatus === ECalculationStatus.Calculating) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <CalculatingIcon />
          <a>{t("general.calculating")}</a>
        </div>
      );
    }
    if (calculationStatus === ECalculationStatus.Failed) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#344054",
          }}
        >
          <NotCalculatingIcon />
          {t("general.error")}!
          <span
            style={{
              color: "#2E3092",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => getQuote()}
          >
            {t("general.tryAgain")}
          </span>
        </div>
      );
    }
  };

  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop =
        tableContainerRef.current.scrollHeight;
    }
  }, [documentItems?.length]);

  return (
    <div>
      <TableContainer
        ref={tableContainerRef}
        style={{
          maxHeight: 420,
          overflow: "scroll",
          border: "1px solid #EAECF0",
        }}
      >
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow style={classes.tableRowStyle}>
              {tableHeaders.map(
                (header, index) =>
                  !(
                    isQuoteConfirmation && index === tableHeaders.length - 1
                  ) && (
                    <PrimaryTableCell
                      key={index}
                      style={{
                        width:
                          (isInvoice || isDeliveryNote) && index === 3
                            ? adjustedColumnWidths[index - 1]
                            : adjustedColumnWidths[index],
                        ...classes.tableHeaderStyle,
                      }}
                    >
                      {header}
                    </PrimaryTableCell>
                  )
              )}
            </TableRow>
          </TableHead>
          <TableBody style={{ border: "1px solid #EAECF0" }}>
            {documentItems?.map((item: any, index: number) => {
              indexs++;
              const parentIndex = indexs;
              return (
                <>
                  <RowMappingWidget
                    key={item.id}
                    item={item}
                    index={index}
                    parentIndex={parentIndex}
                    columnWidths={adjustedColumnWidths}
                    headerHeight={headerHeight}
                    changedocumentItems={changedocumentItems}
                    getCalculateQuoteItem={getCalculateQuoteItem}
                    getCalculateQuoteConfirmationItem={
                      getCalculateQuoteConfirmationItem
                    }
                    onClickDuplicateWithDifferentQTY={
                      onClickDuplicateWithDifferentQTY
                    }
                    onClickQuickDuplicate={onClickQuickDuplicate}
                    onClickDeleteQouteItem={onClickDeleteQouteItem}
                    documentType={documentType}
                    getQuote={getQuote}
                    isQuoteConfirmation={isQuoteConfirmation}
                    isPrePaymentPage={isPrePaymentPage}
                    onChangeSelectedItemRowForQoute={
                      onChangeSelectedItemRowForQoute
                    }
                    quoteItems={quoteItems}
                    isShowChilds={visibleChilds[parentIndex]} // Access visibleChilds with correct parentIndex
                    setIsShowChilds={() => toggleChildVisibility(parentIndex)}
                    _renderIconcalculationStatus={_renderIconcalculationStatus}
                  />
                  {item?.childsDocumentItems &&
                    !visibleChilds[parentIndex] &&
                    item?.childsDocumentItems?.map(
                      (childItem: any, childIndex: number) => {
                        indexs++;
                        return (
                          <RowMappingChildWidget
                            key={childItem.id}
                            item={childItem}
                            parentItem={item}
                            index={indexs}
                            columnWidths={adjustedColumnWidths}
                            headerHeight={headerHeight}
                            parentIndex={index}
                            childInex={childIndex}
                            changedocumentItemsChild={changedocumentItemsChild}
                            onClickDeleteQouteItem={onClickDeleteQouteItem}
                            getCalculateQuoteItem={getCalculateQuoteItem}
                            childList={item?.childsDocumentItems}
                            isQuoteConfirmation={isQuoteConfirmation}
                            documentType={documentType}
                            onChangeSelectedItemRowForQoute={
                              onChangeSelectedItemRowForQoute
                            }
                            quoteItems={quoteItems}
                            getQuote={getQuote}
                            _renderIconcalculationStatus={
                              _renderIconcalculationStatus
                            }
                          />
                        );
                      }
                    )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {quoteItems?.isShowPrice && quoteItems?.documentItems?.length > 0 && (
        <TotalPriceComp
          documentType={documentType}
          getCalculateQuote={getCalculateQuote}
          quoteItems={quoteItems}
          changeQuoteItems={changeQuoteItems}
          isQuoteConfirmation={isQuoteConfirmation}
        />
      )}
    </div>
  );
};

export { QuoteForPriceTable };
