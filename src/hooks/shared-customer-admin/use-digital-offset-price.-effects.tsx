import { useEffect } from "react";

const useDigitalOffsetPriceEffects = ({
  template,
  isRequiredParameters,
  setIsRequiredParameters,
  materialsEnumsValues,
  setGeneralParameters,
  setSubProducts,
  router,
  setClientTypeDefaultValue,
  setClientDefaultValue,
  clientTypesValue,
  renderOptions,
  clientDefaultValue,
  clientTypeDefaultValue,
  getProductById,
  calculationProduct,
  generalParameters,
}) => {
  useEffect(() => {
    if (template?.sections?.length > 0) {
      let temp = [...isRequiredParameters];
      template?.sections?.map((section) => {
        return section?.subSections?.map((subSection, i) => {
          return subSection.parameters?.map((parameter, i) => {
            const index = temp.findIndex(
              (item) => item.parameterId === parameter?.id
            );
            if (index !== -1) {
              temp[index] = {
                ...temp[index],
              };
            } else {
              if (parameter?.isRequired) {
                temp.push(parameter);
              }
            }
          });
        });
      });
      setIsRequiredParameters(temp);
    }
  }, [template]);
  useEffect(() => {
    if (template?.sections?.length > 0) {
      let sectionData: any = [...template?.sections];
      const newGeneralParameters = [];
      const typeMap = {};
      sectionData.forEach((section) => {
        section.subSections.forEach((subSection) => {
          if (subSection.type) {
            let temp = [];
            subSection.parameters
              .filter((parameter) => !parameter.isHidden)
              .forEach((parameter) => {
                if (
                  parameter?.parameterType === 1 ||
                  parameter?.parameterType === 2 ||
                  parameter?.parameterType === 3
                ) {
                  if (parameter?.defaultValue?.length > 0) {
                    const defaultValue = parameter?.defaultValue;
                    temp.push({
                      parameterId: parameter?.id,
                      parameterName: parameter?.name,
                      actionId: parameter?.actionId,
                      parameterType: parameter?.parameterType,
                      ...(defaultValue?.length > 0 && {
                        value: defaultValue,
                      }),
                      sectionId: section?.id,
                      subSectionId: subSection?.id,
                    });
                  }
                } else if (parameter?.parameterType === 0) {
                  const value = parameter?.valuesConfigs?.find(
                    (item) => item?.isDefault == true
                  );
                  if (value) {
                    const data = materialsEnumsValues.find(
                      (item) => item.name === parameter?.materialPath[0]
                    );
                    temp.push({
                      parameterId: parameter?.id,
                      parameterName: parameter?.name,
                      actionId: parameter?.actionId,
                      ...(data?.id > 0 && { material: data?.id }),
                      parameterType: parameter?.parameterType,
                      ...(value && {
                        valueId: value?.id,
                        value: value?.updateName,
                      }),
                      sectionId: section?.id,
                      subSectionId: subSection?.id,
                    });
                  }
                } else if (parameter?.parameterType === 6) {
                  const defaultObject = parameter.valuesConfigs.find(
                    (item) => item.isDefault === true
                  );
                  parameter?.childsParameters.forEach((parameter) => {
                    const parameterId = parameter.id;
                    if (defaultObject?.values.hasOwnProperty(parameterId)) {
                      parameter.defaultValue =
                        defaultObject?.values[parameterId];
                    }
                  });
                  if (defaultObject) {
                    temp.push({
                      parameterId: parameter?.id,
                      parameterName: parameter?.name,
                      actionId: parameter?.actionId,
                      parameterType: parameter?.parameterType,
                      ...(defaultObject && {
                        valueId: defaultObject?.id,
                        value: defaultObject?.updateName,
                      }),

                      sectionId: section?.id,
                      subSectionId: subSection?.id,
                    });
                    parameter?.childsParameters?.map((item) => {
                      temp.push({
                        parameterId: item?.id,
                        parameterName: item?.name,
                        actionId: item?.actionId,
                        parameterType: item?.parameterType,
                        value: item?.defaultValue,
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                      });
                    });
                  }
                }
              });

            if (temp.length > 0) {
              if (!typeMap[subSection.type]) {
                typeMap[subSection.type] = {
                  type: subSection.type,
                  parameters: temp,
                };
              } else {
                typeMap[subSection.type].parameters.push(...temp);
              }
            }
          } else {
            let temp = [];
            subSection.parameters
              .filter((parameter) => !parameter.isHidden)
              .map((parameter, i) => {
                const index = temp.findIndex(
                  (item) =>
                    item.parameterId === parameter?.id &&
                    item.sectionId === section?.id &&
                    item.subSectionId === subSection?.id
                );
                if (index !== -1) {
                  temp[index] = {
                    ...temp[index],
                  };
                } else {
                  if (
                    parameter?.parameterType === 1 ||
                    parameter?.parameterType === 2 ||
                    parameter?.parameterType === 3
                  ) {
                    if (parameter?.defaultValue?.length > 0) {
                      const defaultValue = parameter?.defaultValue;
                      temp.push({
                        parameterId: parameter?.id,
                        parameterName: parameter?.name,
                        actionId: parameter?.actionId,
                        parameterType: parameter?.parameterType,
                        ...(defaultValue?.length > 0 && {
                          value: defaultValue,
                        }),
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                      });
                    }
                  } else if (parameter?.parameterType === 0) {
                    const value = parameter?.valuesConfigs?.find(
                      (item) => item?.isDefault == true
                    );
                    if (value) {
                      const data = materialsEnumsValues.find(
                        (item) => item.name === parameter?.materialPath[0]
                      );
                      temp.push({
                        parameterId: parameter?.id,
                        parameterName: parameter?.name,
                        actionId: parameter?.actionId,
                        ...(data?.id > 0 && { material: data?.id }),
                        parameterType: parameter?.parameterType,
                        ...(value && {
                          valueId: value?.id,
                          value: value?.updateName,
                        }),
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                      });
                    }
                  } else if (parameter?.parameterType === 6) {
                    const defaultObject = parameter.valuesConfigs.find(
                      (item) => item.isDefault === true
                    );
                    parameter?.childsParameters.forEach((parameter) => {
                      const parameterId = parameter.id;
                      if (defaultObject?.values.hasOwnProperty(parameterId)) {
                        parameter.defaultValue =
                          defaultObject?.values[parameterId];
                      }
                    });
                    if (defaultObject) {
                      temp.push({
                        parameterId: parameter?.id,
                        parameterName: parameter?.name,
                        actionId: parameter?.actionId,
                        parameterType: parameter?.parameterType,
                        ...(defaultObject && {
                          valueId: defaultObject?.id,
                          value: defaultObject?.updateName,
                        }),

                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                      });
                      parameter?.childsParameters?.map((item) => {
                        temp.push({
                          parameterId: item?.id,
                          parameterName: item?.name,
                          actionId: item?.actionId,
                          parameterType: item?.parameterType,
                          value: item?.defaultValue,
                          sectionId: section?.id,
                          subSectionId: subSection?.id,
                        });
                      });
                    }
                  }
                }
              });
            newGeneralParameters.push(...temp);
          }
        });
      });
      const newSubProducts2 = Object.values(typeMap);
      setGeneralParameters(newGeneralParameters);
      setSubProducts(newSubProducts2);
    }
  }, [template]);

  useEffect(() => {
    if (router?.query?.clientTypeId) {
      setClientTypeDefaultValue(
        clientTypesValue.find(
          (item: any) => item?.id === router?.query?.clientTypeId
        )
      );
    }

    if (router?.query?.customerId) {
      setClientDefaultValue(
        renderOptions().find(
          (item: any) => item?.id === router?.query?.customerId
        )
      );
    }
  }, [
    clientTypesValue,
    clientDefaultValue,
    clientTypeDefaultValue,
    router,
    router?.query?.customerId,
    renderOptions,
  ]);

  useEffect(() => {
    getProductById();
  }, [router]);
  useEffect(() => {
    calculationProduct();
  }, [generalParameters]);
  return {};
};

export { useDigitalOffsetPriceEffects };
