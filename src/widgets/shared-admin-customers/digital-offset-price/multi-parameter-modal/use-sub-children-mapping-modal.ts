import {useEffect, useMemo, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {maltiParameterState} from "./store/multi-param-atom";
import {selectColorValueState} from "./store/selecte-color-value";
import lodashClonedeep from "lodash.clonedeep";
import {useClickAway} from "@uidotdev/usehooks";
import {subProductsCopyParametersState, subProductsParametersState} from "@/store";
import {
  userMultiParameterModalValues
} from "@/widgets/shared-admin-customers/digital-offset-price/multi-parameter-modal/use-multi-parameter-modal-values";

const useSubChildMapping = ({
  forceChange,
  parameters,
  settingParameters,
  value,
  index,
  parentValue,item
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [subProducts, setSubProducts] = useRecoilState<any>(subProductsCopyParametersState);
  const {addValueToSubProduct,removeValueFromSubProduct,setSubProductValue} = userMultiParameterModalValues(settingParameters)
  const selectColorValue = useRecoilValue<any>(selectColorValueState);
  const ref = useClickAway(() => {
    setIsFocused(false);
  });
  const getSelectedColorParameterValue = ()=>{
    if(subProducts){
      const subSection = settingParameters.subSection;
      const subProductType = subSection.type;
      let subProduct =  subProducts.find(sub => sub.type == subProductType);
      const colorParameter = settingParameters?.parameter?.settingParameters[0];
      return subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id && paramValue.values);
    }
    
  }
  const onChangeCheckBox = (e) => {
    let newSubProducts = lodashClonedeep(subProducts);
    if (e.target.checked){
       newSubProducts = addValueToSubProduct(newSubProducts,value)
    }
    else {
       newSubProducts = removeValueFromSubProduct(newSubProducts,value)
    }
    setSubProducts(newSubProducts);
  };
  

  const isChecked = useMemo(() => {
    const colorParameterValue  = getSelectedColorParameterValue();
    if(colorParameterValue){
      const colorValue = colorParameterValue.values.find(val => val === value.valueId);
      if(colorValue)
        return true
    }
    return false
  }, [subProducts]);
  const textInputValue = useMemo(() => {
    if(!subProducts)
      return 
    const subSection = settingParameters.subSection;
    let subProductsCopy = lodashClonedeep(subProducts);
    const subProductType = subSection.type;
    let subProduct =  subProductsCopy.find(sub => sub.type == subProductType);
    const colorParameter = settingParameters?.parameter?.settingParameters[0];
    const colorParameterValue  = subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id );
    if(colorParameterValue){
      const valueIndex = colorParameterValue.valueIds.findIndex(val => val === value.valueId);
      if(valueIndex !== -1){
        const parameterValue = subProduct.parameters.find(paramValue => paramValue.parameterId === item.id );
        if(parameterValue && parameterValue.values && parameterValue.values.length > valueIndex){
          return parameterValue.values[valueIndex];
        }
      }
    }
    return  item.defaultValue;
  }, [subProducts]);
  
  const setTextInputValue = (textInputVal) =>{
    let newSubProducts = lodashClonedeep(subProducts);
    newSubProducts = setSubProductValue(newSubProducts,item.id,value,textInputVal);
    setSubProducts(newSubProducts);
  }
  const onChangeText = (e) => {
    setTextInputValue(e.target.value);
  };

  const incrementValue = () => {
    let currentValue = textInputValue.toString();
    currentValue = (parseInt(currentValue) + 1).toString();
    setTextInputValue(currentValue);
  };
  const decrementValue = () => {
    let currentValue = textInputValue.toString();
    currentValue = (parseInt(currentValue) - 1).toString();
    setTextInputValue(currentValue);
  };

  const getMaxSelectionValues = () => {
    if(!subProducts){
      return;
    }
    const subSection = settingParameters.subSection;
    const subProductType = subSection.type;
    const subProduct =  subProducts.find(sub => sub.type == subProductType);
    const parameterValue = subProduct.parameters.find(paramValue => paramValue.parameterId === settingParameters.parameter.id && paramValue.values );
    if(parameterValue && parameterValue.valueIds && parameterValue.valueIds.length > 0){
      const val = parameterValue.valueIds[0];
      const valueConfig = settingParameters.parameter.valuesConfigs.find(conf => conf.id == val);
      if(valueConfig && valueConfig.selectedParameterValues && valueConfig.selectedParameterValues.length > 0){
        const firstSelectedParameterValue = valueConfig.selectedParameterValues[0];
        return firstSelectedParameterValue.selectValuesCount
      }
    }
    return null;
  }
  const isDisabled = useMemo(() => {
    if(selectColorValue?.selectedParameterValues[0].valueIds.length > 0){
      return true;
    }
    const maxSelection = getMaxSelectionValues();
    if(maxSelection){
      const colorParameterValue  = getSelectedColorParameterValue();
      if(colorParameterValue && colorParameterValue.values ){
        const isValueExists = colorParameterValue.values.find(val => val === value.value);
        if(isValueExists)
          return false;
        if(colorParameterValue.values && colorParameterValue.values.length >= maxSelection){
          return  true
        }
          
      }
    }
    return false;
  }, [subProducts]);
  return {
    ref,
    isFocused,
    onChangeCheckBox,
    isDisabled,
    incrementValue,
    decrementValue,
    setIsFocused,
    onChangeText,
    isChecked,
    textInputValue
  };
};

export { useSubChildMapping };
