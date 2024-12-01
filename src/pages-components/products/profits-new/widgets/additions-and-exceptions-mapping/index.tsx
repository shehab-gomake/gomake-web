import { MoreCircleIcon } from "@/icons";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { EAdditionType } from "@/enums";

const AdditionsAndExceptionsMapping = ({
  item,
  handleClickPricingTablesMapping,
  selectedAdditionalProfitRow,
  setSelectedActionProfitRow,
  ProfitCurrency,
  getAllActionProfitRowsByActionId,
  getCalculateCaseProfits
}) => {
  const { clasess } = useStyle();
  const router = useRouter()
  const { t } = useTranslation();
  const renderAdditionType = (additionType: EAdditionType) => {
    switch (additionType) {
      case EAdditionType.Percentage:
        return "%";
      case EAdditionType.ValuePerUnit:
        return `${ProfitCurrency} / U`;
      case EAdditionType.ValuePerJob:
        return `${ProfitCurrency} / J`;
      default:
        return "";
    }
  };

  return (
    <div style={clasess.mainContainer}>
      <div
        style={
          selectedAdditionalProfitRow?.id === item?.id
            ? clasess.WithBordermainContainer
            : clasess.cardItemWithMore
        }
        onClick={() => {
          if (router.query.signalRConnectionId) {
            if (selectedAdditionalProfitRow?.id === item?.id) {
              setSelectedActionProfitRow(null);
              getCalculateCaseProfits(null);
            } else {
              setSelectedActionProfitRow(item);
              // getCalculateCaseProfits(item);
            }
          }
          else {
            if (selectedAdditionalProfitRow?.id === item?.id) {
              setSelectedActionProfitRow(null);
              // getAllActionProfitRowsByActionId(null);
            } else {
              setSelectedActionProfitRow(item);
              // getAllActionProfitRowsByActionId(item);
            }
          }

        }}
      >
        <div style={clasess.firstRowStyle}>
          <div style={clasess.ruleTextStyle}>{t("properties.rule")}</div>
          <div style={{ width: "80%" }}>{item.name}</div>
          <div style={clasess.lineStyle} />
          <div style={clasess.ruleTextStyle}>
            {t("products.profits.exceptions.value")}
          </div>
          <div style={clasess.valueStyle}>
            {item?.profitValue} {renderAdditionType(item?.additionType)}
          </div>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleClickPricingTablesMapping(e);
            setSelectedActionProfitRow(item);
          }}
          style={clasess.moreIconStyle}
        >
          <MoreCircleIcon />
        </div>
      </div>
    </div>
  );
};

export { AdditionsAndExceptionsMapping };
