import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { getAndSetProductById } from "@/services/hooks";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { digitslPriceState } from "./store";
import { useMaterials } from "../use-materials";
import { useQuoteWidget } from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
  SecondSwitch,
} from "@/components";
import { materialsCategoriesState } from "@/store/material-categories";
import { isLoadgingState } from "@/store";

const useDigitalOffsetPrice = ({ clasess }) => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  const [defaultPrice, setDefaultPrice] = useState<any>(30);
  const [makeShapeOpen, setMakeShapeOpen] = useState(false);
  const [chooseShapeOpen, setChooseShapeOpen] = useState(false);
  const [template, setTemplate] = useState<any>([]);
  const [generalParameters, setGeneralParameters] = useState<any>([]);
  const [isRequiredParameters, setIsRequiredParameters] = useState<any>([]);
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
      let tempMockData: any = [...template?.sections];
      let temp = [...generalParameters];
      tempMockData?.map((section, i) => {
        return section?.subSections?.map((subSection, i) => {
          return subSection.parameters
            ?.filter((param) => !param.isHidden)
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
                      ...(defaultValue?.length > 0 && { value: defaultValue }),
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
        });
      });

      setGeneralParameters(temp);
    }
  }, [template]);
  const [digitalPriceData, setDigidatPriceData] =
    useRecoilState<any>(digitslPriceState);
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | false>("panel_0");
  const { allMaterials } = useMaterials();
  const [clientTypeDefaultValue, setClientTypeDefaultValue] = useState<any>({});
  const [clientDefaultValue, setClientDefaultValue] = useState<any>({});
  const { clientTypesValue, renderOptions, checkWhatRenderArray } =
    useQuoteWidget();
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

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const _getParameter = (parameter: any, subSection: any, section: any) => {
    let temp = [...generalParameters];
    const index = temp.findIndex(
      (item) =>
        item.parameterId === parameter?.id &&
        item.sectionId === section?.id &&
        item.subSectionId === subSection?.id
    );

    return temp[index];
  };
  const _renderParameterType = (
    parameter: any,
    subSection: any,
    section: any,
    subSectionParameters
  ) => {
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
          options={parameter?.valuesConfigs?.filter((value) => !value.isHidden)}
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
          options={parameter?.valuesConfigs?.filter((value) => !value.isHidden)}
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
          let valueIdIsDefault = defaultParameter?.materialValueIds[0]?.valueId;
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
                // defaultValue={defailtObjectValue || { value: "" }}
                defaultValue={
                  index !== -1
                    ? { value: temp[index].value }
                    : defailtObjectValue
                }
                getOptionLabel={(option: any) => option.value}
                // value={
                //   index !== -1
                //     ? {
                //         //@ts-ignore
                //         value:
                //           temp[index].value === "undefined"
                //             ? { value: "" }
                //             : temp[index].value,
                //       }
                //     : defailtObjectValue
                // }
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
  };
  const onChangeForPrice = (
    parameterId: any,
    subSectionId: any,
    sectionId: any,
    ParameterType: any,
    parameterName: any,
    actionId: any,
    data: any,
    index
  ) => {
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
  const [activeIndex, setActiveIndex] = useState(0);
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

  const [activeTab, setActiveTab] = useState("Production");
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
  }, [router]);

  useEffect(() => {
    getProductById();
  }, [router]);
  const validateParameters = (inputArray) => {
    let isValid = true;
    for (const item of inputArray) {
      const index = generalParameters.findIndex(
        (par) => par.parameterId === item.id && par?.value?.length
      );
      if (index == -1) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };
  const [pricingDefaultValue, setPricingDefaultValue] = useState<any>();
  const setLoading = useSetRecoilState(isLoadgingState);
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
        },
        false
      );
      setLoading(false);
      setPricingDefaultValue(res?.data?.data?.data?.result);
    }
  }, [generalParameters, router, isRequiredParameters, validateParameters]);

  useEffect(() => {
    calculationProduct();
  }, [generalParameters]);
  const PricingTab = {
    id: "c66465de-95d6-4ea3-bd3f-7efe60f4cb0555",
    name: "Pricing",
    icon: "https://gomake-dev.s3.eu-west-3.amazonaws.com/25fa024c-0586-49aa-a654-ff19c59e0ff7",
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
          itemParmetersValues: generalParameters,
          workFlow: pricingDefaultValue?.workFlows[0],
        },
        actionId: router?.query?.actionId,
        actionProductId: router?.query?.actionProductId,
      },
      false
    );
    if (res?.success) {
      navigate(`/products/profits?actionId=${router?.query?.actionId}`);
    }
  }, [generalParameters, router, pricingDefaultValue]);

  const navigateForRouter = () => {
    if (router?.query?.actionId) {
      createProfitTestCase();
    } else {
      navigate("/quote");
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
  };
};

export { useDigitalOffsetPrice };
