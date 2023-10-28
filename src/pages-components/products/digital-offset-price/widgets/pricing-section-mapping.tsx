import { useTranslation } from "react-i18next";
import { Table } from "@/widgets/table/table";
import { ActionMappingWidget } from "./action-mapping";

const PricingSectionMappingWidget = ({
  clasess,
  machineCategories,
  onChangeCategoryData,
  section,
  pricingDefaultValue,
  workFlowSelected,
}: any) => {
  console.log("pricingDefaultValue", pricingDefaultValue);
  console.log("workFlowSelected", workFlowSelected);
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
        {workFlowSelected && (
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
                    totalCost: `${workFlowSelected?.totalCost} USD`,
                    totalProductionTime: `${workFlowSelected?.totalProductionTime}`,
                    finalPrice: `${workFlowSelected?.totalPrice} USD`,
                  },
                ]}
                styleContainer={{ marginTop: 20 }}
              />
            </div>
          </>
        )}
      </div>
      {workFlowSelected && (
        <>
          <div style={clasess.actionsStyleContainer}>
            {t("products.offsetPrice.admin.actions")}
          </div>
          {workFlowSelected?.actions?.map((flow: any) => {
            const actionData = section.actions.find(
              (item: any) => item.actionId === flow.actionId
            );
            const machinData = actionData?.machineCategories;
            const machinesArray = machinData?.find(
              (item) => item.machineCategoryId === flow?.machineCategoryId
            )?.machines;
            return (
              <ActionMappingWidget
                clasess={clasess}
                action={flow}
                actionData={actionData}
                machineCategories={machineCategories}
                onChangeCategoryData={onChangeCategoryData}
                machinesArray={machinesArray}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export { PricingSectionMappingWidget };
