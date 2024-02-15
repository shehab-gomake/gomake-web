import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "@/icons";
import { useRecoilValue } from "recoil";
import { agentListsState, businessListsState, quoteItemState } from "@/store";
import { quoteState } from "@/pages-components/quote/store/quote";
import { useEffect, useState } from "react";
interface IProps {
  isBusinessCode?: boolean;
  isBusinessName?: boolean;
  isPurchaseNumber?: boolean;
  isAgent?: boolean;
}
const BusinessWidget = ({
  isBusinessCode = true,
  isBusinessName = true,
  isPurchaseNumber = true,
  isAgent = true,
}: IProps) => {
  const quoteStateValue = useRecoilValue<any>(quoteState);
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const customersListValue = useRecoilValue<any>(businessListsState);
  const agentListValue = useRecoilValue<any>(agentListsState);
  const [selectedAgent, setSelectedAgent] = useState();
  useEffect(() => {
    if (agentListValue?.length > 0) {
      const selectedAgent1 = agentListValue.find(
        (agent) => agent.value === quoteItemValue?.agentId
      );
      setSelectedAgent(selectedAgent1);
    }
  }, [agentListValue, quoteItemValue]);

  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <>
      {quoteItemValue && (
        <div style={clasess.mainContainer}>
          {isBusinessCode && (
            <div style={clasess.fieldContainer}>
              <div style={clasess.labelStyle}>
                {t("sales.quote.businessCode")}
              </div>
              <GomakeTextInput
                placeholder={t("sales.quote.businessCode")}
                style={clasess.textInputStyle}
                key={quoteStateValue.selectBusiness?.code}
                value={quoteStateValue.selectBusiness?.code}
              />
            </div>
          )}
          {isBusinessName && (
            <div style={clasess.fieldContainer}>
              <div style={clasess.labelContainer}>
                <div style={clasess.labelStyle}>
                  {t("sales.quote.businessName")}
                </div>
                <div style={clasess.plusIconContainer}>
                  <PlusIcon />
                </div>
              </div>
              <GoMakeAutoComplate
                options={customersListValue}
                style={clasess.autoComplateStyle}
                key={quoteStateValue.selectBusiness?.name}
                value={quoteStateValue.selectBusiness}
                placeholder={
                  quoteStateValue.selectBusiness
                    ? quoteStateValue.selectBusiness?.name
                    : t("sales.quote.businessName")
                }
                getOptionLabel={(item) => item?.name}
                onChange={(e: any, item: any) => {
                  quoteStateValue.onChangeSelectBusiness(item);
                }}
              />
            </div>
          )}
          {isPurchaseNumber && (
            <div style={clasess.fieldContainer}>
              <div style={clasess.labelStyle}>
                {t("sales.quote.purchaseNumber")}
              </div>
              <GomakeTextInput
                placeholder={t("sales.quote.purchaseNumber")}
                style={clasess.textInputStyle}
                value={quoteItemValue?.purchaseNumber}
              />
            </div>
          )}

          {isAgent && (
            <div style={clasess.fieldContainer}>
              <div style={clasess.labelStyle}>{t("sales.quote.agent")}</div>
              <GoMakeAutoComplate
                options={agentListValue}
                style={clasess.autoComplateStyle}
                value={selectedAgent}
                key={selectedAgent}
                getOptionLabel={(item) => item?.text}
                placeholder={t("sales.quote.agent")}
                onChange={(e: any, item: any) => {
                  quoteStateValue.updateAgent(item);
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export { BusinessWidget };
