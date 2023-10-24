import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { useQuoteWidget } from "./use-quote-widget";

import { useStyle } from "./style";
import { Popover } from "@mui/material";
import { useEffect, useState } from "react";
import { SaveOrAddQuote } from "./components/save-or-add-quote";

const QuoteWidget = ({ isAdmin = true }) => {
  const { clasess } = useStyle();
  const [QuoteId ,  setQuoteId] = useState("");
  const { t } = useTranslation();
  const {
    clientTypesValue,
    productValue,
    isDisabled,
    id,
    anchorEl,
    open,
    QuoteExist,
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

  const selectedOption = renderOptions().find(
    (item) => item.id == QuoteExist?.result?.clientId
  );
    useEffect(()=>{
      if(selectedOption)
      {
        setQuoteId(QuoteExist?.result?.id);
          const client = clientTypesValue.find(
            (c) => c.id == selectedOption?.clientTypeId
          );
          if (client) {
            setSelectedClientType(client);
          } else {
            setSelectedClientType({});
          }
      }
    
    })
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
            key={selectedOption}
            value={selectedOption}
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
          <div style={{width:"100%", display:"flex", justifyContent:"center"}}>
             <SaveOrAddQuote QuoteId={QuoteId}/>
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
