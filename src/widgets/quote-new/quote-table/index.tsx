import React, { useEffect, useRef, useState } from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  styled,
  tableCellClasses,
} from "@mui/material";
import { useStyle } from "./style";
import { RowMappingWidget } from "./row-mapping";
import { RowMappingChildWidget } from "../quote-child-table/row-mapping";
import { TotalPriceComp } from "../total-price";
import { NotCalculatingIcon } from "@/icons";
import {
  ECalculationStatus,
  ShowPricesEnum,
} from "@/enums";
import { CalculatingIcon } from "@/icons";
import { useTranslation } from "react-i18next";
import { DebtRowMappingWidget } from "./debt-row-mapping";

const QuoteForPriceTable = ({
  documentItems,
  columnWidths,
  tableHeaders,
  headerHeight,
  changeDocumentItems,
  getCalculateQuoteItem,
  getCalculateQuoteConfirmationItem,
  onClickDuplicateWithDifferentQTY,
  onClickQuickDuplicate,
  onClickDeleteQouteItem,
  quoteItems,
  changeQuoteItems,
  getCalculateQuote,
  changeDocumentItemsChild,
  documentType,
  getQuote,
  reCalculateItem,
  isQuoteConfirmation = false,
  isPrePaymentPage,
  onChangeSelectedItemRowForQoute,
  isDebtPayments = false,
}: any) => {
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
  const [itemPriceList, setItemPriceList] = useState(documentItems)
  useEffect(() => {
    setItemPriceList(documentItems)
  }, [documentItems])
  const updateItemStatus = (itemId, newStatus) => {
    setItemPriceList(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, calculationStatus: newStatus }
          : item
      )
    );
  };
  const _renderIconcalculationStatus = (item, setItemStatus) => {
    if (item?.calculationStatus === ECalculationStatus.Calculating) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <CalculatingIcon />
          <a>{t("general.calculating")}</a>
        </div>
      );
    }
    if (item?.calculationStatus === ECalculationStatus.Failed) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#344054",
          }}
        >
          <Tooltip title={
            <>
              {item?.exceptionsKey?.map((key, index) => (
                <React.Fragment key={index}>
                  {t(`CalculationExceptions.${key}`)}
                  {index < item.exceptionsKey.length - 1 && <br />}
                </React.Fragment>
              ))}
            </>
          }>
            <IconButton style={{ padding: 0 }}>
              <NotCalculatingIcon />
            </IconButton>
          </Tooltip>
          {t("general.error")}!
          <span
            style={{
              color: "#2E3092",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {
              // Update the status to Calculating
              setItemStatus(item?.id, ECalculationStatus.Calculating);
              // Then call the recalculate function
              reCalculateItem(item?.id);
            }}
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
              {tableHeaders?.map(
                (header, index) =>
                  !(
                    isQuoteConfirmation && index === tableHeaders.length - 1
                  ) && (
                    <PrimaryTableCell
                      key={index}
                      style={{
                        width: columnWidths[index],
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
            {itemPriceList?.map((item: any, index: number) => {
              indexs++;
              const parentIndex = indexs;
              return (
                <>
                  {isDebtPayments ? (
                    <DebtRowMappingWidget
                      key={item?.transId}
                      item={item}
                      index={index}
                      parentIndex={parentIndex}
                      headerHeight={headerHeight}
                    />
                  ) : (
                    <RowMappingWidget
                      key={item.id}
                      item={item}
                      index={index}
                      parentIndex={parentIndex}
                      columnWidths={columnWidths}
                      headerHeight={headerHeight}
                      changeDocumentItems={changeDocumentItems}
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
                      _renderIconcalculationStatus={
                        _renderIconcalculationStatus
                      }
                      updateItemStatus={updateItemStatus}
                    />
                  )}

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
                            columnWidths={columnWidths}
                            headerHeight={headerHeight}
                            parentIndex={index}
                            childInex={childIndex}
                            changeDocumentItemsChild={changeDocumentItemsChild}
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
                            updateItemStatus={updateItemStatus}
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
      {quoteItems?.showPrices === ShowPricesEnum.All &&
        quoteItems?.documentItems?.length > 0 && (
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
