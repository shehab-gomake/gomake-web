import {useRecoilValue, useSetRecoilState} from "recoil";
import {machineState as STATE} from "@/widgets/machines/state/machine-state";
import {useEffect, useState} from "react";
import {machineInputs} from "@/widgets/machines/utils/attributes/machine-inputs/machine-inputs";
import {getCategoryBasicInputs} from "@/widgets/machines/utils/attributes/basic-inputs";
import {getCategoryMediaInputs} from "@/widgets/machines/utils/attributes/media-inputs";
import {getCategoryFeedersStackersInputs} from "@/widgets/machines/utils/attributes/feeders-stackers-inputs";
import {getCategoryColorsInputs} from "@/widgets/machines/utils/attributes/colors-inputs";
import {getCategoryBeatsInputs} from "@/widgets/machines/utils/attributes/beats-inputs";
import {getCategoryMachineDimensionsInputs} from "@/widgets/machines/utils/attributes/machine-dimensions";
import {getCategoryCoatingInputs} from "@/widgets/machines/utils/attributes/coating-inputs";
import {getCategoryPlateInputs} from "@/widgets/machines/utils/attributes/plate-inputs";
import {getCategoryBlanketCylinderInputs} from "@/widgets/machines/utils/attributes/blanket-cylinder-inputs";
import {getCategoryUnWinderInputs} from "@/widgets/machines/utils/attributes/unwinder-rewinder";
import {getCategoryRunInputs} from "@/widgets/machines/utils/attributes/run-inputs";
import {getCategoryConnectionInputs} from "@/widgets/machines/utils/attributes/connection-inputs";
import {getCategorySpeedInputs} from "@/widgets/machines/utils/attributes/speed-inputs";
import {getCategoryCuttingOptionsInputs} from "@/widgets/machines/utils/attributes/cutting-options-inputs";
import {getCategoryInputs} from "@/widgets/machines/utils/attributes/other-settings";
import {getCategoryStapleInputs} from "@/widgets/machines/utils/attributes/staple";
import {printColorsParameterValuesState} from "@/widgets/machines/state/print-colors-parameter-values-state";


