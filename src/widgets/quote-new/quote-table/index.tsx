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
  priceListItems,
  columnWidths,
  tableHeaders,
  headerHeight,
  changepriceListItems,
  getCalculateQuoteItem,
  onClickDuplicateWithDifferentQTY,
  onClickDeleteQouteItem,
  quoteItems,
  changeQuoteItems,
  getCalculateQuote,
  changepriceListItemsChild,
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
        component={Paper}
        style={{
          maxHeight: 420,
          overflow: "scroll",
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
            {priceListItems?.map((item: any, index: number) => {
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
                    changepriceListItems={changepriceListItems}
                    getCalculateQuoteItem={getCalculateQuoteItem}
                    onClickDuplicateWithDifferentQTY={
                      onClickDuplicateWithDifferentQTY
                    }
                    onClickDeleteQouteItem={onClickDeleteQouteItem}
                  />
                  {item?.childsQuoteItems &&
                    item?.childsQuoteItems?.map(
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
                            changepriceListItemsChild={
                              changepriceListItemsChild
                            }
                            onClickDeleteQouteItem={onClickDeleteQouteItem}
                            getCalculateQuoteItem={getCalculateQuoteItem}
                            childList={item?.childsQuoteItems}
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
