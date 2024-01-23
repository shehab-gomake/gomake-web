import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useQuoteWidget } from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
import { useRecoilState } from "recoil";
import { addressModalState } from "./address-widget/state";
import { PlusNewIcon } from "@/icons";
import { MinusIcon } from "@/icons/minus-icon";
import { AddressModal } from "./address-widget/address-modal";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";

const BusinessNewWidget = ({
  values,
  selectBusiness,
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
  updatePurchaseNumber,
  updateClientAddress,
  onClickDeleteAddress,
  documentType,
  isQuoteConfirmation = false,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [isConfirmation, setIsConfirmation] = useState();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const { renderOptions, checkWhatRenderArray } = useQuoteWidget();
  const [openModal, setOpenModal] = useRecoilState<boolean>(addressModalState);
  const [purchaseNumber, setPurchaseNumber] = useState(values?.purchaseNumber || t("sales.quote.noPurchaseNumber"));

  useEffect(() => {
    setPurchaseNumber(values?.purchaseNumber || t("sales.quote.noPurchaseNumber"));
  }, [values?.purchaseNumber]);

  const mappedCustomers = renderOptions().map(customer => ({
    text: customer?.name,
    id: customer?.id
  }));

  return (
    <>
      <div style={classes.businessContainerStyle}>
        <AutoCompleteUpdatedValue
          label={t("sales.quote.businessName")}
          value={quoteStateValue?.client?.name}
          options={mappedCustomers}
          onBlur={onBlurBusinessName}
          isUpdate={isUpdateBusinessName}
          setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateBusinessName}
          getOptionLabel={(item) => item.text}
          onChange={(e, value) => onChangeSelectBusiness(value)}
          onChangeTextField={checkWhatRenderArray}
        />
        <InputUpdatedValues
          value={purchaseNumber}
          label={t("sales.quote.purchaseNumber")}
          onBlur={() => onBlurPurchaseNumber(purchaseNumber)}
          isUpdate={isUpdatePurchaseNumber}
          setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdatePurchaseNumber}
          onInputChange={(v) => setPurchaseNumber(v)}
        />
        <InputUpdatedValues
          value={`${selectBusiness?.code}`}
          label={t("sales.quote.businessCode")}
          onBlur={onBlurBusinessCode}
          setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateBusinessCode}
        />
        <AutoCompleteUpdatedValue
          label={t("sales.quote.agent")}
          value={selectedAgent?.text}
          options={agentListValue}
          onBlur={onBlurAgent}
          isUpdate={isUpdateAgent}
          setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateAgent}
          getOptionLabel={(item) => item.text}
          onChange={(e, value) => updateAgent(value)}
        />
        {values?.documentAddresses?.length > 0 && <InputUpdatedValues
          value={values?.documentAddresses?.length > 0 ? `${values?.documentAddresses[0]?.street} ${values?.documentAddresses[0]?.apartment}, ${values?.documentAddresses[0]?.city}` : "no address found"}
          label={t("customers.modal.address")}
          isUnderLine={true}
          onBlur={onBlurAddress}
          isUpdate={false}
          setIsUpdate={setIsUpdateAddress}
          flag={true}
          onClickFlag={() => setOpenModal(true)}
        />}
        {values?.documentAddresses?.length > 0 ?
          <div
            style={classes.addNewAddressStyle}
            onClick={() => null}
          >
            <MinusIcon />
            <div style={classes.addNewAddressTextStyle} onClick={() => onClickDeleteAddress(values?.documentAddresses[0])}>{t("sales.quote.removeAddress")}</div>
          </div>
          :
          (!isQuoteConfirmation &&
            <div style={classes.addNewAddressStyle} >
              <PlusNewIcon />
              <div style={classes.addNewAddressTextStyle} onClick={() => setOpenModal(true)} >{t("sales.quote.addAddress")}</div>
            </div>
          )}
        {/* <GoMakeAlertModal 
        title={t("Change client")}
        openModal={openAlertModal}
        onClose={onCloseAlertModal}
        subTitle={t("Are you sure to change client")}
        onClickConfirm={()=>{onChangeSelectBusiness(client).then(setOpenAlertModal(false)); }}
        >
        </GoMakeAlertModal> */}
        <AddressModal isUpdate={values?.documentAddresses?.length > 0} documentType={documentType} />
      </div>
    </>
  );
};

export { BusinessNewWidget };