import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "@/icons";
import { useRecoilValue } from "recoil";
import { agentListsState, businessListsState, quoteItemState } from "@/store";
import { useState } from "react";
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
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const customersListValue = useRecoilValue<any>(businessListsState);
  const agentListValue = useRecoilValue<any>(agentListsState);

  const [selectBusiness, setSelectBusiness] = useState<any>({});
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
                // onChange={(e: any) => {
                //   e.target.value;
                // }}
                //  defaultValue={selectBusiness?.code}
                value={selectBusiness?.code}
              />
            </div>
          )}
          {isBusinessName && (
            <div style={clasess.fieldContainer}>
              <div style={clasess.labelContainer}>
                <div style={clasess.labelStyle}>
                  {t("sales.quote.businessName")}
                </div>
                <PlusIcon />
              </div>
              <GoMakeAutoComplate
                options={customersListValue}
                style={clasess.autoComplateStyle}
                placeholder={t("sales.quote.businessName")}
                getOptionLabel={(item) => item?.name}
                onChange={(e: any, item: any) => {
                  setSelectBusiness(item);
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
                getOptionLabel={(item) => item?.firstname}
                placeholder={t("sales.quote.agent")}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export { BusinessWidget };
