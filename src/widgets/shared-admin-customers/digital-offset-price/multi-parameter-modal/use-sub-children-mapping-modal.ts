import {useCallback, useEffect, useMemo, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {maltiParameterState} from "./store/multi-param-atom";
import {selectColorValueState} from "./store/selecte-color-value";
import lodashClonedeep from "lodash.clonedeep";
import {useClickAway} from "@uidotdev/usehooks";
import {subProductsCopyParametersState, subProductsParametersState} from "@/store";
import {
  userMultiParameterModalValues
} from "@/widgets/shared-admin-customers/digital-offset-price/multi-parameter-modal/use-multi-parameter-modal-values";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";

const useSubChildMapping = ({
  forceChange,
  parameters,
  settingParameters,
  value,
  index,
  parentValue,
  item,
  isParameterSettings,
  setSettingParameters
}) => {

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [subProducts, setSubProducts] = useRecoilState<any>(subProductsCopyParametersState);
  const {addValueToSubProduct,removeValueFromSubProduct,setSubProductValue} = userMultiParameterModalValues(settingParameters,isParameterSettings)
  const selectColorValue = useRecoilValue<any>(selectColorValueState);
  const ref = useClickAway(() => {
    setIsFocused(false);
  });
  const getSelectedColorParameterValue = () => {
    if (subProducts && !isParameterSettings) {
      const subSection = settingParameters.subSection;
      const subProductType = subSection.type;
      let subProduct = subProducts.find(sub => sub.type === subProductType);
      const colorParameter = settingParameters?.parameter?.settingParameters[0];
      return subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id && paramValue.values);
    } else {
      const valuesConfigs = settingParameters?.parameter?.valuesConfigs;
      const valueConfigDefault = valuesConfigs?.find((item) => item.isDefault);
      const colorParameter = settingParameters?.parameter?.settingParameters.find(item => item.code === "printingcolorsDetail");
      return valueConfigDefault.selectedParameterValues.find(paramValue => paramValue.parameterId === colorParameter.id);
    }
  };
  const [isChecked, setIsChecked] = useState(false);

useEffect(()=>{
  getSelectedColorParameterValue()
},[])
  const [updatedParameter,setUpdatedParameter]=useState()
  const onChangeCheckBox = (e) => {
    if (isParameterSettings) {
      // Handle parameter settings logic
      const printingcolorsDetail = parameters.find(item => item.code === "printingcolorsDetail");
      const loadParameter = parameters.find(p => p.code === "Colorloadpercentage");
      const layersParameter = parameters.find(p => p.code === "ColorLayers");
      const parameter = settingParameters?.parameter;
      const valuesConfigsList = parameter?.valuesConfigs;
      const defaultValueConfig = valuesConfigsList?.find(item => item.isDefault);
  
      if (defaultValueConfig) {
        let selectedParameterValues = defaultValueConfig.selectedParameterValues.map(paramValue => {
          if (paramValue.parameterId === printingcolorsDetail.id) {
            if (e.target.checked) {
              if (paramValue.valueIds.length < paramValue.selectValuesCount) {
                paramValue.valueIds.push(value.value);
              }
            } else {
              paramValue.valueIds = paramValue.valueIds.filter(val => val !== value.value);
            }
          }
          return paramValue;
        });
  
        const ensureParameterValue = (paramId, defaultValue) => {
          let paramValue = selectedParameterValues.find(pv => pv.parameterId === paramId);
          if (!paramValue) {
            paramValue = { parameterId: paramId, valueIds: [], selectValuesCount: selectedParameterValues[0]?.selectValuesCount };
            selectedParameterValues.push(paramValue);
          }
          return paramValue;
        };
  
        const loadParamValue = ensureParameterValue(loadParameter.id, loadParameter.defaultValue);
        const layersParamValue = ensureParameterValue(layersParameter.id, layersParameter.defaultValue);
  
        // Sync load and layer values with the number of color values
        const colorCount = selectedParameterValues.find(pv => pv.parameterId === printingcolorsDetail.id).valueIds.length;
        const updateValues = (paramValue, defaultValue) => {
          if (paramValue.valueIds.length < colorCount) {
            paramValue.valueIds = Array(colorCount).fill(defaultValue);
          } else {
            paramValue.valueIds = paramValue.valueIds.slice(0, colorCount);
          }
        };
  
        updateValues(loadParamValue, loadParameter.defaultValue);
        updateValues(layersParamValue, layersParameter.defaultValue);
  
        // Update the parameter with the new selectedParameterValues
        const updatedParameter = {
          ...parameter,
          valuesConfigs: valuesConfigsList.map(config => {
            if (config.isDefault) {
              return {
                ...config,
                selectedParameterValues
              };
            }
            return config;
          })
        };
        setUpdatedParameter(updatedParameter)
        setSettingParameters(prev => ({
          ...prev,
          parameter: updatedParameter
        }));
        console.log("updatedParameter",updatedParameter)
  
        // Optionally, call the API to persist changes
        // updatedProductParameteDefaultValue(settingParameters.sectionId, settingParameters.subSectionId, updatedParameter);
      }
    } else {
      let newSubProducts = lodashClonedeep(subProducts);
      if (e.target.checked) {
        newSubProducts = addValueToSubProduct(newSubProducts, value);
        setIsChecked(true);
      } else {
        newSubProducts = removeValueFromSubProduct(newSubProducts, value);
        setIsChecked(false);
      }
      setSubProducts(newSubProducts);
    }
  };

  const isCheckedMemo = useMemo(() => {
    const colorParameterValue = getSelectedColorParameterValue();
    if (isParameterSettings) {
      return colorParameterValue?.valueIds?.includes(value.valueId);
    } else {
      return colorParameterValue?.values?.includes(value.valueId);
    }
  }, [subProducts, settingParameters, isParameterSettings, value,getSelectedColorParameterValue]);

  useEffect(() => {
    setIsChecked(isCheckedMemo);
  }, [isCheckedMemo]);


  const textInputValue = useMemo(() => {
    if(!isParameterSettings){
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
    }
    else {
      return  item.defaultValue;
    }
   
  }, [subProducts]);
  
  const setTextInputValue = (textInputVal) =>{
    if(!isParameterSettings){
      let newSubProducts = lodashClonedeep(subProducts);
      newSubProducts = setSubProductValue(newSubProducts,item.id,value,textInputVal);
      setSubProducts(newSubProducts);
    }
    else {
      return textInputVal
    }
   
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
    if (!isParameterSettings) {
      if (!subProducts) return null;
  
      const subSection = settingParameters.subSection;
      const subProductType = subSection.type;
      const subProduct = subProducts.find(sub => sub.type === subProductType);
  
      if (subProduct) {
        const parameterValue = subProduct.parameters.find(paramValue => paramValue.parameterId === settingParameters.parameter.id);
        if (parameterValue && parameterValue.valueIds && parameterValue.valueIds.length > 0) {
          const val = parameterValue.valueIds[0]; // Assuming this represents the relevant value ID
          const valueConfig = settingParameters.parameter.valuesConfigs.find(conf => conf.id === val);
          if (valueConfig) {
            const selectedParameterValue = valueConfig.selectedParameterValues[0];
            return selectedParameterValue.selectValuesCount; // Max allowed selections
          }
        }
      }
      return null;
    } else {
      const valuesConfigs = settingParameters.parameter.valuesConfigs;
      const defaultValueConfig = valuesConfigs.find(item => item.isDefault);
      if (defaultValueConfig) {
        const selectedColorParameterValue = defaultValueConfig.selectedParameterValues.find(paramValue => paramValue.parameterId === settingParameters.parameter.settingParameters[0].id);
        if (selectedColorParameterValue) {
          return selectedColorParameterValue.selectValuesCount; // Max allowed selections
        }
      }
      return null;
    }
  };
  const isDisabled = useMemo(() => {
    if(isParameterSettings){
      const maxSelection = getMaxSelectionValues();
      if (maxSelection === null) return false;
    
      const colorParameterValue = getSelectedColorParameterValue();
      if (colorParameterValue && colorParameterValue.valueIds) {
        const isValueExists = colorParameterValue.valueIds.includes(value.valueId);
        return !isValueExists && colorParameterValue.valueIds.length >= maxSelection;
      }
    
      return false;
    }
    else{
      const maxSelection = getMaxSelectionValues();
      if (maxSelection === null) return false;
    
      const colorParameterValue = getSelectedColorParameterValue();
      if (colorParameterValue && colorParameterValue.values) {
        const isValueExists = colorParameterValue.values.includes(value.valueId);
        return !isValueExists && colorParameterValue.values.length >= maxSelection;
      }
    
      return false;
    }
    
  }, [subProducts, settingParameters, isParameterSettings, value,getSelectedColorParameterValue]);
  console.log("isDisabled",isDisabled)

 
  // const onClickSaveUpdatedParameters = ()=>{
  //           updatedProductParameteDefaultValue(settingParameters.sectionId?.id, settingParameters.subSectionId?.id, updatedParameter);
  // }

  
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
    textInputValue,
    isCheckedMemo,
  };
};

export { useSubChildMapping };
