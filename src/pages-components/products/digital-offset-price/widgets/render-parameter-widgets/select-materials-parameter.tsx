import { GoMakeAutoComplate } from "@/components";
import { SettingsIcon } from "@/icons/settings";
import { materialsCategoriesState } from "@/store/material-categories";
import { compareStrings } from "@/utils/constants";
import { useRecoilValue } from "recoil";

const SelectMaterialsParameterWidget = ({
  allMaterials,
  parameter,
  digitalPriceData,
  subSectionParameters,
  clasess,
  index,
  temp,
  inModal,
  subSection,
  section,
  setDigidatPriceData,
  onChangeSubProductsForPrice,
}) => {
  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  let Comp;

  if (allMaterials?.length > 0) {
    const data = materialsEnumsValues.find((item) => {
      return compareStrings(item.name, parameter?.materialPath[0]);
    });

    let valuesConfigs = parameter?.valuesConfigs;
    let isDefaultObj = parameter?.valuesConfigs?.find(
      (item) => item.isDefault === true
    );
    const onChange = (value: any) => {
      if (parameter?.materialPath?.length == 3) {
        onChangeSubProductsForPrice(
          parameter?.id,
          subSection?.id,
          section?.id,
          parameter?.parameterType,
          parameter?.name,
          parameter?.actionId,
          {
            valueIds: value?.valueId,
            values: value?.value,
            ...(data?.id > 0 && { material: data?.id }),
          },
          subSection?.type,
          index,
          parameter?.actionIndex,
          parameter?.code
        );
        setDigidatPriceData({
          ...digitalPriceData,
          selectedMaterialLvl3: value,
          selectedOptionLvl3: value,
        });
      }
      if (parameter?.materialPath?.length == 2) {
        onChangeSubProductsForPrice(
          parameter?.id,
          subSection?.id,
          section?.id,
          parameter?.parameterType,
          parameter?.name,
          parameter?.actionId,
          {
            valueIds: value?.valueId,
            values: value?.value,
            ...(data?.id > 0 && { material: data?.id }),
          },
          subSection?.type,
          index,
          parameter?.actionIndex,
          parameter?.code
        );
        setDigidatPriceData({
          ...digitalPriceData,
          selectedMaterialLvl2: value?.data,
          selectedOptionLvl2: value,
          selectedMaterialLvl3: null,
        });
      }
      if (parameter?.materialPath?.length == 1) {
        onChangeSubProductsForPrice(
          parameter?.id,
          subSection?.id,
          section?.id,
          parameter?.parameterType,
          parameter?.name,
          parameter?.actionId,
          {
            valueIds: value?.valueId,
            values: value?.value,
            ...(data?.id > 0 && { material: data?.id }),
          },
          subSection?.type,
          index,
          parameter?.actionIndex,
          parameter?.code
        );
        setDigidatPriceData({
          ...digitalPriceData,
          selectedMaterialLvl1: value?.data,
          selectedOptionLvl1: value,
          selectedMaterialLvl2: { value: "" },
          selectedMaterialLvl3: { value: "" },
        });
      }
    }
    let options: any = allMaterials;
    let defailtObjectValue = { value: "" };
    if (parameter?.materialPath?.length == 3) {
      options = digitalPriceData?.selectedMaterialLvl2;
    }
    if (parameter?.materialPath?.length == 2) {
      let defsultParameters = subSectionParameters?.find((item) =>
        item.valuesConfigs?.find((item) => item?.isDefault)
      );
      let defaultParameter = defsultParameters?.valuesConfigs?.find(
        (item) => item?.isDefault
      );
      if (parameter.name == "Spiral color") {
      }
      let valueIdIsDefault = defaultParameter?.materialValueIds && defaultParameter?.materialValueIds.length > 0 ? defaultParameter?.materialValueIds[0]?.valueId : null;
      options = digitalPriceData?.selectedMaterialLvl1;
      if (options) {
        const hiddenValueIds = valuesConfigs
          .filter((config) => config.isHidden === true)
          .flatMap((config) => config.materialValueIds.map((id) => id.valueId));
        const filteredOptions = options?.filter(
          (option) => !hiddenValueIds.includes(option.valueId)
        );
        options = filteredOptions;
      }

      if (!!!options) {
        let optionsLvl1 = allMaterials
          ?.find((material) => {
            return compareStrings(
              material.pathName,
              parameter?.materialPath[0]
            );
          })
          ?.data?.find((item) => item?.valueId === valueIdIsDefault);

        options = optionsLvl1?.data || [];
        const hiddenValueIds = valuesConfigs
          .filter((config) => config.isHidden === true)
          .flatMap((config) => config.materialValueIds.map((id) => id.valueId));
        const filteredOptions = options?.filter(
          (option) => !hiddenValueIds.includes(option.valueId)
        );
        options = filteredOptions;
        let x = options?.find(
          (item: any) =>
            item?.valueId === isDefaultObj?.materialValueIds[0]?.valueId
        );
        if (x) {
          defailtObjectValue = x;
        }
      }
    }
    if (parameter?.materialPath?.length == 1) {
      const hiddenValueIds = valuesConfigs
        .filter((config) => config.isHidden === true)
        .flatMap((config) => config.materialValueIds.map((id) => id.valueId));
      options = allMaterials?.find((material: any) => {
        return compareStrings(material.pathName, parameter?.materialPath[0]);
      })?.data;

      const filteredOptions = options?.filter(
        (option) => !hiddenValueIds.includes(option.valueId)
      );
      options = filteredOptions;
      let selectedObj = options?.find(
        (item: any) =>
          item?.valueId === isDefaultObj?.materialValueIds[0]?.valueId
      );
      if (selectedObj) {
        defailtObjectValue = selectedObj;
      }
      //onChange(defailtObjectValue)
    }

    Comp = (
      <>
        {options?.length > 0 && (
          <div style={clasess.dropDownListWithSettingIcon}>
            <GoMakeAutoComplate
              options={options}
              placeholder={parameter.name}
              style={clasess.dropDownListStyle}
              defaultValue={
                index !== -1
                  ? { value: temp[index].values }
                  : defailtObjectValue
              }
              getOptionLabel={(option: any) => option.value}
              onChange={(e, value) => onChange(value)}
            />
            {parameter?.setSettingIcon && inModal && (
              <div style={{ cursor: "pointer" }}>
                <SettingsIcon
                  stroke={"rgba(237, 2, 140, 1)"}
                  width={24}
                  height={24}
                />
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  return <>{Comp}</>;
};

export { SelectMaterialsParameterWidget };
