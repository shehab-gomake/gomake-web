import {
    productionFloorFiltersState
} from "@/widgets/production-floor/state/production-floor-filters";
import {useEffect, useMemo, useRef, useState} from "react";
import {useRecoilState} from "recoil";
import {actionsListState, IActionMachines} from "@/widgets/production-floor/state/actions-list";
import {getPrintHouseActions} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";
import {IStation} from "@/widgets/production-floor/interfaces/filters";
import {useTranslation} from "react-i18next";
import {employeeState} from "@/store/employee-state";
import {machinesListState} from "@/store/machines";

export enum Source {
    PRODUCTION_FLOOR,
    USERS,
    DASHBOARD
}

const useActionsList = (source: Source) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [filter, setFilter] = useState<string>();
    const [open, setOpen] = useState<boolean>(false)
    const {t} = useTranslation();
    const [actions, setActions] = useRecoilState(actionsListState);
    const [productionFilter,] = useRecoilState(productionFloorFiltersState);
    const [employee,] = useRecoilState(employeeState);
    const [, setActionFilter] = useState<string>('');
    const {callApi} = useGomakeAxios();
    const [dashboardMachines, setDashboardMachines] = useRecoilState(machinesListState);
    const [actionsList, setActionsList] = useState<IActionMachines[]>([]);

    useEffect(() => {
        if (source === Source.DASHBOARD) {
            const machinesIds = dashboardMachines.filter(m => m.checked).map(m => m.id);
            setActionsList(actions?.map(action => {
                return {
                    ...action,
                    label: action.actionName,
                    checked: action.machines.some(m => machinesIds.includes(m.machineId)),
                    machines: action?.machines?.map(machine => ({
                        ...machine,
                        label: machine.machineName,
                        checked: machinesIds.includes(machine.machineId)
                    }))
                }
            }))
        } else {

            setActionsList(actions?.map(action => {
                const station = (source === Source.PRODUCTION_FLOOR ? productionFilter?.stations : employee.employee.stationsFilter)?.find(s => s.actionId === action.actionId)
                return {
                    ...action,
                    label: action.actionName,
                    checked: !!station,
                    machines: station?.machineIds.length === 0 ? action?.machines?.map(machine => ({
                            ...machine,
                            label: machine.machineName,
                            checked: true
                        })) :
                        action?.machines?.map(machine => ({
                            ...machine,
                            label: machine.label,
                            checked: station?.machineIds?.includes(machine.machineId)
                        }))
                }
            }))
        }
    }, [actions, productionFilter, open, source, dashboardMachines]);

    const onSelectMachine = (stationId: string, machineId: string) => {
        setActionsList(actionsList?.map(station => station.actionId === stationId ? {
            ...station,
            machines: station.machines?.map(machine => machine.machineId === machineId ? {
                ...machine,
                checked: !machine.checked
            } : machine)
        } : station))
    }

    // const onSelectStation = (stationId: string, checked: boolean) => {
    //     setActionsList(prevState => prevState?.map(station => stationId === station.actionId ? {
    //         ...station,
    //         checked: !checked,
    //         machines: station.machines?.map(machine => ({...machine, checked: !checked}))
    //     } : station));

    // }

    const actionsListRef = useRef<IActionMachines[]>([]);
    const onSelectStation = (stationId: string, checked: boolean) => {
        setActionsList(prevState => {
            const updatedActionsList = prevState?.map(station => stationId === station.actionId ? {
                ...station,
                checked: !checked,
                machines: station.machines?.map(machine => ({...machine, checked: !checked}))
            } : station);

            actionsListRef.current = updatedActionsList || [];
            return updatedActionsList;
        });
    }


    const handelFilterActions = (name: string) => {
        setActionFilter(name)
    }

    const getActions = async () => {
        const callBack = res => {
            if (res.success) {
                setActions(res?.data?.filter(s => s.machines.length > 0));
                setDashboardMachines(res?.data.flatMap(station => station.machines.map(machine => ({
                    id: machine.machineId,
                    name: machine.machineName,
                    checked: true,
                }))));
            }
        }
        await getPrintHouseActions(callApi, callBack, source === Source.USERS)
    }


    const actionsMachinesIds: IStation[] = useMemo(() => {
        return actionsList?.filter(station => station.checked || station.machines?.some(machine => machine.checked))
            ?.map(station => ({...station, machines: station?.machines?.filter(machine => machine.checked)}))
            ?.map(station => ({
                actionId: station.actionId,
                actionName: station.actionName,
                machineIds: station.machines.map(machine => machine.machineId),
                machineNames: station.machines.map(machine => machine.machineName),
            }));
    }, [actionsList]);


    useEffect(() => {
        if (source !== Source.DASHBOARD) {
            getActions().then();
        }
    }, [source])

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
        setOpen,
        actionsListRef
    }
}
export {useActionsList}