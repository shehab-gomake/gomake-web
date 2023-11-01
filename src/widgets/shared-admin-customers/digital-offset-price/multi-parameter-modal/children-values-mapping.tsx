import { GomakeTextInput } from "@/components";
import { Checkbox } from "@mui/material";
import { SubChildrenMapping } from "./sub-children-mapping";
import { CheckboxCheckedIcon } from "./icons/checkbox-checked-icon";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { useEffect, useState } from "react";
import { PlusIcon } from "./icons/plus";
import { MinusIcon } from "./icons/minus";
import { useClickAway } from "@uidotdev/usehooks";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { materialsState } from "@/store";

const ChildrenValuesMapping = ({
  parameters,
  item,
  value,
  clasess,
  index,
  index2,
  generalParameters,
}) => {
  const [generalParameters2, setGeneralParameters2] = useState([
    ...generalParameters,
  ]);
  const [isFocused, setIsFocused] = useState(false);
  const [valueState, setValueState] = useState(0);
  const incrementValue = () => {
    setValueState(valueState + 1);
  };

  const decrementValue = () => {
    setValueState(valueState - 1);
  };
  const ref = useClickAway(() => {
    setIsFocused(false);
  });

  useEffect(() => {
    console.log("generalParameters2", generalParameters2);
  }, [generalParameters2]);

  const allMaterials = useRecoilValue<any>(materialsState);
  const setAllMaterials = useSetRecoilState<any>(materialsState);

  return (
    <>
      <div style={clasess.childRowContainer}>
        {item?.name === parameters[0].name && (
          <div style={{ paddingLeft: 13 }}>
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              onChange={(e) => {
                console.log("FFF", {
                  ch: e.target.checked,
                  index,
                  index2,
                  name: value?.value,
                  generalParameters2,
                });
                const temp = [...generalParameters2];
                if (e.target.checked) {
                  temp[0].value.push(value?.value);
                  const p1 = (
                    document.getElementById(`p1_${index2}`) as HTMLInputElement
                  ).value;
                  temp[1].value.push(p1);
                  const p2 = (
                    document.getElementById(`p2_${index2}`) as HTMLInputElement
                  ).value;
                  temp[2].value.push(p2);

                  setGeneralParameters2(temp);

                  setAllMaterials([1, 2]);
                } else {
                  const index = temp[0].value.findIndex((p) => {
                    return p == value?.value;
                  });
                  if (index !== -1) {
                    temp[0].value.splice(index, 1);
                    temp[1].value.splice(index, 1);
                    temp[2].value.splice(index, 1);
                  }
                  setGeneralParameters2([...temp]);
                  setAllMaterials([444, 33333]);
                }
              }}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  console.log("FFF", {
                    value: e.target.value,
                    index,
                    index2,
                    name: value?.value,
                    generalParameters2,
                    allMaterials,
                  });

                  const temp = [...generalParameters2];
                  const indexOfName = temp[0].value.findIndex((p) => {
                    return p == value?.value;
                  });
                  console.log("temp", temp);
                  console.log("indexOfName", indexOfName);

                  if (indexOfName !== -1) {
                    temp[0].value[indexOfName] = value?.value;
                    temp[index].value[indexOfName] =
                      parseFloat(e.target.value) || 0;
                    console.log("temp", temp);
                    setGeneralParameters2(temp);
                  }
                  setValueState(parseFloat(e.target.value) || 0);
                }}
                value={valueState}
                id={`p${index}_${index2}`}
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
              />
            );
          })}
        </div>
      )}
    </>
  );
};
export { ChildrenValuesMapping };
