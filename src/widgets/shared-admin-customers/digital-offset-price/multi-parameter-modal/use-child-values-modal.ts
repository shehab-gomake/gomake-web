import { useRecoilState, useRecoilValue } from "recoil";
import { selectColorValueState } from "./store/selecte-color-value";
import { maltiParameterState } from "./store/multi-param-atom";
import { useEffect, useState } from "react";
import lodashClonedeep from "lodash.clonedeep";
import { useClickAway } from "@uidotdev/usehooks";

const useChildValuesMapping = ({
  value,
  index,
  parameters,
  settingParameters,
}) => {
  const paddingLeft = value?.valueId?.length === 0 ? 13 : 38;
  const selectColorValue = useRecoilValue<any>(selectColorValueState);
  console.log("value", value);
  console.log("selectColorValue", selectColorValue);
  const [generalParameters, setGeneralParameters] =
    useRecoilState(maltiParameterState);
  const [isFocused, setIsFocused] = useState(false);
  const [checked, setChecked] = useState(false);
  const [forceChange, setForceChange] = useState(false);
  const [valueState, setValueState] = useState<any>(
    parameters[index].defaultValue
  );
  const [parentValue, setParentValue] = useState(
    parameters[index].defaultValue
  );

  useEffect(() => {
    setValueState(parameters[index].defaultValue);
  }, [parameters]);
  const updateValue = (increment: boolean) => {
    let temp = lodashClonedeep(generalParameters);
    const indexOfName = temp[0].value.findIndex((p) => p === value?.value);
    if (indexOfName !== -1) {
      temp[0].values[indexOfName] = value?.value;
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
  useEffect(() => {
    if (
      selectColorValue?.selectedParameterValues[0]?.selectValuesCount ===
        value?.data?.length &&
      selectColorValue?.selectedParameterValues[0]?.valueIds?.length > 0
    ) {
      setChecked(true);
    }
  }, [selectColorValue, value, generalParameters]);
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
    setValueState(parseFloat(e.target.value));
    setParentValue(parseFloat(e.target.value));
  };
  const isDisabled = () => {
    let isDisabled = false;
    if (typeof selectColorValue === "undefined") {
      isDisabled = true;
    }
    if (
      selectColorValue?.selectedParameterValues[0]?.selectValuesCount <
      generalParameters[0]?.values?.length + value?.valueId?.length
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
      valueIds: [],
      values: [],
    }));
    setGeneralParameters(temp);
    setChecked(false);
  }, [selectColorValue]);
  return {
    selectColorValue,
    checked,
    ref,
    isFocused,
    valueState,
    forceChange,
    paddingLeft,
    parentValue,
    onChangeCheckBox,
    onChangeText,
    incrementValue,
    decrementValue,
    isDisabled,
    setIsFocused,
  };
};

export { useChildValuesMapping };
