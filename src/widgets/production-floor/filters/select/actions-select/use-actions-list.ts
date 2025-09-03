import { productionFloorFiltersState } from "@/widgets/production-floor/state/production-floor-filters";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  actionsListState,
  IActionMachines,
  sourceOfActionsListState,
} from "@/widgets/production-floor/state/actions-list";
import { getPrintHouseActions } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { IStation } from "@/widgets/production-floor/interfaces/filters";
import { useTranslation } from "react-i18next";
import { employeeState } from "@/store/employee-state";
import { machinesListState } from "@/store/machines";
import {
  createBoardMissionStationFilterGroupApi,
  getAllBoardMissionStationFilterGroupsApi,
} from "@/services/api-service/board-missions/board-mission-station-filter-groups";
import {
  IFilterGroupsList,
  IStationFilterGroup,
} from "@/widgets/production-floor/interfaces/borad-missions-filter-groups";
import {
  selectedGroupIdState,
  stationFilterGroupState,
} from "@/widgets/production-floor/state/filter-group";

export enum Source {
  PRODUCTION_FLOOR,
  USERS,
  DASHBOARD,
}

interface IUseActionsList {
  source: Source;
  onClickApply?: any;
  filterGroups?: any;
  setFilterGroups?: any;
}

const useActionsList = ({
  source,
  setFilterGroups,
  onClickApply,
}: IUseActionsList) => {
  const setSourceOfActionsList = useSetRecoilState(sourceOfActionsListState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filter, setFilter] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const [actions, setActions] = useRecoilState(actionsListState);
  const [productionFilter] = useRecoilState(productionFloorFiltersState);
  const [employee] = useRecoilState(employeeState);
  const [, setActionFilter] = useState<string>("");
  const { callApi } = useGomakeAxios();
  const { alertFault } = useSnackBar();
  const [dashboardMachines, setDashboardMachines] =
    useRecoilState(machinesListState);
  const [actionsList, setActionsList] = useState<IActionMachines[]>([]);
  const [checkedMachinesOrder, setCheckedMachinesOrder] = useState<string[]>(
    []
  );
  const actionsListRef = useRef<IActionMachines[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setSourceOfActionsList(source);
  }, [source]);

  useEffect(() => {
    if (source === Source.DASHBOARD) {
      const machinesIds = dashboardMachines
        .filter((m) => m.checked)
        .map((m) => m.id);
      setActionsList(
        actions?.map((action) => {
          return {
            ...action,
            label: action.actionName,
            checked: action.machines.some((m) =>
              machinesIds.includes(m.machineId)
            ),
            machines: action?.machines?.map((machine) => ({
              ...machine,
              label: machine.machineName,
              checked: machinesIds.includes(machine.machineId),
            })),
          };
        })
      );
    } else {
      setActionsList(
        actions?.map((action) => {
          const station = (
            source === Source.PRODUCTION_FLOOR
              ? productionFilter?.stations
              : employee?.employee?.stationsFilter
          )?.find((s) => s.actionId === action.actionId);
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
    }
  }, [actions, productionFilter, open, source, dashboardMachines]);

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

    // Track the order of checked machines
    setCheckedMachinesOrder((prevOrder) => {
      const isCurrentlyChecked = actionsList
        ?.find((station) => station.actionId === stationId)
        ?.machines?.find((machine) => machine.machineId === machineId)?.checked;

      if (isCurrentlyChecked) {
        // Machine is being unchecked, remove from order
        return prevOrder.filter((id) => id !== machineId);
      } else {
        // Machine is being checked, add to the end of order
        return [...prevOrder.filter((id) => id !== machineId), machineId];
      }
    });

    // Restore scroll position after state update
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollPosition;
      }
    });
  };

  const onSelectStation = (stationId: string, checked: boolean) => {
    setActionsList((prevState) => {
      const updatedActionsList = prevState?.map((station) =>
        stationId === station.actionId
          ? {
              ...station,
              checked: !station.checked,
              machines: station.machines?.map((machine) => ({
                ...machine,
                checked: !station.checked,
              })),
            }
          : station
      );

      // Track the order of checked machines for station selection
      setCheckedMachinesOrder((prevOrder) => {
        const station = updatedActionsList?.find(
          (s) => s.actionId === stationId
        );
        const isCurrentlyChecked = station?.checked;

        if (isCurrentlyChecked) {
          // Station is being unchecked, remove all its machines from order
          const stationMachineIds =
            station?.machines?.map((m) => m.machineId) || [];
          return prevOrder.filter((id) => !stationMachineIds.includes(id));
        } else {
          // Station is being checked, add all its machines to the end of order
          const stationMachineIds =
            station?.machines?.map((m) => m.machineId) || [];
          const existingOrder = prevOrder.filter(
            (id) => !stationMachineIds.includes(id)
          );
          return [...existingOrder, ...stationMachineIds];
        }
      });

      actionsListRef.current = updatedActionsList || [];
      return updatedActionsList;
    });
  };

  const handelFilterActions = (name: string) => {
    setActionFilter(name);
  };

  const getActions = async () => {
    const callBack = (res) => {
      if (res.success) {
        setActions(res?.data);
        const dashboardMachinesData = res?.data.flatMap((station) =>
          station.machines.map((machine) => ({
            id: machine.machineId,
            name: machine.machineName + " (" + station.actionName + ")",
            checked: true,
          }))
        );
        setDashboardMachines(dashboardMachinesData);

        // Initialize actionsList for dashboard source
        if (source === Source.DASHBOARD) {
          const initialActionsList = res?.data.map((action) => {
            return {
              ...action,
              label: action.actionName,
              checked: true, // All stations should be checked by default for dashboard
              machines: action?.machines?.map((machine) => ({
                ...machine,
                label: machine.machineName,
                checked: true, // All machines should be checked by default for dashboard
              })),
            };
          });

          setActionsList(initialActionsList);

          // Initialize the checked machines order with all machines in their original order
          const allMachineIds = res?.data.flatMap((station) =>
            station.machines.map((machine) => machine.machineId)
          );
          setCheckedMachinesOrder(allMachineIds);
        }
      }
    };
    await getPrintHouseActions(callApi, callBack, {
      isFromEmployeeForm: source === Source.USERS,
      isFromDashboard: true,
    });
  };

  const actionsMachinesIds: IStation[] = useMemo(() => {
    return actionsList
      ?.filter(
        (station) =>
          station.checked ||
          station.machines?.some((machine) => machine.checked)
      )
      ?.map((station) => ({
        ...station,
        machines: station?.machines?.filter((machine) => machine.checked),
      }))
      ?.map((station) => ({
        actionId: station.actionId,
        actionName: station.actionName,
        machineIds: station.machines.map((machine) => machine.machineId),
        machineNames: station.machines.map((machine) => machine.machineName),
      }));
  }, [actionsList]);

  useEffect(() => {
    if (source === Source.DASHBOARD) {
      getActions().then();
    }
  }, [source]);

  const [openDepartmentModal, setOpenDepartmentModal] = useState(false);
  const onClickOpenDepartmentModal = () => {
    setOpenDepartmentModal(true);
  };
  const onClickCloseDepartmentModal = () => {
    setOpenDepartmentModal(false);
    resetStationFilterGroup();
  };

  const resetStationFilterGroup = useResetRecoilState(stationFilterGroupState);
  const [stationFilterGroup, setStationFilterGroup] =
    useRecoilState<IStationFilterGroup>(stationFilterGroupState);

  const getStationFilterGroups = async () => {
    const callBack = (res) => {
      if (res.success) {
        const filterGroupsList: IFilterGroupsList[] = res?.data?.map(
          (group) => ({
            id: group?.id,
            name: group?.name,
            color: group?.color || "#7355de",
            stuckCount: group?.stuckCount,
            inProcessCount: group?.inProcessCount,
            inProcessTotalProductionTime: group?.inProcessTotalProductionTime,
          })
        );
        let inProcessSum = filterGroupsList.reduce(
          (accumulator, currentValue) => {
            return accumulator + (currentValue.inProcessCount ?? 0);
          },
          0
        );
        let stuckSum = filterGroupsList.reduce((accumulator, currentValue) => {
          return accumulator + (currentValue.stuckCount ?? 0);
        }, 0);
        let totalProductionTimeSum = filterGroupsList.reduce(
          (accumulator, currentValue) => {
            return (
              accumulator + (currentValue.inProcessTotalProductionTime ?? 0)
            );
          },
          0
        );
        setFilterGroups([
          {
            id: "all",
            name: t("productionFloor.allFilterGroupsViewName"),
            color: "#7355de",
            stuckCount: stuckSum,
            inProcessCount: inProcessSum,
            inProcessTotalProductionTime: totalProductionTimeSum,
          },
          ...filterGroupsList,
        ]);
      }
    };
    await getAllBoardMissionStationFilterGroupsApi(callApi, callBack).then();
  };

  const setSelectedGroupId = useSetRecoilState<string | null>(
    selectedGroupIdState
  );

  const createBoardMissionStationFilterGroup = async () => {
    if (!stationFilterGroup.name.trim()) {
      alertFault(t("productionFloor.alertNoGroupName"));
      return;
    }
    if (stationFilterGroup?.stations?.length === 0) {
      alertFault(t("productionFloor.alertNoSelectedAction"));
      return;
    }

    const updatedStationFilterGroup = {
      ...stationFilterGroup,
    };

    const callBack = (res) => {
      if (res.success) {
        const groupId = res?.data?.id;
        onClickApply({
          stations: [...stationFilterGroup?.stations],
          groupId,
        });
        setSelectedGroupId(groupId);

        onClickCloseDepartmentModal();
        getStationFilterGroups();
      }
    };
    await createBoardMissionStationFilterGroupApi(
      callApi,
      callBack,
      updatedStationFilterGroup
    ).then();
  };

  const handleClickSave = () => {
    setStationFilterGroup({
      ...stationFilterGroup,
      stations: actionsMachinesIds,
    });
    //setOpen(false);
    onClickOpenDepartmentModal();
    setOpenCollapse({});
  };

  const [openCollapse, setOpenCollapse] = useState<{ [key: string]: boolean }>(
    {}
  );

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

  const handleCloseList = () => {
    setOpen(false);
    setOpenCollapse({}); // Collapse all when the list is closed
  };

  return {
    actionsList,
    handelFilterActions,
    onSelectMachine,
    onSelectStation,
    actionsMachinesIds,
    checkedMachinesOrder,
    setAnchorEl,
    filter,
    setFilter,
    open,
    anchorEl,
    t,
    setOpen,
    actionsListRef,
    openDepartmentModal,
    onClickOpenDepartmentModal,
    onClickCloseDepartmentModal,
    createBoardMissionStationFilterGroup,
    handleClick,
    handleClickSave,
    handleCloseList,
    toggleCollapse,
    openCollapse,

    scrollRef,
  };
};

export { useActionsList };
