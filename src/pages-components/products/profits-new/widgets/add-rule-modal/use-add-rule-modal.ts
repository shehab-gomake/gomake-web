import { useGomakeAxios, useSnackBar } from "@/hooks";
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
import { machineCategoriesState } from "@/store/machine-categories";
import { useMaterials } from "@/widgets/properties/hooks/use-materials";
import { useMaterialsCategories } from "@/widgets/properties/hooks/use-materials-categories";
import { useOutputs } from "@/widgets/properties/hooks/use-outputs";
import { useParameters } from "@/widgets/properties/hooks/use-parameters";
import { usePrintHouseClientTypes } from "@/widgets/properties/hooks/use-print-house-client-types";
import { usePrintHouseClients } from "@/widgets/properties/hooks/use-print-house-clients";
import { usePrintHouseMachines } from "@/widgets/properties/hooks/use-print-house-machines";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

class ActionRule {
  id: string;
  ruleName: string;
  priority: number;
  successEvent: string;
  errorMessage?: string;
  errorType?: string;
  ruleExpressionType?: string;
  expression: string;
  isDeleted: boolean;
  isActive: boolean;
}
const useAddRuleModal = () => {
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const categories = useMemo(() => {
    return [
      { label: "Machine", id: "Machine" },
      { label: "Products", id: "Products" },
      // { label: "Machine category", id: "Machine Category" },
      { label: "Client type", id: "Client Type" },
      // { label: "Client", id: "Client" },
      { label: "Property output", id: "Property output" },
      { label: "Property input", id: "Property input" },
      // { label: "Material", id: "Material" },
      // { label: "Material Category", id: "Material Category" },
    ];
  }, []);

  const [fields, setFields] = useState([
    {
      linkCondition: "",
      category: "",
      firstPart: "",
      condition: "",
      secondPart: "",
    },
  ]);
  const [fieldsStates, setFieldsStates] = useState([
    { firstPart: [], secondPart: [] },
  ]);
  const [firstPartDefultValue, setFirstPartDefultValue] = useState([
    { defultValue: null, isDisabled: false },
  ]);
  const [secondPartTypeState, setSecondPartTypeState] = useState([
    { isInputField: false },
  ]);
  const [value, setValue] = useState<string>("");
  const { machines } = usePrintHouseMachines();
  const { clientTypes } = usePrintHouseClientTypes();
  const { clients } = usePrintHouseClients();
  const { materialsDropdown } = useMaterials();
  const { parameters } = useParameters();
  const { Outputs } = useOutputs();
  const machinesCategories = useRecoilValue(machineCategoriesState);
  const { materialsCategories } = useMaterialsCategories();
  const [expression, setExpression] = useState(
    "Your rules will viewed here . . ."
  );
  // const addRule = useCallback(
  //   async (
  //     actionId: string,
  //     propertyId: string,
  //     ruleType: number,
  //     rule: any
  //   ) => {
  //     const res = await callApi(
  //       "POST",
  //       `/v1/printhouse-config/print-house-action/add-rule/${actionId}/${propertyId}/${ruleType}`,
  //       {
  //         rule,
  //       }
  //     );
  //     if (res?.success) {
  //       alertSuccessAdded();
  //       // getPrintHouseActionById(actionId);
  //     } else {
  //       alertFaultAdded();
  //     }
  //   },
  //   []
  // );
  const handleFormChange = (index, event, fieldNameId, value) => {
    let data = [...fields];
    if (fieldNameId == 1) {
      data[index].linkCondition = value?.id;
    } else if (fieldNameId == 2) {
      data[index].category = value?.id;
      if (
        fields[index].category === "Machine" ||
        fields[index].category === "Machine Category" ||
        fields[index].category === "Client" ||
        fields[index].category === "Client Type" ||
        fields[index].category === "Material" ||
        fields[index].category === "Material Category"
      ) {
        let temp = [...fieldsStates];
        temp[index].firstPart = categories;
        setFieldsStates([...temp]);
        let first = [...firstPartDefultValue];
        first[index].defultValue = value;
        first[index].isDisabled = true;
        data[index].firstPart = value.label;
        setFirstPartDefultValue([...first]);
      } else if (fields[index].category === "Property input") {
        let temp = [...fieldsStates];
        temp[index].firstPart = parameters.map((m) => {
          return {
            label: m.name,
            id: m.id,
          };
        });
        setFieldsStates([...temp]);
        let first = [...firstPartDefultValue];
        first[index].defultValue = null;
        first[index].isDisabled = false;
        setFirstPartDefultValue([...first]);
      } else if (fields[index].category === "Property output") {
        let temp = [...fieldsStates];
        temp[index].firstPart = Outputs?.map((m) => {
          return {
            label: m.name,
            id: m.id,
          };
        });
        setFieldsStates([...temp]);
        let first = [...firstPartDefultValue];
        first[index].defultValue = null;
        first[index].isDisabled = false;
        setFirstPartDefultValue([...first]);
      }
      handleSecondPartValues(index, value);
    } else if (fieldNameId == 3) {
      data[index].firstPart = value?.name;
    } else if (fieldNameId == 4) {
      data[index].condition = value?.id;
    } else if (fieldNameId == 5) {
      data[index].secondPart =
        value?.name == undefined ? value?.label : value?.name;
    }
    setFields(data);
  };

  const handleSecondPartValues = (index, value) => {
    let secondPart = [...secondPartTypeState];
    let fields = [...fieldsStates];
    switch (value?.id) {
      case "Machine":
        secondPart[index].isInputField = false;
        fields[index].secondPart = machines.map((m) => {
          return {
            label: m?.name,
            id: m?.id,
          };
        });

        break;
      case "Machine Category":
        fields[index].secondPart = machinesCategories.map((m) => {
          return {
            label: m?.name,
            id: m?.id,
          };
        });
        secondPart[index].isInputField = false;
        break;
      case "Client":
        fields[index].secondPart = clients.map((m) => {
          return {
            label: m?.name,
            id: m?.id,
          };
        });
        secondPart[index].isInputField = false;
        break;
      case "Client Type":
        fields[index].secondPart = clientTypes.map((m) => {
          return {
            label: m?.name,
            id: m?.id,
          };
        });
        secondPart[index].isInputField = false;
        break;
      case "Material":
        fields[index].secondPart = materialsDropdown;
        secondPart[index].isInputField = false;
        break;
      case "Material Category":
        fields[index].secondPart = materialsCategories;
        secondPart[index].isInputField = false;
        break;
      case "Property output":
        secondPart[index].isInputField = true;
        break;
      case "Property input":
        secondPart[index].isInputField = false;

        break;
    }
    setFieldsStates([...fields]);
    setSecondPartTypeState([...secondPart]);
  };

  const handleNumberField = (index, event, fieldNameId, value) => {
    let data;
    if (fieldNameId == 5) {
      data = [...fields];
      data[index].secondPart = event.target.value.replace(/\D/g, "");
      setFields(data);
    } else if (fieldNameId == 6) {
      data = event.target.value.replace(/\D/g, "");
      setValue(data);
    } else {
      data = [...fields];
      data[index].secondPart = event.target.value;
      setFields(data);
    }
  };

  const addFields = () => {
    let newfield = {
      linkCondition: "",
      category: "",
      firstPart: "",
      condition: "",
      secondPart: "",
    };
    let newFieldState = { firstPart: [], secondPart: [] };
    let newFirstStatementValue = { defultValue: null, isDisabled: false };
    let newSecondPartType = { isInputField: false };
    setFieldsStates([...fieldsStates, newFieldState]);
    setFields([...fields, newfield]);
    setFirstPartDefultValue([...firstPartDefultValue, newFirstStatementValue]);
    setSecondPartTypeState([...secondPartTypeState, newSecondPartType]);
  };
  const removeFields = (index) => {
    let data = [...fields];
    data.splice(index, 1);
    let dynameicFieldState = [...fieldsStates];
    dynameicFieldState.splice(index, 1);
    let firstPartState = [...firstPartDefultValue];
    firstPartState.splice(index, 1);
    let secondPartState = [...secondPartTypeState];
    secondPartState.splice(index, 1);
    if (data.length == 0) {
      data.push({
        linkCondition: "",
        category: "",
        firstPart: "",
        condition: "",
        secondPart: "",
      });
      dynameicFieldState.push({ firstPart: [], secondPart: [] });
      firstPartState.push({ defultValue: null, isDisabled: false });
      secondPartState.push({ isInputField: false });
    }
    setFields(data);
    setFieldsStates(dynameicFieldState);
    setFirstPartDefultValue(firstPartState);
    setSecondPartTypeState(secondPartState);
  };

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

  const create = async () => {
    const textInput = displayText(rules);
    setExpression(textInput);
  };

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
  const [additionalProfit, setAdditionalProfit] = useState<any>();

  function isRuleEmpty(rule) {
    return Object.values(rule).every((value) => value === "");
  }

  function displayText(conditions) {
    if (conditions.length === 0 || isRuleEmpty(conditions[0])) {
      return "No rule found";
    }
    const textArray = conditions.map((condition) => {
      const categoryLabel = condition.category ? condition.category.label : "";
      const conditionLabel = condition.condition
        ? condition.condition.label
        : "";
      const statement2Label = condition.statement2
        ? condition.statement2.label
        : "";

      let text = "";

      if (condition.linkCondition) {
        text += ` ${condition.linkCondition.id} `;
      }

      if (typeof condition?.statement === "object") {
        const statementLabel = condition?.statement.label;
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
  console.log("rules", rules);
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

    categories,
    setFields,
    fields,
    addFields,
    value,
    handleNumberField,
    create,
    expression,
    mainconditions,
    handleFormChange,
    fieldsStates,

    firstPartDefultValue,
    conditions,
    secondPartTypeState,
    removeFields,
  };
};

export { useAddRuleModal };
