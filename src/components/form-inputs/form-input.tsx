import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useStyle } from "@/components/form-inputs/style";
import { IFormInput } from "@/components/form-inputs/interfaces";
import { Button } from "@mui/material";
import { GarlleryIcon } from "../icons/gallery-icon";
import { GoMakeAutoComplate, GomakeTextInput, SecondSwitch } from "@/components";
import { MuiColorInput } from 'mui-color-input';

const FormInput = ({ input, error, changeState, readonly }: IFormInput) => {
  const [options, setOptions] = useState([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<string>(input.value);
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { classes } = useStyle();
  const fileInputRef = React.createRef<HTMLInputElement>();
  const [color, setColor] = React.useState('')

  const handleChange = (color) => {
    setColor(color)
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {

      console.log("Selected file:", selectedFile);
    }
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
    const selectedValue = options?.find((option) => option.value === input.value);
    if (selectedValue) {
      setSelectedLabel(selectedValue.label);
    } else {
      setSelectedLabel("");
    }
  }, [input]);

  return (
    <>
      {!input.disabled && (
        <div style={classes.inputContainer} key={input.parameterKey}>
          <div style={classes.inputLbl}>
            {
                input.type != "switch2" ?  <span>{t(input.label)}</span> : ""
            }
           
            {input.required && <span style={classes.required}>*</span>}
          </div>
          <div style={classes.input}>
            {input.type === "file" ? (
              <div style={{ width: "280px" }}>
                <div style={classes.inputContainer} key={input.parameterKey}>
                  <div style={classes.fileInputStyle}>
                    <GarlleryIcon />
                    <input
                      ref={fileInputRef}
                      placeholder={"upload"}
                      onChange={handleInputChange}
                      disabled={!!readonly}
                      accept=".pdf, .jpg, .png"
                      type="file"
                      style={{ display: "none" }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleButtonClick}
                      style={{ backgroundColor: "#ED028C" }}
                    >
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>
            ) : input.type === "select" ? (
              <GoMakeAutoComplate
                style={{ minWidth: 180, border: 0 }}
                onChange={selectChange}
                value={selectedLabel}
                error={error}
                disabled={!!readonly}
                placeholder={t(input.placeholder)}
                options={options}
              />
            ) : input.type === "switch" ? (
              <SecondSwitch checked={!!input.value} onChange={handleSwitchCheck} />
            ) : input.type === "switch2" ? (
                <div style={{width:"200px"}}>
                    <div style={{display:"flex",flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}>
                        <SecondSwitch checked={!!input.value} onChange={handleSwitchCheck} />
                            <span>{t(input.label)}</span>
                        </div>
                </div>
                
               
              )
            : input.type === "color" ? ( // Condition for color input
            <div style={classes.fileInputStyle}>
                    <MuiColorInput value={color} onChange={handleChange} />
            </div>
            ) : (
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

export { FormInput };