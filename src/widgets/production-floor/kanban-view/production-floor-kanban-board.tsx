import { KanbanColumnComponent } from "@/widgets/production-floor/kanban-view/kanban-column/kaban-column-component";
import { useProductionFloorKanban } from "@/widgets/production-floor/kanban-view/use-production-floor-kanban";
import Stack from "@mui/material/Stack";
import { useRecoilValue } from "recoil";
import { useEffect, useMemo } from "react";
import { selectedChipIdsState } from "../state/text-search";
import { useProductionFloorTable } from "../table-view/use-production-floor-table";

const ProductionFloorKanbanBoard = () => {
  const { data } = useProductionFloorKanban();
  const {
    search,
    setFilteredMissionsBySearch,
    getAllBoardMissionsFromSearch,
    setMissionsList,
  } = useProductionFloorTable();

  const selectedChipId = useRecoilValue(selectedChipIdsState);

  const filteredDataByMachine = useMemo(() => {
    if (selectedChipId.length === 0) return data;
    return data.map((item) => {
      const filteredBoardMissions = item.boardMissions.filter((mission) => {
        return selectedChipId.some(
          (chipId) =>
            mission?.currentStation?.machineId === chipId ||
            mission?.currentStation?.employeeId === chipId
        );
      });

      return {
        ...item,
        boardMissions: filteredBoardMissions,
      };
    });
  }, [data, selectedChipId]);

  const matchSearch = (mission) => {
    return search
      ? `${mission.boardMissionNumber}\\${mission.orderNumber}`.includes(
          search
        ) ||
          `${mission.clientName?.toLowerCase()}`.includes(
            search.toLowerCase()
          ) ||
          `${mission.productName?.toLowerCase()}`.includes(
            search.toLowerCase()
          ) ||
          mission.automatedTags?.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      : true;
  };
  const allFilteredMissions = filteredDataByMachine.flatMap(
    (statusBoards) => statusBoards.boardMissions
  );
  const filteredMissions = allFilteredMissions.filter(matchSearch);

  useEffect(() => {
    setFilteredMissionsBySearch(filteredMissions);
    if (filteredMissions?.length === 0) {
      const delayFetch = setTimeout(() => {
        getAllBoardMissionsFromSearch();
      }, 1000);
      return () => clearTimeout(delayFetch);
    } else {
      setMissionsList([]);
    }
  }, [search]);

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      padding={"20px"}
      overflow={"hidden"}
      minHeight={"100%"}
    >
      {[...filteredDataByMachine]
        ?.sort(
          (a, b) =>
            a.boardMissionStatus.boardMissionStatus.kanbanIndex -
            b.boardMissionStatus.boardMissionStatus.kanbanIndex
        )
        ?.map((column) => (
          <KanbanColumnComponent
            key={column.boardMissionStatus.boardMissionStatus?.name}
            status={column.boardMissionStatus.boardMissionStatus}
            boardsMissions={column.boardMissions}
          />
        ))}
    </Stack>
  );
};

export { ProductionFloorKanbanBoard };
