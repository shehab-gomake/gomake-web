import React from "react";
import { Table, TableBody, TableContainer, Paper } from "@mui/material";
import { useStyle } from "./style";
import { RowMappingChildWidget } from "./row-mapping";
const QuoteForPriceChildTable = ({
  documentItems,
  columnWidths,
  headerHeight,
  changedocumentItems,
  getCalculateQuoteItem,
  onClickDuplicateWithDifferentQTY,
  onClickDeleteQouteItem,
}: any) => {
  const { classes } = useStyle({ headerHeight });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody style={{ border: "1px solid #EAECF0" }}>
          {documentItems?.map((item, index) => (
            <RowMappingChildWidget
              key={item.id}
              item={item}
              index={index}
              columnWidths={columnWidths}
              headerHeight={headerHeight}
              changedocumentItems={changedocumentItems}
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
