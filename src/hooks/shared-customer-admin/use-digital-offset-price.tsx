import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { getAndSetProductById } from "@/services/hooks";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
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

const useDigitalOffsetPrice = ({ clasess }) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  const [defaultPrice, setDefaultPrice] = useState<any>(30);
  const [makeShapeOpen, setMakeShapeOpen] = useState(false);
  const [chooseShapeOpen, setChooseShapeOpen] = useState(false);
  const [template, setTemplate] = useState<any>([]);
  const [generalParameters, setGeneralParameters] = useState<any>([]);
  const [isRequiredParameters, setIsRequiredParameters] = useState<any>([]);
  console.log("generalParameters", generalParameters);
  useEffect(() => {
    if (template?.sections?.length > 0) {
      template?.sections?.map((section) => {});
    }
  }, []);
  useEffect(() => {
    if (template?.sections?.length > 0) {
      let tempMockData: any = [...template?.sections];
      let temp = [...generalParameters];
      tempMockData?.map((section, i) => {
        return section?.subSections?.map((subSection, i) => {
          return subSection.parameters?.map((parameter, i) => {
            // var requiredObjects = parameter.filter(function(obj) {
            //   return obj.isRequired === true;
            // });
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
                    parameter.defaultValue = defaultObject?.values[parameterId];
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
    setClientTypeDefaultValue(
      clientTypesValue.find(
        (item: any) => item?.id === router?.query?.clientTypeId
      )
    );
    setClientDefaultValue(
      renderOptions().find(
        (item: any) => item?.id === router?.query?.customerId
      )
    );
  }, [clientTypesValue, router]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const _renderParameterType = (
    parameter: any,
    subSection: any,
    section: any
  ) => {
    if (parameter?.parameterType === 1) {
      return (
        <GomakeTextInput
          style={clasess.textInputStyle}
          defaultValue={parameter.defaultValue}
          placeholder={parameter.name}
          onChange={(e: any, item: any) =>
            onChangeForPrice(
              parameter?.id,
              subSection?.id,
              section?.id,
              parameter?.parameterType,
              { value: e.target.value }
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
              parameter?.id,
              { value: e.target.value }
            )
          }
          type="text"
        />
      );
    } else if (parameter?.parameterType === 0) {
      const defaultObject = parameter.valuesConfigs.find(
        (item) => item.isDefault === true
      );
      return (
        <GoMakeAutoComplate
          options={parameter?.valuesConfigs}
          placeholder={parameter.name}
          style={clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
          defaultValue={defaultObject}
          // value={defaultObject}
          onChange={(e: any, value: any) => {
            onChangeForPrice(
              parameter?.id,
              subSection?.id,
              section?.id,
              parameter?.parameterType,
              { valueId: value?.id, value: value?.updateName }
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
          options={parameter?.valuesConfigs}
          placeholder={parameter.name}
          style={clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
          defaultValue={defaultObject}
          onChange={(e: any, value: any) => {
            let temp = [...generalParameters];
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
                    value: 5,
                  });
                }
              }
            });
            setGeneralParameters(temp);

            onChangeForPrice(
              parameter?.id,
              subSection?.id,
              section?.id,
              parameter?.parameterType,
              { valueId: value?.id, value: value?.updateName }
            );
            setGeneralParameters(temp);
          }}
        />
      );
    } else if (parameter?.parameterType === 3) {
      return (
        <SecondSwitch
          defaultChecked={parameter?.defaultValue === "true"}
          onChange={(e: any, value: any) =>
            onChangeForPrice(
              parameter?.id,
              subSection?.id,
              section?.id,
              parameter?.parameterType,
              { value }
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
        let options: any = allMaterials;
        if (parameter?.materialPath?.length == 3) {
          options = digitalPriceData?.selectedMaterialLvl2;
        }
        if (parameter?.materialPath?.length == 2) {
          options = digitalPriceData?.selectedMaterialLvl1;
        }
        if (parameter?.materialPath?.length == 1) {
          options = allMaterials?.find((material) => {
            return material.pathName === parameter?.materialPath[0];
          })?.data;
        }
        return (
          options?.length > 0 && (
            <GoMakeAutoComplate
              options={options}
              placeholder={parameter.updatedName}
              style={clasess.dropDownListStyle}
              getOptionLabel={(option: any) => option.value}
              onChange={(e: any, value: any) => {
                if (parameter?.materialPath?.length == 3) {
                  onChangeForPrice(
                    parameter?.id,
                    subSection?.id,
                    section?.id,
                    parameter?.parameterType,
                    {
                      valueId: value?.valueId,
                      value: value.value,
                      ...(data?.id > 0 && { material: data?.id }),
                    }
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
                    {
                      valueId: value?.valueId,
                      value: value.value,
                      ...(data?.id > 0 && { material: data?.id }),
                    }
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

                    {
                      valueId: value?.valueId,
                      value: value.value,
                      ...(data?.id > 0 && { material: data?.id }),
                    }
                  );
                  setDigidatPriceData({
                    ...digitalPriceData,
                    selectedMaterialLvl1: value?.data,
                    selectedOptionLvl1: value,
                    selectedMaterialLvl2: null,
                    selectedMaterialLvl3: null,
                  });
                }
              }}
            />
          )
        );
      }
    }
  };
  const onChangeForPrice = (
    parameterId: any,
    subSectionId: any,
    sectionId: any,
    ParameterType: any,
    data: any
  ) => {
    let temp = [...generalParameters];
    const index = temp.findIndex(
      (item) =>
        item.parameterId === parameterId &&
        item.sectionId === sectionId &&
        item.subSectionId === subSectionId
    );

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
        ...data,
      });
    }
    setGeneralParameters(temp);
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
  const [pricingDefaultValue, setPricingDefaultValue] = useState<any>();
  const calculationProduct = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/calculation-service/calculations/calculate-product`,
      {
        clientId: router?.query?.customerId,
        clientTypeId: router?.query?.clientTypeId,
        productId: router?.query?.productId,
        generalParameters: generalParameters,
      }
    );
    setPricingDefaultValue(res?.data?.data?.data);
  }, [generalParameters, router]);

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
    defaultPrice,
    makeShapeOpen,
    chooseShapeOpen,
    activeIndex,
    template,
    tabs,
    activeTab,
    PricingTab,
    expanded,
    handleChange,
    _renderParameterType,
    clientDefaultValue,
    renderOptions,
    checkWhatRenderArray,
    clientTypeDefaultValue,
    clientTypesValue,
    pricingDefaultValue,
  };
};

export { useDigitalOffsetPrice };
