import React, { useState } from "react";
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
import { InputUpdatedValues } from "../input-updated-values";
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

  const [isUpdateTotalPayment, setIsUpdateTotalPayment] = useState(null);
  const onBlurTotalPayment = async () => {
    getCalculateQuote(2, quoteItems?.totalPayment);
    setIsUpdateTotalPayment(null);
  };
  const onInputTotalPayment = (e) => {
    changeQuoteItems("totalPayment", e);
  };
  const [isUpdateDiscount, setIsUpdateDiscount] = useState(null);
  const onBlurDiscount = async () => {
    getCalculateQuote(0, quoteItems?.discount);
    setIsUpdateDiscount(null);
  };
  const onInputDiscount = (e) => {
    changeQuoteItems("discount", e);
  };

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
          <TableBody style={{ border: "1px solid #EAECF0" }}>
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
          <div
            style={{
              ...clasess.oddRowContainer,
              width: "19%",
              paddingLeft: 36,
            }}
          >
            {quoteItems?.totalPrice}
          </div>
          <div style={{ ...clasess.evenRowContainer, width: "13%" }}>
            {t("sales.quote.discount")}
          </div>
          <div style={{ ...clasess.oddRowContainer, width: "19%" }}>
            <div style={clasess.cellTextInputStyle}>
              <InputUpdatedValues
                value={quoteItems?.discount}
                onBlur={onBlurDiscount}
                isUpdate={isUpdateDiscount}
                setIsUpdate={setIsUpdateDiscount}
                onInputChange={(e) => onInputDiscount(e)}
              />
            </div>
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
            <div style={clasess.cellTextInputStyle}>
              <InputUpdatedValues
                value={quoteItems?.totalPayment}
                onBlur={onBlurTotalPayment}
                isUpdate={isUpdateTotalPayment}
                setIsUpdate={setIsUpdateTotalPayment}
                onInputChange={(e) => onInputTotalPayment(e)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { QuoteForPriceTable };
