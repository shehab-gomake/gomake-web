import {useStyle} from "@/widgets/machines/components/forms/style";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";
import {useEffect, useMemo, useState} from "react";
import {getPrintHouseMachineMaterialCategories} from "@/services/api-service/machines/print-house-machines-colors";
import {useGomakeAxios} from "@/hooks";
import {useRecoilValue} from "recoil";
import {machineState as STATE} from "@/widgets/machines/state/machine-state";
import {materialCategoriesInput} from "@/widgets/machines/utils/attributes/colors-inputs/material-categories-input";
import {IInput} from "@/components/form-inputs/interfaces";

interface IMaterialCategory {
    data: { valueId: string, value: string }[]
    pathName: string
    value: string
    valueId: string
}

const useMachinesMaterial = ({materialType, parameterKey, label, name}: IInput) => {
    const [materialCategories, setMaterialCategories] = useState<IMaterialCategory[]>([]);
    const {callApi} = useGomakeAxios();
    const machineState = useRecoilValue(STATE);
    const [selectedCategoryValueId, setSelectedCategoryValueId] = useState<string>('');
    const materialTypeManufacturers = materialCategories?.reduce((acc, category) => acc.concat(category.data), []);
    const materialCategoryManufacturers = useMemo(() => {
        const category = materialCategories?.find(c => c.valueId === selectedCategoryValueId)
        if (category) {
            return category.data;
        }
        return [];
    }, [selectedCategoryValueId, materialCategories])

    const getMaterialCategories = async (materialCategory) => {
        const callBack = (res) => {
            if (res.success) {
                setMaterialCategories(res?.data)
            }
        }
        await getPrintHouseMachineMaterialCategories(callApi, callBack, materialCategory).then();

    }
    const translatedValue = useMemo(
        () => machineState?.attributes[parameterKey]
            ? machineState?.attributes[parameterKey]?.map(value => ({
                ...value,
                [materialCategories[0]?.pathName]: materialTypeManufacturers?.find(manu => manu.valueId === value[materialCategories[0]?.pathName])?.value
            })) : [],
        [materialTypeManufacturers, machineState]);

    const materialInputs = materialCategoriesInput(
        machineState,
        materialCategories?.map(category => ({
            text: category.value,
            value: category.valueId
        })),
        materialCategoryManufacturers?.map((m) => ({text: m.value, value: m.valueId})),
        materialType,
        translatedValue,
        parameterKey,
        materialCategories[0]?.pathName,
        label,
        name
    );
    const onSelectCategory = (key, value) => {
        if (key === materialType) {
            setSelectedCategoryValueId(value);
        }
    }
    return {
        getMaterialCategories,
        materialInputs,
        setSelectedCategoryValueId,
        onSelectCategory,
        materialCategories
    }
}
const MachineMaterialInput = (props: IInput) => {
    const {classes} = useStyle();
    const {
        materialCategories,
        getMaterialCategories,
        materialInputs,
        onSelectCategory
    } = useMachinesMaterial(props);
    const {changeMachineAttributes, errors} = useMachineAttributes();
    useEffect(() => {
        getMaterialCategories(props.materialType).then();
    }, [])
    return (
        <div style={{...classes.inputsContainer, width: '100%'}}>
            {
                materialCategories.length > 0 && materialInputs.map((property: any) => (
                    <InputContainer key={property.parameterKey} attribute={property}
                                    newValue={onSelectCategory}
                                    disableUpdateValues={true}
                                    updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                ))
            }
        </div>
    );
}

export {MachineMaterialInput};