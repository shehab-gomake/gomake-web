import { FormEvent, useCallback, useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { IActionMachines } from "@/widgets/production-floor/state/actions-list";
import { employeeState } from "@/store/employee-state";
import { useRecoilState } from "recoil";

const useMissionsStationsModal = ({ actions }) => {
  const actionsListRef = useRef<IActionMachines[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stations, setStations] = useState([]);
  const [openCollapse, setOpenCollapse] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [actionsList, setActionsList] = useState<IActionMachines[]>([]);

  useEffect(() => {
    if (actionsList?.length > 0) {
      const data = actionsList
        .filter((item) => item.checked)
        .map((item) => ({
          actionId: item.actionId,
          machineIds: item.machines
            .filter((machine) => machine.checked)
            .map((machine) => machine.machineId),
          machineStatuses: null,
        }));
      setStations(data);
    }
  }, [actionsList]);

  const onSelectStation = (stationId: string, checked: boolean) => {
    setActionsList((prevState) => {
      const updatedActionsList = prevState?.map((station) =>
        stationId === station.actionId
          ? {
              ...station,
              checked: !checked,
              machines: station.machines?.map((machine) => ({
                ...machine,
                checked: !checked,
              })),
            }
          : station
      );

      actionsListRef.current = updatedActionsList || [];
      return updatedActionsList;
    });
  };

  const onSelectMachine = (stationId: string, machineId: string) => {
    const scrollPosition = scrollRef.current?.scrollTop || 0;

    setActionsList((prevActionsList) =>
      prevActionsList?.map((station) =>
        station.actionId === stationId
          ? {
              ...station,
              machines: station.machines?.map((machine) =>
                machine.machineId === machineId
                  ? {
                      ...machine,
                      checked: !machine.checked,
                    }
                  : machine
              ),
            }
          : station
      )
    );

    // Restore scroll position after state update
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollPosition;
      }
    });
  };

  const toggleCollapse = useCallback(
    (id: string) => {
      const scrollPosition = scrollRef.current?.scrollTop || 0;

      setOpenCollapse((prev) => {
        const newState = { ...prev, [id]: !prev[id] };

        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollPosition;
          }
        });

        return newState;
      });
    },
    [setOpenCollapse]
  );

  // *********************************************** new and final

  const [filter, setFilter] = useState<string>();

  const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const [employee] = useRecoilState(employeeState);

  useEffect(() => {
    setActionsList(
      actions?.map((action) => {
        const station = employee?.employee?.stationsFilter?.find(
          (s) => s.actionId === action.actionId
        );
        return {
          ...action,
          label: action.actionName,
          checked: !!station,
          machines:
            station?.machineIds.length === 0
              ? action?.machines?.map((machine) => ({
                  ...machine,
                  label: machine.machineName,
                  checked: true,
                }))
              : action?.machines?.map((machine) => ({
                  ...machine,
                  label: machine.label,
                  checked: station?.machineIds?.includes(machine.machineId),
                })),
        };
      })
    );
  }, [actions, open]);

  const getList = useCallback(() => {
    let list = [...actionsList];
    if (filter) {
      list = actionsList
        ?.map((action) => ({
          ...action,
          machines: action.machines.filter(
            (m) =>
              m.machineName?.toLowerCase().includes(filter?.toLowerCase()) ||
              action.actionName?.toLowerCase().includes(filter?.toLowerCase())
          ),
        }))
        ?.filter(
          (action) =>
            action.actionName?.toLowerCase().includes(filter?.toLowerCase()) ||
            action.machines.length > 0
        );
    }
    return list?.length > 0
      ? list?.sort((a, b) =>
          a.checked === b.checked ? 0 : !!a.checked ? -1 : 0
        )
      : [];
  }, [actionsList, filter]);

  const initialActionsRef = useRef<IActionMachines[]>([]);

  useEffect(() => {
    const initialList = actions?.map((action) => {
      const station = employee?.employee?.stationsFilter?.find(
        (s) => s.actionId === action.actionId
      );
      return {
        ...action,
        label: action.actionName,
        checked: !!station,
        machines:
          station?.machineIds.length === 0
            ? action?.machines?.map((machine) => ({
                ...machine,
                label: machine.machineName,
                checked: true,
              }))
            : action?.machines?.map((machine) => ({
                ...machine,
                label: machine.label,
                checked: station?.machineIds?.includes(machine.machineId),
              })),
      };
    });

    setActionsList(initialList);
    actionsListRef.current = initialList;
    initialActionsRef.current = initialList;
  }, [actions, open]);

  const commitCurrentSelection = () => {
    initialActionsRef.current = [...actionsList];
  };

  return {
    stations,
    openCollapse,
    scrollRef,
    onSelectStation,
    onSelectMachine,
    toggleCollapse,
    getList,
    actionsList,
    filter,
    handleFilterChange,
    setActionsList,
    resetToInitial: () => setActionsList(initialActionsRef.current),
    commitCurrentSelection,
  };
};

export { useMissionsStationsModal };
