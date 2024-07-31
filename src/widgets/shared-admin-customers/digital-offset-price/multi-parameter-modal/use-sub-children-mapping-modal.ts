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
  isParameterSettings
}) => {

  console.log("parameters",{parameters,item,value,settingParameters})


  const { callApi } = useGomakeAxios();
  const { alertFaultAdded, alertSuccessAdded } = useSnackBar();
  const router = useRouter();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [subProducts, setSubProducts] = useRecoilState<any>(subProductsCopyParametersState);
  const {addValueToSubProduct,removeValueFromSubProduct,setSubProductValue} = userMultiParameterModalValues(settingParameters,isParameterSettings)
  const selectColorValue = useRecoilValue<any>(selectColorValueState);
  const ref = useClickAway(() => {
    setIsFocused(false);
  });
  // const getSelectedColorParameterValue = ()=>{
  //   if(subProducts && !isParameterSettings){
  //     const subSection = settingParameters.subSection;
  //     const subProductType = subSection.type;
  //     let subProduct =  subProducts.find(sub => sub.type == subProductType);
  //     const colorParameter = settingParameters?.parameter?.settingParameters[0];
  //     return subProduct.parameters.find(paramValue => paramValue.parameterId === colorParameter.id && paramValue.values);
  //   }
  //   else {
  //     const valuesConfigs = settingParameters?.parameter?.valuesConfigs
  //     const valueConfigDefault = valuesConfigs?.find((item)=>item.isDefault)
  //     const colorParameter = settingParameters?.parameter?.settingParameters.find(item => item.code === "printingcolorsDetail");
  //     return valueConfigDefault.selectedParameterValues.find(paramValue => paramValue.parameterId === colorParameter.id);


  //   }
    
  // }
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
        console.log("updatedParameter", updatedParameter);
  
        // Call the API to update the parameter
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
      return colorParameterValue?.valueIds?.includes(value.valueId) ?? false;
    } else {
      return colorParameterValue?.values?.includes(value.valueId) ?? false;
    }
  }, [subProducts, settingParameters, isParameterSettings, value]);

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
      console.log("textInputVal",textInputVal)
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
          const val = parameterValue.valueIds[0];
          const valueConfig = settingParameters.parameter.valuesConfigs.find(conf => conf.id === val);
          if (valueConfig) {
            const selectedParameterValue = valueConfig.selectedParameterValues[0];
            return selectedParameterValue.selectValuesCount;
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
          return selectedColorParameterValue.selectValuesCount;
        }
      }
      return null;
    }
  };
  const isDisabled = useMemo(() => {
    const maxSelection = getMaxSelectionValues();
    if (maxSelection === null) return false;
  
    const colorParameterValue = getSelectedColorParameterValue();
    if (colorParameterValue && colorParameterValue.values) {
      const isValueExists = colorParameterValue.values.includes(value.valueId);
      if (isValueExists) return false; // Allow selection if already exists
  
      return colorParameterValue.values.length >= maxSelection;
    }
  
    return false;
  }, [subProducts, settingParameters, isParameterSettings, value]);


  const updatedValuesConfigsForParameters = useCallback(
    async (sectionId: string, subSectionId: string, data: any) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter111`,
        {
          productId: router?.query?.id,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: data,
        }
      );
      if (res?.success) {
        alertSuccessAdded()
      } else {
        alertFaultAdded()
      }
    },
    [router]
  );

  const updatedProductParameteDefaultValue = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      console.log("parameter",parameter)
        await updatedValuesConfigsForParameters(sectionId, subSectionId, {
          parameter: {
            ...parameter,
            valuesConfigs: []
          },
        });
    },

    [router]
  );

  
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
