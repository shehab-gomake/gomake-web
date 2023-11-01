import { GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon } from "./icons/checkbox-checked-icon";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { PlusIcon } from "./icons/plus";
import { MinusIcon } from "./icons/minus";
import { useClickAway } from "@uidotdev/usehooks";
import { useRecoilState } from "recoil";
import { maltiParameterState } from "./store/multi-param-atom";
import lodashClonedeep from "lodash.clonedeep";

const SubChildrenMapping = ({
  parameters,
  item,
  value,
  clasess,
  index,
  index2,
  index3,
  forceChange,
  paddingLeft,
}) => {
  const [checked, setChecked] = useState(false);
  const [generalParameters, setGeneralParameters] =
    useRecoilState(maltiParameterState);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [valueState, setValueState] = useState<number>(0);
  useEffect(() => {
    console.log("generalParameters", generalParameters);
  }, [generalParameters]);
  useEffect(() => {
    setChecked(forceChange);
    onChangeCheckBox({
      target: {
        checked: forceChange,
      },
    });
  }, [forceChange]);
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
    setGeneralParameters((prev) => {
      let temp = lodashClonedeep(prev);
      const numProperties = temp.length;

      if (e.target.checked) {
        temp[0].value.push(value?.value);
        for (let i = 1; i < numProperties; i++) {
          const propertyValue = parseFloat(
            (
              document.getElementById(
                `p${i}_${index2}_${index3}`
              ) as HTMLInputElement
            ).value
          );
          temp[i].value.push(propertyValue);
        }
      } else {
        const index = temp[0].value.findIndex((p) => p === value?.value);
        if (index !== -1) {
          temp[0].value.splice(index, 1);
          for (let i = 1; i < numProperties; i++) {
            temp[i].value.splice(index, 1);
          }
        }
      }
      setChecked(e.target.checked);

      return temp;
    });
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
  };
  console.log("value", value);
  return (
    <div style={clasess.childRowContainer}>
      {item?.name === parameters[0].name && (
        <div style={{ paddingLeft: paddingLeft }}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            onChange={onChangeCheckBox}
            checked={checked}
            value={checked}
            key={`c${index}_${checked}`}
          />
        </div>
      )}

      <div style={clasess.childLabelStyle}>
        {item?.parameterType != 1 ? (
          value?.value
        ) : (
          <div ref={ref}>
            <GomakeTextInput
              placeholder={value?.value}
              defaultValue={value?.value}
              style={{
                ...clasess.textInputStyle,
                border: isFocused ? "1px solid rgba(237, 2, 140, 1)" : "",
              }}
              onFocus={() => setIsFocused(true)}
              onChange={onChangeText}
              value={valueState}
              id={`p${index}_${index2}_${index3}`}
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
  );
};
export { SubChildrenMapping };
