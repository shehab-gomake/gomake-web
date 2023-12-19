import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuoteWidget } from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
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
  updatePurchaseNumber
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const { renderOptions, checkWhatRenderArray } = useQuoteWidget();
  const [purchaseNumber, setPurchaseNumber] = useState(values?.purchaseNumber || t("sales.quote.noPurchaseNumber"));

  const mappedCustomers = renderOptions().map(customer => ({
    text: customer?.name,
    id: customer?.id
  }));

  //  selected agent here is : agentListValue.find((agent) => agent.value === quoteItemValue?.agentId).text  , but anyway there is a problem when updating "business name" the agent disappeared
 
  return (
    <>
      <div style={classes.businessContainerStyle}>

        <AutoCompleteUpdatedValue
          label={t("sales.quote.businessName")}
          value={quoteStateValue?.client?.name} 
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
      </div>
    </>
  );
};

export { BusinessNewWidget };