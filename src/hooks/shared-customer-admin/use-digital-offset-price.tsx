import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { materialsCategoriesState } from "@/store/material-categories";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import {
  getAndSetChatBotProductId,
  getAndSetProductById,
  getAndSetProfitProfileReviewProductId,
} from "@/services/hooks";
import {
  currentCalculationConnectionId,
  foldOptionsState,
  isActionEmployeeUpdatedState,
  isChangePriceForEditState,
  isLoadgingState,
  listEmployeesAtom,
  loadingWithShadowState,
  productItemValueByEditState,
  productTypesNumberState,
  selectedValueConfigState,
  selectParameterButtonState,
  subProductsCopyParametersState,
  subProductsParametersState,
  systemCurrencyState,
  userState,
} from "@/store";
import cloneDeep from "lodash/cloneDeep";
import lodashClonedeep from "lodash.clonedeep";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";
import { compareStrings, getParameterByParameterCode } from "@/utils/constants";
import {
  DuplicateType,
  EButtonTypes,
  EParameterTypes,
  GraphicsTypesParam,
  SampleTypeParm,
  UNIT_TYPE,
} from "@/enums";
import { QuantityParameter } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-parameter";
import { InputNumberParameterWidget } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/input-number-parameter";
import { DropDownListParameterWidget } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/drop-down-list-parameter";
import { SelectChildParameterWidget } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/select-child-parameter";
import { SWITCHParameterWidget } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/switch-parameter";
import { ButtonParameterWidget } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/button-parameter";

import {
  additionalProductItemsState,
  calculatedPriceProductItemValueState,
  calculationExceptionsLogsState,
  calculationProgressState,
  calculationResultState,
  currentCalculatedTotalPriceState,
  currentCalculationSessionIdState,
  currentProductItemValueDraftId,
  currentProductItemValuePriceState,
  currentProductItemValueState,
  currentProductItemValueTotalWorkFlowsState,
  jobActionsState,
  jobDetailsState,
  lastProductItemValuePriceState,
  localStateValueState,
  outsourceSuppliersState,
  productUrgentWorkState,
  selectedWorkFlowState,
  sliderCurrentProductItemValuePriceState,
  workFlowsState,
} from "@/widgets/product-pricing-widget/state";
import { getOutsourcingSuppliersListApi } from "@/services/api-service/suppliers/suppliers-endpoints";
import { v4 as uuidv4 } from "uuid";
import {
  addItemApi,
  getProductByItemIdApi,
  updateDocumentItemApi,
} from "@/services/api-service/generic-doc/documents-api";
import {
  openQuantityComponentModalState,
  productQuantityTypesValuesState,
  tempProductQuantityTypesValuesState,
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import {
  checkIfDieCutOrDieKissCutExists,
  findParameterByCode,
  hasValues,
} from "@/utils/helpers";
import React from "react";
import { getCurrenciesSymbols } from "@/services/api-service/general/enums";
import { currenciesSymbols } from "@/widgets/materials-widget/state";
import { exampleTypeState } from "@/store/example-type";
import { billingMethodState } from "@/store/billing-method";
import { useDebouncedCallback } from "use-debounce";
import { getDeviceSizeMockApi } from "@/services/api-service/materials/materials-endpoints";
import { AdvertisingProductNameParameterWidget } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/advertising-product-name";
import { getAllFoldOptions } from "@/services/api-service/parameters/parameters-outputs";
import { useMaterials } from "../use-materials";
import { ESourceView } from "@/enums/products";
import { EWorkSource } from "@/widgets/product-pricing-widget/enums";
import { useCalculationSocketIO } from "@/hooks/socket-io/use-calculation-socket-io";
import { selectWorkflowByIdApi } from "@/services/api-service/generic-doc/quote-confirmation-api";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useModal } from "../use-modal";
import { FONT_FAMILY } from "@/utils/font-family";

export interface SampleTypeOption {
  value: number;
  text: string;
}

