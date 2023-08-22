import { useTranslation } from "react-i18next";
import { ActionMappingWidget } from "./action-mapping";

const FlowsMappingWidget = ({
  clasess,
  flow,
  machineCategories,
  onChangeCategoryData,
  section,
}: any) => {
  const { t } = useTranslation();
  return (
    <>
      {flow?.actions?.map((action: any) => {
        const actionData = section.actions.find(
          (item: any) => item.actionId === action.actionId
        );

        const machinData = actionData?.machineCategories;
        const machinesArray = machinData.find(
          (item) => item.machineCategoryId === action?.machineCategoryId
        )?.machines;

        if (actionData) {
          return (
            <ActionMappingWidget
              clasess={clasess}
              action={action}
              actionData={actionData}
              machineCategories={machineCategories}
              onChangeCategoryData={onChangeCategoryData}
              machinesArray={machinesArray}
            />
          );
        }
      })}
    </>
  );
};

export { FlowsMappingWidget };
