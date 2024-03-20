import React, { useState } from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { InputUpdatedValues } from "../input-updated-values";
import { FONT_FAMILY } from "@/utils/font-family";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useRouter } from "next/router";

const TotalPriceComp = ({
  getCalculateQuote,
  quoteItems,
  changeQuoteItems,
  isQuoteConfirmation = false,
}) => {
  const router = useRouter()
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [isUpdateTotalPayment, setIsUpdateTotalPayment] = useState(null);
  const { getCurrencyUnitText } = useQuoteGetData();
  const [isConfirmation, setIsConfirmation] = useState(null);

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
    <div style={classes.tableFooterContainer}>
      <div style={classes.firstRowForFooterContainer}>
        <div style={{ ...classes.evenRowContainer, width: "13%" }}>
          {t("sales.quote.totalBeforeVAT")}
        </div>
        <div
          style={{
            ...classes.oddRowContainer,
            width: "19%",
            paddingLeft: 36,
          }}
        >
          {(quoteItems?.totalPrice) +
            " " +
            getCurrencyUnitText(quoteItems?.currency)}
        </div>
        <div style={{ ...classes.evenRowContainer, width: "13%" }}>
          {t("sales.quote.discount")}
        </div>
        <div style={{ ...classes.oddRowContainer, width: "19%" }}>
          <div style={classes.cellTextInputStyle}>
            <InputUpdatedValues
              value={(quoteItems?.discount ? quoteItems?.discount : 0)}
              onBlur={onBlurDiscount}
              isUpdate={router.query.isNewCreation ? isUpdateDiscount : !quoteItems?.isEditable ? false : isUpdateDiscount}
              setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateDiscount}
              onInputChange={(e) => onInputDiscount(e)}
            />
            %
          </div>
        </div>
        <div style={{ ...classes.evenRowContainer, width: "13%" }}>
          VAT (17%)
        </div>
        <div style={{ ...classes.oddRowContainer, width: "23%" }}>
          {quoteItems?.totalVAT + " " + getCurrencyUnitText(quoteItems?.currency)}
        </div>
      </div>
      <div style={classes.firstRowForFooterContainer}>
        <div
          style={{
            ...classes.evenRowContainer,
            width: "13%",
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
          }}
        >
          {t("sales.quote.totalPrice")}
        </div>
        <div
          style={{
            ...classes.oddRowContainer,
            width: "87%",
          }}
        >
          <div style={classes.cellTextInputStyle}>
            <InputUpdatedValues
              value={quoteItems?.totalPayment}
              onBlur={onBlurTotalPayment}
              isUpdate={router.query.isNewCreation ? isUpdateTotalPayment : !quoteItems?.isEditable ? false : isUpdateTotalPayment}
              setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateTotalPayment}
              onInputChange={(e) => onInputTotalPayment(e)}
              speicalStyle={{
                color: "#F135A3",
                ...FONT_FAMILY.Inter(700, 18),
              }}
            />
            {getCurrencyUnitText(quoteItems?.currency)}
          </div>
        </div>
      </div>
    </div>
  );
};

export { TotalPriceComp };