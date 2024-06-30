import { GoMakeAutoComplate } from "@/components";
import { useGomakeAxios } from "@/hooks";
import { SettingsIcon } from "@/icons/settings";
import { getDeviceSizeMockApi } from "@/services/api-service/materials/materials-endpoints";
import { useEffect, useState } from "react";

const DropDownListParameterWidget = ({
  parameter,
  clasess,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
  selectedValueConfig,
  inModal,
  setSelectedValueConfig,
  onOpeneMultiParameterModal,
  subSectionParameters,
  list,
  setDeviceCategory,
  setDeviceSize
}: any) => {
  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );
  const { callApi } = useGomakeAxios();


  return (
    <div data-tour={parameter?.id} style={clasess.dropDownListWithSettingIcon}>
      <GoMakeAutoComplate
        options={parameter?.valuesConfigs?.filter(value => {
          return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
        })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)}
        key={parameter?.valuesConfigs + temp[index]?.values}
        placeholder={parameter.name}
        style={clasess.dropDownListStyle}
        getOptionLabel={(option: any) => option.updateName}
        defaultValue={
          index !== -1 ? { updateName: temp[index].values } : defaultObject
        }
        disabled={parameter?.isLock ? parameter?.isLock : false}
        onChange={(e: any, value: any) => {
          if (parameter?.code === "devicecategory") {
            setDeviceCategory(value?.values[0])
          }
          else if (parameter?.code === "devicesize") {
            setDeviceSize(value?.values[0])

          }


          onChangeSubProductsForPrice(
            parameter?.id,
            subSection?.id,
            section?.id,
            parameter?.parameterType,
            parameter?.name,
            parameter?.actionId,
            { valueIds: value?.id, values: value?.updateName },
            subSection?.type,
            index,
            parameter?.actionIndex,
            parameter?.code
          );
        }}
      />
      {parameter?.setSettingIcon && inModal && (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedValueConfig(parameter?.valuesConfigs);
            onOpeneMultiParameterModal(
              parameter,
              subSection,
              section,
              subSectionParameters,
              list
            );
          }}
        >
          <SettingsIcon
            stroke={"rgba(237, 2, 140, 1)"}
            width={24}
            height={24}
          />
        </div>
      )}
    </div>
  );
};

export { DropDownListParameterWidget };
