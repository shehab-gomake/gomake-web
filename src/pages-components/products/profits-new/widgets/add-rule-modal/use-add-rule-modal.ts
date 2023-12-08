import { useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import {
  getAllProductsForDropDownList,
  getAndSetAllParameters,
  getAndSetClientTypes,
  getAndSetMachincesNew,
} from "@/services/hooks";
import {
  clientTypesState,
  machincesState,
  parametersState,
  productsState,
} from "@/store";
import { useOutputs } from "@/widgets/properties/hooks/use-outputs";
import { usePrintHouseClients } from "@/widgets/properties/hooks/use-print-house-clients";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { ETypeException } from "../../enums/profites-enum";

const useAddRuleModal = ({
  typeExceptionSelected,
  selectedPricingBy,
  actionProfitByActionId,
  onCloseModal,
  getProfitsPricingTables,
  selectedPricingTableItems,
}) => {
  const { callApi } = useGomakeAxios();
  const { clients } = usePrintHouseClients();
  const isDefaultException =
    selectedPricingTableItems?.exceptionType === ETypeException.DEFAULT;
  const categories = useMemo(() => {
    return [
      { label: "Machine", id: "Machine" },
      // { label: "Machine category", id: "Machine Category" },
      { label: "Products", id: "Products" },
      { label: "Client type", id: "Client Type" },
      { label: "Client", id: "Client" },
      { label: "Property output", id: "Property output" },
      { label: "Property input", id: "Property input" },
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
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();
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

  const [machincesStateValue, setMachincesState] =
    useRecoilState<any>(machincesState);
  const [productsStateValue, setProductsState] =
    useRecoilState<any>(productsState);
  const [clientTypesStateValue, setClientTypesState] =
    useRecoilState<any>(clientTypesState);
  const [parametersStateValue, setParametersState] =
    useRecoilState<any>(parametersState);

  const getMachincesProfits = useCallback(async () => {
    await getAndSetMachincesNew(callApi, setMachincesState);
  }, []);
  const getProducts = useCallback(async () => {
    await getAllProductsForDropDownList(callApi, setProductsState);
  }, []);
  const getClientTypes = useCallback(async () => {
    await getAndSetClientTypes(callApi, setClientTypesState);
  }, []);
  const getParameters = useCallback(async () => {
    return await getAndSetAllParameters(callApi, setParametersState);
  }, []);
  useEffect(() => {
    getMachincesProfits();
    getProducts();
    getClientTypes();
    getParameters();
  }, []);

  const [exceptionType, setExceptionType] = useState<any>();
  const [additionalProfit, setAdditionalProfit] = useState<any>(0);

  function isRuleEmpty(rule) {
    return Object.values(rule).every((value) => value === "");
  }

  function displayText(conditions) {
    if (conditions.length === 0 || isRuleEmpty(conditions[0])) {
      return "No rule found";
    }
    const textArray = conditions.map((condition) => {
      const categoryLabel = condition?.category
        ? condition?.category?.label
        : "";
      const conditionLabel = condition?.condition
        ? condition?.condition?.label
        : "";
      const statement2Label = condition.statement2
        ? condition.statement2.label
        : "";

      let text = "";

      if (condition.linkCondition) {
        text += ` ${condition?.linkCondition.id} `;
      }

      if (typeof condition?.statement === "object") {
        const statementLabel = condition?.statement?.label;
        text += `${categoryLabel} ${statement2Label} ${conditionLabel} ${statementLabel}`;
      } else {
        const statementLabel = condition?.statement;
        if (statementLabel?.length > 0) {
          text += `${categoryLabel} ${statement2Label} ${conditionLabel} ${statementLabel}`;
        } else {
          text += `${categoryLabel} ${conditionLabel} ${statement2Label}`;
        }
      }

      return text.trim();
    });
    const joinedText = textArray;
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
    expression,
    actionProfitByActionId,
    additionalProfit,
    EStatementCategory,
    rules,
    isDefaultException,
  ]);

  return {
    rules,
    deleteRule,
    handleChange,
    addRule,
    machincesStateValue,
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
  };
};

export { useAddRuleModal };
