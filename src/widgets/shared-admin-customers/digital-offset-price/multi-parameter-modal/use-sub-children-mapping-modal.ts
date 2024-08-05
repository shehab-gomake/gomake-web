import {useEffect, useMemo, useState} from "react";
import {useRecoilState, } from "recoil";
import lodashClonedeep from "lodash.clonedeep";
import {useClickAway} from "@uidotdev/usehooks";
import {subProductsCopyParametersState, } from "@/store";
import {
  userMultiParameterModalValues
} from "@/widgets/shared-admin-customers/digital-offset-price/multi-parameter-modal/use-multi-parameter-modal-values";

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
  const {
    addValueToSubProduct,
    removeValueFromSubProduct,
    setSubProductValue,
    setSubProductValueForParameterSettings,
    setSubProductValueForParameterSettingsDefaultValueArray
  } = userMultiParameterModalValues(settingParameters,isParameterSettings)
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
      if(valueConfigDefault){
        const colorParameter = settingParameters?.parameter?.settingParameters.find(item => item.code === "printingcolorsDetail");
        return valueConfigDefault?.selectedParameterValues?.find(paramValue => paramValue.parameterId === colorParameter.id);
      }
    
    }
  };
  const [isChecked, setIsChecked] = useState(false);

useEffect(()=>{
  getSelectedColorParameterValue()
},[])

  const onChangeCheckBox = (e) => {
    if (isParameterSettings) {
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
                paramValue.valueIds.push(value.valueId);
              }
            } else {
              paramValue.valueIds = paramValue.valueIds.filter(val => val !== value.valueId);
            }
          }
          return paramValue;
        });
  
        const ensureParameterValue = (paramId) => {
          let paramValue = selectedParameterValues.find(pv => pv.parameterId === paramId);
          if (!paramValue) {
            paramValue = { parameterId: paramId, valueIds: [], selectValuesCount: selectedParameterValues[0]?.selectValuesCount };
            selectedParameterValues.push(paramValue);
          }
          return paramValue;
        };
  
        const loadParamValue = ensureParameterValue(loadParameter.id);
        const layersParamValue = ensureParameterValue(layersParameter.id);
  
        const colorParamValue = selectedParameterValues.find(pv => pv.parameterId === printingcolorsDetail.id);
        const colorDefaultValueArray = printingcolorsDetail.defaultValueArray;
  
        // Sync load and layer values with the selected color values
        const updateValues = (paramValue, defaultValueArray) => {
          const newValues = colorParamValue.valueIds.map(val => {
            const index = colorDefaultValueArray.findIndex(defaultVal => defaultVal === val);
            return defaultValueArray[index];
          });
          paramValue.valueIds = newValues;
        };
  
        updateValues(loadParamValue, loadParameter.defaultValueArray);
        updateValues(layersParamValue, layersParameter.defaultValueArray);
  
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
        setSettingParameters(prev => ({
          ...prev,
          parameter: updatedParameter
        }));
      }
    } else {
      let newSubProducts = lodashClonedeep(subProducts);
      if (e.target.checked) {
        newSubProducts = addValueToSubProduct(newSubProducts, value);
        setSubProducts(newSubProducts);
        setIsChecked(true);
      } else {
        newSubProducts = removeValueFromSubProduct(newSubProducts, value);
        setSubProducts(newSubProducts);
        setIsChecked(false);
      }
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
    if (!isParameterSettings) {
      if (!subProducts) return item.defaultValue;
  
      const subSection = settingParameters.subSection;
      let subProductsCopy = lodashClonedeep(subProducts);
      const subProductType = subSection.type;
      let subProduct = subProductsCopy.find(sub => sub.type == subProductType);
      const colorParameter = settingParameters?.parameter?.settingParameters[0];
      const colorParameterValue = subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id);
  
      if (colorParameterValue) {
        const valueIndex = colorParameterValue.valueIds.findIndex(val => val === value.valueId);
  
        if (valueIndex !== -1) {
          const parameterValue = subProduct.parameters.find(paramValue => paramValue.parameterId === item.id);
  
          if (parameterValue && parameterValue.values && parameterValue.values.length > valueIndex) {
            return parameterValue.values[valueIndex];
          }
        }
      }
  
      // If not found in subProducts, fallback to defaultValueArray
      if (colorParameter) {
        const valueIndex = colorParameter.defaultValueArray?.findIndex(val => val === value.valueId);
        if (valueIndex !== -1) {
          const fallbackParameter = settingParameters?.parameter?.settingParameters.find(param => param.id === item.id);
          if (fallbackParameter && fallbackParameter.defaultValueArray && fallbackParameter.defaultValueArray.length > valueIndex) {
            return fallbackParameter.defaultValueArray[valueIndex];
          }
        }
      }
  
      return item.defaultValue;
    }
    else {
      const colorParameter = settingParameters?.parameter?.settingParameters.find(param => param.code === "printingcolorsDetail");
      if (!colorParameter) return item.defaultValue;
  
      const valueIndex = colorParameter?.defaultValueArray?.findIndex(val => val === value.valueId);
      if (valueIndex === -1) return item.defaultValue;
      const parameterToUpdate = settingParameters?.parameter?.settingParameters.find(param => param.id === item.id);
      if (!parameterToUpdate || !parameterToUpdate.defaultValueArray) return item.defaultValue;
  
      if (parameterToUpdate.defaultValueArray.length > valueIndex) {

        return parameterToUpdate.defaultValueArray[valueIndex];
      }
      return item.defaultValue;
    }
   
  }, [subProducts, isParameterSettings, item, value, settingParameters, parameters]);
  const setTextInputValue = (textInputVal, parameterId) => {
    if (isParameterSettings) {
      const parameter = settingParameters?.parameter;
      const valuesConfigsList = parameter?.valuesConfigs;
      const defaultValueConfig = valuesConfigsList?.find(item => item.isDefault);
      
      const updatedParameters = setSubProductValueForParameterSettings(defaultValueConfig?.selectedParameterValues, parameterId, value, textInputVal);
      const updatedParametersDefaultValueArray = setSubProductValueForParameterSettingsDefaultValueArray(settingParameters?.parameter?.settingParameters, parameterId, value, textInputVal);
      setSettingParameters(prev => ({
        ...prev,
        parameter: {
          ...parameter,
          settingParameters: updatedParametersDefaultValueArray,
          valuesConfigs: valuesConfigsList.map(config => 
            config.isDefault ? { ...config, selectedParameterValues: updatedParameters } : config
          )
        }
      }));
    } else {
      // Existing logic for subProducts update
      let newSubProducts = lodashClonedeep(subProducts);
      newSubProducts = setSubProductValue(newSubProducts, item.id, value, textInputVal);
      setSubProducts(newSubProducts);
    }
  };
  const onChangeText = (e,paramId) => {
    setTextInputValue(e.target.value,paramId);
  };

  const incrementValue = (paramId) => {
    let currentValue = textInputValue.toString();
    currentValue = (parseInt(currentValue) + 1).toString();
    setTextInputValue(currentValue,paramId);
  };
  const decrementValue = (paramId) => {
    let currentValue = textInputValue.toString();
    currentValue = (parseInt(currentValue) - 1).toString();
    setTextInputValue(currentValue,paramId);
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
