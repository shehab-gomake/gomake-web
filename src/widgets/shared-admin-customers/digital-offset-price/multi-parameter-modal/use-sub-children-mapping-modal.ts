import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { maltiParameterState } from "./store/multi-param-atom";
import { selectColorValueState } from "./store/selecte-color-value";
import lodashClonedeep from "lodash.clonedeep";
import { useClickAway } from "@uidotdev/usehooks";

const useSubChildMapping = ({
  forceChange,
  parameters,
  settingParameters,
  value,
  index,
}) => {
  const [checked, setChecked] = useState(false);
  const [generalParameters, setGeneralParameters] =
    useRecoilState(maltiParameterState);
  const selectColorValue = useRecoilValue<any>(selectColorValueState);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [valueState, setValueState] = useState<number>(
    parameters[index].defaultValue
  );
  useEffect(() => {
    setValueState(parameters[index].defaultValue);
  }, [parameters]);

  useEffect(() => {
    setChecked(forceChange);
    onChangeCheckBox({
      target: {
        checked: forceChange,
      },
    });
  }, [forceChange]);
  useEffect(() => {
    const temp = parameters.map((item: any) => ({
      parameterId: item.id,
      sectionId: settingParameters?.section?.id,
      subSectionId: settingParameters?.subSection?.id,
      parameterType: item.parameterType,
      parameterName: item.name,
      actionId: item.actionId,
      valueIds: [],
      values: [],
    }));
    setGeneralParameters(temp);
    setChecked(false);
  }, [selectColorValue]);

  useEffect(() => {
    if (selectColorValue?.selectedParameterValues[0]?.valueIds?.length > 0) {
      const index =
        selectColorValue?.selectedParameterValues[0]?.valueIds?.findIndex(
          (elem) => elem === value?.value
        );
      if (index !== -1) {
        onChangeCheckBox({
          target: {
            checked: true,
          },
        });
      }
    }
  }, [selectColorValue]);

  const updateValue = (increment: boolean) => {
    let temp = lodashClonedeep(generalParameters);
    const indexOfName = temp[0].values.findIndex((p) => p === value?.value);
    if (indexOfName !== -1) {
      temp[0].valuse[indexOfName] = value?.value;
      temp[index].values[indexOfName] = +valueState + (increment ? 1 : -1) || 0;
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
        temp[0].values.push(value?.value);
        temp[0].valueIds.push(value?.valueId);
      } else {
        const index = temp[0].values.findIndex((p) => p === value?.value);
        const index2 = temp[0].valueIds.findIndex((p) => p === value?.valueId);
        if (index !== -1) {
          temp[0].values.splice(index, 1);
          temp[0].valueIds.splice(index2, 1);
          for (let i = 1; i < numProperties; i++) {
            temp[i].values.splice(index, 1);
          }
        }
      }

      setChecked(e.target.checked);
      return temp;
    });
  };
  const onChangeText = (e) => {
    setValueState(e.target.value);
  };

  const isDisabled = () => {
    let isDisabled = false;
    if (typeof selectColorValue === "undefined") {
      isDisabled = true;
    }
    if (
      generalParameters[0].values.length >=
      selectColorValue?.selectedParameterValues[0]?.selectValuesCount
    ) {
      isDisabled = true;
    }

    if (selectColorValue?.selectedParameterValues[0]?.valueIds?.length > 0) {
      const index =
        selectColorValue?.selectedParameterValues[0]?.valueIds?.findIndex(
          (e) => e === value?.value
        );
      if (index === -1) {
        isDisabled = true;
      }
    }
    return isDisabled;
  };
  return {
    generalParameters,
    checked,
    selectColorValue,
    ref,
    isFocused,
    valueState,
    onChangeCheckBox,
    isDisabled,
    incrementValue,
    decrementValue,
    setIsFocused,
    onChangeText,
  };
};

export { useSubChildMapping };
