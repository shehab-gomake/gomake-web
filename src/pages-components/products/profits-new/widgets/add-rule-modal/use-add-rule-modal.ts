import { useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import {
  getAllProductsForDropDownList,
  getAllTemplets,
  getAndSetAllParameters,
  getAndSetClientTypes,
  getAndSetMachincesByActionId,
} from "@/services/hooks";
import { clientTypesState, parametersState, productsState } from "@/store";
import { useOutputs } from "@/widgets/properties/hooks/use-outputs";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ETypeException } from "../../enums/profites-enum";
import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { CLIENT_TYPE, CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { useTranslation } from "react-i18next";
import { EGroupByEnum } from "@/enums";
import { DocumentTypeEnums } from "@/enums/document-type-enum";
import { agentsCategoriesState } from "@/pages/customers/customer-states";
import {
  getAndSetEmployees2,
  getEmployeesByActionIdApi,
} from "@/services/api-service/customers/employees-api";
import { getALLMachinesApi } from "@/services/api-service/machines/print-house-machines-colors";
import { machineCategoriesState } from "@/store/machine-categories";
import { actionEmployeesState } from "@/store/action-employees-state";
import { endOfToday, startOfYear } from "date-fns";
import { addProductHotFolderRuleApi } from "@/services/api-service/products/product-endpoints";
import { getHotFolderNames } from "@/services/api-service/files-api-settings/files-api-settings-endpoint";

const useAddRuleModal = ({
  typeExceptionSelected,
  selectedPricingBy,
  actionProfitByActionId,
  onCloseModal,
  getProfitsPricingTables,
  selectedPricingTableItems,
  selectedProperties,
  getProperitesService,
  isQuoteWidge,
  filterData,
  openModal,
  getProductHotFolderRules,
  documentType,
  detailsOption,
}) => {
  const GET_MATERIALS_TYPES_URL = "/v1/materials/getMaterialsTypes";
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [hotFolderNames, setHotFolderNames] = useState([]);
  const categoriesList = useRecoilValue(machineCategoriesState);

  const fetchHotFolderNames = useCallback(async () => {
    const callBack = (res) => {
      if (res.success && res.data) {
        setHotFolderNames(res.data || []);
      }
    };
    await getHotFolderNames(callApi, callBack);
  }, [callApi]);

  const [additionType, setAdditionType] = useState<number>(null);

  const onCloseScheduleModal = () => {
    setOpenScheduleModal(false);
  };
  const onOpenScheduleModal = () => {
    setOpenScheduleModal(true);
  };

  const { renderOptions, checkWhatRenderArray, isFetching } =
    useCustomerDropDownList({
      clientType: CLIENT_TYPE.CUSTOMER,
      shouldRenderOnMount: openModal,
    });

  const [propertieValue, setPropertieValue] = useState<any>();
  const isDefaultException =
    selectedPricingTableItems?.exceptionType === ETypeException.DEFAULT;

  const categories = useMemo(() => {
    const filteredCategories = [
      { label: t("products.profits.exceptions.machine"), id: "Machine" },
      {
        label: t("products.profits.exceptions.machineTypeCategory"),
        id: "Machine category",
      },
      // {
      //   label: t("products.profits.exceptions.materialType"),
      //   id: "MATERIALTYPE",
      // },
      { label: t("products.profits.exceptions.products"), id: "Products" },
      {
        label: t("products.profits.exceptions.productType"),
        id: "ProductType",
      },
      { label: t("products.profits.exceptions.clientType"), id: "Client Type" },
      { label: t("products.profits.exceptions.client"), id: "Client" },
      {
        label: t("products.profits.exceptions.propertyOutput"),
        id: "Property output",
      },
      {
        label: t("products.profits.exceptions.propertyInput"),
        id: "Property input",
      },
      { label: t("products.profits.exceptions.agent"), id: "Agent" },
      { label: t("products.profits.exceptions.employee"), id: "Employee" },
    ];
    return isQuoteWidge
      ? filteredCategories.filter((category) => category.id !== "ProductType")
      : filteredCategories.filter((category) => category.id !== "Agent");
  }, [isQuoteWidge]);

  const EStatementCategory = {
    Machine: 1,
    "Machine category": 2,
    "Client Type": 3,
    Client: 4,
    "Property input": 5,
    "Property output": 6,
    Products: 7,
    Agent: 8,
    Employee: 9,
    ProductType: 10,
    MATERIALTYPE: 11,
  };

  const { Outputs } = useOutputs({ shouldRenderOutputsOnMount: openModal });
  const [materialsTypes, setMaterialsTypes] = useState<
    { materialTypeKey: string; materialTypeName: string }[]
  >([]);

  const [agentsCategories, setAgentsCategories] = useRecoilState(
    agentsCategoriesState
  );

  const getAgentCategories = async () => {
    const callBack = (res) => {
      if (res.success) {
        const agentNames = res.data.map((agent) => ({
          label: agent.text,
          id: agent.value,
        }));
        setAgentsCategories(agentNames);
      }
    };
    await getAndSetEmployees2(callApi, callBack, { isAgent: true });
  };

  useEffect(() => {
    getAgentCategories();
  }, []);

  const getMaterialsTypesApi: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(
      callApi,
      EHttpMethod.GET,
      GET_MATERIALS_TYPES_URL,
      setState
    );
  };

  const getAllMaterials = async () => {
    const callBack = (res) => {
      if (res.success) {
        setMaterialsTypes(res.data);
      }
    };
    await getMaterialsTypesApi(callApi, callBack);
  };
  const [expression, setExpression] = useState(
    "Your rules will viewed here . . ."
  );

  // const conditions = useMemo(() => {
  //   return [
  //     { label: "==", id: "==" },
  //     { label: ">", id: ">" },
  //     { label: ">=", id: ">=" },
  //     { label: "<", id: "<" },
  //     { label: "<=", id: "<=" },
  //     { label: "!=", id: "!=" },
  //   ];
  // }, []);

  const mainconditions = useMemo(() => {
    return [
      { label: "AND", id: "&&" },
      { label: "OR", id: "||" },
    ];
  }, []);

  const BooleanRender = useMemo(() => {
    return [
      { label: t("modal.yes"), id: "true" },
      { label: t("modal.no"), id: "false" },
    ];
  }, []);

  const GroupByOptions = useMemo(() => {
    return [
      { label: "Client", id: EGroupByEnum.CLIENT },
      { label: "Agent", id: EGroupByEnum.AGENT },
      { label: "Product", id: EGroupByEnum.PRODUCT },
      { label: "Product Sku", id: EGroupByEnum.PRODUCT_SKU },
      { label: "Client Type", id: EGroupByEnum.CLIENT_TYPE },
      { label: "Action", id: EGroupByEnum.Action },
      { label: "Material", id: EGroupByEnum.Material },
      { label: "Machine", id: EGroupByEnum.Machine },
    ];
  }, []);
  const {
    alertSuccessAdded,
    alertFaultAdded,
    setSnackbarStateValue,
    alertFault,
  } = useSnackBar();
  const router = useRouter();

  const initialRule = {
    linkCondition: "",
    category: "",
    statement: "",
    condition: "",
    statement2: "",
  };
  const [rules, setRules] = useState<any>([initialRule]);

  const addRule = () => {
    setRules([...rules, initialRule]);
  };
  const deleteRule = (index) => {
    const updatedRules = [...rules];
    updatedRules.splice(index, 1);
    setRules(updatedRules);
  };

  const handleChange = (index, field, value) => {
    const updatedRules = [...rules];
    updatedRules[index][field] = value;
    setRules(updatedRules);
  };

  const [machincesList, setMachincesList] = useState<any>();
  const [allMachincesList, setAllMachincesList] = useState<any>();
  const [productsStateValue, setProductsState] =
    useRecoilState<any>(productsState);
  const [clientTypesStateValue, setClientTypesState] =
    useRecoilState<any>(clientTypesState);
  const [parametersStateValue, setParametersState] =
    useRecoilState<any>(parametersState);
  const [allProductTypes, setAllProductTypes] = useState<any>();
  const [employeeList, setEmployeeList] = useState([]);
  const [actionEmployeeList, setActionEmployeeList] =
    useRecoilState<any>(actionEmployeesState);

  const getMachinesList = async () => {
    const callBack = (res) => {
      if (res.success) {
        setAllMachincesList(res.data);
      }
    };
    await getALLMachinesApi(callApi, callBack).then();
  };

  const getMachincesByActionId = useCallback(async () => {
    if (router.query.actionId) {
      await getAndSetMachincesByActionId(callApi, setMachincesList, {
        actionId: router.query.actionId,
      });
      getMachinesList();
    } else {
      getMachinesList();
    }
  }, [router]);

  const getProducts = useCallback(async () => {
    await getAllProductsForDropDownList(callApi, setProductsState);
  }, []);

  const getClientTypes = useCallback(async () => {
    await getAndSetClientTypes(callApi, setClientTypesState, {
      cardType: CLIENT_TYPE_Id.CUSTOMER,
    });
  }, []);

  const getParameters = useCallback(async () => {
    return await getAndSetAllParameters(callApi, setParametersState);
  }, []);

  const getAllProductTypes = useCallback(async () => {
    const result = await getAllTemplets(callApi);
    const mappedResult = result.map((item: any) => ({
      id: item.id,
      label: item.name,
    }));
    setAllProductTypes(mappedResult);
  }, []);

  const getEmployeeCategories = async () => {
    const callBack = (res) => {
      if (res.success) {
        const employeeList = res.data.map((employee) => ({
          label: employee.text,
          id: employee.value,
        }));
        setEmployeeList(employeeList);
      }
    };
    await getAndSetEmployees2(callApi, callBack, { IsGraphicArtist: true });
  };
  const getEmployeesByActionId = async () => {
    if (router.query.actionId) {
      const callBack = (res) => {
        if (res.success) {
          const employeeList = res.data.map((employee) => ({
            label: employee.name,
            id: employee.id,
          }));
          setActionEmployeeList(employeeList);
        }
      };
      await getEmployeesByActionIdApi(callApi, callBack, {
        ActionId: router.query.actionId,
      });
    }
  };

  // ensuring it only renders when the 'Add Rule' modal is opened.
  useEffect(() => {
    if (openModal) {
      getClientTypes();
      getProducts();
      getParameters();
      getAllMaterials();
      getAllProductTypes();
      getEmployeeCategories();
      getMachincesByActionId();
    }
  }, [openModal]);

  useEffect(() => {
    getEmployeesByActionId();
  }, [router]);

  const [exceptionType, setExceptionType] = useState<any>();
  const [additionalProfit, setAdditionalProfit] = useState<any>(0);

  function isRuleEmpty(rule) {
    return Object.values(rule).every((value) => value === "");
  }

  function displayText(conditions) {
    if (conditions.length === 0 || isRuleEmpty(conditions[0])) {
      return t("products.profits.pricingListWidget.noRuleFount");
    }
    const textArray = conditions.map((condition) => {
      const categoryLabel = condition?.category
        ? condition.category.id !== "Property output" &&
          condition.category.id !== "Property input"
          ? condition.category.label
          : ""
        : "";
      const conditionLabel = condition?.condition?.id ?? "";
      const statement2Label = condition.statement2?.label ?? "";
      let text = "";

      if (condition.linkCondition) {
        text += ` ${condition?.linkCondition.id} `;
      }
      if (conditionLabel === "%=") {
        return `${statement2Label} % ${condition?.statement} = 0`;
      }
      if (conditionLabel === "%!=") {
        return `${statement2Label} % ${condition?.statement} != 0`;
      }

      if (
        typeof condition?.statement === "object" &&
        typeof condition?.statement2 === "object" &&
        categoryLabel === ""
      ) {
        const statementLabel = condition?.statement?.label ?? "";
        let translatedStatementLabel = statementLabel;
        if (
          condition.statement2 &&
          condition.statement2.type === 3 &&
          statementLabel === "true"
        ) {
          translatedStatementLabel = t("modal.yes");
        }
        if (
          condition.statement2 &&
          condition.statement2.type === 3 &&
          (!statementLabel || statementLabel === "false")
        ) {
          translatedStatementLabel = t("modal.no");
        }
        text += `${statement2Label} ${conditionLabel}  ${translatedStatementLabel}`;
      } else if (
        typeof condition?.statement === "object" &&
        typeof condition?.statement2 === "object"
      ) {
        const statementLabel = condition?.statement?.label ?? "";
        text += `${categoryLabel} ${conditionLabel} ${statement2Label} ${statementLabel}`;
      } else {
        const statementLabel = condition?.statement ?? "";
        if (statementLabel.length > 0) {
          let translatedStatementLabel = statementLabel;
          if (
            condition.statement2 &&
            condition.statement2.type === 3 &&
            statementLabel === "true"
          ) {
            translatedStatementLabel = t("modal.yes");
          }
          if (
            condition.statement2 &&
            condition.statement2.type === 3 &&
            (!statementLabel || statementLabel === "false")
          ) {
            translatedStatementLabel = t("modal.no");
          }
          text += `${categoryLabel} ${statement2Label} ${conditionLabel} ${translatedStatementLabel}`;
        } else {
          text += `${categoryLabel} ${conditionLabel} ${statement2Label}`;
        }
      }

      return text.trim();
    });
    const joinedText = textArray.join(" "); // Join textArray with " && "
    return `${t("properties.if")} (${joinedText})`;
  }

  const mappingRules = useCallback(() => {
    return rules.map((rule) => {
      return {
        statementId:
          typeof rule?.statement === "object"
            ? rule?.statement?.id
            : rule.statement,
        statementValue: rule.statement2.id,
        operator: rule.condition.id,
        conditionBetweenStatements: rule.linkCondition
          ? rule.linkCondition.id
          : "",
        statementCategory: EStatementCategory[rule.category.id],
      };
    });
  }, [rules]);

  useEffect(() => {
    const textInput = displayText(rules);
    setExpression(textInput);
  }, [rules]);

  const getStatementId = (item) => {
    if (typeof item?.statement === "object") {
      //material input
      if (
        (item.statement2 && item.statement2.type === 5) ||
        (item.statement2 && item.statement2.type === 10) ||
        (item.statement2 && item.statement2.type === 11)
      ) {
        return item?.statement?.code;
      }
      return item?.statement?.id || item?.statement?.value;
    }
    return item?.statement;
  };
  const create = useCallback(async () => {
    const requestBody: any = {
      actionId: router?.query?.actionId,
      actionProfitId: actionProfitByActionId?.id,
      exceptionType: typeExceptionSelected,
      additionalProfit: additionalProfit,
      pricingBy: selectedPricingBy?.value,
      exceptionRule: expression,
      additionType: additionType || 0,
      exceptionConditionProperties: rules.map((item) => {
        return {
          statementId: getStatementId(item),
          // statementValue: item.statement2.id,
          statementValue:
            item?.category?.id === "MATERIALTYPE"
              ? item.statement2.enumCode
              : item.statement2.id,
          operator: item.condition.id,
          conditionBetweenStatements: item.linkCondition
            ? item.linkCondition.id
            : "",
          statementCategory: EStatementCategory[item.category.id],
        };
      }),
    };

    if (
      !isDefaultException &&
      typeExceptionSelected === ETypeException.EDITBASE
    ) {
      requestBody.duplicatedExceptionId = selectedPricingTableItems?.id;
    }

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/printhouse-config/action-profit-rows/add-action-exception`,
      requestBody
    );

    if (res?.success) {
      alertSuccessAdded();
      onCloseModal();
      setRules([initialRule]);
      getProfitsPricingTables();
    } else {
      alertFaultAdded();
    }
  }, [
    router,
    typeExceptionSelected,
    selectedPricingBy,
    selectedPricingTableItems,
    expression,
    actionProfitByActionId,
    additionalProfit,
    EStatementCategory,
    rules,
    isDefaultException,
  ]);

  const createProperties = useCallback(async () => {
    if (!propertieValue) {
      alertFaultAdded();
      return;
    }
    const isValidRules = rules.every((rule) => {
      const hasCategory = rule.category && rule.category.id;
      const hasCondition = rule.condition && rule.condition.id;
      const hasStatement2 = rule.statement2 && rule.statement2.id;

      if (!hasCategory || !hasCondition || !hasStatement2) {
        setSnackbarStateValue({
          state: true,
          message: t("properties.fillAllFields"),
          type: "error",
        });
        return false;
      }

      return true;
    });

    if (!isValidRules) {
      return;
    }
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/printhouse-config/print-house-action/add-rule/${router?.query?.actionId}/${selectedProperties?.propertyId}/${selectedProperties?.ruleType}`,
      {
        ruleName: expression,
        ruleConditionStatements: null,
        exceptionConditionProperties: rules.map((item) => {
          let condition = {
            statementId: getStatementId(item),
            statementValue: item.statement2.id,
            operator: item.condition.id,
            conditionBetweenStatements: item.linkCondition
              ? item.linkCondition.id
              : "",
            statementCategory: EStatementCategory[item.category.id],
          };
          if (
            item.category.id == "Property input" ||
            item.category.id == "Property output"
          ) {
            condition.statementId = item.statement2.id;
            condition.statementValue = getStatementId(item);
          }
          return condition;
        }),
        successEvent: propertieValue,
        expression: expression,
      }
    );

    if (res?.success) {
      alertSuccessAdded();
      getProperitesService();
      onCloseModal();
      setRules([initialRule]);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("properties.ruleAlreadyAdded"),
        type: "error",
      });
    }
  }, [router, expression, selectedProperties, propertieValue, rules]);
  const [fromDate, setFromDate] = useState<Date>(startOfYear(new Date()));
  const [toDate, setToDate] = useState<Date>(endOfToday());
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);

  const onSelectDeliveryTimeDates = (value) => {
    if (value && value.length === 2) {
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };

  // const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
  //   setResetDatePicker(false);
  //   setFromDate(fromDate);
  //   setToDate(toDate);
  // };
  const createForQuoteWidget = useCallback(async () => {
    // Filter out empty/invalid rules
    const validRules = rules.filter((item) => {
      return (
        item?.category?.id &&
        item?.statement2?.id &&
        item?.condition?.id
      );
    });

    // Build exception condition properties only if there are valid rules
    const exceptionConditionProperties = validRules.length > 0
      ? validRules.map((item) => {
          return {
            statementValue:
              typeof item?.statement === "object"
                ? item?.statement?.id
                : item?.statement,
            statementId: item?.statement2?.id,
            operator: item?.condition?.id,
            conditionBetweenStatements: item?.linkCondition
              ? item?.linkCondition?.id
              : "",
            statementCategory: EStatementCategory[item?.category?.id],
          };
        })
      : [];

    try {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/documents/generate-document-report`,
        {
          documentType: documentType,
          exportType: detailsOption,
            ...(documentType === DocumentTypeEnums.BoardMission
              ? { 
                boardMissionTableFilterDTO: {
                    statusId: filterData?.statusId,
                    closeStatus: filterData?.closeStatus,
                    productionStatus: filterData?.productionStatus,
                    patternSearch: filterData?.patternSearch,
                    customerId: filterData?.customerId,
                    dateRange: filterData?.dateRange,
                    agentId: filterData?.agentId,
                    minPrice: filterData?.minPrice,
                    maxPrice: filterData?.maxPrice,
                    productList: filterData?.productList,
                    fromDate: filterData?.fromDate,
                    toDate: filterData?.toDate,
                  }
                }
              : { 
                  filterDTO: {
                    statusId: filterData?.statusId,
                    closeStatus: filterData?.closeStatus,
                    productionStatus: filterData?.productionStatus,
                    patternSearch: filterData?.patternSearch,
                    customerId: filterData?.customerId,
                    dateRange: filterData?.dateRange,
                    agentId: filterData?.agentId,
                    minPrice: filterData?.minPrice,
                    maxPrice: filterData?.maxPrice,
                    productList: filterData?.productList,
                    fromDate: filterData?.fromDate,
                    toDate: filterData?.toDate,
                  }
                }
            ),
            groupBy: propertieValue,
            exceptionConditionProperties: exceptionConditionProperties,
        }
      );

      if (res?.success && res?.data) {
        // If the response contains a URL string, download it
        if (typeof res.data === 'string' && res.data.startsWith('http')) {
          const downloadLink = document.createElement("a");
          downloadLink.href = res.data;
          downloadLink.download = "Reports Rule engine.xlsx";
          downloadLink.target = "_blank";
          downloadLink.click();
        } else {
          // If it's a blob, create object URL
          const downloadLink = document.createElement("a");
          const link = URL?.createObjectURL(res.data);
          downloadLink.href = link;
          downloadLink.download = "Reports Rule engine.xlsx";
          downloadLink.click();
          URL.revokeObjectURL(link);
        }
        onCloseModal();
        setRules([initialRule]);
      } else {
        alertFaultAdded();
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alertFaultAdded();
    }
  }, [propertieValue, EStatementCategory, rules, filterData, detailsOption, documentType, onCloseModal, setRules, initialRule, callApi, alertFaultAdded]);

  const getConditionText = (label) => {
    switch (label) {
      case "==":
        return t("properties.conditions.equal");
      case ">":
        return t("properties.conditions.greater_than");
      case ">=":
        return t("properties.conditions.greater_than_or_equal");
      case "<":
        return t("properties.conditions.less_than");
      case "<=":
        return t("properties.conditions.less_than_or_equal");
      case "!=":
        return t("properties.conditions.not_equal");
      default:
        return "";
    }
  };

  const conditions = useMemo(() => {
    return [
      { label: t("properties.conditions.equal"), id: "==" },
      { label: t("properties.conditions.greater_than"), id: ">" },
      { label: t("properties.conditions.greater_than_or_equal"), id: ">=" },
      { label: t("properties.conditions.less_than"), id: "<" },
      { label: t("properties.conditions.less_than_or_equal"), id: "<=" },
      { label: t("properties.conditions.not_equal"), id: "!=" },
      { label: t("properties.conditions.equal_duplicate_of"), id: "%=" },
      { label: t("properties.conditions.not_equal_duplicate_of"), id: "%!=" },
    ];
  }, []);

  const createForHotFolderWidget = async () => {
    // Validation: check required fields
    if (!propertieValue || !expression || !rules.length) {
      setSnackbarStateValue({
        state: true,
        message: t("properties.fillAllFields"),
        type: "error",
      });
      return;
    }
    // Validate each rule
    const isValidRules = rules.every((rule) => {
      const hasCategory = rule.category && rule.category.id;
      const hasCondition = rule.condition && rule.condition.id;
      const hasStatement2 =
        rule.statement2 && (rule.statement2.id || rule.statement2.enumCode);
      return hasCategory && hasCondition && hasStatement2;
    });
    if (!isValidRules) {
      setSnackbarStateValue({
        state: true,
        message: t("properties.fillAllFields"),
        type: "error",
      });
      return;
    }

    const requestBody: any = {
      hotFolderPath: propertieValue,
      expression: expression,
      exceptionConditionProperties: rules.map((item) => {
        return {
          statementId: getStatementId(item),
          statementValue:
            item?.category?.id === "MATERIALTYPE"
              ? item.statement2.enumCode
              : item.statement2.id,
          operator: item.condition.id,
          conditionBetweenStatements: item.linkCondition
            ? item.linkCondition.id
            : "",
          statementCategory: EStatementCategory[item.category.id],
        };
      }),
    };
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        onCloseModal();
        setRules([initialRule]);
        getProductHotFolderRules();
      } else {
        if (!res?.msg || res?.msg == "") {
          alertFaultAdded();
        } else {
          if (res?.errors?.message) {
            alertFault(t(`${res?.msg} ---> ${res?.errors?.message}`));
          } else {
            alertFault(t(`${res?.msg}`));
          }
        }
      }
    };
    await addProductHotFolderRuleApi(callApi, callBack, {
      productId: router?.query?.id,
      ...requestBody,
    });
  };

  return {
    rules,
    deleteRule,
    handleChange,
    addRule,
    resetDatePicker,
    onSelectDeliveryTimeDates,
    machincesList,
    allMachincesList,
    productsStateValue,
    clientTypesStateValue,
    parametersStateValue,
    Outputs,
    exceptionType,
    setExceptionType,
    additionalProfit,
    setAdditionalProfit,
    BooleanRender,
    expression,
    mainconditions,
    categories,
    conditions,
    create,
    createProperties,
    propertieValue,
    setPropertieValue,
    materialsTypes,
    GroupByOptions,
    agentsCategories,
    createForQuoteWidget,
    setRules,
    initialRule,
    openScheduleModal,
    onCloseScheduleModal,
    onOpenScheduleModal,
    renderOptions,
    checkWhatRenderArray,
    mappingRules,
    categoriesList,
    employeeList,
    allProductTypes,
    actionEmployeeList,
    fromDate,
    toDate,
    isFetching,
    getConditionText,
    setAdditionType,
    createForHotFolderWidget,
    hotFolderNames,
    fetchHotFolderNames,
  };
};

export { useAddRuleModal };
