import React from "react";
import { CharacterDetails } from "./character-details";
import { FONT_FAMILY } from "@/utils/font-family";
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
import { GomakeTextInput } from "@/components";
const QuoteForPriceTable = ({
  priceListItems,
  columnWidths,
  tableHeaders,
  headerHeight,
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
      <TableContainer component={Paper} style={{ maxHeight: 300 }}>
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
            {priceListItems.map((item, index) => (
              <TableRow
                key={item.id}
                style={{
                  background: index % 2 === 0 ? "#FFFFFF" : "#F8FAFB",
                }}
              >
                <PrimaryTableCell
                  style={{
                    width: columnWidths[0],
                    ...clasess.cellContainerStyle,
                  }}
                >
                  {index + 1}
                </PrimaryTableCell>
                <PrimaryTableCell
                  style={{
                    width: columnWidths[1],
                    ...clasess.cellContainerStyle,
                  }}
                >
                  225
                </PrimaryTableCell>
                <PrimaryTableCell
                  style={{
                    width: columnWidths[2],
                    ...FONT_FAMILY.Inter(600, 14),
                    color: "#5859A8",
                    ...clasess.cellContainerStyle,
                  }}
                >
                  {item.productName}
                </PrimaryTableCell>
                <PrimaryTableCell
                  style={{
                    width: columnWidths[3],
                    textAlign: "start",
                  }}
                >
                  <CharacterDetails details={item.details} />
                </PrimaryTableCell>
                <PrimaryTableCell
                  style={{
                    width: columnWidths[4],
                    ...clasess.cellContainerStyle,
                  }}
                >
                  {item.quantity}
                </PrimaryTableCell>
                <PrimaryTableCell
                  style={{
                    width: columnWidths[5],
                    ...clasess.cellContainerStyle,
                  }}
                >
                  {item.discount || "N/A"}
                </PrimaryTableCell>
                <PrimaryTableCell
                  style={{
                    width: columnWidths[6],
                    ...clasess.cellContainerStyle,
                  }}
                >
                  {item.price}
                </PrimaryTableCell>
                <PrimaryTableCell
                  style={{
                    width: columnWidths[7],
                    ...clasess.cellContainerStyle,
                  }}
                >
                  {item.finalPrice}
                </PrimaryTableCell>
              </TableRow>
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
