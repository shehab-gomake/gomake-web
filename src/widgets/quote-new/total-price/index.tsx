import React, { useState } from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { InputUpdatedValues } from "../input-updated-values";
import { FONT_FAMILY } from "@/utils/font-family";

const TotalPriceComp = ({
  getCalculateQuote,
  quoteItems,
  changeQuoteItems,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
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
          }}
        >
          <div style={clasess.cellTextInputStyle}>
            <InputUpdatedValues
              value={quoteItems?.totalPayment}
              onBlur={onBlurTotalPayment}
              isUpdate={isUpdateTotalPayment}
              setIsUpdate={setIsUpdateTotalPayment}
              onInputChange={(e) => onInputTotalPayment(e)}
              speicalStyle={{
                color: "#F135A3",
                ...FONT_FAMILY.Inter(700, 18),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { TotalPriceComp };
