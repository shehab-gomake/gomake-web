import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RemoveSecondaryBtn } from "@/components/button/remove-secondary-btn";
import {
  IFormArrayInputsProps,
  IInput,
} from "@/components/form-inputs/interfaces";
import { SecondaryButton } from "@/components/button/secondary-button";
import { FormInput } from "@/components/form-inputs/form-input";
import { TransitionGroup } from "react-transition-group";
import { Collapse } from "@mui/material";
import { useSnackBar } from "@/hooks";
import { useStyle } from "./style";
import { PrimaryButton } from "@/components/button/primary-button";
import { GomakePrimaryButton } from "@/components";
import { EFileDeliveryMode } from "./enums";

const HotfolderArrayInput = ({
  name,
  inputs,
  updateState,
  parameterKey,
  value,
  isValid,
  newValue,
  disableUpdateValues,
  disabled,
  disableAddValue,
  containerStyle,
}: IFormArrayInputsProps) => {
  const { alertFault } = useSnackBar();
  const [state, setState] = useState<Record<string, any>>({
    hotFolderName: "",
    remoteName: "",
    fileType: [], // Initialize as array for multi-select
    fileDeliveryMode: EFileDeliveryMode.ALWAYS_SEND.toString(), // Default value (Always Send)
    folderPath: "",
    fileInternalStructure: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>();
  const { t } = useTranslation();
  const { classes } = useStyle();

  const addParameter = () => {
    let canAdd: boolean = true;
    const requiredErrors: Record<string, boolean> = {};
    inputs.forEach((input) => {
      if (input.required) {
        if (!state[input.parameterKey]) {
          requiredErrors[input.parameterKey] = true;
          canAdd = false;
        }
      }
      if (!!input.regex) {
        if (!input.regex.test(state[input.parameterKey])) {
          canAdd = false;
        }
      }
    });
    setErrors(requiredErrors);
    if (canAdd) {
      updateState(parameterKey, [...value, state]);
      // Reset state properly for hotfolder inputs
      setState({
        hotFolderName: "",
        remoteName: "",
        fileType: [],
        fileDeliveryMode: EFileDeliveryMode.ALWAYS_SEND.toString(),
        folderPath: "",
        fileInternalStructure: "",
        username: "",
        password: "",
      });
    } else {
      alertFault(t("fileApiSettings.pleaseFillRequiredFields"));
    }
  };

  const handleInputChanges1 = (key: string, value: string) => {
    setErrors({ ...errors, [key]: false });
    setState({ ...state, [key]: value });
    if (!!newValue) {
      newValue(key, value);
    }
  };

  const handleValuesChange = (key: string, newValue: any, index: number) => {
    const values = [...value];
    values[index] = { ...values[index], [key]: newValue };
    updateState(parameterKey, values);
  };

  const handleRemoveRow = (index: number) => {
    const newArray: any[] = [...value];
    newArray.splice(index, 1);
    updateState(parameterKey, newArray);
  };

  return (
    !disabled && (
      <div style={{ ...classes.container, ...containerStyle }}>
        {name && (
          <h3 style={{ ...classes.multiInputLabel, margin: "0 0 16px 0" }}>
            {t(name)}
          </h3>
        )}
        {!disableAddValue && (
          <div style={classes.inputsRow}>
            {inputs.map((input: IInput, index: number) => {
              input.value = state[input.parameterKey]
                ? state[input.parameterKey]
                : "";
              return (
                <FormInput
                  key={input.parameterKey + index}
                  input={input}
                  error={
                    !!input.value && !!input.regex
                      ? !input.regex.test(input.value)
                      : !!(errors && errors[input.parameterKey]) || !isValid
                  }
                  changeState={handleInputChanges1}
                />
              );
            })}
            <div style={classes.addColor}>
              <GomakePrimaryButton
                variant={"contained"}
                onClick={addParameter}
                style={classes.button}
              >
                {t("fileApiSettings.addNewHotfolder")}
              </GomakePrimaryButton>
            </div>
          </div>
        )}
        <TransitionGroup>
          {value?.map((v: Record<string, string>, index: number) => {
            return (
              <Collapse key={index}>
                <div style={classes.hotfolderItemContainer}>
                  <h4 style={classes.hotfolderLabel}>
                    {t("fileApiSettings.hotfolder")} {index + 1}:
                  </h4>
                  <div key={"row" + index} style={classes.hotfolderInputsRow}>
                    {inputs.map((input) => (
                      <FormInput
                        key={index}
                        readonly={disableUpdateValues}
                        input={{
                          ...input,
                          value: input.secondValue
                            ? v[input.secondValue]
                            : v[input.parameterKey],
                          disabled: false,
                          type: disableUpdateValues ? "text" : input.type,
                        }}
                        error={false}
                        changeState={(key, value) => {
                          handleValuesChange(key, value, index);
                        }}
                      />
                    ))}
                    <RemoveSecondaryBtn
                      onClick={() => handleRemoveRow(index)}
                    />
                  </div>
                </div>
              </Collapse>
            );
          })}
        </TransitionGroup>
      </div>
    )
  );
};

export { HotfolderArrayInput };
