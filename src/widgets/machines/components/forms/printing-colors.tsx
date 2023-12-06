import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";
import {useEffect, useMemo, useState} from "react";
import {getPrintHouseMachineColors} from "@/services/api-service/machines/print-house-machines-colors";
import {useGomakeAxios} from "@/hooks";
import {useRecoilValue} from "recoil";
import {machineState as STATE} from "@/widgets/machines/state/machine-state";
import {additionalColorsInput} from "@/widgets/machines/utils/attributes/colors-inputs/additional-colors-input";

interface IMachineColor  {
    colorName: string;
    type: number;
    manufacturers: string[];
}
const useMachinesColors = () => {
    const [colors, setColors] = useState<IMachineColor[]>([]);
    const {callApi} = useGomakeAxios();
    const machineState = useRecoilValue(STATE);
    const [selectedColor, setSelectedColor] = useState<string>('')
    const colorManufacturers = useMemo(() => {
        const color = colors?.find(c => c.colorName === selectedColor)
        if (color) {
            return color.manufacturers;
        }
        return [];
    }, [selectedColor, colors])
    const getMachineColors = async () => {
        const callBack = (res) => {
            if (res.success) {
                setColors(res?.data)
            }
        }
        await getPrintHouseMachineColors(callApi,callBack, machineState?.id ).then();

    }
    // 64cabbb5af8e85619868a453
    const colorsInputs = additionalColorsInput(machineState, colors?.map(color => ({text: color.colorName, value: color.colorName})), colorManufacturers?.map((m) => ({text: m, value: m})));

    const onSelectColors = (key, value) => {
        if (key === 'color') {
            setSelectedColor(value);
        }
    }
    return {
        getMachineColors,
        colorsInputs,
        setSelectedColor,
        onSelectColors,
        colors
    }
}
const PrintingColors = ({}: IStepFormProps) => {
    const {classes} = useStyle();
    const {colors, getMachineColors, colorsInputs, onSelectColors} = useMachinesColors();
    const {machineColorsAttributes, changeMachineAttributes, errors} = useMachineAttributes();
    useEffect(() => {
        getMachineColors().then();
    }, [])
    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    machineColorsAttributes().map((property: any) => (
                        <InputContainer key={property.parameterKey} attribute={property}
                                        updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    ))
                }
                {
                   colors.length > 0 && colorsInputs.map((property: any) => (
                        <InputContainer key={property.parameterKey} attribute={property}
                                        newValue={onSelectColors}
                                        updateValues={false}
                                        updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    ))
                }
            </div>
        </div>
    );
}

export {PrintingColors};