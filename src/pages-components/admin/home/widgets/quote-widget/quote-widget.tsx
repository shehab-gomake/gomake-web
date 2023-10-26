import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GoMakeDeleteModal, GomakePrimaryButton } from "@/components";
import { useQuoteWidget } from "./use-quote-widget";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useStyle } from "./style";
import { Popover, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { SecondaryButton } from "@/components/button/secondary-button";

const QuoteWidget = ({ isAdmin = true   }) => {
  const { clasess } = useStyle();
  const [QuoteId ,  setQuoteId] = useState("");
  const [selectedOption, setselectedOption] = useState<any>();
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
    errorColor,
    selectedClientType,
    onClcikCloseModal,
    _renderErrorMessage,
    handleClose,
    updateQuoteExist,
    setSelectedClientType,
    setSelectedCustomersList,
    setSelectedProduct,
    checkWhatRenderArray,
    setOpenModal,
    renderOptions,
  } = useQuoteWidget();
  
  const selectedOptionInQuoteExist = renderOptions().find(
    (item) => item.id == QuoteExist?.result?.clientId
  );
 
  console.log(selectedOptionInQuoteExist);
    
    useEffect(()=>{
      if(selectedOptionInQuoteExist){
        setselectedOption(selectedOptionInQuoteExist);
      }
      if (QuoteExist.result == null) {
        setSelectedClientType(null);
      }else{
        if(!selectedOption && QuoteExist.result != null)
        {
            const updatedSelection = renderOptions().find(
              (item) => item.id == QuoteExist?.result?.clientId
            );
          
          setselectedOption(updatedSelection);
        }
      }
      if(selectedOption)
      {
        setQuoteId(QuoteExist?.result?.id);
        setSelectedCustomersList(selectedOption);
          const client = clientTypesValue.find(
            (c) => c.id == selectedOption?.clientTypeId
          );
          if (client) {
            setSelectedClientType(client);
          } else {
            setSelectedClientType({});
          }
      }
    
    },[QuoteExist,selectedOption , selectedOptionInQuoteExist])
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
              if(QuoteExist?.result?.clientId != null && value?.id != null)
              {
                if(QuoteExist?.result?.clientId != value?.id )
                {
                  setOpenModal(true);
                }
              
              }
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
       
            {
              QuoteExist.result != null ?
              <Stack direction={'row'} gap={'13px'}>
              <div>
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
                    <div>
                          <SecondaryButton
                          variant="contained"
                          style={{width:"100%",height:40}}
                          onClick={() => {
                              onClickSaveQuote(QuoteId)
                                  .then(() => updateQuoteExist())
                                  .catch((error) => console.error("Error:", error));
                              }}
                          >
                          {t("home.admin.SaveQuote")}
                          </SecondaryButton>
                    </div>    
              
              </Stack> 
              : <div>
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
              .catch((error) => console.error("Error:", error));
          }}
      />
    </div>
    
  );
};

export { QuoteWidget };
