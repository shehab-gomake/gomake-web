import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";

import {useQuoteWidget} from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
import {materialsCategoriesState} from "@/store/material-categories";
import {useGomakeAxios, useGomakeRouter} from "@/hooks";
import {getAndSetgetProductQuoteItemById, getAndSetProductById,} from "@/services/hooks";
import {
    generalParametersState,
    isLoadgingState,
    selectedValueConfigState,
    selectParameterButtonState,
    subProductsParametersState,
} from "@/store";
import {useMaterials} from "../use-materials";
import {digitslPriceState} from "./store";
import cloneDeep from "lodash.clonedeep";
import lodashClonedeep from "lodash.clonedeep";
import {userProfileState} from "@/store/user-profile";
import {EWidgetProductType} from "@/pages-components/products/digital-offset-price/enums";
import {compareStrings} from "@/utils/constants";
import {EButtonTypes, EParameterTypes} from "@/enums";

import {
    maltiParameterState
} from "@/widgets/shared-admin-customers/digital-offset-price/multi-parameter-modal/store/multi-param-atom";
import {
    InputNumberParameterWidget
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/input-number-parameter";
import {
    DropDownListParameterWidget
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/drop-down-list-parameter";
import {
    SelectChildParameterWidget
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/select-child-parameter";
import {
    SWITCHParameterWidget
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/switch-parameter";
import {
    ButtonParameterWidget
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/button-parameter";
import {
    SelectMaterialsParameterWidget
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/select-materials-parameter";
import {
    calculationProgressState,
    itemParametersValuesState,
    jobActionsState,
    jobDetailsState,
    outsourceSuppliersState,
    productUrgentWorkState,
    workFlowsState,
} from "@/widgets/product-pricing-widget/state";
import {getOutsourcingSuppliersListApi} from "@/services/api-service/suppliers/suppliers-endpoints";
import {EWorkSource} from "@/widgets/product-pricing-widget/enums";
import { useCalculationsWorkFlowsSignalr } from "../signalr/use-calculations-workflows-signalr";
import { useCalculationsSessionSignalr } from "../signalr/use-calculations-session-signalr";

const useDigitalOffsetPrice = ({clasess, widgetType}) => {
    const {navigate} = useGomakeRouter();
    const {callApi} = useGomakeAxios();
    const {t} = useTranslation();
    const router = useRouter();

    const {clientTypesValue, renderOptions, checkWhatRenderArray} =
        useQuoteWidget();
    const {allMaterials} = useMaterials();
    const userProfile = useRecoilValue(userProfileState);
    const [selectedValueConfig, setSelectedValueConfig] = useRecoilState(
        selectedValueConfigState
    );

    const [isRequiredParameters, setIsRequiredParameters] = useState<any>([]);
    const [generalParameters, setGeneralParameters] = useRecoilState<any>(
        generalParametersState
    );
    const [GalleryModalOpen, setGalleryModalOpen] = useState(false);
    const [multiParameterModal, setMultiParameterModal] = useState(false);
    const [defaultPrice, setDefaultPrice] = useState<any>("-----");
    const [makeShapeOpen, setMakeShapeOpen] = useState(false);
    const [template, setTemplate] = useState<any>([]);
    const [urgentOrder, setUrgentOrder] = useRecoilState(productUrgentWorkState);
    const [printingNotes, setPrintingNotes] = useState("");
    const [graphicNotes, setGraphicNotes] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [subProducts, setSubProducts] = useRecoilState<any>(subProductsParametersState);
    const [subProductsWithType, setSubProductsWithType] = useState<any>([]);
    const [itemParmetersValues, setItemParmetersValues] = useRecoilState<any>(itemParametersValuesState);
    const [clientDefaultValue, setClientDefaultValue] = useState<any>({});
    const [clientTypeDefaultValue, setClientTypeDefaultValue] = useState<any>({});
    const [expanded, setExpanded] = useState<string | false>("panel_0");
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("Production");
    const [pricingDefaultValue, setPricingDefaultValue] = useState<any>();
    const [workFlows, setWorkFlows] = useRecoilState(workFlowsState);
    const [calculationProgress, setCalculationProgress] = useRecoilState(calculationProgressState);
    const [jobDetails, setJobDetails] = useRecoilState(jobDetailsState);
    const [jobActions, setJobActions] = useRecoilState(jobActionsState);
    const setOutSuppliers = useSetRecoilState(outsourceSuppliersState);
    const [workFlowSelected, setWorkFlowSelected] = useState<any>();

    const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
    const setLoading = useSetRecoilState(isLoadgingState);
    const [digitalPriceData, setDigidatPriceData] =
        useRecoilState<any>(digitslPriceState);
    const [priceRecovery, setPriceRecovery] = useState(true);
    const [canCalculation, setCanCalculation] = useState(false);
    const [generalParametersLocal, setGeneralParametersLocal] =
        useRecoilState(maltiParameterState);
    const [sampleType, setSamlleType] = useState();
    const [selectedValueForSettings, setSelectedValueForSettings] =
        useState<any>();
    const [selectedValueConfigForSettings, setSelectedValueConfigForSettings] =
        useState<any>();
    const setSelectParameterButton = useSetRecoilState(
        selectParameterButtonState
    );
    const {calculationResult,connectionId} = useCalculationsWorkFlowsSignalr();
    const {calculationSessionId} = useCalculationsSessionSignalr();

    const [requestAbortController,setRequestAbortController] = useState<AbortController>(null)
    
    useEffect(()=>{
       
    },[calculationSessionId])
    useEffect(()=>{
        if(calculationResult){
            debugger;
            
            setLoading(false);
            const currentWorkFlowsCount = calculationResult?.workFlows.length;
            const totalWorkFlowsCount = calculationResult?.totalWorkFlows;
            setCalculationProgress({totalWorkFlowsCount: totalWorkFlowsCount,currentWorkFlowsCount:currentWorkFlowsCount} )
            setWorkFlows(
                calculationResult?.workFlows?.map((flow, index) => ({
                    id: index.toString(),
                    ...flow,
                }))
            );
            setJobActions(calculationResult?.actions);
        }
        
    },[calculationResult])
    const selectBtnTypeToAction = (parameter, sectionId, subSectionId) => {
        if (parameter?.buttonAction === EButtonTypes.GALLERY_MODAL) {
            setSelectParameterButton({parameter, sectionId, subSectionId});
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

    const duplicateParameters = (mySubSection: any) => {
        setTemplate((prev) => {
            let temp = cloneDeep(prev);

            let myId = mySubSection?.id;
            let largestIndex = findLargestActionIndex(mySubSection.parameters);
            const duplicatedParameters = mySubSection.parameters.map((parameter) => {
                const duplicatedParameter = {...parameter};
                duplicatedParameter.actionIndex = largestIndex + 1;
                return duplicatedParameter;
            });
            const uniqueParameters = removeDuplicates(duplicatedParameters);
            temp.sections.forEach((section) => {
                section.subSections.forEach((subSection) => {
                    if (subSection.id === myId) {
                        subSection.parameters =
                            subSection.parameters.concat(uniqueParameters);
                    }
                });
            });

            return temp;
        });
    };
    useEffect(() => {
        if (
            generalParametersLocal?.length == 0 &&
            selectedValueForSettings?.parameter?.settingParameters?.length
        ) {
            const temp = selectedValueForSettings?.parameter?.settingParameters.map(
                (item: any) => ({
                    parameterId: item.id,
                    sectionId: selectedValueForSettings?.section?.id,
                    subSectionId: selectedValueForSettings?.subSection?.id,
                    parameterType: item.parameterType,
                    parameterName: item.name,
                    actionId: item.actionId,
                    valueIds: [],
                    values: [],
                })
            );
            setGeneralParametersLocal(temp);
        }
    }, [selectedValueForSettings, generalParametersLocal]);
    useEffect(() => {
        let temp = lodashClonedeep(generalParametersLocal);
        let temp1 = [...generalParameters];
        if (
            selectedValueForSettings?.parameter?.id?.length &&
            selectedValueConfigForSettings?.id?.length &&
            generalParametersLocal?.length > 0
        ) {
            for (const selectedParam of selectedValueConfigForSettings?.selectedParameterValues) {
                const paramIndex = temp.findIndex(
                    (param) => param.parameterId === selectedParam.parameterId
                );
                if (paramIndex !== -1) {
                    temp[paramIndex].valueIds = selectedParam.valueIds;
                    temp[paramIndex].values = selectedParam.valueIds;
                }
            }
            const filteredArray = temp1.filter((obj) => obj.values[0] !== "false");
            temp.forEach((tempObject) => {
                const index = filteredArray.findIndex(
                    (param) => param.parameterId === tempObject.parameterId
                );

                if (index !== -1) {
                    filteredArray[index] = tempObject;
                } else {
                    filteredArray?.push(tempObject);
                }
            });

            setGeneralParameters(filteredArray);
        }
    }, [
        selectedValueForSettings,
        selectedValueConfigForSettings,
        generalParametersLocal,
    ]);

    useEffect(() => {
        if (pricingDefaultValue?.workFlows?.length > 0 && canCalculation) {
            const workFlowSelect = pricingDefaultValue?.workFlows?.find(
                (workFlow) => workFlow?.selected === true
            );
            setWorkFlowSelected(workFlowSelect);
            setDefaultPrice(workFlowSelect?.totalPrice);
        } else {
            setWorkFlowSelected({});
            setDefaultPrice('-----');
        }
    }, [pricingDefaultValue, canCalculation]);
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
    const [relatedParameters, setRelatedParameters] = useState([]);
    const [isSetTemplete, setIsSetTemplete] = useState(false);
    useEffect(() => {
        if (!isSetTemplete) {
            if (template?.sections?.length > 0) {
                let sectionData: any = cloneDeep(template?.sections);
                const newGeneralParameters = [];
                const typeMap = {};
                let relatedParametersArray = [];
                sectionData.forEach((section) => {
                    section.subSections.forEach((subSection) => {
                        if (subSection.type) {
                            let temp = [];
                            subSection.parameters
                                .filter((parameter) => !parameter.isHidden)
                                .forEach((parameter) => {
                                    relatedParametersArray.push(...parameter.relatedParameters);
                                    if (
                                        parameter?.parameterType === EParameterTypes.INPUT_NUMBER ||
                                        parameter?.parameterType === EParameterTypes.INPUT_TEXT ||
                                        parameter?.parameterType === EParameterTypes.SWITCH
                                    ) {
                                        if (parameter?.defaultValue?.length > 0) {
                                            const defaultValue = parameter?.defaultValue;
                                            temp.push({
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
                                            temp.push({
                                                parameterId: parameter?.id,
                                                parameterName: parameter?.name,
                                                actionId:
                                                    value?.activateAction === true
                                                        ? parameter?.actionId
                                                        : null,
                                                ...(data?.id > 0 && {material: data?.id}),
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
                                        EParameterTypes.SELECT_CHILDS_PARAMETERS
                                    ) {
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
                                                    valueIds: [defaultObject?.id],
                                                    values: [defaultObject?.updateName],
                                                }),
                                                sectionId: section?.id,
                                                subSectionId: subSection?.id,
                                                actionIndex: parameter?.actionIndex,
                                            });
                                            parameter?.childsParameters?.map((item) => {
                                                temp.push({
                                                    parameterId: item?.id,
                                                    parameterName: item?.name,
                                                    actionId: item?.actionId,
                                                    parameterType: item?.parameterType,
                                                    values: [item?.defaultValue],
                                                    sectionId: section?.id,
                                                    subSectionId: subSection?.id,
                                                    actionIndex: parameter?.actionIndex,
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
                                        sectionId: section.id
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
                                            item?.parameterId === parameter?.id &&
                                            item?.sectionId === section?.id &&
                                            item?.subSectionId === subSection?.id &&
                                            item?.actionIndex === parameter?.actionIndex
                                    );
                                    relatedParametersArray.push(...parameter.relatedParameters);

                                    if (index !== -1) {
                                        temp[index] = {
                                            ...temp[index],
                                        };
                                    } else {
                                        if (
                                            parameter?.parameterType ===
                                            EParameterTypes.INPUT_NUMBER ||
                                            parameter?.parameterType === EParameterTypes.INPUT_TEXT ||
                                            parameter?.parameterType === EParameterTypes.SWITCH
                                        ) {
                                            if (parameter?.defaultValue?.length > 0) {
                                                const defaultValue = parameter?.defaultValue;
                                                temp.push({
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
                                            parameter?.parameterType ===
                                            EParameterTypes.SELECT_MATERIALS
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
                                                let options: any = allMaterials;
                                                let selectedObj: any = {};
                                                if (allMaterials?.length > 0) {
                                                    if (parameter?.materialPath?.length == 1) {
                                                        options = allMaterials?.find((material: any) => {
                                                            return compareStrings(
                                                                material.pathName,
                                                                parameter?.materialPath[0]
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
                                                            ...(data?.id > 0 && {material: data?.id}),
                                                            parameterType: parameter?.parameterType,
                                                            ...(value && {
                                                                valueIds: [value?.materialValueIds[0]?.valueId],
                                                                values: [selectedObj?.value],
                                                            }),
                                                            sectionId: section?.id,
                                                            subSectionId: subSection?.id,
                                                            actionIndex: parameter?.actionIndex,
                                                        });
                                                    }

                                                    if (parameter?.materialPath?.length == 2) {
                                                        options = allMaterials?.find((material: any) => {
                                                            return compareStrings(
                                                                material.pathName,
                                                                parameter?.materialPath[0]
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
                                                                item?.valueIds[0] ===
                                                                value?.materialValueIds[0]?.valueId
                                                        );
                                                        temp.push({
                                                            parameterId: parameter?.id,
                                                            parameterName: parameter?.name,
                                                            actionId: parameter?.actionId,
                                                            ...(data?.id > 0 && {material: data?.id}),
                                                            parameterType: parameter?.parameterType,
                                                            ...(value && {
                                                                valueIds: [value?.materialValueIds[0]?.valueId],
                                                                values: [selectedObj?.value],
                                                            }),
                                                            sectionId: section?.id,
                                                            subSectionId: subSection?.id,
                                                            actionIndex: parameter?.actionIndex,
                                                        });
                                                    }
                                                }
                                            }
                                        } else if (
                                            parameter?.parameterType ===
                                            EParameterTypes.DROP_DOWN_LIST
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
                                                temp.push({
                                                    parameterId: parameter?.id,
                                                    parameterName: parameter?.name,

                                                    actionId:
                                                        value?.activateAction === true
                                                            ? parameter?.actionId
                                                            : null,
                                                    ...(data?.id > 0 && {material: data?.id}),
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
                                            EParameterTypes.SELECT_CHILDS_PARAMETERS
                                        ) {
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
                                                        valueIds: [defaultObject?.id],
                                                        values: [defaultObject?.updateName],
                                                    }),
                                                    sectionId: section?.id,
                                                    subSectionId: subSection?.id,
                                                    actionIndex: parameter?.actionIndex,
                                                });
                                                parameter?.childsParameters?.map((item) => {
                                                    temp.push({
                                                        parameterId: item?.id,
                                                        parameterName: item?.name,
                                                        actionId: item?.actionId,
                                                        parameterType: item?.parameterType,
                                                        values: [item?.defaultValue],
                                                        sectionId: section?.id,
                                                        subSectionId: subSection?.id,
                                                        actionIndex: parameter?.actionIndex,
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
                const filteredArray = newGeneralParameters.filter(
                    (obj) => obj.values[0] !== "false"
                );
                setGeneralParameters(filteredArray);
                setSubProducts(newSubProducts2);
                setRelatedParameters(relatedParametersArray);
                setIsSetTemplete(true);
            }
        }
    }, [materialsEnumsValues, allMaterials, template]);

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
        setGeneralParameters([])
        setGeneralParametersLocal([])
        setItemParmetersValues([])
        setCanCalculation(false)
        setWorkFlows([]);
        setJobActions([]);
        setCalculationProgress({totalWorkFlowsCount: 0,currentWorkFlowsCount:0} )
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
        let temp = JSON.parse(JSON.stringify(subProducts))
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
        const filteredArray = temp.filter((obj) => obj.values[0] !== "false");
        setItemParmetersValues(filteredArray);
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
                    item?.subSectionId === subSection?.id &&
                    item?.actionIndex === parameter?.actionIndex
            );

            return temp[index];
        } else {
            let temp = [...generalParameters];
            const index = temp.findIndex(
                (item) =>
                    item?.parameterId === parameter?.id &&
                    item?.sectionId === section?.id &&
                    item?.subSectionId === subSection?.id &&
                    item?.actionIndex === parameter?.actionIndex
            );
            return temp[index];
        }
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
        const parametersArray = subSection?.type
            ? subProducts.flatMap((item) => item.parameters)
            : generalParameters;
        const temp = [...parametersArray];
        const index = temp.findIndex(
            (item) =>
                item.parameterId === parameter?.id &&
                item.sectionId === section?.id &&
                item.subSectionId === subSection?.id &&
                item?.actionIndex === parameter?.actionIndex
        );
        if (parameter?.parameterType === EParameterTypes.INPUT_NUMBER) {
            Comp = (
                <InputNumberParameterWidget
                    clasess={clasess}
                    parameter={parameter}
                    index={index}
                    temp={temp}
                    onChangeSubProductsForPrice={onChangeSubProductsForPrice}
                    onChangeForPrice={onChangeForPrice}
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
                    onChangeForPrice={onChangeForPrice}
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
                    setSelectedValueConfigForSettings={setSelectedValueConfigForSettings}
                    setSelectedValueForSettings={setSelectedValueForSettings}
                    onChangeForPrice={onChangeForPrice}
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
                    onChangeForPrice={onChangeForPrice}
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
                    onChangeForPrice={onChangeForPrice}
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
                />
            );
        } else if (parameter?.parameterType === EParameterTypes.SELECT_MATERIALS) {
            Comp = (
                <SelectMaterialsParameterWidget
                    allMaterials={allMaterials}
                    parameter={parameter}
                    digitalPriceData={digitalPriceData}
                    subSectionParameters={subSectionParameters}
                    clasess={clasess}
                    index={index}
                    temp={temp}
                    inModal={inModal}
                    onChangeForPrice={onChangeForPrice}
                    subSection={subSection}
                    section={section}
                    setDigidatPriceData={setDigidatPriceData}
                    onChangeSubProductsForPrice={onChangeSubProductsForPrice}
                />
            );
        }

        return (
            <div style={{display: "flex"}}>
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
                {/* This Part for code to display the related Parameters */}
                {parameter?.relatedParameters?.length > 0 && inModal && (
                    <>
                        {parameter.relatedParameters.map((relatedParameter) => {
                            const parm = subSection?.type
                                ? subProductsWithType.find(
                                    (param) => param.parameterId === parameter.id
                                )
                                : generalParameters.find(
                                    (param) => param.parameterId === parameter.id
                                );

                            const myParameter = list.find(
                                (p) => p.id === relatedParameter.parameterId
                            );
                            if (relatedParameter.activateByAllValues && parm?.values) {
                                return (
                                    <div style={{marginLeft: 10}}>
                                        {_renderParameterType(
                                            myParameter,
                                            subSection,
                                            section,
                                            subSection?.parameters,
                                            myParameter.value,
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
                                            <div style={{marginLeft: 10}}>
                                                {_renderParameterType(
                                                    myParameter,
                                                    subSection,
                                                    section,
                                                    subSection?.parameters,
                                                    myParameter.value,
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
                                            <div style={{marginLeft: 10}}>
                                                {_renderParameterType(
                                                    myParameter,
                                                    subSection,
                                                    section,
                                                    subSection?.parameters,
                                                    myParameter.value,
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
            </div>
        );
    };
    const onChangeForPrice = (
        parameterId: any,
        subSectionId: any,
        sectionId: any,
        ParameterType: any,
        parameterName: any,
        actionId: any,
        data: any,
        index: any,
        actionIndex: number
    ) => {
        setCanCalculation(true);
        setGeneralParameters((prev) => {
            let temp = [...prev];
            if (index !== -1) {
                temp[index] = {
                    ...temp[index],
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
            if (data?.valueIds === undefined && data?.values === undefined) {
                temp.splice(index, 1);
            }
            const filteredArray = temp.filter((obj) => obj.values[0] !== "false");
            return filteredArray;
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
        index: any,
        actionIndex: number
    ) => {
        setCanCalculation(true);
        const targetSubProduct = subProducts.find(
            (item) => item.type === subSectionType
        );
        if (targetSubProduct) {
            let temp = [...targetSubProduct.parameters];

            const findIndex = temp.findIndex(
                (item) => item.parameterId === parameterId
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
            let temp2 = [...subProducts];
            const index2 = subProducts.findIndex(
                (item) => item.type === subSectionType
            );
            (temp2[index2] = {
                type: subSectionType,
                sectionId: sectionId,
                parameters: temp,
            }),
                setSubProducts(temp2);
        } else {
            let temp = [];
            if (index !== -1) {
                temp[index] = {
                    ...temp[index],
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
            if (data?.valueIds === undefined && data?.values === undefined) {
                temp.splice(index, 1);
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
        if(requestAbortController){
            requestAbortController.abort()
        }
        setWorkFlows([]);
        setJobActions([]);
        setCalculationProgress({totalWorkFlowsCount: 0,currentWorkFlowsCount:0} )
        
        let checkParameter = validateParameters(isRequiredParameters);
        if (!!checkParameter) {
            setLoading(true);
            const newRequestAbortController = new AbortController();
            setRequestAbortController(newRequestAbortController)
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
                false,
                newRequestAbortController
            );
            //Check it is work
            if (res?.success) {
                // setPricingDefaultValue(res?.data?.data?.data);
                /*setWorkFlows(
                    res?.data?.data?.data?.workFlows?.map((flow, index) => ({
                        id: index.toString(),
                        ...flow,
                    }))
                );
                setJobActions(res?.data?.data?.data?.actions);*/
            }
            setLoading(false);
        }
    }, [
        generalParameters,
        subProducts,
        router,
        isRequiredParameters,
        validateParameters,
    ]);

    const getOutSourcingSuppliers = () => {
        const callBack = (res) => {
            if (res.success) {
                setOutSuppliers(res.data);
            }
        }
        getOutsourcingSuppliersListApi(callApi, callBack, {
            // clientId: router?.query?.customerId,
            // clientTypeId: router?.query?.clientTypeId,
            // productId: router?.query?.productId,
            // generalParameters: generalParameters,
            // subProducts: subProducts,
        }).then();
    }

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
                    //details: pricingDefaultValue?.jobDetails,
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
        console.log(defaultPrice)
        const res = await callApi("POST", `/v1/erp-service/quote/add-item`, {
            supplierId: '',
            sourceType: workFlowSelected?.actions?.every(action => action?.source === EWorkSource.INTERNAL) ? EWorkSource.INTERNAL : EWorkSource.PARTIALLY,
            productId: router?.query?.productId,
            userID: userProfile?.id,
            customerID: router?.query?.customerId,
            clientTypeId: router?.query?.clientTypeId,
            unitPrice: +defaultPrice?.values[0] / +quantity?.values[0],
            amount: quantity?.values[0],
            isNeedGraphics: false,
            isUrgentWork: urgentOrder,
            printingNotes,
            graphicNotes,
            isNeedExample: false,
            jobDetails: '',
            itemParmetersValues: itemParmetersValues,
            workFlow: pricingDefaultValue?.workFlows.length > 0
                ? [workFlowSelected]
                : template?.workFlows,
            actions: pricingDefaultValue?.actions?.length > 0
                ? pricingDefaultValue?.actions
                : template?.actions,
            outSoucreCost: 0,
            outSoucreProfit: 0,
            outSourceFinalPrice: 0,
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
            setPricingDefaultValue({
                actions: template?.actions,
                jobDetails: template?.jobDetails,
                workFlows: template?.workFlows,
            });
            setDefaultPrice(template?.quoteItem?.unitPrice * quantity?.values[0]);
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
                supplierId: '',
                userID: userProfile?.id,
                customerID: router?.query?.customerId,
                clientTypeId: router?.query?.clientTypeId,
                amount: quantity?.values[0],
                isNeedGraphics: false,
                isUrgentWork: urgentOrder,
                printingNotes,
                graphicNotes,
                isNeedExample: false,
                jobDetails: pricingDefaultValue?.jobDetails,
                itemParmetersValues: itemParmetersValues,
                workFlow:
                    pricingDefaultValue?.workFlows != null
                        ? [workFlowSelected]
                        : template?.workFlows,
                actions:
                    pricingDefaultValue?.actions?.length > 0
                        ? pricingDefaultValue?.actions
                        : template?.actions,
                sourceType: workFlowSelected?.actions?.every(action => action?.source === EWorkSource.INTERNAL) ? EWorkSource.INTERNAL : EWorkSource.PARTIALLY,
                unitPrice: +defaultPrice?.values[0] / +quantity?.values[0],
                outSoucreCost: 0,
                outSoucreProfit: 0,
                outSourceFinalPrice: 0,
            },
        );
        if (res?.success) {
            navigate("/quote");
            setWorkFlows([]);
            setJobActions([]);
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
        template,
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


    useEffect(() => {
        setPricingDefaultValue({
            actions: jobActions,
            workFlows,
            jobDetails,
        });
    }, [workFlows, jobActions, jobDetails]);

    // useEffect(() => {
    //   let temp = [...generalParameters];
    //   const filteredArray = temp.filter((obj) => obj.values[0] !== "false");
    // }, [generalParameters]);
    return {
        t,
        handleTabClick,
        handleNextClick,
        handlePreviousClick,
        onOpeneMakeShape,
        onCloseGalleryModal,
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
        onOpeneMultiParameterModal,
        onCloseMultiParameterModal,
        setSamlleType,
        duplicateParameters,
        setTemplate,
        multiParameterModal,
        settingParameters,
        priceRecovery,
        graphicNotes,
        printingNotes,
        urgentOrder,
        defaultPrice,
        makeShapeOpen,
        GalleryModalOpen,
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
        workFlowSelected,
        relatedParameters,
        workFlows,
        jobDetails,
        jobActions,
        getOutSourcingSuppliers
    };
};
export {useDigitalOffsetPrice};
