import React, {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useStyle } from "@/components/form-inputs/style";
import { IFormInput } from "@/components/form-inputs/interfaces";
import {
  GoMakeAutoComplate,
  GomakeTextInput,
  SecondSwitch,
  PrimarySwitch,
} from "@/components";
import { MuiColorInput } from "mui-color-input";
import { ImageUploadComponent } from "./image-input";
import Stack from "@mui/material/Stack";
import { Checkbox, Paper } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { PhoneInputComponent } from "./phone-input";
import { useRecoilValue } from "recoil";
import { materialsClientsState, materialsMachinesState } from "@/widgets/materials-widget/state";
import { productsForDropDownList } from "@/store";
import { GoMakeImageFiled } from "../image-filed/image-filed";

const FormInput = ({ input, error, changeState, readonly }: IFormInput) => {
  const [options, setOptions] = useState([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<string>(input.value);
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [color, setColor] = useState<string>(input.value);
  const [selectedNameFile, setSelectedNameFile] = useState<string>(input.value);
  const [values, setValues] = useState([]);

  const machinesCategories = useRecoilValue<any>(materialsMachinesState);
  const clientsCategories = useRecoilValue<any>(materialsClientsState);
  const productValue = useRecoilValue(productsForDropDownList)
  const machinesCategoriesList = machinesCategories.map((machine) => ({
    ...machine,
    value: machine.id,
    label: `${machine.manufacturer} - ${machine.model}`,
  }));
  const clientsOptions = clientsCategories.map((client) => ({
    ...client,
    value: client.id,
    label: `${client.name} - ${client.code}`,
  }));
  const productsOption = productValue?.map((product) => ({
    ...product,
    value: product.id,
    label: `${product.name}`,
  }));
  const [switchValue, setSwitchValue] = useState<any>(input?.value);
  const handleChange = (value: string) => {
    setColor(value);
    changeState(input.parameterKey, value);
  };

  const onChangeState = (e: ChangeEvent<HTMLInputElement>) => {
    changeState(input.parameterKey, e.target.value as string);
  };

  const onChangePhoneNumber = (phone: string) => {
    changeState(input.parameterKey, phone as string);
  };

  const selectChange = (event: SyntheticEvent, value): void => {
    setSelectedLabel(value?.label ? value.label : "");
    changeState(input.parameterKey, value?.value ? value.value : "");
  };

  const handleSwitchCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setSwitchValue(event.target.checked)
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
      : setValues(values.filter((v) => v !== option?.value))
  };

  useEffect(() => {
    const selectedValue = options?.find(
      (option) => option.value === input.value
    );
    if (selectedValue) {
      setSelectedLabel(selectedValue.label);
    } else {
      setSelectedLabel("");
    }
  }, [options]);

  useEffect(() => {
    if (input.optionsUrl && !dataLoaded) {
      callApi("GET", input.optionsUrl).then((res) => {
        if (res?.success) {
          setOptions(
            res?.data?.data?.data?.map(({ value, text }) => ({
              label: text,
              value,
            }))
          );
        }
        setDataLoaded(true);
      });
    } else if (input.options && input.options.length > 0) {
      setOptions(
        input.options.map(({ value, text }) => ({ label: text, value }))
      );
    }
    else if (input.options?.length === 0 && input.parameterKey === "machines") {
      setOptions(machinesCategoriesList)
    }
    else if (input.options?.length === 0 && input.parameterKey === "clients") {
      setOptions(clientsOptions)
    }
    else if (input.options?.length === 0 && input.parameterKey === "printed product") {
      setOptions(productsOption)
    }
    if (input.type === "color") {
      setColor(input.value);
    }
    if (input.type === "imageFile" || input.type === "image") {
      setSelectedNameFile(input.value);
    }
    // setValues((!!input?.values ? input?.values : []) || (!!input?.defaultInDocsTypes ? input?.defaultInDocsTypes : []));
    if (input?.multiple) {
    }
  }, [input]);

  const defaultOptions = options.filter(option => input?.value?.toString()?.includes(option?.value))
  const [selectedOptions, setSelectedOptions] = useState([])

  useEffect(() => {
    setValues(Array.isArray(input.value) ? input.value : []);
  }, [input.value])

  useEffect(() => {
    const selected = options.filter(option => input?.value && typeof input?.value === 'string' && input?.value.includes(option.value));
    setSelectedOptions(selected);
  }, [input.value])

  return (
    <>
      {!input.disabled && (
        <div
          style={
            input.direction == "row"
              ? classes.inputContainerRow
              : classes.inputContainer
          }
          key={input.parameterKey}
        >
          <div style={classes.inputLbl}>
            {
              <Stack
                direction={"row"}
                gap={"7px"}
                alignItems={"flex-end"}
                padding={"0 5px"}
              >
                <span>{t(input.label)}</span>
                {input.unit && (
                  <small>{`${t("measurementUnits." + input.unit)}`}</small>
                )}
              </Stack>
            }
            {input.required && <span style={classes.required}>*</span>}
          </div>
          <div style={classes.inputs}>
            {input.type === "imageFile" ? (
              <GoMakeImageFiled selectedNameFile={selectedNameFile} onChange={(value) => changeState(input.parameterKey, value)} />
            ) : input.type === "select" || input?.type === "products_list" ? (
              <GoMakeAutoComplate
                key={`${input.value}`}
                style={{ minWidth: 180, border: 0, height: 40, overflow: "scroll" }}
                onChange={input.multiple ? () => null : selectChange}
                value={input.multiple ? selectedOptions?.length > 0 ? selectedOptions?.map((item: any) => {
                  return {
                    label: item?.label,
                    id: item?.id,
                  };
                }) : defaultOptions : selectedLabel}
                error={error}
                disabled={!!readonly}
                placeholder={t(input.placeholder)}
                options={options}
                multiple={input.multiple ? true : false}
                disableClearable={input?.disableClearable || false}
                renderOption={
                  input.multiple
                    ? (props: any, option: any) => {
                      return (
                        <Stack style={classes.multiSelectOption}>
                          <div>

                            <Checkbox
                              onChange={(e, checked) => {
                                if (checked) {
                                  setSelectedOptions((prevValues) => [
                                    ...prevValues,
                                    { label: option.label, value: option.value }
                                  ]);
                                } else {
                                  setSelectedOptions((prevValues) =>
                                    prevValues.filter((item) => item.value !== option.value)
                                  );
                                }
                                handleSelectCheck(
                                  input.parameterKey,
                                  checked,
                                  option
                                )
                              }

                              }
                              icon={<CheckboxIcon />}
                              checkedIcon={<CheckboxCheckedIcon />}
                              checked={values?.length > 0 ? values?.includes(option?.value) : input?.value?.includes(option?.value)}
                            />
                          </div>
                          <div>{option.label}</div>
                        </Stack>
                      );
                    }
                    : undefined
                }
                PaperComponent={(props: any) => (
                  <Paper style={{ width: "180px" }} {...props}>
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
              <div style={classes.fileInputStyle}>
                <MuiColorInput
                  value={color}
                  onChange={handleChange}
                  format="hex"
                />
              </div>
            ) : input.type === "image" ? (
              <ImageUploadComponent
                onChange={(value) => changeState(input.parameterKey, value)}
                value={selectedNameFile}
              />
            ) : input.type === "phone" ? (
              <PhoneInputComponent
                onChange={onChangePhoneNumber}
                value={input.value}
              />
            ) : (
              <GomakeTextInput
                style={{ height: "40px", minWidth: 180 }}
                onChange={onChangeState}
                type={input.type}
                error={
                  error ||
                  (input.value && input.regex && !input.regex.test(input.value))
                }
                placeholder={t(input.placeholder)}
                disabled={!!readonly}
                value={input.value}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export { FormInput };
