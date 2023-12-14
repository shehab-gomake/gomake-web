import {useRecoilState, useRecoilValue} from "recoil";
import {
    actionsMachinesState,
    productionFilterSelectedStationIdsState,
    productionFloorFiltersState
} from "@/widgets/production-floor-widget/state";
import {useMemo, useState} from "react";

const useActionsMachines = () => {
    const actionsMachines = useRecoilValue(actionsMachinesState);
    const filterStationIds = useRecoilValue(productionFilterSelectedStationIdsState);
    const [productionFilter, setProductionFilter] = useRecoilState(productionFloorFiltersState);
    const [actionsFilter, setActionFilter] = useState<string>('');

    const actionsList = useMemo(() => {
        const list = actionsFilter ? actionsMachines?.filter(action => {
            return action?.machines?.map(machine => machine.machineName?.toLowerCase())?.includes(actionsFilter);
        }): [...actionsMachines]
        return list?.map(action => ({
            ...action,
            checked: filterStationIds.includes(action.actionId),
            label: action.actionName,
            machines: action.machines.map(machine => ({
                ...machine,
                checked: filterStationIds.includes(machine.machineId)
            }))
        }))
    }, [actionsMachines, filterStationIds, actionsFilter])

    const handleSelectStation = (stationId: string) => {
        setProductionFilter({
            ...productionFilter,
            stationId: filterStationIds.includes(stationId) ? filterStationIds.filter(id => id !== stationId) : [...filterStationIds, stationId]
        })
    }

    const handelFilterActions = (name: string) => {
        setActionFilter(name)
    }

    return {
        actionsList,
        handleSelectStation,
        handelFilterActions
    }
}
export {useActionsMachines}