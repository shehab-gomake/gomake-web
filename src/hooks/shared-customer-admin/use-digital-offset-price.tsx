import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import { useQuoteWidget } from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
import { materialsCategoriesState } from "@/store/material-categories";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { getAndSetProductById } from "@/services/hooks";
import {
  currentCalculationConnectionId,
  isLoadgingState,
  itemParmetersValuesState,
  selectedValueConfigState,
  selectParameterButtonState,
  subProductsCopyParametersState,
  subProductsParametersState,
} from "@/store";
import { useMaterials } from "../use-materials";
import { digitslPriceState } from "./store";
import cloneDeep from "lodash/cloneDeep";
import lodashClonedeep from "lodash.clonedeep";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";
import { compareStrings } from "@/utils/constants";
import { EButtonTypes, EParameterTypes } from "@/enums";
import { QuantityParameter } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-parameter";
import { InputNumberParameterWidget } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/input-number-parameter";
import { DropDownListParameterWidget } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/drop-down-list-parameter";
import { SelectChildParameterWidget } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/select-child-parameter";
import { SWITCHParameterWidget } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/switch-parameter";
import { ButtonParameterWidget } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/button-parameter";

import {
  calculationExceptionsLogsState,
  calculationProgressState,
  currentProductItemValueDraftId,
  currentProductItemValuePriceState,
  currentProductItemValueState,
  jobActionsState,
  jobDetailsState,
  outsourceSuppliersState,
  productUrgentWorkState,
  selectedWorkFlowState,
  workFlowsState,
} from "@/widgets/product-pricing-widget/state";
import { getOutsourcingSuppliersListApi } from "@/services/api-service/suppliers/suppliers-endpoints";
import { useCalculationsWorkFlowsSignalr } from "../signalr/use-calculations-workflows-signalr";
import { v4 as uuidv4 } from "uuid";
import {
  addItemApi,
  getProductByItemIdApi,
  updateDocumentItemApi,
} from "@/services/api-service/generic-doc/documents-api";
import { productQuantityTypesValuesState } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import { TypesParameter } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/types-parameter";

