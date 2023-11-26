import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { useTranslation } from "react-i18next";

const BusinessNewWidget = ({
  values,
  selectBusiness,
  onBlurBusinessName,
  isUpdateBusinessName,
  setIsUpdateBusinessName,
  setSelectBusiness,
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
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <>
      <div style={clasess.businessContainerStyle}>
        <InputUpdatedValues
          value={selectBusiness?.name}
          label={t("sales.quote.businessName")}
          onBlur={onBlurBusinessName}
          isUpdate={isUpdateBusinessName}
          setIsUpdate={setIsUpdateBusinessName}
          onInputChange={(e) => setSelectBusiness({ name: e })}
        />
        <InputUpdatedValues
          value={
            values?.purchaseNumber !== null
              ? `${values?.purchaseNumber}`
              : "No purchase number"
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
      </div>
    </>
  );
};

export { BusinessNewWidget };
