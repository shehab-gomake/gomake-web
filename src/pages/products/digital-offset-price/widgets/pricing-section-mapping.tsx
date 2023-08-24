import { useTranslation } from "react-i18next";
import { Table } from "@/widgets/table/table";
import { FlowsMappingWidget } from "./flows-mapping";

const PricingSectionMappingWidget = ({
  clasess,
  machineCategories,
  onChangeCategoryData,
  section,
  pricingDefaultValue,
}: any) => {
  const { t } = useTranslation();
  return (
    <div style={clasess.pricingSectionContainer}>
      <div style={clasess.summaryContainer}>
        <div style={clasess.summaryStyle}>
          {t("products.offsetPrice.admin.summary")}
        </div>
        <div style={clasess.jobDetailsContainer}>
          <div style={clasess.jobDetailsStyle}>
            {t("products.offsetPrice.admin.jobDetails")}
          </div>
          <div style={clasess.jobDetails}>{section.jobDetails}</div>
        </div>
        {pricingDefaultValue?.workFlows?.length > 0 && (
          <>
            <div style={{ width: "100%" }}>
              <Table
                tableHeaders={[
                  t("products.offsetPrice.admin.totalCost"),
                  t("products.offsetPrice.admin.totalProductionTime"),
                  t("products.offsetPrice.admin.finalPrice"),
                ]}
                tableRows={[
                  {
                    totalCost: `${pricingDefaultValue?.workFlows[0]?.totalCost} USD`,
                    totalProductionTime: `${pricingDefaultValue?.workFlows[0]?.totalProductionTime}`,
                    finalPrice: `${pricingDefaultValue?.workFlows[0]?.totalPrice} USD`,
                  },
                ]}
              />
            </div>
          </>
        )}
      </div>
      {pricingDefaultValue?.workFlows?.length > 0 && (
        <>
          <div style={clasess.actionsStyleContainer}>
            {t("products.offsetPrice.admin.actions")}
          </div>
          {pricingDefaultValue?.workFlows?.map((flow: any) => {
            return (
              <FlowsMappingWidget
                clasess={clasess}
                flow={flow}
                machineCategories={machineCategories}
                onChangeCategoryData={onChangeCategoryData}
                section={section}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export { PricingSectionMappingWidget };
