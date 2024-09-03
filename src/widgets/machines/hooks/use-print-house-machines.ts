import {useGomakeAxios} from "@/hooks";
import {useCallback, useEffect} from "react";
import {useRecoilState} from "recoil";
import {machineState} from "@/widgets/machines/state/machine-state";
import {useRouter} from "next/router";
import {machinesListState} from "@/widgets/machines/state/machines";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const usePrintHouseMachines = () => {
    const router = useRouter();
    const {categoryId} = router.query;
    const {callApi} = useGomakeAxios();
    const [machines, setMachines] = useRecoilState(machinesListState);
    const [mState, setMachineState] = useRecoilState(machineState);
    const SCORING_ACTION_ID = '40b9c4a0-6401-40e9-877b-7cbcec415a87';
    const PERFORATION_ACTION_ID = '1d4603d8-f1ab-4cfd-b5ba-6f9e4374f4c2';
    const getAndSetMachines = () => {
        getMachinesByCategoryId(categoryId as ECategoryId).then((res) => {
            if (res?.data?.data?.data?.length > 0) {
                setMachines(res?.data?.data?.data);
                setMachineState(res?.data?.data?.data[0]);
            }
        });
    };
    const getMachinesByCategoryId = async (category: ECategoryId) => {
        return await callApi("Get", `/v1/machines/category/${category}`);
    };

    const machinesToList = (
        machinesList: {
            nickName: string;
            manufacturer: string;
            model: string;
            id: string;
        }[]
    ) => {
        return machinesList.map((machine) => ({
            text: `${machine.manufacturer} ${machine.model} - ${machine.nickName}`,
            value: machine.id,
        }));
    };

    const getPrintHouseMachinesList = useCallback(() => {
        return machinesToList(machines);
    }, [machines]);

    const setMachine = (machineId: string) => {
        const selectedMachine = machines.find(
            (machine) => machine.id === machineId
        );
        if (selectedMachine) {
            setMachineState(selectedMachine);
        }
    };

    const setUpdatedMachine = (updatedMachine: Record<string, any>) => {
        setMachines(
            machines.map((machine) =>
                updatedMachine?.id === machine.id ? updatedMachine : machine
            )
        );
        setMachineState(updatedMachine);
    };

    const deleteMachineFromArray = (machineId: string) => {
        setMachines(machines.filter((machine) => machineId !== machine.id));
    };


    const addMachineToList = (machine) => {
        const newArray = [...machines, machine];
        setMachines(newArray);
        setMachineState(machine);
    };

    const addPerforationAction = () => {
        setMachineState(prevState => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                actions: [...prevState?.attributes?.actions, PERFORATION_ACTION_ID]

            }
        }))

    }
    const removePerforationAction = () => {
        setMachineState((prevState) => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                actions: prevState?.attributes?.actions?.filter(actionId => actionId !== PERFORATION_ACTION_ID)

            }
        }))

    }
    const addScoringAction = () => {
        setMachineState(prevState => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                actions: [...prevState?.attributes?.actions, SCORING_ACTION_ID]

            }
        }))

    }
    const removeScoringAction = () => {
        setMachineState((prevState) => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                actions: prevState?.attributes?.actions?.filter(actionId => actionId !== SCORING_ACTION_ID)

            }
        }))
    }

    useEffect(() => {
        if (mState.category === ECategoryId.SCORING_MACHINE) {
            const actions = mState.attributes?.actions || [];
            const isScoringAvailable = !!mState.attributes?.scoring?.isAvailable;
            const hasScoringAction = actions.includes(SCORING_ACTION_ID);
            if (isScoringAvailable && !hasScoringAction) {
                addScoringAction();
            } else if (!isScoringAvailable && hasScoringAction) {
                removeScoringAction();
            }
            const isPerforationAvailable = !!mState.attributes?.perforation?.isAvailable;
            const hasPerforationAction = actions.includes(PERFORATION_ACTION_ID);
            if (isPerforationAvailable && !hasPerforationAction) {
                addPerforationAction();
            } else if (!isPerforationAvailable && hasPerforationAction) {
                removePerforationAction();
            }
        }
    }, [mState.category, mState.attributes?.scoring?.isAvailable, mState.attributes?.perforation?.isAvailable]);

    return {
        getPrintHouseMachinesList,
        setMachine,
        getMachinesByCategoryId,
        setUpdatedMachine,
        deleteMachineFromArray,
        setMachines,
        addMachineToList,
        machinesToList,
        getAndSetMachines,
    };
};

export {usePrintHouseMachines};
