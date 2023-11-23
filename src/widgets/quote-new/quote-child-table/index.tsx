import React from "react";
import { Table, TableBody, TableContainer, Paper } from "@mui/material";
import { useStyle } from "./style";
import { RowMappingChildWidget } from "./row-mapping";
const QuoteForPriceChildTable = ({
  priceListItems,
  columnWidths,
  headerHeight,
  changepriceListItems,
  getCalculateQuoteItem,
  onClickDuplicateWithDifferentQTY,
  onClickDeleteQouteItem,
}: any) => {
  const { clasess } = useStyle({ headerHeight });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody style={{ border: "1px solid #EAECF0" }}>
          {priceListItems?.map((item, index) => (
            <RowMappingChildWidget
              key={item.id}
              item={item}
              index={index}
              columnWidths={columnWidths}
              headerHeight={headerHeight}
              changepriceListItems={changepriceListItems}
              getCalculateQuoteItem={getCalculateQuoteItem}
              onClickDuplicateWithDifferentQTY={
                onClickDuplicateWithDifferentQTY
              }
              onClickDeleteQouteItem={onClickDeleteQouteItem}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { QuoteForPriceChildTable };
