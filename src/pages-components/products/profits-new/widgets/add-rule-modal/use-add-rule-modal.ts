import { useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import {
  getAllProductsForDropDownList,
  getAndSetAllParameters,
  getAndSetClientTypes,
  getAndSetMachincesByActionId,
} from "@/services/hooks";
import { clientTypesState, parametersState, productsState } from "@/store";
import { useOutputs } from "@/widgets/properties/hooks/use-outputs";
import { usePrintHouseClients } from "@/widgets/properties/hooks/use-print-house-clients";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { ETypeException } from "../../enums/profites-enum";
import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { usePrintHouseMachines } from "@/widgets/properties/hooks/use-print-house-machines";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { useTranslation } from "react-i18next";

const useAddRuleModal = ({
  typeExceptionSelected,
  selectedPricingBy,
  actionProfitByActionId,
  onCloseModal,
  getProfitsPricingTables,
  selectedPricingTableItems,
  selectedProperties,
  getProperitesService,
}) => {
  const GET_MATERIALS_TYPES_URL = "/v1/materials/getMaterialsTypes";
  const { callApi } = useGomakeAxios();
  const {t} = useTranslation();
  const { clients } = usePrintHouseClients();
  const [propertieValue, setPropertieValue] = useState<any>();
  const isDefaultException =
    selectedPricingTableItems?.exceptionType === ETypeException.DEFAULT;
  const categories = useMemo(() => {
    return [
      { label: "Machine", id: "Machine" },
      { label: "Products", id: "Products" },
      { label: "Client type", id: "Client Type" },
      { label: "Client", id: "Client" },
      { label: "Property output", id: "Property output" },
      { label: "Property input", id: "Property input" },
      // { label: "Machine category", id: "Machine Category" },
      // { label: "Material", id: "Material" },
      // { label: "Material Category", id: "Material Category" },
    ];
  }, []);
  const EStatementCategory = {
    Machine: 1,
    "Machine Category": 2,
    "Client Type": 3,
    Client: 4,
    "Property input": 5,
    "Property output": 6,
    Products: 7,
  };
  const { Outputs } = useOutputs();
  const { machines } = usePrintHouseMachines();
  const [materialsTypes, setMaterialsTypes] = useState<
    { materialTypeKey: string; materialTypeName: string }[]
  >([]);
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

  const getMachincesByActionId = useCallback(async () => {
    if (router.query.actionId) {
      await getAndSetMachincesByActionId(callApi, setMachincesList, {
        actionId: router.query.actionId,
      });
    } else {
      setAllMachincesList(machines);
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
    return `if (${joinedText})`;
  }

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
      // setSnackbarStateValue({
      //   state: true,
      //   message: "Please fill out all fields",
      //   type: "error",
      // });
      return;
    }
  const isValidRules = rules.every((rule) => {
    const hasCategory = rule.category && rule.category.id;
    const hasCondition = rule.condition && rule.condition.id;
    const hasStatement2 = rule.statement2 && rule.statement2.id;

    if (!hasCategory || !hasCondition || !hasStatement2) {
      setSnackbarStateValue({
        state: true,
        message: "Please fill out all fields",
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
              typeof item?.statement === "object"
                ? item?.statement?.id
                : item.statement,
            statementValue: item?.statement2?.id,
            operator: item?.condition?.id,
            conditionBetweenStatements: item.linkCondition
              ? item.linkCondition.id
              : "",
            statementCategory: EStatementCategory[item.category.id],
          };
        }),
        successEvent: propertieValue,
        expression: expression,
      }
    );

    if (res?.success) {
      alertSuccessAdded();
      getProperitesService();
      onCloseModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: "this rule is already added",
        type: "error",
      });
    }
  }, [router, expression, selectedProperties, propertieValue, rules]);

  return {
    rules,
    deleteRule,
    handleChange,
    addRule,
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
    machines
  };
};

export { useAddRuleModal };
