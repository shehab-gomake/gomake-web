import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  tableCellClasses,
} from "@mui/material";
import { useStyle } from "./style";
import { RowMappingWidget } from "./row-mapping";
import { RowMappingChildWidget } from "../quote-child-table/row-mapping";
import { TotalPriceComp } from "../total-price";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";

const QuoteForPriceTable = ({
  documentItems,
  columnWidths,
  tableHeaders,
  headerHeight,
  changedocumentItems,
  getCalculateQuoteItem,
  onClickDuplicateWithDifferentQTY,
  onClickDeleteQouteItem,
  quoteItems,
  changeQuoteItems,
  getCalculateQuote,
  changedocumentItemsChild,
  documentType,
  getQuote,
  isQuoteConfirmation = false,
  onChangeSelectedItemRowForQoute
}) => {
  const { classes } = useStyle({ headerHeight });
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
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

  let indexs = 0;

  return (
    <div>
      <TableContainer
        style={{
          maxHeight: 420,
          overflow: "scroll",
          border: "1px solid #EAECF0",
        }}
      >
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow style={classes.tableRowStyle}>
              {tableHeaders.map((header, index) => (
                !(isQuoteConfirmation && index === tableHeaders.length - 1) && (
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
              ))}
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
                    columnWidths={columnWidths}
                    headerHeight={headerHeight}
                    changedocumentItems={changedocumentItems}
                    getCalculateQuoteItem={getCalculateQuoteItem}
                    onClickDuplicateWithDifferentQTY={
                      onClickDuplicateWithDifferentQTY
                    }
                    onClickDeleteQouteItem={onClickDeleteQouteItem}
                    documentType={documentType}
                    getQuote={getQuote}
                    isQuoteConfirmation={isQuoteConfirmation}
                    onChangeSelectedItemRowForQoute={onChangeSelectedItemRowForQoute}
                  />
                  {item?.childsDocumentItems &&
                    item?.childsDocumentItems?.map(
                      (childItem: any, childIndex: number) => {
                        indexs++;
                        return (
                          <RowMappingChildWidget
                            key={childItem.id}
                            item={childItem}
                            index={indexs}
                            columnWidths={columnWidths}
                            headerHeight={headerHeight}
                            parentIndex={index}
                            childInex={childIndex}
                            changedocumentItemsChild={changedocumentItemsChild}
                            onClickDeleteQouteItem={onClickDeleteQouteItem}
                            getCalculateQuoteItem={getCalculateQuoteItem}
                            childList={item?.childsDocumentItems}
                            isQuoteConfirmation={isQuoteConfirmation}
                            documentType={documentType}
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
      {!isQuoteConfirmation && quoteItemValue?.isShowPrice &&
        <TotalPriceComp
          documentType={documentType}
          getCalculateQuote={getCalculateQuote}
          quoteItems={quoteItems}
          changeQuoteItems={changeQuoteItems}
          isQuoteConfirmation={isQuoteConfirmation}
        />}
      {
        isQuoteConfirmation && <TotalPriceComp
          documentType={documentType}
          getCalculateQuote={getCalculateQuote}
          quoteItems={quoteItems}
          changeQuoteItems={changeQuoteItems}
          isQuoteConfirmation={isQuoteConfirmation}
        />
      }

    </div>
  );
};

export { QuoteForPriceTable };