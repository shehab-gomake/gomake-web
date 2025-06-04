import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { IBusinessWidget } from "@/interfaces";
import { UpdateValueAutoComplete } from "@/components";
import { adaptMarginRight } from "@/utils/adapter";
import { useTranslation } from "react-i18next";

const AutoCompleteUpdatedValue = ({
  label,
  value,
  isUnderLine,
  onBlur,
  isUpdate,
  setIsUpdate,
  options,
  getOptionLabel,
  onChange,
  onChangeTextField,
  isFetching,
  defaultFiltering,
  renderOption,
  showClearIcon = false,
  filterOptions,
}: IBusinessWidget) => {
  const { classes } = useStyle({ isUnderLine });
  const { t } = useTranslation();
  const dir = t("direction");
  const [updateValue, setUpdateValue] = useState();
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    setUpdateValue(value);
  }, [value]);

  useEffect(() => {
    if (typeof value === "object") {
      setInputValue(value?.text ?? "");
    } else {
      setInputValue(value ?? "");
    }
  }, [value]);

  const handleBlur = () => {
    // Restore the input value from selected `value`
    if (typeof value === "object") {
      setInputValue(getOptionLabel?.(value) ?? "");
    } else {
      setInputValue(value ?? "");
    }
    onBlur?.();
  };

  return (
    <>
      <div style={classes.inputMainContainer}>
        <div style={classes.labelStyle}>{label}</div>
        {isUpdate ? (
          <UpdateValueAutoComplete
            clickedOut={handleBlur}
            // clickedOut={() => onBlur()}
            onCancel={() => setIsUpdate(null)}
            onUpdate={() => onBlur()?.then()}
            value={updateValue}
            options={options}
            getOptionLabel={getOptionLabel}
            onChange={onChange}
            onChangeTextField={onChangeTextField}
            loading={isFetching}
            defaultFiltering={defaultFiltering}
            renderOption={renderOption}
            filterOptions={filterOptions}
            inputValue={inputValue}
            onInputChange={(event, newInputValue, reason) => {
              if (reason === "input") {
                setInputValue(newInputValue);
              }
            }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={classes.inputTextStyle}
              className="customInput"
              onClick={() => setIsUpdate(1)}
            >
              {value}
            </div>
            {showClearIcon && (
              <div
                onClick={() => {
                  onChange(null, null);
                  setUpdateValue(null);
                }}
                style={{
                  ...adaptMarginRight(dir, 8),
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#888",
                  fontSize: "14px",
                }}
              >
                &#10005; {/* Unicode "X" character or use an icon */}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export { AutoCompleteUpdatedValue };
