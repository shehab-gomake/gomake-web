import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useQuoteWidget } from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
import { AddressModal } from "./address-widget/address-modal";
import { useRecoilState, useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { addressModalState } from "./address-widget/state";
import { PlusNewIcon } from "@/icons";
import { MinusIcon } from "@/icons/minus-icon";
import { GoMakeModal } from "@/components";
import { AddressModalNew } from "./address-widget/address-modal-new";

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
  onClickDeleteAddress
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { renderOptions, checkWhatRenderArray } = useQuoteWidget();
  const [purchaseNumber, setPurchaseNumber] = useState(values?.purchaseNumber || t("sales.quote.noPurchaseNumber"));

  const mappedCustomers = renderOptions().map(customer => ({
    text: customer?.name,
    id: customer?.id
  }));

  // const [openAlertModal, setOpenAlertModal] = useState(false);
  // const [client, setClient] = useState();
  // const onCloseAlertModal = () => {
  //   setOpenAlertModal(false);
  // };
  // const onOpenAlertModal = (value:any) => {
  //   setOpenAlertModal(true);
  //   setClient(value);
  // };

  const [openModal, setOpenModal] = useRecoilState<boolean>(addressModalState);

  return (
    <>
      <div style={classes.businessContainerStyle}>
        {/* <h3 style={classes.labelStyle}>{t("sales.quote.businessName")}</h3>
        <GoMakeAutoComplate
          options={renderOptions()}
          style={classes.autoCompleteStyle}
          key={quoteStateValue?.client?.name}
          value={quoteStateValue?.client}
          placeholder={t("sales.quote.businessName")}
          getOptionLabel={(item) => item?.name}
          onChangeTextField={checkWhatRenderArray}
          disableClearable={true}
          onChange={(e: any, value: any)=>onOpenAlertModal(value)}
        /> */}
        <AutoCompleteUpdatedValue
          label={t("sales.quote.businessName")}
          value={selectBusiness?.name}
          options={mappedCustomers}
          onBlur={onBlurBusinessName}
          isUpdate={isUpdateBusinessName}
          setIsUpdate={setIsUpdateBusinessName}
          getOptionLabel={(item) => item.text}
          onChange={(e, value) => onChangeSelectBusiness(value)}
          onChangeTextField={checkWhatRenderArray}
        />
        <InputUpdatedValues
          value={purchaseNumber}
          label={t("sales.quote.purchaseNumber")}
          onBlur={() => onBlurPurchaseNumber(purchaseNumber)}
          isUpdate={isUpdatePurchaseNumber}
          setIsUpdate={setIsUpdatePurchaseNumber}
          onInputChange={(v) => setPurchaseNumber(v)}
        />
        <InputUpdatedValues
          value={`${selectBusiness?.code}`}
          label={t("sales.quote.businessCode")}
          onBlur={onBlurBusinessCode}
          setIsUpdate={setIsUpdateBusinessCode}
        />

        {values?.quoteAddresses?.length > 0 && <InputUpdatedValues
          value={values?.quoteAddresses?.length > 0 ? `${values?.quoteAddresses[0]?.street} ${values?.quoteAddresses[0]?.apartment}, ${values?.quoteAddresses[0]?.city}` : "no address found"}
          label={t("customers.modal.address")}
          isUnderLine={true}
          onBlur={onBlurAddress}
          isUpdate={false}
          setIsUpdate={setIsUpdateAddress}
          flag={true}
          onClickFlag={() => setOpenModal(true)}
        />}

        {values?.quoteAddresses?.length > 0 ?
          <div
            style={classes.addNewAddressStyle}
            onClick={() => null}
          >
            <MinusIcon />
            <div style={classes.addNewAddressTextStyle} onClick={() => onClickDeleteAddress(values?.quoteAddresses[0])}>Remove Address</div>
          </div> : (
            <div
              style={classes.addNewAddressStyle}
            >
              <PlusNewIcon />
              <div style={classes.addNewAddressTextStyle} onClick={() => setOpenModal(true)} >Add Address</div>
            </div>
          )}

        {/* <AutoCompleteUpdatedValue
          label={t("sales.quote.agent")}
          value={selectedAgent?.text}
          options={agentListValue}
          onBlur={onBlurAgent}
          isUpdate={isUpdateAgent}
          setIsUpdate={setIsUpdateAgent}
          getOptionLabel={(item) => item.text}
          onChange={(e, value) => updateAgent(value)}
        /> */}
        {/* <GoMakeAlertModal 
        title={t("Change client")}
        openModal={openAlertModal}
        onClose={onCloseAlertModal}
        subTitle={t("Are you sure to change client")}
        onClickConfirm={()=>{onChangeSelectBusiness(client).then(setOpenAlertModal(false)); }}
        >
        </GoMakeAlertModal> */}

        {/* <AddressModal /> */}
        <AddressModalNew isUpdate={values?.quoteAddresses?.length > 0} />
      </div>
    </>
  );
};

export { BusinessNewWidget };