import {useGomakeAxios} from "@/hooks";
import {useCallback, useEffect} from "react";
import {useRecoilState} from "recoil";
import {machineState} from "@/widgets/machines/state/machine-state";
import {useRouter} from "next/router";
import {machinesListState} from "@/widgets/machines/state/machines";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {useMaterialUtils} from "../utils/material-utils";

const usePrintHouseMachines = () => {
    const router = useRouter();
    const {categoryId} = router.query;
    const {callApi} = useGomakeAxios();
    const [machines, setMachines] = useRecoilState(machinesListState);
    const [mState, setMachineState] = useRecoilState(machineState);
    const { addMaterial, removeMaterial } = useMaterialUtils();
    const SCORING_ACTION_ID = '40b9c4a0-6401-40e9-877b-7cbcec415a87';
    const PERFORATION_ACTION_ID = '1d4603d8-f1ab-4cfd-b5ba-6f9e4374f4c2';
    const ENGRAVING_ACTION_ID = '08acc2fa-7958-4760-9472-7099868c6d09';
    const CUTTING_ACTION_ID = 'a6c12b45-7dc3-48b2-9176-8d8749cd79f5';
    const ENHANCEMENT_ACTION_ID = '5c755d21-a728-40d5-af2e-c31e02bebc1d'
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
            text: `${machine.nickName}`,
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

    const addAction = (actionId: string) => {
        setMachineState(prevState => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                actions: [...prevState?.attributes?.actions, actionId]

            }
        }))

    }
    const removeAction = (actionId: string) => {
        setMachineState((prevState) => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                actions: prevState?.attributes?.actions?.filter(action => action !== actionId)

            }
        }))

    }



    useEffect(() => {
            const actions = mState.attributes?.actions || [];
            const hasScoringAction = actions.includes(SCORING_ACTION_ID);
        if (mState.category === ECategoryId.SCORING_MACHINE) {
            const isScoringAvailable = !!mState.attributes?.scoring?.isAvailable;
            if (isScoringAvailable && !hasScoringAction) {
                addAction(SCORING_ACTION_ID);
            } else if (!isScoringAvailable && hasScoringAction) {
                removeAction(SCORING_ACTION_ID);
            }
            const isPerforationAvailable = !!mState.attributes?.perforation?.isAvailable;
            const hasPerforationAction = actions.includes(PERFORATION_ACTION_ID);
            if (isPerforationAvailable && !hasPerforationAction) {
                addAction(PERFORATION_ACTION_ID);
            } else if (!isPerforationAvailable && hasPerforationAction) {
                removeAction(PERFORATION_ACTION_ID);
            }
        } else if (mState.category === ECategoryId.FLATBED_CUTTING_MACHINE) {
            const isScoringAvailable = !!mState.attributes?.scoringTool?.isAvailable;
            const hasScoringAction = actions.includes(SCORING_ACTION_ID);
            if (isScoringAvailable && !hasScoringAction) {
                addAction(SCORING_ACTION_ID);
            } else if (!isScoringAvailable && hasScoringAction) {
                removeAction(SCORING_ACTION_ID);
            }

            const isEngravingAvailable = !!mState.attributes?.engravingTool?.isAvailable;
            const hasEngravingAction = actions.includes(ENGRAVING_ACTION_ID);
            if (isEngravingAvailable && !hasEngravingAction) {
                addAction(ENGRAVING_ACTION_ID);
            } else if (!isEngravingAvailable && hasEngravingAction) {
                removeAction(ENGRAVING_ACTION_ID);
            }

            const isCuttingAvailable = !!mState.attributes?.cutTool?.isAvailable || mState.attributes?.kissCutTool?.isAvailable || mState.attributes?.vCutTool?.isAvailable;
            const hasCuttingAction = actions.includes(CUTTING_ACTION_ID);
            if (isCuttingAvailable && !hasCuttingAction) {
                addAction(CUTTING_ACTION_ID);
            } else if (!isCuttingAvailable && hasCuttingAction) {
                removeAction(CUTTING_ACTION_ID);
            }
        }else if (mState.category === ECategoryId.LAMINATION_MACHINE) {
            const isFoilAvailable = !!mState?.attributes?.isAvailableFoilUnit;
            if (isFoilAvailable) {
                addAction(ENHANCEMENT_ACTION_ID);
                addMaterial('7');
            } else  {
                removeAction(ENHANCEMENT_ACTION_ID);
                removeMaterial('7')
            }
        }
    }, [
        mState?.attributes?.cutTool?.isAvailable,
        mState.attributes?.engravingTool?.isAvailable,
        mState.attributes?.scoringTool?.isAvailable,
        mState.attributes?.scoring?.isAvailable,
        mState.attributes?.perforation?.isAvailable,
        mState.attributes?.kissCutTool?.isAvailable,
        mState.attributes?.vCutTool?.isAvailable,
        mState?.attributes?.isAvailableFoilUnit
    ]);

    

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
        addMaterial,
        removeMaterial,
    };
};

export {usePrintHouseMachines};
