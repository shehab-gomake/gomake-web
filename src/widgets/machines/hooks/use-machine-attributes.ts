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
import {useMaterialUtils} from "../utils/material-utils";
import {getCategoryStapleInputs} from "@/widgets/machines/utils/attributes/staple";
import {printColorsParameterValuesState} from "@/widgets/machines/state/print-colors-parameter-values-state";
import {ECategoryId} from "@/widgets/machines/enums/category-id";


const useMachineAttributes = () => {
    const machineState = useRecoilValue(STATE);
    const setMachine = useSetRecoilState(STATE);
    const [errors, setErrors] = useState<Record<string, boolean>>({})
    const printColors = useRecoilValue(printColorsParameterValuesState);
    const [machineHourCostValue, setMachineHourCostValue] = useState<number>();
    
    // Get material functions from material utils
    const { addMaterial, removeMaterial } = useMaterialUtils();
    
    // Action constants
    const SCORING_ACTION_ID = '40b9c4a0-6401-40e9-877b-7cbcec415a87';
    const PERFORATION_ACTION_ID = '1d4603d8-f1ab-4cfd-b5ba-6f9e4374f4c2';
    const ENGRAVING_ACTION_ID = '08acc2fa-7958-4760-9472-7099868c6d09';
    const CUTTING_ACTION_ID = 'a6c12b45-7dc3-48b2-9176-8d8749cd79f5';
    const ENHANCEMENT_ACTION_ID = '5c755d21-a728-40d5-af2e-c31e02bebc1d';
    
    // Action helper functions
    const addAction = (actionId: string) => {
        setMachine(prevState => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                actions: [...(prevState?.attributes?.actions || []), actionId]
            }
        }));
    };
    
    const removeAction = (actionId: string) => {
        setMachine((prevState) => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                actions: prevState?.attributes?.actions?.filter(action => action !== actionId) || []
            }
        }));
    };
    const machineHourCost = () => {
        if (machineState?.price?.price !==0 && 
            machineState.attributes?.dailyProductivityInHours !==0 && 
            machineState.attributes?.lifeExpectancyYears !==0 && 
            machineState.attributes?.monthlyMaintenanceCost !==0 && 
            machineState.attributes?.monthlyCostOfSpace !==0 && 
            machineState.attributes?.electricityCostPerWorkingHour !==0) {
            return machineState?.price?.price /
                (+machineState.attributes?.dailyProductivityInHours * +machineState.attributes?.lifeExpectancyYears * (4.35 * (machineState.attributes?.workingDaysAmountInWeek ? +machineState.attributes?.workingDaysAmountInWeek : 5)) * 12) +
                +machineState.attributes?.monthlyMaintenanceCost / ((4.35 * (machineState.attributes?.workingDaysAmountInWeek ? +machineState.attributes?.workingDaysAmountInWeek : 5)) * +machineState.attributes?.dailyProductivityInHours) +
                +machineState.attributes?.electricityCostPerWorkingHour + +machineState.attributes?.monthlyCostOfSpace / ((4.35 * (machineState.attributes?.workingDaysAmountInWeek ? +machineState.attributes?.workingDaysAmountInWeek : 5)) * +machineState.attributes?.dailyProductivityInHours);
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
        machineState?.attributes?.electricityCostPerWorkingHour,
        machineState?.attributes?.workingDaysAmountInWeek
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
        if (key === "productionFloorColor") {
            setMachine((prevState) => ({
                ...prevState,
                attributes: { ...(prevState?.attributes || {}), productionFloorColor: value }
            }));
            return;
        }

        if (key === "price") {
            setErrors((prev) => ({ ...prev, price: false }));
            setMachine((prevState) => {
                const nextPrice = {
                    ...(prevState?.price || {}),
                    price: value?.price !== undefined ? value.price : prevState?.price?.price,
                    currency: value?.currency !== undefined ? value.currency : prevState?.price?.currency,
                };

                const shouldUpdateMachineHourCost = value?.machineHourCost !== undefined;

                if (shouldUpdateMachineHourCost) {
                    nextPrice.machineHourCost = value.machineHourCost;
                }

                return {
                    ...prevState,
                    price: nextPrice,
                    attributes: shouldUpdateMachineHourCost
                        ? {
                            ...(prevState?.attributes || {}),
                            machineHourCost: value.machineHourCost,
                        }
                        : prevState?.attributes || {},
                };
            });
            return;
        }

        setErrors((prev) => ({ ...prev, [key]: false }));
        setMachine((prevState) => ({ ...prevState, [key]: value }));
    };

    const changeMachineAttributes = (key: string, value: any) => {
        setErrors({...errors, [key]: false});
        setMachine({
            ...machineState,
            attributes: {
                ...machineState.attributes,
                [key]: value
            }
        });

        // Handle material additions/removals based on attribute changes
        switch (key) {
            case 'advertisingProducts':
                if (value?.isAvailable) {
                    addMaterial('43');
                } else {
                    removeMaterial('43');
                }
                break;
            case 'applicationUnit':
                if (value?.isAvailable) {
                    addMaterial('2');
                } else {
                    removeMaterial('2');
                }
                break;
            case 'applyingGlue':
                if (value?.isAvailable) {
                    addMaterial('9');
                } else {
                    removeMaterial('9');
                }
                break;
            case 'dtfRollsCategories':
                if (value?.isAvailable) {
                    addMaterial('46');
                } else {
                    removeMaterial('46');
                }
                break;
            case 'dtfSheetsCategories':
                if (value?.isAvailable) {
                    addMaterial('47');
                } else {
                    removeMaterial('47');
                }
                break;
            case 'sheetCategories':
                if (value?.isAvailable) {
                    addMaterial('21');
                } else {
                    removeMaterial('21');
                }
                break;
            case 'wideFormatCategories':
                if (value?.isAvailable) {
                    addMaterial('24');
                } else {
                    removeMaterial('24');
                }
                break;
            case 'flatbedsCategories':
                if (value?.isAvailable) {
                    addMaterial('10');
                } else {
                    removeMaterial('10');
                }
                break;
            default:
                // No material changes needed for other attributes
                break;
        }

        // Handle action additions/removals based on attribute changes and machine category
        const actions = machineState.attributes?.actions || [];
        
        if (machineState.category === ECategoryId.SCORING_MACHINE) {
            // Handle scoring action
            if (key === 'scoring') {
                const isScoringAvailable = !!value?.isAvailable;
                const hasScoringAction = actions.includes(SCORING_ACTION_ID);
                if (isScoringAvailable && !hasScoringAction) {
                    addAction(SCORING_ACTION_ID);
                } else if (!isScoringAvailable && hasScoringAction) {
                    removeAction(SCORING_ACTION_ID);
                }
            }
            
            // Handle perforation action
            if (key === 'perforation') {
                const isPerforationAvailable = !!value?.isAvailable;
                const hasPerforationAction = actions.includes(PERFORATION_ACTION_ID);
                if (isPerforationAvailable && !hasPerforationAction) {
                    addAction(PERFORATION_ACTION_ID);
                } else if (!isPerforationAvailable && hasPerforationAction) {
                    removeAction(PERFORATION_ACTION_ID);
                }
            }
        } else if (machineState.category === ECategoryId.FLATBED_CUTTING_MACHINE) {
            // Handle scoring tool action
            if (key === 'scoringTool') {
                const isScoringAvailable = !!value?.isAvailable;
                const hasScoringAction = actions.includes(SCORING_ACTION_ID);
                if (isScoringAvailable && !hasScoringAction) {
                    addAction(SCORING_ACTION_ID);
                } else if (!isScoringAvailable && hasScoringAction) {
                    removeAction(SCORING_ACTION_ID);
                }
            }
            
            // Handle engraving tool action
            if (key === 'engravingTool') {
                const isEngravingAvailable = !!value?.isAvailable;
                const hasEngravingAction = actions.includes(ENGRAVING_ACTION_ID);
                if (isEngravingAvailable && !hasEngravingAction) {
                    addAction(ENGRAVING_ACTION_ID);
                } else if (!isEngravingAvailable && hasEngravingAction) {
                    removeAction(ENGRAVING_ACTION_ID);
                }
            }
            
            // Handle cutting actions (cutTool, kissCutTool, vCutTool)
            if (key === 'cutTool' || key === 'kissCutTool' || key === 'vCutTool') {
                const isCuttingAvailable = !!machineState.attributes?.cutTool?.isAvailable || 
                                         !!machineState.attributes?.kissCutTool?.isAvailable || 
                                         !!machineState.attributes?.vCutTool?.isAvailable;
                const hasCuttingAction = actions.includes(CUTTING_ACTION_ID);
                if (isCuttingAvailable && !hasCuttingAction) {
                    addAction(CUTTING_ACTION_ID);
                } else if (!isCuttingAvailable && hasCuttingAction) {
                    removeAction(CUTTING_ACTION_ID);
                }
            }
        } else if (machineState.category === ECategoryId.LAMINATION_MACHINE) {
            // Handle foil unit action and material
            if (key === 'isAvailableFoilUnit') {
                const isFoilAvailable = !!value;
                if (isFoilAvailable) {
                    addAction(ENHANCEMENT_ACTION_ID);
                    addMaterial('7');
                } else {
                    removeAction(ENHANCEMENT_ACTION_ID);
                    removeMaterial('7');
                }
            }
        }
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