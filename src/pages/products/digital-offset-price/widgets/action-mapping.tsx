import { GoMakeAutoComplate } from "@/components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ActionMappingWidget = ({
  clasess,
  action,
  actionData,
  machineCategories,
  onChangeCategoryData,
}: any) => {
  const { t } = useTranslation();

  const [machinesArray, setMachinesArray] = useState([]);
  useEffect(() => {
    setMachinesArray(
      actionData?.machineCategories.find(
        (c) => c.machineCategoryId === action.machineCategoryId
      ).machines
    );
  }, [machineCategories]);
  return (
    <div style={clasess.summaryContainer}>
      <div style={clasess.actionNameStyle}>{action?.actionName}</div>
      <div style={clasess.cellsContainerStyle}>
        <div
          style={{
            minWidth: 180,
            padding: 22,
          }}
        >
          <GoMakeAutoComplate
            options={["q", "w"]}
            placeholder={t("products.offsetPrice.admin.stationName")}
            style={clasess.actoionsSelectContainer}
          />
        </div>
        <div
          style={{
            minWidth: 180,
            padding: 22,
          }}
        >
          <GoMakeAutoComplate
            options={actionData?.machineCategories?.map((category) => {
              const findMachineCategory = machineCategories.find(
                (c) => c.id === category.machineCategoryId
              );

              return {
                ...findMachineCategory,
                machines: category.machines,
              };
            })}
            defaultValue={machineCategories.find(
              (c) => c.id === action.machineCategoryId
            )}
            onChange={(e: any, item: any) => {
              setMachinesArray(item?.machines);
              onChangeCategoryData(
                action.actionId,
                action.machineCategoryId,
                item
              );
            }}
            getOptionLabel={(option: any) => option.name}
            placeholder={t("products.offsetPrice.admin.actionType")}
            style={clasess.actoionsSelectContainer}
          />
        </div>
        <div
          style={{
            minWidth: 180,
            padding: 22,
          }}
        >
          {machinesArray?.length > 0 && (
            <GoMakeAutoComplate
              options={machinesArray}
              getOptionLabel={(option: any) => option.machineName}
              defaultValue={machinesArray.find(
                (c) => c.machineId === action.machineId
              )}
              placeholder={t("products.offsetPrice.admin.machine")}
              style={clasess.actoionsSelectContainer}
            />
          )}
        </div>

        {action?.outputs.map((output: any) => {
          return (
            <div style={clasess.cellContainer}>
              <div>{output?.name}</div>
              <div>{output.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { ActionMappingWidget };
