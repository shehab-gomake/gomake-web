import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { useQuoteWidget } from "./use-quote-widget";

import { useStyle } from "./style";

const QuoteWidget = ({ isAdmin = true }) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    clientTypesValue,
    productValue,
    setSelectedClientType,
    setSelectedCustomersList,
    setSelectedProduct,
    checkWhatRenderArray,
    renderOptions,
    onClcikCreateQuote,
    onClcikCreateQuoteForCustomer,
  } = useQuoteWidget();

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.autoComplateRowContainer}>
        <div style={{ width: "65%" }}>
          <GoMakeAutoComplate
            options={renderOptions()}
            placeholder={t("home.admin.selectCustomer")}
            style={clasess.selectCustomerContainer}
            getOptionLabel={(option: any) => `${option.name}-${option.code}`}
            onChangeTextField={checkWhatRenderArray}
            onChange={(e: any, value: any) => {
              setSelectedCustomersList(value);
            }}
          />
        </div>
        <div style={{ width: "30%" }}>
          <GoMakeAutoComplate
            options={clientTypesValue}
            placeholder={t("home.admin.selectType")}
            style={clasess.selectTypeContainer}
            getOptionLabel={(option: any) => option.name}
            onChange={(e: any, value: any) => {
              setSelectedClientType(value);
            }}
          />
        </div>
      </div>
      <div style={clasess.autoComplateRowContainer}>
        <div style={{ width: "65%" }}>
          <GoMakeAutoComplate
            options={productValue}
            placeholder={t("home.admin.selectProduct")}
            style={clasess.selectTypeContainer}
            getOptionLabel={(option: any) => option.name}
            onChange={(e: any, value: any) => {
              setSelectedProduct(value);
            }}
          />
        </div>
      </div>
      <div style={clasess.btnContainer}>
        <GomakePrimaryButton
          onClick={isAdmin ? onClcikCreateQuote : onClcikCreateQuoteForCustomer}
        >
          {t("home.admin.createQoute")}
        </GomakePrimaryButton>
      </div>
    </div>
  );
};

export { QuoteWidget };
