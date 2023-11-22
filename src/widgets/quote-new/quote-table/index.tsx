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
const QuoteForPriceTable = ({
  priceListItems,
  columnWidths,
  tableHeaders,
  headerHeight,
  changepriceListItems,
  getCalculateQuoteItem,
  onClickDuplicateWithDifferentQTY,
  onClickDeleteQouteItem,
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

  return (
    <>
      <TableContainer component={Paper} style={{ maxHeight: 340 }}>
        <Table>
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
          <TableBody>
            {priceListItems?.map((item, index) => (
              <RowMappingWidget
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
      <div style={clasess.tableFooterContainer}>
        <div style={clasess.firstRowForFooterContainer}>
          <div style={{ ...clasess.evenRowContainer, width: "13%" }}>
            Total Before VAT
          </div>
          <div style={{ ...clasess.oddRowContainer, width: "19%" }}>
            400,000 ILS
          </div>
          <div style={{ ...clasess.evenRowContainer, width: "13%" }}>
            Discount
          </div>
          <div style={{ ...clasess.oddRowContainer, width: "19%" }}>
            10% (-234 ILS)
          </div>
          <div style={{ ...clasess.evenRowContainer, width: "13%" }}>
            VAT (17%)
          </div>
          <div style={{ ...clasess.oddRowContainer, width: "23%" }}>
            700 ILS
          </div>
        </div>
        <div style={clasess.firstRowForFooterContainer}>
          <div
            style={{
              ...clasess.evenRowContainer,
              width: "13%",
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
            }}
          >
            Total Before VAT
          </div>
          <div style={{ ...clasess.oddRowContainer, width: "87%" }}>
            400,000 ILS
          </div>
        </div>
      </div>
    </>
  );
};

export { QuoteForPriceTable };
