import {useEffect, useMemo, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {maltiParameterState} from "./store/multi-param-atom";
import {selectColorValueState} from "./store/selecte-color-value";
import lodashClonedeep from "lodash.clonedeep";
import {useClickAway} from "@uidotdev/usehooks";
import {subProductsParametersState} from "@/store";

const userMultiParameterModalValues = (settingParameters) => {
    
    const addValueToSubProduct =(subProducts,value)=>{
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

    const removeValueFromSubProduct =(subProducts,value)=>{
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
    const setSubProductValue = (subProducts,parameterId,value,textInputVal) =>{
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
    return {
        addValueToSubProduct,
        removeValueFromSubProduct,
        setSubProductValue
    };
};

export { userMultiParameterModalValues };
