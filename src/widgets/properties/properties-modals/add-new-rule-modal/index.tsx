import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useEffect, useMemo, useState } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { AddPlusIcon } from "@/icons";
import { usePrintHouseMachines } from "../../hooks/use-print-house-machines";
import { usePrintHouseClientTypes } from "../../hooks/use-print-house-client-types";
import { usePrintHouseClients } from "../../hooks/use-print-house-clients";
import { useMaterials } from "../../hooks/use-materials";
import { useParameters } from "../../hooks/use-parameters";
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import { useMaterialsCategories } from "../../hooks/use-materials-categories";
import { useOutputs } from "../../hooks/use-outputs";
import { useSnackBar } from "@/hooks";
import { useRule } from "../../hooks/use-rule";
import { DeleteMenuIcon } from "@/widgets/quote/more-circle/icons/delete-menu";

interface IAddNewModalProps {
  openModal: boolean;
  onClose: () => void;
  rules: [];
}

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

const AddNewRuleModal = ({ openModal, onClose }) => {
  const { primaryColor } = useGomakeTheme();
  const categories = useMemo(() => {
    return [
      { label: "Machine", id: "Machine" },
      { label: "Machine category", id: "Machine Category" },
      { label: "Client type", id: "Client Type" },
      { label: "Client", id: "Client" },
      { label: "Property output", id: "Property output" },
      { label: "Property input", id: "Property input" },
      { label: "Material", id: "Material" },
      { label: "Material Category", id: "Material Category" },
    ];
  }, []);
  const { addRule } = useRule();
  const { t } = useTranslation();
  const { clasess } = useStyle();
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
  const [isOpen, setIsOpen] = useState<boolean>(openModal);
  const [value, setValue] = useState<string>("");
  const { machines } = usePrintHouseMachines();
  const { clientTypes } = usePrintHouseClientTypes();
  const { clients } = usePrintHouseClients();
  const { materials, materialsDropdown } = useMaterials();
  const { parameters } = useParameters();
  const { Outputs } = useOutputs();
  const machinesCategories = useRecoilValue(machineCategoriesState);
  const { materialsCategories } = useMaterialsCategories();
  const [expression, setExpression] = useState(
    "Your rules will viewed here . . ."
  );
  const { setSnackbarStateValue } = useSnackBar();

  useEffect(() => {
    setIsOpen(openModal);
    let val = "";
    setExpression(val);
  }, [openModal]);
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
        temp[index].firstPart = Outputs.map((m) => {
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

  const boolState = useMemo(() => {
    return [
      { label: "Yes", id: true },
      { label: "No", id: false },
    ];
  }, []);

  const create = async () => {
    var values = validateForm();
    if (values?.length != 0) {
      let ruleName = "";
      let val = "(";
      values?.map((m, index) => {
        val +=
          " " +
          m.linkCondition +
          " " +
          m.firstPart +
          " " +
          m.condition +
          " " +
          m.secondPart +
          " ";
        ruleName = m.category;
      });
      val += ")";
      let obj = new ActionRule();
      obj.priority = 1;
      obj.expression = val;
      obj.successEvent = value;
      obj.ruleName = ruleName;
      obj.isActive = true;
      obj.isDeleted = false;
      obj.ruleExpressionType = "LambdaExpression";
      obj.errorMessage = "One or more adjust rules failed";
      obj.errorType = "LambdaExpression";
      try {
        // await addRule(actionId, propertyId, ruleType, obj);
      } catch (error) { }
      setExpression(val);
    } else {
      let val = "";
      setExpression(val);
    }
  };

  const validateForm = (): any => {
    let values = [];
    fields.map((m, index) => {
      if (
        m.firstPart != "" &&
        m.condition != "" &&
        m.secondPart != "" &&
        ((m.linkCondition == "" && index == 0) ||
          (m.linkCondition != "" && index != 0)) &&
        value != ""
      ) {
        values.push(m);
      }
    });
    if (values?.length == 0) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.formNotValid"),
        type: "error",
      });
    }
    return values;
  };
  return (
    <>
      <GoMakeModal
        openModal={isOpen}
        modalTitle={t("properties.addNewRule")}
        onClose={() => {
          onClose(),
            setFields([
              {
                linkCondition: "",
                category: "",
                firstPart: "",
                condition: "",
                secondPart: "",
              },
            ]);
        }}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <form>
            {fields.map((field, index) => {
              return (
                <div key={index}>
                  {index != 0 && (
                    <div
                      style={{
                        display: "block",
                        marginTop: 30,
                        marginBottom: 30,
                      }}
                    >
                      <label style={clasess.inputLable}>
                        {t("properties.condtionBetween")}
                      </label>
                      <GoMakeAutoComplate
                        options={mainconditions}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.condtion")}
                        value={field.linkCondition}
                        onChange={(event, value) => {
                          handleFormChange(index, event, 1, value);
                        }}
                      />
                    </div>
                  )}

                  <div style={clasess.inputsContainer}>
                    <div style={{ marginTop: "2%", fontSize: 16 }}> if</div>
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.category")}
                      </label>
                      <GoMakeAutoComplate
                        options={categories}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.category")}
                        value={field.category}
                        onChange={(event, value) => {
                          handleFormChange(index, event, 2, value);
                        }}
                      />
                    </div>
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>
                      <GoMakeAutoComplate
                        options={fieldsStates[index].firstPart}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        defaultValue={firstPartDefultValue[index].defultValue}
                        disabled={firstPartDefultValue[index].isDisabled}
                        onChange={(event, value) => {
                          handleFormChange(index, event, 3, value);
                        }}
                      />
                    </div>
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.condtion")}
                      </label>
                      <GoMakeAutoComplate
                        options={conditions}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.condtion")}
                        value={field.condition}
                        onChange={(event, value) => {
                          handleFormChange(index, event, 4, value);
                        }}
                      />
                    </div>
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>

                      {secondPartTypeState[index].isInputField && (
                        <GomakeTextInput
                          style={clasess.textInputStyle}
                          placeholder={t("properties.statment")}
                          value={field.secondPart}
                          onChange={(event, value) => {
                            handleNumberField(index, event, 5, value);
                          }}
                        />
                      )}
                      {!secondPartTypeState[index].isInputField && (
                        <GoMakeAutoComplate
                          options={fieldsStates[index].secondPart}
                          style={clasess.dropDownListContainer}
                          placeholder={t("properties.statment")}
                          value={field.secondPart}
                          onChange={(event, value) => {
                            handleFormChange(index, event, 5, value);
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={removeFields}
                    >
                      <DeleteMenuIcon />
                    </div>
                  </div>
                </div>
              );
            })}
          </form>
        </div>
        <div style={clasess.AddNewRuleDiv}>
          <AddPlusIcon />{" "}
          <span onClick={addFields} style={clasess.spanAddNewRule}>
            {t("properties.addNewRule")}
          </span>
        </div>
        <div style={clasess.valueContainer}>
          <label style={clasess.inputLable}>value</label>
          <GomakeTextInput
            style={clasess.textInputStyle}
            placeholder="value"
            value={value}
            onChange={(event, value) => {
              handleNumberField(0, event, 6, value);
            }}
          />
        </div>
        <div style={clasess.btnContainer}>
          <GomakePrimaryButton
            style={clasess.sendBtn}
            onClick={() => {
              create();
            }}
          >
            {t("properties.create")}
          </GomakePrimaryButton>
        </div>
        <div>
          <div>
            <label
              style={{
                ...FONT_FAMILY.Lexend(500, 12),
                color: primaryColor(500),
                fontSize: 16,
                marginBottom: 10,
              }}
            >
              Terminal
            </label>
            <textarea
              disabled={true}
              style={clasess.textarea}
              placeholder="Your rules will viewed here . . ."
              value={expression}
            />
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewRuleModal };
