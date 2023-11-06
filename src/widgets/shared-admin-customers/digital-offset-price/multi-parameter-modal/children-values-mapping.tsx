import { GomakeTextInput } from "@/components";
import { Checkbox } from "@mui/material";
import { SubChildrenMapping } from "./sub-children-mapping";
import { CheckboxCheckedIcon } from "./icons/checkbox-checked-icon";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { useEffect, useState } from "react";
import { PlusIcon } from "./icons/plus";
import { MinusIcon } from "./icons/minus";
import { useClickAway } from "@uidotdev/usehooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { maltiParameterState } from "./store/multi-param-atom";
import lodashClonedeep from "lodash.clonedeep";
import { selectColorValueState } from "./store/selecte-color-value";

const ChildrenValuesMapping = ({
  parameters,
  item,
  value,
  clasess,
  index,
  index2,
  settingParameters,
}) => {
  const paddingLeft = value?.valueId?.length === 0 ? 13 : 38;
  const selectColorValue = useRecoilValue<any>(selectColorValueState);
  const [generalParameters, setGeneralParameters] =
    useRecoilState(maltiParameterState);
  const [isFocused, setIsFocused] = useState(false);
  const [checked, setChecked] = useState(false);
  const [valueState, setValueState] = useState<any>(0);
  const [forceChange, setForceChange] = useState(false);
  const [parentValue, setParentValue] = useState(0);
  const updateValue = (increment: boolean) => {
    let temp = lodashClonedeep(generalParameters);
    const indexOfName = temp[0].value.findIndex((p) => p === value?.value);
    if (indexOfName !== -1) {
      temp[0].value[indexOfName] = value?.value;
      temp[index].value[indexOfName] = +valueState + (increment ? 1 : -1) || 0;
      setGeneralParameters(temp);
    }
    setValueState(+valueState + (increment ? 1 : -1));
  };

  const incrementValue = () => {
    updateValue(true);
  };

  const decrementValue = () => {
    updateValue(false);
  };

  const ref = useClickAway(() => {
    setIsFocused(false);
  });
  const onChangeCheckBox = (e) => {
    if (selectColorValue) {
      setGeneralParameters((prev) => {
        let temp = lodashClonedeep(prev);

        if (e.target.checked) {
          setChecked(true);
          setForceChange(true);
        } else {
          setForceChange(false);
          setChecked(false);
        }
        setChecked(e.target.checked);
        return temp;
      });
    }
  };
  const onChangeText = (e) => {
    let temp = lodashClonedeep(generalParameters);
    const indexOfName = temp[0].value.findIndex((p) => {
      return p == value?.value;
    });
    if (indexOfName !== -1) {
      temp[0].value[indexOfName] = value?.value;
      temp[index].value[indexOfName] = parseFloat(e.target.value) || 0;
      setGeneralParameters(temp);
    }
    setValueState(parseFloat(e.target.value) || 0);
    setParentValue(parseFloat(e.target.value) || 0);
  };
  const isDisabled = () => {
    let isDisabled = false;
    if (typeof selectColorValue === "undefined") {
      isDisabled = true;
    }
    if (
      selectColorValue?.selectedParameterValues[0]?.selectValuesCount <
      generalParameters[0]?.value?.length + value?.valueId?.length
    ) {
      isDisabled = true;
    }
    return isDisabled;
  };
  useEffect(() => {
    const temp = parameters.map((item: any) => ({
      parameterId: item.id,
      sectionId: settingParameters?.section?.id,
      subSectionId: settingParameters?.subSection?.id,
      parameterType: item.parameterType,
      parameterName: item.name,
      actionId: item.actionId,
      valueId: [],
      value: [],
    }));
    setGeneralParameters(temp);
    setChecked(false);
  }, [selectColorValue]);
  return (
    <>
      {value?.valueId?.length != 0 && (
        <div style={clasess.childRowContainer}>
          {item?.name === parameters[0].name && (
            <div style={{ paddingLeft: 13 }}>
              <Checkbox
                icon={<CheckboxIcon />}
                checkedIcon={<CheckboxCheckedIcon />}
                onChange={(e) => onChangeCheckBox(e)}
                id={`c${index}_${index2}`}
                key={`c${index}_${selectColorValue}`}
                checked={checked}
                value={checked}
                disabled={isDisabled() && !checked}
              />
            </div>
          )}
          <div style={clasess.childLabelStyle}>
            {item?.parameterType != 1 ? (
              value?.value
            ) : (
              <div ref={ref}>
                <GomakeTextInput
                  id={`p${index}_${index2}`}
                  placeholder={value?.value}
                  defaultValue={value?.value}
                  style={{
                    ...clasess.textInputStyle,
                    border: isFocused ? "1px solid rgba(237, 2, 140, 1)" : "",
                  }}
                  onFocus={() => setIsFocused(true)}
                  value={valueState}
                  onChange={onChangeText}
                />
                {isFocused && (
                  <div style={clasess.iconsContainer}>
                    <div onClick={incrementValue} style={clasess.iconContainer}>
                      <PlusIcon />
                    </div>
                    <div onClick={decrementValue} style={clasess.iconContainer}>
                      <MinusIcon />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {value?.data?.length > 0 && (
        <div>
          {value?.data?.map((value2, index3) => {
            return (
              <SubChildrenMapping
                key={`subChild_${index3}`}
                parameters={parameters}
                item={item}
                value={value2}
                clasess={clasess}
                index={index}
                index2={index2}
                index3={index3}
                forceChange={forceChange}
                paddingLeft={paddingLeft}
                parentValue={parentValue}
                settingParameters={settingParameters}
              />
            );
          })}
        </div>
      )}
    </>
  );
};
export { ChildrenValuesMapping };
