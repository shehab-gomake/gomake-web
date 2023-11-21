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
const QuoteForPriceTable = ({
  priceListItems,
  columnWidths,
  tableHeaders,
  headerHeight,
}) => {
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              style={{
                height: headerHeight,
                background: "#8283BE",
                color: "white",
              }}
            >
              {tableHeaders.map((header, index) => (
                <PrimaryTableCell
                  key={index}
                  style={{
                    width: columnWidths[index],
                    borderRight: "1px solid #EAECF0",
                    color: "#FFF",
                    textAlign: "center",
                    ...FONT_FAMILY.Inter(400, 12),
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
                  // boxShadow: "0px 1px 3px 0px #1018281A",
                  // borderBottom: "1px solid #FAECF0",
                }}
              >
                <PrimaryTableCell
                  style={{
                    width: columnWidths[0],
                    textAlign: "center",
                    padding: "16px 24px",
                  }}
                >
                  {index + 1}
                </PrimaryTableCell>
                <PrimaryTableCell
                  style={{
                    width: columnWidths[1],
                    textAlign: "center",
                    padding: "16px 24px",
                  }}
                >
                  225
                </PrimaryTableCell>
                <PrimaryTableCell
                  style={{
                    width: columnWidths[2],
                    textAlign: "center",
                    padding: "16px 24px",
                    fontWeight: 600,
                    color: "#5859A8",
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
                    textAlign: "center",
                    padding: "16px 24px",
                  }}
                >
                  {item.quantity}
                </PrimaryTableCell>
                <PrimaryTableCell
                  style={{
                    width: columnWidths[5],
                    textAlign: "center",
                    padding: "16px 24px",
                  }}
                >
                  {item.discount || "N/A"}
                </PrimaryTableCell>
                <PrimaryTableCell
                  style={{
                    width: columnWidths[6],
                    textAlign: "center",
                    padding: "16px 24px",
                  }}
                >
                  {item.price}
                </PrimaryTableCell>
                <PrimaryTableCell
                  style={{
                    width: columnWidths[7],
                    textAlign: "center",
                    padding: "16px 24px",
                  }}
                >
                  {item.finalPrice}
                </PrimaryTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>fffffff</div>
    </>
  );
};

export { QuoteForPriceTable };
