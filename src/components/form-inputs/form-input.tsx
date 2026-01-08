import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useStyle } from "@/components/form-inputs/style";
import { IFormInput } from "@/components/form-inputs/interfaces";
import {
  GoMakeAutoComplate,
  GomakeTextInput,
  SecondSwitch,
  PrimarySwitch,
  GoMakeMultiSelect,
  InfoTooltip,
} from "@/components";
import { MuiColorInput } from "mui-color-input";
import { ImageUploadComponent } from "./image-input";
import Stack from "@mui/material/Stack";
import { Checkbox, Paper } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { PhoneInputComponent } from "./phone-input";
import { useRecoilValue } from "recoil";
import {
  materialsClientsState,
  materialsMachinesState,
  materialsParametersState,
} from "@/widgets/materials-widget/state";
import { productsForDropDownList, userState } from "@/store";
import { GoMakeImageFiled } from "../image-filed/image-filed";
import { useInputUnit } from "@/components/form-inputs/use-input-units";
import { UNIT_TYPE } from "@/enums";
import { convertTitleUnits } from "@/utils/helpers";

const FormInput = ({
  input,
  error,
  changeState,
  readonly,
  checkWhatRenderArray,
  loading,
  keyItem,
  hideLabel = false,
  customStyles,
}: IFormInput) => {
  const [options, setOptions] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState<string>(input.value);
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [color, setColor] = useState<string>(input.value);
  const [selectedNameFile, setSelectedNameFile] = useState<string>(input.value);
  const [values, setValues] = useState([]);
  const machinesCategories = useRecoilValue<any>(materialsMachinesState);
  const clientsCategories = useRecoilValue<any>(materialsClientsState);
  const parametersCategories = useRecoilValue<any>(materialsParametersState);
  const productValue = useRecoilValue(productsForDropDownList);
  const [optionsUrl, setOptionsUrl] = useState<string>("");
  const { translateUnit, restoreUnitValue, convertUnitValue, units } =
    useInputUnit();
  const machinesCategoriesList = machinesCategories.map((machine) => ({
    ...machine,
    value: machine.id,
    label: `${machine.manufacturer} - ${machine.model}`,
  }));
  const clientsOptions = clientsCategories.map((client) => ({
    ...client,
    value: client.id,
    label: client.isInfo ? client.name : `${client.name} - ${client.code}`,
    isInfo: client.isInfo,
  }));
  const parameterOptions = parametersCategories.map((parameter) => ({
    ...parameter,
    value: parameter.id,
    label: parameter.name,
  }));
  const productsOption = productValue?.map((product) => ({
    ...product,
    value: product.id,
    label: `${product.name}`,
  }));
  const [switchValue, setSwitchValue] = useState<any>(input?.value);
  const [inputValue, setInputValue] = useState<string>("");
  const handleChange = (value: string) => {
    setColor(value);
    changeState(input.parameterKey, value);
  };

  const onChangeState = (e: ChangeEvent<HTMLInputElement>) => {
    //const value = translateUnit && input.unit ? restoreUnitValue(input.unit, parseFloat(e.target.value)) : e.target.value;
    //changeState(input.parameterKey, translateUnit && input.unit && e.target.value.endsWith('.') ? value + '.' : value);
    changeState(input.parameterKey, e.target.value as string);
  };

  const onChangePhoneNumber = (phone: string) => {
    changeState(input.parameterKey, phone as string);
  };

  const selectChange = async (event: SyntheticEvent, value): Promise<void> => {
    // Handle "Add new value" option for storageLocation
    if (value?.value === "new" && input.parameterKey === "storageLocation") {
      const newOption = {
        label: inputValue,
        value: inputValue,
      };
      // Add to options list
      setOptions((prevOptions) => [...prevOptions, newOption]);
      // Update the form state with the new value
      changeState(input.parameterKey, inputValue);
      setSelectedLabel(inputValue);
      setInputValue("");
      return;
    }

    setSelectedLabel(value?.label ? value.label : "");
    const newValue =
      value?.value !== undefined && value?.value !== null ? value.value : "";
    changeState(input.parameterKey, newValue);
  };

  const handleSwitchCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setSwitchValue(event.target.checked);
    changeState(input.parameterKey, event.target.checked);
  };

  const handleSelectCheck = (
    parameterKey: string,
    isChecked: boolean,
    option: any
  ) => {
    // changeState(
    //   parameterKey,
    //   isChecked
    //     ? [...values, option?.value]
    //     : values.filter((v) => v !== option?.value)
    // );
    changeState(
      parameterKey,
      isChecked
        ? [...values, option?.value]
        : values.filter((v) => v !== option?.value)
    );
    isChecked
      ? setValues([...values, option?.value])
      : setValues(values.filter((v) => v !== option?.value));
  };

  useEffect(() => {
    // For storageLocation, the value is a label (or array of labels), not the option value
    if (input.parameterKey === "storageLocation") {
      const labelToFind = Array.isArray(input.value)
        ? input.value[0]
        : input.value;

      const selectedValue = options?.find(
        (option) => option.label === labelToFind
      );

      if (selectedValue !== undefined && selectedValue !== null) {
        setSelectedLabel(selectedValue.label);
      } else if (labelToFind) {
        // If not found in options, it might be a custom value - show it anyway
        setSelectedLabel(labelToFind);
      } else {
        setSelectedLabel("");
      }
    } else {
      // Normal behavior for other fields
      const selectedValue = options?.find(
        (option) => option.value === input.value
      );
      if (selectedValue !== undefined && selectedValue !== null) {
        setSelectedLabel(selectedValue.label);
      } else {
        setSelectedLabel("");
      }
    }
  }, [options, input.value, input.parameterKey]);

  useEffect(() => {
    if (input.optionsUrl) {
      setOptionsUrl(input.optionsUrl);
    } else if (input.options && input.options.length > 0) {
      setOptions(
        input.options.map((option: any) => ({
          label: option.text,
          value: option.value,
          isInfo: option.isInfo,
        }))
      );
    } else if (
      input.options?.length === 0 &&
      input.parameterKey === "machines"
    ) {
      setOptions(machinesCategoriesList);
    } else if (
      input.options?.length === 0 &&
      input.parameterKey === "clients"
    ) {
      setOptions(clientsOptions);
    } else if (
      input.options?.length === 0 &&
      input.parameterKey === "notebookTypes"
    ) {
      setOptions(parameterOptions);
    } else if (
      input.options?.length === 0 &&
      input.parameterKey === "printed product"
    ) {
      setOptions(productsOption);
    }
    if (input.type === "color") {
      setColor(input.value);
    }
    if (input.type === "imageFile" || input.type === "image") {
      setSelectedNameFile(input.value);
    }
    if (input.type === "switch") {
      setSwitchValue(input.value);
    }
    // setValues((!!input?.values ? input?.values : []) || (!!input?.defaultInDocsTypes ? input?.defaultInDocsTypes : []));
    if (input?.multiple) {
    }
  }, [input.options, input.optionsUrl]);

  useEffect(() => {
    setValues(Array.isArray(input.value) ? input.value : []);
  }, [input.value]);

  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (
      typeof input?.value === "string" &&
      input.parameterKey !== "directions"
    ) {
      const selectedValues = input.value.split(",").map((val) => val.trim());
      const selected = options.filter((option) =>
        selectedValues.includes(option?.value?.toString())
      );
      setSelectedOptions(selected);
    }
  }, [input.value, options]);

  useEffect(() => {
    if (Array.isArray(input?.value)) {
      const selected = options.filter((option) =>
        input.value.includes(option.value)
      );
      setSelectedOptions(selected);
    }
  }, [input.value, options]);

  useEffect(() => {
    if (!!optionsUrl) {
      callApi("GET", optionsUrl).then((res) => {
        if (res?.success) {
          setOptions(
            res?.data?.data?.data?.map(({ value, text }) => ({
              label: text,
              value,
            }))
          );
        }
      });
    }
  }, [optionsUrl]);
  const user = useRecoilValue<any>(userState);
  const unitType = user?.printHouseProfile?.unitType || 0;
  const convertedUnit =
    unitType === UNIT_TYPE.IMPERIAL
      ? convertTitleUnits(input.unit)
      : input.unit;

  return (
    <div style={customStyles?.container}>
      {!input.disabled && (
        <div
          style={
            input.direction == "row"
              ? classes.inputContainerRow
              : classes.inputContainer
          }
          key={input.parameterKey}
        >
          {!hideLabel && (
            <div style={classes.inputLbl}>
              <Stack
                direction={"row"}
                gap={"7px"}
                alignItems={"center"}
                padding={"0 5px"}
              >
                <span>{t(input.label)}</span>

                {input.unit && !input.isPriceObject ? (
                  <small>{`${t(`measurementUnits.${convertedUnit}`)}`}</small>
                ) : (
                  <small>{input.unit}</small>
                )}

                {input.iconElement && <span>{input.iconElement}</span>}

                {input.note && <InfoTooltip content={input.note} />}
              </Stack>

              {input.required && <span style={classes.required}>*</span>}
            </div>
          )}

          <div style={classes.inputs}>
            {input.type === "imageFile" ? (
              <GoMakeImageFiled
                selectedNameFile={selectedNameFile}
                onChange={(value) => changeState(input.parameterKey, value)}
              />
            ) : input.parameterKey === "machines" &&
              (input.type === "select" || input?.type === "products_list") ? (
              <GoMakeMultiSelect
                options={
                  input.multiple
                    ? [
                        {
                          label: t("navigationButtons.all") || "all",
                          value: "all",
                        },
                        ...options,
                      ]
                    : options
                }
                value={(() => {
                  const currentValue = Array.isArray(input.value)
                    ? input.value
                    : input.value
                    ? [input.value]
                    : [];
                  // If all non-info options are selected, include "all" in the value
                  if (
                    input.multiple &&
                    currentValue.length ===
                      options.filter((o: any) => !o.isInfo).length &&
                    options.length > 0
                  ) {
                    return ["all", ...currentValue];
                  }
                  return currentValue;
                })()}
                onChange={(values: string[]) => {
                  if (input.multiple) {
                    // Handle "all" option
                    if (values.includes("all")) {
                      const previousValues = Array.isArray(input.value)
                        ? input.value
                        : [];
                      const wasAllSelected =
                        previousValues.length ===
                        options.filter((o: any) => !o.isInfo).length;

                      if (!wasAllSelected) {
                        // Select all
                        const allValues = options
                          .filter((o: any) => !o.isInfo)
                          .map((o: any) => o.value);
                        changeState(input.parameterKey, allValues);
                        setValues(allValues);
                      } else {
                        // Deselect all
                        changeState(input.parameterKey, []);
                        setValues([]);
                      }
                    } else {
                      // Regular multi-select without "all"
                      changeState(input.parameterKey, values);
                      setValues(values);
                    }
                  } else {
                    changeState(input.parameterKey, values[0] || "");
                  }
                }}
                placeholder={t(input.placeholder)}
                isDisabled={!!readonly}
                isLoading={loading}
                isClearable={!input?.disableClearable}
                isSearchable={true}
                closeMenuOnSelect={!input.multiple}
                hideSelectedOptions={false}
                minWidth={180}
                maxHeight={38}
              />
            ) : input.type === "select" || input?.type === "products_list" ? (
              <GoMakeAutoComplate
                key={
                  keyItem
                    ? keyItem
                    : `${input.value}-${selectedLabel}-${selectedOptions}`
                }
                style={
                  customStyles?.select || {
                    minWidth: 180,
                    border: 0,
                    height: 40,
                    overflow: "scroll",
                  }
                }
                onChange={
                  input.multiple
                    ? (event: any, newValue: any) => {
                        // Handle multi-select changes including chip deletions
                        setSelectedOptions(newValue || []);
                        // Convert objects back to value strings for the form state
                        const valueStrings = (newValue || []).map(
                          (item: any) => item.value
                        );

                        changeState(input.parameterKey, valueStrings);
                      }
                    : input.parameterKey === "storageLocation"
                    ? (event: any, newValue: any) => {
                        const valueStrings = Array.isArray(newValue)
                          ? newValue.map((item: any) => item.label)
                          : newValue
                          ? newValue.label
                          : [];
                        changeState(input.parameterKey, valueStrings);
                      }
                    : selectChange
                }
                onInputChange={
                  input.parameterKey === "storageLocation"
                    ? (event: any, newInputValue: string) => {
                        setInputValue(newInputValue);
                      }
                    : input.parameterKey === "clients"
                    ? (event: any, newInputValue: string) => {
                        // Convert MUI Autocomplete's onInputChange signature to match checkWhatRenderArray
                        checkWhatRenderArray({
                          target: { value: newInputValue },
                        });
                      }
                    : undefined
                }
                // value={input.multiple ? selectedOptions?.length > 0 ? selectedOptions?.map((item: any) => {
                //   return {
                //     label: item?.label,
                //     id: item?.id,
                //   };
                // }) : selectedOptions : selectedLabel}
                loading={loading}
                value={input.multiple ? selectedOptions : selectedLabel}
                error={error}
                disabled={!!readonly}
                placeholder={t(input.placeholder)}
                options={
                  input.multiple
                    ? [{ label: "all", value: "all" }, ...options]
                    : input.parameterKey === "storageLocation" &&
                      inputValue &&
                      !options.find(
                        (option) =>
                          option.label.toLowerCase() ===
                          inputValue.toLowerCase()
                      ) &&
                      inputValue.trim() !== ""
                    ? [
                        {
                          label: inputValue,
                          value: "new",
                        },
                        ...options,
                      ]
                    : options
                }
                onChangeTextField={undefined}
                multiple={!!input.multiple}
                disableClearable={input?.disableClearable || false}
                getOptionDisabled={(option: any) => option.isInfo === true}
                renderOption={
                  input.multiple
                    ? (props: any, option: any) => {
                        // Check if this is an informational option (non-selectable)
                        if (option.isInfo) {
                          return (
                            <Stack
                              style={{
                                ...classes.multiSelectOption,
                                pointerEvents: "none",
                                cursor: "default",
                                opacity: 0.7,
                                paddingLeft: "16px",
                              }}
                            >
                              <div
                                style={{ fontStyle: "italic", color: "#666" }}
                              >
                                {option.label}
                              </div>
                            </Stack>
                          );
                        }

                        return (
                          <Stack style={classes.multiSelectOption}>
                            <div>
                              <Checkbox
                                onChange={(e, checked) => {
                                  if (option.value === "all") {
                                    if (checked) {
                                      const allValues = options
                                        .filter((o) => !o.isInfo)
                                        .map((o) => o.value);
                                      setValues(allValues);
                                      setSelectedOptions(
                                        options
                                          .filter((o) => !o.isInfo)
                                          .map((o) => ({
                                            label: o.label,
                                            value: o.value,
                                          }))
                                      );
                                      changeState(
                                        input.parameterKey,
                                        allValues
                                      );
                                    } else {
                                      setValues([]);
                                      setSelectedOptions([]);
                                      changeState(input.parameterKey, []);
                                    }
                                  } else {
                                    if (checked) {
                                      setSelectedOptions((prevValues) => [
                                        ...prevValues,
                                        {
                                          label: option.label,
                                          value: option.value,
                                        },
                                      ]);
                                    } else {
                                      setSelectedOptions((prevValues) =>
                                        prevValues.filter(
                                          (item) => item.value !== option.value
                                        )
                                      );
                                    }
                                    handleSelectCheck(
                                      input.parameterKey,
                                      checked,
                                      option
                                    );
                                  }
                                }}
                                icon={<CheckboxIcon />}
                                checkedIcon={<CheckboxCheckedIcon />}
                                checked={
                                  option.value === "all"
                                    ? values.length ===
                                        options.filter((o) => !o.isInfo)
                                          .length &&
                                      options.filter((o) => !o.isInfo).length >
                                        0
                                    : values?.length > 0
                                    ? values?.includes(option?.value)
                                    : input?.value?.includes(option?.value)
                                }
                              />
                            </div>
                            <div>{option.label}</div>
                          </Stack>
                        );
                      }
                    : undefined
                }
                PaperComponent={(props: any) => (
                  <Paper
                    style={{
                      width:
                        input.dropdownStyle?.width ||
                        props?.style?.width ||
                        "180px",
                      ...input.dropdownStyle,
                      ...props?.style,
                    }}
                    {...props}
                  >
                    {props?.children}
                  </Paper>
                )}
              />
            ) : input.type === "switch" ? (
              <SecondSwitch
                key={input?.label}
                checked={switchValue}
                onChange={handleSwitchCheck}
                value={input?.value}
              />
            ) : input.type === "primeSwitch" ? (
              <PrimarySwitch
                checked={switchValue}
                onChange={handleSwitchCheck}
              />
            ) : input.type === "color" ? (
              <div style={customStyles?.colorInput || classes.fileInputStyle}>
                <MuiColorInput
                  value={color}
                  onChange={handleChange}
                  format="hex"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "& .MuiOutlinedInput-root fieldset": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              </div>
            ) : input.type === "image" ? (
              <div style={customStyles?.imageInput}>
                <ImageUploadComponent
                  onChange={(value) => changeState(input.parameterKey, value)}
                  value={selectedNameFile}
                />
              </div>
            ) : input.type === "phone" ? (
              <div style={customStyles?.phoneInput}>
                <PhoneInputComponent
                  onChange={onChangePhoneNumber}
                  value={input.value}
                  placeholder={t(input.placeholder)}
                />
              </div>
            ) : input.type === "password" ? (
              <GomakeTextInput
                style={
                  customStyles?.textInput || { height: "40px", minWidth: 180 }
                }
                onChange={onChangeState}
                type={input.type}
                error={
                  error ||
                  (input?.value?.length > 0 && input?.value?.length < 9)
                }
                helperText={
                  input?.value?.length > 0 && input?.value?.length < 9
                    ? t("alerts.passTooShort")
                    : undefined
                }
                placeholder={t(input.placeholder)}
                disabled={!!readonly}
                value={input.value}
              />
            ) : (
              <GomakeTextInput
                style={
                  customStyles?.textInput || { height: "40px", minWidth: 180 }
                }
                onChange={onChangeState}
                type={input.type}
                error={
                  error ||
                  (input.value && input.regex && !input.regex.test(input.value))
                }
                placeholder={t(input.placeholder)}
                disabled={!!readonly}
                value={input.value}
                //value={translateUnit && input.unit ? (String(input.value).endsWith('.') ? convertUnitValue(input.unit, parseFloat(input.value)) + '.' : convertUnitValue(input.unit, parseFloat(input.value))) : input.value}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { FormInput };
