import React, { ChangeEvent, memo, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useStyle } from "@/components/form-inputs/style";
import { IFormInput } from "@/components/form-inputs/interfaces";
import { GoMakeAutoComplate, GomakeTextInput, SecondSwitch, PrimarySwitch } from "@/components";
import { MuiColorInput } from 'mui-color-input';
import { GoMakeFileFiled } from "../file-filed/file-filed";
import { ImageUploadComponent } from "./image-input";
import Stack from "@mui/material/Stack";
import { CheckBox } from "@mui/icons-material";
import { Checkbox } from "@mui/material";

 
const FormInput = ({ input, error, changeState, readonly }: IFormInput) => {
  const [options, setOptions] = useState([]);
  const [values, setValues] = useState([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<string>(input.value);
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { classes } = useStyle();
  const fileInputRef = React.createRef<HTMLInputElement>();
  const [color, setColor] = useState<string>(input.value);
   const [selectedNameFile, setSelectedNameFile] = useState<string>(input.value);



  const handleChange = (value: string) => {
    setColor(value);
    changeState(input.parameterKey, value);
  };

    const onChangeState = (e: ChangeEvent<HTMLInputElement>) => {
        changeState(input.parameterKey, e.target.value as string);
    };

    const selectChange = (event: SyntheticEvent, value): void => {
        setSelectedLabel(value?.label ? value.label : "");
        changeState(input.parameterKey, value?.value ? value.value : "");
    };
  
    const handleSwitchCheck = (event: ChangeEvent<HTMLInputElement>) => {
        changeState(input.parameterKey, event.target.checked);
    };

    useEffect(() => {
        const selectedValue = options?.find((option) => option.value === input.value);
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
    if (input.type === "color") {
      setColor(input.value);
    }
    if (input.type === "file" || input.type === "image") {
      setSelectedNameFile(input.value);
    }
    setValues(!!input?.values ? input?.values : []);
    if(input?.multiple) {
      console.log(input);
    }
  }, [input]);

  const getValues = useCallback(() => input?.values, [input]);
  useEffect(() => {
    if (input.type === "select") {
      const selectedValue = options?.find((option) => option.value === input.value);
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
        <div style={input.direction == "row" ? classes.inputContainerRow : classes.inputContainer} key={input.parameterKey}>
          <div style={classes.inputLbl}>
            {
              <span>{t(input.label)}</span>
            }
            {input.required && <span style={classes.required}>*</span>}
          </div>
          <div style={classes.input}>
            {input.type === "file" ? (
              <GoMakeFileFiled selectedNameFile={selectedNameFile} />
            ) : input.type === "select" ? (
              <GoMakeAutoComplate
                style={{ minWidth: 180, border: 0 }}
                onChange={input.multiple ? ()=>null : selectChange}
                value={input.multiple ? "" : selectedLabel}
                error={error}
                disabled={!!readonly}
                placeholder={t(input.placeholder)}
                options={options}
                multiple={false}
                renderOption={input.multiple ?  (props: any, option: any) => {
                  return (
                      <Stack direction={'row'} alignItems={'center'}>
                        <div>
                          <Checkbox onChange={(e, checked) => {
                            changeState(input.parameterKey, checked ? [...values, option?.value] : values.filter(v => v  !== option?.value))}
                          }
                           checked={values?.includes(option?.value)}/>
                        </div>
                          <div style={{ width: "100%" }}>
                              {option.label}
                          </div>
                      </Stack>
                  )
              } : undefined}
              />
            ) : input.type === "switch" ? (
              <SecondSwitch checked={!!input.value} onChange={handleSwitchCheck} />
            )
              : input.type === 'primeSwitch' ? (
                <PrimarySwitch checked={!!input.value} onChange={handleSwitchCheck} />
              )
                : input.type === "color" ? (
                  <div style={classes.fileInputStyle}>
                    <MuiColorInput value={color} onChange={handleChange} format="hex" />
                  </div>
                )
                  : input.type === "image" ?
                    (
                      <ImageUploadComponent onChange={(value) => changeState(input.parameterKey, value)}
                        value={selectedNameFile} />
                    )
                    : (
                      <GomakeTextInput
                        style={{ height: "40px" }}
                        onChange={onChangeState}
                        type={input.type}
                        error={error || (input.value && input.regex && !input.regex.test(input.value))}
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

export {FormInput}