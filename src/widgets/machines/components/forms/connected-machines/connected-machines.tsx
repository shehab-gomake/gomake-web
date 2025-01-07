import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useRecoilState} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {
    getCategoryMachinesList,
    getMachineConnectedMachines,
    updateMachineConnectedMachines
} from "@/services/api-service/machines/print-house-machines";
import {useGomakeAxios} from "@/hooks";
import {machineState} from "@/widgets/machines/state/machine-state";

const attributes = (state: Record<string, any>, machinesCategories: { text: string, value: string }[], machines: { text: string; value: string; }[], types) => {
    return [
        {
            name: '',
            parameterKey: 'connectedMachines',
            value: state?.machines ? state?.machines : [],
            machineInputType: 'multiArrayInput',
            isValid: state?.machines?.length > 0,
            disableUpdateValues: true,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.machineCategory",
                    type: "select",
                    placeholder: "machineAttributes.machineCategory",
                    required: true,
                    parameterKey: "machineCategory",
                    options: machinesCategories,
                    secondValue: 'categoryName'
                },
                {
                    name: "",
                    label: "machineAttributes.machines",
                    type: "select",
                    placeholder: "machineAttributes.machines",
                    required: true,
                    parameterKey: "machineId",
                    options: machines,
                    secondValue: 'machineName'
                },
                {
                    name: "",
                    label: "machineAttributes.connectionType",
                    type: "select",
                    placeholder: "machineAttributes.connectionType",
                    required: false,
                    parameterKey: "connectionType",
                    options: types,
                    secondValue: 'typeName'
                },
            ]
        },
    ]
};

const ConnectedMachinesStep = ({}: IStepFormProps) => {
    const {classes} = useStyle();
    const [curMachine] = useRecoilState(machineState);
    const [categories] = useRecoilState(machineCategoriesState);
    const [selectedCategory, setSelectedCategory] = useState<ECategoryId>(null);
    const [state, setState] = useState({machines: []});
    const [categoryMachines, setCategoryMachines] = useState([])
    const {callApi} = useGomakeAxios();
    const types = () => {
        return [
            {text: t('Part of'), value: '0'},
            {text: t('Connected'), value: '1'},
        ]
    }
    const updateConnectedMachines = async (key, v) => {
        setState({
            machines: v.map(row => !row.machineName ?
                {
                    ...row,
                    machineName: categoryMachines?.find(m => m.value === row.machineId)?.text,
                    typeName: types().find(t => t.value == row.connectionType)?.text,
                    categoryName: t(categories.find(c => c.id === row.machineCategory).name),
                } : row)
        })
        await updateMachineConnectedMachines(callApi, () => {
        }, {
            machineId: curMachine.id,
            connections: v.map(v => ({
                machineId: curMachine.id,
                connectedMachineId: v.machineId,
                connectionType: v.connectionType
            }))
        })
    }
    const onSelectCategory = (key, value) => {
        if (key === 'machineCategory') {
            setSelectedCategory(value)
        }
    }
    const {t} = useTranslation();

    useEffect(() => {
        getMachineConnectedMachines(callApi, (res) => setState({
            machines: res.data?.map(row => ({
                ...row,
                categoryName: t(categories.find(c => c.id === row.category).name),
                typeName: types().find(t => t.value == row.connectionType)?.text
            }))
        }), curMachine.id).then()
    }, [curMachine.id])

    useEffect(() => {
        getCategoryMachinesList(callApi, (res) => {
            if (res.success) {
                setCategoryMachines(res.data);
            }
        }, selectedCategory).then();
    }, [selectedCategory])
    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    attributes(state, categories.map(c => ({
                        text: t(c.name),
                        value: c.id
                    })), categoryMachines, types()).map((property: any) => (
                        <InputContainer disableUpdateValues={true} key={property.parameterKey} attribute={property}
                                        updateState={updateConnectedMachines} newValue={onSelectCategory}
                                        error={false}/>
                    ))
                }
            </div>

        </div>
    );
}

export {ConnectedMachinesStep};