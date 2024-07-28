import {
    productionFloorFiltersState
} from "@/widgets/production-floor/state/production-floor-filters";
import {useEffect, useMemo, useState} from "react";
import {useRecoilState} from "recoil";
import {actionsListState, IActionMachines} from "@/widgets/production-floor/state/actions-list";
import {getPrintHouseActions} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";
import {IStation} from "@/widgets/production-floor/interfaces/filters";
import {useTranslation} from "react-i18next";

const useActionsList = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [filter, setFilter] = useState<string>();
    const [open, setOpen] = useState<boolean>(false)
    const {t} = useTranslation();
    const [actions, setActions] = useRecoilState(actionsListState);
    const [productionFilter, ] = useRecoilState(productionFloorFiltersState);
    const [, setActionFilter] = useState<string>('');
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

    }, [actions, productionFilter, open]);

    const onSelectMachine = (stationId: string, machineId: string) => {
        setActionsList(actionsList?.map(station => station.actionId === stationId ? {
            ...station,
            machines: station.machines?.map(machine => machine.machineId === machineId ? {...machine, checked: !machine.checked} : machine)
        } : station))
    }

    const onSelectStation = (stationId: string, checked: boolean) => {
        setActionsList(prevState => prevState?.map(station => stationId === station.actionId ? {
            ...station,
            checked: !checked,
            machines: station.machines?.map(machine => ({...machine, checked: !checked}))
        } : station));
    }
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

    const actionsMachinesIds: IStation[] = useMemo(() => {
        return actionsList?.filter(station => station.checked || station.machines?.some(machine => machine.checked))
            ?.map(station => ({...station, machines: station?.machines?.filter(machine => machine.checked)}))
            ?.map(station => ({actionId: station.actionId, machineIds: station.machines.map(machine => machine.machineId)}) );
    }, [actionsList]);
    useEffect(() => {
        getActions().then();
    }, [])

    return {
        actionsList,
        handelFilterActions,
        onSelectMachine,
        onSelectStation,
        actionsMachinesIds,
        setAnchorEl,
        filter,
        setFilter,
        open,
        anchorEl,
        t,
        setOpen
    }
}
export {useActionsList}