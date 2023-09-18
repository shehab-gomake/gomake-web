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
        (c) => c.machineCategoryId === action.categoryId
      )?.machines
    );
  }, [machineCategories]);

  return (
    <div style={clasess.summaryContainer}>
      <div style={clasess.actionNameStyle}>{action?.actionName}</div>
      <div style={clasess.cellsContainerStyle}>
        {actionData?.machineCategories && (
          <div
            style={{
              minWidth: 180,
              paddingRight: 22,
              paddingBottom: 22,
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
                (c) => c.id === action.categoryId
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
        )}

        {machinesArray?.length > 0 ? (
          <div
            style={{
              minWidth: 180,
              paddingRight: 22,
              paddingBottom: 22,
            }}
          >
            <GoMakeAutoComplate
              options={machinesArray}
              getOptionLabel={(option: any) => option.machineName}
              defaultValue={machinesArray.find(
                (c) => c.machineId === action.mongoDBMachineId
              )}
              placeholder={t("products.offsetPrice.admin.machine")}
              style={clasess.actoionsSelectContainer}
              onChange={(e: any, item: any) => {
                console.log("item", item);
              }}
            />
          </div>
        ) : null}
        <div style={{ display: "flex" }}></div>
        {action?.outputs.slice(0, 3).map((item, index) => (
          <div
            key={index}
            // style={{ backgroundColor: index % 1 === 0 ? "lightgray" : "white" }}
          >
            <div style={clasess.cellContainer}>
              <div>{item?.name}</div>
              <div>{item.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={clasess.cellsContainerStyle2}>
        <div style={{ display: "flex" }}></div>
        {action?.outputs.slice(3, 8).map((item, index) => (
          <div key={index}>
            <div style={clasess.cellContainer}>
              <div>{item?.name}</div>
              <div>{item.value}</div>
            </div>
          </div>
        ))}
      </div>
      {action?.outputs.slice(8, 12)?.lengh && (
        <div style={clasess.cellsContainerStyle}>
          <div style={{ display: "flex" }}></div>
          {action?.outputs.slice(8, 12).map((item, index) => (
            <div key={index}>
              <div style={clasess.cellContainer}>
                <div>{item?.name}</div>
                <div>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {action?.outputs.slice(12, 18)?.lengh && (
        <div style={clasess.cellsContainerStyle}>
          <div style={{ display: "flex" }}></div>
          {action?.outputs.slice(12, 18).map((item, index) => (
            <div key={index}>
              <div style={clasess.cellContainer}>
                <div>{item?.name}</div>
                <div>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { ActionMappingWidget };
