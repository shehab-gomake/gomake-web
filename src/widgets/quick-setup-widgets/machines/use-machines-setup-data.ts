import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRecoilState, useRecoilValue} from "recoil";
import {IMachineItem, machinesSetup, selectedMachinesSetup} from "@/widgets/quick-setup-widgets/machines/state";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {getAdminMachinesByCategories} from "@/services/api-service/machines/admin-machines";
import {useRouter} from "next/router";
import {useEffect, useMemo, useState} from "react";
import {MachinesTypes, machinesTypeCategories} from "@/widgets/quick-setup-widgets/machines/const";
import {machineCategoriesState} from "@/store/machine-categories";
import {quickSetupAddMachines} from "@/services/api-service/machines/print-house-machines";
import {useTranslation} from "react-i18next";

const useMachinesSetupData = () => {
    const [selectedCategory, setSelectedCategory] = useState<ECategoryId | ''>('');
    const [categoryMachines, setCategoryMachines] = useRecoilState(machinesSetup);
    const [printHouseMachines, setPrintHouseMachines] = useRecoilState(selectedMachinesSetup);
    const [newMachine, setNewMachine] = useState<IMachineItem>({
        label: '',
        value: '',
        category: '',
        isAdminMachine: false
    })
    const router = useRouter();
    const {machinesType} = router.query
    const {callApi} = useGomakeAxios();
    const machinesCategoriesState = useRecoilValue(machineCategoriesState);
    const [selectedMachinesState, setSelectedMachinesState] = useRecoilState(selectedMachinesSetup);
    const {alertFaultAdded} = useSnackBar();
    const [loading, setLoading] = useState<boolean>(false);
    const [machinesLoading, setMachinesLoading] = useState<boolean>(false);

    const {t} = useTranslation();
    const getMachineNameKey = (categoryId: ECategoryId) => {
        return machinesCategoriesState?.find(category => category.id === categoryId)?.name;
    }
    const getMachineColor = (categoryId: ECategoryId) => {
        return machinesCategoriesState?.find(category => category.id === categoryId)?.color;
    }
    const step = useMemo(() => {
        return machinesTypeCategories(machinesType as MachinesTypes);
    }, [machinesType]);

    const getMachines = async (categories: ECategoryId[]) => {
        setMachinesLoading(true)
        const callBack = (res) => {
            setMachinesLoading(false)
            if (res.success) {
                setCategoryMachines(res?.data?.map(m => ({
                    value: m.id,
                    label: m.name,
                    category: m.category,
                    isAdminMachine: true
                })))
            }
        }
        await getAdminMachinesByCategories(callApi, callBack, categories);
    }
    useEffect(() => {
        if (selectedCategory) {
            getMachines([selectedCategory as ECategoryId]).then()
        } else {
            setCategoryMachines([]);
        }
    }, [selectedCategory])
    const onClickNext = async () => {
        const callBack = (res) => {
            if (res?.success) {
                setSelectedMachinesState([]);
                setCategoryMachines([]);
                router.push('/quick-setup/materials');
            } else {
                alertFaultAdded();
            }
            setLoading(false)
        }
        if (selectedMachinesState.length === 0) {
            alertFaultAdded();
        } else {
            setLoading(true);
            await quickSetupAddMachines(callApi, callBack, {
                machines: selectedMachinesState?.map(machine => ({
                    id: machine?.value,
                    name: machine?.label,
                    isAdminMachine: machine?.isAdminMachine,
                    category: machine?.category
                }))
            })
        }
    }

    const machinesCategoriesList = machinesCategoriesState?.map(category => ({
        label: t(category.name),
        value: category.id
    }));

    const onSelectCategory = (category) => {
        setNewMachine({value: '', category: '', label: ''});
        setSelectedCategory(category);
    }

    const onSelectMachine = (machine: IMachineItem) => {
        if (!!machine?.value) {
            setPrintHouseMachines([...printHouseMachines, machine])
        }
    }
    const onRemovePrintHouseMachine = (machineIndex: number) => {
        setPrintHouseMachines(printHouseMachines.filter((machine, index) => index !== machineIndex))
    }

    const onSearchMachine = (newMachineName: string) => {
        setNewMachine({label: newMachineName, category: selectedCategory, value: newMachineName, isAdminMachine: false})
    }

    return {
        step,
        getMachineNameKey,
        getMachineColor,
        onClickNext,
        loading,
        machinesCategoriesList,
        selectedCategory,
        onSelectCategory,
        categoryMachines,
        machinesLoading,
        onSelectMachine,
        printHouseMachines,
        onRemovePrintHouseMachine,
        onSearchMachine,
        newMachine
    }
}
export {useMachinesSetupData}