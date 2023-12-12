import {useEffect, useMemo, useState} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { maltiParameterState } from "./store/multi-param-atom";
import { selectColorValueState } from "./store/selecte-color-value";
import lodashClonedeep from "lodash.clonedeep";
import { useClickAway } from "@uidotdev/usehooks";
import {subProductsParametersState} from "@/store";
import {compareStrings} from "@/utils/constants";

const useSubChildMapping = ({
  forceChange,
  parameters,
  settingParameters,
  value,
  index,
  parentValue,
}) => {
  const [checked, setChecked] = useState(false);
  const [generalParameters, setGeneralParameters] =
    useRecoilState(maltiParameterState);
  const selectColorValue = useRecoilValue<any>(selectColorValueState);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [valueState, setValueState] = useState<number>(
    parameters[index].defaultValue
  );
  const [subProducts, setSubProducts] = useRecoilState<any>(subProductsParametersState);
  useEffect(() => {
    setValueState(parentValue);
  }, [parameters, parentValue]);

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
    console.log(selectColorValue)
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
    debugger;
    const section = settingParameters.section;
    const subSection = settingParameters.subSection;
    let subProductsCopy = lodashClonedeep(subProducts);
    const subProductType = subSection.type;
    let subProduct =  subProductsCopy.find(sub => sub.type == subProductType);
   
   
    const colorParameter = settingParameters?.parameter?.settingParameters[0];
    const colorParameterValue  = subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id );
    if (e.target.checked){
      if(colorParameterValue){

      }else{
        let settingParameterIndex = 0;
        settingParameters?.parameter?.settingParameters.forEach(settingParameter=>{
          const newParamValues = [];
          const newParamValueIds = [];
          if(settingParameterIndex === 0){
            newParamValues.push(value.value);
            newParamValueIds.push(value.value);
          }else{
            newParamValues.push(settingParameter.defaultValue);
          }
          subProduct.parameters.push({
            parameterId: settingParameter?.id,
            parameterName: settingParameter?.name,
            actionId: settingParameter?.actionId,
            parameterType: settingParameter?.parameterType,
            values: newParamValues,
            valueIds: newParamValueIds,
            sectionId: section?.id,
            subSectionId: subSection?.id,
            actionIndex: settingParameter?.actionIndex,
          })
          settingParameterIndex++;
        });
        
      }
    }else{
      settingParameters?.parameter?.settingParameters.forEach(settingParameter=>{
        subProduct.parameters = subProduct.parameters.filter(parameter => parameter.parameterId != settingParameter.id);
      })
     
    }
    
    setSubProducts(subProductsCopy)
  };
  

  const getIsChecked = useMemo(() => {
    const subSection = settingParameters.subSection;
    const subProductType = subSection.type;
    let subProduct =  subProducts.find(sub => sub.type == subProductType);
    const colorParameter = settingParameters?.parameter?.settingParameters[0];
    const colorParameterValue  = subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id && paramValue.values );
    if(colorParameterValue){
      const colorValue = colorParameterValue.values.find(val => val === value.value);
      if(colorValue)
        return true
    }
    return false
  }, [subProducts]);
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
    getIsChecked
  };
};

export { useSubChildMapping };
