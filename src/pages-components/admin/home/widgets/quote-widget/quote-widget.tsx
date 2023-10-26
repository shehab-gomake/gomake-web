import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { useQuoteWidget } from "./use-quote-widget";

import { useStyle } from "./style";
import { Popover } from "@mui/material";

const QuoteWidget = ({ isAdmin = true }) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    clientTypesValue,
    productValue,
    isDisabled,
    id,
    anchorEl,
    open,
    selectedClientType,
    _renderErrorMessage,
    handleClick,
    handleClose,
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
              const client = clientTypesValue.find(
                (c) => c.id == value?.clientTypeId
              );
              if (client) {
                setSelectedClientType(client);
              } else {
                setSelectedClientType({});
              }
            }}
          />
        </div>
        <div style={{ width: "30%" }}>
          <GoMakeAutoComplate
            options={clientTypesValue}
            placeholder={t("home.admin.selectType")}
            style={clasess.selectTypeContainer}
            getOptionLabel={(option: any) => (option?.name ? option.name : "")}
            onChange={(e: any, value: any) => {
              setSelectedClientType(value);
            }}
            value={
              typeof selectedClientType != "undefined"
                ? selectedClientType
                : null
            }
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
          // onClick={isAdmin ? onClcikCreateQuote : onClcikCreateQuoteForCustomer}
          onClick={
            isDisabled
              ? handleClick
              : isAdmin
              ? onClcikCreateQuote
              : onClcikCreateQuoteForCustomer
          }
          // disabled={isDisabled}
          style={clasess.btnStyle}
        >
          {t("home.admin.createQoute")}
        </GomakePrimaryButton>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div style={clasess.errorMsgStyle}>{_renderErrorMessage()}</div>
      </Popover>
    </div>
  );
};

export { QuoteWidget };
