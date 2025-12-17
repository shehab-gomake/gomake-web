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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ETypeException } from "../../enums/profites-enum";
import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { CLIENT_TYPE, CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { useTranslation } from "react-i18next";
import { DocumentTypeEnums, EGroupByEnum } from "@/enums";
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
  pricingTableConditionProperties,
  duplicateRule,
  parametersStateValue,
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

  const router = useRouter();
  const [propertieValue, setPropertieValue] = useState<any>();
  const isDefaultException =
    selectedPricingTableItems?.exceptionType === ETypeException.DEFAULT;

  const categories = useMemo(() => {
    const actionId = router?.query?.actionId as string;
    const showMaterialType =
      actionId === "5f3e9084-6724-4358-9f94-8c63019c8894";

    const filteredCategories = [
      { label: t("products.profits.exceptions.machine"), id: "Machine" },
      {
        label: t("products.profits.exceptions.machineTypeCategory"),
        id: "Machine category",
      },
      ...(showMaterialType
        ? [
            {
              label: t("products.profits.exceptions.materialType"),
              id: "MATERIALTYPE",
            },
          ]
        : []),
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
  }, [isQuoteWidge, router?.query?.actionId, t]);

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

  // Reverse mapping: statementCategory number -> category name
  const StatementCategoryToCategoryId = {
    1: "Machine",
    2: "Machine category",
    3: "Client Type",
    4: "Client",
    5: "Property input",
    6: "Property output",
    7: "Products",
    8: "Agent",
    9: "Employee",
    10: "ProductType",
    11: "MATERIALTYPE",
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
    return new Promise((resolve) => {
      const callBack = (res) => {
        if (res.success) {
          setMaterialsTypes(res.data);
        }
        resolve(res);
      };
      getMaterialsTypesApi(callApi, callBack);
    });
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

  const initialRule = {
    linkCondition: "",
    category: "",
    statement: "",
    condition: "",
    statement2: "",
  };
  const [rules, setRules] = useState<any>([initialRule]);
  const hasInitializedDuplicateRules = useRef(false);

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
  const [allProductTypes, setAllProductTypes] = useState<any>();
  const [employeeList, setEmployeeList] = useState([]);
  const [actionEmployeeList, setActionEmployeeList] =
    useRecoilState<any>(actionEmployeesState);

  const getMachinesList = async () => {
    return new Promise((resolve) => {
      const callBack = (res) => {
        if (res.success) {
          setAllMachincesList(res.data);
        }
        resolve(res);
      };
      getALLMachinesApi(callApi, callBack).then();
    });
  };

  const getMachincesByActionId = useCallback(async () => {
    if (router.query.actionId) {
      await getAndSetMachincesByActionId(callApi, setMachincesList, {
        actionId: router.query.actionId,
      });
      return await getMachinesList();
    } else {
      return await getMachinesList();
    }
  }, [router]);

  const getProducts = useCallback(async () => {
    return await getAllProductsForDropDownList(callApi, setProductsState);
  }, []);

  const getClientTypes = useCallback(async () => {
    return await getAndSetClientTypes(callApi, setClientTypesState, {
      cardType: CLIENT_TYPE_Id.CUSTOMER,
    });
  }, []);

  const getAllProductTypes = useCallback(async () => {
    const result = await getAllTemplets(callApi);
    const mappedResult = result.map((item: any) => ({
      id: item.id,
      label: item.name,
    }));
    setAllProductTypes(mappedResult);
    return mappedResult;
  }, []);

  const getEmployeeCategories = async () => {
    return new Promise((resolve) => {
      const callBack = (res) => {
        if (res.success) {
          const employeeList = res.data.map((employee) => ({
            label: employee.text,
            id: employee.value,
          }));
          setEmployeeList(employeeList);
        }
        resolve(res);
      };
      getAndSetEmployees2(callApi, callBack, { IsGraphicArtist: true });
    });
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

  // Track loading state for all data (only when duplicating)
  const [isDataLoading, setIsDataLoading] = useState(false);

  // ensuring it only renders when the 'Add Rule' modal is opened.
  useEffect(() => {
    if (openModal) {
      // Only wait for all data when duplicating, otherwise load normally
      if (duplicateRule) {
        setIsDataLoading(true);
        // Load all data in parallel and wait for all to complete (only for duplicate)
        Promise.all([
          getClientTypes(),
          getProducts(),
          getAllMaterials(),
          getAllProductTypes(),
          getEmployeeCategories(),
          getMachincesByActionId(),
        ]).finally(() => {
          // Small delay to ensure state updates are complete
          setTimeout(() => {
            setIsDataLoading(false);
          }, 100);
        });
      } else {
        // Normal add - load data without waiting
        getClientTypes();
        getProducts();
        getAllMaterials();
        getAllProductTypes();
        getEmployeeCategories();
        getMachincesByActionId();
      }
    }
  }, [openModal, duplicateRule]);

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

  // const mappingRules = useCallback(() => {
  //   return rules.map((rule) => {
  //     return {
  //       statementId:
  //         typeof rule?.statement === "object"
  //           ? rule?.statement?.id
  //           : rule.statement,
  //       statementValue: rule.statement2.id,
  //       operator: rule.condition.id,
  //       conditionBetweenStatements: rule.linkCondition
  //         ? rule.linkCondition.id
  //         : "",
  //       statementCategory: EStatementCategory[rule.category.id],
  //     };
  //   });
  // }, [rules]);

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
      return item?.category?.id && item?.statement2?.id && item?.condition?.id;
    });

    // Build exception condition properties only if there are valid rules
    const exceptionConditionProperties =
      validRules.length > 0
        ? validRules.map((item) => {
            return {
              statementValue:
                typeof item?.statement === "object"
                  ? item?.statement2?.type === 5
                    ? item?.statement?.code
                    : item?.statement?.id
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
      // Check if at least one date is provided from any of the three date ranges
      const hasDateRange = filterData?.fromDate || filterData?.toDate;
      const hasDueDateRange = filterData?.fromDueDate || filterData?.toDueDate;
      const hasReadyDateRange =
        filterData?.fromReadyDate || filterData?.toReadyDate;

      if (!hasDateRange && !hasDueDateRange && !hasReadyDateRange) {
        alertFault(t("boardMissions.dateFilterRequired"));
        return;
      }
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/documents/generate-document-report`,
        {
          documentType: documentType,
          exportType: detailsOption?.id,
          ...(documentType === DocumentTypeEnums.BoardMission
            ? {
                boardMissionTableFilterDTO: {
                  clientId: filterData?.customerId,
                  agentId: filterData?.agentId,
                  search: filterData?.patternSearch,
                  fromDate: filterData?.fromDate,
                  toDate: filterData?.toDate,
                  fromDueDate: filterData?.fromDueDate,
                  toDueDate: filterData?.toDueDate,
                  fromReadyDate: filterData?.fromReadyDate,
                  toReadyDate: filterData?.toReadyDate,
                  productsIds: filterData?.productIds,
                  productionStatus: filterData?.statusId?.toString(),
                  orderStatus: filterData?.orderStatus?.toString(),
                  pageNumber: filterData?.pageNumber?.toString(),
                  pageSize: filterData?.pageSize,
                  orderNumber: filterData?.orderNumber,
                  order: filterData?.order || null,
                  exampleTypes: filterData?.proofTypes,
                  isPrinted: filterData?.isPrinted?.toString(),
                },
              }
            : {
                filterDTO: {
                  statusId: filterData?.statusId,
                  closeStatus: filterData?.closeStatus,
                  productionStatus:
                    filterData?.productionStatus ||
                    filterData?.statusId?.toString(),
                  patternSearch: filterData?.patternSearch,
                  customerId: filterData?.customerId,
                  dateRange: filterData?.dateRange,
                  agentId: filterData?.agentId,
                  minPrice: filterData?.minPrice,
                  maxPrice: filterData?.maxPrice,
                  productList: filterData?.productList,
                  fromDate: filterData?.fromDate,
                  toDate: filterData?.toDate,
                  clientId: filterData?.clientId,
                  search: filterData?.patternSearch,
                  orderNumber: filterData?.orderNumber,
                  fromDueDate: filterData?.fromDueDate,
                  toDueDate: filterData?.toDueDate,
                  fromReadyDate: filterData?.fromReadyDate,
                  toReadyDate: filterData?.toReadyDate,
                  orderStatus: filterData?.orderStatus,
                  productsIds: filterData?.productIds,
                  supplierId: filterData?.supplierId,
                  isPrinted: filterData?.isPrinted,
                  isPurchaseJobs: filterData?.isPurchaseJobs,
                  exampleTypes: filterData?.proofTypes,
                },
              }),
          groupBy: propertieValue,
          exceptionConditionProperties: exceptionConditionProperties,
        }
      );

      if (res?.success && res?.data) {
        // If the response contains a URL string, download it
        if (typeof res.data === "string" && res.data.startsWith("http")) {
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
  }, [
    propertieValue,
    EStatementCategory,
    rules,
    filterData,
    detailsOption,
    documentType,
    onCloseModal,
    setRules,
    initialRule,
    callApi,
    alertFaultAdded,
  ]);

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

  // Map condition properties to rules format
  const mapConditionPropertiesToRules = useCallback(() => {
    if (
      !pricingTableConditionProperties ||
      !Array.isArray(pricingTableConditionProperties) ||
      pricingTableConditionProperties.length === 0
    ) {
      return [initialRule];
    }

    return pricingTableConditionProperties.map((conditionProp, index) => {
      const rule: any = {
        linkCondition: "",
        category: "",
        statement: "",
        condition: "",
        statement2: "",
      };

      // Map statementCategory to category
      const categoryId =
        StatementCategoryToCategoryId[conditionProp.statementCategory];
      if (categoryId) {
        const categoryObj = categories.find((cat) => cat.id === categoryId);
        if (categoryObj) {
          rule.category = categoryObj;
        } else {
          // Fallback: create category object if not found in categories array
          // This can happen if categories haven't loaded yet or if the category is filtered out
          const categoryLabels: { [key: string]: string } = {
            Machine: t("products.profits.exceptions.machine"),
            "Machine category": t(
              "products.profits.exceptions.machineTypeCategory"
            ),
            Products: t("products.profits.exceptions.products"),
            ProductType: t("products.profits.exceptions.productType"),
            "Client Type": t("products.profits.exceptions.clientType"),
            Client: t("products.profits.exceptions.client"),
            "Property output": t("products.profits.exceptions.propertyOutput"),
            "Property input": t("products.profits.exceptions.propertyInput"),
            Agent: t("products.profits.exceptions.agent"),
            Employee: t("products.profits.exceptions.employee"),
          };
          rule.category = {
            id: categoryId,
            label: categoryLabels[categoryId] || categoryId,
          };
        }
      }

      // Map operator to condition
      if (conditionProp.operator) {
        const conditionObj = conditions.find(
          (cond) => cond.id === conditionProp.operator
        );
        if (conditionObj) {
          rule.condition = conditionObj;
        }
      }

      // Map conditionBetweenStatements to linkCondition (only for items after the first)
      if (index > 0 && conditionProp.conditionBetweenStatements) {
        const linkConditionObj = mainconditions.find(
          (link) => link.id === conditionProp.conditionBetweenStatements
        );
        if (linkConditionObj) {
          rule.linkCondition = linkConditionObj;
        }
      }

      // Map statementValue to statement2 based on category
      if (conditionProp.statementValue && categoryId) {
        let statement2Obj = null;

        switch (categoryId) {
          case "Machine":
            statement2Obj = allMachincesList?.find(
              (m) => m.id === conditionProp.statementValue
            );
            break;
          case "Products":
            statement2Obj = productsStateValue?.find(
              (p) => p.id === conditionProp.statementValue
            );
            break;
          case "Client Type":
            statement2Obj = clientTypesStateValue?.find(
              (ct) => ct.id === conditionProp.statementValue
            );
            break;
          case "Property output":
            statement2Obj = Outputs?.find(
              (o) => o.id === conditionProp.statementValue
            );
            break;
          case "Property input":
            statement2Obj = parametersStateValue?.find(
              (p) => p.id === conditionProp.statementValue
            );
            break;
          case "Agent":
            statement2Obj = agentsCategories?.find(
              (a: any) => a.id === conditionProp.statementValue
            );
            break;
          case "Employee":
            statement2Obj = actionEmployeeList?.find(
              (e) => e.id === conditionProp.statementValue
            );
            break;
          case "ProductType":
            statement2Obj = allProductTypes?.find(
              (pt) => pt.id === conditionProp.statementValue
            );
            break;
          case "Machine category":
            statement2Obj = categoriesList?.find(
              (mc) => mc.id === conditionProp.statementValue
            );
            break;
          case "MATERIALTYPE":
            statement2Obj = materialsTypes?.find(
              (mt) => mt.materialTypeKey === conditionProp.statementValue
            );
            break;
        }

        if (statement2Obj) {
          // Format statement2 object to match expected structure
          if (categoryId === "MATERIALTYPE") {
            rule.statement2 = {
              ...statement2Obj,
              id: statement2Obj.materialTypeKey,
              label: statement2Obj.materialTypeName,
            };
          } else if (categoryId === "Machine") {
            rule.statement2 = {
              ...statement2Obj,
              id: statement2Obj.id,
              label: statement2Obj.nickName || statement2Obj.machineName,
            };
          } else {
            rule.statement2 = {
              ...statement2Obj,
              id: statement2Obj.id,
              label:
                statement2Obj.label || statement2Obj.name || statement2Obj.text,
            };
          }
        }
      }

      // Map statementId to statement if exists
      if (
        conditionProp.statementId &&
        rule.category?.id === "Property output" &&
        rule.statement2
      ) {
        // For Property output, statement might be a machine or value
        if (rule.statement2.valueType === 1) {
          // Machine type
          const statementObj = allMachincesList?.find(
            (m) => m.id === conditionProp.statementId
          );
          if (statementObj) {
            rule.statement = {
              ...statementObj,
              id: statementObj.id,
              label: statementObj.nickName || statementObj.machineName,
            };
          }
        } else if (rule.statement2.valueType === 3) {
          // Boolean type
          rule.statement =
            conditionProp.statementId === "true" ||
            conditionProp.statementId === true
              ? "true"
              : "false";
        } else if (
          rule.statement2.valueType === 4 ||
          rule.statement2.valueType === 5
        ) {
          // Number or Text type
          rule.statement = conditionProp.statementId;
        } else if (
          rule.statement2.type === 0 ||
          rule.statement2.type === 5 ||
          rule.statement2.type === 4
        ) {
          // Dropdown type - find in values
          const statementObj = rule.statement2.values?.find(
            (v) => v.id === conditionProp.statementId
          );
          if (statementObj) {
            rule.statement = {
              ...statementObj,
              id: statementObj.id,
              label: statementObj.name,
            };
          }
        }
      } else if (
        conditionProp.statementId &&
        rule.category?.id === "Property input"
      ) {
        // For Property input, statement might be in values
        if (rule.statement2?.values) {
          const statementObj = rule.statement2.values.find(
            (v) => v.id === conditionProp.statementId
          );
          if (statementObj) {
            rule.statement = {
              ...statementObj,
              id: statementObj.id,
              label: statementObj.name,
            };
          }
        } else {
          rule.statement = conditionProp.statementId;
        }
      }

      return rule;
    });
  }, [
    pricingTableConditionProperties,
    categories,
    conditions,
    mainconditions,
    allMachincesList,
    productsStateValue,
    clientTypesStateValue,
    Outputs,
    parametersStateValue,
    agentsCategories,
    actionEmployeeList,
    allProductTypes,
    categoriesList,
    materialsTypes,
    initialRule,
  ]);

  // Initialize rules from condition properties when duplicateRule is true
  useEffect(() => {
    // Only apply mapping logic when duplicateRule is true
    if (duplicateRule && openModal) {
      // Wait for all data to be loaded before mapping (only when duplicating)
      const isAllDataLoaded =
        !isDataLoading && // Wait until data loading is complete
        pricingTableConditionProperties &&
        pricingTableConditionProperties.length > 0 &&
        categories &&
        categories.length > 0 &&
        conditions &&
        conditions.length > 0 &&
        (Array.isArray(allMachincesList)
          ? allMachincesList.length >= 0
          : allMachincesList !== undefined) && // Machines can be empty array
        (Array.isArray(productsStateValue)
          ? productsStateValue.length >= 0
          : productsStateValue !== undefined) && // Products can be empty array
        (Array.isArray(allProductTypes)
          ? allProductTypes.length >= 0
          : allProductTypes !== undefined) && // Product types can be empty array
        (Array.isArray(clientTypesStateValue)
          ? clientTypesStateValue.length >= 0
          : clientTypesStateValue !== undefined) && // Client types can be empty array
        (Array.isArray(Outputs)
          ? Outputs.length >= 0
          : Outputs !== undefined) && // Outputs can be empty array
        (Array.isArray(parametersStateValue)
          ? parametersStateValue.length >= 0
          : parametersStateValue !== undefined) && // Parameters can be empty array
        (Array.isArray(materialsTypes)
          ? materialsTypes.length >= 0
          : materialsTypes !== undefined); // Materials can be empty array

      if (isAllDataLoaded && !hasInitializedDuplicateRules.current) {
        // All data is loaded, now map the rules
        const timer = setTimeout(() => {
          const mappedRules = mapConditionPropertiesToRules();
          if (mappedRules && mappedRules.length > 0) {
            // Ensure all categories are properly set - find exact match from categories array
            const rulesWithCategories = mappedRules.map((rule) => {
              if (rule.category) {
                // Always find the exact category object from the categories array to ensure reference match
                const categoryId =
                  typeof rule.category === "string"
                    ? rule.category
                    : rule.category.id;
                const categoryObj = categories.find(
                  (cat) => cat.id === categoryId
                );
                if (categoryObj) {
                  rule.category = categoryObj; // Use exact reference from categories array
                } else if (
                  typeof rule.category === "object" &&
                  rule.category.id
                ) {
                  // Keep the object if it has the right structure
                  rule.category = rule.category;
                }
              }
              return rule;
            });
            setRules(rulesWithCategories);
            hasInitializedDuplicateRules.current = true;
          }
        }, 300); // Small delay to ensure all state updates are complete
        return () => clearTimeout(timer);
      }
    } else if (openModal && !duplicateRule) {
      // Normal add - reset to initial rule immediately (no waiting)
      setRules([initialRule]);
      hasInitializedDuplicateRules.current = false;
    }

    // Reset flag when modal closes
    if (!openModal) {
      hasInitializedDuplicateRules.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    duplicateRule,
    openModal,
    isDataLoading, // Only relevant when duplicateRule is true
    pricingTableConditionProperties,
    categories,
    allMachincesList,
    productsStateValue,
    allProductTypes,
    clientTypesStateValue,
    Outputs,
    parametersStateValue,
    materialsTypes,
    conditions,
  ]);

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
