import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
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
import { GoMakeFileFiled } from "../file-filed/file-filed";
import { ImageUploadComponent } from "./image-input";
import Stack from "@mui/material/Stack";
import { Checkbox, Paper } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { PhoneInputComponent } from "./phone-input";
import { useRecoilValue } from "recoil";
import { materialsClientsState, materialsMachinesState } from "@/widgets/materials-widget/state";
import { getAllProductsForDropDownList } from "@/services/hooks";

const FormInput = ({ input, error, changeState, readonly }: IFormInput) => {
  console.log(input);
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
  const [productValue, setProductValues] = useState([]);
  const productsOption = productValue?.map((product) => ({
    ...product,
    value: product.id,
    label: `${product.name}`,
  }));
  const [switchValue, setSwitchValue] = useState(false);
  const getAllProducts = useCallback(async () => {
    await getAllProductsForDropDownList(callApi, setProductValues);
  }, []);
  useEffect(() => {
    getAllProducts();
  }, []);
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
    console.log("event", event.target.checked)
    setSwitchValue(event.target.checked)
    changeState(input.parameterKey, event.target.checked);
  };

  const handleSelectCheck = (
    parameterKey: string,
    isChecked: boolean,
    option: any
  ) => {
    changeState(
      parameterKey,
      isChecked
        ? [...values, option?.value]
        : values.filter((v) => v !== option?.value)
    );
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
    else if (input.options.length === 0 && input.parameterKey === "machines") {
      setOptions(machinesCategoriesList)
    }
    else if (input.options.length === 0 && input.parameterKey === "clients") {
      setOptions(clientsOptions)
    }
    else if (input.options.length === 0 && input.parameterKey === "printed product") {
      setOptions(productsOption)
    }
    if (input.type === "color") {
      setColor(input.value);
    }
    if (input.type === "file" || input.type === "image") {
      setSelectedNameFile(input.value);
    }
    setValues(!!input?.values ? input?.values : []);
    if (input?.multiple) {
    }
  }, [input]);

  useEffect(() => {
    if (input.type === "select" || input.type === "products_list") {
      const selectedValue = options?.find(
        (option) => option.value === input.value
      );
      if (selectedValue) {
        setSelectedLabel(selectedValue.label);
      } else {
        setSelectedLabel("");
      }
    }
  }, [selectedLabel]);

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
            {input.type === "file" ? (
              <GoMakeFileFiled selectedNameFile={selectedNameFile} />
            ) : input.type === "select" || input?.type === "products_list" ? (
              <GoMakeAutoComplate
                style={{ minWidth: 180, border: 0 }}
                onChange={input.multiple ? () => null : selectChange}
                value={input.multiple ? "" : selectedLabel}
                error={error}
                disabled={!!readonly}
                placeholder={t(input.placeholder)}
                options={options}
                multiple={false}
                disableClearable={input?.disableClearable || false}
                renderOption={
                  input.multiple
                    ? (props: any, option: any) => {
                      return (
                        <Stack style={classes.multiSelectOption}>
                          <div>
                            <Checkbox
                              onChange={(e, checked) =>
                                handleSelectCheck(
                                  input.parameterKey,
                                  checked,
                                  option
                                )
                              }
                              icon={<CheckboxIcon />}
                              checkedIcon={<CheckboxCheckedIcon />}
                              checked={values?.includes(option?.value)}
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
                checked={switchValue}
                onChange={handleSwitchCheck}
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
