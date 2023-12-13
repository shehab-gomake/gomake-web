import { useRecoilState, useRecoilValue } from "recoil";
import { selectColorValueState } from "./store/selecte-color-value";
import { maltiParameterState } from "./store/multi-param-atom";
import {useEffect, useMemo, useState} from "react";
import lodashClonedeep from "lodash.clonedeep";
import { useClickAway } from "@uidotdev/usehooks";
import {subProductsCopyParametersState, subProductsParametersState} from "@/store";
import {
  userMultiParameterModalValues
} from "@/widgets/shared-admin-customers/digital-offset-price/multi-parameter-modal/use-multi-parameter-modal-values";

const useChildValuesMapping = ({
  value,
  index,
  parameters,
  settingParameters,
    item
}) => {
  const paddingLeft = value?.valueId?.length === 0 ? 13 : 38;
  const selectColorValue = useRecoilValue<any>(selectColorValueState);
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
  const [subProducts, setSubProducts] = useRecoilState<any>(subProductsCopyParametersState);
  const {addValueToSubProduct,removeValueFromSubProduct,setSubProductValue} = userMultiParameterModalValues(settingParameters)

  const getSelectedColorParameterValue = ()=>{
    const subSection = settingParameters.subSection;
    const subProductType = subSection.type;
    let subProduct =  subProducts.find(sub => sub.type == subProductType);
    const colorParameter = settingParameters?.parameter?.settingParameters[0];
    return subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id && paramValue.values);
  }
  const isChecked = useMemo(() => {
    
    const colorParameterValue  = getSelectedColorParameterValue();
    if(colorParameterValue){
      if(value.valueId){
        const subData = value.data;
        if(subData){
          let isAllValuesExists = true;
          subData.forEach(x=>{
            if(!colorParameterValue.values.find(val => val === x.value)){
              isAllValuesExists = false;
            }
          })
          if(isAllValuesExists)
            return true
        }
      }
    }
    return false
  }, [subProducts]);
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
  const onChangeCheckBox = (e) => {
    const subData = value.data;
    let newSubProducts = lodashClonedeep(subProducts);
    subData.forEach(x=>{
      debugger
      if (e.target.checked){
        newSubProducts = addValueToSubProduct(newSubProducts,x)
      }
      else {
         newSubProducts = removeValueFromSubProduct(newSubProducts,x)
      }
    })
    setSubProducts(newSubProducts);
  };
  const setTextInputValue = (textInputVal) =>{
    setValueState(textInputVal);
    let newSubProducts = lodashClonedeep(subProducts);
    const subData = value.data;
    subData.forEach(x=>{
      newSubProducts = setSubProductValue(newSubProducts,item.id,x,textInputVal);
    })
    setSubProducts(newSubProducts);
  }
  const onChangeText = (e) => {
    setTextInputValue(e.target.value);
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
    isChecked,
    setIsFocused,
  };
};

export { useChildValuesMapping };
