import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
  SecondSwitch,
} from "@/components";

const useRenderParameterTypes = ({
  clasess,
  subProducts,
  onChangeSubProductsForPrice,
  setGeneralParameters,
  onOpeneChooseShape,
  allMaterials,
  materialsEnumsValues,
  digitalPriceData,
  setDigidatPriceData,
  generalParameters,
  onChangeForPrice,
}) => {
  const _renderParameterType = (
    parameter: any,
    subSection: any,
    section: any,
    subSectionParameters
  ) => {
    if (subSection?.type) {
      const allParameters = subProducts.flatMap((item) => item.parameters);
      let temp = [...allParameters];
      const index = temp.findIndex(
        (item) =>
          item.parameterId === parameter?.id &&
          item.sectionId === section?.id &&
          item.subSectionId === subSection?.id
      );
      if (parameter?.parameterType === 1) {
        return (
          <GomakeTextInput
            style={clasess.textInputStyle}
            defaultValue={parameter.defaultValue}
            placeholder={parameter.name}
            value={index !== -1 ? temp[index].value : ""}
            onChange={(e: any, item: any) =>
              onChangeSubProductsForPrice(
                parameter?.id,
                subSection?.id,
                section?.id,
                parameter?.parameterType,
                parameter?.name,
                parameter?.actionId,
                { value: e.target.value },
                subSection?.type,
                index
              )
            }
            type="number"
          />
        );
      } else if (parameter?.parameterType === 2) {
        return (
          <GomakeTextInput
            style={clasess.textInputStyle}
            defaultValue={parameter.defaultValue}
            placeholder={parameter.name}
            onChange={(e: any, value: any) =>
              onChangeSubProductsForPrice(
                parameter?.id,
                subSection?.id,
                section?.id,
                parameter?.parameterType,
                parameter?.name,
                parameter?.actionId,
                { value: e.target.value },
                subSection?.type,
                index
              )
            }
            value={index !== -1 ? temp[index].value : ""}
            type="text"
          />
        );
      } else if (parameter?.parameterType === 0) {
        const defaultObject = parameter.valuesConfigs.find(
          (item) => item.isDefault === true
        );
        return (
          <GoMakeAutoComplate
            options={parameter?.valuesConfigs?.filter(
              (value) => !value.isHidden
            )}
            placeholder={parameter.name}
            style={clasess.dropDownListStyle}
            getOptionLabel={(option: any) => option.updateName}
            defaultValue={
              index !== -1 ? { updateName: temp[index].value } : defaultObject
            }
            onChange={(e: any, value: any) => {
              onChangeSubProductsForPrice(
                parameter?.id,
                subSection?.id,
                section?.id,
                parameter?.parameterType,
                parameter?.name,
                parameter?.actionId,
                { valueId: value?.id, value: value?.updateName },
                subSection?.type,
                index
              );
            }}
          />
        );
      } else if (parameter?.parameterType === 6) {
        const defaultObject = parameter.valuesConfigs.find(
          (item) => item.isDefault === true
        );
        return (
          <GoMakeAutoComplate
            options={parameter?.valuesConfigs?.filter(
              (value) => !value.isHidden
            )}
            placeholder={parameter.name}
            style={clasess.dropDownListStyle}
            getOptionLabel={(option: any) => option.updateName}
            defaultValue={
              index !== -1 ? { updateName: temp[index].value } : defaultObject
            }
            onChange={(e: any, value: any) => {
              onChangeSubProductsForPrice(
                parameter?.id,
                subSection?.id,
                section?.id,
                parameter?.parameterType,
                parameter?.name,
                parameter?.actionId,
                { valueId: value?.id, value: value?.updateName },
                subSection?.type,
                index
              );
              setGeneralParameters((prev) => {
                let temp = [...prev];
                parameter?.childsParameters.forEach((parameter) => {
                  const parameterId = parameter.id;
                  if (value?.values.hasOwnProperty(parameterId)) {
                    const index = temp.findIndex(
                      (item) =>
                        item.parameterId === parameter?.id &&
                        item.sectionId === section?.id &&
                        item.subSectionId === subSection?.id
                    );

                    if (index !== -1) {
                      temp[index] = {
                        ...temp[index],
                        value: value?.values[parameterId],
                      };
                    } else {
                      temp.push({
                        parameterId: parameter?.id,
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                        ParameterType: parameter?.parameterType,
                        value: value?.values[parameterId],
                      });
                    }
                  }
                });

                return temp;
              });
            }}
          />
        );
      } else if (parameter?.parameterType === 3) {
        return (
          <SecondSwitch
            defaultChecked={parameter?.defaultValue === "true"}
            checked={
              index !== -1 ? (temp[index].value === "true" ? true : false) : ""
            }
            onChange={(e: any, value: any) =>
              onChangeSubProductsForPrice(
                parameter?.id,
                subSection?.id,
                section?.id,
                parameter?.parameterType,
                parameter?.name,
                parameter?.actionId,
                { value: value?.toString() },
                subSection?.type,
                index
              )
            }
          />
        );
      } else if (parameter?.parameterType === 4) {
        return (
          <GomakePrimaryButton
            style={clasess.dynamicBtn}
            onClick={onOpeneChooseShape}
          >
            {parameter?.name}
          </GomakePrimaryButton>
        );
      } else if (parameter?.parameterType === 5) {
        if (allMaterials?.length > 0) {
          const data = materialsEnumsValues.find(
            (item) => item.name === parameter?.materialPath[0]
          );
          let valuesConfigs = parameter?.valuesConfigs;
          let isDefaultObj = parameter?.valuesConfigs?.find(
            (item) => item.isDefault === true
          );
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
            let valueIdIsDefault =
              defaultParameter?.materialValueIds[0]?.valueId;
            options = digitalPriceData?.selectedMaterialLvl1;
            if (options) {
              const hiddenValueIds = valuesConfigs
                .filter((config) => config.isHidden === true)
                .flatMap((config) =>
                  config.materialValueIds.map((id) => id.valueId)
                );
              const filteredOptions = options?.filter(
                (option) => !hiddenValueIds.includes(option.valueId)
              );
              options = filteredOptions;
            }

            if (!!!options) {
              let optionsLvl1 = allMaterials
                ?.find((material) => {
                  return material.pathName === parameter?.materialPath[0];
                })
                ?.data?.find((item) => item?.valueId === valueIdIsDefault);
              options = optionsLvl1?.data || [];
              const hiddenValueIds = valuesConfigs
                .filter((config) => config.isHidden === true)
                .flatMap((config) =>
                  config.materialValueIds.map((id) => id.valueId)
                );
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
              .flatMap((config) =>
                config.materialValueIds.map((id) => id.valueId)
              );
            options = allMaterials?.find((material: any) => {
              return material.pathName === parameter?.materialPath[0];
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
          }
          return (
            <>
              {options?.length > 0 && (
                <GoMakeAutoComplate
                  options={options}
                  placeholder={parameter.name}
                  style={clasess.dropDownListStyle}
                  defaultValue={
                    index !== -1
                      ? { value: temp[index].value }
                      : defailtObjectValue
                  }
                  getOptionLabel={(option: any) => option.value}
                  onChange={(e: any, value: any) => {
                    if (parameter?.materialPath?.length == 3) {
                      onChangeSubProductsForPrice(
                        parameter?.id,
                        subSection?.id,
                        section?.id,
                        parameter?.parameterType,
                        parameter?.name,
                        parameter?.actionId,
                        {
                          valueId: value?.valueId,
                          value: value?.value,
                          ...(data?.id > 0 && { material: data?.id }),
                        },
                        subSection?.type,
                        index
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
                          valueId: value?.valueId,
                          value: value?.value,
                          ...(data?.id > 0 && { material: data?.id }),
                        },
                        subSection?.type,
                        index
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
                          valueId: value?.valueId,
                          value: value?.value,
                          ...(data?.id > 0 && { material: data?.id }),
                        },
                        subSection?.type,
                        index
                      );
                      setDigidatPriceData({
                        ...digitalPriceData,
                        selectedMaterialLvl1: value?.data,
                        selectedOptionLvl1: value,
                        selectedMaterialLvl2: { value: "" },
                        selectedMaterialLvl3: { value: "" },
                      });
                    }
                  }}
                />
              )}
            </>
          );
        }
      }
    } else {
      let temp = [...generalParameters];
      const index = temp.findIndex(
        (item) =>
          item.parameterId === parameter?.id &&
          item.sectionId === section?.id &&
          item.subSectionId === subSection?.id
      );
      if (parameter?.parameterType === 1) {
        return (
          <GomakeTextInput
            style={clasess.textInputStyle}
            defaultValue={parameter.defaultValue}
            placeholder={parameter.name}
            value={index !== -1 ? temp[index].value : ""}
            onChange={(e: any, item: any) =>
              onChangeForPrice(
                parameter?.id,
                subSection?.id,
                section?.id,
                parameter?.parameterType,
                parameter?.name,
                parameter?.actionId,
                { value: e.target.value },
                index
              )
            }
            type="number"
          />
        );
      } else if (parameter?.parameterType === 2) {
        return (
          <GomakeTextInput
            style={clasess.textInputStyle}
            defaultValue={parameter.defaultValue}
            placeholder={parameter.name}
            onChange={(e: any, value: any) =>
              onChangeForPrice(
                parameter?.id,
                subSection?.id,
                section?.id,
                parameter?.parameterType,
                parameter?.name,
                parameter?.actionId,
                { value: e.target.value },
                index
              )
            }
            value={index !== -1 ? temp[index].value : ""}
            type="text"
          />
        );
      } else if (parameter?.parameterType === 0) {
        const defaultObject = parameter.valuesConfigs.find(
          (item) => item.isDefault === true
        );
        return (
          <GoMakeAutoComplate
            options={parameter?.valuesConfigs?.filter(
              (value) => !value.isHidden
            )}
            placeholder={parameter.name}
            style={clasess.dropDownListStyle}
            getOptionLabel={(option: any) => option.updateName}
            defaultValue={
              index !== -1 ? { updateName: temp[index].value } : defaultObject
            }
            onChange={(e: any, value: any) => {
              onChangeForPrice(
                parameter?.id,
                subSection?.id,
                section?.id,
                parameter?.parameterType,
                parameter?.name,
                parameter?.actionId,
                { valueId: value?.id, value: value?.updateName },
                index
              );
            }}
          />
        );
      } else if (parameter?.parameterType === 6) {
        const defaultObject = parameter.valuesConfigs.find(
          (item) => item.isDefault === true
        );
        return (
          <GoMakeAutoComplate
            options={parameter?.valuesConfigs?.filter(
              (value) => !value.isHidden
            )}
            placeholder={parameter.name}
            style={clasess.dropDownListStyle}
            getOptionLabel={(option: any) => option.updateName}
            defaultValue={
              index !== -1 ? { updateName: temp[index].value } : defaultObject
            }
            onChange={(e: any, value: any) => {
              onChangeForPrice(
                parameter?.id,
                subSection?.id,
                section?.id,
                parameter?.parameterType,
                parameter?.name,
                parameter?.actionId,
                { valueId: value?.id, value: value?.updateName },
                index
              );
              setGeneralParameters((prev) => {
                let temp = [...prev];
                parameter?.childsParameters.forEach((parameter) => {
                  const parameterId = parameter.id;
                  if (value?.values.hasOwnProperty(parameterId)) {
                    const index = temp.findIndex(
                      (item) =>
                        item.parameterId === parameter?.id &&
                        item.sectionId === section?.id &&
                        item.subSectionId === subSection?.id
                    );

                    if (index !== -1) {
                      temp[index] = {
                        ...temp[index],
                        value: value?.values[parameterId],
                      };
                    } else {
                      temp.push({
                        parameterId: parameter?.id,
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                        ParameterType: parameter?.parameterType,
                        value: value?.values[parameterId],
                      });
                    }
                  }
                });

                return temp;
              });
            }}
          />
        );
      } else if (parameter?.parameterType === 3) {
        return (
          <SecondSwitch
            defaultChecked={parameter?.defaultValue === "true"}
            checked={
              index !== -1 ? (temp[index].value === "true" ? true : false) : ""
            }
            onChange={(e: any, value: any) =>
              onChangeForPrice(
                parameter?.id,
                subSection?.id,
                section?.id,
                parameter?.parameterType,
                parameter?.name,
                parameter?.actionId,
                { value: value?.toString() },
                index
              )
            }
          />
        );
      } else if (parameter?.parameterType === 4) {
        return (
          <GomakePrimaryButton
            style={clasess.dynamicBtn}
            onClick={onOpeneChooseShape}
          >
            {parameter?.name}
          </GomakePrimaryButton>
        );
      } else if (parameter?.parameterType === 5) {
        if (allMaterials?.length > 0) {
          const data = materialsEnumsValues.find(
            (item) => item.name === parameter?.materialPath[0]
          );
          let valuesConfigs = parameter?.valuesConfigs;
          let isDefaultObj = parameter?.valuesConfigs?.find(
            (item) => item.isDefault === true
          );
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
            let valueIdIsDefault =
              defaultParameter?.materialValueIds[0]?.valueId;
            options = digitalPriceData?.selectedMaterialLvl1;
            if (options) {
              const hiddenValueIds = valuesConfigs
                .filter((config) => config.isHidden === true)
                .flatMap((config) =>
                  config.materialValueIds.map((id) => id.valueId)
                );
              const filteredOptions = options?.filter(
                (option) => !hiddenValueIds.includes(option.valueId)
              );
              options = filteredOptions;
            }

            if (!!!options) {
              let optionsLvl1 = allMaterials
                ?.find((material) => {
                  return material.pathName === parameter?.materialPath[0];
                })
                ?.data?.find((item) => item?.valueId === valueIdIsDefault);
              options = optionsLvl1?.data || [];
              const hiddenValueIds = valuesConfigs
                .filter((config) => config.isHidden === true)
                .flatMap((config) =>
                  config.materialValueIds.map((id) => id.valueId)
                );
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
              .flatMap((config) =>
                config.materialValueIds.map((id) => id.valueId)
              );
            options = allMaterials?.find((material: any) => {
              return material.pathName === parameter?.materialPath[0];
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
          }
          return (
            <>
              {options?.length > 0 && (
                <GoMakeAutoComplate
                  options={options}
                  placeholder={parameter.name}
                  style={clasess.dropDownListStyle}
                  defaultValue={
                    index !== -1
                      ? { value: temp[index].value }
                      : defailtObjectValue
                  }
                  getOptionLabel={(option: any) => option.value}
                  onChange={(e: any, value: any) => {
                    if (parameter?.materialPath?.length == 3) {
                      onChangeForPrice(
                        parameter?.id,
                        subSection?.id,
                        section?.id,
                        parameter?.parameterType,
                        parameter?.name,
                        parameter?.actionId,
                        {
                          valueId: value?.valueId,
                          value: value?.value,
                          ...(data?.id > 0 && { material: data?.id }),
                        },
                        index
                      );
                      setDigidatPriceData({
                        ...digitalPriceData,
                        selectedMaterialLvl3: value,
                        selectedOptionLvl3: value,
                      });
                    }
                    if (parameter?.materialPath?.length == 2) {
                      onChangeForPrice(
                        parameter?.id,
                        subSection?.id,
                        section?.id,
                        parameter?.parameterType,
                        parameter?.name,
                        parameter?.actionId,
                        {
                          valueId: value?.valueId,
                          value: value?.value,
                          ...(data?.id > 0 && { material: data?.id }),
                        },
                        index
                      );
                      setDigidatPriceData({
                        ...digitalPriceData,
                        selectedMaterialLvl2: value?.data,
                        selectedOptionLvl2: value,
                        selectedMaterialLvl3: null,
                      });
                    }
                    if (parameter?.materialPath?.length == 1) {
                      onChangeForPrice(
                        parameter?.id,
                        subSection?.id,
                        section?.id,
                        parameter?.parameterType,
                        parameter?.name,
                        parameter?.actionId,
                        {
                          valueId: value?.valueId,
                          value: value?.value,
                          ...(data?.id > 0 && { material: data?.id }),
                        },
                        index
                      );
                      setDigidatPriceData({
                        ...digitalPriceData,
                        selectedMaterialLvl1: value?.data,
                        selectedOptionLvl1: value,
                        selectedMaterialLvl2: { value: "" },
                        selectedMaterialLvl3: { value: "" },
                      });
                    }
                  }}
                />
              )}
            </>
          );
        }
      }
    }
  };
  return { _renderParameterType };
};

export { useRenderParameterTypes };
