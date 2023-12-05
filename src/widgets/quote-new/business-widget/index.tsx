import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate } from "@/components/auto-complete";
import { useRecoilValue } from "recoil";
import { businessListsState } from "@/store/business-list";
import { quoteItemState } from "@/store/quote-item";
import { useEffect, useState } from "react";
import { useQuoteWidget } from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
import { GoMakeAlertModal } from "@/components/modal/alert-modal";

const BusinessNewWidget = ({
  values,
  selectBusiness,
  onBlurPurchaseNumer,
  isUpdatePurchaseNumer,
  setIsUpdatePurchaseNumer,
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
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { renderOptions, checkWhatRenderArray } = useQuoteWidget();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
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
          value={
            values?.purchaseNumber !== null
              ? `${values?.purchaseNumber}`
              : t("sales.quote.noPurchaseNumber")
          }
          label={t("sales.quote.purchaseNumber")}
          onBlur={onBlurPurchaseNumer}
          isUpdate={isUpdatePurchaseNumer}
          setIsUpdate={setIsUpdatePurchaseNumer}
          onInputChange={(e) => console.log("ddff")}
        />
        <InputUpdatedValues
          value={`${selectBusiness?.code}`}
          label={t("sales.quote.businessCode")}
          onBlur={onBlurBusinessCode}
          setIsUpdate={setIsUpdateBusinessCode}
        />
        {values?.quoteAddresses?.length > 0 && (
          <InputUpdatedValues
            value={`${values?.quoteAddresses[0]?.street} ${values?.quoteAddresses[0]?.apartment}, ${values?.quoteAddresses[0]?.city} `}
            label={t("customers.modal.address")}
            isAnderLine={true}
            onBlur={onBlurAddress}
            isUpdate={isUpdateAddress}
            setIsUpdate={setIsUpdateAddress}
          />
        )}
        <AutoCompleteUpdatedValue
          label={t("sales.quote.agent")}
          value={selectedAgent?.text}
          options={agentListValue}
          onBlur={onBlurAgent}
          isUpdate={isUpdateAgent}
          setIsUpdate={setIsUpdateAgent}
          getOptionLabel={(item) => item.text}
          onChange={(e, value) => updateAgent(value)}
        />
        {/* <GoMakeAlertModal 
        title={t("Change client")}
        openModal={openAlertModal}
        onClose={onCloseAlertModal}
        subTitle={t("Are you sure to change client")}
        onClickConfirm={()=>{onChangeSelectBusiness(client).then(setOpenAlertModal(false)); }}
        >
        </GoMakeAlertModal> */}
      </div>
    </>
  );
};

export { BusinessNewWidget };