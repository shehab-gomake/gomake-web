import {useRecoilValue} from "recoil";
import {selectColorValueState} from "./store/selecte-color-value";
import lodashClonedeep from "lodash.clonedeep";

const userMultiParameterModalValues = (settingParameters,isParameterSettings) => {

    const removeDuplicateParameters = (parameters) => {
        const uniqueParameters = [];
        const seenParameterIds = new Set();
      
        parameters.forEach((parameter) => {
          if (!seenParameterIds.has(parameter.parameterId)) {
            uniqueParameters.push(parameter);
            seenParameterIds.add(parameter.parameterId);
          }
        });
      
        return uniqueParameters;
      };

    const selectColorValue = useRecoilValue<any>(selectColorValueState);
    const getSelectedColorParameterValue = (subProducts) => {
        if (subProducts && !isParameterSettings) {
          const subSection = settingParameters.subSection;
          const subProductType = subSection.type;
          let subProduct = subProducts.find(sub => sub.type === subProductType);
          const colorParameter = settingParameters?.parameter?.settingParameters[0];
          return subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id && paramValue.values);
        }
        return null; // Return null if subProducts is null or undefined
      };
      
      const addValueToSubProduct = (subProducts, value) => {
        if (!isParameterSettings) {
          const selectedColorParameterValue = getSelectedColorParameterValue(subProducts);
      
          if (selectedColorParameterValue && selectColorValue?.selectedParameterValues[0]?.selectValuesCount <= selectedColorParameterValue?.valueIds?.length) {
            return subProducts;
          }
          const section = settingParameters.section;
          const subSection = settingParameters.subSection;
          let subProductsCopy = lodashClonedeep(subProducts);
          const subProductType = subSection.type;
          let subProduct = subProductsCopy.find(sub => sub.type === subProductType);
          subProduct.parameters = removeDuplicateParameters(subProduct.parameters);
          const colorParameter = settingParameters?.parameter?.settingParameters[0];
          const colorParameterValue = subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id);
      
          if (colorParameterValue) {
            if (!colorParameterValue.valueIds) {
              colorParameterValue.valueIds = [];
            }
            if (!colorParameterValue.values) {
              colorParameterValue.values = [];
            }
      
            let settingParameterIndex = 0;
            settingParameters?.parameter?.settingParameters.forEach(settingParameter => {
              let newParamValues = [];
              let newParamValueIds = [];
              const currentSubProductParameter = subProduct.parameters.find(x => x.parameterId === settingParameter?.id);
      
              if (settingParameterIndex === 0) {
                newParamValueIds = [...colorParameterValue.valueIds, value.valueId];
                newParamValues = [...colorParameterValue.values, value.value];
              } else {
                if (currentSubProductParameter) {
                  // Use values from defaultValueArray if they exist, otherwise use the default value
                  const fallbackParameter = settingParameters?.parameter?.settingParameters.find(param => param.id === settingParameter?.id);
                  const fallbackValue = fallbackParameter?.defaultValueArray?.length > colorParameterValue.valueIds.length
                    ? fallbackParameter.defaultValueArray[colorParameterValue.valueIds.length]
                    : settingParameter.defaultValue;
      
                  newParamValues = [...currentSubProductParameter.values, fallbackValue];
                } else {
                  newParamValues.push(settingParameter.defaultValue);
                }
              }
      
              if (currentSubProductParameter) {
                currentSubProductParameter.valueIds = newParamValueIds;
                currentSubProductParameter.values = newParamValues;
              } else {
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
                });
              }
      
              settingParameterIndex++;
            });
          } else {
            let settingParameterIndex = 0;
            settingParameters?.parameter?.settingParameters.forEach(settingParameter => {
              const newParamValues = [];
              const newParamValueIds = [];
              if (settingParameterIndex === 0) {
                newParamValues.push(value.value);
                newParamValueIds.push(value.valueId);
              } else {
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
              });
              settingParameterIndex++;
            });
          }
          return subProductsCopy;
        }
        return subProducts; // Return the original subProducts if isParameterSettings is true
      };
      
      const removeValueFromSubProduct = (subProducts, value) => {
        if (!isParameterSettings) {
          const section = settingParameters.section;
          const subSection = settingParameters.subSection;
          let subProductsCopy = lodashClonedeep(subProducts);
          const subProductType = subSection.type;
          let subProduct = subProductsCopy.find(sub => sub.type === subProductType);
          subProduct.parameters = removeDuplicateParameters(subProduct.parameters);
          const colorParameter = settingParameters?.parameter?.settingParameters[0];
          const colorParameterValue = subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id);
          if (colorParameterValue && colorParameterValue.valueIds && colorParameterValue.values) {
            const valueIndex = colorParameterValue.valueIds.findIndex(val => val === value.valueId);
            if (valueIndex !== -1) {
              colorParameterValue.valueIds.splice(valueIndex, 1);
              colorParameterValue.values.splice(valueIndex, 1);
      
              settingParameters?.parameter?.settingParameters.forEach(settingParameter => {
                const param = subProduct.parameters.find(p => p.parameterId === settingParameter?.id);
                if (param && param.values.length > valueIndex) {
                  param.values.splice(valueIndex, 1);
                }
                if (param && param.valueIds.length > valueIndex) {
                  param.valueIds.splice(valueIndex, 1);
                }
                if (!param.values || param.values.length === 0) {
                  subProduct.parameters = subProduct.parameters.filter(p => p.parameterId != settingParameter?.id);
                }
              });
            }
          }
      
          return subProductsCopy;
        }
        return subProducts; // Return the original subProducts if isParameterSettings is true
      };
      const setSubProductValue = (subProducts, parameterId, value, textInputVal) => {
        if (!isParameterSettings) {
          const subSection = settingParameters.subSection;
          let subProductsCopy = lodashClonedeep(subProducts);
          const subProductType = subSection.type;
          let subProduct = subProductsCopy.find(sub => sub.type === subProductType);
      
          if (!subProduct) {
            return subProductsCopy;
          }
      
          // Remove duplicate parameters from the subProduct
          subProduct.parameters = removeDuplicateParameters(subProduct.parameters);
      
          const colorParameter = settingParameters?.parameter?.settingParameters[0];
          const colorParameterValue = subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id);
      
          if (colorParameterValue) {
            const valueIndex = colorParameterValue.valueIds.findIndex(val => val === value.valueId);
      
            if (valueIndex !== -1) {
              const parameterValueIndex = subProduct.parameters.findIndex(paramValue => paramValue.parameterId === parameterId);
              if (parameterValueIndex !== -1) {
                const parameterValue = subProduct.parameters[parameterValueIndex];
      
                if (parameterValue && parameterValue.values) {
                  parameterValue.values[valueIndex] = textInputVal;
                  subProduct.parameters[parameterValueIndex] = parameterValue; // Ensure the updated parameter is placed back
                  console.log("parameterValueIndex", {parameterValueIndex, parameterValue, valueIndex, subProduct});
                }
              }
            }
          }
          return subProductsCopy;
        }
        return subProducts; // Return the original subProducts if isParameterSettings is true
      };
    const setSubProductValueForParameterSettings = (selectedParameterValues, parameterId, value, textInputVal) => {
        if (isParameterSettings) {
          // Clone the selectedParameterValues to avoid mutating the original state
          let parametersCopy = lodashClonedeep(selectedParameterValues);
          
          // Step 1: Find the parameter for colors to get the correct index
          const colorParameter = parametersCopy.find(param => param.parameterId === "8eff3238-a321-48f3-85eb-c14afaccbff3");
          if (!colorParameter) return parametersCopy; // Exit if color parameter not found
          
          // Step 2: Find the index of the valueId within the colors parameter
          const valueIndex = colorParameter.valueIds.indexOf(value.valueId);
          if (valueIndex === -1) return parametersCopy; // Exit if valueId not found
          
          // Step 3: Find the parameter to be updated using the parameterId
          const parameterToUpdate = parametersCopy.find(param => param.parameterId === parameterId);
          if (!parameterToUpdate || !parameterToUpdate.valueIds) return parametersCopy; // Exit if parameter not found
          
          // Step 4: Update the value at the correct index
          parameterToUpdate.valueIds[valueIndex] = textInputVal;
          
          return parametersCopy; // Return the updated parameters
        }
        return selectedParameterValues; // If isParameterSettings is false, return the original values
      };

      const setSubProductValueForParameterSettingsDefaultValueArray = (parameters, parameterId, value, textInputVal) => {

        // Step 1: Find the parameter for colors to get the correct index
        const colorsParameter = parameters.find(param => param.code === "printingcolorsDetail");
        if (!colorsParameter) return parameters; // Exit if color parameter not found
      
        // Step 2: Find the index of the valueId within the colors parameter
        const valueIndex = colorsParameter.defaultValueArray.findIndex(val => val === value.valueId);
        if (valueIndex === -1) return parameters; // Exit if valueId not found
      
        // Step 3: Find the parameter to be updated using the parameterId
        const parameterToUpdate = parameters.find(param => param.id === parameterId);
        if (!parameterToUpdate) return parameters; // Exit if parameter not found
      
        // Step 4: Update the value at the correct index in defaultValueArray
        const updatedParameters = parameters.map(param => {
          if (param.id === parameterId) {
            const newDefaultValueArray = [...param.defaultValueArray];
            newDefaultValueArray[valueIndex] = textInputVal;
            return {
              ...param,
              defaultValueArray: newDefaultValueArray
            };
          }
          return param;
        });
      
        return updatedParameters; // Return the updated parameters array
      };
    return {
        addValueToSubProduct,
        removeValueFromSubProduct,
        setSubProductValue,
        getSelectedColorParameterValue,
        setSubProductValueForParameterSettings,
        setSubProductValueForParameterSettingsDefaultValueArray,
    };
};

export { userMultiParameterModalValues };
