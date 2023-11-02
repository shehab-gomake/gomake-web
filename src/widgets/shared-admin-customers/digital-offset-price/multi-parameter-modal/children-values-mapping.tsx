import { GomakeTextInput } from "@/components";
import { Checkbox } from "@mui/material";
import { SubChildrenMapping } from "./sub-children-mapping";
import { CheckboxCheckedIcon } from "./icons/checkbox-checked-icon";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { useState } from "react";
import { PlusIcon } from "./icons/plus";
import { MinusIcon } from "./icons/minus";
import { useClickAway } from "@uidotdev/usehooks";
import { useRecoilState } from "recoil";
import { maltiParameterState } from "./store/multi-param-atom";
import lodashClonedeep from "lodash.clonedeep";

const ChildrenValuesMapping = ({
  parameters,
  item,
  value,
  clasess,
  index,
  index2,
}) => {
  const [generalParameters, setGeneralParameters] =
    useRecoilState(maltiParameterState);
  const [isFocused, setIsFocused] = useState(false);
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
    if (e.target.checked) {
      setForceChange(true);
    } else {
      setForceChange(false);
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
  const paddingLeft = value?.valueId?.length === 0 ? 13 : 38;
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
          {value?.data?.map((value, index3) => {
            return (
              <SubChildrenMapping
                key={`subChild_${index3}`}
                parameters={parameters}
                item={item}
                value={value}
                clasess={clasess}
                index={index}
                index2={index2}
                index3={index3}
                forceChange={forceChange}
                paddingLeft={paddingLeft}
                parentValue={parentValue}
              />
            );
          })}
        </div>
      )}
    </>
  );
};
export { ChildrenValuesMapping };
