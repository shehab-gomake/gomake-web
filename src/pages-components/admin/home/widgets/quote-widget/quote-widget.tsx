import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GoMakeDeleteModal, GomakePrimaryButton } from "@/components";
import { useQuoteWidget } from "./use-quote-widget";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useStyle } from "./style";
import { Popover, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useRecoilState } from "recoil";
import { QuoteIfExistState, QuoteNumberState } from "@/pages-components/quote/store/quote";

const QuoteWidget = ({ isAdmin = true   }) => {
  const { clasess } = useStyle();
  const [QuoteId ,  setQuoteId] = useState("");
  const [selectedOption, setselectedOption] = useState<any>();
  const [quoteNumber, setquoteNumber] = useRecoilState<any>(QuoteNumberState);
  const [QuoteIfExist, setQuoteIfExist] = useRecoilState<any>(QuoteIfExistState);

  const { t } = useTranslation();
  const {
    clientTypesValue,
    productValue,
    id,
    anchorEl,
    isDisabled ,  handleClick , onClcikCreateQuote , onClcikCreateQuoteForCustomer,
    open,
    openModal,
    onClickSaveQuote,
    QuoteExist,
    updateCustomerList,
    errorColor,
    selectedClientType,
    onClcikCloseModal,
    selectedCustomersList,
    _renderErrorMessage,
    handleClose,
    updateQuoteExist,
    setSelectedClientType,
    setSelectedCustomersList,
    setSelectedProduct,
    updateCustomerListSelectedAfterConfirm,
    checkWhatRenderArray,
    handleClicktoSelectedCustomer,
    renderOptions,
  } = useQuoteWidget();
  

  const selectedOptionInQuoteExist = renderOptions()?.find(
    (item) => item.id == QuoteExist?.result?.clientId
  );

    useEffect(()=>{
    
        if(!selectedOptionInQuoteExist && QuoteExist?.result == null && !selectedCustomersList && Object?.keys(selectedCustomersList).length === 0)
        {
         
          setSelectedCustomersList(null)
          setSelectedClientType(null)
        }else{
         
          if( QuoteExist?.result != null)
          {
          
            setQuoteIfExist(QuoteExist?.result);
            setSelectedCustomersList(selectedOptionInQuoteExist);
          }else{
           
            setSelectedCustomersList(selectedCustomersList);
          }
          
      }
     
      if(selectedOptionInQuoteExist)
      {
        setQuoteId(QuoteExist?.result?.id);
        setquoteNumber(QuoteExist?.result?.number)
          const client = clientTypesValue.find(
            (c) => c.id == selectedOptionInQuoteExist?.clientTypeId
          );
          if (client) {
            setSelectedClientType(client);
          } else {
            setSelectedClientType({});
          }
      }
    
    },[QuoteExist,selectedOptionInQuoteExist])
  return (
  
    <div style={clasess.mainContainer}>
      <div style={clasess.autoComplateRowContainer}>
        <div style={{ width: "65%" }}>
          <GoMakeAutoComplate
            options={renderOptions() ? renderOptions() : []}
            placeholder={t("home.admin.selectCustomer")}
            style={clasess.selectCustomerContainer}
            getOptionLabel={(option: any) => `${option.name}-${option.code}`}
            onChangeTextField={checkWhatRenderArray}
            key={selectedCustomersList}
            value={Object?.keys(selectedCustomersList).length !== 0 ? selectedCustomersList : null}
            onChange={(e: any, value: any) => {
              handleClicktoSelectedCustomer(QuoteExist?.result?.clientId,value)
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
       
            {
              QuoteExist.result != null ?
              <Stack direction={'row'} gap={'13px'} width={'100%'}>
              <div  style={{width:"50%"}}>
                    <GomakePrimaryButton
                    onClick={
                        isDisabled
                        ? handleClick
                        : isAdmin
                        ? onClcikCreateQuote
                        : onClcikCreateQuoteForCustomer
                    }
                    variant="contained"
                    style={{width:"100%",height:40}}
    
                    
                    >
                    {t("home.admin.AddItemToQuote")}
                    
                    </GomakePrimaryButton>
                    
                    </div>
                    <div style={{width:"50%"}}>
                          <SecondaryButton
                          variant="contained"
                          style={{width:"100%",height:40}}
                          onClick={() => {
                              onClickSaveQuote(QuoteId)
                              .then(()=>updateCustomerList())
                              .catch((error) => console.error("Error:", error));
                              }}
                          >
                          {t("home.admin.SaveQuote")}
                          </SecondaryButton>
                    </div>    
              
              </Stack> 
              : <div style={{width:"50%"}}>
                        <GomakePrimaryButton
                        onClick={
                            isDisabled
                            ? handleClick
                            : isAdmin
                            ? onClcikCreateQuote
                            : onClcikCreateQuoteForCustomer
                        }
                        variant="contained"
                        style={{width:"100%",height:40}}

                        
                        >
                        {t("home.admin.createQoute")}
                        
                        </GomakePrimaryButton>
              
                 </div>
       
            } 
      
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
      <GoMakeDeleteModal
         icon={
          <WarningAmberIcon
            style={{ width: 120, height: 120, color: errorColor(300) }}
          />
        }
        title={t("sales.quote.titleMessage")}
        yesBtn={t("sales.quote.Confirm")}
        openModal={openModal}
        onClose={()=> {
          onClcikCloseModal()
          .then(() => updateQuoteExist())
          .catch((error) => console.error("Error:", error));
        }}
        subTitle={t("sales.quote.MessageForClient")}
        onClickDelete={() => {
          onClickSaveQuote(QuoteId)
              .then(() => onClcikCloseModal())
              .then(() => updateCustomerListSelectedAfterConfirm(selectedCustomersList))
              .catch((error) => console.error("Error:", error));
          }}
      />
    </div>
    
  );
};

export { QuoteWidget };
