import { StatusTableComponent } from "@/widgets/production-floor/table-view/status-table/status-table-component";
import { useProductionFloorTable } from "@/widgets/production-floor/table-view/use-production-floor-table";
import Stack from "@mui/material/Stack";
import { useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { selectedChipIdsState } from "../state/text-search";

//?New
const ProductionFloorTableView = () => {
  const selectedChipId = useRecoilValue(selectedChipIdsState);
  const {
    data,
    search,
    setFilteredMissionsBySearch,
    getAllBoardMissions,
    setMissionsList,
  } = useProductionFloorTable();

  const filteredDataByMachine = useMemo(() => {
    if (!selectedChipId.length) return data;
    return data.map((item) => {
      const filteredBoardMissions = item.boardMissions.filter((mission) =>
        selectedChipId.some(
          (chipId) =>
            mission?.currentStation?.machineId === chipId ||
            mission?.currentStation?.employeeId === chipId
        )
      );
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
        getAllBoardMissions();
      }, 1000);
      return () => clearTimeout(delayFetch);
    } else {
      setMissionsList([]);
    }
  }, [search]);

  return (
    <Stack gap={"20px"}>
      {filteredDataByMachine.map((statusBoards, index) => (
        <StatusTableComponent
          key={index}
          status={statusBoards?.boardMissionStatus?.boardMissionStatus}
          boards={statusBoards?.boardMissions}
        />
      ))}
    </Stack>
  );
};

export { ProductionFloorTableView };
