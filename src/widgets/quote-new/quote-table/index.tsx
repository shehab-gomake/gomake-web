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
}) => {
  const { clasess } = useStyle({ headerHeight });
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
        // component={Paper}
        style={{
          maxHeight: 420,
          overflow: "scroll",
          border: "1px solid #EAECF0",
        }}
      >
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow style={clasess.tableRowStyle}>
              {tableHeaders.map((header, index) => (
                <PrimaryTableCell
                  key={index}
                  style={{
                    width: columnWidths[index],
                    ...clasess.tableHeaderStyle,
                  }}
                >
                  {header}
                </PrimaryTableCell>
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
      <TotalPriceComp
        getCalculateQuote={getCalculateQuote}
        quoteItems={quoteItems}
        changeQuoteItems={changeQuoteItems}
      />
    </div>
  );
};

export { QuoteForPriceTable };
