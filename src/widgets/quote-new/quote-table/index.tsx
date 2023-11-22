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
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
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
}) => {
  const { clasess } = useStyle({ headerHeight });
  const { t } = useTranslation();
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
    <div>
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
            {t("sales.quote.totalBeforeVAT")}
          </div>
          <div style={{ ...clasess.oddRowContainer, width: "19%" }}>
            {quoteItems?.totalPrice?.toFixed(2)} ILS
          </div>
          <div style={{ ...clasess.evenRowContainer, width: "13%" }}>
            {t("sales.quote.discount")}
          </div>
          <div style={{ ...clasess.oddRowContainer, width: "19%" }}>
            {quoteItems?.discount}
          </div>
          <div style={{ ...clasess.evenRowContainer, width: "13%" }}>
            VAT (17%)
          </div>
          <div style={{ ...clasess.oddRowContainer, width: "23%" }}>
            {Math.ceil(quoteItems?.totalVAT)} ILS
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
            {t("sales.quote.totalPrice")}
          </div>
          <div
            style={{
              ...clasess.oddRowContainer,
              width: "87%",
              color: "#F135A3",
              ...FONT_FAMILY.Inter(700, 18),
            }}
          >
            {Math.ceil(quoteItems?.totalPayment)} ILS
          </div>
        </div>
      </div>
    </div>
  );
};

export { QuoteForPriceTable };
