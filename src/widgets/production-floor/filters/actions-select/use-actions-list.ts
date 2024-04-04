import {
    productionFloorFiltersState
} from "@/widgets/production-floor/state/production-floor-filters";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {actionsListState, IActionMachines} from "@/widgets/production-floor/state/actions-list";
import {getPrintHouseActions} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";

const useActionsList = () => {
    const [actions, setActions] = useRecoilState(actionsListState);
    const [productionFilter, ] = useRecoilState(productionFloorFiltersState);
    const [actionsFilter, setActionFilter] = useState<string>('');
    const {callApi} = useGomakeAxios();
    const [actionsList, setActionsList] = useState<IActionMachines[]>([])
    useEffect(() => {
        setActionsList(actions?.map(action => {
            const station = productionFilter?.stations?.find(s => s.actionId === action.actionId)
            return {
                ...action,
                label: action.actionName,
                checked: !!station && (station.machineIds.length ===0 || station.machineIds.length === action.machines.length),
                machines: station?.machineIds.length ===0 ? action?.machines?.map(machine => ({...machine, label: machine.machineName, checked: true})) :
                    action?.machines?.map(machine => ({...machine, label: machine.label, checked: station?.machineIds?.includes(machine.machineId)}))
            }}))

    }, [actions, actionsFilter, productionFilter])


    const handelFilterActions = (name: string) => {
        setActionFilter(name)
    }

    const getActions = async () => {
        const callBack = res => {
            if (res.success) {
                setActions(res?.data);
            }
        }
        await getPrintHouseActions(callApi, callBack)
    }

    useEffect(() => {
        getActions().then();
    }, [])

    return {
        actionsList,
        handelFilterActions,
    }
}
export {useActionsList}