const useDigitalOffsetPrice = ({ clasess, widgetType }) => {
  const { navigate } = useGomakeRouter();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const router = useRouter();
  const { alertFaultAdded, alertFaultUpdate } = useSnackBar();

  const { clientTypesValue, renderOptions, checkWhatRenderArray } =
    useQuoteWidget();
  const { allMaterials, getAllMaterial } = useMaterials();
  const [selectedValueConfig, setSelectedValueConfig] = useRecoilState(
    selectedValueConfigState
  );
  const [samlleType, setSamlleType] = useState();
  const [isRequiredParameters, setIsRequiredParameters] = useState<any>([]);
  const [GalleryModalOpen, setGalleryModalOpen] = useState(false);
  const [multiParameterModal, setMultiParameterModal] = useState(false);
  const [makeShapeOpen, setMakeShapeOpen] = useState(false);
  const [urgentOrder, setUrgentOrder] = useRecoilState(productUrgentWorkState);
  const [printingNotes, setPrintingNotes] = useState("");
  const [graphicNotes, setGraphicNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [productTemplate, setProductTemplate] = useState<any>([]);
  const [defaultProductTemplate, setDefaultProductTemplate] = useState<any>([]);
  const [subProducts, setSubProducts] = useRecoilState<any>(
    subProductsParametersState
  );
  const [isSetTemplete, setIsSetTemplete] = useState<boolean>(false);
  const setSubProductsCopy = useSetRecoilState<any>(
    subProductsCopyParametersState
  );
  const itemParmetersValues = useRecoilValue(itemParmetersValuesState);
  const [currentProductItemValue, setCurrentProductItemValue] =
    useRecoilState<any>(currentProductItemValueState);
  const [productItemValueDraftId, setCurrentProductItemValueDraftId] =
    useRecoilState<string>(currentProductItemValueDraftId);
  const [
    currentProductItemValueTotalPrice,
    setCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(currentProductItemValuePriceState);

  const [clientDefaultValue, setClientDefaultValue] = useState<any>({});
  const [clientTypeDefaultValue, setClientTypeDefaultValue] = useState<any>({});
  const [expanded, setExpanded] = useState<string | false>("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(
    t("products.offsetPrice.admin.logs")
  );
  const [pricingDefaultValue, setPricingDefaultValue] = useState<any>();
  const [workFlows, setWorkFlows] = useRecoilState(workFlowsState);
  const setCalculationExceptionsLogs = useSetRecoilState(
    calculationExceptionsLogsState
  );
  const selectedWorkFlow = useRecoilValue(selectedWorkFlowState);
  const productQuantityTypes = useRecoilValue(productQuantityTypesValuesState);
  const setCalculationProgress = useSetRecoilState(calculationProgressState);
  const jobDetails = useRecoilValue(jobDetailsState);
  const [jobActions, setJobActions] = useRecoilState(jobActionsState);
  const setOutSuppliers = useSetRecoilState(outsourceSuppliersState);
  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  const setLoading = useSetRecoilState(isLoadgingState);
  const [digitalPriceData, setDigidatPriceData] =
    useRecoilState<any>(digitslPriceState);
  const [priceRecovery, setPriceRecovery] = useState(true);
  const [canCalculation, setCanCalculation] = useState(false);
  const [isCalculationFinished, setIsCalculationFinished] = useState(false);
  const setSelectParameterButton = useSetRecoilState(
    selectParameterButtonState
  );
  const {
    calculationResult,
    calculationSessionId,
    connectionId,
    updatedSelectedWorkFlow,
    calculationExceptionsLogs,
  } = useCalculationsWorkFlowsSignalr();
  const [calculationSessionConnectionId, setCalculationSessionConnectionId] =
    useRecoilState(currentCalculationConnectionId);

  const [requestAbortController, setRequestAbortController] =
    useState<AbortController>(null);
  const [billingMethod, setBillingMethod] = useState<any>();
  const [graphicDesigner, setGraphicDesigner] = useState<any>();
  const [includeVAT, setIncludeVAT] = useState<boolean>(false);
  useEffect(() => {
    let copy = lodashClonedeep(subProducts);
    setSubProductsCopy(copy);
  }, [subProducts]);

  useEffect(() => {
    if (calculationResult && calculationResult.productItemValue) {
      if (calculationResult.productItemValueDraftId === calculationSessionId) {
        setLoading(false);
        setCurrentProductItemValueDraftId(
          calculationResult.productItemValueDraftId
        );
        const currentWorkFlows = cloneDeep(workFlows);
        const newWorkFlows = calculationResult?.productItemValue.workFlows;
        newWorkFlows.forEach((flow) => {
          const isExists = currentWorkFlows.find((x) => x.id === flow.id);
          if (!isExists) {
            currentWorkFlows.push(flow);
          }
          if (flow.selected) {
            currentWorkFlows.forEach((f) => (f.selected = false));
          }
        });
        if (calculationResult?.monials) {
          calculationResult?.monials.forEach((m) => {
            const workFlow = currentWorkFlows.find(
              (x) => x.id === m.workFlowId
            );
            if (workFlow) {
              workFlow.monials = m?.monials;
              workFlow.recommendationRang = m?.recommendationRang;
            }
          });
        }
        currentWorkFlows.sort((a, b) => b.monials - a.monials);
        let selectedWorkFlow = currentWorkFlows?.find((x) => x.selected);
        if (
          !selectedWorkFlow &&
          currentWorkFlows &&
          currentWorkFlows.length > 0
        ) {
          currentWorkFlows[0].selected = true;
        }
        selectedWorkFlow = currentWorkFlows?.find((x) => x.selected);
        if (
          selectedWorkFlow &&
          selectedWorkFlow.totalPrice &&
          selectedWorkFlow.totalPrice.values
        ) {
          setCurrentProductItemValueTotalPrice(
            parseFloat(selectedWorkFlow.totalPrice.values[0])
          );
        }
        const currentWorkFlowsCount = currentWorkFlows.length;
        const totalWorkFlowsCount =
          calculationResult?.productItemValue.totalWorkFlows;
        setCalculationProgress({
          totalWorkFlowsCount: totalWorkFlowsCount,
          currentWorkFlowsCount: currentWorkFlowsCount,
        });
        setWorkFlows(currentWorkFlows);
        setJobActions(calculationResult?.productItemValue.actions);
      }
    }
  }, [calculationResult]);

  useEffect(() => {
    setWorkFlows([]);
    setCurrentProductItemValueTotalPrice(null);
    setJobActions([]);
    setIsCalculationFinished(false);
    setCalculationProgress({
      totalWorkFlowsCount: 0,
      currentWorkFlowsCount: 0,
    });
    setCalculationSessionConnectionId(connectionId);
  }, [calculationSessionId]);

  useEffect(() => {
    setCalculationExceptionsLogs(calculationExceptionsLogs);
  }, [calculationExceptionsLogs]);
  useEffect(() => {
    setWorkFlows(
      workFlows.map((flow) =>
        flow.id === updatedSelectedWorkFlow?.id
          ? updatedSelectedWorkFlow
          : {
              ...flow,
              selected: false,
            }
      )
    );
    if (
      updatedSelectedWorkFlow?.totalPrice &&
      updatedSelectedWorkFlow?.totalPrice?.values
    ) {
      setCurrentProductItemValueTotalPrice(
        +updatedSelectedWorkFlow?.totalPrice.values[0]
      );
    }
  }, [updatedSelectedWorkFlow]);
  const selectBtnTypeToAction = (
    parameter,
    sectionId,
    subSectionId,
    index,
    paameterType
  ) => {
    if (parameter?.buttonAction === EButtonTypes.GALLERY_MODAL) {
      setSelectParameterButton({
        parameter,
        sectionId,
        subSectionId,
        index,
        paameterType,
      });
      onOpeneGalleryModal();
    }
  };
  const findLargestActionIndex = (params) => {
    return params.reduce(
      (maxIndex, param) => Math.max(maxIndex, param.actionIndex),
      -1
    );
  };

  function removeDuplicates(arr) {
    const uniqueIds = new Set();
    return arr.filter((param) => {
      if (!uniqueIds.has(param.id)) {
        uniqueIds.add(param.id);
        return true;
      }
      return false;
    });
  }

  const duplicateSection = (item) => {
    let defaultProductTemplateCopy = cloneDeep(defaultProductTemplate);
    const section = defaultProductTemplateCopy.sections.find(
      (x) => x.id === item.id
    );
    const sectionCopy = cloneDeep(section);
    const numberOfCopies = defaultProductTemplateCopy.sections.filter(
      (x) => x.duplicatedFromSectionId === item.id
    ).length;
    if (!numberOfCopies) {
      //section.name = section.name + " 1";
      section.index = 0;
    }
    sectionCopy.index = numberOfCopies + 1;
    sectionCopy.name = sectionCopy.name + " " + (sectionCopy.index + 1);
    sectionCopy.duplicatedFromSectionId = item.id;
    sectionCopy.id = uuidv4();
    sectionCopy.subSections.forEach((sub) => {
      sub.duplicatedFromSubSectionId = sub.id;
      sub.id = uuidv4();
      if (sub.type) {
        sub.type = sub.type + numberOfCopies + 1;
      }
    });
    const sectionsArr = [];
    const productTemplateCopy = cloneDeep(productTemplate);
    productTemplateCopy.sections.forEach((sec) => {
      sectionsArr.push(sec);
      if (!numberOfCopies && sec.id === item.id) {
        sectionsArr.push(sectionCopy);
      } else if (numberOfCopies && sec.index == numberOfCopies) {
        sectionsArr.push(sectionCopy);
      }
    });
    productTemplateCopy.sections = sectionsArr;
    initProduct(productTemplateCopy, allMaterials);
  };
  const removeSection = (item) => {
    let temp = cloneDeep(productTemplate);
    temp.sections = temp.sections.filter((x) => x.id !== item.id);
    initProduct(temp, allMaterials);
  };
  const duplicateParameters = (mySubSection) => {
    let temp = cloneDeep(productTemplate);
    let myId = mySubSection?.id;
    let largestIndex = findLargestActionIndex(mySubSection.parameters);
    const duplicatedParameters = mySubSection.parameters.map((parameter) => {
      const duplicatedParameter = { ...parameter };
      duplicatedParameter.actionIndex = largestIndex + 1;
      if (duplicatedParameter.relatedParameters) {
        duplicatedParameter.relatedParameters.forEach((relatedParameter) => {
          relatedParameter.actionIndex = duplicatedParameter.actionIndex;
        });
      }
      return duplicatedParameter;
    });
    const uniqueParameters = removeDuplicates(duplicatedParameters);
    temp.sections.forEach((section) => {
      section.subSections.forEach((subSection) => {
        if (subSection.id === myId) {
          subSection.parameters = cloneDeep(subSection.parameters).concat(
            uniqueParameters
          );
        }
      });
    });

    // Update the state with the modified temp object
    initProduct(temp, allMaterials);
  };
  /*useEffect(() => {
      if (pricingDefaultValue?.workFlows?.length > 0 && canCalculation) {
        const workFlowSelect = pricingDefaultValue?.workFlows?.find(
          (workFlow) => workFlow?.selected === true
        );
        setWorkFlowSelected(workFlowSelect);
        setDefaultPrice(workFlowSelect?.totalPrice);
      } else {
        setWorkFlowSelected({});
        setDefaultPrice("-----");
      }
    }, [pricingDefaultValue, canCalculation]);*/
  useEffect(() => {
    if (productTemplate && productTemplate?.sections?.length > 0) {
      let temp = [...isRequiredParameters];
      productTemplate?.sections?.map((section) => {
        return section?.subSections?.map((subSection, i) => {
          return subSection.parameters?.map((parameter, i) => {
            const index = temp.findIndex(
              (item) =>
                item.parameterId === parameter?.id &&
                item.sectionId === section?.id &&
                item.subSectionId === subSection?.id &&
                item?.actionIndex === parameter?.actionIndex
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
  }, [productTemplate]);
  const [relatedParameters, setRelatedParameters] = useState([]);
  useEffect(() => {
    if (!isSetTemplete) {
      if (productTemplate && productTemplate?.sections?.length > 0) {
        let sectionData: any = cloneDeep(productTemplate?.sections);
        const typeMap = {};
        let relatedParametersArray = [];
        const subProductsArray = cloneDeep(subProducts);

        sectionData.forEach((section) => {
          section.subSections.forEach((subSection) => {
            let subProduct = subProductsArray.find(
              (sub) => sub.type == subSection.type
            );
            if (!subProduct) {
              subProduct = {
                type: subSection.type,
                parameters: [],
                sectionId: section.id,
                sectionName: section.name,
              };
              subProductsArray.push(subProduct);
            }
            let temp = [];
            subSection.parameters
              .filter((parameter) => !parameter.isHidden)
              .forEach((parameter) => {
                parameter.relatedParameters.forEach((x) => {
                  x.sectionId = section.id;
                  x.subSectionId = subSection.id;
                  x.actionIndex = parameter?.actionIndex;
                });
                relatedParametersArray.push(...parameter.relatedParameters);
                const isParameterExits = subProduct.parameters.find(
                  (param) =>
                    param.parameterId === parameter?.id &&
                    param.subSectionId === subSection.id &&
                    param.actionIndex === parameter?.actionIndex
                );
                let isSetDefaultValue = true;
                if (
                  parameter?.parameterType === EParameterTypes.SWITCH &&
                  parameter?.defaultValue === "false"
                ) {
                  isSetDefaultValue = false;
                }
                if (!isParameterExits && isSetDefaultValue) {
                  if (
                    parameter?.parameterType === EParameterTypes.INPUT_NUMBER ||
                    parameter?.parameterType === EParameterTypes.INPUT_TEXT ||
                    parameter?.parameterType === EParameterTypes.SWITCH
                  ) {
                    if (parameter?.defaultValue?.length > 0) {
                      const defaultValue = parameter?.defaultValue;
                      subProduct.parameters.push({
                        parameterId: parameter?.id,
                        parameterName: parameter?.name,
                        actionId: parameter?.actionId,
                        parameterType: parameter?.parameterType,
                        ...(defaultValue?.length > 0 && {
                          values: [defaultValue],
                        }),
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                        actionIndex: parameter?.actionIndex,
                      });
                    }
                  } else if (
                    parameter?.parameterType === EParameterTypes.DROP_DOWN_LIST
                  ) {
                    const value = parameter?.valuesConfigs?.find(
                      (item) => item?.isDefault == true
                    );

                    if (value) {
                      const data = materialsEnumsValues.find((item) => {
                        return compareStrings(
                          item.name,
                          parameter?.materialPath[0]
                        );
                      });
                      subProduct.parameters.push({
                        parameterId: parameter?.id,
                        parameterName: parameter?.name,
                        actionId:
                          value?.activateAction === true
                            ? parameter?.actionId
                            : null,
                        ...(data?.id > 0 && { material: data?.id }),
                        parameterType: parameter?.parameterType,
                        ...(value && {
                          valueIds: [value?.id],
                          values: [value?.updateName],
                        }),
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                        actionIndex: parameter?.actionIndex,
                      });
                    }
                  } else if (
                    parameter?.parameterType ===
                    EParameterTypes.SELECT_MATERIALS
                  ) {
                    const value = parameter?.valuesConfigs?.find(
                      (item) => item?.isDefault == true
                    );

                    if (
                      value &&
                      value.materialValueIds &&
                      value.materialValueIds.length > 0
                    ) {
                      const data = materialsEnumsValues.find((item) => {
                        return compareStrings(
                          item.name,
                          parameter?.materialPath[0]
                        );
                      });
                      const defValue = value.materialValueIds[0].valueId;
                      if (defValue) {
                        subProduct.parameters.push({
                          parameterId: parameter?.id,
                          parameterName: parameter?.name,
                          actionId:
                            value?.activateAction === true
                              ? parameter?.actionId
                              : null,
                          ...(data?.id > 0 && { material: data?.id }),
                          parameterType: parameter?.parameterType,
                          ...(value && {
                            valueIds: [defValue],
                            values: [defValue],
                          }),
                          sectionId: section?.id,
                          subSectionId: subSection?.id,
                          actionIndex: parameter?.actionIndex,
                        });
                      }
                    }
                  } else if (
                    parameter?.parameterType ===
                    EParameterTypes.SELECT_CHILDS_PARAMETERS
                  ) {
                    const defaultObject = parameter.valuesConfigs.find(
                      (item) => item.isDefault === true
                    );
                    parameter?.childsParameters.forEach((parameter) => {
                      const parameterId = parameter.id;
                      if (
                        defaultObject?.values.hasOwnProperty(parameterId) &&
                        defaultObject?.values
                      ) {
                        parameter.defaultValue =
                          defaultObject?.values[parameterId];
                      }
                    });
                    if (defaultObject) {
                      subProduct.parameters.push({
                        parameterId: parameter?.id,
                        parameterName: parameter?.name,
                        actionId: parameter?.actionId,
                        parameterType: parameter?.parameterType,
                        ...(defaultObject && {
                          valueIds: [defaultObject?.id],
                          values: [defaultObject?.updateName],
                        }),
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                        actionIndex: parameter?.actionIndex,
                      });
                      parameter?.childsParameters?.map((item) => {
                        const childParam = subSection.parameters.find(
                          (x) => x.id === item.id
                        );
                        subProduct.parameters.push({
                          parameterId: childParam?.id,
                          parameterName: childParam?.name,
                          actionId: childParam?.actionId,
                          parameterType: childParam?.parameterType,
                          values: item.defaultValue
                            ? [item?.defaultValue]
                            : [childParam?.defaultValue],
                          sectionId: section?.id,
                          subSectionId: subSection?.id,
                          actionIndex: parameter?.actionIndex,
                        });
                      });
                    }
                  }
                }
              });

            if (temp.length > 0) {
              if (!typeMap[subSection.type]) {
                typeMap[subSection.type] = {
                  type: subSection.type,
                  parameters: temp,
                  sectionId: section.id,
                  sectionName: section.name,
                };
              } else {
                typeMap[subSection.type].parameters.push(...temp);
              }
            }
          });
        });

        setSubProducts(subProductsArray);
        //setRelatedParameters(relatedParametersArray);
        setIsSetTemplete(true);
      }
    }
  }, [materialsEnumsValues, allMaterials, productTemplate]);
  /*useEffect(() => {

    }, [productTemplate]);*/
  const initProduct = (product, materials) => {
    if (product && product?.sections?.length > 0) {
      let sectionData: any = product.sections;
      let relatedParametersArray = [];
      sectionData.forEach((section) => {
        section.subSections.forEach((subSection) => {
          subSection.parameters
            .filter((parameter) => !parameter.isHidden)
            .forEach((parameter) => {
              const relatedToParameter = subSection.parameters.find(
                (subProductsParameter) =>
                  subProductsParameter?.relatedParameters?.find(
                    (p) => p.parameterId === parameter.id
                  )
              );
              if (relatedToParameter && relatedToParameter.isHidden) {
                parameter.isHidden = true;
                const unHiddenParameterInSubSection =
                  subSection.parameters.find((x) => !x.isHidden);
                if (!unHiddenParameterInSubSection) {
                  subSection.isHidden = true;
                }
                return;
              }
              if (!relatedToParameter) {
                if (
                  (parameter?.parameterType ===
                    EParameterTypes.DROP_DOWN_LIST ||
                    parameter?.parameterType ===
                      EParameterTypes.SELECT_MATERIALS) &&
                  (!parameter?.valuesConfigs ||
                    parameter?.valuesConfigs.length === 0)
                ) {
                  //parameter.isHidden = true;
                  //return;
                }
              }
              if (parameter.materialPath && parameter.materialPath.length > 0) {
                if (parameter.name == "Spiral type") {
                }
                if (parameter.materialPath.length == 1) {
                  const materialData = materials?.find((x) =>
                    compareStrings(x.pathName, parameter.materialPath[0])
                  )?.data;
                  if (!parameter.valuesConfigs) {
                    parameter.valuesConfigs = [];
                  }
                  parameter.valuesConfigs = parameter.valuesConfigs.filter(
                    (x) => x.values && x.values.length > 0
                  );
                  if (materialData) {
                    materialData.forEach((val) => {
                      const existsValue = parameter.valuesConfigs.find(
                        (x) =>
                          x.values &&
                          x.values.length > 0 &&
                          x.values[0] === val.valueId
                      );
                      if (!existsValue) {
                        parameter.valuesConfigs.push({
                          id: val.valueId,
                          activateAction: false,
                          isDefault: false,
                          isDeleted: false,
                          isHidden: false,
                          materialValueIds: null,
                          selectedParameterValues: null,
                          updateName: val.value,
                          values: [val.valueId],
                        });
                      } else {
                        existsValue.id = val.valueId;
                        existsValue.updateName = val.value;
                      }
                    });
                  }
                }

                const defaultValue = parameter.valuesConfigs?.find(
                  (x) => x.isDefault
                );
                if (defaultValue) {
                  const materialPath =
                    parameter.materialPath[parameter.materialPath.length - 1];
                  const materialRelatedParameters =
                    subSection.parameters.filter(
                      (x) =>
                        x.id !== parameter.id &&
                        x.actionIndex === parameter.actionIndex &&
                        x.materialPath?.find((y) =>
                          compareStrings(y, materialPath)
                        )
                    );
                  materialRelatedParameters?.forEach((param) => {
                    if (param.materialPath && param.materialPath.length > 0) {
                      const index = param.materialPath.findIndex((x) =>
                        compareStrings(x, materialPath)
                      );
                      if (
                        index != -1 &&
                        index < param.materialPath.length - 1
                      ) {
                        const materialData = materials.find((x) =>
                          compareStrings(x.pathName, materialPath)
                        )?.data;
                        const paramMaterialValues = materialData.find((x) =>
                          defaultValue.values?.find((y) => y === x.valueId)
                        )?.data;
                        if (!parameter.valuesConfigs) {
                          parameter.valuesConfigs = [];
                        }
                        param.valuesConfigs = param.valuesConfigs.filter(
                          (x) => x.values && x.values.length > 0
                        );
                        paramMaterialValues?.forEach((val) => {
                          const existsValue = param.valuesConfigs.find(
                            (x) =>
                              x.values &&
                              x.values.length > 0 &&
                              x.values[0] === val.valueId
                          );
                          if (!existsValue) {
                            param.valuesConfigs.push({
                              id: val.valueId,
                              activateAction: false,
                              isDefault: false,
                              isDeleted: false,
                              isHidden: false,
                              materialValueIds: null,
                              selectedParameterValues: null,
                              updateName: val.value,
                              values: [val.valueId],
                            });
                          } else {
                            existsValue.id = val.valueId;
                            existsValue.updateName = val.value;
                          }
                        });
                      }
                    }
                  });
                }
              }
              if (parameter?.parameterType === EParameterTypes.SWITCH) {
                parameter.isRequired = false;
              }
              parameter.relatedParameters.forEach((x) => {
                x.sectionId = section.id;
                x.subSectionId = subSection.id;
                x.actionIndex = parameter?.actionIndex;
              });
              relatedParametersArray.push(...parameter.relatedParameters);
              if (parameter.relatedParameter) {
                parameter.relatedParameter.forEach((relatedParameter) => {
                  relatedParameter.actionIndex = parameter.actionIndex;
                });
              }
            });
        });
      });
      setIsSetTemplete(false);
      setProductTemplate(product);
      setRelatedParameters(relatedParametersArray);
    }
  };
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
    setCanCalculation(false);
    setCurrentProductItemValueTotalPrice(null);
    setWorkFlows([]);
    setJobActions([]);
    setSubProducts([]);
    setCalculationProgress({
      totalWorkFlowsCount: 0,
      currentWorkFlowsCount: 0,
    });
    if (
      widgetType === EWidgetProductType.EDIT ||
      widgetType === EWidgetProductType.DUPLICATE
    ) {
      getAllMaterial().then((materials) => {
        getProductQuoteItemById(materials);
      });
    } else {
      getAllMaterial().then((materials) => {
        getProductById(materials);
      });
    }
  }, [router, widgetType]);
  useEffect(() => {
    if (canCalculation) {
      calculationProduct();
    }
  }, [subProducts, canCalculation]);

  useEffect(() => {
    if (currentProductItemValueTotalPrice && quantity) {
      const productItemValue = {
        productItemValueId: productItemValueDraftId,
        itemId: router?.query?.documentId,
        productId: router?.query?.productId,
        supplierId: "",
        customerID: router?.query?.customerId,
        unitPrice: +currentProductItemValueTotalPrice / +quantity?.values[0],
        amount: quantity?.values[0],
        isNeedGraphics: false,
        isUrgentWork: urgentOrder,
        printingNotes,
        graphicNotes,
        isNeedExample: false,
        isDuplicatedWithAnotherQuantity: false,
        graphicsEmployeeId: graphicDesigner?.id,
        graphicsPricingType: billingMethod?.value,
      };
      setCurrentProductItemValue(productItemValue);
    }
  }, [subProducts, selectedWorkFlow, currentProductItemValueTotalPrice]);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const _getParameter = (parameter: any, subSection: any, section: any) => {
    const allParameters = subProducts.flatMap((item) => item.parameters);
    let temp = [...allParameters];
    const index = temp.findIndex(
      (item) =>
        item?.parameterId === parameter?.id &&
        item?.sectionId === section?.id &&
        item?.subSectionId === subSection?.id &&
        item?.actionIndex === parameter?.actionIndex
    );
    return temp[index];
  };

  const _renderParameterType = (
    parameter: any,
    subSection: any,
    section: any,
    subSectionParameters,
    value,
    list,
    inModal: any
  ) => {
    let Comp;
    const parametersArray = subProducts.flatMap((item) => item.parameters);
    const temp = [...parametersArray];
    const index = temp.findIndex(
      (item) =>
        item.parameterId === parameter?.id &&
        item.sectionId === section?.id &&
        item.subSectionId === subSection?.id &&
        item?.actionIndex === parameter?.actionIndex
    );
    if (
      parameter?.parameterType === EParameterTypes.INPUT_NUMBER &&
      parameter?.id === quantity?.parameterId
    ) {
      Comp = (
        <QuantityParameter
          classes={clasess}
          parameter={parameter}
          index={index}
          temp={temp}
          onChangeSubProductsForPrice={onChangeSubProductsForPrice}
          subSection={subSection}
          section={section}
          type="number"
        />
      );
    } else if (
      parameter?.parameterType === EParameterTypes.INPUT_NUMBER &&
      parameter?.id === typesParam?.parameterId
    ) {
      Comp = (
        <TypesParameter
          classes={clasess}
          parameter={parameter}
          index={index}
          temp={temp}
          onChangeSubProductsForPrice={onChangeSubProductsForPrice}
          subSection={subSection}
          section={section}
          type="number"
        />
      );
    } else if (parameter?.parameterType === EParameterTypes.INPUT_NUMBER) {
      Comp = (
        <InputNumberParameterWidget
          clasess={clasess}
          parameter={parameter}
          index={index}
          temp={temp}
          onChangeSubProductsForPrice={onChangeSubProductsForPrice}
          subSection={subSection}
          section={section}
          type="number"
        />
      );
    } else if (parameter?.parameterType === EParameterTypes.INPUT_TEXT) {
      Comp = (
        <InputNumberParameterWidget
          clasess={clasess}
          parameter={parameter}
          index={index}
          temp={temp}
          onChangeSubProductsForPrice={onChangeSubProductsForPrice}
          subSection={subSection}
          section={section}
          type="text"
        />
      );
    } else if (parameter?.parameterType === EParameterTypes.DROP_DOWN_LIST) {
      Comp = (
        <DropDownListParameterWidget
          parameter={parameter}
          clasess={clasess}
          index={index}
          temp={temp}
          onChangeSubProductsForPrice={onChangeSubProductsForPrice}
          subSection={subSection}
          section={section}
          selectedValueConfig={selectedValueConfig}
          inModal={inModal}
          setSelectedValueConfig={setSelectedValueConfig}
          onOpeneMultiParameterModal={onOpeneMultiParameterModal}
          subSectionParameters={subSectionParameters}
          list={list}
        />
      );
    } else if (
      parameter?.parameterType === EParameterTypes.SELECT_CHILDS_PARAMETERS
    ) {
      Comp = (
        <SelectChildParameterWidget
          parameter={parameter}
          clasess={clasess}
          index={index}
          temp={temp}
          onChangeSubProductsForPrice={onChangeSubProductsForPrice}
          subSection={subSection}
          section={section}
        />
      );
    } else if (parameter?.parameterType === EParameterTypes.SWITCH) {
      Comp = (
        <SWITCHParameterWidget
          parameter={parameter}
          index={index}
          temp={temp}
          onChangeSubProductsForPrice={onChangeSubProductsForPrice}
          subSection={subSection}
          section={section}
        />
      );
    } else if (parameter?.parameterType === EParameterTypes.BUTTON) {
      Comp = (
        <ButtonParameterWidget
          clasess={clasess}
          parameter={parameter}
          selectBtnTypeToAction={selectBtnTypeToAction}
          subSection={subSection}
          section={section}
          index={index}
        />
      );
    } else if (parameter?.parameterType === EParameterTypes.SELECT_MATERIALS) {
      Comp = (
        <DropDownListParameterWidget
          parameter={parameter}
          clasess={clasess}
          index={index}
          temp={temp}
          onChangeSubProductsForPrice={onChangeSubProductsForPrice}
          subSection={subSection}
          section={section}
          selectedValueConfig={selectedValueConfig}
          inModal={inModal}
          setSelectedValueConfig={setSelectedValueConfig}
          onOpeneMultiParameterModal={onOpeneMultiParameterModal}
          subSectionParameters={subSectionParameters}
          list={list}
        />
      );
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={clasess.parameterContainer}>
          <div
            style={
              value?.values[0] === "true"
                ? clasess.parameterType3ActiveLabelStyle
                : clasess.parameterLabelStyle
            }
          >
            {parameter?.name}
            {parameter?.isRequired ? (
              <span style={clasess.spanRequierd}> *</span>
            ) : null}
          </div>
          <div style={clasess.renderParameterTypeContainer}>{Comp}</div>
        </div>
        <>
          {parameter?.relatedParameters?.length > 0 && inModal && (
            <>
              {parameter.relatedParameters.map((relatedParameter) => {
                const subProduct = subProducts.find(
                  (x) => x.type === subSection?.type
                );
                const parm = subProduct?.parameters?.find(
                  (param) =>
                    param.parameterId === parameter.id &&
                    param.actionIndex === relatedParameter.actionIndex
                );
                const myParameter = list.find(
                  (p) =>
                    p.id === relatedParameter.parameterId &&
                    p.actionIndex === relatedParameter.actionIndex
                );
                if (relatedParameter.activateByAllValues && parm?.values) {
                  return (
                    <div>
                      {_renderParameterType(
                        myParameter,
                        subSection,
                        section,
                        subSection?.parameters,
                        myParameter?.value,
                        list,
                        true
                      )}
                    </div>
                  );
                } else {
                  if (
                    parameter?.parameterType === EParameterTypes.DROP_DOWN_LIST
                  ) {
                    const valueInArray = relatedParameter.selectedValueIds.find(
                      (c) => c == parm?.valueIds
                    );

                    if (valueInArray) {
                      return (
                        <div>
                          {_renderParameterType(
                            myParameter,
                            subSection,
                            section,
                            subSection?.parameters,
                            myParameter?.value,
                            list,
                            true
                          )}
                        </div>
                      );
                    }
                  } else {
                    const valueInArray = relatedParameter.selectedValueIds.find(
                      (c) => c == parm?.values
                    );

                    if (valueInArray && myParameter) {
                      return (
                        <div>
                          {_renderParameterType(
                            myParameter,
                            subSection,
                            section,
                            subSection?.parameters,
                            myParameter?.value,
                            list,
                            true
                          )}
                        </div>
                      );
                    }
                  }
                }
              })}
            </>
          )}
        </>
      </div>
    );
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
    index: number,
    actionIndex: number
  ) => {
    setCanCalculation(true);
    const targetSubProduct = subProducts.find(
      (item) => item.type === subSectionType
    );
    if (targetSubProduct) {
      let temp = [...targetSubProduct.parameters];
      const findIndex = temp.findIndex(
        (item) =>
          item.parameterId === parameterId &&
          item.sectionId === sectionId &&
          item.subSectionId === subSectionId &&
          item.actionIndex === actionIndex
      );
      if (findIndex !== -1) {
        temp[findIndex] = {
          ...temp[findIndex],
          values: [data.values],
          valueIds: [data.valueIds],
        };
      } else {
        temp.push({
          parameterId: parameterId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          ParameterType: ParameterType,
          parameterName: parameterName,
          actionId: actionId,
          values: [data.values],
          valueIds: [data.valueIds],
          actionIndex,
        });
      }
      const productTemplateCopy = cloneDeep(productTemplate);
      const section = productTemplateCopy.sections.find(
        (section) => section.id === sectionId
      );
      const subSection = section.subSections.find(
        (sub) => sub.id === subSectionId
      );
      const subSectionParameter = subSection.parameters.find(
        (param) => param.id === parameterId
      );

      if (subSectionParameter) {
        if (
          subSectionParameter.settingParameters &&
          subSectionParameter.settingParameters.length > 0
        ) {
          subSectionParameter.settingParameters.forEach((settingParam) => {
            temp = temp.filter((x) => x.parameterId != settingParam.id);
          });
        }
        const parameterValue = subSectionParameter.valuesConfigs.find(
          (x) => x.id === data.valueIds
        );
        if (
          subSectionParameter.materialPath &&
          subSectionParameter.materialPath.length > 0
        ) {
          const materialPath =
            subSectionParameter.materialPath[
              subSectionParameter.materialPath.length - 1
            ];
          const materialRelatedParameters = subSection.parameters.filter(
            (x) =>
              x.id !== subSectionParameter.id &&
              x.actionIndex === actionIndex &&
              x.materialPath?.find((y) => compareStrings(y, materialPath))
          );

          materialRelatedParameters?.forEach((param) => {
            if (param.materialPath && param.materialPath.length > 0) {
              const index = param.materialPath.findIndex((x) =>
                compareStrings(x, materialPath)
              );
              let allMaterialsCopy = cloneDeep(allMaterials);
              let paramMaterialValues = [];
              if (index > 0) {
                allMaterialsCopy = allMaterialsCopy?.find((x) =>
                  compareStrings(x.pathName, param.materialPath[0])
                )?.data;
                for (let i = 0; i <= index; i++) {
                  const prevPath = param.materialPath[i];
                  const prevPathParam = subSection.parameters.find(
                    (x) =>
                      x.materialPath &&
                      x.materialPath.length > i &&
                      x.materialPath[i] === prevPath &&
                      x.actionIndex === actionIndex
                  );
                  if (subSectionParameter.id === prevPathParam.id) {
                    allMaterialsCopy = allMaterialsCopy?.find(
                      (x) => x.valueId === parameterValue?.id
                    )?.data;
                  } else {
                    const subProductParam = targetSubProduct?.parameters?.find(
                      (item) =>
                        item.parameterId === prevPathParam.id &&
                        item.sectionId === sectionId &&
                        item.subSectionId === subSectionId &&
                        item.actionIndex === actionIndex
                    );
                    allMaterialsCopy = allMaterialsCopy?.find(
                      (x) => x.valueId === subProductParam?.valueIds[0]
                    )?.data;
                  }
                }
                paramMaterialValues = allMaterialsCopy;
              } else if (index === 0) {
                allMaterialsCopy = allMaterialsCopy.find((x) =>
                  compareStrings(x.pathName, materialPath)
                )?.data;
                paramMaterialValues = allMaterialsCopy?.find((x) =>
                  parameterValue?.values?.find((y) => y === x.valueId)
                )?.data;
              }
              if (index != -1 && index < param.materialPath.length - 1) {
                param.valuesConfigs = [];
                paramMaterialValues?.forEach((val) => {
                  param.valuesConfigs.push({
                    id: val.valueId,
                    activateAction: false,
                    isDefault: false,
                    isDeleted: false,
                    isHidden: false,
                    materialValueIds: null,
                    selectedParameterValues: null,
                    updateName: val.value,
                    values: [val.valueId],
                  });
                });
                param.valuesConfigs = param.valuesConfigs.filter(
                  (x) => x.values && x.values.length > 0
                );
              }
            }
          });
        }
        setProductTemplate(productTemplateCopy);
        if (
          parameterValue &&
          parameterValue.selectedParameterValues &&
          parameterValue.selectedParameterValues.length > 0
        ) {
          parameterValue.selectedParameterValues.forEach((selectedParam) => {
            if (selectedParam.valueIds && selectedParam.valueIds.length > 0) {
              const param = subSectionParameter.settingParameters.find(
                (param) => param.id === selectedParam.parameterId
              );
              temp.push({
                parameterId: param.id,
                sectionId: sectionId,
                subSectionId: subSectionId,
                ParameterType: param.parameterType,
                parameterName: param.name,
                actionId: param.actionId,
                values: selectedParam.valueIds,
                valueIds: selectedParam.valueIds,
                actionIndex,
              });
            }
          });
        }
      }
      let temp2 = [...subProducts];
      const index2 = subProducts.findIndex(
        (item) => item.type === subSectionType
      );
      (temp2[index2] = {
        type: subSectionType,
        sectionId: sectionId,
        sectionName: section.name,
        parameters: temp,
      }),
        setSubProducts(temp2);
    }
  };
  const onCloseMakeShape = () => {
    setMakeShapeOpen(false);
  };
  const onCloseGalleryModal = () => {
    setGalleryModalOpen(false);
  };
  const onOpeneMakeShape = () => {
    setMakeShapeOpen(true);
  };
  const onOpeneGalleryModal = () => {
    setGalleryModalOpen(true);
  };
  const [settingParameters, setSettingParameters] = useState({});
  const onOpeneMultiParameterModal = (
    paameters,
    subSection,
    section,
    subSectionParameters,
    list
  ) => {
    setMultiParameterModal(true);
    const value = _getParameter(paameters, subSection, section);
    setSettingParameters({
      parameter: paameters,
      subSection: subSection,
      section: section,
      subSectionParameters: subSectionParameters,
      value: value,
      list: list,
    });
  };
  const onCloseMultiParameterModal = () => {
    setMultiParameterModal(false);
  };

  const handleTabClick = (index: number) => {
    if (index !== activeIndex) {
      setCanCalculation(false);
      setActiveIndex(index);
      setCanCalculation(false);
    }
  };
  const handleNextClick = () => {
    if (activeIndex < productTemplate.sections.length) {
      setActiveIndex(activeIndex + 1);
    }
  };
  const handlePreviousClick = () => {
    if (activeIndex != 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const onClickProductionTab = () => {
    setActiveTab(t("quality.production"));
    setBillingMethod(null);
    setGraphicDesigner(null);
  };
  const onClickGraphicDesignTab = () => {
    setActiveTab(t("products.offsetPrice.admin.graphicDesign"));
    setSamlleType(null);
  };
  const onClickLogsTab = () => {
    setActiveTab(t("products.offsetPrice.admin.logs"));
    setBillingMethod(null);
    setGraphicDesigner(null);
    setSamlleType(null);
  };
  const tabs = [
    {
      name: t("products.offsetPrice.admin.logs"),
      onclick: () => onClickLogsTab,
    },
    {
      name: t("quality.production"),
      onclick: () => onClickProductionTab,
    },
    {
      name: t("products.offsetPrice.admin.graphicDesign"),
      onclick: () => onClickGraphicDesignTab,
    },
  ];

  const getProductById = async (materials) => {
    await getAndSetProductById(
      callApi,
      (data) => {
        setDefaultProductTemplate(data);
        initProduct(data, materials);
      },
      {
        Id: router?.query?.productId,
      }
    );
  };
  const getProductQuoteItemById = async (materials) => {
    const callBack = (res) => {
      if (res?.success) {
        setDefaultProductTemplate(res?.data);
        //initProduct(res?.data);
        initQuoteItemProduct(res?.data, materials);
      } else {
        alertFaultUpdate();
      }
    };
    await getProductByItemIdApi(callApi, callBack, {
      documentItemId: router?.query?.documentItemId,
      documentType: router?.query?.documentType,
    });
  };

  const initQuoteItemProduct = (quoteItemProduct, materials) => {
    if (
      quoteItemProduct &&
      quoteItemProduct.productItemValue &&
      quoteItemProduct.productItemValue.itemParmetersValues
    ) {
      //setItemParmetersValues(quoteItemProduct.productItemValue.itemParmetersValues);
      const quoteItemSubProducts = [];
      quoteItemProduct.productItemValue.itemParmetersValues.forEach(
        (itemParmetersValue) => {
          const section = quoteItemProduct?.sections?.find(
            (x) => x.id === itemParmetersValue?.sectionId
          );
          const subSection = section?.subSections?.find(
            (x) => x.id === itemParmetersValue?.subSectionId
          );
          let parameter = subSection.parameters.find(
            (x) => x.id === itemParmetersValue.parameterId
          );
          if (parameter && parameter.valuesConfigs && parameter.valuesConfigs) {
            parameter?.valuesConfigs?.forEach((x) => {
              if (x.materialValueIds && x.materialValueIds.length > 0) {
                x.values = x.materialValueIds.map((val) => val.valueId);
              }
            });
          }
          if (
            !parameter &&
            subSection.parameters &&
            subSection.parameters.length > 0
          ) {
            const parentParameter = subSection.parameters.find((x) =>
              x.settingParameters?.some(
                (y) => y.id === itemParmetersValue.parameterId
              )
            );
            parameter = parentParameter?.settingParameters?.find(
              (x) => x.id === itemParmetersValue.parameterId
            );
          }
          const type = itemParmetersValue.subProductType ?? "";
          const exitsSubProduct = quoteItemSubProducts.find(
            (x) => x.type === type
          );
          const newSubProductParameter = {
            parameterId: itemParmetersValue.parameterId,
            parameterName: parameter?.name,
            actionId: parameter?.actionId,
            ParameterType: parameter?.parameterType,
            values: itemParmetersValue.values,
            valueIds: itemParmetersValue.valueIds,
            sectionId: itemParmetersValue?.sectionId,
            subSectionId: itemParmetersValue?.subSectionId,
            actionIndex: itemParmetersValue?.actionIndex,
          };
          if (exitsSubProduct) {
            exitsSubProduct.parameters.push(newSubProductParameter);
          } else {
            const newSubProduct = {
              type: type,
              parameters: [newSubProductParameter],
              sectionId: itemParmetersValue.sectionId,
              sectionName: "",
            };
            quoteItemSubProducts.push(newSubProduct);
          }
        }
      );
      setCurrentProductItemValueTotalPrice(
        quoteItemProduct.docmentItem.finalPrice
      );
      setCurrentProductItemValue(quoteItemProduct.productItemValue);
      setCurrentProductItemValueDraftId(
        quoteItemProduct.productItemValueDraftId
      );
      setWorkFlows(quoteItemProduct.productItemValue.workFlows);
      setJobActions(quoteItemProduct.productItemValue.actions);
      setSubProducts(quoteItemSubProducts);
      setSubProductsCopy(quoteItemSubProducts);
      setCalculationProgress({
        totalWorkFlowsCount: 0,
        currentWorkFlowsCount: 0,
      });
    }
    initProduct(quoteItemProduct, materials);
  };

  const validateParameters = (inputArray) => {
    let isValid = true;
    const allParameters = subProducts.flatMap((item) => item.parameters);
    for (const item of inputArray) {
      const index = allParameters.findIndex(
        (par) => par.parameterId === item.id && par?.values[0]?.length
      );
      if (index == -1) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const calculationProduct = useCallback(async () => {
    if (requestAbortController) {
      requestAbortController.abort();
    }
    setWorkFlows([]);
    setCurrentProductItemValueTotalPrice(null);
    setJobActions([]);
    setIsCalculationFinished(false);
    setCalculationProgress({
      totalWorkFlowsCount: 0,
      currentWorkFlowsCount: 0,
    });

    let checkParameter = validateParameters(isRequiredParameters);
    if (!!checkParameter) {
      setLoading(true);
      const newRequestAbortController = new AbortController();
      setRequestAbortController(newRequestAbortController);
      const generalParameters = subProducts.find((x) => !x.type).parameters;
      const calculationSubProducts = subProducts.filter((x) => x.type);
      const res = await callApi(
        "POST",
        `/v1/calculation-service/calculations/calculate-product`,
        {
          signalRConnectionId: connectionId,
          clientId: router?.query?.customerId,
          clientTypeId: router?.query?.clientTypeId,
          productId: router?.query?.productId,
          generalParameters: generalParameters,
          subProducts: calculationSubProducts,
          itemParmetersValues: itemParmetersValues,
          workTypes: productQuantityTypes,
        },
        false,
        newRequestAbortController
      );
      /*setIsCalculationFinished(true)
            if (res?.success) {
                setPricingDefaultValue(res?.data?.data?.data);
                const workFlows = res?.data?.data?.data?.workFlows;
                if (workFlows && workFlows.length > 0) {
                    const workFlow = res?.data?.data?.data?.workFlows.find(x => x.selected);
                    const currentWorkFlows = cloneDeep(workFlows);
                    const isExits = currentWorkFlows.find(x => x.id === workFlow.id);
                    if (!isExits) {
                        currentWorkFlows.push(workFlow)
                    }
                    if (isExits && !isExits.selected) {
                        currentWorkFlows.forEach(x => x.selected = false);
                        isExits.selected = true;
                    }
                    setCurrentProductItemValueTotalPrice(parseFloat(workFlow?.totalPrice?.values[0]))
                    currentWorkFlows.sort((a, b) => b.monials - a.monials);
                    setCalculationProgress({totalWorkFlowsCount: 0, currentWorkFlowsCount: 0});
                    // setWorkFlows(currentWorkFlows);
                }
                setJobActions(res?.data?.data?.data?.actions);
            }*/
      setLoading(false);
    }
  }, [subProducts, router, isRequiredParameters, validateParameters]);

  const getOutSourcingSuppliers = () => {
    const callBack = (res) => {
      if (res.success) {
        setOutSuppliers(res.data);
      }
    };
    getOutsourcingSuppliersListApi(callApi, callBack, {
      // clientId: router?.query?.customerId,
      // clientTypeId: router?.query?.clientTypeId,
      // productId: router?.query?.productId,
      // generalParameters: generalParameters,
      // subProducts: subProducts,
    }).then();
  };

  const PricingTab = {
    id: "c66465de-95d6-4ea3-bd3f-7efe60f4cb0555",
    name: t("products.offsetPrice.admin.Pricing"),
    icon: "pricing",
    jobDetails: pricingDefaultValue?.jobDetails,
    actions: pricingDefaultValue?.actions,
    flows: pricingDefaultValue?.workFlows,
  };
  const createProfitTestCase = useCallback(async () => {
    const generalParameters = [];
    const res = await callApi(
      "POST",
      `/v1/printhouse-config/profits/create-profit-test-case?systemID=2`,
      {
        clientId: router?.query?.customerId,
        clientTypeId: router?.query?.clientTypeId,
        generalParameters: generalParameters,
        productItemDTO: {
          productId: router?.query?.productId,
          //details: pricingDefaultValue?.jobDetails,
          itemParmetersValues: itemParmetersValues,
          workFlow: selectedWorkFlow,
        },
        actionId: router?.query?.actionId,
        actionProductId: router?.query?.actionProductId,
      },
      false
    );
    if (res?.success) {
      navigate(`/products/profits?actionId=${router?.query?.actionId}`);
    }
  }, [router, pricingDefaultValue, itemParmetersValues, selectedWorkFlow]);
  const quantity = useMemo(() => {
    if (subProducts) {
      const generalParameters = subProducts.find((x) => !x.type)?.parameters;
      return generalParameters?.find(
        (item) => item?.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
      );
    }
  }, [subProducts]);
  const typesParam = useMemo(() => {
    if (subProducts) {
      const generalParameters = subProducts.find((x) => !x.type)?.parameters;
      return generalParameters?.find(
        (item) => item?.parameterId === "de2bb7d5-01b1-4b2b-b0fa-81cd0445841b"
      );
    }
  }, [subProducts]);

  const addItemForQuotes = async () => {
    const docType = router?.query?.documentType ?? "0";
    const callBack = (res) => {
      if (res?.success) {
        docType === "0"
          ? navigate("/quote")
          : navigate(`/order/Id=${router?.query?.documentId}`);
      } else {
        alertFaultAdded();
      }
    };

    await addItemApi(callApi, callBack, {
      item: currentProductItemValue,
      documentType: docType,
    });
  };

  /*useEffect(() => {
      if (
        widgetType === EWidgetProductType.EDIT ||
        widgetType === EWidgetProductType.DUPLICATE
      ) {
        setUrgentOrder(!!productTemplate?.quoteItem?.isUrgentWork);
        setPrintingNotes(productTemplate?.quoteItem?.printingNotes);
        setGraphicNotes(productTemplate?.quoteItem?.graphicNotes);
        setPricingDefaultValue({
          actions: productTemplate?.actions,
          jobDetails: productTemplate?.jobDetails,
          workFlows: productTemplate?.workFlows,
        });
        setCanCalculation(false);
        const workFlowSelect = productTemplate?.workFlows?.find(
          (workFlow) => workFlow?.selected === true
        );
        setWorkFlowSelected(workFlowSelect);
      }
    }, [widgetType, productTemplate, quantity]);*/

  const updateQuoteItem = async () => {
    const callBack = (res) => {
      if (res?.success) {
        router?.query?.documentType == "0"
          ? navigate("/quote")
          : navigate(`/order/Id=${router?.query?.documentId}`);
        setWorkFlows([]);
        setJobActions([]);
      } else {
        alertFaultUpdate();
      }
    };
    await updateDocumentItemApi(callApi, callBack, {
      Item: {
        productItemValueId: productItemValueDraftId,
        itemId: router?.query?.documentItemId,
        productId: router?.query?.productId,
        supplierId: "",
        customerID: router?.query?.customerId,
        unitPrice: +currentProductItemValueTotalPrice / +quantity?.values[0],
        amount: quantity?.values[0],
        isNeedGraphics: false,
        isUrgentWork: urgentOrder,
        printingNotes,
        graphicNotes,
        isNeedExample: false,
        isDuplicatedWithAnotherQuantity: false,
      },
      DocumentType: router?.query?.documentType,
    });
  };

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
      setErrorMsg(t("products.offsetPrice.admin.errorReq"));
    }
  };

  useEffect(() => {
    setPricingDefaultValue({
      actions: jobActions,
      workFlows,
      jobDetails,
    });
  }, [workFlows, jobActions, jobDetails]);
  return {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    onOpeneMakeShape,
    onCloseGalleryModal,
    onCloseMakeShape,
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
    onOpeneMultiParameterModal,
    onCloseMultiParameterModal,
    duplicateSection,
    removeSection,
    duplicateParameters,
    setProductTemplate,
    setSamlleType,
    setBillingMethod,
    multiParameterModal,
    settingParameters,
    priceRecovery,
    graphicNotes,
    printingNotes,
    urgentOrder,
    makeShapeOpen,
    GalleryModalOpen,
    activeIndex,
    productTemplate,
    tabs,
    activeTab,
    PricingTab,
    expanded,
    clientDefaultValue,
    clientTypeDefaultValue,
    clientTypesValue,
    pricingDefaultValue,
    errorMsg,
    relatedParameters,
    workFlows,
    jobDetails,
    jobActions,
    includeVAT,
    billingMethod,
    samlleType,
    graphicDesigner,
    setGraphicDesigner,
    setIncludeVAT,
    getOutSourcingSuppliers,
    onChangeSubProductsForPrice,
  };
};
export { useDigitalOffsetPrice };
