import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import { useQuoteWidget } from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
import { materialsCategoriesState } from "@/store/material-categories";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import {
  getAndSetProductById,
  getAndSetgetProductQuoteItemById,
} from "@/services/hooks";
import { isLoadgingState } from "@/store";
import { useMaterials } from "../use-materials";
import { digitslPriceState } from "./store";

import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
  SecondSwitch,
} from "@/components";
import { userProfileState } from "@/store/user-profile";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";

const useDigitalOffsetPrice = ({ clasess, widgetType }) => {
  const { navigate } = useGomakeRouter();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const router = useRouter();

  const { clientTypesValue, renderOptions, checkWhatRenderArray } =
    useQuoteWidget();
  const { allMaterials } = useMaterials();
  const userProfile = useRecoilValue(userProfileState);

  const [isRequiredParameters, setIsRequiredParameters] = useState<any>([]);
  const [generalParameters, setGeneralParameters] = useState<any>([]);
  const [chooseShapeOpen, setChooseShapeOpen] = useState(false);
  const [defaultPrice, setDefaultPrice] = useState<any>(30);
  const [makeShapeOpen, setMakeShapeOpen] = useState(false);
  const [template, setTemplate] = useState<any>([]);
  const [urgentOrder, setUrgentOrder] = useState(false);
  const [printingNotes, setPrintingNotes] = useState("");
  const [graphicNotes, setGraphicNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [subProducts, setSubProducts] = useState<any>([]);
  const [subProductsWithType, setSubProductsWithType] = useState<any>([]);
  const [itemParmetersValues, setItemParmetersValues] = useState<any>([]);
  const [clientDefaultValue, setClientDefaultValue] = useState<any>({});
  const [clientTypeDefaultValue, setClientTypeDefaultValue] = useState<any>({});
  const [expanded, setExpanded] = useState<string | false>("panel_0");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Production");
  const [pricingDefaultValue, setPricingDefaultValue] = useState<any>();
  const [workFlowSelected, setWorkFlowSelected] = useState<any>();
  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  const setLoading = useSetRecoilState(isLoadgingState);
  const [digitalPriceData, setDigidatPriceData] =
    useRecoilState<any>(digitslPriceState);
  const [priceRecovery, setPriceRecovery] = useState(true);
  const [canCalculation, setCanCalculation] = useState(true);

  useEffect(() => {
    if (pricingDefaultValue?.workFlows?.length > 0) {
      const workFlowSelect = pricingDefaultValue?.workFlows?.find(
        (workFlow) => workFlow?.selected === true
      );
      setWorkFlowSelected(workFlowSelect);
    }
  }, [pricingDefaultValue]);
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
                      actionId:
                        value?.activateAction === true
                          ? parameter?.actionId
                          : null,
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
                  } else if (parameter?.parameterType === 5) {
                    const value = parameter?.valuesConfigs?.find(
                      (item) => item?.isDefault == true
                    );

                    if (value) {
                      const data = materialsEnumsValues.find(
                        (item) => item.name === parameter?.materialPath[0]
                      );
                      let options: any = allMaterials;
                      let selectedObj: any = {};
                      if (allMaterials?.length > 0) {
                        if (parameter?.materialPath?.length == 1) {
                          options = allMaterials?.find((material: any) => {
                            return (
                              material.pathName === parameter?.materialPath[0]
                            );
                          })?.data;
                          selectedObj = options?.find(
                            (item: any) =>
                              item?.valueId ===
                              value?.materialValueIds[0]?.valueId
                          );
                          temp.push({
                            parameterId: parameter?.id,
                            parameterName: parameter?.name,
                            actionId: parameter?.actionId,
                            ...(data?.id > 0 && { material: data?.id }),
                            parameterType: parameter?.parameterType,
                            ...(value && {
                              valueId: value?.materialValueIds[0]?.valueId,
                              value: selectedObj?.value,
                            }),
                            sectionId: section?.id,
                            subSectionId: subSection?.id,
                          });
                        }

                        if (parameter?.materialPath?.length == 2) {
                          options = allMaterials?.find((material: any) => {
                            return (
                              material.pathName === parameter?.materialPath[0]
                            );
                          })?.data;
                          const mergedDataArray = options.reduce(
                            (result, obj) => {
                              if (obj.data && Array.isArray(obj.data)) {
                                result = result.concat(obj.data);
                              }
                              return result;
                            },
                            []
                          );
                          selectedObj = mergedDataArray?.find(
                            (item: any) =>
                              item?.valueId ===
                              value?.materialValueIds[0]?.valueId
                          );
                          temp.push({
                            parameterId: parameter?.id,
                            parameterName: parameter?.name,
                            actionId: parameter?.actionId,
                            ...(data?.id > 0 && { material: data?.id }),
                            parameterType: parameter?.parameterType,
                            ...(value && {
                              valueId: value?.materialValueIds[0]?.valueId,
                              value: selectedObj?.value,
                            }),
                            sectionId: section?.id,
                            subSectionId: subSection?.id,
                          });
                        }
                      }
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

                        actionId:
                          value?.activateAction === true
                            ? parameter?.actionId
                            : null,
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
  }, [template, materialsEnumsValues, allMaterials]);

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
    if (
      widgetType === EWidgetProductType.EDIT ||
      widgetType === EWidgetProductType.DUPLICATE
    ) {
      getProductQuoteItemById();
    } else {
      getProductById();
    }
  }, [router, widgetType]);
  useEffect(() => {
    if (canCalculation) {
      calculationProduct();
    }
  }, [generalParameters, canCalculation]);

  useEffect(() => {
    let temp = [...subProducts];
    const result = [];
    temp.forEach((item) => {
      const subProductType = item.type;
      item.parameters.forEach((parameter) => {
        parameter.subProductType = subProductType;
        result.push(parameter);
      });
    });
    setSubProductsWithType(result);
  }, [subProducts]);

  useEffect(() => {
    let temp = [...generalParameters, ...subProductsWithType];
    setItemParmetersValues(temp);
  }, [generalParameters, subProductsWithType, subProducts]);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const _getParameter = (parameter: any, subSection: any, section: any) => {
    if (subSection?.type) {
      const allParameters = subProducts.flatMap((item) => item.parameters);
      let temp = [...allParameters];
      const index = temp.findIndex(
        (item) =>
          item?.parameterId === parameter?.id &&
          item?.sectionId === section?.id &&
          item?.subSectionId === subSection?.id
      );

      return temp[index];
    } else {
      let temp = [...generalParameters];
      const index = temp.findIndex(
        (item) =>
          item.parameterId === parameter?.id &&
          item.sectionId === section?.id &&
          item.subSectionId === subSection?.id
      );

      return temp[index];
    }
  };
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
                value?.activateAction === true ? parameter?.actionId : null,
                {
                  valueId: value?.id,
                  value: value?.updateName,
                  actionId:
                    value?.activateAction === true ? parameter?.actionId : null,
                },
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
  const onChangeForPrice = (
    parameterId: any,
    subSectionId: any,
    sectionId: any,
    ParameterType: any,
    parameterName: any,
    actionId: any,
    data: any,
    index: any
  ) => {
    setCanCalculation(true);
    setGeneralParameters((prev) => {
      let temp = [...prev];
      if (index !== -1) {
        temp[index] = {
          ...temp[index],
          ...data,
        };
      } else {
        temp.push({
          parameterId: parameterId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          ParameterType: ParameterType,
          parameterName: parameterName,
          actionId: actionId,
          ...data,
        });
      }

      return temp;
    });
  };
  const onChangeSubProductsForPrice = (
    parameterId: any,
    subSectionId: any,
    sectionId: any,
    ParameterType: any,
    parameterName: any,
    actionId: any,
    data: any,
    subSectionType: any,
    index: any
  ) => {
    setCanCalculation(true);
    const targetSubProduct = subProducts.find(
      (item) => item.type === subSectionType
    );
    if (targetSubProduct) {
      let temp = [...targetSubProduct.parameters];
      if (index !== -1) {
        temp[index] = {
          ...temp[index],
          ...data,
        };
      } else {
        temp.push({
          parameterId: parameterId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          ParameterType: ParameterType,
          parameterName: parameterName,
          actionId: actionId,
          ...data,
        });
      }
      let temp2 = [...subProducts];
      const index2 = subProducts.findIndex(
        (item) => item.type === subSectionType
      );
      (temp2[index2] = {
        type: subSectionType,
        parameters: temp,
      }),
        setSubProducts(temp2);
    } else {
      let temp = [];
      if (index !== -1) {
        temp[index] = {
          ...temp[index],
          ...data,
        };
      } else {
        temp.push({
          parameterId: parameterId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          ParameterType: ParameterType,
          parameterName: parameterName,
          actionId: actionId,
          ...data,
        });
      }
      setSubProducts([
        ...subProducts,
        {
          type: subSectionType,
          parameters: temp,
        },
      ]);
    }
  };
  const onCloseMakeShape = () => {
    setMakeShapeOpen(false);
  };
  const onCloseChooseShape = () => {
    setChooseShapeOpen(false);
  };
  const onOpeneMakeShape = () => {
    setMakeShapeOpen(true);
  };
  const onOpeneChooseShape = () => {
    setChooseShapeOpen(true);
  };
  const handleTabClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };
  const handleNextClick = () => {
    if (activeIndex < template.sections.length) {
      setActiveIndex(activeIndex + 1);
    }
  };
  const handlePreviousClick = () => {
    if (activeIndex != 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const onClickProductionTab = () => {
    setActiveTab("Production");
  };
  const onClickGraphicDesignTab = () => {
    setActiveTab("Graphic design");
  };
  const tabs = [
    {
      name: "Production",
      onclick: () => onClickProductionTab,
    },
    {
      name: "Graphic design",
      onclick: () => onClickGraphicDesignTab,
    },
  ];

  const getProductById = useCallback(async () => {
    await getAndSetProductById(callApi, setTemplate, {
      Id: router?.query?.productId,
    });
  }, [router, widgetType]);

  const getProductQuoteItemById = useCallback(async () => {
    await getAndSetgetProductQuoteItemById(callApi, setTemplate, {
      QuoteItemId: router?.query?.quoteItem,
    });
  }, [router]);

  const validateParameters = (inputArray) => {
    let isValid = true;
    const allParameters = subProducts.flatMap((item) => item.parameters);
    for (const item of inputArray) {
      const index = [...generalParameters, ...allParameters].findIndex(
        (par) => par.parameterId === item.id && par?.value?.length
      );
      if (index == -1) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const calculationProduct = useCallback(async () => {
    let checkParameter = validateParameters(isRequiredParameters);
    if (!!checkParameter) {
      setLoading(true);
      const res = await callApi(
        "POST",
        `/v1/calculation-service/calculations/calculate-product`,
        {
          clientId: router?.query?.customerId,
          clientTypeId: router?.query?.clientTypeId,
          productId: router?.query?.productId,
          generalParameters: generalParameters,
          subProducts: subProducts,
        },
        false
      );
      //Check it is work
      if (res?.success) {
        setPricingDefaultValue(res?.data?.data?.data);
      }
      setLoading(false);
    }
  }, [generalParameters, router, isRequiredParameters, validateParameters]);

  const PricingTab = {
    id: "c66465de-95d6-4ea3-bd3f-7efe60f4cb0555",
    name: "Pricing",
    icon: "pricing",
    jobDetails: pricingDefaultValue?.jobDetails,
    actions: pricingDefaultValue?.actions,
    flows: pricingDefaultValue?.workFlows,
  };
  const createProfitTestCase = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/printhouse-config/profits/create-profit-test-case?systemID=2`,
      {
        clientId: router?.query?.customerId,
        clientTypeId: router?.query?.clientTypeId,
        generalParameters: generalParameters,
        productItemDTO: {
          productId: router?.query?.productId,
          details: pricingDefaultValue?.jobDetails,
          itemParmetersValues: itemParmetersValues,
          workFlow: workFlowSelected,
        },
        actionId: router?.query?.actionId,
        actionProductId: router?.query?.actionProductId,
      },
      false
    );
    if (res?.success) {
      navigate(`/products/profits?actionId=${router?.query?.actionId}`);
    }
  }, [
    generalParameters,
    router,
    pricingDefaultValue,
    itemParmetersValues,
    workFlowSelected,
  ]);
  const quantity = generalParameters?.find(
    (item) => item?.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
  );
  const addItemForQuotes = useCallback(async () => {
    const res = await callApi("POST", `/v1/erp-service/quote/add-item`, {
      productId: router?.query?.productId,
      userID: userProfile?.id,
      customerID: router?.query?.customerId,
      clientTypeId: router?.query?.clientTypeId,
      unitPrice: defaultPrice / quantity?.value,
      amount: quantity?.value,
      isNeedGraphics: false,
      isUrgentWork: urgentOrder,
      printingNotes,
      graphicNotes,
      isNeedExample: false,
      jobDetails: pricingDefaultValue?.jobDetails,
      itemParmetersValues: itemParmetersValues,
      workFlow: pricingDefaultValue?.workFlows,
      actions: pricingDefaultValue?.actions,
    });
    if (res?.success) {
      navigate("/quote");
    }
  }, [
    router,
    pricingDefaultValue,
    quantity,
    urgentOrder,
    graphicNotes,
    printingNotes,
    userProfile,
    itemParmetersValues,
    defaultPrice,
    workFlowSelected,
  ]);
  useEffect(() => {
    if (
      widgetType === EWidgetProductType.EDIT ||
      widgetType === EWidgetProductType.DUPLICATE
    ) {
      setUrgentOrder(!!template?.quoteItem?.isUrgentWork);
      setPrintingNotes(template?.quoteItem?.printingNotes);
      setGraphicNotes(template?.quoteItem?.graphicNotes);
      setDefaultPrice(template?.quoteItem?.unitPrice * quantity?.value);
      setCanCalculation(false);
      const workFlowSelect = template?.workFlows?.find(
        (workFlow) => workFlow?.selected === true
      );
      setWorkFlowSelected(workFlowSelect);
    }
  }, [widgetType, template, quantity]);
  const updateQuoteItem = useCallback(async () => {
    const res = await callApi(
      "PUT",
      `/v1/erp-service/quote/update-quote-item`,
      {
        quoteItemId: router?.query?.quoteItem,
        productId: router?.query?.productId,
        userID: userProfile?.id,
        customerID: router?.query?.customerId,
        clientTypeId: router?.query?.clientTypeId,
        unitPrice: defaultPrice?.toFixed(2) / quantity?.value,
        amount: quantity?.value,
        isNeedGraphics: false,
        isUrgentWork: urgentOrder,
        printingNotes,
        graphicNotes,
        isNeedExample: false,
        jobDetails: pricingDefaultValue?.jobDetails,
        itemParmetersValues: itemParmetersValues,
        workFlow: pricingDefaultValue?.workFlow,
        actions: pricingDefaultValue?.actions,
      }
    );
    if (res?.success) {
      navigate("/quote");
    }
  }, [
    itemParmetersValues,
    router,
    pricingDefaultValue,
    quantity,
    urgentOrder,
    graphicNotes,
    printingNotes,
    userProfile,
    workFlowSelected,
    defaultPrice,
  ]);
  const navigateForRouter = () => {
    let checkParameter = validateParameters(isRequiredParameters);
    if (!!checkParameter) {
      setErrorMsg("");
      if (router?.query?.actionId) {
        createProfitTestCase();
      } else {
        addItemForQuotes();
      }
    } else {
      setErrorMsg("Please enter all required parameters");
    }
  };

  return {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    onOpeneChooseShape,
    onOpeneMakeShape,
    onCloseChooseShape,
    onCloseMakeShape,
    setDefaultPrice,
    onChangeForPrice,
    handleChange,
    _renderParameterType,
    _getParameter,
    createProfitTestCase,
    renderOptions,
    checkWhatRenderArray,
    navigate,
    navigateForRouter,
    updateQuoteItem,
    setUrgentOrder,
    setPrintingNotes,
    setGraphicNotes,
    setPriceRecovery,
    priceRecovery,
    graphicNotes,
    printingNotes,
    urgentOrder,
    defaultPrice,
    makeShapeOpen,
    chooseShapeOpen,
    activeIndex,
    template,
    tabs,
    activeTab,
    PricingTab,
    expanded,
    clientDefaultValue,
    clientTypeDefaultValue,
    clientTypesValue,
    pricingDefaultValue,
    errorMsg,
    generalParameters,
    workFlowSelected,
  };
};

export { useDigitalOffsetPrice };
