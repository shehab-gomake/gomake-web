import lodashClonedeep from "lodash.clonedeep";

const userMultiParameterModalValues = (settingParameters,isParameterSettings) => {

    const getSubProduct = (subProducts, subSectionType) => {
        let subProduct = subProducts.find(sub => sub.type === subSectionType);
        if (subProduct) {
          subProduct.parameters = removeDuplicateParameters(subProduct.parameters);
        }
        return subProduct;
      };
      
      const removeDuplicateParameters = (parameters) => {
        let seen = new Set();
        return parameters.filter(param => {
          const isDuplicate = seen.has(param.parameterId);
          seen.add(param.parameterId);
          return !isDuplicate;
        });
      };
      const ensureParametersExist = (subProduct, settingParameters, section, subSection) => {
        settingParameters.forEach(settingParam => {
          const existingParam = subProduct.parameters.find(param => param.parameterId === settingParam.id);
          if (!existingParam) {
            subProduct.parameters.push({
              parameterId: settingParam.id,
              parameterName: settingParam.name,
              actionId: settingParam.actionId,
              parameterType: settingParam.parameterType,
              values: [],
              valueIds: [],
              sectionId: section.id,
              subSectionId: subSection.id,
              actionIndex: settingParam.actionIndex,
            });
          }
        });
        return subProduct;
      };
      
      const updateValues = (subProduct, value, settingParameters) => {
        const colorParam = settingParameters.find(param => param.code === "printingcolorsDetail");
        const loadParam = settingParameters.find(param => param.code === "Colorloadpercentage");
        const layersParam = settingParameters.find(param => param.code === "ColorLayers");
    
        const colorParamValue = subProduct.parameters.find(param => param.parameterId === colorParam.id);
        const loadParamValue = subProduct.parameters.find(param => param.parameterId === loadParam.id);
        const layersParamValue = subProduct.parameters.find(param => param.parameterId === layersParam.id);
    
        const index = colorParam.defaultValueArray.indexOf(value.valueId);
        if (index !== -1) {
            const layerValue = layersParam.defaultValueArray[index];
            const loadValue = loadParam.defaultValueArray[index];
            // Add color value only if it doesn't exist
            if (!colorParamValue.valueIds.includes(value.valueId)) {
                colorParamValue.valueIds.push(value.valueId);
                loadParamValue.valueIds.push(loadValue);
                layersParamValue.valueIds.push(layerValue);
                colorParamValue.values.push(value.value);
                loadParamValue.values.push(loadValue);
                layersParamValue.values.push(layerValue);

            }
             
        }
    
        return subProduct;
    };
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

      const addValueToSubProduct = (subProducts, value, settingParameters, section, subSection) => {
        let subProductsCopy = lodashClonedeep(subProducts);
        let subProduct = getSubProduct(subProductsCopy, subSection.type);
      
        if (!subProduct) {
          console.error('SubProduct not found for subSection.type:', subSection.type);
          return subProductsCopy;
        }
      
        subProduct = ensureParametersExist(subProduct, settingParameters.parameter.settingParameters, section, subSection);
      
        if (!subProduct) {
          console.error('SubProduct parameters not ensured.');
          return subProductsCopy;
        }
      
        subProduct = updateValues(subProduct, value, settingParameters.parameter.settingParameters);
      
        return subProductsCopy;
      };
      const removeValueFromSubProduct = (subProducts, value) => {
        if (!isParameterSettings) {
          const subSection = settingParameters.subSection;
          let subProductsCopy = lodashClonedeep(subProducts);
          const subProductType = subSection.type;
          let subProduct = subProductsCopy.find(sub => sub.type === subProductType);
          subProduct.parameters = removeDuplicateParameters(subProduct.parameters);
      
          const colorParameter = settingParameters.parameter.settingParameters.find(param => param.code === "printingcolorsDetail");
          const loadParameter = settingParameters.parameter.settingParameters.find(param => param.code === "Colorloadpercentage");
          const layersParameter = settingParameters.parameter.settingParameters.find(param => param.code === "ColorLayers");
      
          const colorParameterValue = subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id);
          const loadParameterValue = subProduct.parameters.find(paramValue => paramValue.parameterId === loadParameter.id);
          const layersParameterValue = subProduct.parameters.find(paramValue => paramValue.parameterId === layersParameter.id);
      
          if (colorParameterValue && colorParameterValue.valueIds && colorParameterValue.values) {
            const valueIndex = colorParameterValue.valueIds.findIndex(val => val === value.valueId);
            if (valueIndex !== -1) {
              colorParameterValue.valueIds.splice(valueIndex, 1);
      
              if (loadParameterValue && loadParameterValue.valueIds && loadParameterValue.values.length > valueIndex) {
                loadParameterValue.valueIds.splice(valueIndex, 1);
              }
      
              if (layersParameterValue && layersParameterValue.valueIds && layersParameterValue.values.length > valueIndex) {
                layersParameterValue.valueIds.splice(valueIndex, 1);
              }
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
        removeDuplicateParameters
    };
};

export { userMultiParameterModalValues };
