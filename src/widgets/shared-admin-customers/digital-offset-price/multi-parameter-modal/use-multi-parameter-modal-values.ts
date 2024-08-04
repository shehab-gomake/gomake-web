import {useRecoilValue} from "recoil";
import {selectColorValueState} from "./store/selecte-color-value";
import lodashClonedeep from "lodash.clonedeep";
import { useState } from "react";

const userMultiParameterModalValues = (settingParameters,isParameterSettings) => {
  const [textInputValue,setTextInputValueState]=useState("")

    const selectColorValue = useRecoilValue<any>(selectColorValueState);

    const getSelectedColorParameterValue = (subProducts)=>{
        if(subProducts &&!isParameterSettings){
            const subSection = settingParameters.subSection;
            const subProductType = subSection.type;
            let subProduct =  subProducts.find(sub => sub.type == subProductType);
            const colorParameter = settingParameters?.parameter?.settingParameters[0];
            return subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id && paramValue.values);
        }
        
    }
    const addValueToSubProduct =(subProducts,value)=>{
        if(!isParameterSettings){
            const selectedColorParameterValue  = getSelectedColorParameterValue(subProducts);
            if(selectColorValue?.selectedParameterValues[0]?.selectValuesCount <= selectedColorParameterValue?.valueIds?.length){
                return subProducts;
            }
            const section = settingParameters.section;
            const subSection = settingParameters.subSection;
            let subProductsCopy = lodashClonedeep(subProducts);
            const subProductType = subSection.type;
            let subProduct =  subProductsCopy.find(sub => sub.type == subProductType);
            const colorParameter = settingParameters?.parameter?.settingParameters[0];
            const colorParameterValue  = subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id );
            if(colorParameterValue){
                if(!colorParameterValue.valueIds){
                    colorParameterValue.valueIds =[];
                }
                if(!colorParameterValue.values){
                    colorParameterValue.values =[];
                }
    
                let settingParameterIndex = 0;
                settingParameters?.parameter?.settingParameters.forEach(settingParameter=>{
                    let newParamValues = [];
                    let newParamValueIds = [];
                    const currentSubProductParameter = subProduct.parameters.find(x=> x.parameterId === settingParameter?.id);
                    if(settingParameterIndex === 0){
                        newParamValueIds = [...colorParameterValue.valueIds,value.valueId]
                        newParamValues = [...colorParameterValue.values,value.value];
                    }else{
                        if(currentSubProductParameter){
                            newParamValues = [...currentSubProductParameter.values,settingParameter.defaultValue];
                        }else{
                            newParamValues.push(settingParameter.defaultValue);
                        }
    
                    }
    
                    if(currentSubProductParameter){
                        currentSubProductParameter.valueIds = newParamValueIds;
                        currentSubProductParameter.values = newParamValues;
                    }else{
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
                    }
    
                    settingParameterIndex++;
                });
            }
            else{
                let settingParameterIndex = 0;
                settingParameters?.parameter?.settingParameters.forEach(settingParameter=>{
                    const newParamValues = [];
                    const newParamValueIds = [];
                    if(settingParameterIndex === 0){
                        newParamValues.push(value.value);
                        newParamValueIds.push(value.valueId);
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
            return subProductsCopy;
        }
      
    }

    const removeValueFromSubProduct =(subProducts,value)=>{
        if(!isParameterSettings){
            const section = settingParameters.section;
            const subSection = settingParameters.subSection;
            let subProductsCopy = lodashClonedeep(subProducts);
            const subProductType = subSection.type;
            let subProduct =  subProductsCopy.find(sub => sub.type == subProductType);
            const colorParameter = settingParameters?.parameter?.settingParameters[0];
            const colorParameterValue  = subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id );
            if(colorParameterValue && colorParameterValue.valueIds && colorParameterValue.values){
                const valueIndex = colorParameterValue.valueIds.findIndex(val => val === value.valueId);
                settingParameters?.parameter?.settingParameters.forEach(settingParameter=>{
                    const param = subProduct.parameters.find(p => p.parameterId === settingParameter?.id);
                    if(param && param.values.length > valueIndex){
                        param.values.splice(valueIndex, 1);
                    }
                    if(param && param.valueIds.length > valueIndex){
                        param.valueIds.splice(valueIndex, 1);
                    }
                    if(!param.values || param.values.length === 0 ){
                        subProduct.parameters = subProduct.parameters.filter(p=> p.parameterId != settingParameter?.id);
                    }
                })
            }
    
            return subProductsCopy;
        }
    }
    const setSubProductValue = (subProducts,parameterId,value,textInputVal) =>{
        if(!isParameterSettings){
            const subSection = settingParameters.subSection;
            let subProductsCopy = lodashClonedeep(subProducts);
            const subProductType = subSection.type;
            let subProduct =  subProductsCopy.find(sub => sub.type == subProductType);
            const colorParameter = settingParameters?.parameter?.settingParameters[0];
            const colorParameterValue  = subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id );
            if(colorParameterValue){
                const valueIndex = colorParameterValue.valueIds.findIndex(val => val === value.valueId);

                if(valueIndex !== -1){
                    const parameterValue = subProduct.parameters.find(paramValue => paramValue.parameterId === parameterId );
                    if(parameterValue && parameterValue.values && parameterValue.values.length > valueIndex){
                        parameterValue.values[valueIndex] = textInputVal;
                    }
                }
            }
            return subProductsCopy;
        }
       
    }

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
    return {
        addValueToSubProduct,
        removeValueFromSubProduct,
        setSubProductValue,
        getSelectedColorParameterValue,
        setSubProductValueForParameterSettings,
        textInputValue,setTextInputValueState
    };
};

export { userMultiParameterModalValues };
