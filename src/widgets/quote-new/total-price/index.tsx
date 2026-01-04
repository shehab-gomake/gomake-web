import React, { useEffect, useState } from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { InputUpdatedValues } from "../input-updated-values";
import { FONT_FAMILY } from "@/utils/font-family";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useRouter } from "next/router";
import { useUserPermission } from "@/hooks/use-permission";
import { DocumentPermission } from "@/components/CheckPermission/enum";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { DocumentCalculationType } from "@/enums";
import { EPreferences } from "@/enums/prefernces";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";

const TotalPriceComp = ({
  documentType,
  getCalculateQuote,
  quoteItems,
  changeQuoteItems,
  isQuoteConfirmation = false,
}) => {
  const router = useRouter();
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { CheckPreferenceValue } = usePrintHousePreferences();

  const [isUpdateTotalPayment, setIsUpdateTotalPayment] = useState(null);
  const { getCurrencyUnitText } = useQuoteGetData();
  const [isConfirmation, setIsConfirmation] = useState(null);
  const { CheckDocumentPermission } = useUserPermission();

  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const onBlurTotalPayment = async () => {
    getCalculateQuote(
      DocumentCalculationType.TotalPayment,
      quoteItems?.totalPayment
    );
    setIsUpdateTotalPayment(null);
  };
  const onInputTotalPayment = (e) => {
    changeQuoteItems("totalPayment", e);
  };
  const [isUpdateDiscount, setIsUpdateDiscount] = useState(null);
  const [isUpdateDiscountAmount, setIsUpdateDiscountAmount] = useState(null);
  const [previousDiscountAmount, setPreviousDiscountAmount] = useState(
    quoteItems?.discountAmount
  );

  const onBlurDiscount = async () => {
    getCalculateQuote(DocumentCalculationType.Discount, quoteItems?.discount);
    setIsUpdateDiscount(null);
  };
  const onBlurDiscountAmount = async () => {
    if (quoteItems?.discountAmount !== previousDiscountAmount) {
      getCalculateQuote(
        DocumentCalculationType.DiscountAmount,
        quoteItems?.discountAmount
      );
      setPreviousDiscountAmount(quoteItems?.discountAmount);
    }
    setIsUpdateDiscountAmount(null);
  };

  const onInputDiscount = (e) => {
    changeQuoteItems("discount", e);
  };
  const onInputDiscountAmount = (e) => {
    changeQuoteItems("discountAmount", e);
  };

  const canUpdateDiscount = router.query.isNewCreation
    ? true
    : quoteItems?.isEditable &&
      CheckDocumentPermission(
        documentType,
        DocumentPermission.UPDATE_DOCUMENT_DISCOUNT
      );

  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const CurrencyUnit = getCurrencyUnitText(quoteItems?.currency);
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
            paddingLeft: 24,
          }}
        >
          {isRTL ? (
            <>{quoteItems?.totalPrice + " " + CurrencyUnit}</>
          ) : (
            <>{CurrencyUnit + " " + quoteItems?.totalPrice}</>
          )}
        </div>
        <div style={{ ...classes.evenRowContainer, width: "13%" }}>
          {t("sales.quote.discount")}
        </div>
        <div style={{ ...classes.oddRowContainer, width: "19%" }}>
          <div style={classes.cellTextInputStyle}>
            <InputUpdatedValues
              value={quoteItems?.discount ? quoteItems?.discount : 0}
              onBlur={onBlurDiscount}
              isUpdate={canUpdateDiscount && isUpdateDiscount}
              setIsUpdate={
                isQuoteConfirmation ? setIsConfirmation : setIsUpdateDiscount
              }
              onInputChange={(e) => onInputDiscount(e)}
              width={"150px"}
            />
            %
            {isQuoteConfirmation ? (
              quoteItems?.discountAmount != 0 && (
                <>
                  {isRTL
                    ? `(-${quoteItems?.discountAmount + " " + CurrencyUnit})`
                    : `(-${CurrencyUnit + " " + quoteItems?.discountAmount})`}
                </>
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                (
                <InputUpdatedValues
                  value={
                    quoteItems?.discountAmount ? quoteItems?.discountAmount : 0
                  }
                  onBlur={onBlurDiscountAmount}
                  isUpdate={canUpdateDiscount && isUpdateDiscountAmount}
                  setIsUpdate={
                    !isQuoteConfirmation && setIsUpdateDiscountAmount
                  }
                  sign={CurrencyUnit}
                  isRightSign={!isRTL ? false : true}
                  specialStyle={{
                    ...FONT_FAMILY.Inter(400, 14),
                  }}
                  inputMainContainerStyle={{
                    gap: 0,
                  }}
                  onInputChange={(e) => onInputDiscountAmount(e)}
                  width={"120px"}
                />
                )
              </div>
            )}
          </div>
        </div>

        {(
          isQuoteConfirmation
            ? quoteItems?.hideVatInSystem
            : CheckPreferenceValue(EPreferences.HIDE_VAT_FROM_DOCUMENTS)
        ) ? (
          <>
            <div style={{ ...classes.evenRowContainer, width: "13%" }}>
              {t("sales.quote.totalAfterDiscount")}
            </div>
            <div style={{ ...classes.oddRowContainer, width: "23%" }}>
              {isRTL ? (
                <>{quoteItems?.totalPriceAfterDiscount + " " + CurrencyUnit}</>
              ) : (
                <>{CurrencyUnit + " " + quoteItems?.totalPriceAfterDiscount}</>
              )}
            </div>
          </>
        ) : (
          <>
            <div style={{ ...classes.evenRowContainer, width: "13%" }}>
              {`${t("sales.quote.vat")} (${Number(quoteItems?.vat) * 100}%)`}
            </div>
            <div style={{ ...classes.oddRowContainer, width: "23%" }}>
              {isRTL ? (
                <>{quoteItems?.totalVAT + " " + CurrencyUnit}</>
              ) : (
                <>{CurrencyUnit + " " + quoteItems?.totalVAT}</>
              )}
            </div>
          </>
        )}
      </div>
      {!(isQuoteConfirmation
        ? quoteItems?.hideVatInSystem
        : CheckPreferenceValue(EPreferences.HIDE_VAT_FROM_DOCUMENTS)) && (
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
              padding: isRTL ? "12px" : "12px 24px",
            }}
          >
            <div style={classes.cellTextInputStyle}>
              {!isRTL && CurrencyUnit}
              <InputUpdatedValues
                value={quoteItems?.totalPayment}
                onBlur={onBlurTotalPayment}
                isUpdate={canUpdateDiscount && isUpdateTotalPayment}
                setIsUpdate={
                  isQuoteConfirmation
                    ? setIsConfirmation
                    : setIsUpdateTotalPayment
                }
                onInputChange={(e) => onInputTotalPayment(e)}
                specialStyle={{
                  color: "#F135A3",
                  ...FONT_FAMILY.Inter(700, 18),
                  padding: 0,
                }}
                inputMainContainerStyle={{
                  gap: 0,
                }}
              />
              {isRTL && CurrencyUnit}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { TotalPriceComp };
