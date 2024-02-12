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
    const [categoryMachines, setCategoryMachines] = useRecoilState(machinesSetup);
    const [printHouseMachines, setPrintHouseMachines] = useRecoilState(selectedMachinesSetup);
    const router = useRouter();
    const {machinesType} = router.query
    const {callApi} = useGomakeAxios();
    const machinesCategoriesState = useRecoilValue(machineCategoriesState);
    const [selectedMachinesState, setSelectedMachinesState] = useRecoilState(selectedMachinesSetup);
    const {alertFaultAdded} = useSnackBar();
    const [loading, setLoading] = useState<boolean>(false);
    const [machinesLoading, setMachinesLoading] = useState<boolean>(false);

    const {t} = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState('');
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
                setCategoryMachines(res?.data?.map(m => ({value: m.id, label: m.name, category: m.category})))
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
                router.push(step.next);
            } else {
                alertFaultAdded();
            }
            setLoading(false)
        }
        if (selectedMachinesState.length === 0) {
            alertFaultAdded();
        } else {
            setLoading(true);
            await quickSetupAddMachines(callApi, callBack, {machines: selectedMachinesState})
        }
    }

    const machinesCategoriesList = machinesCategoriesState?.map(category => ({
        label: t(category.name),
        value: category.id
    }));

    const onSelectCategory = (category) => {
        setSelectedCategory(category);
    }

    const onSelectMachine = (machine: IMachineItem) => {
        if (!!machine?.value) {
            setPrintHouseMachines([...printHouseMachines, machine])
        }
    }
    const onRemovePrintHouseMachine = (machineId: string) => {
        setPrintHouseMachines(printHouseMachines.filter(machine => machine?.value !== machineId))
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
        onRemovePrintHouseMachine
    }
}
export {useMachinesSetupData}