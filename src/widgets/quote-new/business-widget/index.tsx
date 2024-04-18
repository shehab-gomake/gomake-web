import { useEffect } from "react";
import { MinusIcon } from "@/icons/minus-icon";
import { PlusNewIcon } from "@/icons";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { AddressModal } from "./address-widget/address-modal";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { useBusinessWidget } from "./use-business-widget";

const BusinessNewWidget = ({
  values,
  selectConfirmBusiness,
  onBlurPurchaseNumber,
  isUpdatePurchaseNumber,
  setIsUpdatePurchaseNumber,
  onBlurBusinessCode,
  setIsUpdateBusinessCode,
  onBlurAddress,
  isUpdateAddress,
  setIsUpdateAddress,
  selectedAgent,
  agentListValue,
  onBlurAgent,
  isUpdateAgent,
  setIsUpdateAgent,
  updateAgent,
  onChangeSelectBusiness,
  onBlurBusinessName,
  isUpdateBusinessName,
  setIsUpdateBusinessName,
  onClickDeleteAddress,
  documentType,
  isQuoteConfirmation = false,

}) => {
  const { classes } = useStyle();
  const {
    t,
    router,
    setIsConfirmation,
    checkWhatRenderArray,
    setOpenModal,
    purchaseNumber,
    setPurchaseNumber,
    quoteStateValue,
    quoteConfirm,
    isReceipt,
    isExistReceipt,
    taxConfirmationNumber,
    setTaxConfirmationNumber,
    isInvoice,
    isUpdateTaxNumber,
    setIsUpdateTaxNumber,
    onBlurTaxNumber,
    mappedCustomers,
  } = useBusinessWidget({ values, documentType });
  
  useEffect(() => {
    setPurchaseNumber(values?.purchaseNumber || t("sales.quote.noPurchaseNumber"));
  }, [values?.purchaseNumber]);

  useEffect(() => {
    setTaxConfirmationNumber(values?.taxConfirmationNumber || t("sales.quote.noTaxConfirmationNumber"));
  }, [values?.taxConfirmationNumber]);


  return (
    <>
      <div style={classes.businessContainerStyle}>
        <AutoCompleteUpdatedValue
          label={t("sales.quote.businessName")}
          value={isQuoteConfirmation ? quoteConfirm?.client?.name : quoteStateValue?.client?.name ? quoteStateValue?.client?.name : t("sales.quote.selectBusinessName")}
          options={mappedCustomers}
          onBlur={onBlurBusinessName}
          isUpdate={quoteStateValue?.isEditable || router.query.isNewCreation ? isUpdateBusinessName : quoteStateValue?.isEditable}
          setIsUpdate={isQuoteConfirmation || isExistReceipt ? setIsConfirmation : setIsUpdateBusinessName}
          getOptionLabel={(item) => item.text}
          onChange={(e, value) => onChangeSelectBusiness(value)}
          onChangeTextField={checkWhatRenderArray}
        />
        {!isReceipt && <InputUpdatedValues
          value={purchaseNumber}
          label={t("sales.quote.purchaseNumber")}
          onBlur={() => onBlurPurchaseNumber(purchaseNumber)}
          isUpdate={quoteStateValue?.isEditable || router.query.isNewCreation ? isUpdatePurchaseNumber : quoteStateValue?.isEditable}
          setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdatePurchaseNumber}
          onInputChange={(v) => setPurchaseNumber(v)}
        />}
        {isInvoice && <InputUpdatedValues
          value={taxConfirmationNumber}
          label={t("sales.quote.taxConfirmationNumber")}
          onBlur={onBlurTaxNumber}
          isUpdate={quoteStateValue?.isEditable || router.query.isNewCreation ? isUpdateTaxNumber : false}
          setIsUpdate={setIsUpdateTaxNumber}
          onInputChange={(v) => setTaxConfirmationNumber(v)}
        />}
        <InputUpdatedValues
          value={isQuoteConfirmation ? `${selectConfirmBusiness?.code}` : `${quoteStateValue?.client?.code}`}
          label={t("sales.quote.businessCode")}
          onBlur={onBlurBusinessCode}
          setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateBusinessCode}
        />
        {!isQuoteConfirmation && <AutoCompleteUpdatedValue
          label={t("sales.quote.agent")}
          value={selectedAgent?.text ? selectedAgent.text : t("sales.quote.selectAgent")}
          options={agentListValue}
          onBlur={onBlurAgent}
          isUpdate={quoteStateValue?.isEditable || router.query.isNewCreation ? isUpdateAgent : quoteStateValue?.isEditable}
          setIsUpdate={isQuoteConfirmation || isExistReceipt ? setIsConfirmation : setIsUpdateAgent}
          getOptionLabel={(item) => item.text}
          onChange={(e, value) => updateAgent(value)}
        />}
        {values?.documentAddresses?.length > 0 && <InputUpdatedValues
          value={values?.documentAddresses?.length > 0 ? `${values?.documentAddresses[0]?.street} ${values?.documentAddresses[0]?.apartment}, ${values?.documentAddresses[0]?.city}` : "no address found"}
          label={t("customers.modal.address")}
          isUnderLine={true}
          onBlur={onBlurAddress}
          isUpdate={false}
          setIsUpdate={setIsUpdateAddress}
          flag={!isQuoteConfirmation}
          onClickFlag={() => setOpenModal(true)}
        />}
        {values?.documentAddresses?.length > 0 ?
          (!isQuoteConfirmation && <div
            style={classes.addNewAddressStyle}
            onClick={() => null}
          >
            <MinusIcon />
            <div style={classes.addNewAddressTextStyle} onClick={() => onClickDeleteAddress(values?.documentAddresses[0])}>{t("sales.quote.removeAddress")}</div>
          </div>)
          :
          (!isQuoteConfirmation &&
            <div style={classes.addNewAddressStyle} >
              <PlusNewIcon />
              <div style={classes.addNewAddressTextStyle} onClick={() => setOpenModal(true)} >{t("sales.quote.addAddress")}</div>
            </div>
          )}
        {!isQuoteConfirmation && <AddressModal isUpdate={values?.documentAddresses?.length > 0} documentType={documentType} />}
      </div>
    </>
  );
};

export { BusinessNewWidget };