const useDigitalOffsetPrice = ({ clasess, widgetType }) => {
  const [, setOpenQuantityComponentModal] = useRecoilState<boolean>(
    openQuantityComponentModalState
  );
  const { navigate } = useGomakeRouter();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const direction = t("direction");
  const router = useRouter();
  const { alertFaultAdded, alertFaultUpdate, alertFault } = useSnackBar();
  const [isChargeForNewDie, setIsChargeForNewDie] = useState(false);
  const { allMaterials, getAllMaterial } = useMaterials();
  const [selectedValueConfig, setSelectedValueConfig] = useRecoilState(
    selectedValueConfigState
  );
  const productTypesNumber = useRecoilValue<number>(productTypesNumberState);
  const setFoldOptions = useSetRecoilState(foldOptionsState);

  const [workTypes, setWorkTypes] = useState<any>([]);
  const [missionsListForEdit, setMissionsListForEdit] = useState<any>([]);
  const [sampleType, setSampleType] = useState<SampleTypeOption | null>(null);
  const [isRequiredParameters, setIsRequiredParameters] = useState<any>([]);
  const [activeSectionRequiredParameters, setActiveSectionRequiredParameters] =
    useState([]);
  const [documentItemByEdit, setdocumentItemByEdit] = useState<any>({});
  const [productItemValueByEdit, setProductItemValueByEdit] =
    useRecoilState<any>(productItemValueByEditState);
  const [GalleryModalOpen, setGalleryModalOpen] = useState(false);
  const [multiParameterModal, setMultiParameterModal] = useState(false);
  const [makeShapeOpen, setMakeShapeOpen] = useState(false);
  const [urgentOrder, setUrgentOrder] = useRecoilState(productUrgentWorkState);
  const [printingNotes, setPrintingNotes] = useState("");
  const [graphicNotes, setGraphicNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [productTemplate, setProductTemplate] = useState<any>([]);
  const [updatedProductTemplate, setupdatedProductTemplate] = useState<any>();
  const [defaultProductTemplate, setDefaultProductTemplate] = useState<any>([]);
  const [subProducts, setSubProducts] = useRecoilState<any>(
    subProductsParametersState
  );
  const [isMigratedFromOldSystem, setIsMigratedFromOldSystem] = useState(false);
  const [ignoreCalculatedWorkflows, setIgnoreCalculatedWorkflows] = useState(
    productTemplate?.ignoreCalculatedWorkflows
  );

  useEffect(() => {
    setIgnoreCalculatedWorkflows(
      productTemplate?.ignoreCalculatedWorkflows || false
    );
  }, [productTemplate?.ignoreCalculatedWorkflows]);

  const [subProductsColorsModal, setSubProductsColorsModal] =
    useRecoilState<any>(subProductsCopyParametersState);
  const [isSetTemplete, setIsSetTemplete] = useState<boolean>(false);
  const setSubProductsCopy = useSetRecoilState<any>(
    subProductsCopyParametersState
  );
  const [currentProductItemValue, setCurrentProductItemValue] =
    useRecoilState<any>(currentProductItemValueState);
  const [productItemValueDraftId, setCurrentProductItemValueDraftId] =
    useRecoilState<string>(currentProductItemValueDraftId);
  const setAdditionalProductItems = useSetRecoilState<any>(
    additionalProductItemsState
  );
  const [isFlowChanged, stIsFlowChanged] = useState(false);
  const [isOpenCreateDefaultWorkFlow, setIsOpenCreateDefaultWorkFlow] =
    useState(false);
  const onClickOpenCreateDefaultWorkFlow = () => {
    setIsOpenCreateDefaultWorkFlow(true);
  };
  const onClickCloseCreateDefaultWorkFlow = () => {
    setCurrentProductItemValueDraftId(null);
    setIsOpenCreateDefaultWorkFlow(false);
  };

  const systemCurrency = useRecoilValue<any>(systemCurrencyState);

  const [
    currentProductItemValueTotalPrice,
    setCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(currentProductItemValuePriceState);
  const [lastProductItemValueTotalPrice, setLastProductItemValueTotalPrice] =
    useRecoilState<number>(lastProductItemValuePriceState);
  const setCurrentProductItemValueTotalWorkFlows = useSetRecoilState<number>(
    currentProductItemValueTotalWorkFlowsState
  );
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
  const [quantityTypes, setQuantityTypes] = useRecoilState(
    productQuantityTypesValuesState
  );

  const [calculationProgress, setCalculationProgress] = useRecoilState(
    calculationProgressState
  );
  const setCalculationResult = useSetRecoilState(calculationResultState);
  const jobDetails = useRecoilValue(jobDetailsState);
  const [jobActions, setJobActions] = useRecoilState(jobActionsState);
  const setOutSuppliers = useSetRecoilState(outsourceSuppliersState);
  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  const [isLoadingPrice, setLoading] = useRecoilState(isLoadgingState);
  const setLoadingWithLockScreen = useSetRecoilState(loadingWithShadowState);

  const [priceRecovery, setPriceRecovery] = useState(true);
  const [canCalculation, setCanCalculation] = useState(false);
  const setSelectParameterButton = useSetRecoilState(
    selectParameterButtonState
  );
  const [deviceCategory, setDeviceCategory] = useState("");
  const [deviceSize, setDeviceSize] = useState("");

  const [isActionEmployeeUpdated, setIsActionEmployeeUpdated] = useRecoilState(
    isActionEmployeeUpdatedState
  );
  const [isChangePriceForEdit, setIsChangePriceForEdit] = useRecoilState(
    isChangePriceForEditState
  );

  const [isJobNameValue, setIsJobNameValue] = useState(false);
  const [saveCurrentStation, setSaveCurrentStation] = useState(false);
  const onClickCloseCurrentStationModal = () => {
    setSaveCurrentStation(false);
  };
  const onClickOpenCurrentStationModal = () => {
    setSaveCurrentStation(true);
  };
  useEffect(() => {
    setValuesState([]);
  }, []);

  useEffect(() => {
    if (widgetType != EWidgetProductType.CREATE) setLoading(false);
  }, []);

  const onClickCloseChangePriceModal = () => {
    setIsChangePriceForEdit(false);
    setIsActionEmployeeUpdated(false);
    setIsJobNameValue(false);
  };
  useEffect(() => {
    if (quantityTypes?.length > 0) {
      setWorkTypes(quantityTypes);
    } else if (productTypesNumber === 1 || productTypesNumber === 0) {
      setWorkTypes([]);
    }
  }, [quantityTypes, productTypesNumber]);
  const {
    calculationResult,
    connectionId,
    startCalculationData,
    updatedSelectedWorkFlow,
    calculationExceptionsLogs,
    signalRPricingResult,
    calculationServerError,
    isCalculationFinished,
    newDieCutSelect,
    setIsCalculationFinished,
  } = useCalculationSocketIO();
  useEffect(() => {
    setProductItemValueByEdit({});
  }, []);
  const generateConnectionId = (connectionId: string) => {
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    let randomConnectionId = connectionId + randomNumber;
    return randomConnectionId;
  };
  useEffect(() => {
    const oldConnectionId = currentSignalRConnectionId;
    if (oldConnectionId && connectionId && connectionId !== oldConnectionId) {
      updateSignalRConnectionId(oldConnectionId, connectionId);
    }
    setCurrentSignalRConnectionId(connectionId);
  }, [connectionId]);

  const updateSignalRConnectionId = async (
    oldSignalRConnectionId,
    newSignalRConnectionId
  ) => {
    const res: any = await callApi(
      "POST",
      `/v1/erp-service/quote/update-product-item-value-signalr-connect-id`,
      {
        oldSignalRConnectionId: oldSignalRConnectionId,
        newSignalRConnectionId: newSignalRConnectionId,
      },
      false
    );
  };
  useEffect(() => {
    if (calculationResult && (widgetType != EWidgetProductType.EDIT || widgetType != EWidgetProductType.DUPLICATE)) {
      setCalculationResult(calculationResult);
    }
  }, [calculationResult]);

  useEffect(() => {
    if (calculationServerError) {
      setcalculationServerErrorState(true);
      setCalculationProgress({
        totalWorkFlowsCount: 0,
        currentWorkFlowsCount: 0,
      });
      //setLoading(false);
    }
  }, [calculationServerError]);

  useEffect(() => {
    if (isCalculationFinished) {
      setCalculationProgress({
        totalWorkFlowsCount: 0,
        currentWorkFlowsCount: 0,
      });
    }
  }, [isCalculationFinished]);
  const [calculationServerErrorState, setcalculationServerErrorState] =
    useState(false);
  const [showCalculationInCompletedAlert, setShowCalculationInCompletedAlert] =
    useState(false);
  const [showCalculationInCompletedModal, setShowCalculationInCompletedModal] =
    useState(false);
  const [currentSignalRConnectionId, setCurrentSignalRConnectionId] =
    useRecoilState(currentCalculationConnectionId);
  const [currentCalculationSessionId, setCurrentCalculationSessionId] =
    useRecoilState<any>(currentCalculationSessionIdState);
  const [requestAbortController, setRequestAbortController] =
    useState<AbortController>(null);
  const [billingMethod, setBillingMethod] = useState<any>();
  const [graphicDesigner, setGraphicDesigner] = useState<any>();
  const [includeVAT, setIncludeVAT] = useState<boolean | null>(null);
  const [
    sliderCurrentProductItemValueTotalPrice,
    setSliderCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(sliderCurrentProductItemValuePriceState);
  const [localStateValue, setLocalStateValue] = useRecoilState<number>(localStateValueState);
  const [currentCalculatedTotalPrice, setCurrentCalculatedTotalPrice] =
    useRecoilState<number>(currentCalculatedTotalPriceState);
  useEffect(() => {
    if (widgetType == EWidgetProductType.CREATE) {
      let copy = lodashClonedeep(subProducts);
      setSubProductsCopy(copy);
    }
  }, [subProducts, widgetType]);
  const [isCanGetSelected, setIsCanGetSelected] = useState(false);
  const [isFirstTimeEnterPageWhenEdit, setIsFirstTimeEnterPageWhenEdit] = useState(true);
  useEffect(() => {
    if (
      widgetType == EWidgetProductType.EDIT ||
      widgetType == EWidgetProductType.DUPLICATE
    ) {
      setIsCanGetSelected(true);
    }
  }, []);
  useEffect(() => {
    if (
      calculationResult &&
      calculationResult.productItemValueDraftId ===
      currentCalculationSessionId &&
      calculationResult.signalRConnectionId === currentSignalRConnectionId &&
      !productTemplate?.isHaveFixedAction
    ) {
      getSelectedWorkFlow(
        calculationResult.signalRConnectionId,
        calculationResult?.isNeedPriceUpdate
      );
      getSelectedWorkFlowDeliveryDate(
        calculationResult.signalRConnectionId,
        calculationResult?.isNeedPriceUpdate
      );
    }
    if (productTemplate?.isHaveFixedAction && isCanGetSelected) {
      getSelectedWorkFlow(
        calculationResult.signalRConnectionId,
        calculationResult?.isNeedPriceUpdate
      );
      getSelectedWorkFlowDeliveryDate(
        calculationResult.signalRConnectionId,
        calculationResult?.isNeedPriceUpdate
      );
    }
  }, [calculationResult, currentCalculationSessionId, priceRecovery]);
  const [
    selectedWorkFlowCalculatedIsLoaded,
    setSelectedWorkFlowCalculatedIsLoaded,
  ] = useState<boolean>(false);

  const setCalculatedPriceProductItemValue = useSetRecoilState<number>(
    calculatedPriceProductItemValueState
  );

  const _setDataFromSelectedWorkFlow = (
    res,
    calculationSessionId?,
    isOneData?
  ) => {
    if (!res.success) {
      setCalculationProgress({
        totalWorkFlowsCount: 0,
        currentWorkFlowsCount: 0,
      });
      setcalculationServerErrorState(true);
      setWorkFlows([]);
      setCurrentProductItemValueTotalPrice(null);
      setSliderCurrentProductItemValueTotalPrice(null);
      setLocalStateValue(null);
      setCurrentCalculatedTotalPrice(null);
      setCalculationExceptionsLogs(null);
      setCalculationExceptionsLogs(null);
      setCurrentProductItemValueTotalWorkFlows(null);
      setcalculationServerErrorState(true);
      return;
    }
    setLoading(false);
    const result = isOneData ? res?.data : res?.data?.data?.data;
    if (result.productItemValueDraftId === calculationSessionId) {
      const responseConnectionId = result?.signalRConnectionId;
      setShowCalculationInCompletedAlert(
        result?.showCalculationInCompletedAlert
      );
      setShowCalculationInCompletedModal(false);
      setCalculationExceptionsLogs(result?.productItemValue?.exceptions);
      setCurrentProductItemValueDraftId(result.productItemValueDraftId);
      setCurrentCalculationSessionId(result.productItemValueDraftId);
      stIsFlowChanged(result.isFlowChanged);
      setAdditionalProductItems(result.additionalProductItems);

      setCalculationProgress({
        totalWorkFlowsCount: 0,
        currentWorkFlowsCount: 0,
      });
      setCurrentProductItemValueTotalWorkFlows(
        result.productItemValue.totalWorkFlows
      );
      setWorkFlows(result.productItemValue.workFlows);
      setCurrentProductItemValueTotalPrice(parseFloat(result.totalPrice));
      setSliderCurrentProductItemValueTotalPrice(parseFloat(result.totalPrice));
      setCurrentCalculatedTotalPrice(parseFloat(result.calculatedPrice));
      setJobActions(result?.productItemValue.actions);
      setCalculationResult(result);
      if (
        (widgetType === EWidgetProductType.EDIT || widgetType === EWidgetProductType.DUPLICATE) &&
        (isActionEmployeeUpdated || isJobNameValue)
      ) {
        setIsChangePriceForEdit(true);
        setIsActionEmployeeUpdated(false);
        setIsJobNameValue(false);
        setSelectedWorkFlowCalculatedIsLoaded(false);
      }
      setSelectedWorkFlowCalculatedIsLoaded(false);
    }
  };

  const getSelectedWorkFlow = async (
    connectionId,
    IsNeedPriceUpdate?,
    newCalculationSessionId?
  ) => {
    // setSelectedWorkFlowCalculatedIsLoaded(true)
    const docType = router?.query?.documentType ?? "0";
    const documentItemId = router?.query?.documentItemId;
    let url = `/v1/erp-service/productItemValueDrafts/get-selected-work-flow?signalRConnectionId=${connectionId}&productId=${router?.query?.productId
      }&ignoreCalculatedWorkflows=${ignoreCalculatedWorkflows ? ignoreCalculatedWorkflows : false
      }`;
    if (documentItemId) {
      url += `&documentItemId=${documentItemId}&docType=${docType}&restoreAdditonalProductPrice=${IsNeedPriceUpdate ? false : priceRecovery
        }`;
    }

    const res: any = await callApi("GET", url, {}, false);
    _setDataFromSelectedWorkFlow(
      res,
      newCalculationSessionId ?? currentCalculationSessionId
    );
  };
  const [deliveryDate, setDeliveryDate] = useState<any>();
  const getSelectedWorkFlowDeliveryDate = async (
    connectionId,
    IsNeedPriceUpdate?,
    newCalculationSessionId?
  ) => {
    // setSelectedWorkFlowCalculatedIsLoaded(true)
    const docType = router?.query?.documentType ?? "0";
    const documentItemId = router?.query?.documentItemId;
    let url = `/v1/erp-service/productItemValueDrafts/get-selected-work-flow-delivery-date?signalRConnectionId=${connectionId}`;
    if (documentItemId) {
      url += `&documentItemId=${documentItemId}&docType=${docType}&restoreAdditonalProductPrice=${IsNeedPriceUpdate ? false : priceRecovery
        }`;
    }

    const res: any = await callApi("GET", url, {}, false);
    const result = res?.data?.data?.data;
    setDeliveryDate(result);
  };

  const setSelectedWorkflow = (newWorkFlows, currentWorkFlows) => {
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
        const workFlow = currentWorkFlows.find((x) => x.id === m.workFlowId);
        if (workFlow) {
          workFlow.monials = m?.monials;
          workFlow.recommendationRang = m?.recommendationRang;
        }
      });
    }
    currentWorkFlows.sort((a, b) => b.monials - a.monials);

    let myselectedWorkFlow = currentWorkFlows?.find((x) => x.selected);
    if (
      !myselectedWorkFlow &&
      currentWorkFlows &&
      currentWorkFlows.length > 0
    ) {
      currentWorkFlows[0].selected = true;
    }
    myselectedWorkFlow = currentWorkFlows?.find(
      (x) => x.selected && x.isCompleteWorkFlow
    );
    if (
      myselectedWorkFlow &&
      myselectedWorkFlow.isCompleteWorkFlow &&
      myselectedWorkFlow.totalPrice &&
      myselectedWorkFlow.totalPrice.values &&
      !priceRecovery
    ) {
      setCurrentProductItemValueTotalPrice(
        parseFloat(myselectedWorkFlow.totalPrice.values[0])
      );
      setSliderCurrentProductItemValueTotalPrice(
        parseFloat(myselectedWorkFlow.totalPrice.values[0])
      );
    }
    return currentWorkFlows;
  };

  useEffect(() => {
    if (
      signalRPricingResult &&
      signalRPricingResult.productItemValueDraftId ===
      currentCalculationSessionId &&
      signalRPricingResult.signalRConnectionId === currentSignalRConnectionId
    ) {
      //setLoading(false);
      const totalWorkFlowsCount = signalRPricingResult.totalWorkFlows;
      const currentWorkFlowsCount =
        signalRPricingResult.currentWorkFlowIndex >
          calculationProgress.currentWorkFlowsCount
          ? signalRPricingResult.currentWorkFlowIndex
          : calculationProgress.currentWorkFlowsCount + 1;
      if (
        signalRPricingResult.isCalculationFinished &&
        signalRPricingResult.totalPrice &&
        !isNaN(signalRPricingResult.totalPrice)
      ) {
        setCurrentProductItemValueTotalPrice(
          parseFloat(signalRPricingResult.totalPrice)
        );
        setSliderCurrentProductItemValueTotalPrice(
          parseFloat(signalRPricingResult.totalPrice)
        );
      }
      if (signalRPricingResult.isCalculationFinished) {
        setCalculationProgress({
          totalWorkFlowsCount: 0,
          currentWorkFlowsCount: 0,
        });
      } else {
        setCalculationProgress({
          totalWorkFlowsCount: totalWorkFlowsCount,
          currentWorkFlowsCount: currentWorkFlowsCount,
        });
      }
    }
  }, [signalRPricingResult]);

  useEffect(() => {
    if (
      startCalculationData &&
      startCalculationData.signalRConnectionId === currentSignalRConnectionId
    ) {
      setWorkFlows([]);
      setCurrentProductItemValueTotalPrice(null);
      setSliderCurrentProductItemValueTotalPrice(null);
      setLocalStateValue(null);
      setCurrentCalculatedTotalPrice(null);
      setJobActions([]);
      setIsCalculationFinished(false);
      setCalculationProgress({
        totalWorkFlowsCount: 0,
        currentWorkFlowsCount: 0,
      });
      setCurrentCalculationSessionId(
        startCalculationData.productItemValueDraftId
      );
      setCalculationExceptionsLogs(startCalculationData.calculationExceptions);
    }
  }, [startCalculationData]);

  useEffect(() => {
    if (calculationExceptionsLogs) {
      setCalculationExceptionsLogs(calculationExceptionsLogs);
    }
  }, [calculationExceptionsLogs]);

  useEffect(() => {
    if (updatedSelectedWorkFlow) {
      if (workFlows.find((x) => x.id == updatedSelectedWorkFlow?.id)) {
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
      } else {
        let temp = workFlows.map((flow) => {
          return { ...flow, selected: false };
        });
        temp.forEach((item) => {
          if (updatedSelectedWorkFlow.orginalBookPartId === item.id) {
            item.selected = true;
          }
          if (updatedSelectedWorkFlow.subWorkFlows) {
            updatedSelectedWorkFlow.subWorkFlows.forEach((subFlow) => {
              if (subFlow.orginalBookPartId === item.id) {
                item.selected = true;
              }
            });
          }
        });

        setWorkFlows([...temp, { ...updatedSelectedWorkFlow, selected: true }]);
      }
      if (
        updatedSelectedWorkFlow?.totalPrice &&
        updatedSelectedWorkFlow?.totalPrice?.values
      ) {
        if (
          (widgetType === EWidgetProductType.EDIT || widgetType === EWidgetProductType.DUPLICATE) &&
          (isActionEmployeeUpdated || isJobNameValue)
        ) {
          setIsChangePriceForEdit(true);
          setIsActionEmployeeUpdated(false);
          setIsJobNameValue(false);
        }
        setCurrentProductItemValueTotalPrice(
          +updatedSelectedWorkFlow?.totalPrice.values[0]
        );
        setSliderCurrentProductItemValueTotalPrice(
          +updatedSelectedWorkFlow?.totalPrice.values[0]
        );
      }
    }
  }, [updatedSelectedWorkFlow]);

  useEffect(() => {
    const total = quantityTypes.reduce((acc, val) => acc + val.quantity, 0);
    let subProductCopy = cloneDeep(subProducts);
    subProductCopy.forEach((subProduct) => {
      if (!subProduct.type) {
        subProduct.parameters.forEach((parameter) => {
          if (
            parameter.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
          ) {
            parameter.values = [total + ""];
          }
        });
      }
    });
    setSubProducts(subProductCopy);
  }, [quantityTypes]);

  const selectBtnTypeToAction = (
    parameter,
    sectionId,
    subSectionId,
    index,
    paameterType,
    actionIndex
  ) => {
    if (parameter?.buttonAction === EButtonTypes.GALLERY_MODAL) {
      setSelectParameterButton({
        parameter,
        sectionId,
        subSectionId,
        index,
        paameterType,
        actionIndex,
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
    let defaultProductTemplateCopy = cloneDeep(productTemplate);
    const productTemplateCopy = cloneDeep(productTemplate);

    const section = defaultProductTemplateCopy.sections.find(
      (x) => x.id === item.id
    );
    let sectionCopy = cloneDeep(section);
    sectionCopy.isCanDeleted = true; // Set isCanDeleted to true

    const numberOfCopies = productTemplateCopy.sections.filter(
      (x) => x.duplicatedFromSectionId === item.id
    ).length;

    if (!numberOfCopies) {
      section.index = 0;
    }

    sectionCopy.index = numberOfCopies + 1;
    sectionCopy.name = sectionCopy.name + " " + (sectionCopy.index + 1);
    sectionCopy.duplicatedFromSectionId = item.id;
    sectionCopy.id = uuidv4();

    sectionCopy.isCanDeleted = true; // Set isCanDeleted to true
    sectionCopy.subSections.forEach((sub) => {
      sub.duplicatedFromSubSectionId = sub.id;
      sub.id = sub.id; // Keep the same ID as requested
      if (sub.type) {
        sub.type = sub.type + numberOfCopies + 1;
      }
    });

    // Add section to productTemplate
    const sectionsArr = [];
    productTemplateCopy.sections.forEach((sec) => {
      sectionsArr.push(sec);
      if (!numberOfCopies && sec.id === item.id) {
        sectionsArr.push(sectionCopy);
      } else if (numberOfCopies && sec.index == numberOfCopies) {
        sectionsArr.push(sectionCopy);
      }
    });
    productTemplateCopy.sections = sectionsArr;

    // Add section to subProducts manually
    if (subProducts && subProducts.length > 0) {
      const subProductsCopy = cloneDeep(subProducts);

      // Create a single subProduct entry for the duplicated section
      // Find the original subProduct entry that matches this section
      const originalSubProduct = subProducts.find(sub => sub.sectionId === item.id);

      if (originalSubProduct) {
        // Create new subProduct entry based on the original
        const newSubProductEntry = {
          type: sectionCopy.subSections[0]?.type || originalSubProduct.type, // Use the new type from duplicated section
          sectionId: sectionCopy.id,
          sectionName: sectionCopy.name,
          parameters: []
        };

        // Copy all parameters from the original subProduct and update their IDs
        if (originalSubProduct.parameters) {
          originalSubProduct.parameters.forEach((param) => {
            // Find the corresponding subsection in the duplicated section
            const matchingSubSection = sectionCopy.subSections.find(sub =>
              sub.duplicatedFromSubSectionId === param.subSectionId
            );

            if (matchingSubSection) {
              const paramCopy = cloneDeep(param);

              // Keep the same parameter ID as requested
              paramCopy.sectionId = sectionCopy.id;
              paramCopy.subSectionId = matchingSubSection.id;

              // Ensure isHidden value is preserved from the original
              // This is important - we're explicitly preserving the isHidden state
              paramCopy.isHidden = param.isHidden;

              // Update relatedParameters section references and validate them
              if (paramCopy.relatedParameters && paramCopy.relatedParameters.length > 0) {
                // First, update section references
                let updatedRelatedParameters = paramCopy.relatedParameters.map((relParam) => {
                  const relParamCopy = cloneDeep(relParam);

                  // Update section ID if it matches the original section
                  if (relParam.sectionId === item.id) {
                    relParamCopy.sectionId = sectionCopy.id;
                  }

                  // Keep the same subsection ID since we're not changing them
                  // Keep the same parameter ID since we're not changing them

                  return relParamCopy;
                });

                // Now validate that the related parameters exist in the corresponding subsection
                let validatedRelatedParameters = [];

                updatedRelatedParameters.forEach((relatedParameter) => {
                  // Find the subsection that contains this related parameter
                  const targetSubSection = sectionCopy.subSections.find(
                    sub => sub.id === relatedParameter.subSectionId
                  );

                  if (targetSubSection && targetSubSection.parameters) {
                    // Check if the relatedParameter's parameterId exists in the target subsection's parameters
                    const isParameterIdExisting = targetSubSection.parameters.some(
                      (p) => p.id === relatedParameter.parameterId
                    );

                    if (isParameterIdExisting) {
                      validatedRelatedParameters.push(relatedParameter);
                    }
                    // If the parameter doesn't exist, we skip it (don't add to validated array)
                  }
                });

                // Update the paramCopy with only valid related parameters
                paramCopy.relatedParameters = validatedRelatedParameters;
              }

              newSubProductEntry.parameters.push(paramCopy);
            }
          });
        }

        // Find the position to insert the new entry
        let insertIndex = subProductsCopy.length; // Default to end

        // Find the position after the last duplicate of this section
        for (let i = 0; i < subProductsCopy.length; i++) {
          if (subProductsCopy[i].sectionId === item.id) {
            // Found original section, look for the last duplicate
            let lastIndex = i;
            for (let j = i + 1; j < subProductsCopy.length; j++) {
              // Check if this is a duplicate of the same original section
              const checkSection = productTemplateCopy.sections.find(s => s.id === subProductsCopy[j].sectionId);
              if (checkSection && checkSection.duplicatedFromSectionId === item.id) {
                lastIndex = j;
              } else {
                break;
              }
            }
            insertIndex = lastIndex + 1;
            break;
          }
        }

        // Insert the new entry
        subProductsCopy.splice(insertIndex, 0, newSubProductEntry);

        // Update subProducts state
        setSubProducts(subProductsCopy);
      }
    }
    // Update productTemplate
    setProductTemplate(productTemplateCopy);

    // Instead of adding to existing relatedParameters, rebuild the entire array
    // This matches the logic in initProduct
    let allRelatedParametersArray = [];
    let allUnderParameterIdsArray = [];

    productTemplateCopy.sections.forEach((section) => {
      section.subSections.forEach((subSection) => {
        subSection.parameters.forEach((parameter) => {
          // Handle relatedParameters
          if (parameter.relatedParameters && parameter.relatedParameters.length > 0) {
            parameter.relatedParameters.forEach((relatedParameter) => {
              // Check if the relatedParameter's parameterId exists in parameters
              const isParameterIdExisting = subSection.parameters.some(
                (p) => p.id === relatedParameter.parameterId
              );
              if (isParameterIdExisting) {
                // Create a new related parameter with proper section/subsection context
                const relParamWithContext = {
                  ...relatedParameter,
                  sectionId: section.id,
                  subSectionId: subSection.id,
                  actionIndex: parameter.actionIndex || 0
                };
                allRelatedParametersArray.push(relParamWithContext);
              }
            });
          }

          // Handle underParameterIds
          if (parameter.isUnderParameterId !== null && parameter.isUnderParameterId !== undefined) {
            allUnderParameterIdsArray.push({
              underParameterId: parameter.isUnderParameterId,
              myParameter: parameter,
              sectionId: section.id,
              subSectionId: subSection.id,
            });
          }
        });
      });
    });

    // Replace the entire relatedParameters state with the rebuilt array
    setRelatedParameters(allRelatedParametersArray);

    // Replace the entire underParameterIds state with the rebuilt array
    setUnderParameterIds(allUnderParameterIdsArray);
  };
  const removeSection = (item) => {
    // setCanCalculation(true);
    let temp = cloneDeep(productTemplate);
    temp.sections = temp.sections.filter((x) => x.id !== item.id);
    setProductTemplate(temp);

    const updatedSubProducts = subProducts.filter(
      (subProduct) => subProduct.sectionId !== item.id
    );

    setSubProducts(updatedSubProducts);

    // Rebuild relatedParameters and underParameterIds arrays after section removal
    let allRelatedParametersArray = [];
    let allUnderParameterIdsArray = [];

    // Iterate through ALL remaining sections to rebuild related parameters and underParameterIds
    temp.sections.forEach((section) => {
      section.subSections.forEach((subSection) => {
        subSection.parameters.forEach((parameter) => {
          // Handle relatedParameters
          if (parameter.relatedParameters && parameter.relatedParameters.length > 0) {
            parameter.relatedParameters.forEach((relatedParameter) => {
              // Check if the relatedParameter's parameterId exists in parameters
              const isParameterIdExisting = subSection.parameters.some(
                (p) => p.id === relatedParameter.parameterId
              );
              if (isParameterIdExisting) {
                // Only add if the related parameter doesn't reference the removed section
                if (relatedParameter.sectionId !== item.id) {
                  // Create a new related parameter with proper section/subsection context
                  const relParamWithContext = {
                    ...relatedParameter,
                    sectionId: section.id,
                    subSectionId: subSection.id,
                    actionIndex: parameter.actionIndex || 0
                  };
                  allRelatedParametersArray.push(relParamWithContext);
                }
              }
            });
          }

          // Handle underParameterIds
          if (parameter.isUnderParameterId !== null && parameter.isUnderParameterId !== undefined) {
            // Check if the underParameterId references a parameter in the removed section
            let shouldInclude = true;

            // Find if the referenced parameter exists in any remaining section
            const referencedParamExists = temp.sections.some(sec =>
              sec.subSections.some(sub =>
                sub.parameters.some(p => p.id === parameter.isUnderParameterId)
              )
            );

            if (referencedParamExists) {
              allUnderParameterIdsArray.push({
                underParameterId: parameter.isUnderParameterId,
                myParameter: parameter,
                sectionId: section.id,
                subSectionId: subSection.id,
              });
            }
          }
        });
      });
    });

    // Update the states with the rebuilt arrays
    setRelatedParameters(allRelatedParametersArray);
    setUnderParameterIds(allUnderParameterIdsArray);

    calculationProduct(updatedSubProducts);
  };

  // Function to check if a parameter should be visible based on related parameters
  function isParameterVisible(parameter, subProduct, section, subSection) {
    // Check if this parameter is controlled by any related parameters
    const controllingParameters = [];

    // Find all parameters in the current subSection that have this parameter as a related parameter
    subSection.parameters.forEach(parentParam => {
      if (parentParam.relatedParameters && parentParam.relatedParameters.length > 0) {
        parentParam.relatedParameters.forEach(relatedParam => {
          if (relatedParam.parameterId === parameter.id) {
            controllingParameters.push({
              parentParameter: parentParam,
              relatedConfig: relatedParam
            });
          }
        });
      }
    });

    // If no controlling parameters found, the parameter is visible
    if (controllingParameters.length === 0) {
      return true;
    }

    // Check each controlling parameter
    for (const controller of controllingParameters) {
      const { parentParameter, relatedConfig } = controller;
      // Find the parent parameter's current selection in subProduct
      const parentSelection = subProduct?.parameters?.find(
        (x) => x.parameterId === parentParameter.id &&
          x.sectionId === section.id &&
          x.subSectionId === subSection.id &&
          x.actionIndex === parentParameter.actionIndex
      );

      // Special handling for boolean parameters (parameterType 3)
      if (parentParameter.parameterType === 3) {
        // For boolean parameters, check if there's a selection or use the default value
        let booleanValue = null;

        if (parentSelection && parentSelection.valueIds && parentSelection.valueIds.length > 0) {
          // Use the selected value
          booleanValue = parentSelection.valueIds[0];
        } else if (parentParameter.defaultValue !== null && parentParameter.defaultValue !== undefined) {
          // Use the default value if no selection exists
          booleanValue = parentParameter.defaultValue;
        }

        // If no value found (neither selection nor default), hide the dependent parameter
        if (booleanValue === null) {
          return false;
        }

        // Check if the boolean value matches the required value
        if (!relatedConfig.activateByAllValues) {
          // Convert boolean value to string for comparison if needed
          const valueToCheck = String(booleanValue);
          const hasMatchingValue = relatedConfig.selectedValueIds.includes(valueToCheck);

          if (!hasMatchingValue) {
            return false;
          }
        }
      } else {
        // For non-boolean parameters, use the original logic
        // If parent parameter is not selected, this parameter should be hidden
        if (!parentSelection || !parentSelection.valueIds || parentSelection.valueIds.length === 0) {
          return false;
        }

        // Check if the parent parameter's selected value should activate this parameter
        if (relatedConfig.activateByAllValues) {
          // If activateByAllValues is true, any selection of parent activates this parameter
          continue;
        } else {
          // Check if the selected value is in the selectedValueIds
          const hasMatchingValue = parentSelection.valueIds.some(selectedValueId =>
            relatedConfig.selectedValueIds.includes(selectedValueId)
          );

          if (!hasMatchingValue) {
            return false;
          }
        }
      }
    }
    return true;
  }



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
    setProductTemplate(temp);
  };

  useEffect(() => {
    if (productTemplate && productTemplate.sections?.length > 0) {
      let temp = [];
      let activeSectionTemp = [];

      productTemplate.sections.map((section, sectionIndex) => {
        return section.subSections?.map((subSection) => {
          return subSection.parameters?.map((parameter) => {
            const index = temp.findIndex(
              (item) =>
                item.id === parameter.id &&
                item?.code === parameter.code &&
                item.actionIndex === parameter.actionIndex
            );
            if (index !== -1) {
              temp[index] = {
                ...temp[index],
              };
            } else {
              if (parameter.isRequired) {
                temp.push(parameter);
                if (sectionIndex === activeIndex) {
                  activeSectionTemp.push(parameter);
                }
              }
            }
          });
        });
      });
      // Filter out items where isHidden === true
      temp = temp.filter((item) => !item.isHidden);
      setIsRequiredParameters(temp);
      setActiveSectionRequiredParameters(activeSectionTemp);
    }
  }, [productTemplate, activeIndex]);

  const [relatedParameters, setRelatedParameters] = useState([]);
  const [underParameterIds, setUnderParameterIds] = useState([]);

  const validateMaterialExists = (parameter, allMaterials, subSection) => {
    if (!parameter.valueIds || parameter.valueIds.length === 0) {
      return false;
    }

    // Get the material path from the parameter
    const materialPath = parameter.materialPath;
    if (!materialPath || materialPath.length === 0) return true; // If no material path, we can't validate

    const selectedValueId = parameter.valueIds[0];

    // For single level material path
    if (materialPath.length === 1) {
      const material = allMaterials?.find(item =>
        compareStrings(item.pathName, materialPath[0])
      );

      if (!material || !material.data) {
        return false;
      }

      // Check if the value exists in the material data
      return material.data.some(item =>
        item.valueId === selectedValueId ||
        compareStrings(item.valueId, selectedValueId)
      );
    }

    // For multi-level material path (like sheets -> weights -> colors)
    if (materialPath.length > 1) {
      let materialData = allMaterials?.find(item =>
        compareStrings(item.pathName, materialPath[0])
      )?.data;

      if (!materialData) return false;

      // Navigate through the material path hierarchy
      let searchPath = "";
      for (let i = 0; i < materialPath.length - 1; i++) {
        searchPath += materialPath[i];

        // Find the previous parameter in the hierarchy
        const prevParameter = subSection.parameters.find(p =>
          p.materialPath &&
          p.materialPath.join("") === searchPath &&
          p.actionIndex === parameter.actionIndex
        );

        if (prevParameter && prevParameter.valuesConfigs) {
          // Get the selected value from the previous parameter
          let value = prevParameter.valuesConfigs.find(x => x.isDefault);

          if (!value && prevParameter.valuesConfigs.length === 1 && prevParameter.isRequired) {
            value = prevParameter.valuesConfigs[0];
          }

          // If we need to check the actual selected value from subProducts
          const subProductParam = parameter.subProductParameters?.find(
            p => p.parameterId === prevParameter.id
          );

          if (subProductParam && subProductParam.valueIds?.length > 0) {
            const selectedId = subProductParam.valueIds[0];
            materialData = materialData?.find(x =>
              x.valueId === selectedId || compareStrings(x.valueId, selectedId)
            )?.data;
          } else if (value && value.valueIds?.length > 0) {
            materialData = materialData?.find(x =>
              x.valueId === value.valueIds[0] || compareStrings(x.valueId, value.valueIds[0])
            )?.data;
          } else if (value) {
            materialData = materialData?.find(x =>
              x.valueId === value.id || compareStrings(x.valueId, value.id)
            )?.data;
          } else {
            materialData = null;
          }
        }
      }

      // Check if the selected value exists in the final material data
      if (!materialData) return false;

      return materialData.some(item =>
        item.valueId === selectedValueId ||
        compareStrings(item.valueId, selectedValueId)
      );
    }

    return true;
  };

  const [removedMaterialParameters, setRemovedMaterialParameters] = useState({});

  useEffect(() => {
    if (!isSetTemplete) {
      if (productTemplate && productTemplate?.sections?.length > 0) {
        let sectionData: any = cloneDeep(productTemplate?.sections);
        const typeMap = {};
        let underParameterIdsArray = [];
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
            subSection.parameters.forEach((parameter) => {
              if (
                parameter?.isHidden &&
                !parameter?.setSettingIcon &&
                relatedParameters.some(
                  (relatedParam) =>
                    relatedParam.parameterId === parameter?.id &&
                    !parameter.isHiddenInSetting
                )
              ) {
                if (parameter.isUnderParameterId !== null) {
                  underParameterIdsArray.push({
                    underParameterId: parameter.isUnderParameterId,
                    myParameter: parameter,
                    sectionId: section.id,
                    subSectionId: subSection.id,
                  });
                }
                return;
              }
              parameter.relatedParameters.forEach((x) => {
                x.sectionId = section.id;
                x.subSectionId = subSection.id;
                x.actionIndex = parameter?.actionIndex;
              });
              if (parameter?.settingParameters?.length > 0) {
                const parameterValue = parameter.valuesConfigs.find(
                  (x) => x.isDefault === true
                );
                if (
                  parameterValue &&
                  parameterValue.selectedParameterValues &&
                  parameterValue.selectedParameterValues.length > 0
                ) {
                  parameterValue.selectedParameterValues.forEach(
                    (selectedParam) => {
                      if (
                        selectedParam.valueIds &&
                        selectedParam.valueIds.length > 0
                      ) {
                        const param = parameter.settingParameters.find(
                          (param) => param.id === selectedParam.parameterId
                        );
                        let existsSubProductParameter =
                          subProduct?.parameters?.find(
                            (x) =>
                              x.parameterId === param.id &&
                              x.sectionId === section.id &&
                              x.subSectionId === subSection.id &&
                              x.actionIndex === param?.actionIndex
                          );
                        if (!existsSubProductParameter) {
                          subProduct.parameters.push({
                            parameterId: param.id,
                            sectionId: section.id,
                            subSectionId: subSection.id,
                            ParameterType: param.parameterType,
                            isQuantityParameter: param.isQuantityParameter,
                            parameterName: param.name,
                            actionId: param.actionId,
                            values: selectedParam.valueIds,
                            valueIds: selectedParam.valueIds,
                            actionIndex: param?.actionIndex,
                            parameterCode: param?.code,
                            isGeneralInfoInProductionFloor:
                              param?.isGeneralInfoInProductionFloor,
                          });
                        }
                      } else if (productItemValueByEdit) {
                        const parameterIdsToExtract = [
                          "e1dfbaab-977e-4267-9e4e-d733f49ee20d",
                          "8b43efba-f28c-4e73-8fa0-cc64f3ea06f8",
                          "8eff3238-a321-48f3-85eb-c14afaccbff3",
                          "ae8d81d1-a0de-4967-b821-dae6937e7551",
                          "7a344769-6470-4584-8288-c7ff512af2ee",
                          "54a29d4c-4fe1-4b3b-a4e8-cbfe99f656f5",
                        ];

                        parameterIdsToExtract.forEach((parameterId) => {
                          const parameter =
                            productItemValueByEdit?.itemParmetersValues?.find(
                              (item) => item.parameterId === parameterId
                            );
                          if (parameter) {
                            subProduct.parameters.push(parameter);
                          }
                        });
                      }
                    }
                  );
                }
              }

              if (parameter.isUnderParameterId !== null) {
                underParameterIdsArray.push({
                  underParameterId: parameter.isUnderParameterId,
                  myParameter: parameter,
                  sectionId: section.id,
                  subSectionId: subSection.id,
                });
              }
              const isParameterExits = subProduct?.parameters?.find(
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
                isSetDefaultValue = true;
              }
              if (!isParameterExits && isSetDefaultValue) {
                if (
                  parameter?.parameterType === EParameterTypes.INPUT_NUMBER ||
                  parameter?.parameterType === EParameterTypes.INPUT_TEXT ||
                  parameter?.parameterType === EParameterTypes.SWITCH
                ) {
                  if (parameter?.defaultValue?.length > 0) {
                    const defaultValue = parameter?.defaultValue;
                    let existsSubProductParameter =
                      subProduct?.parameters?.find(
                        (x) =>
                          x.parameterId === parameter.id &&
                          x.sectionId === section.id &&
                          x.subSectionId === subSection.id &&
                          x.actionIndex === parameter?.actionIndex
                      );
                    if (!existsSubProductParameter) {
                      subProduct.parameters.push({
                        parameterId: parameter?.id,
                        parameterName: parameter?.name,
                        actionId: parameter?.actionId,
                        parameterType: parameter?.parameterType,
                        isQuantityParameter: parameter?.isQuantityParameter,
                        ...(defaultValue?.length > 0 && {
                          values: [defaultValue],
                        }),
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                        actionIndex: parameter?.actionIndex,
                        parameterCode: parameter?.code,
                        valuesConfigs: parameter?.valuesConfigs,
                        unitKey: parameter?.unitKey,
                        defaultUnit: parameter?.defaultUnit,
                        factor: parameter?.factor,
                        unitType: parameter?.unitType,
                        isGeneralInfoInProductionFloor:
                          parameter?.isGeneralInfoInProductionFloor,
                      });
                    }
                  }
                }
                else if (
                  parameter?.parameterType === EParameterTypes.DROP_DOWN_LIST ||
                  parameter?.parameterType === EParameterTypes.MACHINES_SELECT
                ) {

                  if (!isParameterVisible(parameter, subProduct, section, subSection)) {
                    return; // Skip this parameter if it should be hidden
                  }
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
                    let existsSubProductParameter =
                      subProduct?.parameters?.find(
                        (x) =>
                          x.parameterId === parameter.id &&
                          x.sectionId === section.id &&
                          x.subSectionId === subSection.id &&
                          x.actionIndex === parameter?.actionIndex
                      );
                    if (!existsSubProductParameter) {
                      subProduct.parameters.push({
                        parameterId: parameter?.id,
                        parameterName: parameter?.name,
                        actionId:
                          value?.activateAction === true
                            ? parameter?.actionId
                            : null,
                        ...(data?.id > 0 && { material: data?.id }),
                        parameterType: parameter?.parameterType,
                        isQuantityParameter: parameter?.isQuantityParameter,
                        ...(value && {
                          valueIds: [
                            parameter?.parameterType ===
                              EParameterTypes.MACHINES_SELECT
                              ? value?.updateName
                              : value?.id,
                          ],
                          values: [value?.updateName],
                        }),
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                        actionIndex: parameter?.actionIndex,
                        parameterCode: parameter?.code,
                        valuesConfigs: parameter?.valuesConfigs,
                        unitKey: parameter?.unitKey,
                        defaultUnit: parameter?.defaultUnit,
                        unitType: parameter?.unitType,
                        factor: parameter?.factor,
                        isGeneralInfoInProductionFloor:
                          parameter?.isGeneralInfoInProductionFloor,
                      });
                    }
                  }
                } else if (
                  parameter?.parameterType ===
                  EParameterTypes.SELECT_MATERIALS ||
                  parameter?.parameterType ===
                  EParameterTypes.ADVERTISING_PRODUCT_CATEGORY ||
                  parameter?.parameterType ===
                  EParameterTypes.ADVERTISING_PRODUCT_NAME ||
                  parameter?.parameterType === EParameterTypes.BUTTON
                ) {
                  const value = parameter?.valuesConfigs?.find(
                    (item) => item?.isDefault == true
                  );
                  if (
                    !value &&
                    parameter?.valuesConfigs &&
                    parameter?.valuesConfigs?.length === 1 &&
                    parameter?.isRequired &&
                    parameter?.parameterType !==
                    EParameterTypes.ADVERTISING_PRODUCT_CATEGORY
                  ) {
                    let existsSubProductParameter =
                      subProduct?.parameters?.find(
                        (x) =>
                          x.parameterId === parameter.id &&
                          x.sectionId === section.id &&
                          x.subSectionId === subSection.id &&
                          x.actionIndex === parameter?.actionIndex
                      );
                    if (!existsSubProductParameter) {
                      subProduct.parameters.push({
                        parameterId: parameter?.id,
                        parameterName: parameter?.name,
                        actionId: parameter?.actionId,
                        parameterType: parameter?.parameterType,
                        isQuantityParameter: parameter?.isQuantityParameter,
                        valueIds: parameter?.valuesConfigs[0]?.values,
                        values: [parameter?.valuesConfigs[0]?.updateName],
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                        actionIndex: parameter?.actionIndex,
                        parameterCode: parameter?.code,
                        valuesConfigs: parameter?.valuesConfigs,
                        unitKey: parameter?.unitKey,
                        defaultUnit: parameter?.defaultUnit,
                        unitType: parameter?.unitType,
                        factor: parameter?.factor,
                        isGeneralInfoInProductionFloor:
                          parameter?.isGeneralInfoInProductionFloor,
                      });
                    }
                  }

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
                      let existsSubProductParameter =
                        subProduct?.parameters?.find(
                          (x) =>
                            x.parameterId === parameter.id &&
                            x.sectionId === section.id &&
                            x.subSectionId === subSection.id &&
                            x.actionIndex === parameter?.actionIndex
                        );

                      if (!existsSubProductParameter) {
                        subProduct.parameters.push({
                          parameterId: parameter?.id,
                          parameterName: parameter?.name,
                          actionId: parameter?.actionId,
                          ...(data?.id > 0 && { material: data?.id }),
                          parameterType: parameter?.parameterType,
                          isQuantityParameter: parameter?.isQuantityParameter,
                          ...(value && {
                            valueIds: [value?.materialValueIds[0]?.valueId],
                            values: [
                              value?.updateName ||
                              value?.materialValueIds[0]?.valueId,
                            ],
                          }),
                          sectionId: section?.id,
                          subSectionId: subSection?.id,
                          actionIndex: parameter?.actionIndex,
                          parameterCode: parameter?.code,
                          valuesConfigs: parameter?.valuesConfigs,
                          unitKey: parameter?.unitKey,
                          defaultUnit: parameter?.defaultUnit,
                          unitType: parameter?.unitType,
                          factor: parameter?.factor,
                          isGeneralInfoInProductionFloor:
                            parameter?.isGeneralInfoInProductionFloor,
                        });
                      }
                    }
                  } else if (value && parameter.code === "DieCut") {
                    const existingParameters =
                      productItemValueByEdit?.itemParmetersValues || [];
                    const isDieCutExisting = existingParameters.find(
                      (param) => param?.parameterCode === "DieCut"
                    );
                    if (isDieCutExisting || existingParameters.length === 0) {
                      const nameValue = value?.additionalAttribute?.find(
                        (attr) => attr.valueId === "name"
                      )?.value;
                      let existsSubProductParameter =
                        subProduct?.parameters?.find(
                          (x) =>
                            x.parameterId === parameter.id &&
                            x.sectionId === section.id &&
                            x.subSectionId === subSection.id &&
                            x.actionIndex === parameter?.actionIndex
                        );

                      if (!existsSubProductParameter) {
                        const newParameter = {
                          parameterId: parameter?.id,
                          parameterName: parameter?.name,
                          actionId: value?.activateAction
                            ? parameter?.actionId
                            : null,
                          parameterType: parameter?.parameterType,
                          isQuantityParameter: parameter?.isQuantityParameter,
                          valueIds: [value?.id],
                          values: [nameValue],
                          sectionId: section?.id,
                          subSectionId: subSection?.id,
                          actionIndex: parameter?.actionIndex,
                          parameterCode: parameter?.code,
                          valuesConfigs: parameter?.valuesConfigs,
                          unitKey: parameter?.unitKey,
                          defaultUnit: parameter?.defaultUnit,
                          unitType: parameter?.unitType,
                          factor: parameter?.factor,
                          isGeneralInfoInProductionFloor:
                            parameter?.isGeneralInfoInProductionFloor,
                        };

                        subProduct.parameters.push(newParameter);
                      }
                    }
                  } else if (!value && parameter.code === "DieCut") {
                    const existingParameters =
                      productItemValueByEdit?.itemParmetersValues || [];
                    const isDieCutExisting = existingParameters.find(
                      (param) => param?.parameterCode === "DieCut"
                    );
                    if (isDieCutExisting) {
                      let materialSelected = allMaterials?.find(
                        (item) =>
                          item?.pathName === isDieCutExisting?.parameterCode
                      )?.data;
                      const additionalAttribute = materialSelected?.find(
                        (item) =>
                          item?.valueId === isDieCutExisting?.valueIds[0]
                      )?.additionalAttribute;
                      const nameValue = additionalAttribute?.find(
                        (attr) => attr.valueId === "name"
                      )?.value;
                      let existsSubProductParameter =
                        subProduct?.parameters?.find(
                          (x) =>
                            x.parameterId === parameter.id &&
                            x.sectionId === section.id &&
                            x.subSectionId === subSection.id &&
                            x.actionIndex === parameter?.actionIndex
                        );
                      if (!existsSubProductParameter) {
                        subProduct.parameters.push({
                          parameterId: parameter?.id,
                          parameterName: parameter?.name,
                          actionId:
                            value?.activateAction === true
                              ? parameter?.actionId
                              : null,
                          parameterType: parameter?.parameterType,
                          isQuantityParameter: parameter?.isQuantityParameter,
                          ...(isDieCutExisting?.valueIds[0] && {
                            valueIds: [isDieCutExisting?.valueIds[0]],
                            values: [nameValue],
                          }),
                          sectionId: section?.id,
                          subSectionId: subSection?.id,
                          actionIndex: parameter?.actionIndex,
                          parameterCode: parameter?.code,
                          valuesConfigs: parameter?.valuesConfigs,
                          unitKey: parameter?.unitKey,
                          defaultUnit: parameter?.defaultUnit,
                          unitType: parameter?.unitType,
                          factor: parameter?.factor,
                          isGeneralInfoInProductionFloor:
                            parameter?.isGeneralInfoInProductionFloor,
                        });
                      }
                    }
                  } else if (value && parameter.code === "DieKissCut") {
                    const existingParameters =
                      productItemValueByEdit?.itemParmetersValues || [];
                    const isDieCutExisting = existingParameters.find(
                      (param) => param?.parameterCode === "DieKissCut"
                    );
                    if (isDieCutExisting || existingParameters.length === 0) {
                      const nameValue = value?.additionalAttribute?.find(
                        (attr) => attr.valueId === "name"
                      )?.value;
                      let existsSubProductParameter =
                        subProduct?.parameters?.find(
                          (x) =>
                            x.parameterId === parameter.id &&
                            x.sectionId === section.id &&
                            x.subSectionId === subSection.id &&
                            x.actionIndex === parameter?.actionIndex
                        );
                      if (!existsSubProductParameter) {
                        subProduct.parameters.push({
                          parameterId: parameter?.id,
                          parameterName: parameter?.name,
                          actionId:
                            value?.activateAction === true
                              ? parameter?.actionId
                              : null,
                          parameterType: parameter?.parameterType,
                          isQuantityParameter: parameter?.isQuantityParameter,
                          ...(value && {
                            valueIds: [value?.id],
                            values: [nameValue],
                          }),
                          sectionId: section?.id,
                          subSectionId: subSection?.id,
                          actionIndex: parameter?.actionIndex,
                          parameterCode: parameter?.code,
                          valuesConfigs: parameter?.valuesConfigs,
                          unitKey: parameter?.unitKey,
                          defaultUnit: parameter?.defaultUnit,
                          unitType: parameter?.unitType,
                          factor: parameter?.factor,
                          isGeneralInfoInProductionFloor:
                            parameter?.isGeneralInfoInProductionFloor,
                        });
                      }
                    }
                  } else if (!value && parameter.code === "DieKissCut") {
                    const existingParameters =
                      productItemValueByEdit?.itemParmetersValues || [];
                    const isDieCutExisting = existingParameters.find(
                      (param) => param?.parameterCode === "DieKissCut"
                    );
                    if (isDieCutExisting) {
                      let materialSelected = allMaterials?.find(
                        (item) =>
                          item?.pathName === isDieCutExisting?.parameterCode
                      )?.data;
                      const additionalAttribute = materialSelected?.find(
                        (item) =>
                          item?.valueId === isDieCutExisting?.valueIds[0]
                      )?.additionalAttribute;
                      const nameValue = additionalAttribute?.find(
                        (attr) => attr.valueId === "name"
                      )?.value;
                      subProduct.parameters.push({
                        parameterId: parameter?.id,
                        parameterName: parameter?.name,
                        actionId:
                          value?.activateAction === true
                            ? parameter?.actionId
                            : null,
                        parameterType: parameter?.parameterType,
                        isQuantityParameter: parameter?.isQuantityParameter,
                        ...(isDieCutExisting?.valueIds[0] && {
                          valueIds: [isDieCutExisting?.valueIds[0]],
                          values: [nameValue],
                        }),
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                        actionIndex: parameter?.actionIndex,
                        parameterCode: parameter?.code,
                        valuesConfigs: parameter?.valuesConfigs,
                        unitKey: parameter?.unitKey,
                        defaultUnit: parameter?.defaultUnit,
                        unitType: parameter?.unitType,
                        factor: parameter?.factor,
                        isGeneralInfoInProductionFloor:
                          parameter?.isGeneralInfoInProductionFloor,
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
                      isQuantityParameter: parameter?.isQuantityParameter,
                      ...(defaultObject && {
                        valueIds: [defaultObject?.id],
                        values: [defaultObject?.updateName],
                      }),
                      sectionId: section?.id,
                      subSectionId: subSection?.id,
                      actionIndex: parameter?.actionIndex,
                      parameterCode: parameter?.code,
                      valuesConfigs: parameter?.valuesConfigs,
                      unitKey: parameter?.unitKey,
                      defaultUnit: parameter?.defaultUnit,
                      unitType: parameter?.unitType,
                      factor: parameter?.factor,
                      isGeneralInfoInProductionFloor:
                        parameter?.isGeneralInfoInProductionFloor,
                    });

                    parameter?.childsParameters?.map((item) => {
                      const childParam = subSection.parameters.find(
                        (x) => x.id === item.id
                      );
                      const sizeParameter = subProduct?.parameters?.find(
                        (item) => item.parameterCode === "size"
                      );
                      const sizeParameterValueConfig =
                        parameter.valuesConfigs.find(
                          (x) => x.id === sizeParameter?.valueIds[0]
                        );
                      let isDisabled = false;
                      if (
                        sizeParameterValueConfig &&
                        Object.keys(sizeParameterValueConfig.values).length > 0
                      ) {
                        isDisabled = true;
                      }
                      subProduct.parameters.push({
                        parameterId: childParam?.id,
                        parameterName: childParam?.name,
                        actionId: childParam?.actionId,
                        parameterType: childParam?.parameterType,
                        isQuantityParameter: childParam?.isQuantityParameter,
                        values: item.defaultValue
                          ? [
                            unitType === UNIT_TYPE.IMPERIAL &&
                              childParam?.code != "Width" &&
                              childParam?.code != "Height"
                              ? (
                                item?.defaultValue * childParam?.factor
                              ).toFixed(3)
                              : item?.defaultValue,
                          ]
                          : [
                            unitType === UNIT_TYPE.IMPERIAL &&
                              childParam?.code != "Width" &&
                              childParam?.code != "Height"
                              ? (
                                childParam?.defaultValue *
                                childParam?.factor
                              ).toFixed(3)
                              : childParam?.defaultValue,
                          ],
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                        actionIndex: childParam?.actionIndex,
                        parameterCode: childParam?.code,
                        valuesConfigs: childParam?.valuesConfigs,
                        unitKey: childParam?.unitKey,
                        defaultUnit: childParam?.defaultUnit,
                        unitType: childParam?.unitType,
                        factor: childParam?.factor,
                        isDisabled: isDisabled,
                        isGeneralInfoInProductionFloor:
                          childParam?.isGeneralInfoInProductionFloor,
                      });
                    });
                  }
                }
              }
              processRelatedParameters2(
                parameter,
                subSection,
                section,
                productTemplate,
                subProductsArray
              );
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
        subProductsArray.forEach((subProduct) => {
          subProduct.parameters.forEach((parameter) => {
            if (parameter.parameterCode === "devicecategory") {
              setDeviceCategory(parameter?.valueIds[0]);
            } else if (parameter?.parameterCode === "devicesize") {
              setDeviceSize(parameter?.valueIds[0]);
            }
          });
        });
        const removedParams = {};

        const filteredSubProductsArray = subProductsArray.map((subProduct) => {
          const hasDieCutOrKissCut = subProduct.parameters.some(
            (parameter) =>
              parameter.parameterCode === "DieKissCut" ||
              parameter.parameterCode === "DieCut"
          );

          return {
            ...subProduct,
            parameters: subProduct.parameters
              .filter(parameter => {
                // Special validation for SELECT_MATERIALS in EDIT/DUPLICATE mode
                if (parameter.parameterType === EParameterTypes.SELECT_MATERIALS &&
                  (widgetType === EWidgetProductType.EDIT || widgetType === EWidgetProductType.DUPLICATE)) {

                  // Find the corresponding section and subsection for this parameter
                  const section = sectionData.find(s => s.id === parameter.sectionId);
                  const subSection = section?.subSections.find(ss => ss.id === parameter.subSectionId);

                  if (subSection) {
                    // Get the parameter definition from the template
                    const templateParameter = subSection.parameters.find(p =>
                      p.id === parameter.parameterId &&
                      p.actionIndex === parameter.actionIndex
                    );

                    if (templateParameter && templateParameter.materialPath) {
                      // Create a temporary object for validation instead of modifying the original
                      const parameterForValidation = {
                        ...parameter,
                        materialPath: templateParameter.materialPath,
                        subProductParameters: subProduct.parameters
                      };

                      // Validate if the material value still exists
                      const isValid = validateMaterialExists(parameterForValidation, allMaterials, subSection);

                      if (!isValid) {
                        // Save the removed parameter info
                        const paramKey = `${parameter.parameterId}_${parameter.sectionId}_${parameter.subSectionId}_${parameter.actionIndex || 0}`;
                        removedParams[paramKey] = {
                          parameterId: parameter.parameterId,
                          parameterName: parameter.parameterName,
                          parameterCode: parameter.parameterCode,
                          values: parameter.values,
                          valueIds: parameter.valueIds,
                          sectionId: parameter.sectionId,
                          subSectionId: parameter.subSectionId,
                          actionIndex: parameter.actionIndex,
                        };

                        return false; // Remove this parameter
                      }
                    }
                  }
                }

                // Existing filter conditions
                return parameter.values &&
                  parameter.values.length > 0 &&
                  parameter.values[0] !== null &&
                  parameter.values[0] !== undefined &&
                  parameter.values[0] !== "";
              })
              .map((parameter) => {
                if (
                  hasDieCutOrKissCut &&
                  (parameter.parameterCode === "Width" ||
                    parameter.parameterCode === "Height")
                ) {
                  return {
                    ...parameter,
                    isDisabled: true,
                  };
                }
                return parameter;
              })
              .filter((parameter) => {
                return !(
                  parameter.values[0] === "false" ||
                  parameter.values[0] === null
                );
              }),
          };
        });
        if (Object.keys(removedParams).length > 0) {
          setRemovedMaterialParameters(prev => ({
            ...prev,
            ...removedParams
          }));
        }
        setProductTemplate(productTemplate);
        setSubProducts(filteredSubProductsArray);
        setUnderParameterIds(underParameterIdsArray);
        setIsSetTemplete((widgetType === EWidgetProductType.EDIT || widgetType === EWidgetProductType.DUPLICATE) ? false : true);
        setTimeout(() => {
          setIsSetTemplete(true);
        }, 500);
      }
    }
  }, [materialsEnumsValues, allMaterials, productTemplate]);

  useEffect(() => {
    if (
      (widgetType === EWidgetProductType.EDIT || widgetType === EWidgetProductType.DUPLICATE) &&
      !isMigratedFromOldSystem &&
      productTemplate?.productItemValue &&
      productTemplate?.productItemValue?.itemParmetersValues?.length > 0 &&
      subProducts?.length == 0
    ) {
      const sizeParameterFromTemplate = findParameterByCode(productTemplate, "size");
      const sizeParameterFromTemplateFilterdValues = sizeParameterFromTemplate?.valuesConfigs?.filter(
        (item) => !item.isHidden
      );
      setSubProducts((prev) => {
        return prev.map((subProduct) => {
          const filteredParameters =
            productTemplate?.productItemValue?.itemParmetersValues?.filter(
              (item) => item.subProductType === subProduct.type
            );

          // Add isDisabled logic for size parameters
          const processedParameters = filteredParameters?.map((item) => {
            // Check if there's a size parameter
            const sizeParameter = filteredParameters?.find(param => param.parameterCode === "size");

            let shouldDisableWidthHeight = false;

            if (sizeParameter && sizeParameter.valueIds && sizeParameter.valueIds.length > 0) {
              // Find the item from sizeParameterFromTemplateFilterdValues where id === valueIds[0]
              const selectedSizeItem = sizeParameterFromTemplateFilterdValues?.find(
                templateItem => templateItem.id === sizeParameter.valueIds[0]
              );

              // Check if the found item has values !== {}
              if (selectedSizeItem && Object.keys(selectedSizeItem.values || {}).length > 0) {
                shouldDisableWidthHeight = true;
              }
            }

            // Disable Width and Height parameters when size parameter has predefined values
            if ((item.parameterCode === "Width" || item.parameterCode === "Height") && shouldDisableWidthHeight) {
              return {
                ...item,
                isDisabled: true,
              };
            }
            return item;
          });

          return {
            ...subProduct,
            parameters: processedParameters,
          };
        });
      });
    }
  }, [productTemplate]);

  const initProduct = (product, materials) => {
    if (product && product?.sections?.length > 0) {
      let sectionData: any = product.sections;
      let relatedParametersArray = [];
      let underParameterIdsArray = [];

      sectionData.forEach((section) => {
        section.subSections.forEach((subSection) => {
          subSection.parameters.forEach((parameter) => {
            if (parameter.relatedParameter) {
              parameter.relatedParameter.forEach((relatedParameter) => {
                relatedParameter.actionIndex = parameter.actionIndex;
              });
            }
            parameter.relatedParameters.forEach((relatedParameter) => {
              // Check if the relatedParameter's parameterId exists in parameters
              const isParameterIdExisting = subSection.parameters.some(
                (p) => p.id === relatedParameter.parameterId
              );
              if (isParameterIdExisting) {
                relatedParametersArray.push(relatedParameter);
              }
            });
            const relatedToParameter = subSection.parameters.find(
              (subProductsParameter) =>
                subProductsParameter?.relatedParameters?.find(
                  (p) =>
                    p.parameterId === parameter.id &&
                    p.actionIndex === parameter.actionIndex &&
                    !parameter?.isHiddenInSetting
                )
            );
            if (relatedToParameter && relatedToParameter.isHidden) {
              parameter.isHidden = true;
              const unHiddenParameterInSubSection = subSection.parameters.find(
                (x) => !x.isHidden
              );
              if (!unHiddenParameterInSubSection) {
                subSection.isHidden = true;
              }
              return;
            }
            let defaultValue = relatedToParameter?.defaultValue;
            if (
              relatedToParameter &&
              relatedToParameter.valuesConfigs &&
              relatedToParameter.valuesConfigs.length > 0
            ) {
              let defualtValueConfig = relatedToParameter.valuesConfigs.find(
                (x) => x.isDefault
              );
              if (
                defualtValueConfig &&
                defualtValueConfig.values &&
                defualtValueConfig.values.length > 0
              ) {
                defaultValue = defualtValueConfig.values[0];
              } else if (defualtValueConfig) {
                defaultValue = defualtValueConfig.id;
              }
            }
            const targetSubProduct = subProducts.find(
              (item) => item.type === subSection?.type
            );
            if (
              relatedToParameter &&
              targetSubProduct &&
              targetSubProduct.parameters
            ) {
              let subProductParameter = targetSubProduct?.parameters?.find(
                (item) =>
                  item.parameterId === relatedToParameter.id &&
                  item.sectionId === section.id &&
                  item.subSectionId === subSection.id &&
                  item.actionIndex === relatedToParameter.actionIndex
              );
              if (
                subProductParameter &&
                subProductParameter.valueIds &&
                subProductParameter.valueIds.length > 0
              ) {
                defaultValue = subProductParameter.valueIds[0];
              }
            }
            if (
              parameter.code === "BothsideSameprintcolor" &&
              widgetType != EWidgetProductType.CREATE &&
              product?.productItemValue?.itemParmetersValues?.length > 0 &&
              product?.productItemValue?.itemParmetersValues.find((item) =>
                parameter.relatedParameters.some(
                  (relatedParam) =>
                    relatedParam.parameterId === item.parameterId
                )
              )
            ) {
              parameter.isHidden = true;
            }
            if (
              relatedToParameter &&
              (!defaultValue || defaultValue === "false")
            ) {
              parameter.isHidden = true;
            }
            const parameterDefaultValue = parameter.valuesConfigs?.find(
              (x) => x.isDefault
            );

            if (relatedToParameter && relatedToParameter.relatedParameters) {
              let relationConfigs = relatedToParameter.relatedParameters.find(
                (x) => x.parameterId === parameter.id
              );
              if (
                relationConfigs &&
                relationConfigs.activateByAllValues &&
                !defaultValue
              ) {
                parameter.isHidden = true;
              } else if (
                relationConfigs &&
                relationConfigs.activateByAllValues &&
                defaultValue
              ) {
                parameter.isHidden = false;
              } else if (
                !(
                  relationConfigs &&
                  relationConfigs.selectedValueIds &&
                  defaultValue &&
                  relationConfigs.selectedValueIds.find(
                    (x) => x === defaultValue
                  )
                )
              ) {
                parameter.isHidden = true;
              }
            }
            if (!relatedToParameter) {
              if (
                (parameter?.parameterType === EParameterTypes.DROP_DOWN_LIST ||
                  parameter?.parameterType ===
                  EParameterTypes.MACHINES_SELECT ||
                  parameter?.parameterType ===
                  EParameterTypes.SELECT_MATERIALS ||
                  parameter?.parameterType ===
                  EParameterTypes.ADVERTISING_PRODUCT_CATEGORY ||
                  parameter?.parameterType ===
                  EParameterTypes.ADVERTISING_PRODUCT_NAME) &&
                (!parameter?.valuesConfigs ||
                  parameter?.valuesConfigs.length === 0)
              ) {
                // parameter.isHidden = true;
                // return;
              }
            }
            if (parameter.materialPath && parameter.materialPath.length > 0) {
              if (parameter.materialPath.length == 1) {
                const materialData = materials?.find((x) =>
                  compareStrings(x.pathName, parameter.materialPath[0])
                )?.data;
                if (!parameter.valuesConfigs) {
                  parameter.valuesConfigs = [];
                }
                parameter.valuesConfigs.forEach((val) => {
                  if (val.materialValueIds && val.materialValueIds.length > 0) {
                    val.valueIds = [];
                    val.values = [];
                    val.materialValueIds.forEach((materialValue) => {
                      val.valueIds.push(materialValue.valueId);
                      val.values.push(materialValue.valueId);
                    });
                  }
                });
                if (
                  parameter.code === "DieCut" ||
                  parameter.code === "DieKissCut"
                ) {
                  if (parameter.valuesConfigs.length === 0) {
                    parameter.valuesConfigs = materialData?.map((data) => ({
                      id: data.valueId,
                      isHidden: false,
                      isDefault: false,
                      updateName: null,
                      activateAction: false,
                      isDeleted: false,
                      materialValueIds: null,
                      values: null,
                      selectedParameterValues: null,
                      code: null, // Add code if needed
                      additionalAttribute: data.additionalAttribute,
                      currency: data.currency,
                    }));
                  } else {
                    // If valueConfigs has objects, update it based on materialData
                    parameter.valuesConfigs = materialData?.map((data) => {
                      const existingConfig = parameter.valuesConfigs.find(
                        (config) => config.id === data.valueId
                      );
                      return existingConfig
                        ? {
                          ...existingConfig,
                          additionalAttribute: data.additionalAttribute,
                          currency: data.currency,
                        }
                        : {
                          id: data.valueId,
                          isHidden: false,
                          isDefault: false,
                          updateName: null,
                          activateAction: false,
                          isDeleted: false,
                          materialValueIds: null,
                          values: null,
                          selectedParameterValues: null,
                          code: null, // Add code if needed
                          additionalAttribute: data.additionalAttribute,
                          currency: data.currency,
                        };
                    });
                  }
                } else {
                  parameter.valuesConfigs = parameter.valuesConfigs.filter(
                    (x) => x.valueIds && x.valueIds.length > 0
                  );
                  if (materialData) {
                    materialData.forEach((val) => {
                      const existsValue = parameter.valuesConfigs.find(
                        (x) =>
                          x.valueIds &&
                          x.valueIds.length > 0 &&
                          x.valueIds[0] === val.valueId
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
                          additionalAttribute: val?.additionalAttribute,
                          currency: val?.currency,
                        });
                      } else {
                        existsValue.id = val.valueId;
                        existsValue.updateName = val.value;
                        (existsValue.additionalAttribute =
                          val?.additionalAttribute),
                          (existsValue.currency = val?.currency);
                      }
                    });
                  }
                  const materialOrderMap = {};
                  materialData?.forEach((item, index) => {
                    materialOrderMap[item.valueId] = index;
                  });

                  parameter.valuesConfigs.sort((a, b) => {
                    return materialOrderMap[a.id] - materialOrderMap[b.id];
                  });
                }
              }
              if (parameter.materialPath.length > 1) {
                let materialData = materials?.find((x) =>
                  compareStrings(x.pathName, parameter.materialPath[0])
                )?.data;
                let searchPath = "";
                for (let i = 0; i < parameter.materialPath.length - 1; i++) {
                  searchPath += parameter.materialPath[i];
                  var arr = [];
                  const prevParameter = subSection.parameters.find(
                    (p) =>
                      p.materialPath && p.materialPath.join("") === searchPath
                  );
                  if (
                    prevParameter &&
                    prevParameter.valuesConfigs &&
                    prevParameter.valuesConfigs.length > 0
                  ) {
                    let value = prevParameter.valuesConfigs.find(
                      (x) => x.isDefault
                    );
                    if (
                      !value &&
                      prevParameter.valuesConfigs.length == 1 &&
                      prevParameter.isRequired &&
                      !prevParameter?.isHidden
                    ) {
                      value = prevParameter.valuesConfigs[0];
                    }
                    if (value) {
                      materialData = materialData?.find(
                        (x) => x.valueId == value.id
                      )?.data;
                    } else {
                      materialData = null;
                    }
                  }
                }
                if (materialData) {
                  parameter.isHidden = false;
                  materialData.forEach((val) => {
                    const existsValue = parameter.valuesConfigs.find(
                      (x) =>
                        x.valueIds &&
                        x.valueIds.length > 0 &&
                        x.valueIds[0] === val.valueId
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
                        additionalAttribute: val?.additionalAttribute,
                        currency: val?.currency,
                      });
                    } else {
                      existsValue.id = val.valueId;
                      existsValue.updateName = val.value;
                      (existsValue.additionalAttribute =
                        val?.additionalAttribute),
                        (existsValue.currency = val?.currency);
                    }
                  });
                }
              }
              if (parameterDefaultValue) {
                const materialPath =
                  parameter.materialPath[parameter.materialPath.length - 1];
                const materialRelatedParameters = subSection.parameters.filter(
                  (x) =>
                    x.id !== parameter.id &&
                    x.actionIndex === parameter.actionIndex &&
                    x.materialPath?.find((y) => compareStrings(y, materialPath))
                );
                if (
                  materialRelatedParameters &&
                  materialRelatedParameters.length > 0
                ) {
                  let param = materialRelatedParameters[0];
                  if (param.materialPath && param.materialPath.length > 0) {
                    const index = param.materialPath.findIndex((x) =>
                      compareStrings(x, materialPath)
                    );
                    let allMaterialsCopy = materials;
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
                            x.actionIndex === parameter.actionIndex
                        );
                        let prevPathParamDefaultValue =
                          prevPathParam.valuesConfigs.find((x) => x.isDefault);

                        if (
                          prevPathParamDefaultValue &&
                          prevPathParamDefaultValue?.values &&
                          prevPathParamDefaultValue?.values.length
                        ) {
                          allMaterialsCopy = allMaterialsCopy?.find(
                            (x) =>
                              x.valueId === prevPathParamDefaultValue?.values[0]
                          )?.data;
                        } else {
                          allMaterialsCopy = [];
                        }
                      }
                      paramMaterialValues = allMaterialsCopy;
                    } else if (index === 0) {
                      allMaterialsCopy = allMaterialsCopy.find((x) =>
                        compareStrings(x.pathName, materialPath)
                      )?.data;
                      paramMaterialValues = allMaterialsCopy?.find((x) =>
                        parameterDefaultValue?.values?.find(
                          (y) => y === x.valueId
                        )
                      )?.data;
                    }
                    if (index != -1 && index < param.materialPath.length - 1) {
                      param.valuesConfigs.forEach((val) => {
                        if (
                          val.materialValueIds &&
                          val.materialValueIds.length > 0
                        ) {
                          val.valueIds = [];
                          val.values = [];
                          val.materialValueIds.forEach((materialValue) => {
                            val.valueIds.push(materialValue.valueId);
                            val.values.push(materialValue.valueId);
                          });
                        }
                      });
                      param.valuesConfigs = param?.valuesConfigs?.filter((x) =>
                        paramMaterialValues?.find((m) =>
                          compareStrings(
                            m.valueId,
                            (x.valueIds && x.valueIds[0]) ||
                            (x.values && x.values[0])
                          )
                        )
                      );
                      param.valuesConfigs = param?.valuesConfigs?.filter(
                        (x) => x.isDefault || x.isHidden
                      );
                      param.valuesConfigs = param?.valuesConfigs?.filter(
                        (x) => x.values && x.values.length > 0
                      );

                      for (let i = 0; i < paramMaterialValues?.length; i++) {
                        let val = paramMaterialValues[i];
                        const existsValue = param.valuesConfigs?.find(
                          (x) =>
                            (x.valueIds &&
                              x.valueIds.length > 0 &&
                              compareStrings(x.valueIds[0], val.valueId)) ||
                            x.id === val.valueId
                        );
                        let valueId = val.valueId;
                        const materialValue = paramMaterialValues.find((m) =>
                          compareStrings(m.valueId, val.valueId)
                        );

                        if (materialValue) {
                          valueId = materialValue.valueId;
                        }
                        if (!existsValue) {
                          param.valuesConfigs.push({
                            id: valueId,
                            activateAction: false,
                            isDefault: false,
                            isDeleted: false,
                            isHidden: false,
                            materialValueIds: [
                              {
                                valueId: valueId,
                                pathName: materialValue?.pathName,
                              },
                            ],
                            selectedParameterValues: null,
                            updateName: val.value,
                            values: [valueId],
                            valueIds: [valueId],
                            additionalAttribute: val?.additionalAttribute,
                            currency: val?.currency,
                          });
                        } else {
                          existsValue.id = valueId;
                          existsValue.updateName = val.value;
                          existsValue.values = [valueId];
                          existsValue.valueIds = [valueId];
                          if (
                            existsValue.materialValueIds &&
                            existsValue.materialValueIds.length > 0
                          ) {
                            existsValue.materialValueIds[0].valueId = valueId;
                          }
                          (existsValue.additionalAttribute =
                            val?.additionalAttribute),
                            (existsValue.currency = val?.currency);
                        }
                      }
                      if (
                        param?.valuesConfigs &&
                        param?.valuesConfigs?.length === 1 &&
                        (param?.isRequired ||
                          param?.code == "FlatbedColor" ||
                          param?.code == "SheetColor")
                      ) {
                        param.valuesConfigs[0].isDefault = true;
                      }
                    }
                  }
                }
              }
            }
            if (parameter?.parameterType === EParameterTypes.SWITCH) {
              parameter.isRequired = false;
            }
            // processRelatedParameters2(parameter, subSection, section, productTemplate, subProducts)
            parameter.relatedParameters.forEach((x) => {
              x.sectionId = section.id;
              x.subSectionId = subSection.id;
              x.actionIndex = parameter?.actionIndex;
            });
            if (parameter.isUnderParameterId !== null) {
              underParameterIdsArray.push({
                underParameterId: parameter.isUnderParameterId,
                myParameter: parameter,
                sectionId: section.id,
                subSectionId: subSection.id,
              });
            }
          });
        });
      });
      setIsSetTemplete(false);
      setProductTemplate(product);
      setRelatedParameters(relatedParametersArray);
      setUnderParameterIds(underParameterIdsArray);
    }
  };

  useEffect(() => {
    if (!router?.isReady) {
      return;
    }
    if (connectionId && !currentSignalRConnectionId) {
      setCurrentSignalRConnectionId(connectionId);
      setCurrentProductItemValueTotalPrice(null);
      setSliderCurrentProductItemValueTotalPrice(null);
      setLocalStateValue(null);
      setCurrentCalculatedTotalPrice(null);
      setLastProductItemValueTotalPrice(null);
      setUrgentOrder(null);
      setWorkFlows([]);
      setJobActions([]);
      setSubProducts([]);
      setWorkTypes([]);
      setCalculationProgress({
        totalWorkFlowsCount: 0,
        currentWorkFlowsCount: 0,
      });
      setCurrentProductItemValue(null);
      setIsChangePriceForEdit(false);
      setIsJobNameValue(false);
      setIsActionEmployeeUpdated(false);

      // Set default values for your states
      setIsChargeForNewDie(false);
      setMissionsListForEdit([]);
      setSampleType(null);
      setIsRequiredParameters([]);
      setActiveSectionRequiredParameters([]);
      setdocumentItemByEdit({});
      setProductItemValueByEdit(null);
      setGalleryModalOpen(false);
      setMultiParameterModal(false);
      setMakeShapeOpen(false);
      setPrintingNotes("");
      setGraphicNotes("");
      setErrorMsg("");
      setProductTemplate([]);
      setIsMigratedFromOldSystem(false);
      setupdatedProductTemplate(null);
      setDefaultProductTemplate([]);
      setSubProductsColorsModal([]);
      setIsSetTemplete(false);
      setCurrentProductItemValueDraftId("");
      setAdditionalProductItems([]);
      stIsFlowChanged(false);
      setCurrentProductItemValueTotalWorkFlows(0);
      setExpanded("");
      setActiveIndex(0);
      setActiveTab(t("products.offsetPrice.admin.logs"));
      setPricingDefaultValue(null);
      setCalculationExceptionsLogs(null);
      setQuantityTypes([]);
      // setCalculationResult(null);
      setOutSuppliers(null);
      setLoading(false);
      setLoadingWithLockScreen(false);
      setPriceRecovery(true);
      setCanCalculation(false);
      setSelectParameterButton(null);
      setDeviceCategory("");
      setDeviceSize("");
      setSaveCurrentStation(false);
      setcalculationServerErrorState(false);
      setShowCalculationInCompletedAlert(false);
      setShowCalculationInCompletedModal(false);
      // setCurrentSignalRConnectionId(null);
      // setCurrentCalculationSessionId("");
      setRequestAbortController(null);
      setBillingMethod(null);
      setGraphicDesigner(null);
      setIncludeVAT(null);
      if (
        widgetType === EWidgetProductType.EDIT ||
        widgetType === EWidgetProductType.DUPLICATE
      ) {
        getAllMaterial().then((materials) => {
          getProductQuoteItemById(materials, router?.query?.productId);
        });
      } else {
        getAllMaterial().then((materials) => {
          getProductById(materials);
        });
      }
    }
  }, [connectionId, router?.query?.productId]);

  useEffect(() => {
    if (
      router?.query?.productId &&
      (widgetType === EWidgetProductType.EDIT ||
        widgetType === EWidgetProductType.DUPLICATE)
    ) {
      getAllMaterial().then((materials) => {
        getProductQuoteItemById(materials, router?.query?.productId);
      });
    }
  }, [router?.query?.productId]);

  const exampleTypeValues = useRecoilValue(exampleTypeState);
  const billingMethodValues = useRecoilValue(billingMethodState);
  const listEmployeesValues = useRecoilValue(listEmployeesAtom);

  const getGraphicsTypeValue = (billingMethod?: GraphicsTypesParam) => {
    if (billingMethod && billingMethod === GraphicsTypesParam.PriceHour) {
      return billingMethodValues.find((item) => item.value === "workingHours");
    } else {
      return billingMethodValues.find((item) => item.value === "fixedPrice");
    }
  };

  const getSampleType = (sampleTypeValue?: number) => {
    const found = exampleTypeValues.find(
      (item) => item.key === sampleTypeValue.toString()
    );
    return found ? { text: found.value, value: found.key } : null;
  };

  const getSampleTypeValue = (sampleType?: SampleTypeOption): number => {
    return sampleType.value;
  };

  useEffect(() => {
    if (
      widgetType === EWidgetProductType.EDIT ||
      widgetType === EWidgetProductType.DUPLICATE
    ) {
      if (documentItemByEdit) {
        setGraphicNotes(documentItemByEdit.graphicNotes);
        setPrintingNotes(documentItemByEdit.printingNotes);
        if (documentItemByEdit?.exampleType) {
          setSampleType(getSampleType(documentItemByEdit?.exampleType));
        }
        if (documentItemByEdit?.graphicsTypes) {
          setBillingMethod(
            getGraphicsTypeValue(documentItemByEdit?.graphicsTypes)
          );
        }
        if (documentItemByEdit?.graphicsEmployeeId) {
          setGraphicDesigner(
            listEmployeesValues?.find(
              (item) => item.id === documentItemByEdit?.graphicsEmployeeId
            )
          );
        }
      }
    }
  }, [widgetType, documentItemByEdit]);

  useEffect(() => {
    if (canCalculation) {
      calculationProduct(subProducts);
    }
  }, [subProducts, canCalculation, productTemplate, router]);

  interface BillingMethod {
    value: string;
    text: string;
  }



  const getGraphicsType = (
    billingMethod?: BillingMethod
  ): GraphicsTypesParam => {
    if (billingMethod && billingMethod.value === "workingHours") {
      return GraphicsTypesParam.PriceHour;
    } else {
      return GraphicsTypesParam.PriceRegularHour;
    }
  };

  const { duplicateType } = router?.query;
  const itemId = duplicateType
    ? Number(duplicateType) === DuplicateType.SameOrderAndSameBoardMissionNumber
      ? router?.query?.documentItemId
      : router?.query?.documentId
    : undefined;

  useEffect(() => {
    const itemQuantity =
      quantity &&
        quantity.values &&
        quantity.values.length &&
        quantity?.values[0]
        ? +quantity?.values[0]
        : 1;
    if (!isNaN(sliderCurrentProductItemValueTotalPrice) && itemQuantity) {
      const productItemValue = {
        signalRConnectionId: currentSignalRConnectionId,
        productItemValueId: productItemValueDraftId,
        itemId: itemId,
        productId: router?.query?.productId,
        // supplierId: graphicDesigner && graphicDesigner?.id,
        customerID: router?.query?.customerId,
        // unitPrice: +currentProductItemValueTotalPrice / itemQuantity,
        // finalPrice: +currentProductItemValueTotalPrice,
        unitPrice: +sliderCurrentProductItemValueTotalPrice / itemQuantity,
        finalPrice: +sliderCurrentProductItemValueTotalPrice,
        amount: itemQuantity,
        isNeedGraphics: false,
        isUrgentWork: urgentOrder,
        printingNotes,
        graphicNotes,
        isNeedExample: false,
        isDuplicatedWithAnotherQuantity: false,
        graphicsEmployeeId: graphicDesigner?.id,
        graphicsTypes: billingMethod && getGraphicsType(billingMethod),
        duplicateType: router?.query?.duplicateType,
        documentId: router?.query?.documentId,
        exampleType: sampleType && getSampleTypeValue(sampleType),
      };
      setCurrentProductItemValue(productItemValue);
    }
  }, [
    subProducts,
    selectedWorkFlow,
    currentProductItemValueTotalPrice,
    sliderCurrentProductItemValueTotalPrice,
    graphicDesigner,
    currentSignalRConnectionId,
    productItemValueDraftId,
    router,
    urgentOrder,
    printingNotes,
    graphicNotes,
    billingMethod,
    sampleType,
  ]);

  const SelectWorkFlowById = async (data) => {
    const callBack = (res) => {
      if (res?.success) {
        _setDataFromSelectedWorkFlow(res, currentCalculationSessionId, true);
      } else {
        alertFault(res?.message);
      }
    };
    await selectWorkflowByIdApi(callApi, callBack, {
      signalRConnectionId: currentSignalRConnectionId,
      workflowId: data?.workflowId,
      productId: router.query.productId,
    });
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const _getParameter = (parameter: any, subSection: any, section: any) => {
    const allParameters = subProducts.flatMap((item) => item.parameters);
    let temp = [...allParameters];
    const index = temp?.findIndex(
      (item) =>
        item?.parameterId === parameter?.id &&
        item?.sectionId === section?.id &&
        item?.subSectionId === subSection?.id &&
        item?.actionIndex === parameter?.actionIndex
    );
    return temp[index];
  };

  useEffect(() => {
    if (subProducts) {
      let copySubProducts = cloneDeep(subProducts);
      const targetSubProduct = copySubProducts.find(
        (item) => item.type === null
      );

      if (targetSubProduct && targetSubProduct.parameters) {
        let temp = [...targetSubProduct.parameters];
        const sizesParametersArray = [];
        const hasDeviceSize = temp.some(
          (item) => item.parameterCode === "devicesize"
        );
        let widthParm = temp.find((item) => item.parameterCode === "Width");
        let heightParm = temp.find((item) => item.parameterCode === "Height");
        let sizeParm = temp.find((item) => item.parameterCode === "size");
        let devicecategoryParm = temp.find(
          (item) => item.parameterCode === "devicecategory"
        );

        if (!hasDeviceSize && sizeParm?.values[0] !== "custom") {
          sizesParametersArray.forEach((parameter) => {
            let dieCutSizeSubProductParameter = temp.find(
              (x) => x.parameterCode === parameter.parameterCode
            );
            if (dieCutSizeSubProductParameter) {
              dieCutSizeSubProductParameter.isDisabled = true;
            }
          });
        } else if (!hasDeviceSize && devicecategoryParm) {
          sizesParametersArray.push({
            parameterCode: "Width",
            value: widthParm,
          });
          sizesParametersArray.push({
            parameterCode: "Height",
            value: heightParm,
          });
          sizesParametersArray.push({ parameterCode: "size", value: "custom" });
          sizesParametersArray.forEach((parameter) => {
            let dieCutSizeSubProductParameter = temp.find(
              (x) => x.parameterCode === parameter.parameterCode
            );
            if (dieCutSizeSubProductParameter) {
              dieCutSizeSubProductParameter.isDisabled = false;
            }
          });

          let temp2 = cloneDeep(subProducts);
          const index2 = temp2.findIndex((item) => item.type === null);
          temp2[index2] = {
            type: null,
            parameters: temp,
          };

          // Only update state if there's a difference
          if (JSON.stringify(subProducts) !== JSON.stringify(temp2)) {
            setSubProducts(temp2);
          }
        }
      }
    }
  }, [subProducts, setSubProducts]);

  function findParameterInTemplate(template, parameterCodes) {
    let foundParameters = [];

    // Helper function to search within a given section or subsection
    function searchParameters(parameters, sectionId, subSectionId) {
      parameters.forEach((param) => {
        if (parameterCodes.includes(param.code)) {
          foundParameters.push({ ...param, sectionId, subSectionId });
        }
      });
    }

    // Iterate through sections and their subsections
    template.sections.forEach((section) => {
      section.subSections.forEach((subSection) => {
        searchParameters(subSection.parameters, section.id, subSection.id);
      });
    });

    return foundParameters;
  }
  const getMaterialCategories = async () => {
    let copySubProducts = cloneDeep(subProducts);
    const targetSubProduct = copySubProducts.find((item) => item.type === null);
    let temp = [...targetSubProduct.parameters];

    const callBack = (res) => {
      if (res?.success) {
        let printedMaterialWidth = res?.data?.printedMaterialWidth;
        let printedMaterialLength = res?.data?.printedMaterialLength;

        if (printedMaterialWidth) {
          printedMaterialWidth = parseFloat(printedMaterialWidth).toFixed(2);
        }
        if (printedMaterialLength) {
          printedMaterialLength = parseFloat(printedMaterialLength).toFixed(2);
        }

        // Create sizesParametersArray with potential null values
        const sizesParametersArray = [
          { parameterCode: "Width", value: printedMaterialWidth },
          { parameterCode: "Height", value: printedMaterialLength },
        ];

        // Clone the product template
        let templateCopy = cloneDeep(productTemplate);

        // Check if the template contains a parameter with code "size"
        const sizeParameterExists =
          findParameterInTemplate(templateCopy, ["size"]).length > 0;

        // Push 'custom' size code if the template has a size parameter
        if (sizeParameterExists) {
          sizesParametersArray.push({ parameterCode: "size", value: "custom" });
        }

        sizesParametersArray.forEach((parameter) => {
          let dieCutSizeSubProductParameter = temp.find(
            (x) => x.parameterCode === parameter.parameterCode
          );

          if (parameter.value === null) {
            if (
              dieCutSizeSubProductParameter &&
              dieCutSizeSubProductParameter.values[0] !== null
            ) {
              // If there's a value, just set isDisabled to false
              dieCutSizeSubProductParameter.isDisabled = false;
            } else {
              // Remove the parameter from temp if its value is null
              temp = temp.filter(
                (x) => x.parameterCode !== parameter.parameterCode
              );
            }
          } else if (dieCutSizeSubProductParameter) {
            dieCutSizeSubProductParameter.values = [parameter.value];
            dieCutSizeSubProductParameter.isDisabled =
              printedMaterialWidth === null && printedMaterialLength === null
                ? false
                : true;
          } else {
            const foundParameters = findParameterInTemplate(templateCopy, [
              "Width",
              "Height",
            ]);
            if (foundParameters.length > 0) {
              foundParameters.forEach((myparameter) => {
                temp.push({
                  parameterId: myparameter.id,
                  sectionId: myparameter.sectionId,
                  subSectionId: myparameter.subSectionId,
                  ParameterType: myparameter.parameterType,
                  isQuantityParameter: myparameter.isQuantityParameter,
                  parameterName: myparameter.name,
                  actionId: myparameter.actionId,
                  values: [parameter.value],
                  valueIds: [],
                  actionIndex: myparameter.actionIndex,
                  parameterCode: myparameter.code,
                  valuesConfigs: myparameter.valuesConfigs,
                  unitKey: myparameter.unitKey,
                  defaultUnit: myparameter.defaultUnit,
                  unitType: myparameter.unitType,
                  factor: myparameter.factor,
                  isDisabled: true,
                  isGeneralInfoInProductionFloor:
                    myparameter.isGeneralInfoInProductionFloor,
                });
              });
            }
          }
        });

        let temp2 = [...subProducts];
        const index2 = temp2.findIndex((item) => item.type === null);
        temp2[index2] = {
          type: null,
          parameters: temp,
        };
        setSubProducts(temp2);
      }
    };
    await getDeviceSizeMockApi(callApi, callBack, {
      categoryKey: deviceCategory,
      name: deviceSize,
    });
  };
  useEffect(() => {
    if (!subProducts) return;

    let copySubProducts = cloneDeep(subProducts);
    const targetSubProduct = copySubProducts.find((item) => item.type === null);

    if (!targetSubProduct) return; // Ensure targetSubProduct is found

    let temp = [...targetSubProduct.parameters];
    // Check for devicesize and set isDisabled to false for Width and Height
    const deviceSizeParameter = temp.find(
      (x) => x.parameterCode === "devicesize"
    );

    if (!deviceSizeParameter) {
      temp.forEach((param) => {
        if (
          param.parameterCode === "Width" ||
          param.parameterCode === "Height"
        ) {
          param.isDisabled = false;
        }
      });
    }

    const index2 = copySubProducts.findIndex((item) => item.type === null);
    if (index2 !== -1) {
      copySubProducts[index2] = {
        type: null,
        parameters: temp,
      };
      setSubProducts(copySubProducts);
    }
  }, [deviceSize]);
  useEffect(() => {
    if (deviceSize && deviceCategory) {
      getMaterialCategories();
    }
  }, [deviceSize, deviceCategory]);

  const setOpenQuantityComponent = useDebouncedCallback(() => {
    setOpenQuantityComponentModal(true);
  }, 500);

  const _renderParameterType = (
    parameter: any,
    subSection: any,
    section: any,
    subSectionParameters,
    value,
    list,
    inModal: any,
    inRow: boolean,
    inunderParameter: boolean
  ) => {
    let Comp;
    const parametersArray = subProducts.flatMap((item) => item.parameters);
    const temp = [...parametersArray];
    const index = temp?.findIndex(
      (item) =>
        item.parameterId === parameter?.id &&
        item.sectionId === section?.id &&
        item.subSectionId === subSection?.id &&
        item?.actionIndex === parameter?.actionIndex
    );
    if (
      parameter?.parameterType === EParameterTypes.INPUT_NUMBER &&
      parameter?.code === "quantity"
    ) {
      const typesNum =
        typesParam && typesParam.values ? typesParam.values[0] : 0;
      const isSets =
        isSetsParameter && isSetsParameter.values
          ? isSetsParameter.values[0]
          : "";
      const isInputDisabled = typesNum > 1 || isSets === "true";
      Comp = (
        <React.Fragment>
          <InputNumberParameterWidget
            clasess={clasess}
            parameter={parameter}
            index={index}
            temp={temp}
            onChangeSubProductsForPrice={onChangeSubProductsForPrice}
            subSection={subSection}
            section={section}
            type="number"
            disabled={isInputDisabled}
            widgetType={widgetType}
            setIsJobNameValue={setIsJobNameValue}
          />
          <QuantityParameter
            subSection={subSection}
            section={section}
            validateParameters={validateParameters}
            setCanCalculation={setCanCalculation}
          />
        </React.Fragment>
      );
    } else if (
      parameter?.parameterType === EParameterTypes.INPUT_NUMBER &&
      parameter?.id === typesParam?.parameterId
    ) {
      const isSets =
        isSetsParameter && isSetsParameter.values
          ? isSetsParameter.values[0]
          : "";
      const isInputDisabled = isSets === "true";
      Comp = (
        <React.Fragment>
          <InputNumberParameterWidget
            clasess={clasess}
            parameter={parameter}
            index={index}
            temp={temp}
            onChangeSubProductsForPrice={onChangeSubProductsForPrice}
            subSection={subSection}
            section={section}
            type="number"
            disabled={isInputDisabled}
            extraOnChange={() => {
              setOpenQuantityComponent();
            }}
            widgetType={widgetType}
            setIsJobNameValue={setIsJobNameValue}
          />
        </React.Fragment>
      );
    } else if (
      parameter?.parameterType === EParameterTypes.INPUT_NUMBER &&
      parameter?.id === widthParam?.parameterId
    ) {
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
          widgetType={widgetType}
          setIsJobNameValue={setIsJobNameValue}
        />
      );
    } else if (
      parameter?.parameterType === EParameterTypes.INPUT_NUMBER &&
      parameter?.id === heightParam?.parameterId
    ) {
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
          widgetType={widgetType}
          setIsJobNameValue={setIsJobNameValue}
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
          widgetType={widgetType}
          setIsJobNameValue={setIsJobNameValue}
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
          widgetType={widgetType}
          setIsJobNameValue={setIsJobNameValue}
        />
      );
    } else if (
      parameter?.parameterType === EParameterTypes.DROP_DOWN_LIST ||
      parameter?.parameterType === EParameterTypes.MACHINES_SELECT
    ) {
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
          multiParameterModal={multiParameterModal}
        />
      );
    } else if (
      parameter?.parameterType === EParameterTypes.SELECT_CHILDS_PARAMETERS
    ) {
      let disabled = false;
      const sizeParameter = getParameterByParameterCode(subProducts, "size");
      if (sizeParameter && sizeParameter.isDisabled) {
        disabled = true;
      }
      Comp = (
        <SelectChildParameterWidget
          parameter={parameter}
          clasess={clasess}
          index={index}
          temp={temp}
          onChangeSubProductsForPrice={onChangeSubProductsForPrice}
          subSection={subSection}
          section={section}
          disabled={disabled}
          multiParameterModal={multiParameterModal}
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
          straightKnife={straightKnife}
          allMaterials={allMaterials}
          template={productTemplate}
          getProductById={getProductById}
          isCreate={widgetType == EWidgetProductType.CREATE}
        />
      );
    } else if (
      parameter?.parameterType === EParameterTypes.SELECT_MATERIALS ||
      parameter?.parameterType === EParameterTypes.ADVERTISING_PRODUCT_CATEGORY
    ) {
      const paramKey = `${parameter.id}_${section.id}_${subSection.id}_${parameter.actionIndex || 0}`;
      const removedParam = removedMaterialParameters[paramKey];
      Comp = (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
            setDeviceCategory={setDeviceCategory}
            setDeviceSize={setDeviceSize}
          />
          {
            removedParam && <div style={{ ...FONT_FAMILY.Lexend(500, 12) }}>
              {t("products.offsetPrice.admin.removedData")} {removedParam?.values[0]}
            </div>
          }
        </div>
      );
    }
    else if (
      parameter?.parameterType === EParameterTypes.ADVERTISING_PRODUCT_NAME ||
      parameter?.parameterType === EParameterTypes.SELECT_FIXED_VALUES_WITH_IMAGES
    ) {
      Comp = (
        <AdvertisingProductNameParameterWidget
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
          connectionId={connectionId}
          getProductById={getProductById}
          getAllMaterial={getAllMaterial}
          newDieCutSelect={newDieCutSelect}
        />
      );
    }

    return (
      <>
        {!parameter?.isHiddenInSetting && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div
              style={
                inRow
                  ? clasess.parameterRowContainer
                  : clasess.parameterContainer
              }
            >
              <div
                style={
                  errorText &&
                    parameter?.isRequired &&
                    (value?.values?.[0]?.length === 0 || !value?.values?.[0])
                    ? clasess.parameterRequierdLabelStyle
                    : value?.values?.[0] === "true"
                      ? inunderParameter
                        ? clasess.parameterunderParameterStyle
                        : clasess.parameterType3ActiveLabelStyle
                      : inunderParameter
                        ? clasess.underParameterLabelStyle
                        : clasess.parameterLabelStyle
                }
              >
                {parameter?.name}
                <small>
                  &nbsp;
                  {unitType === UNIT_TYPE.IMPERIAL
                    ? parameter?.imperialUnit
                    : parameter?.defaultUnit}
                </small>
                {parameter?.isRequired ? (
                  <span style={clasess.spanRequierd}> *</span>
                ) : null}
              </div>
              <div
                style={
                  inRow ? { width: "5%" } : clasess.renderParameterTypeContainer
                }
              >
                {Comp}
              </div>
              {!inunderParameter && (
                <div style={clasess.oldSystemValueText}>
                  {parameter?.oldSystemValue}
                </div>
              )}
            </div>
            <>
              {parameter?.relatedParameters?.length > 0 &&
                inModal &&
                subSection.optionToDuplicateContent && (
                  <>
                    {parameter?.relatedParameters
                      .filter((relatedParameter) =>
                        subSection.parameters.some(
                          (p) => p.id === relatedParameter.parameterId
                        )
                      )
                      .filter(
                        (relatedParameter) =>
                          !underParameterIds.some(
                            (underParam) =>
                              underParam.myParameter?.id ===
                              relatedParameter.parameterId
                          )
                      )
                      .map((relatedParameter) => {
                        const subProduct = subProducts?.find(
                          (x) => x.type === subSection?.type
                        );
                        const parm = subProduct?.parameters?.find(
                          (param) =>
                            param.parameterId === parameter.id &&
                            param.actionIndex === parameter.actionIndex
                        );
                        const myParameter = list?.find(
                          (p) =>
                            p.id === relatedParameter.parameterId &&
                            p.actionIndex === relatedParameter.actionIndex
                        );

                        if (
                          relatedParameter.activateByAllValues &&
                          parm?.values
                        ) {
                          if (relatedParameter.activateByAllValues) {
                            if (subSection.optionToDuplicateContent) {
                              const { parameterId, actionIndex } =
                                relatedParameter;
                              const myParameter = list?.find(
                                (p) =>
                                  p.id === parameterId &&
                                  p.actionIndex === actionIndex
                              );
                              const value = _getParameter(
                                myParameter,
                                subSection,
                                section
                              );
                              return (
                                <React.Fragment>
                                  {relatedParameter.isStartNewLine ? (
                                    <div
                                      style={{ flexBasis: "100%", height: 0 }}
                                    />
                                  ) : (
                                    <></>
                                  )}
                                  <div key={parameterId}>
                                    {_renderParameterType(
                                      myParameter,
                                      subSection,
                                      section,
                                      subSection?.parameters,
                                      value,
                                      list,
                                      true,
                                      false,
                                      false
                                    )}
                                  </div>
                                </React.Fragment>
                              );
                            }
                          }
                          let productCopy = cloneDeep(productTemplate);
                          const sectionCopy = productCopy.sections?.find(
                            (x) => x.id === section.id
                          );
                          const subSectionCopy = sectionCopy.subSections?.find(
                            (x) => x.id === subSection.id
                          );
                          const param = subSectionCopy.parameters?.find(
                            (x) => x.id === relatedParameter.parameterId
                          );
                          if (param.isHidden == false) {
                            return;
                          }
                          param.isHidden = false;
                          setProductTemplate(productCopy);
                        } else if (
                          parameter?.parameterType ===
                          EParameterTypes.DROP_DOWN_LIST ||
                          parameter?.parameterType ===
                          EParameterTypes.SELECT_MATERIALS ||
                          parameter?.parameterType ===
                          EParameterTypes.MACHINES_SELECT
                        ) {
                          const valueInArray =
                            relatedParameter.selectedValueIds?.find(
                              (c) => c == parm?.valueIds
                            );
                          if (valueInArray) {
                            if (subSection.optionToDuplicateContent) {
                              const { parameterId, actionIndex } =
                                relatedParameter;
                              const myParameter = list?.find(
                                (p) =>
                                  p.id === parameterId &&
                                  p.actionIndex === actionIndex
                              );
                              return (
                                <React.Fragment>
                                  {myParameter.isStartNewLine ? (
                                    <div
                                      style={{ flexBasis: "100%", height: 0 }}
                                    />
                                  ) : (
                                    <></>
                                  )}
                                  <div key={parameterId}>
                                    {_renderParameterType(
                                      myParameter,
                                      subSection,
                                      section,
                                      subSection?.parameters,
                                      myParameter?.value,
                                      list,
                                      true,
                                      false,
                                      false
                                    )}
                                  </div>
                                </React.Fragment>
                              );
                            }
                            if (relatedParameter.activateByAllValues) {
                              if (subSection.optionToDuplicateContent) {
                                const { parameterId, actionIndex } =
                                  relatedParameter;
                                const myParameter = list?.find(
                                  (p) =>
                                    p.id === parameterId &&
                                    p.actionIndex === actionIndex
                                );
                                return (
                                  <React.Fragment>
                                    {myParameter.isStartNewLine ? (
                                      <div
                                        style={{ flexBasis: "100%", height: 0 }}
                                      />
                                    ) : (
                                      <></>
                                    )}
                                    <div key={parameterId}>
                                      {_renderParameterType(
                                        myParameter,
                                        subSection,
                                        section,
                                        subSection?.parameters,
                                        myParameter?.value,
                                        list,
                                        true,
                                        false,
                                        false
                                      )}
                                    </div>
                                  </React.Fragment>
                                );
                              }

                              let productCopy = cloneDeep(productTemplate);
                              const sectionCopy = productCopy.sections?.find(
                                (x) => x.id === section.id
                              );
                              const subSectionCopy =
                                sectionCopy.subSections?.find(
                                  (x) => x.id === subSection.id
                                );
                              const param = subSectionCopy.parameters?.find(
                                (x) =>
                                  x.id === relatedParameter.parameterId &&
                                  x.actionIndex == relatedParameter.actionIndex
                              );
                              if (param.isHidden == false) {
                                return;
                              }
                              param.isHidden = false;
                              setProductTemplate(productCopy);
                            }

                            let productCopy = cloneDeep(productTemplate);
                            const sectionCopy = productCopy.sections?.find(
                              (x) => x.id === section.id
                            );
                            const subSectionCopy =
                              sectionCopy.subSections?.find(
                                (x) => x.id === subSection.id
                              );
                            const param = subSectionCopy.parameters?.find(
                              (x) =>
                                x.id === relatedParameter.parameterId &&
                                x.actionIndex == relatedParameter.actionIndex
                            );
                            if (param.isHidden == false) {
                              return;
                            }
                            param.isHidden = false;
                            setProductTemplate(productCopy);
                          }

                          if (
                            relatedParameter.activateByAllValues &&
                            parm?.values
                          ) {
                            let productCopy = cloneDeep(productTemplate);
                            const sectionCopy = productCopy.sections?.find(
                              (x) => x.id === section.id
                            );
                            const subSectionCopy =
                              sectionCopy.subSections?.find(
                                (x) => x.id === subSection.id
                              );
                            const param = subSectionCopy.parameters?.find(
                              (x) =>
                                x.id === relatedParameter.parameterId &&
                                x.actionIndex == relatedParameter.actionIndex
                            );
                            if (param.isHidden == false) {
                              return;
                            }
                            param.isHidden = false;
                            setProductTemplate(productCopy);
                          } else {
                            let productCopy = cloneDeep(productTemplate);
                            const sectionCopy = productCopy.sections.find(
                              (x) => x.id === section.id
                            );
                            const subSectionCopy = sectionCopy.subSections.find(
                              (x) => x.id === subSection.id
                            );
                            const param = subSectionCopy.parameters.find(
                              (x) =>
                                x.id === relatedParameter.parameterId &&
                                x.actionIndex == relatedParameter.actionIndex
                            );
                            if (param && param.isHidden == true) {
                              return;
                            }
                            // if (param) {
                            //   param.isHidden = true;
                            //   setProductTemplate(productCopy);
                            // }
                          }
                        } else {
                          const valueInArray =
                            relatedParameter.selectedValueIds?.find(
                              (c) => c == parm?.values
                            );
                          if (
                            (valueInArray && myParameter) ||
                            (!parm &&
                              relatedParameter &&
                              relatedParameter.selectedValueIds &&
                              relatedParameter.selectedValueIds.length > 0 &&
                              relatedParameter.selectedValueIds[0] === "false")
                          ) {
                            let productCopy = cloneDeep(productTemplate);
                            const sectionCopy = productCopy.sections?.find(
                              (x) => x.id === section.id
                            );
                            const subSectionCopy =
                              sectionCopy.subSections?.find(
                                (x) => x.id === subSection.id
                              );
                            const param = subSectionCopy.parameters?.find(
                              (x) => x.id === relatedParameter.parameterId
                            );

                            if (param.isHidden == false) {
                              return;
                            }
                            param.isHidden = false;
                            setProductTemplate(productCopy);
                          } else {
                            let productCopy = cloneDeep(productTemplate);
                            const sectionCopy = productCopy.sections.find(
                              (x) => x.id === section.id
                            );
                            const subSectionCopy = sectionCopy.subSections.find(
                              (x) => x.id === subSection.id
                            );
                            const param = subSectionCopy.parameters.find(
                              (x) => x.id === relatedParameter.parameterId
                            );
                            if (param.isHidden == true) {
                              return;
                            }
                            param.isHidden = true;
                            setProductTemplate(productCopy);
                          }
                        }
                      })}
                  </>
                )}
            </>
          </div>
        )}
      </>
    );
  };
  const processRelatedParameters2 = (
    parameter,
    subSection,
    section,
    productTemplate,
    subProducts
  ) => {
    const hasRelatedParams = parameter?.relatedParameters?.length > 0;
    const hasChildParams = parameter?.childsParameters?.length > 0;
    const isHidden = parameter.isHidden === true;

    const relatedParametersfilterd = parameter?.relatedParameters?.filter(
      (relatedParameter) =>
        subSection.parameters.some((p) => p.id === relatedParameter.parameterId)
    );
    relatedParametersfilterd?.map((relatedParameter) => {
      const subProduct = subProducts?.find((x) => x.type === subSection?.type);
      let actionIndex = parameter.actionIndex;
      if (actionIndex == null) {
        actionIndex = 0;
      }

      const parm = subProduct?.parameters?.find(
        (param) =>
          param.parameterId === parameter.id &&
          param.actionIndex === parameter.actionIndex &&
          param.sectionId === section.id &&
          param.subSectionId === subSection.id
      );
      const myParameter = subSection?.parameters?.find(
        (p) =>
          p.id === relatedParameter.parameterId && p.actionIndex === actionIndex
      );
      if (!myParameter) {
        return;
      }
      if (parameter.isHidden == true) {
        const sectionCopy = productTemplate.sections.find(
          (x) => x.id === section.id
        );
        const subSectionCopy = sectionCopy.subSections.find(
          (x) => x.id === subSection.id
        );
        const param = subSectionCopy.parameters.find(
          (x) => x.id === relatedParameter.parameterId
        );
        if (hasRelatedParams && hasChildParams && isHidden) {
          parameter.childsParameters.forEach((childParam) => {
            const myParamFinded = subSectionCopy.parameters.find(
              (x) => x.id === childParam.id
            );
            if (myParamFinded) {
              myParamFinded.isHidden = false;
            }
          });
        }
        if (param.isHidden == true) {
          if (param.relatedParameters) {
            for (let i = 0; i < param.relatedParameters.length; i++) {
              let relatedParameterId = param.relatedParameters[i].parameterId;
              let relatedParameter = subSectionCopy.parameters.find(
                (x) => x.id === relatedParameterId
              );
              if (relatedParameter) {
                relatedParameter.isHidden = true;
              }
            }
          }
          processRelatedParameters2(
            param,
            subSection,
            section,
            productTemplate,
            subProducts
          );
          return;
        }

        subProducts.forEach((x) => {
          if (x.type == subSection.type) {
            x = {
              ...x,
              parameters: x.parameters.filter((p) => p.parameterId != param.id),
            };
          }
        });
        if (!hasRelatedParams && !hasChildParams) {
          param.isHidden = true;
          processRelatedParameters2(
            param,
            subSection,
            section,
            productTemplate,
            subProducts
          );
          return;
        }
      }

      let paramValue = "";
      if (parm?.values && parm?.values.length > 0) {
        paramValue = parm?.values[0];
      }
      if (relatedParameter.activateByAllValues && paramValue) {
        const sectionCopy = productTemplate.sections?.find(
          (x) => x.id === section.id
        );
        const subSectionCopy = sectionCopy.subSections?.find(
          (x) => x.id === subSection.id
        );
        const param = subSectionCopy.parameters?.find(
          (x) => x.id === relatedParameter.parameterId
        );
        if (param.isHidden == false) {
          processRelatedParameters2(
            param,
            subSection,
            section,
            productTemplate,
            subProducts
          );
          return;
        }
        param.isHidden = false;
        processRelatedParameters2(
          param,
          subSection,
          section,
          productTemplate,
          subProducts
        );
      } else if (relatedParameter.activateByAllValues && !paramValue) {
        const sectionCopy = productTemplate.sections.find(
          (x) => x.id === section.id
        );
        const subSectionCopy = sectionCopy.subSections.find(
          (x) => x.id === subSection.id
        );
        const param = subSectionCopy.parameters.find(
          (x) => x.id === relatedParameter.parameterId
        );
        if (param.isHidden == true) {
          processRelatedParameters2(
            param,
            subSection,
            section,
            productTemplate,
            subProducts
          );
          return;
        }
        param.isHidden = true;
        // subProducts.forEach(x => {
        //   if (x.type == subSection.type) {
        //     x.parameters = x.parameters.filter(p => p.parameterId != param.id)
        //   }
        // })
        subProducts.forEach((x) => {
          if (x.type == subSection.type) {
            x = {
              ...x,
              parameters: x.parameters.filter((p) => p.parameterId != param.id),
            };
          }
        });
        processRelatedParameters2(
          param,
          subSection,
          section,
          productTemplate,
          subProducts
        );
      } else if (
        parameter?.parameterType === EParameterTypes.DROP_DOWN_LIST ||
        parameter?.parameterType === EParameterTypes.SELECT_MATERIALS ||
        parameter?.parameterType === EParameterTypes.MACHINES_SELECT
      ) {
        const valueInArray = relatedParameter.selectedValueIds?.find(
          (c) => c == parm?.valueIds
        );

        if (valueInArray) {
          const sectionCopy = productTemplate.sections?.find(
            (x) => x.id === section.id
          );
          const subSectionCopy = sectionCopy.subSections?.find(
            (x) => x.id === subSection.id
          );
          const param = subSectionCopy.parameters?.find(
            (x) => x.id === relatedParameter.parameterId
          );
          if (param.isHidden == false) {
            processRelatedParameters2(
              param,
              subSection,
              section,
              productTemplate,
              subProducts
            );
            return;
          }
          param.isHidden = false;
          processRelatedParameters2(
            param,
            subSection,
            section,
            productTemplate,
            subProducts
          );
        } else {
          const sectionCopy = productTemplate.sections.find(
            (x) => x.id === section.id
          );
          const subSectionCopy = sectionCopy.subSections.find(
            (x) => x.id === subSection.id
          );
          const param = subSectionCopy.parameters.find(
            (x) => x.id === relatedParameter.parameterId
          );
          if (param.isHidden == true) {
            if (param.relatedParameters) {
              for (let i = 0; i < param.relatedParameters.length; i++) {
                let relatedParameterId = param.relatedParameters[i].parameterId;
                let relatedParameter = subSectionCopy.parameters.find(
                  (x) => x.id === relatedParameterId
                );
                if (relatedParameter) {
                  relatedParameter.isHidden = true;
                }
              }
            }
            processRelatedParameters2(
              param,
              subSection,
              section,
              productTemplate,
              subProducts
            );
            return;
          }
          subProducts.forEach((x) => {
            if (x.type == subSection.type) {
              x = {
                ...x,
                parameters: x.parameters.filter(
                  (p) => p.parameterId != param.id
                ),
              };
            }
          });
          param.isHidden = true;
          if (param.relatedParameters) {
            for (let i = 0; i < param.relatedParameters.length; i++) {
              let relatedParameterId = param.relatedParameters[i].parameterId;
              let relatedParameter = subSectionCopy.parameters.find(
                (x) => x.id === relatedParameterId
              );
              if (relatedParameter) {
                relatedParameter.isHidden = true;
              }
            }
          }
          processRelatedParameters2(
            param,
            subSection,
            section,
            productTemplate,
            subProducts
          );
        }
      } else {
        const valueInArray = relatedParameter.selectedValueIds?.find(
          (c) =>
            c == (parm?.ParameterType === 11 ? parm?.valueIds : parm?.values) ||
            (c == "false" && !parm?.values)
        );
        if (
          (valueInArray && myParameter) ||
          (!parm &&
            relatedParameter &&
            relatedParameter.selectedValueIds &&
            relatedParameter.selectedValueIds.length > 0 &&
            relatedParameter.selectedValueIds[0] === "false")
        ) {
          const sectionCopy = productTemplate.sections?.find(
            (x) => x.id === section.id
          );
          const subSectionCopy = sectionCopy.subSections?.find(
            (x) => x.id === subSection.id
          );
          const param = subSectionCopy.parameters?.find(
            (x) => x.id === relatedParameter.parameterId
          );
          if (param.isHidden == false) {
            processRelatedParameters2(
              param,
              subSection,
              section,
              productTemplate,
              subProducts
            );
            return;
          }
          param.isHidden = false;
        } else {
          const sectionCopy = productTemplate.sections.find(
            (x) => x.id === section.id
          );
          const subSectionCopy = sectionCopy.subSections.find(
            (x) => x.id === subSection.id
          );
          const param = subSectionCopy.parameters.find(
            (x) => x.id === relatedParameter.parameterId
          );
          if (param.isHidden == true) {
            if (param.relatedParameters) {
              for (let i = 0; i < param.relatedParameters.length; i++) {
                let relatedParameterId = param.relatedParameters[i].parameterId;
                let relatedParameter = subSectionCopy.parameters.find(
                  (x) => x.id === relatedParameterId
                );
                if (relatedParameter) {
                  relatedParameter.isHidden = true;
                }
              }
            }
            processRelatedParameters2(
              param,
              subSection,
              section,
              productTemplate,
              subProducts
            );
            return;
          }
          subProducts.forEach((x) => {
            if (x.type == subSection.type) {
              x = {
                ...x,
                parameters: x.parameters.filter(
                  (p) => p.parameterId != param.id
                ),
              };
            }
          });
          if (param.relatedParameters) {
            for (let i = 0; i < param.relatedParameters.length; i++) {
              let relatedParameterId = param.relatedParameters[i].parameterId;
              let relatedParameter = subSectionCopy.parameters.find(
                (x) => x.id === relatedParameterId
              );
              if (relatedParameter) {
                relatedParameter.isHidden = true;
              }
            }
          }
          param.isHidden = true;
          processRelatedParameters2(
            param,
            subSection,
            section,
            productTemplate,
            subProducts
          );
        }
      }
    });
  };

  const [valuesState, setValuesState] = useRecoilState(
    tempProductQuantityTypesValuesState
  );

  const removeRelatedParametersFromSubProducts = (
    parameterId: string,
    sectionId: string,
    subSectionId: string,
    parameters: any[],
    actionIndex: number
    // productTemplate: any
  ) => {
    // Remove ALL instances of this parameter from the parameters array
    let found = true;
    while (found) {
      const paramIndex = parameters.findIndex(
        (param) =>
          param.parameterId === parameterId &&
          param.actionIndex == actionIndex &&
          param.sectionId == sectionId &&
          param.subSectionId == subSectionId
      );
      if (paramIndex !== -1) {
        parameters.splice(paramIndex, 1);
      } else {
        found = false;
      }
    }
    const productTemplateCopy = cloneDeep(productTemplate);
    // Find the parameter definition in the template
    const section = productTemplateCopy.sections.find(
      (section) => section.id === sectionId
    );
    const subSection = section?.subSections.find(
      (sub) => sub.id === subSectionId
    );
    const paramDef = subSection?.parameters.find(
      (param) => param.id === parameterId && param.actionIndex == actionIndex
    );

    // Recursively remove all parameters that this parameter is related to (down the chain)
    if (paramDef && paramDef.relatedParameters) {
      paramDef.relatedParameters.forEach((relatedParam) => {
        removeRelatedParametersFromSubProducts(
          relatedParam.parameterId,
          sectionId,
          subSectionId,
          parameters,
          relatedParam.actionIndex !== undefined
            ? relatedParam.actionIndex
            : actionIndex
        );
      });
    }

    // Recursively remove all setting parameters (if you want this too)
    if (paramDef && paramDef.settingParameters) {
      paramDef.settingParameters.forEach((settingParam) => {
        removeRelatedParametersFromSubProducts(
          settingParam.id,
          sectionId,
          subSectionId,
          parameters,
          settingParam.actionIndex !== undefined
            ? settingParam.actionIndex
            : actionIndex
        );
      });
    }
  };
  const addRelatedParametersWithDefaultValues = (
    parameterId: string,
    sectionId: string,
    subSectionId: string,
    parameters: any[],
    productTemplateCopy,
    actionIndex: number,
    subSectionType: string
  ) => {
    const section = productTemplateCopy.sections.find(
      (section) => section.id === sectionId
    );
    const subSection = section?.subSections.find(
      (sub) => sub.id === subSectionId
    );
    const parentParameter = subSection?.parameters.find(
      (param) => param.id === parameterId && param.actionIndex == actionIndex
    );
    // Check if the parameter has related parameters
    if (parentParameter && parentParameter.relatedParameters) {
      parentParameter.relatedParameters.forEach((relatedParam) => {
        // Find the related parameter in the subSection
        const relatedParameter = subSection?.parameters.find(
          (param) =>
            param.id === relatedParam.parameterId &&
            param.actionIndex == relatedParam?.actionIndex
        );
        if (relatedParameter) {
          let valueToAdd = null;
          let valueIds = null;
          // Handle the case where parameterType is 5
          if (
            relatedParameter.parameterType === 5 ||
            relatedParameter.parameterType === 0 ||
            relatedParameter.parameterType === 12
          ) {
            const defaultConfig = relatedParameter.valuesConfigs?.find(
              (config) => config.isDefault
            );
            if (
              defaultConfig &&
              defaultConfig.values &&
              defaultConfig.values.length > 0
            ) {
              valueToAdd = defaultConfig.values[0];
              valueIds =
                relatedParameter.parameterType === 12
                  ? valueToAdd
                  : defaultConfig.values[0];
            } else if (defaultConfig && defaultConfig.updateName) {
              valueToAdd = defaultConfig.updateName;
              valueIds =
                relatedParameter.parameterType === 12
                  ? valueToAdd
                  : defaultConfig.id;
            } else if (
              relatedParameter.valuesConfigs &&
              relatedParameter.valuesConfigs.length === 1 &&
              relatedParameter.valuesConfigs[0]?.values?.length > 0 &&
              relatedParameter.isRequired
            ) {
              valueToAdd = relatedParameter.valuesConfigs[0]?.updateName;
              valueIds = relatedParameter.valuesConfigs[0]?.values[0];
            }
          } else if (relatedParameter.defaultValue) {
            valueToAdd = relatedParameter.defaultValue;
            valueIds = relatedParameter.defaultValue;
          }

          if (valueToAdd !== null) {
            // Check if the related parameter is already in the parameters array
            const relatedIndex = parameters.findIndex(
              (param) =>
                param.parameterId === relatedParameter.id &&
                param.actionIndex == relatedParameter?.actionIndex
            );
            if (relatedIndex === -1) {
              // Add the related parameter to the parameters array
              parameters.push({
                parameterId: relatedParameter.id,
                sectionId: sectionId,
                subSectionId: subSectionId,
                ParameterType: relatedParameter.parameterType,
                isQuantityParameter: relatedParameter.isQuantityParameter,
                parameterName: relatedParameter.name,
                actionId: relatedParameter.actionId,
                values: [valueToAdd],
                valueIds: [valueIds], // Adjust if necessary
                actionIndex: relatedParameter.actionIndex,
                parameterCode: relatedParameter.code,
                valuesConfigs: relatedParameter?.valuesConfigs,
                unitKey: relatedParameter?.unitKey,
                defaultUnit: relatedParameter?.defaultUnit,
                unitType: relatedParameter?.unitType,
                factor: relatedParameter?.factor,
                isGeneralInfoInProductionFloor:
                  relatedParameter?.isGeneralInfoInProductionFloor,
              });
              relatedParameter.isHidden = false;
              const parameterValue = relatedParameter.valuesConfigs.find(
                (x) => x.id === valueIds
              );
              let actionIndex = relatedParameter.actionIndex;
              if (
                relatedParameter.materialPath &&
                relatedParameter.materialPath.length > 0
              ) {
                const materialPath =
                  relatedParameter.materialPath[
                  relatedParameter.materialPath.length - 1
                  ];
                const materialRelatedParameters = subSection.parameters.filter(
                  (x) =>
                    x.id !== relatedParameter.id &&
                    x.actionIndex === actionIndex &&
                    x.materialPath?.find((y) => compareStrings(y, materialPath))
                );
                // if (materialRelatedParameters?.length > 0) {
                //   parameters = parameters.filter((subProduct) => {
                //     if (subProduct.actionIndex !== actionIndex) {
                //       return true;
                //     }
                //     return !materialRelatedParameters.some(
                //       (materialParameter) =>
                //         materialParameter.id === subProduct.parameterId
                //     );
                //   });
                // }

                materialRelatedParameters?.forEach((param) => {
                  if (param.materialPath && param.materialPath.length > 0) {
                    const materialPath =
                      param.materialPath[param.materialPath.length - 1];
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
                        let prevPathParamDefaultValue = parameters.find(
                          (x) =>
                            x.parameterId === prevPathParam.id &&
                            x.actionIndex === actionIndex
                        );

                        if (
                          prevPathParamDefaultValue &&
                          prevPathParamDefaultValue?.valueIds &&
                          prevPathParamDefaultValue?.valueIds.length
                        ) {
                          allMaterialsCopy = allMaterialsCopy?.find(
                            (x) =>
                              x.valueId ===
                              prevPathParamDefaultValue?.valueIds[0]
                          )?.data;
                        } else {
                          // allMaterialsCopy = []
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
                    param.valuesConfigs = [];
                    param.isHidden = false;
                    paramMaterialValues?.forEach((val) => {
                      let isHiddenValue = false;
                      let isDefault = false;
                      let isDeleted = false;

                      if (param?.additionalValuesConfigs?.length > 0) {
                        param.additionalValuesConfigs.forEach(
                          (additionalConfig) => {
                            if (parameterValue?.id === additionalConfig?.key) {
                              additionalConfig.valuesConfigs.forEach(
                                (config) => {
                                  if (
                                    config.materialValueIds[0]?.valueId ===
                                    val.valueId
                                  ) {
                                    isHiddenValue = config.isHidden; // Set isHidden from valuesConfigs
                                    isDefault = config.isDefault;
                                    isDeleted = config.isDeleted;
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                      param.valuesConfigs.push({
                        id: val.valueId,
                        activateAction: false,
                        isDefault: isDefault,
                        isDeleted: isDeleted,
                        isHidden: isHiddenValue, // Use the determined isHidden value
                        materialValueIds: null,
                        selectedParameterValues: null,
                        updateName: val.value,
                        values: [val.valueId],
                        additionalAttribute: val?.additionalAttribute,
                        currency: val?.currency,
                      });
                    });
                    // paramMaterialValues?.forEach((val) => {
                    //   param.valuesConfigs.push({
                    //     id: val.valueId,
                    //     activateAction: false,
                    //     isDefault: false,
                    //     isDeleted: false,
                    //     isHidden: false,
                    //     materialValueIds: null,
                    //     selectedParameterValues: null,
                    //     updateName: val.value,
                    //     values: [val.valueId],
                    //     additionalAttribute: val?.additionalAttribute,
                    //     currency: val?.currency,
                    //   });
                    // });
                    param.valuesConfigs = param.valuesConfigs.filter(
                      (x) => x.values && x.values.length > 0
                    );
                    if (
                      param?.valuesConfigs &&
                      param?.valuesConfigs?.length === 1 &&
                      param?.isRequired
                    ) {
                      param.valuesConfigs[0].isDefault = true;
                      parameters.push({
                        parameterId: param?.id,
                        parameterName: param?.name,
                        actionId: param?.actionId,
                        parameterType: param?.parameterType,
                        isQuantityParameter: param?.isQuantityParameter,
                        valueIds: param?.valuesConfigs[0]?.values,
                        values: [param?.valuesConfigs[0]?.updateName],
                        sectionId: section?.id,
                        subSectionId: subSection?.id,
                        actionIndex: param?.actionIndex,
                        parameterCode: param?.code,
                        valuesConfigs: param?.valuesConfigs,
                        unitKey: param?.unitKey,
                        defaultUnit: param?.defaultUnit,
                        unitType: param?.unitType,
                        factor: param?.factor,
                        isGeneralInfoInProductionFloor:
                          param?.isGeneralInfoInProductionFloor,
                      });
                    }
                  }
                });
              }
              if (
                parameterValue &&
                parameterValue.selectedParameterValues &&
                parameterValue.selectedParameterValues.length > 0
              ) {
                parameterValue.selectedParameterValues.forEach(
                  (selectedParam) => {
                    if (
                      selectedParam.valueIds &&
                      selectedParam.valueIds.length > 0
                    ) {
                      const param = relatedParameter.settingParameters.find(
                        (param) => param.id === selectedParam.parameterId
                      );
                      parameters.push({
                        parameterId: param.id,
                        sectionId: sectionId,
                        subSectionId: subSectionId,
                        ParameterType: param.parameterType,
                        isQuantityParameter: param?.isQuantityParameter,
                        parameterName: param.name,
                        actionId: param.actionId,
                        values: selectedParam.valueIds,
                        valueIds: selectedParam.valueIds,
                        valuesConfigs: selectedParam?.valuesConfigs,
                        unitKey: param?.unitKey,
                        defaultUnit: param?.defaultUnit,
                        unitType: param?.unitType,
                        factor: param?.factor,
                        actionIndex,
                        parameterCode: param?.code,
                        isGeneralInfoInProductionFloor:
                          param?.isGeneralInfoInProductionFloor,
                      });
                    }
                  }
                );
              }
              // Recursively add related parameters for the newly added parameter
              addRelatedParametersWithDefaultValues(
                relatedParameter.id,
                sectionId,
                subSectionId,
                parameters,
                productTemplateCopy,
                actionIndex,
                subSectionType
              );
            }
          } else if (
            relatedParameter.materialPath &&
            relatedParameter.materialPath.length > 0
          ) {
            const parameterDefaultValue = relatedParameter.valuesConfigs?.find(
              (x) => x.isDefault
            );

            if (relatedParameter.materialPath.length == 1) {
              const materialData = allMaterials?.find((x) =>
                compareStrings(x.pathName, relatedParameter.materialPath[0])
              )?.data;
              if (!relatedParameter.valuesConfigs) {
                relatedParameter.valuesConfigs = [];
              }
              relatedParameter.valuesConfigs.forEach((val) => {
                if (val.materialValueIds && val.materialValueIds.length > 0) {
                  val.valueIds = [];
                  val.values = [];
                  val.materialValueIds.forEach((materialValue) => {
                    val.valueIds.push(materialValue.valueId);
                    val.values.push(materialValue.valueId);
                  });
                }
              });
              if (
                relatedParameter.code === "DieCut" ||
                relatedParameter.code === "DieKissCut"
              ) {
                if (relatedParameter.valuesConfigs.length === 0) {
                  relatedParameter.valuesConfigs = materialData?.map(
                    (data) => ({
                      id: data.valueId,
                      isHidden: false,
                      isDefault: false,
                      updateName: null,
                      activateAction: false,
                      isDeleted: false,
                      materialValueIds: null,
                      values: null,
                      selectedParameterValues: null,
                      code: null, // Add code if needed
                      additionalAttribute: data.additionalAttribute,
                      currency: data.currency,
                    })
                  );
                } else {
                  // If valueConfigs has objects, update it based on materialData
                  relatedParameter.valuesConfigs = materialData?.map((data) => {
                    const existingConfig = relatedParameter.valuesConfigs.find(
                      (config) => config.id === data.valueId
                    );
                    return existingConfig
                      ? {
                        ...existingConfig,
                        additionalAttribute: data.additionalAttribute,
                        currency: data.currency,
                      }
                      : {
                        id: data.valueId,
                        isHidden: false,
                        isDefault: false,
                        updateName: null,
                        activateAction: false,
                        isDeleted: false,
                        materialValueIds: null,
                        values: null,
                        selectedParameterValues: null,
                        code: null, // Add code if needed
                        additionalAttribute: data.additionalAttribute,
                        currency: data.currency,
                      };
                  });
                }
              } else {
                relatedParameter.valuesConfigs =
                  relatedParameter.valuesConfigs.filter(
                    (x) => x.valueIds && x.valueIds.length > 0
                  );
                if (materialData) {
                  materialData.forEach((val) => {
                    const existsValue = relatedParameter.valuesConfigs.find(
                      (x) =>
                        x.valueIds &&
                        x.valueIds.length > 0 &&
                        x.valueIds[0] === val.valueId
                    );
                    if (!existsValue) {
                      relatedParameter.valuesConfigs.push({
                        id: val.valueId,
                        activateAction: false,
                        isDefault: false,
                        isDeleted: false,
                        isHidden: false,
                        materialValueIds: null,
                        selectedParameterValues: null,
                        updateName: val.value,
                        values: [val.valueId],
                        additionalAttribute: val?.additionalAttribute,
                        currency: val?.currency,
                      });
                    } else {
                      existsValue.id = val.valueId;
                      existsValue.updateName = val.value;
                      (existsValue.additionalAttribute =
                        val?.additionalAttribute),
                        (existsValue.currency = val?.currency);
                    }
                  });
                }
              }
            }

            if (parameterDefaultValue) {
              const materialPath =
                relatedParameter.materialPath[
                relatedParameter.materialPath.length - 1
                ];
              const materialRelatedParameters = subSection.parameters.filter(
                (x) =>
                  x.id !== relatedParameter.id &&
                  x.actionIndex === relatedParameter.actionIndex &&
                  x.materialPath?.find((y) => compareStrings(y, materialPath))
              );
              if (
                materialRelatedParameters &&
                materialRelatedParameters.length > 0
              ) {
                let param = materialRelatedParameters[0];
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
                          x.actionIndex === relatedParameter.actionIndex
                      );
                      let prevPathParamDefaultValue =
                        prevPathParam.valuesConfigs.find((x) => x.isDefault);

                      if (
                        prevPathParamDefaultValue &&
                        prevPathParamDefaultValue?.values &&
                        prevPathParamDefaultValue?.values.length
                      ) {
                        allMaterialsCopy = allMaterialsCopy?.find(
                          (x) =>
                            x.valueId === prevPathParamDefaultValue?.values[0]
                        )?.data;
                      } else {
                        allMaterialsCopy = [];
                      }
                    }
                    paramMaterialValues = allMaterialsCopy;
                  } else if (index === 0) {
                    allMaterialsCopy = allMaterialsCopy.find((x) =>
                      compareStrings(x.pathName, materialPath)
                    )?.data;
                    paramMaterialValues = allMaterialsCopy?.find((x) =>
                      parameterDefaultValue?.values?.find(
                        (y) => y === x.valueId
                      )
                    )?.data;
                  }
                  if (index != -1 && index < param.materialPath.length - 1) {
                    param.valuesConfigs.forEach((val) => {
                      if (
                        val.materialValueIds &&
                        val.materialValueIds.length > 0
                      ) {
                        val.valueIds = [];
                        val.values = [];
                        val.materialValueIds.forEach((materialValue) => {
                          val.valueIds.push(materialValue.valueId);
                          val.values.push(materialValue.valueId);
                        });
                      }
                    });
                    param.valuesConfigs = param.valuesConfigs.filter(
                      (x) => x.values && x.values.length > 0
                    );
                    for (let i = 0; i < paramMaterialValues?.length; i++) {
                      let val = paramMaterialValues[i];
                      const existsValue = param.valuesConfigs?.find(
                        (x) =>
                          (x.valueIds &&
                            x.valueIds.length > 0 &&
                            x.valueIds[0] === val.valueId) ||
                          x.id === val.valueId
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
                          additionalAttribute: val?.additionalAttribute,
                          currency: val?.currency,
                        });
                      } else {
                        existsValue.id = val.valueId;
                        existsValue.updateName = val.value;
                        (existsValue.additionalAttribute =
                          val?.additionalAttribute),
                          (existsValue.currency = val?.currency);
                      }
                    }
                    if (
                      param?.valuesConfigs &&
                      param?.valuesConfigs?.length === 1 &&
                      param?.isRequired
                    ) {
                      param.valuesConfigs[0].isDefault = true;
                    }
                  }
                }
              }
            }
          }
        }
      });
    }
  };

  const hasDieCutOrDieKissCut = checkIfDieCutOrDieKissCutExists(
    subProducts,
    false
  );
  const user = useRecoilValue<any>(userState);
  const unitType = user?.printHouseProfile?.unitType || 0;
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
    actionIndex: number,
    parameterCode: string,
    dieCut: any
  ) => {
    let copySubProducts = cloneDeep(subProducts);
    const targetSubProduct = copySubProducts.find(
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
      const productTemplateCopy = cloneDeep(productTemplate);
      const section = productTemplateCopy.sections.find(
        (section) => section.id === sectionId
      );
      const subSection = section.subSections.find(
        (sub) => sub.id === subSectionId
      );
      const subSectionParameter = subSection.parameters.find(
        (param) => param.id === parameterId && param.actionIndex === actionIndex
      );

      var valueConfig = subSectionParameter?.valuesConfigs?.find(
        (x) => x.id === data.valueIds
      );
      if (
        valueConfig &&
        valueConfig.selectedParameterValues &&
        valueConfig.selectedParameterValues.length > 0 &&
        valueConfig.selectedParameterValues.some(
          (x) =>
            x.selectValuesCount > 0 &&
            (x.valueIds == null || x.valueIds.length == 0)
        )
      ) {
        onOpeneMultiParameterModal(
          subSectionParameter,
          subSection,
          section,
          subSection.parameters,
          subSection.parameters
        );
      }
      if (subSectionParameter) {
        subSectionParameter.isHidden = false;
      }
      if (
        subSectionParameter?.code === "BothsideSameprintcolor" &&
        data.values === "true"
      ) {
        const productTemplateCopy2 = cloneDeep(productTemplate);
        const section2 = productTemplateCopy2.sections.find(
          (section) => section.id === sectionId
        );
        const subSection2 = section2?.subSections.find(
          (sub) => sub.id === subSectionId
        );
        const paramDef = subSection2?.parameters.find(
          (param) => param.id === parameterId && param.actionIndex == actionIndex
        );

        if (paramDef && paramDef.relatedParameters) {
          paramDef.relatedParameters.forEach((relatedParam) => {
            removeRelatedParametersFromSubProducts(
              relatedParam.parameterId,
              sectionId,
              subSectionId,
              temp,
              relatedParam.actionIndex !== undefined
                ? relatedParam.actionIndex
                : actionIndex
            );
          });
        }
      }

      if (
        subSectionParameter?.code === "devicecategory" ||
        subSectionParameter?.code === "devicesize"
      ) {
        // Delete Width and Height parameters from temp
        if (data.values === null || data.valueIds === null) {
          temp = temp.filter(
            (item) =>
              item.parameterCode !== "Width" && item.parameterCode !== "Height"
          );
        }
      }
      if (findIndex !== -1) {
        const valuesArray = [data.values].filter(Boolean);
        temp[findIndex] = {
          ...temp[findIndex],
          values: [data.values],
          valueIds: [data.valueIds],
        };

        if (valuesArray.length > 0 && valuesArray[0] !== "false") {
          temp[findIndex] = {
            ...temp[findIndex],
            values: valuesArray,
            valueIds: [data.valueIds].filter(Boolean), // Remove null and undefined
          };
          addRelatedParametersWithDefaultValues(
            parameterId,
            sectionId,
            subSectionId,
            temp,
            productTemplateCopy,
            actionIndex,
            subSectionType
          );
        } else {
          if (subSectionParameter?.code !== "BothsideSameprintcolor") {
            removeRelatedParametersFromSubProducts(
              parameterId,
              sectionId,
              subSectionId,
              temp,
              subSectionParameter.actionIndex
            );
          }
        }
      } else {
        temp.push({
          parameterId: parameterId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          ParameterType: ParameterType,
          isQuantityParameter: subSectionParameter?.isQuantityParameter,
          parameterName: parameterName,
          actionId: actionId,
          values: [data.values],
          valueIds: [data.valueIds],
          actionIndex,
          parameterCode,
          valuesConfigs: subSectionParameter?.valuesConfigs,
          unitKey: subSectionParameter?.unitKey,
          defaultUnit: subSectionParameter?.defaultUnit,
          unitType: subSectionParameter?.unitType,
          factor: subSectionParameter?.factor,
          isGeneralInfoInProductionFloor:
            subSectionParameter?.isGeneralInfoInProductionFloor,
        });
        addRelatedParametersWithDefaultValues(
          parameterId,
          sectionId,
          subSectionId,
          temp,
          productTemplateCopy,
          actionIndex,
          subSectionType
        );
      }
      if (subSectionParameter && data?.values !== null && data?.valueIds !== null) {
        if (subSectionParameter?.childsParameters) {
          subSectionParameter?.childsParameters.forEach((myparameter) => {
            let values = myparameter?.valuesConfigs?.filter(
              (valueConfig) =>
                data?.value?.values &&
                Object.values(data.value.values).includes(valueConfig.id)
            );
            const parameterId = myparameter.id;
            const myindex = temp.findIndex((item) => {
              return (
                item?.parameterId === myparameter?.id &&
                item?.sectionId === section?.id &&
                item?.subSectionId === subSection?.id &&
                item?.actionIndex === myparameter?.actionIndex
              );
            });

            if (data?.value === null && data?.values === undefined) {
              subSectionParameter.childsParameters?.forEach((childParam) => {
                temp = temp.filter(
                  (item) => item.parameterId !== childParam.id
                );
              });
            }
            if (data?.value?.values) {
              if (myindex !== -1) {
                if (data?.value?.values[parameterId] !== undefined) {
                  if (myparameter?.parameterType == 0) {
                    temp[myindex] = {
                      ...temp[myindex],
                      parameterCode: myparameter?.code,
                      values: [values[0]?.updateName],
                      valueIds: [values[0]?.id],
                      isDisabled: hasValues(data?.value),
                      factor: myparameter?.factor,
                    };
                  } else {
                    temp[myindex] = {
                      ...temp[myindex],
                      parameterCode: myparameter?.code,
                      values:
                        unitType === UNIT_TYPE.IMPERIAL &&
                          myparameter?.code != "Width" &&
                          myparameter?.code != "Height"
                          ? [
                            (
                              data?.value?.values[parameterId] *
                              myparameter?.factor
                            ).toFixed(3),
                          ]
                          : [data?.value?.values[parameterId]],
                      isDisabled: hasValues(data?.value),
                      factor: myparameter?.factor,
                    };
                  }
                } else {
                  temp.splice(myindex, 1);
                }
              } else {
                if (myparameter?.parameterType == 0) {
                  temp.push({
                    parameterId: myparameter?.id,
                    sectionId: section?.id,
                    subSectionId: subSection?.id,
                    ParameterType: myparameter?.parameterType,
                    isQuantityParameter: myparameter?.isQuantityParameter,
                    values: [values[0]?.updateName],
                    valueIds: [values[0]?.id],
                    actionIndex: myparameter?.actionIndex,
                    parameterName: myparameter?.name,
                    parameterCode: myparameter?.code,
                    isDisabled: hasValues(data?.value),
                    factor: myparameter?.factor,
                    unitKey: myparameter?.unitKey,
                    defaultUnit: myparameter?.defaultUnit,
                    unitType: myparameter?.unitType,
                    actionId: myparameter?.actionId,
                    valuesConfigs: myparameter?.valuesConfigs,
                    isGeneralInfoInProductionFloor:
                      myparameter?.isGeneralInfoInProductionFloor,
                  });
                } else {
                  temp.push({
                    parameterId: myparameter?.id,
                    sectionId: section?.id,
                    subSectionId: subSection?.id,
                    ParameterType: myparameter?.parameterType,
                    isQuantityParameter: myparameter?.isQuantityParameter,
                    values:
                      unitType === UNIT_TYPE.IMPERIAL &&
                        myparameter?.code != "Width" &&
                        myparameter?.code != "Height"
                        ? [
                          (
                            data?.value?.values[parameterId] *
                            myparameter?.factor
                          ).toFixed(3),
                        ]
                        : [data?.value?.values[parameterId]],
                    actionIndex: myparameter?.actionIndex,
                    parameterName: myparameter?.name,
                    parameterCode: myparameter?.code,
                    isDisabled: hasValues(data?.value),
                    factor: myparameter?.factor,
                    unitKey: myparameter?.unitKey,
                    defaultUnit: myparameter?.defaultUnit,
                    unitType: myparameter?.unitType,
                    actionId: myparameter?.actionId,
                    valuesConfigs: myparameter?.valuesConfigs,
                    isGeneralInfoInProductionFloor:
                      myparameter?.isGeneralInfoInProductionFloor,
                  });
                }
              }
            }
            addRelatedParametersWithDefaultValues(
              parameterId,
              sectionId,
              subSectionId,
              temp,
              productTemplateCopy,
              actionIndex,
              subSectionType
            );
          });
        }
        if (subSectionParameter?.code === "Shape" && hasDieCutOrDieKissCut) {
          const parametersToRemove = [
            "Height",
            "Width",
            "size",
            "DieCut",
            "DieCutter",
            "DieKissCut",
            "DieStamp",
          ];

          temp = temp.filter(
            (param) => !parametersToRemove.includes(param.parameterCode)
          );
        }

        if (
          (subSectionParameter?.code === "DiecutType" ||
            subSectionParameter?.code === "DieCutter") &&
          hasDieCutOrDieKissCut
        ) {
          const parametersToRemove = [
            "Height",
            "Width",
            "DieUnitWidth",
            "DieUnitLength",
            "DieUnitHeight",
            // "DieCutter"
          ];

          temp = temp.filter(
            (param) => !parametersToRemove.includes(param.parameterCode)
          );
        }
        //types parameter
        if (subSectionParameter.id == "de2bb7d5-01b1-4b2b-b0fa-81cd0445841b") {
          const typesNum = Number(data.values);
          const quantityValue =
            quantity && quantity.values ? quantity?.values[0] : 0;
          const workName =
            jobNameParameter && jobNameParameter.values
              ? jobNameParameter.values[0]
              : "";
          if (Number(typesNum) === 0 || Number(typesNum) === 1) {
            setQuantityTypes([]);
          } else {
            if (quantityTypes.length === Number(typesNum)) {
              setValuesState(quantityTypes);
              setQuantityTypes(quantityTypes);
            } else if (quantityTypes.length < typesNum) {
              const array = [];
              for (let i = quantityTypes.length + 1; i <= typesNum; i++) {
                let quantity = 0;
                if (
                  valuesState &&
                  valuesState.length &&
                  valuesState[0]?.quantity
                ) {
                  quantity = valuesState[0]?.quantity;
                } else {
                  quantity = Number(quantityValue);
                }
                array.push({
                  name: workName + " " + i,
                  quantity: quantity,
                });

                setValuesState([...quantityTypes, ...array]);
                setQuantityTypes([...quantityTypes, ...array]);
              }
            } else if (quantityTypes.length > typesNum) {
              setValuesState(quantityTypes.slice(0, typesNum));
              setQuantityTypes(quantityTypes.slice(0, typesNum));
            }
          }
        }
        if (subSectionParameter?.code == "Sets") {
          const isHasQuantity = temp.find((x) => x.parameterCode == "quantity");
          if (!isHasQuantity) {
            temp.push({
              parameterId: "4991945c-5e07-4773-8f11-2e3483b70b53",
              sectionId: sectionId,
              subSectionId: subSectionId,
              ParameterType: 1,
              parameterName: "Quantity",
              actionId: null,
              values: ["1"],
              valueIds: [null],
              actionIndex: 0,
              parameterCode: "quantity",
              valuesConfigs: [],
              unitKey: null,
              defaultUnit: null,
              unitType: 0,
              factor: subSectionParameter?.factor,
            });
          }
        }
        if (subSectionParameter.id == "0fdbca1a-f250-447b-93e3-5b91909da59c") {
          if (!quantity) {
            temp.push({
              parameterId: "4991945c-5e07-4773-8f11-2e3483b70b53",
              sectionId: sectionId,
              subSectionId: subSectionId,
              ParameterType: 1,
              parameterName: "Quantity",
              actionId: null,
              values: ["0"],
              valueIds: [null],
              actionIndex: 0,
              parameterCode: "quantity",
              valuesConfigs: [],
              unitKey: null,
              defaultUnit: null,
              unitType: 0,
              factor: subSectionParameter?.factor,
            });
          }
          //setQuantity
          const setUnits = setUnitsParameter ? setUnitsParameter.values[0] : 0;
          temp = temp.map((x) =>
            x.parameterId === quantity?.parameterId
              ? { ...x, values: [(setUnits * data.values).toString()] }
              : x
          );
        }
        if (subSectionParameter.id == "91d3fe77-b852-4974-beb6-2da7d7616c78") {
          if (!quantity) {
            temp.push({
              parameterId: "4991945c-5e07-4773-8f11-2e3483b70b53",
              sectionId: sectionId,
              subSectionId: subSectionId,
              ParameterType: 1,
              parameterName: "Quantity",
              actionId: null,
              values: ["0"],
              valueIds: [null],
              actionIndex: 0,
              parameterCode: "quantity",
              valuesConfigs: [],
              unitKey: null,
              defaultUnit: null,
              unitType: 0,
              factor: subSectionParameter?.factor,
            });
          }
          // SetUnits
          const setQuantity = setQuantityParameter
            ? setQuantityParameter.values[0]
            : 0;
          temp = temp.map((x) =>
            x.parameterId === quantity?.parameterId
              ? { ...x, values: [(data.values * setQuantity).toString()] }
              : x
          );
        }
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
          if (materialRelatedParameters?.length > 0) {
            temp = temp.filter((subProduct) => {
              if (subProduct.actionIndex !== actionIndex) {
                return true;
              }
              return !materialRelatedParameters.some(
                (materialParameter) =>
                  materialParameter.id === subProduct.parameterId &&
                  subProduct.sectionId === sectionId &&
                  subProduct.subSectionId === subSectionId
              );
            });
          }

          materialRelatedParameters?.forEach((param) => {
            if (param.materialPath && param.materialPath.length > 0) {
              const materialPath =
                param.materialPath[param.materialPath.length - 1];
              const index = param.materialPath.findIndex((x) =>
                compareStrings(x, materialPath)
              );
              let allMaterialsCopy = cloneDeep(allMaterials);
              let paramMaterialValues: any = [];
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
                      x.actionIndex === actionIndex &&
                      (subSectionParameter?.code === "DiecutType"
                        ? x.id === subSectionParameter?.id
                        : true)
                  );

                  let prevPathParamDefaultValue = temp.find(
                    (x) =>
                      x.parameterId === prevPathParam?.id &&
                      x.actionIndex === actionIndex &&
                      x.sectionId === sectionId &&
                      x.subSectionId === subSectionId
                  );
                  if (
                    prevPathParamDefaultValue &&
                    prevPathParamDefaultValue?.valueIds &&
                    prevPathParamDefaultValue?.valueIds.length
                  ) {
                    allMaterialsCopy = allMaterialsCopy?.find(
                      (x) =>
                        x.valueId === prevPathParamDefaultValue?.valueIds[0]
                    )?.data;
                  } else {
                    // allMaterialsCopy = []
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
              param.valuesConfigs = [];
              const mergeAndFormatValuesConfigs = (
                valuesConfigs,
                additionalValuesConfigs,
                data
              ) => {
                const additionalConfig = additionalValuesConfigs.find(
                  (config) => config.key === data.valueIds
                );
                if (!additionalConfig) {
                  return valuesConfigs;
                }
                const additionalValues = additionalConfig.valuesConfigs;
                const updatedValuesConfigs = [];
                const transformedAdditionalValues = additionalValues.filter(
                  (additionalItem) => {
                    const matchedIndex = valuesConfigs.findIndex(
                      (valueConfig) =>
                        valueConfig.id ===
                        additionalItem.materialValueIds?.[0]?.valueId
                    );
                    if (matchedIndex !== -1) {
                      const transformedItem = {
                        id: additionalItem.materialValueIds[0].valueId,
                        activateAction: additionalItem.activateAction,
                        isDefault: additionalItem.isDefault,
                        isDeleted: additionalItem.isDeleted,
                        isHidden: additionalItem.isHidden,
                        materialValueIds: additionalItem.materialValueIds,
                        selectedParameterValues:
                          additionalItem.selectedParameterValues,
                        updateName: additionalItem.materialValueIds[0].valueId,
                        values: [additionalItem.materialValueIds[0].valueId],
                        additionalAttribute: [],
                        currency: "", // Add default or derived currency if needed
                      };

                      updatedValuesConfigs.push(transformedItem);
                      valuesConfigs.splice(matchedIndex, 1);
                    }

                    return false;
                  }
                );

                return [...valuesConfigs, ...updatedValuesConfigs];
              };
              paramMaterialValues?.forEach((val) => {
                let isHiddenValue = false;
                let isDefault = false;
                let isDeleted = false;

                if (param?.additionalValuesConfigs?.length > 0) {
                  param.additionalValuesConfigs.forEach((additionalConfig) => {
                    if (data?.valueIds === additionalConfig?.key) {
                      additionalConfig.valuesConfigs.forEach((config) => {
                        if (
                          config.materialValueIds[0]?.valueId === val.valueId &&
                          paramMaterialValues?.pathName === config?.path
                        ) {
                          isHiddenValue = config.isHidden; // Set isHidden from valuesConfigs
                          isDefault = config.isDefault;
                          isDeleted = config.isDeleted;
                        }
                      });
                    }
                  });
                }
                param.valuesConfigs.push({
                  id: val.valueId,
                  activateAction: false,
                  isDefault: isDefault,
                  isDeleted: isDeleted,
                  isHidden: isHiddenValue, // Use the determined isHidden value
                  materialValueIds: null,
                  selectedParameterValues: null,
                  updateName: val.value,
                  values: [val.valueId],
                  additionalAttribute: val?.additionalAttribute,
                  currency: val?.currency,
                });
              });
              param.valuesConfigs = param.valuesConfigs.filter(
                (x) => x.values && x.values.length > 0
              );
              param.valuesConfigs = mergeAndFormatValuesConfigs(
                param.valuesConfigs,
                param.additionalValuesConfigs,
                data
              );

              if (
                param?.valuesConfigs &&
                param?.valuesConfigs?.length === 1 &&
                param?.isRequired
              ) {
                param.valuesConfigs[0].isDefault = true;
                temp.push({
                  parameterId: param?.id,
                  parameterName: param?.name,
                  actionId: param?.actionId,
                  parameterType: param?.parameterType,
                  isQuantityParameter: param?.isQuantityParameter,
                  valueIds: param?.valuesConfigs[0]?.values,
                  values: [param?.valuesConfigs[0]?.updateName],
                  sectionId: section?.id,
                  subSectionId: subSection?.id,
                  actionIndex: param?.actionIndex,
                  parameterCode: param?.code,
                  valuesConfigs: param?.valuesConfigs,
                  unitKey: param?.unitKey,
                  defaultUnit: param?.defaultUnit,
                  unitType: param?.unitType,
                  factor: param?.factor,
                  isGeneralInfoInProductionFloor:
                    param?.isGeneralInfoInProductionFloor,
                });

                if (param?.code === "DieCutter") {
                  const getValue = (id) => {
                    const item = dieCut.additionalAttribute.find(
                      (attr) => attr.valueId === id
                    );
                    return item ? item.value + "" : "";
                  };
                  let dieUnitWidth = getValue("dieUnitWidth");
                  let dieUnitLength = getValue("dieUnitLength");
                  let finalUnitWidth = getValue("finalUnitWidth");
                  let finalUnitLength = getValue("finalUnitLength");
                  let finalUnitHeight = getValue("finalUnitHeight");
                  const dieCutSizesParametersArray = [];
                  // dieCutSizesParametersArray.push({
                  //   parameterCode: "Width",
                  //   value: dieUnitWidth,
                  // });
                  // dieCutSizesParametersArray.push({
                  //   parameterCode: "Height",
                  //   value: dieUnitLength,
                  // });
                  dieCutSizesParametersArray.push({
                    parameterCode: "DieUnitWidth",
                    value: finalUnitWidth,
                  });
                  dieCutSizesParametersArray.push({
                    parameterCode: "DieUnitLength",
                    value: finalUnitLength,
                  });
                  dieCutSizesParametersArray.push({
                    parameterCode: "DieUnitHeight",
                    value: finalUnitHeight,
                  });
                  dieCutSizesParametersArray.forEach((dieCutSizeParameter) => {
                    let dieCutSizeSubProductParameter = temp.find(
                      (x) =>
                        x.parameterCode == dieCutSizeParameter.parameterCode
                    );
                    if (dieCutSizeSubProductParameter) {
                      dieCutSizeSubProductParameter.values = [
                        dieCutSizeParameter.value,
                      ];
                      dieCutSizeSubProductParameter.isDisabled = true;
                    } else {
                      const subSectionParameter = subSection.parameters.find(
                        (param) =>
                          param.code === dieCutSizeParameter.parameterCode
                      );
                      if (subSectionParameter) {
                        temp.push({
                          parameterId: subSectionParameter.id,
                          sectionId: sectionId,
                          subSectionId: subSectionId,
                          ParameterType: ParameterType,
                          isQuantityParameter:
                            subSectionParameter?.isQuantityParameter,
                          parameterName: subSectionParameter?.name,
                          actionId: actionId,
                          values: [dieCutSizeParameter.value],
                          valueIds: [],
                          actionIndex: subSectionParameter.actionIndex,
                          parameterCode: subSectionParameter.code,
                          valuesConfigs: subSectionParameter?.valuesConfigs,
                          unitKey: subSectionParameter?.unitKey,
                          defaultUnit: subSectionParameter?.defaultUnit,
                          unitType: subSectionParameter?.unitType,
                          factor: subSectionParameter?.factor,
                          isDisabled: dieCutSizeParameter.value ? true : false,
                          isGeneralInfoInProductionFloor:
                            subSectionParameter?.isGeneralInfoInProductionFloor,
                        });
                      }
                    }
                  });
                }
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
                isQuantityParameter: param?.isQuantityParameter,
                parameterName: param.name,
                actionId: param.actionId,
                values: selectedParam.valueIds,
                valueIds: selectedParam.valueIds,
                valuesConfigs: selectedParam?.valuesConfigs,
                unitKey: param?.unitKey,
                defaultUnit: param?.defaultUnit,
                unitType: param?.unitType,
                factor: param?.factor,
                actionIndex,
                parameterCode: param?.code,
                isGeneralInfoInProductionFloor:
                  param?.isGeneralInfoInProductionFloor,
              });
            }
          });
        }
        if (dieCut) {
          if (
            (subSectionParameter.code === "DieCutter" ||
              subSectionParameter.code === "DieCut") &&
            dieCut?.additionalAttribute?.length > 0
          ) {
            const getValue = (id) => {
              const item = dieCut.additionalAttribute.find(
                (attr) => attr.valueId === id
              );
              return item ? item.value + "" : "";
            };
            let dieUnitWidth = getValue("dieUnitWidth");
            let dieUnitLength = getValue("dieUnitLength");
            let finalUnitWidth = getValue("finalUnitWidth");
            let finalUnitLength = getValue("finalUnitLength");
            let finalUnitHeight = getValue("finalUnitHeight");
            const dieCutSizesParametersArray = [];
            // dieCutSizesParametersArray.push({
            //   parameterCode: "Width",
            //   value: dieUnitWidth,
            // });
            // dieCutSizesParametersArray.push({
            //   parameterCode: "Height",
            //   value: dieUnitLength,
            // });
            dieCutSizesParametersArray.push({
              parameterCode: "DieUnitWidth",
              value: finalUnitWidth,
            });
            dieCutSizesParametersArray.push({
              parameterCode: "DieUnitLength",
              value: finalUnitLength,
            });
            dieCutSizesParametersArray.push({
              parameterCode: "DieUnitHeight",
              value: finalUnitHeight,
            });
            dieCutSizesParametersArray.forEach((dieCutSizeParameter) => {
              let dieCutSizeSubProductParameter = temp.find(
                (x) => x.parameterCode == dieCutSizeParameter.parameterCode
              );
              if (dieCutSizeSubProductParameter) {
                dieCutSizeSubProductParameter.values = [
                  dieCutSizeParameter.value,
                ];
                dieCutSizeSubProductParameter.isDisabled = true;
              } else {
                const subSectionParameter = subSection.parameters.find(
                  (param) => param.code === dieCutSizeParameter.parameterCode
                );
                if (subSectionParameter) {
                  temp.push({
                    parameterId: subSectionParameter.id,
                    sectionId: sectionId,
                    subSectionId: subSectionId,
                    ParameterType: ParameterType,
                    isQuantityParameter:
                      subSectionParameter?.isQuantityParameter,
                    parameterName: subSectionParameter?.name,
                    actionId: actionId,
                    values: [dieCutSizeParameter.value],
                    valueIds: [],
                    actionIndex: subSectionParameter.actionIndex,
                    parameterCode: subSectionParameter.code,
                    valuesConfigs: subSectionParameter?.valuesConfigs,
                    unitKey: subSectionParameter?.unitKey,
                    defaultUnit: subSectionParameter?.defaultUnit,
                    unitType: subSectionParameter?.unitType,
                    factor: subSectionParameter?.factor,
                    isDisabled: dieCutSizeParameter.value ? true : false,
                    isGeneralInfoInProductionFloor:
                      subSectionParameter?.isGeneralInfoInProductionFloor,
                  });
                }
              }
            });
          }
          if (
            (subSectionParameter.code === "DieCutter" ||
              subSectionParameter.code === "DieCut") &&
            dieCut?.rowData
          ) {
            let dieUnitWidth = dieCut.rowData.dieUnitWidth.value + "";
            let dieUnitLength = dieCut.rowData.dieUnitLength.value + "";
            let finalUnitWidth = dieCut.rowData.finalUnitWidth.value + "";
            let finalUnitLength = dieCut.rowData.finalUnitLength.value + "";
            let finalUnitHeight = dieCut.rowData.finalUnitHeight.value + "";
            const dieCutSizesParametersArray = [];
            // dieCutSizesParametersArray.push({
            //   parameterCode: "Width",
            //   value: dieUnitWidth,
            // });
            // dieCutSizesParametersArray.push({
            //   parameterCode: "Height",
            //   value: dieUnitLength,
            // });
            dieCutSizesParametersArray.push({
              parameterCode: "DieUnitWidth",
              value: finalUnitWidth,
            });
            dieCutSizesParametersArray.push({
              parameterCode: "DieUnitLength",
              value: finalUnitLength,
            });
            dieCutSizesParametersArray.push({
              parameterCode: "DieUnitHeight",
              value: finalUnitHeight,
            });
            dieCutSizesParametersArray.forEach((dieCutSizeParameter) => {
              let dieCutSizeSubProductParameter = temp.find(
                (x) => x.parameterCode == dieCutSizeParameter.parameterCode
              );
              if (dieCutSizeSubProductParameter) {
                dieCutSizeSubProductParameter.values = [
                  dieCutSizeParameter.value,
                ];
                dieCutSizeSubProductParameter.isDisabled = true;
              } else {
                const subSectionParameter = subSection.parameters.find(
                  (param) => param.code === dieCutSizeParameter.parameterCode
                );
                if (subSectionParameter) {
                  temp.push({
                    parameterId: subSectionParameter.id,
                    sectionId: sectionId,
                    subSectionId: subSectionId,
                    ParameterType: ParameterType,
                    isQuantityParameter:
                      subSectionParameter?.isQuantityParameter,
                    parameterName: subSectionParameter?.name,
                    actionId: actionId,
                    values: [dieCutSizeParameter.value],
                    valueIds: [],
                    actionIndex: subSectionParameter.actionIndex,
                    parameterCode: subSectionParameter.code,
                    valuesConfigs: subSectionParameter?.valuesConfigs,
                    unitKey: subSectionParameter?.unitKey,
                    defaultUnit: subSectionParameter?.defaultUnit,
                    unitType: subSectionParameter?.unitType,
                    factor: subSectionParameter?.factor,
                    isDisabled: true,
                    isGeneralInfoInProductionFloor:
                      subSectionParameter?.isGeneralInfoInProductionFloor,
                  });
                }
              }
            });
          } else if (subSectionParameter.code === "DieKissCut") {
            let unitWidth = dieCut?.rowData?.unitWidth?.value + "";
            let unitLength = dieCut?.rowData?.unitLength?.value + "";
            const dieCutSizesParametersArray = [];
            dieCutSizesParametersArray.push({
              parameterCode: "Width",
              value: unitWidth,
            });
            dieCutSizesParametersArray.push({
              parameterCode: "Height",
              value: unitLength,
            });
            dieCutSizesParametersArray.forEach((dieCutSizeParameter) => {
              let dieCutSizeSubProductParameter = temp.find(
                (x) => x.parameterCode == dieCutSizeParameter.parameterCode
              );
              if (dieCutSizeSubProductParameter) {
                dieCutSizeSubProductParameter.values = [
                  dieCutSizeParameter.value,
                ];
                dieCutSizeSubProductParameter.isDisabled = true;
              } else {
                const subSectionParameter = subSection.parameters.find(
                  (param) => param.code === dieCutSizeParameter.parameterCode
                );
                temp.push({
                  parameterId: subSectionParameter.id,
                  sectionId: sectionId,
                  subSectionId: subSectionId,
                  ParameterType: ParameterType,
                  isQuantityParameter: subSectionParameter?.isQuantityParameter,
                  parameterName: subSectionParameter?.name,
                  actionId: actionId,
                  values: [dieCutSizeParameter.value],
                  valueIds: [],
                  actionIndex: subSectionParameter.actionIndex,
                  parameterCode: subSectionParameter.code,
                  valuesConfigs: subSectionParameter?.valuesConfigs,
                  unitKey: subSectionParameter?.unitKey,
                  defaultUnit: subSectionParameter?.defaultUnit,
                  unitType: subSectionParameter?.unitType,
                  factor: subSectionParameter?.factor,
                  isDisabled: true,
                  isGeneralInfoInProductionFloor:
                    subSectionParameter?.isGeneralInfoInProductionFloor,
                });
              }
            });
          } else if (subSectionParameter.code === "DieStamp") {
            let unitWidth = dieCut?.rowData?.width?.value + "";
            let unitLength = dieCut?.rowData?.length?.value + "";
            const dieCutSizesParametersArray = [];
            dieCutSizesParametersArray.push({
              parameterCode: "EnhancementWidth",
              value: unitWidth,
              actionIndex: subSectionParameter?.actionIndex,
            });
            dieCutSizesParametersArray.push({
              parameterCode: "EnhancementLength",
              value: unitLength,
              actionIndex: subSectionParameter?.actionIndex,
            });
            dieCutSizesParametersArray.forEach((dieCutSizeParameter) => {
              let dieCutSizeSubProductParameter = temp.find(
                (x) =>
                  x.parameterCode == dieCutSizeParameter.parameterCode &&
                  x?.actionIndex === dieCutSizeParameter?.actionIndex
              );
              if (dieCutSizeSubProductParameter) {
                dieCutSizeSubProductParameter.values = [
                  dieCutSizeParameter.value,
                ];
                dieCutSizeSubProductParameter.isDisabled = true;
              } else {
                const subSectionParameter = subSection.parameters.find(
                  (param) =>
                    param.code === dieCutSizeParameter.parameterCode &&
                    param?.actionIndex === dieCutSizeParameter?.actionIndex
                );
                temp.push({
                  parameterId: subSectionParameter.id,
                  sectionId: sectionId,
                  subSectionId: subSectionId,
                  ParameterType: ParameterType,
                  isQuantityParameter: subSectionParameter?.isQuantityParameter,
                  parameterName: subSectionParameter?.name,
                  actionId: actionId,
                  values: [dieCutSizeParameter.value],
                  valueIds: [],
                  actionIndex: subSectionParameter.actionIndex,
                  parameterCode: subSectionParameter.code,
                  valuesConfigs: subSectionParameter?.valuesConfigs,
                  unitKey: subSectionParameter?.unitKey,
                  defaultUnit: subSectionParameter?.defaultUnit,
                  unitType: subSectionParameter?.unitType,
                  factor: subSectionParameter?.factor,
                  isDisabled: true,
                  isGeneralInfoInProductionFloor:
                    subSectionParameter?.isGeneralInfoInProductionFloor,
                });
              }
            });
          }

          let sizeParameter = subSection.parameters.find(
            (param) => param.code === "size"
          );
          if (sizeParameter) {
            let sizeSubProductParameter = temp.find(
              (x) => x.parameterCode == "size"
            );
            let customValue = sizeParameter.valuesConfigs.find(
              (x) => !x.values || Object.keys(x.values).length === 0
            );
            if (customValue) {
              if (sizeSubProductParameter) {
                sizeSubProductParameter.valueIds = [customValue.id];
                sizeSubProductParameter.values = [customValue.updateName];
                sizeSubProductParameter.isDisabled = true;
              } else {
                temp.push({
                  parameterId: sizeParameter.id,
                  sectionId: sectionId,
                  subSectionId: subSectionId,
                  ParameterType: sizeParameter.parameterType,
                  isQuantityParameter: sizeParameter?.isQuantityParameter,
                  parameterName: sizeParameter.name,
                  actionId: sizeParameter.actionId,
                  values: [customValue.updateName],
                  valueIds: [customValue.id],
                  actionIndex: sizeParameter.actionIndex,
                  parameterCode: sizeParameter.code,
                  valuesConfigs: sizeParameter?.valuesConfigs,
                  unitKey: sizeParameter?.unitKey,
                  defaultUnit: sizeParameter?.defaultUnit,
                  unitType: sizeParameter?.unitType,
                  factor: sizeParameter?.factor,
                  isDisabled: true,
                  isGeneralInfoInProductionFloor:
                    sizeParameter?.isGeneralInfoInProductionFloor,
                });
              }
            }
          }
        }
      }
      if (data?.values !== null && data?.valueIds !== null &&
        (widgetType === EWidgetProductType.EDIT || widgetType === EWidgetProductType.DUPLICATE)) {

        // Remove the current parameter from removedMaterialParameters
        const paramKey = `${parameterId}_${sectionId}_${subSectionId}_${actionIndex || 0}`;

        if (removedMaterialParameters[paramKey]) {
          setRemovedMaterialParameters(prev => {
            const newState = { ...prev };
            delete newState[paramKey];
            return newState;
          });
        }

        // Check and remove related parameters
        if (subSectionParameter?.relatedParameters && subSectionParameter.relatedParameters.length > 0) {
          const relatedParamKeysToRemove = [];

          subSectionParameter.relatedParameters.forEach((relatedParam) => {
            // Check if this related parameter exists in the updated temp array
            const relatedParamExists = temp.find(
              (param) =>
                param.parameterId === relatedParam.parameterId &&
                param.sectionId === sectionId &&
                param.subSectionId === subSectionId &&
                param.actionIndex === (relatedParam.actionIndex !== undefined ? relatedParam.actionIndex : actionIndex)
            );

            // If the related parameter exists and has values, remove it from removedMaterialParameters
            if (relatedParamExists && relatedParamExists.values && relatedParamExists.values.length > 0) {
              const relatedParamKey = `${relatedParam.parameterId}_${sectionId}_${subSectionId}_${relatedParam.actionIndex || actionIndex || 0}`;

              if (removedMaterialParameters[relatedParamKey]) {
                relatedParamKeysToRemove.push(relatedParamKey);
              }
            }
          });

          // Remove all related parameters from removedMaterialParameters
          if (relatedParamKeysToRemove.length > 0) {
            setRemovedMaterialParameters(prev => {
              const newState = { ...prev };
              relatedParamKeysToRemove.forEach(key => {
                delete newState[key];
              });
              return newState;
            });
          }
        }

        // Also check for material path related parameters (if it's a SELECT_MATERIALS type)
        if (subSectionParameter?.parameterType === EParameterTypes.SELECT_MATERIALS &&
          subSectionParameter?.materialPath &&
          subSectionParameter.materialPath.length > 0) {

          const materialPath = subSectionParameter.materialPath[subSectionParameter.materialPath.length - 1];
          const section = productTemplateCopy.sections.find(s => s.id === sectionId);
          const subSection = section?.subSections.find(ss => ss.id === subSectionId);

          if (subSection) {
            const materialRelatedParameters = subSection.parameters.filter(
              (x) =>
                x.id !== subSectionParameter.id &&
                x.actionIndex === actionIndex &&
                x.materialPath?.find((y) => compareStrings(y, materialPath))
            );

            const materialRelatedKeysToRemove = [];

            materialRelatedParameters.forEach((materialParam) => {
              // Check if this material-related parameter exists in temp
              const materialParamExists = temp.find(
                (param) =>
                  param.parameterId === materialParam.id &&
                  param.sectionId === sectionId &&
                  param.subSectionId === subSectionId &&
                  param.actionIndex === materialParam.actionIndex
              );

              if (materialParamExists && materialParamExists.values && materialParamExists.values.length > 0) {
                const materialParamKey = `${materialParam.id}_${sectionId}_${subSectionId}_${materialParam.actionIndex || 0}`;

                if (removedMaterialParameters[materialParamKey]) {
                  materialRelatedKeysToRemove.push(materialParamKey);
                }
              }
            });

            // Remove material-related parameters from removedMaterialParameters
            if (materialRelatedKeysToRemove.length > 0) {
              setRemovedMaterialParameters(prev => {
                const newState = { ...prev };
                materialRelatedKeysToRemove.forEach(key => {
                  delete newState[key];
                });
                return newState;
              });
            }
          }
        }
      }

      let temp2 = [...subProducts];
      const index2 = temp2.findIndex((item) => item.type === subSectionType);
      temp2[index2] = {
        type: subSectionType,
        sectionId: sectionId,
        sectionName: section.name,
        parameters: temp,
      };
      setSubProducts(temp2);
      setSubProductsColorsModal(temp2);
      processRelatedParameters2(
        subSectionParameter,
        subSection,
        section,
        productTemplateCopy,
        temp2
      );
      setProductTemplate(productTemplateCopy);
      const updatedProductTemplate = updateIsHidden(productTemplateCopy, temp2);
      removeHiddenParameters(temp2, productTemplateCopy);
      setupdatedProductTemplate(updatedProductTemplate);
      setCanCalculation(true);
      setIsFirstTimeEnterPageWhenEdit(false);
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
  const [errorText, setErrorText] = useState(false);
  const handleTabClick = (index: number) => {
    if (!firstEnter) {
      setActiveIndex(index);
    }
    // Allow moving to any previous tab regardless of checkParameter
    if (index < activeIndex) {
      setActiveIndex(index);
      setCanCalculation(false);
    } else if (index > activeIndex) {
      let filteredproductTemplate = productTemplate.sections.filter(
        (x) => !x.isHidden
      );
      let currentSection = filteredproductTemplate[activeIndex].id;
      let checkParameter = validateParameters(subProducts, currentSection);
      if (checkParameter) {
        setErrorText(false);
        setCanCalculation(false);
        setActiveIndex(index);
        setCanCalculation(false);
      } else {
        // Show error if trying to move to the next tab but checkParameter is false
        alertFault("products.offsetPrice.admin.errorReq");
        setErrorText(true);
      }
    }
    // No action needed if clicking on the current tab
  };
  const handleNextClick = () => {
    setErrorText(false);
    let filteredproductTemplate = productTemplate.sections.filter(
      (x) => !x.isHidden
    );
    let currentSection = filteredproductTemplate[activeIndex].id;
    let checkParameter = validateParameters(subProducts, currentSection);
    if (checkParameter) {
      if (activeIndex < productTemplate.sections.length) {
        setActiveIndex(activeIndex + 1);
        setCanCalculation(false);
      }
    } else {
      setErrorText(true);
      alertFault("products.offsetPrice.admin.errorReq");
    }
  };
  const handlePreviousClick = () => {
    if (activeIndex != 0) {
      setActiveIndex(activeIndex - 1);
      setCanCalculation(false);
    }
  };

  const onClickProductionTab = () => {
    setActiveTab(t("quality.production"));
    setBillingMethod(null);
    setGraphicDesigner(null);
  };
  const onClickDetailsTab = () => {
    setActiveTab(t("reports.details"));
  };

  const onClickLogsTab = () => {
    setActiveTab(t("products.offsetPrice.admin.logs"));
    setBillingMethod(null);
    setGraphicDesigner(null);
  };

  const isShowDetailsTab = productTemplate?.isShowDetailsTab;
  const tabs = [
    {
      name: t("products.offsetPrice.admin.logs"),
      onclick: () => onClickLogsTab,
    },
    ...(isShowDetailsTab
      ? [
        {
          name: t("reports.details"),
          onclick: () => onClickDetailsTab,
        },
      ]
      : []),
    {
      name: t("quality.production"),
      onclick: () => onClickProductionTab,
      showIndicator: printingNotes !== "" || sampleType,
    },
  ];

  const getProductById = async (materials) => {
    setIsMigratedFromOldSystem(false);
    if (router?.query?.isFromChatbot) {
      await getAndSetChatBotProductId(
        callApi,
        (res) => {
          const updatedTemplate = updateIsHidden(res, subProducts);
          setDefaultProductTemplate(updatedTemplate);
          initQuoteItemProduct(updatedTemplate, materials);
          setdocumentItemByEdit(res?.docmentItem);
          setCalculationResult({ ...calculationResult, tabs: res?.tabs });
          setProductItemValueByEdit(res?.productItemValue);
          setValuesState(res?.productItemValue?.workTypes);
          setWorkTypes(res?.productItemValue?.workTypes);
          setMissionsListForEdit(res?.missions);
          setCalculatedPriceProductItemValue(res?.calculatedPrice);
          const itemParameters =
            res?.data?.productItemValue?.itemParmetersValues || [];
          if (itemParameters && itemParameters?.length > 0) {
            const allEmpty = itemParameters.every(
              (item) => !item.subProductType || item.subProductType === ""
            );

            if (allEmpty) {
              setSubProductsCopy([
                {
                  parameters: itemParameters,
                  type: null,
                },
              ]);
            } else {
              // Group by subProductType
              const groupedByType = itemParameters.reduce((acc, item) => {
                const type = item.subProductType || "";
                if (!acc[type]) {
                  acc[type] = [];
                }
                acc[type].push(item);
                return acc;
              }, {});

              // Convert to array format
              const formattedGroups = Object.entries(groupedByType).map(
                ([type, parameters]) => ({
                  type: type || null,
                  parameters,
                })
              );

              setSubProductsCopy(formattedGroups);
            }
          }
        },
        {
          Id: router?.query?.productId,
        }
      );
    }
    if (router?.query?.profitsProfileRowId) {
      await getAndSetProfitProfileReviewProductId(
        callApi,
        (data) => {
          const updatedTemplate = updateIsHidden(data, subProducts);
          setDefaultProductTemplate(updatedTemplate);
          initProduct(updatedTemplate, materials);
          let checkParameter = validateParameters(subProducts);
          if (checkParameter) {
            setCanCalculation(true);
          } else {
            setCanCalculation(false);
          }
        },
        {
          profitsProfileRowId: router?.query?.profitsProfileRowId,
          quantity: router?.query?.quantity,
        }
      );
    } else {
      await getAndSetProductById(
        callApi,
        (data) => {
          const updatedTemplate = updateIsHidden(data, subProducts);
          setDefaultProductTemplate(updatedTemplate);
          initProduct(updatedTemplate, materials);
          let checkParameter = validateParameters(subProducts);
          if (checkParameter) {
            setCanCalculation(true);
          } else {
            setCanCalculation(false);
          }
        },
        {
          Id: router?.query?.productId,
          sourceView: ESourceView.ProductCalculationView,
        }
      );
    }
  };

  const getProductQuoteItemById = async (materials, productId?) => {
    if (connectionId) {
      const conn = generateConnectionId(connectionId);
      setCurrentSignalRConnectionId(conn);
      setIsMigratedFromOldSystem(false);
      const callBack = (res) => {
        if (res?.success) {
          const updatedTemplate = updateIsHidden(res?.data, subProducts);
          setDefaultProductTemplate(updatedTemplate);
          initQuoteItemProduct(updatedTemplate, materials);
          setdocumentItemByEdit(res?.data.docmentItem);
          setCalculationResult({ ...calculationResult, tabs: res?.data?.tabs });
          setProductItemValueByEdit(res?.data.productItemValue);
          setValuesState(res?.data?.productItemValue?.workTypes);
          setWorkTypes(res?.data?.productItemValue?.workTypes);
          setMissionsListForEdit(res?.data?.missions);
          setCalculatedPriceProductItemValue(res?.data?.calculatedPrice);
          setIsMigratedFromOldSystem(res?.data?.isMigratedFromOldSystem);
          const itemParameters =
            res?.data?.productItemValue?.itemParmetersValues || [];
          if (itemParameters && itemParameters?.length > 0) {
            const allEmpty = itemParameters.every(
              (item) => !item.subProductType || item.subProductType === ""
            );

            if (allEmpty) {
              setSubProductsCopy([
                {
                  parameters: itemParameters,
                  type: null,
                },
              ]);
            } else {
              // Group by subProductType
              const groupedByType = itemParameters.reduce((acc, item) => {
                const type = item.subProductType || "";
                if (!acc[type]) {
                  acc[type] = [];
                }
                acc[type].push(item);
                return acc;
              }, {});

              // Convert to array format
              const formattedGroups = Object.entries(groupedByType).map(
                ([type, parameters]) => ({
                  type: type || null,
                  parameters,
                })
              );

              setSubProductsCopy(formattedGroups);
            }
          }
          // setSubProductsCopy([
          //   {
          //     parameters: res?.data?.productItemValue?.itemParmetersValues,
          //     type: null,
          //   },
          // ]);
          getSelectedWorkFlow(conn, false, res?.data?.productItemValue?.id);
        } else {
          alertFaultUpdate();
        }
      };
      await getProductByItemIdApi(callApi, callBack, {
        documentItemId: router?.query?.documentItemId,
        signalRConnectionId: conn,
        documentType: router?.query?.documentType,
        productId: productId,
      });
    }
  };

  const initQuoteItemProduct = (quoteItemProduct, materials) => {
    if (
      quoteItemProduct &&
      quoteItemProduct.productItemValue &&
      quoteItemProduct.productItemValue.itemParmetersValues
    ) {
      const quoteItemSubProducts = [];
      setCurrentProductItemValueTotalPrice(
        quoteItemProduct.docmentItem?.finalPrice
      );
      setSliderCurrentProductItemValueTotalPrice(
        quoteItemProduct.docmentItem?.finalPrice
      );
      setLastProductItemValueTotalPrice(
        quoteItemProduct.docmentItem?.finalPrice
      );
      setCurrentProductItemValue(quoteItemProduct.productItemValue);
      setCurrentProductItemValueDraftId(
        quoteItemProduct.productItemValueDraftId
      );
      setUrgentOrder(quoteItemProduct.docmentItem?.isUrgentWork);
      setCurrentCalculationSessionId(quoteItemProduct.productItemValueDraftId);
      setWorkFlows(quoteItemProduct.productItemValue.workFlows);
      setJobActions(quoteItemProduct.productItemValue.actions);
      setCalculationProgress({
        totalWorkFlowsCount: 0,
        currentWorkFlowsCount: 0,
      });
    }
    initProduct(quoteItemProduct, materials);
  };

  const validateParameters = (currentSubProducts, sectionId?: string) => {
    let isValid = true;
    const allParameters = currentSubProducts.flatMap((item) => item.parameters);
    if (sectionId) {
      let section = productTemplate.sections.find((x) => x.id === sectionId);
      for (const subSection of section.subSections) {
        for (const parameter of subSection.parameters) {
          if (!parameter.isHidden && parameter.isRequired) {
            const index = allParameters.findIndex(
              (par) =>
                par.parameterId === parameter.id &&
                par?.sectionId === section?.id &&
                par?.subSectionId === subSection?.id &&
                ((par?.values && par?.values[0]?.length) ||
                  (par?.valueIds && par?.valueIds[0]?.length))
            );
            if (index == -1) {
              isValid = false;
              break;
            }
          }
        }
      }
    } else {
      if (!productTemplate?.sections) {
        return true;
      }
      let sections = productTemplate?.sections.filter((x) => !x.isHidden);
      for (const section of sections) {
        for (const subSection of section.subSections) {
          for (const parameter of subSection.parameters) {
            if (!parameter.isHidden && parameter.isRequired) {
              const index = allParameters.findIndex(
                (par) =>
                  par.parameterId === parameter.id &&
                  par?.sectionId === section?.id &&
                  par?.subSectionId === subSection?.id &&
                  ((par?.values && par?.values[0]?.length) ||
                    (par?.valueIds && par?.valueIds[0]?.length))
              );
              if (index == -1) {
                isValid = false;
                break;
              }
            }
          }
        }
      }
    }
    return isValid;
  };
  //const [checkParameter, setCheckParameter] = useRecoilState<boolean>(checkParameterState)
  /*useEffect(() => {
    let checkParameter = validateParameters(activeSectionRequiredParameters, subProducts);
    setCheckParameter(checkParameter)
  }, [isRequiredParameters])*/
  const getItemParameterValues = () => {
    const updatedSubProducts = removeHiddenParametersFromSubProducts(
      subProducts,
      productTemplate
    );

    const result = [];
    updatedSubProducts.forEach((subProduct) => {
      subProduct?.parameters?.forEach((param) => {
        const paramCopy = cloneDeep(param);
        paramCopy.subProductType = subProduct.type;
        result.push(paramCopy);
      });
    });

    // Filter non-empty parameter values or valueIds
    const filteredArray = result.filter(
      (obj) =>
        (obj.values && obj.values.length && obj.values[0] !== "false") ||
        (obj.valueIds && obj.valueIds.length)
    );

    // Use a Map to remove duplicates based on actionIndex, parameterCode, parameterId, sectionId, subSectionId
    const uniqueParamsMap = new Map();

    const uniqueFilteredArray = filteredArray.filter((param) => {
      const key = `${param.actionIndex}_${param.parameterCode}_${param.parameterId}_${param.sectionId}_${param.subSectionId}`;

      if (!uniqueParamsMap.has(key)) {
        uniqueParamsMap.set(key, true);
        return true; // Keep the first occurrence
      }

      return false; // Discard duplicates
    });

    return uniqueFilteredArray;
  };
  const convertSubProductsValuesToImperial = (subProducts) => {
    return subProducts.map((subProduct) => {
      return {
        ...subProduct,
        parameters: convertValuesToImperial(subProduct.parameters),
      };
    });
  };
  const convertValuesToImperial = (parameters) => {
    return parameters.map((param) => {
      if (unitType === UNIT_TYPE.IMPERIAL && param.factor) {
        return {
          ...param,
          values:
            param?.ParameterType === 5
              ? [param?.valueIds[0]]
              : param.values.map((value) =>
                (parseFloat(value) / param.factor).toFixed(3)
              ),
        };
      }
      return param;
    });
  };

  const calculationProduct = useDebouncedCallback(
    async (currentSubProducts) => {
      if (requestAbortController) {
        requestAbortController.abort();
      }
      setWorkFlows([]);
      setCurrentProductItemValueTotalPrice(null);
      setSliderCurrentProductItemValueTotalPrice(null);
      setLocalStateValue(null);
      setCurrentCalculatedTotalPrice(null);
      setJobActions([]);
      setIsCalculationFinished(false);
      setCalculationProgress({
        totalWorkFlowsCount: 0,
        currentWorkFlowsCount: 0,
      });

      setCalculationExceptionsLogs([]);
      setAdditionalProductItems([]);
      setcalculationServerErrorState(false);
      setShowCalculationInCompletedAlert(false);
      setShowCalculationInCompletedModal(false);
      let checkParameter = validateParameters(currentSubProducts);
      if (!!checkParameter) {
        const newRequestAbortController = new AbortController();
        setRequestAbortController(newRequestAbortController);
        let subProductsCopy = cloneDeep(currentSubProducts);

        let generalParameters = subProductsCopy.find(
          (x) => !x.type
        )?.parameters;

        let calculationSubProducts = subProductsCopy.filter((x) => x.type);

        generalParameters?.forEach((x) => (x.valuesConfigs = null));
        calculationSubProducts.forEach((x) =>
          x.parameters.forEach((y) => (y.valuesConfigs = null))
        );

        if (productTypesNumber === 1) {
          setWorkTypes([]);
        } else if (
          quantityTypes &&
          quantityTypes.length > 0 &&
          quantityTypes[0].quantity > 0
        ) {
          setWorkTypes(quantityTypes);
        }
        if (generalParameters && generalParameters?.length > 0) {
          if (!connectionId) {
            setcalculationServerErrorState(true);
            return;
          }
          setLoading(true);
          setErrorMsg("");
          const newCalculationSessionId = uuidv4();
          setCurrentCalculationSessionId(newCalculationSessionId);
          const itemParmetersValues = getItemParameterValues();
          const updatedGeneralParameters =
            removeHiddenParametersFromSubProductsParameters(
              generalParameters,
              productTemplate
            );
          const convertedItemParameters =
            convertValuesToImperial(itemParmetersValues);
          const convertedGeneralParameters = convertValuesToImperial(
            updatedGeneralParameters
          );
          if (calculationSubProducts && calculationSubProducts.length > 0) {
            calculationSubProducts = convertSubProductsValuesToImperial(
              calculationSubProducts
            );
          }
          if (calculationSubProducts && calculationSubProducts.length > 0) {
            calculationSubProducts.forEach((subProduct) => {
              subProduct.parameters =
                removeHiddenParametersFromSubProductsParameters(
                  subProduct.parameters,
                  productTemplate
                );
            });
          }
          const docType = +(router?.query?.documentType || 0);
          const documentItemId = router?.query?.documentItemId;
          const conn = generateConnectionId(connectionId);
          setCurrentSignalRConnectionId(conn);
          const res: any = await callApi(
            "POST",
            productTemplate?.isHaveFixedAction
              ? "/v1/erp-service/product-item-value/create-default-work-flow"
              : `/v1/calculation-service/calculations/calculate-productV2`,
            {
              calculationSessionId: newCalculationSessionId,
              signalRConnectionId: conn,
              clientId: router?.query?.customerId,
              clientTypeId: router?.query?.clientTypeId,
              productId: router?.query?.productId,
              generalParameters:
                unitType === UNIT_TYPE.IMPERIAL
                  ? convertedGeneralParameters
                  : updatedGeneralParameters,
              subProducts: calculationSubProducts,
              itemParmetersValues:
                unitType === UNIT_TYPE.IMPERIAL
                  ? convertedItemParameters
                  : itemParmetersValues,
              workTypes: workTypes,
              isChargeForNewDie: isChargeForNewDie,
              productType: productTemplate?.productType,
              templateId: productTemplate?.templateId,
              documentType: docType,
              documentItemId: documentItemId,
              //priceRecovery: priceRecovery,
            },
            false,
            newRequestAbortController
          );
          if (res?.status === 500) {
            setCalculationProgress({
              totalWorkFlowsCount: 0,
              currentWorkFlowsCount: 0,
            });
            setcalculationServerErrorState(true);
            getSelectedWorkFlow(conn, true).then();
          } else if (!res.success) {
            setCalculationProgress({
              totalWorkFlowsCount: 0,
              currentWorkFlowsCount: 0,
            });
            if (res.status) {
              setLoading(false);
              setcalculationServerErrorState(true);
            }
          } else {
            if (productTemplate?.isHaveFixedAction) {
              _setDataFromSelectedWorkFlow(res, currentCalculationSessionId);
              setIsCanGetSelected(true);
              setLoading(false);
            } else {
              const id = res?.data?.data?.data;
              if (!id) {
                setcalculationServerErrorState(true);
                setLoading(false);
                setCurrentCalculationSessionId(null);
              }
              if (id === "00000000-0000-0000-0000-000000000000") {
                getSelectedWorkFlow(conn, true, newCalculationSessionId).then();
              }
              if (id !== currentCalculationSessionId) {
                return;
              }

              setCurrentCalculationSessionId(id);
              setCalculationProgress({
                totalWorkFlowsCount: 0,
                currentWorkFlowsCount: 0,
              });
              setLoading(true);
            }
          }
        }
      } else {
        setLoading(false);
        setCurrentCalculationSessionId(null);
      }
    },
    700
  );
  const createDefaultWorkFlowApi = async () => {
    let subProductsCopy = cloneDeep(subProducts);

    let generalParameters = subProductsCopy.find((x) => !x.type)?.parameters;

    let calculationSubProducts = subProductsCopy.filter((x) => x.type);

    generalParameters?.forEach((x) => (x.valuesConfigs = null));
    calculationSubProducts.forEach((x) =>
      x.parameters.forEach((y) => (y.valuesConfigs = null))
    );
    const newCalculationSessionId = uuidv4();
    setCurrentCalculationSessionId(newCalculationSessionId);
    const itemParmetersValues = getItemParameterValues();
    const updatedGeneralParameters =
      removeHiddenParametersFromSubProductsParameters(
        generalParameters,
        productTemplate
      );

    const res: any = await callApi(
      "POST",
      "/v1/erp-service/product-item-value/create-default-work-flow",
      {
        calculationSessionId: newCalculationSessionId,
        signalRConnectionId: currentSignalRConnectionId,
        clientId: router?.query?.customerId,
        clientTypeId: router?.query?.clientTypeId,
        productId: router?.query?.productId,
        generalParameters: updatedGeneralParameters,
        subProducts: calculationSubProducts,
        itemParmetersValues: itemParmetersValues,
        workTypes: workTypes,
        isChargeForNewDie: isChargeForNewDie,
        productType: productTemplate?.productType,
        templateId: productTemplate?.templateId,
        totalPrice: sliderCurrentProductItemValueTotalPrice || 0,
        isAddOrEdit: true,
      },
      false
    );
    if (res?.success) {
      _setDataFromSelectedWorkFlow(res, currentCalculationSessionId);
      setIsCanGetSelected(true);
      setLoading(false);
    }
  };

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
    const itemParmetersValues = getItemParameterValues();
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
  }, [router, pricingDefaultValue, selectedWorkFlow]);
  const quantity = useMemo(() => {
    if (subProducts) {
      const generalParameters = subProducts.find((x) => !x.type)?.parameters;
      let quantityParam = generalParameters?.find(
        (item) => item?.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
      );
      if (quantityParam == null) {
        quantityParam = {
          values: ["0"],
        };
      }
      if (
        quantityParam &&
        (quantityParam.values == null || quantityParam.values.length == 0)
      ) {
        quantityParam.values = ["0"];
      }
      return quantityParam;
    }
  }, [subProducts]);
  const setQuantityParameter = useMemo(() => {
    if (subProducts) {
      const generalParameters = subProducts.find((x) => !x.type)?.parameters;
      return generalParameters?.find(
        (item) => item?.parameterId === "0fdbca1a-f250-447b-93e3-5b91909da59c"
      );
    }
  }, [subProducts]);
  const setUnitsParameter = useMemo(() => {
    if (subProducts) {
      const generalParameters = subProducts.find((x) => !x.type)?.parameters;
      return generalParameters?.find(
        (item) => item?.parameterId === "91d3fe77-b852-4974-beb6-2da7d7616c78"
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

  const widthParam = getParameterByParameterCode(subProducts, "Width");
  const heightParam = getParameterByParameterCode(subProducts, "Height");
  const jobNameParameter = getParameterByParameterCode(subProducts, "JobName");
  const isSetsParameter = getParameterByParameterCode(subProducts, "Sets");

  const addItemForQuotes = async () => {
    setLoadingWithLockScreen(true);
    const docType = router?.query?.documentType ?? "0";
    const duplicateType = router?.query?.duplicateType;
    const callBack = (res) => {
      if (res?.success) {
        docType === "0" || duplicateType === "1" || duplicateType === "2"
          ? navigate("/quote")
          : navigate(`/order?Id=${router?.query?.documentId}`);
        setLoadingWithLockScreen(false);
      } else {
        alertFaultAdded();
        setLoadingWithLockScreen(false);
      }
    };
    await addItemApi(callApi, callBack, {
      item: currentProductItemValue,
      documentType: docType,
    });
  };

  const updateQuoteItem = async (isSaveCurrentStation?) => {
    setLoadingWithLockScreen(true);

    // First, validate the workflows
    const workflowValidation = validateWorkflows(workFlows[0]);

    if (workflowValidation.isValid) {
      // If workflows are valid, proceed with the update
      const callBack = (res) => {
        if (res?.success) {
          const isCreation = res?.data;
          Number(router.query.documentType) == DOCUMENT_TYPE.quote
            ? isCreation
              ? navigate("/quote")
              : navigate("/home")
            : navigate(`/order?Id=${router?.query?.documentId}`);
          setWorkFlows([]);
          setJobActions([]);
          setLoadingWithLockScreen(false);
        } else {
          alertFaultUpdate();
          setLoadingWithLockScreen(false);
        }
      };
      await updateDocumentItemApi(callApi, callBack, {
        Item: {
          signalRConnectionId: currentSignalRConnectionId,
          productItemValueId: productItemValueDraftId,
          itemId: router?.query?.documentItemId,
          productId: router?.query?.productId,
          supplierId: "",
          customerID: router?.query?.customerId,
          unitPrice:
            +sliderCurrentProductItemValueTotalPrice /
            (quantity &&
              quantity.values &&
              quantity.values.length > 0 &&
              quantity?.values[0]
              ? +quantity?.values[0]
              : 1),
          finalPrice: (widgetType == EWidgetProductType.EDIT ||
            widgetType == EWidgetProductType.DUPLICATE) && localStateValue && localStateValue != null ?
            +localStateValue :
            +sliderCurrentProductItemValueTotalPrice,
          amount:
            quantity &&
              quantity.values &&
              quantity.values.length &&
              quantity?.values[0]
              ? quantity?.values[0]
              : 0,
          isNeedGraphics: false,
          isUrgentWork: urgentOrder,
          printingNotes,
          graphicNotes,
          exampleType: sampleType && getSampleTypeValue(sampleType),
          isNeedExample: false,
          isDuplicatedWithAnotherQuantity: false,
          saveCurrentStation: isFlowChanged ? isSaveCurrentStation : true,
        },
        DocumentType: router?.query?.documentType,
      });
    } else {
      // If workflows are not valid, set error message and stop the process
      setLoadingWithLockScreen(false);
      // You can combine all error messages into a single string if needed
      setErrorMsg(workflowValidation.errors.join(", "));
      isOpenErrorsModal.open()
    }
  };
  const straightKnife = findParameterByCode(productTemplate, "IsStraightKnife");

  const isOpenErrorsModal = useModal()


  const navigateForRouter = () => {
    if (!productItemValueDraftId) {
      onClickOpenCreateDefaultWorkFlow();
      createDefaultWorkFlowApi();
    } else {
      const workflowValidation = validateWorkflows(workFlows[0]);
      if (workflowValidation.isValid) {
        // If workflows are valid, proceed to validate parameters
        let checkParameter = validateParameters(subProducts);

        if (checkParameter) {
          setErrorMsg("");
          if (router?.query?.actionId) {
            createProfitTestCase();
          } else {
            if (showCalculationInCompletedAlert) {
              setShowCalculationInCompletedModal(true);
            } else {
              addItemForQuotes();
            }
          }
        } else {
          setErrorMsg(t("products.offsetPrice.admin.errorReq"));
        }
      } else {
        isOpenErrorsModal.open()
        setErrorMsg(workflowValidation.errors.join(", "));
      }
    }
    // First, validate the workflows
  };

  useEffect(() => {
    setPricingDefaultValue({
      actions: jobActions,
      workFlows,
      jobDetails,
    });
  }, [workFlows, jobActions, jobDetails]);
  const setCurrenciesSymbols = useSetRecoilState(currenciesSymbols);
  const getCurrenciesApi = async () => {
    const callBack = (res) => {
      if (res.success) {
        setCurrenciesSymbols(
          res.data.map(({ value, text }) => ({ label: text, value }))
        );
      }
    };
    await getCurrenciesSymbols(callApi, callBack);
  };
  useEffect(() => {
    getCurrenciesApi();
  }, []);
  useEffect(() => {
    const updatedProductTemplate = updateIsHidden(productTemplate, subProducts);
    setProductTemplate(updatedProductTemplate);
  }, [subProducts]);

  const updateIsHidden = (productTemplate, subProducts) => {
    if (
      !productTemplate ||
      !productTemplate.sections ||
      !Array.isArray(productTemplate.sections)
    ) {
      return productTemplate;
    }
    const allParameters = subProducts.flatMap((product) => product.parameters);
    const updatedTemplate = { ...productTemplate };
    updatedTemplate.sections.forEach((section) => {
      if (
        section.relatedToParameters &&
        section.relatedToParameters.length === 0
      ) {
        section.isHidden = false;
      } else if (section.relatedToParameters) {
        // let isHidden = true;
        section.relatedToParameters.forEach((parameter) => {
          if (
            parameter.actionIndex === undefined ||
            parameter.actionIndex === null
          ) {
            parameter.actionIndex = 0;
          }
          // Check if any parameter in allParameters matches the condition
          const matchingParameter = allParameters.find(
            (p) =>
              p.parameterId === parameter.parameterId &&
              p.sectionId === parameter.sectionId &&
              p.subSectionId === parameter.subSectionId &&
              p.actionIndex === parameter.actionIndex
          );
          if (matchingParameter) {
            if (parameter.activateByAllValues) {
              section.isHidden = false;
            } else {
              section.isHidden = !parameter.selectedValueIds.includes(
                matchingParameter?.valueIds[0]
              );
            }
          } else {
            section.isHidden = true;
          }
        });
      }
    });
    return updatedTemplate;
  };

  function removeHiddenParameters(subProducts, updatedProductTemplate) {
    const temp = cloneDeep(updatedProductTemplate);
    if (!temp || !temp.sections || !Array.isArray(temp.sections)) {
      return subProducts;
    }
    const hiddenSectionIds = temp.sections
      .filter((section) => section.isHidden)
      .map((section) => section.id);

    const updatedSubProducts = subProducts.map((product) => {
      const updatedParameters = product.parameters.filter(
        (parameter) => !hiddenSectionIds.includes(parameter.sectionId)
      );
      return {
        ...product,
        parameters: updatedParameters,
      };
    });

    setSubProducts(updatedSubProducts);
  }

  function removeHiddenParametersFromSubProducts(subProducts, productTemplate) {
    return subProducts.map((subProduct) => {
      const filteredParameters = subProduct?.parameters?.filter((param) => {
        let matchingTemplateParam = null;
        const section = productTemplate.sections.find(
          (x) => x.id == param.sectionId
        );
        if (section && section.subSections) {
          const subSection = section.subSections.find(
            (x) => x.id == param.subSectionId
          );
          if (subSection && subSection.parameters) {
            matchingTemplateParam = subSection.parameters.find(
              (templateParam) =>
                templateParam.id === param.parameterId &&
                templateParam.actionIndex === param.actionIndex &&
                !templateParam?.isHiddenInSetting
            );
          }
        }
        if (matchingTemplateParam?.parameterType === 12) {
          return true;
        }
        // Check if the parameter is not hidden (isHidden = false)
        return matchingTemplateParam ? !matchingTemplateParam.isHidden : true;
      });

      // Return the updated subProduct with filtered parameters
      return { ...subProduct, parameters: filteredParameters };
    });
  }
  function removeHiddenParametersFromSubProductsParameters(
    parameters,
    productTemplate
  ) {
    // Create a new array to store the filtered parameters
    const updatedParameters = [];

    // Loop through each parameter in the input list
    for (const param of parameters) {
      let matchingTemplateParam = null;

      // Find the matching template parameter in the productTemplate
      const section = productTemplate.sections.find(
        (x) => x.id === param.sectionId
      );
      if (section && section.subSections) {
        const subSection = section.subSections.find(
          (x) => x.id === param.subSectionId
        );
        if (subSection && subSection.parameters) {
          matchingTemplateParam = subSection.parameters.find(
            (templateParam) =>
              templateParam.id === param.parameterId &&
              templateParam.actionIndex === param.actionIndex &&
              !templateParam?.isHiddenInSetting
          );
        }
      }

      // Check if the parameter should be removed
      if (
        matchingTemplateParam &&
        matchingTemplateParam.settingParameters?.length > 0 &&
        matchingTemplateParam.isHidden
      ) {
        // Skip this parameter and its related settingParameters
        continue;
      }

      // Check if the parameter is related to a hidden settingParameter
      const isRelatedToHiddenSetting = parameters.some((p) => {
        const section = productTemplate.sections.find(
          (x) => x.id === p.sectionId
        );
        if (section && section.subSections) {
          const subSection = section.subSections.find(
            (x) => x.id === p.subSectionId
          );
          if (subSection && subSection.parameters) {
            const templateParam = subSection.parameters.find(
              (templateParam) =>
                templateParam.id === p.parameterId &&
                templateParam.actionIndex === p.actionIndex &&
                !templateParam?.isHiddenInSetting
            );
            return (
              templateParam &&
              templateParam.isHidden &&
              templateParam.settingParameters?.some(
                (sp) => sp.id === param.parameterId
              )
            );
          }
        }
        return false;
      });

      // If the parameter is not hidden and not related to a hidden settingParameter, include it
      if (!isRelatedToHiddenSetting) {
        updatedParameters.push(param);
      }
    }

    // Return the updated parameters list
    return updatedParameters;
  }
  useEffect(() => {
    if (productTemplate?.length > 0) {
      const updateSections = () => {
        const updatedSections = productTemplate?.sections?.map((section) => {
          if (section?.relatedToParameters?.length === 0) {
            return { ...section, isHidden: false };
          } else {
            const hasHidden = section.relatedToParameters.some((rp) => {
              const subParam = subProducts.find((sub) =>
                sub.parameters.some(
                  (param) => param.parameterId === rp.parameterId
                )
              );
              if (subParam) {
                if (rp.activateByAllValues) {
                  return subParam.parameters?.every(
                    (param) => param.parameterId === rp.parameterId
                  );
                } else {
                  return subParam.parameters.some(
                    (param) =>
                      param.parameterId === rp.parameterId &&
                      rp.selectedValueIds.some((id) =>
                        param.valueIds.includes(id)
                      )
                  );
                }
              }
              return false;
            });
            return { ...section, isHidden: !hasHidden };
          }
        });
        setProductTemplate(updatedSections);
      };
      updateSections();
    }
  }, [productTemplate, subProducts]);

  useEffect(() => {
    if (subProducts?.length > 0) {
      let allParameters = subProducts.flatMap((x) => x.parameters);
      let parameterType = allParameters.find((p) => p.parameterCode == "types");
      if (!parameterType && quantityTypes.length > 0) {
        setQuantityTypes([]);
      } else if (
        parameterType &&
        Number(parameterType?.values[0] < 1 && quantityTypes.length > 0)
      ) {
        setQuantityTypes([]);
      }
    }
  }, [subProducts]);

  const [firstEnter, setFirstEnter] = useState(false);
  useEffect(() => {
    if (
      !firstEnter &&
      router?.query?.isAnalysis &&
      productTemplate?.sections?.length > 0
    ) {
      const visibleSections = productTemplate?.sections?.filter(
        (section) => !section.isHidden
      );
      const lastIndex = visibleSections.length;
      handleTabClick(lastIndex);
      setFirstEnter(true);
    }
  }, [router, productTemplate]);

  const validateWorkflows = (data) => {
    const errors = [];
    if (!data?.actions || data?.actions?.length === 0) {
      errors.push(t("validateWorkflows.noAction"));
      return { isValid: false, errors };
    }
    for (let i = 0; i < data.actions.length; i++) {
      const action = data.actions[i];

      // Skip validation if deactivateInProductionFloor is true
      if (action.deactivateInProductionFloor) {
        continue;
      }

      if (
        action.isNeedEmployee &&
        !action.employeeId &&
        action.source != EWorkSource.OUT
      ) {
        errors.push(
          `${action.actionName}: ${t("validateWorkflows.noEmployee")}`
        );
      }
      if (
        action.isNeedMachine &&
        !action.mongoDBMachineId &&
        action.source === 0
      ) {
        errors.push(
          `${action.actionName}: ${t("validateWorkflows.noMavhine")}`
        );
      }
      if ((action.source === 1 || action.source === 2) && !action.supplierId) {
        errors.push(
          `${action.actionName}: ${t("validateWorkflows.noSuppliers")}`
        );
      }
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const getAllFoldOptionsApi = () => {
    const callBack = (res) => {
      if (res.success) {
        setFoldOptions(res?.data);
      }
    };
    getAllFoldOptions(callApi, callBack).then();
  };

  useEffect(() => {
    getAllFoldOptionsApi();
  }, []);
  const getJobStatus = (mission) => {
    if (mission?.isReady) {
      return t("boardMissions.done"); // For completed missions
    }

    if (mission?.boardMissionStatus && mission?.station) {
      const machineName = mission.station.machineName; // Get machine name
      const employeeName = mission.station.employeeName; // Get employee name

      // Initialize the job status string
      let statusString = `${mission.boardMissionStatus.name} | ${mission.station.actionName}`;

      // Check if both names exist and append them
      if (machineName && employeeName) {
        statusString += ` | ${employeeName} | ${machineName}`;
      } else if (employeeName) {
        statusString += ` | ${employeeName}`;
      } else if (machineName) {
        statusString += ` | ${machineName}`;
      }

      return statusString; // Return the formatted job status
    }

    return ""; // Return empty if no valid status or station
  };
  const formatMissions = (missions) => {
    return missions
      .map((mission) => {
        const jobNumber = mission.number;
        const productType = mission.productType;
        const currentStation = getJobStatus(mission); // Use getJobStatus here

        return `${jobNumber}/${productType}. ${currentStation}`;
      })
      .join(",\n"); // Joins with newline characters
  };

  return {
    t,
    router,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    onCloseGalleryModal,
    onCloseMakeShape,
    handleChange,
    _renderParameterType,
    _getParameter,
    navigateForRouter,
    updateQuoteItem,
    setUrgentOrder,
    setPrintingNotes,
    setPriceRecovery,
    onCloseMultiParameterModal,
    duplicateSection,
    removeSection,
    duplicateParameters,
    setProductTemplate,
    multiParameterModal,
    calculationServerErrorState,
    settingParameters,
    setSettingParameters,
    priceRecovery,
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
    errorMsg,
    relatedParameters,
    jobActions,
    workFlows,
    underParameterIds,
    sampleType,
    setSampleType,
    getOutSourcingSuppliers,
    onChangeSubProductsForPrice,
    includeVAT,
    setIncludeVAT,
    isChargeForNewDie,
    setIsChargeForNewDie,
    straightKnife,
    isChangePriceForEdit,
    onClickCloseChangePriceModal,
    setIsChangePriceForEdit,
    isLoadingPrice,
    validateWorkflows,
    saveCurrentStation,
    onClickCloseCurrentStationModal,
    onClickOpenCurrentStationModal,
    missionsListForEdit,
    formatMissions,
    isFlowChanged,
    getSelectedWorkFlow,
    selectedWorkFlowCalculatedIsLoaded,
    setSelectedWorkFlowCalculatedIsLoaded,
    canCalculation,
    calculationProduct,
    subProducts,
    isOpenCreateDefaultWorkFlow,
    onClickOpenCreateDefaultWorkFlow,
    onClickCloseCreateDefaultWorkFlow,
    addItemForQuotes,
    sliderCurrentProductItemValueTotalPrice,
    systemCurrency,
    direction,
    setCanCalculation,
    showCalculationInCompletedAlert,
    showCalculationInCompletedModal,
    setShowCalculationInCompletedModal,
    currentSignalRConnectionId,
    deliveryDate,
    SelectWorkFlowById,
    isOpenErrorsModal,
  };
};

export { useDigitalOffsetPrice };
