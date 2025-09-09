import { updateStationFilterGroupApi } from "@/services/api-service/board-missions/board-mission-station-filter-groups";
import { useGomakeAxios } from "@/hooks";
import { useSnackBar } from "@/hooks";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { IActionMachines } from "../../../state/actions-list";
import { useRecoilState, useRecoilValue } from "recoil";
import { productionFloorFiltersState } from "../../../state/production-floor-filters";
import { productionFloorViewState } from "../../../state/production-floor-view";
import { UseEditGroupModalProps } from "./edit-group-modal.types";

export const useEditGroupModal = ({
  selectedGroupId,
  actions,
  getStationFilterGroups,
  setFilters,
}: UseEditGroupModalProps) => {
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate } = useSnackBar();
  const actionsListRef = useRef<IActionMachines[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [groupName, setGroupName] = useState(selectedGroupId?.name);
  const [stations, setStations] = useState([]);
  const [openCollapse, setOpenCollapse] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [actionsList, setActionsList] = useState<IActionMachines[]>([]);
  const view = useRecoilValue(productionFloorViewState);

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

  const getList = useCallback(() => {
    let list = [...actionsList];
    return list?.length > 0
      ? list?.sort((a, b) =>
          a.checked === b.checked ? 0 : !!a.checked ? -1 : 0
        )
      : [];
  }, [actionsList, actions]);

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

  useEffect(() => {
    if (selectedGroupId) {
      setGroupName(selectedGroupId?.name);
    }
  }, [selectedGroupId]);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  useEffect(() => {
    setActionsList(
      actions?.map((action) => {
        const station = selectedGroupId?.stations?.find(
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
  }, [selectedGroupId, actions]);

  const [filtersState, setFiltersState] = useRecoilState(
    productionFloorFiltersState
  );
  const updateStationFilterGroup = async (stations) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        getStationFilterGroups();
        setFilters(
          {
            ...filtersState,
            stations,
            groupId: selectedGroupId?.id,
          },
          view
        );
      }
    };
    await updateStationFilterGroupApi(callApi, callBack, {
      id: selectedGroupId?.id,
      name: groupName,
      inProcessCount: selectedGroupId?.inProcessCount,
      stuckCount: selectedGroupId?.stuckCount,
      color: selectedGroupId?.color,
      stations,
    }).then();
  };

  return {
    groupName,
    stations,
    openCollapse,
    scrollRef,
    handleChangeName,
    onSelectStation,
    onSelectMachine,
    toggleCollapse,
    getList,
    updateStationFilterGroup,
  };
};
