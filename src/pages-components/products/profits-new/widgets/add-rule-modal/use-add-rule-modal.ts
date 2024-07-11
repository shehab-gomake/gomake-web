import { useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import {
  getAllProductsForDropDownList,
  getAndSetAllCustomers,
  getAndSetAllParameters,
  getAndSetClientTypes,
  getAndSetMachincesByActionId,
} from "@/services/hooks";
import { clientTypesState, parametersState, productsState } from "@/store";
import { useOutputs } from "@/widgets/properties/hooks/use-outputs";
import { usePrintHouseClients } from "@/widgets/properties/hooks/use-print-house-clients";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ETypeException } from "../../enums/profites-enum";
import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { usePrintHouseMachines } from "@/widgets/properties/hooks/use-print-house-machines";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { useTranslation } from "react-i18next";
import { EGroupByEnum } from "@/enums";
import { agentsCategoriesState } from "@/pages/customers/customer-states";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { getALLMachinesApi } from "@/services/api-service/machines/print-house-machines-colors";
import { machineCategoriesState } from "@/store/machine-categories";

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
  filterData
}) => {
  const GET_MATERIALS_TYPES_URL = "/v1/materials/getMaterialsTypes";
  const { callApi } = useGomakeAxios();
  const {t} = useTranslation();
  const { clients } = usePrintHouseClients();
  const [openScheduleModal,setOpenScheduleModal]=useState(false)
  const categoriesList = useRecoilValue(machineCategoriesState);
  const onCloseScheduleModal =()=>{
    setOpenScheduleModal(false)
  }
  const onOpenScheduleModal =()=>{
    setOpenScheduleModal(true)
  }
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [customersListCreateOrder, setCustomersListCreateOrder] = useState([]);
  const [canOrder, setCanOrder] = useState(false);

  const renderOptions = () => {
    if (!!canOrder) {
      return customersListCreateOrder;
    } else return customersListCreateQuote;
  };

  const getAllCustomersCreateQuote = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      ClientType: "C",
      onlyCreateOrderClients: false,
    });
  }, []);

  const checkWhatRenderArray = (e) => {
    if (e.target.value) {
      setCanOrder(true);
    } else {
      setCanOrder(false);
    }
  };
  const getAllCustomersCreateOrder = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateOrder, {
      ClientType: "C",
      onlyCreateOrderClients: true,
    });
  }, []);

  useEffect(() => {
    getAllCustomersCreateQuote();
    getAllCustomersCreateOrder();
  }, []);

  const [propertieValue, setPropertieValue] = useState<any>();
  const isDefaultException = selectedPricingTableItems?.exceptionType === ETypeException.DEFAULT;
  
  const categories = useMemo(() => {
    const filteredCategories = [
      { label: "Machine", id: "Machine" },
      { label: "Machine category", id: "Machine category" },
      { label: "Products", id: "Products" },
      { label: "Client type", id: "Client Type" },
      { label: "Client", id: "Client" },
      { label: "Property output", id: "Property output" },
      { label: "Property input", id: "Property input" },
      { label: "Agent", id: "Agent" },
      { label: "Employee", id: "Employee" },
    ];
    return isQuoteWidge ? filteredCategories : filteredCategories.filter(category => category.id !== "Agent");
  }, [isQuoteWidge]);
  const EStatementCategory = {
    Machine: 1,
    "Machine category":2,
    "Client Type": 3,
    Client: 4,
    "Property input": 5,
    "Property output": 6,
    Products: 7,
    Agent:8,
    Employee:9
   
  };
  const { Outputs } = useOutputs();
  const { machines } = usePrintHouseMachines();
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

  useEffect(()=>{
    getAgentCategories()
  },[])

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
  const conditions = useMemo(() => {
    return [
      { label: "==", id: "==" },
      { label: ">", id: ">" },
      { label: ">=", id: ">=" },
      { label: "<", id: "<" },
      { label: "<=", id: "<=" },
      { label: "!=", id: "!=" },
    ];
  }, []);
  const mainconditions = useMemo(() => {
    return [
      { label: "AND", id: "&&" },
      { label: "OR", id: "||" },
    ];
  }, []);
  const BooleanRender = useMemo(() => {
    return [
      { label: "Yes", id: true },
      { label: "No", id: false },
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
  const { alertSuccessAdded, alertFaultAdded,setSnackbarStateValue } = useSnackBar();
  const router = useRouter();

  const initialRule = {
    linkCondition: "",
    category: "",
    statement: "",
    condition: "",
    statement2: "",
  };
  const [rules, setRules] = useState<any>([initialRule]);

  useEffect(() => {console.log(rules)}, [rules])
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

    const getMachinesList = async () => {
      const callBack = (res) => {
          if (res.success) {
            setAllMachincesList(res.data)
          }
      }
      await getALLMachinesApi(callApi,callBack ).then();

  }
  const getMachincesByActionId = useCallback(async () => {
    if (router.query.actionId) {
      await getAndSetMachincesByActionId(callApi, setMachincesList, {
        actionId: router.query.actionId,
      });
      getMachinesList()
    } else {
      getMachinesList()
    }
  }, [router, machines]);
  const getProducts = useCallback(async () => {
    await getAllProductsForDropDownList(callApi, setProductsState);
  }, []);
  const getClientTypes = useCallback(async () => {
    await getAndSetClientTypes(callApi, setClientTypesState , {cardType : CLIENT_TYPE_Id.CUSTOMER});
  }, []);
  const getParameters = useCallback(async () => {
    return await getAndSetAllParameters(callApi, setParametersState);
  }, []);
  useEffect(() => {
    getProducts();
    getClientTypes();
    getParameters();
    getAllMaterials();
  }, []);
  useEffect(() => {
    getMachincesByActionId();
    // getMachinesList()
  }, [router, machines]);

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
        ? (condition.category.id !== "Property output" && condition.category.id !== "Property input" ? condition.category.label : "")
        : "";
      const conditionLabel = condition?.condition?.label ?? "";
      const statement2Label = condition.statement2?.label ?? "";
  
      let text = "";
  
      if (condition.linkCondition) {
        text += ` ${condition?.linkCondition.id} `;
      }
      
      if (typeof condition?.statement === "object") {
        const statementLabel = condition?.statement?.label ?? "";
        text += `${categoryLabel} ${conditionLabel} ${statement2Label} ${statementLabel}`;
      } else {
        const statementLabel = condition?.statement ?? "";
        if (statementLabel.length > 0) {
          text += `${categoryLabel} ${statement2Label} ${conditionLabel} ${statementLabel}`;
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
    })
  }, [rules])

  useEffect(() => {
    const textInput = displayText(rules);
    setExpression(textInput);
  }, [rules]);
  const create = useCallback(async () => {
    const requestBody: any = {
      actionId: router?.query?.actionId,
      actionProfitId: actionProfitByActionId?.id,
      exceptionType: typeExceptionSelected,
      additionalProfit: additionalProfit,
      pricingBy: selectedPricingBy?.value,
      exceptionRule: expression,
      exceptionConditionProperties: rules.map((item) => {   
        return {
          statementId:
            typeof item?.statement === "object"
              ? item?.statement?.id
              : item.statement,
          statementValue: item.statement2.id,
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
      setRules([initialRule])
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
        message:t("properties.fillAllFields"),
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
          return {
            statementId:
            item.category.id === "Property output" || item.category.id === "Property input"
                ? item.statement2.id
                : typeof item?.statement === "object"
                ? item?.statement?.id
                : item.statement,
            statementValue:
              item.category.id === "Property output" || item.category.id === "Property input"
                ? typeof item?.statement === "object"
                  ? item?.statement?.id
                  : item.statement
                : item.statement2.id,
            operator: item.condition.id,
            conditionBetweenStatements: item.linkCondition
              ? item.linkCondition.id
              : "",
            statementCategory: EStatementCategory[item.category.id],
          }
          // return {
          //   statementId:
          //     typeof item?.statement === "object"
          //       ? item?.statement?.id
          //       : item.statement,
          //   statementValue: item?.statement2?.id,
          //   operator: item?.condition?.id,
          //   conditionBetweenStatements: item.linkCondition
          //     ? item.linkCondition.id
          //     : "",
          //   statementCategory: EStatementCategory[item.category.id],
          // };
        }),
        successEvent: propertieValue,
        expression: expression,
      }
    );

    if (res?.success) {
      alertSuccessAdded();
      getProperitesService();
      onCloseModal();
      setRules([initialRule])
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("properties.ruleAlreadyAdded"),
        type: "error",
      });
    }
  }, [router, expression, selectedProperties, propertieValue, rules]);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };
  const createForQuoteWidget = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/documents/generate-document-report`,
      {
        filterDTO:{
          statusId: filterData?.statusId,
          closeStatus: filterData?.closeStatus,
          productionStatus: filterData?.productionStatus,
          patternSearch: filterData?.patternSearch,
          customerId: filterData?.customerId,
          dateRange:filterData?.dateRange,
          agentId: filterData?.agentId,
          minPrice: filterData?.minPrice,
          maxPrice: filterData?.maxPrice,
          productList: filterData?.productList,
          fromDate,
          toDate
        },
        groupBy: propertieValue,
        exceptionConditionProperties: rules.map((item) => {
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
        }),
      },
      true,
      null,
      "blob"
    );
    try{
      const downloadLink = document.createElement('a');
      const link = URL?.createObjectURL(res.data);
      downloadLink.href = link
      downloadLink.download = 'Reports Rule engine.xlsx';
      downloadLink.click();
      if (res?.success) {
        onCloseModal();
        setRules([initialRule])
      } else {
        alertFaultAdded();
      }
    }
    catch{
      alertFaultAdded();
    }
  }, [propertieValue, EStatementCategory, rules,filterData]);
  const [employeeList,setEmployeeList]=useState([])
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
  useEffect(()=>{
    getEmployeeCategories()
  },[])
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
    clients,
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
    machines,
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
    employeeList
  };
};

export { useAddRuleModal };