const useMachineAttributes = () => {
    const machineState = useRecoilValue(STATE);
    const setMachine = useSetRecoilState(STATE);
    const [errors, setErrors] = useState<Record<string, boolean>>({})
    const printColors = useRecoilValue(printColorsParameterValuesState);
    const [machineHourCostValue, setMachineHourCostValue] = useState<number>();
    const machineHourCost = () => {
        if (machineState?.price?.price !==0 && machineState.attributes?.dailyProductivityInHours !==0 && machineState.attributes?.lifeExpectancyYears !==0 && machineState.attributes?.monthlyMaintenanceCost !==0 && machineState.attributes?.monthlyCostOfSpace !==0 && machineState.attributes?.electricityCostPerWorkingHour !==0) {
            return machineState?.price?.price /
                (+machineState.attributes?.dailyProductivityInHours * +machineState.attributes?.lifeExpectancyYears * 22 * 12) +
                +machineState.attributes?.monthlyMaintenanceCost / (22 * 8) +
                +machineState.attributes?.electricityCostPerWorkingHour + +machineState.attributes?.monthlyCostOfSpace / (22 * 8);
        }
        return 0
    };

    // Track changes to machineHourCost calculation values
    useEffect(() => {
            const computedCost = Number(machineHourCost()?.toFixed(2));
            setMachineHourCostValue(computedCost);
            const currentAttrCost = Number(machineState?.attributes?.machineHourCost);
            const currentPriceCost = Number(machineState?.price?.machineHourCost);
            if (currentAttrCost !== computedCost || currentPriceCost !== computedCost) {
                setMachine({
                    ...machineState,
                    attributes: {
                        ...machineState.attributes,
                        machineHourCost: computedCost
                    },
                    price: {
                        ...machineState.price,
                        machineHourCost: computedCost
                    }
                });
            }
      
    }, [
        machineState?.price?.price,
        machineState?.attributes?.dailyProductivityInHours,
        machineState?.attributes?.lifeExpectancyYears,
        machineState?.attributes?.monthlyMaintenanceCost,
        machineState?.attributes?.monthlyCostOfSpace,
        machineState?.attributes?.electricityCostPerWorkingHour
    ]);
    // Track initial direct machineHourCost value (if provided explicitly)
    useEffect(() => {
       
        if (machineState.attributes?.machineHourCost !== undefined) {
            const explicitCost = Number(machineState.attributes.machineHourCost);
            setMachineHourCostValue(explicitCost);
            if (Number(machineState.price?.machineHourCost) !== explicitCost) {
                setMachine({...machineState, price: {...machineState.price, machineHourCost: explicitCost}});
            }
        }
    }, []);

    
    const changeMachineGeneralAttributes = (key: string, value: any) => {
        if(key === "productionFloorColor"){
            setMachine({...machineState, attributes: {...machineState.attributes, productionFloorColor: value}});
        }
        else if(key === "price"){
          
            setMachine({
                ...machineState, 
                price: {
                    ...machineState.price,
                    price: value?.price !== undefined ? value.price : machineState.price?.price,
                    currency: value?.currency !== undefined ? value.currency : machineState.price?.currency,
                }
            });
            if(value?.machineHourCost !== undefined && machineState.attributes?.machineHourCost !== value?.machineHourCost){
                setMachine({...machineState, attributes: {...machineState.attributes, machineHourCost: value?.machineHourCost}});
            }

        }
        else{
            setErrors({...errors, [key]: false});
            setMachine({...machineState, [key]: value});
        }
    };

    const changeMachineAttributes = (key: string, value: any) => {
        setErrors({...errors, [key]: false});
        setMachine({
            ...machineState,
            attributes: {
                ...machineState.attributes,
                [key]: value
            }
        })
    }

    const isValidStep = (attributes: {isValid: boolean; parameterKey: string;}[]): boolean => {
        if (attributes.every(a => a.isValid)) {
            return true;
        } else {
            const stepErrors: Record<string, boolean> = {};
            attributes.forEach(attribute => {
                if (!attribute.isValid) {
                    stepErrors[attribute.parameterKey] = true;
                }
            });
            setErrors({...errors, ...stepErrors});
            return false;
        }
    }

    const machineGeneralAttributes = machineInputs(machineState,machineHourCostValue);
    const machineBasicAttributes = () => !!machineState.category ? getCategoryBasicInputs(machineState.category, machineState) : [];
    const machineMediaAttributes = () => !!machineState.category ? getCategoryMediaInputs(machineState.category, machineState) : [];
    const machineSpeedAttributes = () => getCategorySpeedInputs(machineState.category, machineState);
    const machineFeedersStackersAttributes = () => !!machineState.category ? getCategoryFeedersStackersInputs(machineState.category, machineState) : [];
    const machineColorsAttributes = () => !!machineState.category ? getCategoryColorsInputs(machineState.category, machineState) : [];
    const machineBeatsAttributes = () => !!machineState.category ? getCategoryBeatsInputs(machineState.category, machineState, printColors) : [];
    const machineDimensionsAttributes = () => !!machineState.category ? getCategoryMachineDimensionsInputs(machineState.category, machineState) : [];
    const machineCoatingAttributes = () => !!machineState.category ? getCategoryCoatingInputs(machineState.category, machineState) : [];
    const machinePlateAttributes = () => !!machineState.category ? getCategoryPlateInputs(machineState.category, machineState) : [];
    const machineBlanketCylinderAttributes = () => !!machineState.category ? getCategoryBlanketCylinderInputs(machineState.category, machineState) : [];
    const machineUnWinderAttributes = () => !!machineState.category ? getCategoryUnWinderInputs(machineState.category, machineState) : [];
    const machineFoldingAttributes = () => !!machineState.category ? getCategoryRunInputs(machineState.category, machineState) : [];
    const machineConnectionAttributes = () => !!machineState.category ? getCategoryConnectionInputs(machineState.category, machineState) : [];
    const machineCuttingOptionsAttributes = () => !!machineState.category ? getCategoryCuttingOptionsInputs(machineState.category, machineState) : [];
    const machineOtherSettingsAttributes = () => !!machineState.category ? getCategoryInputs(machineState.category, machineState) : [];
    const machineStapleAttributes = () => !!machineState.category ? getCategoryStapleInputs(machineState.category, machineState) : [];

    return {
        machineGeneralAttributes,
        machineBasicAttributes,
        machineMediaAttributes,
        machineFeedersStackersAttributes,
        machineColorsAttributes,
        machineBeatsAttributes,
        machineDimensionsAttributes,
        machineCoatingAttributes,
        machinePlateAttributes,
        machineBlanketCylinderAttributes,
        machineUnWinderAttributes,
        machineFoldingAttributes,
        machineConnectionAttributes,
        machineSpeedAttributes,
        machineStapleAttributes,
        machineAvenueAttributes: machineOtherSettingsAttributes,
        machineCuttingOptionsAttributes,
        changeMachineAttributes,
        changeMachineGeneralAttributes,
        errors,
        isValidStep,
        machineState
    };
}

export {useMachineAttributes};