import { KanbanCategoryComponent } from "@/widgets/production-floor/kanban-view/kanban-category/kanban-category-component";
import { FixedStatusHeader } from "@/widgets/production-floor/kanban-view/fixed-status-header/fixed-status-header";
import { useProductionFloorKanban } from "@/widgets/production-floor/kanban-view/use-production-floor-kanban";
import Stack from "@mui/material/Stack";
import { useRecoilValue } from "recoil";
import { useEffect, useMemo, useState } from "react";
import { selectedChipIdsState } from "../state/text-search";
import { useProductionFloorTable } from "../table-view/use-production-floor-table";
import { useIsMobile } from "@/hooks/use-responsive";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { ICategory, IStation } from "./types/kanban-types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ZoomWrapper } from "@/widgets/production-floor/components/zoom-wrapper";

// Helper function to generate categories and stations from actual data
const generateCategoriesFromData = (
  missions: IBoardMissions[]
): ICategory[] => {
  const categoryMap = new Map<string, Map<string, IStation>>();

  // Group missions by action name (category) and machine name (station)
  missions.forEach((mission) => {
    const actionName = mission.currentStation?.actionName || "Unknown";
    const machineName = mission.currentStation?.machineName || "General";
    const machineId = mission.currentStation?.machineId;

    // Create category if it doesn't exist
    if (!categoryMap.has(actionName)) {
      categoryMap.set(actionName, new Map());
    }

    const stationMap = categoryMap.get(actionName)!;

    // Create station if it doesn't exist
    if (!stationMap.has(machineName)) {
      stationMap.set(machineName, {
        id: `${actionName.toLowerCase().replace(/\s+/g, "-")}-${machineName
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
        name: machineName,
        machineIds: machineId ? [machineId] : [],
        capacity: 3, // Default capacity
        activeJobs: 0,
      });
    }

    // Add machine ID if not already present
    if (
      machineId &&
      !stationMap.get(machineName)!.machineIds.includes(machineId)
    ) {
      stationMap.get(machineName)!.machineIds.push(machineId);
    }
  });

  // Convert to ICategory array
  const categories: ICategory[] = [];
  const categoryIcons: Record<string, string> = {
    "Pre Press": "🎨",
    Design: "✏️",
    Printing: "🖨️",
    Finishing: "✂️",
    "Quality Control": "🔍",
    Packaging: "📦",
    Shipping: "🚚",
  };

  categoryMap.forEach((stationMap, actionName) => {
    const stations = Array.from(stationMap.values());
    const icon = categoryIcons[actionName] || "⚙️";

    categories.push({
      id: actionName.toLowerCase().replace(/\s+/g, "-"),
      name: actionName,
      icon: icon,
      stations: stations,
    });
  });

  return categories;
};

const ProductionFloorKanbanBoard = ({ isEmailComposerOpenApproval, emailDataApproval, openEmailComposerApproval, closeEmailComposerApproval, isLoadingEmailDataApproval }: { isEmailComposerOpenApproval: boolean, emailDataApproval: any, openEmailComposerApproval: (documentId: string | number) => void, closeEmailComposerApproval: () => void, isLoadingEmailDataApproval: boolean }) => {
  const { data } = useProductionFloorKanban();
  const isMobile = useIsMobile();
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set()
  );

  const {
    search,
    setFilteredMissionsBySearch,
    getAllBoardMissionsFromSearch,
    setMissionsList,
  } = useProductionFloorTable();

  const selectedChipId = useRecoilValue(selectedChipIdsState);

  // Filter data by selected chips
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

  // Search filter function
  const matchSearch = (mission: IBoardMissions) => {
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
      ) ||
      `${mission?.jobName?.toLowerCase()}`.includes(search.toLowerCase())
      : true;
  };

  const allFilteredMissions = filteredDataByMachine.flatMap(
    (statusBoards) => statusBoards.boardMissions
  );
  const filteredMissions = allFilteredMissions.filter(matchSearch);

  // Helper function to determine station ID from mission
  const getStationIdFromMission = (mission: IBoardMissions): string | null => {
    const actionName = mission.currentStation?.actionName || "Unknown";
    const machineName = mission.currentStation?.machineName || "General";

    // Generate the same ID format as in generateCategoriesFromData
    return `${actionName.toLowerCase().replace(/\s+/g, "-")}-${machineName
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  // Generate categories from actual data
  const dynamicCategories = useMemo(() => {
    return generateCategoriesFromData(filteredMissions);
  }, [filteredMissions]);

  // Organize missions by station
  const organizeMissionsByStation = useMemo(() => {
    const organized: Record<string, IStatusesBoardsMissions[]> = {};

    // Initialize all stations from dynamic categories
    dynamicCategories.forEach((category) => {
      category.stations.forEach((station) => {
        organized[station.id] = [];
      });
    });

    // Group missions by their current station
    filteredMissions.forEach((mission) => {
      const stationId = getStationIdFromMission(mission);
      if (stationId && organized[stationId]) {
        // Find the status board for this mission
        const statusBoard = filteredDataByMachine.find((board) =>
          board.boardMissions.some((m) => m.id === mission.id)
        );

        if (statusBoard) {
          const existingBoard = organized[stationId].find(
            (board) =>
              board.boardMissionStatus.boardMissionStatus.id ===
              statusBoard.boardMissionStatus.boardMissionStatus.id
          );

          if (existingBoard) {
            existingBoard.boardMissions.push(mission);
          } else {
            organized[stationId].push({
              boardMissionStatus: statusBoard.boardMissionStatus,
              boardMissions: [mission],
            });
          }
        }
      }
    });

    return organized;
  }, [filteredMissions, filteredDataByMachine]);

  // Update active job counts
  const updateActiveJobCounts = useMemo(() => {
    const updatedCategories = dynamicCategories.map((category) => ({
      ...category,
      stations: category.stations.map((station) => ({
        ...station,
        activeJobs:
          organizeMissionsByStation[station.id]?.reduce(
            (total, statusBoard) => total + statusBoard.boardMissions.length,
            0
          ) || 0,
      })),
    }));
    return updatedCategories;
  }, [organizeMissionsByStation, dynamicCategories]);

  useEffect(() => {
    setFilteredMissionsBySearch(filteredMissions);
    if (filteredMissions?.length === 0 && search && search.trim() !== "") {
      const delayFetch = setTimeout(() => {
        getAllBoardMissionsFromSearch();
      }, 1000);
      return () => clearTimeout(delayFetch);
    } else {
      setMissionsList([]);
    }
  }, [search, filteredMissions, setFilteredMissionsBySearch, setMissionsList]);

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* <ZoomWrapper> */}
      <Stack
        direction="column"
        sx={{
          height: isMobile ? "calc(100vh - 100px)" : "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Fixed Status Header */}
        <FixedStatusHeader isMobile={isMobile} />

        {/* Scrollable Content Area */}
        <Stack
          direction="column"
          spacing={0}
          sx={{
            flex: 1,
            overflow: "auto",
            "::-webkit-scrollbar": {
              width: isMobile ? "4px" : "8px",
            },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: "#CCCDCF",
              borderRadius: isMobile ? "2px" : "4px",
              cursor: "pointer",
            },
            "::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#888",
            },
          }}
        >
          {updateActiveJobCounts.map((category) => (
            <KanbanCategoryComponent
              key={category.id}
              category={category}
              missionsByStation={organizeMissionsByStation}
              isCollapsed={collapsedCategories.has(category.id)}
              onToggleCollapse={() => toggleCategory(category.id)}
              isMobile={isMobile}
              isEmailComposerOpenApproval={isEmailComposerOpenApproval}
              emailDataApproval={emailDataApproval}
              openEmailComposerApproval={openEmailComposerApproval}
              closeEmailComposerApproval={closeEmailComposerApproval}
              isLoadingEmailDataApproval={isLoadingEmailDataApproval}
            />
          ))}
        </Stack>
      </Stack>
      {/* </ZoomWrapper> */}
    </DndProvider>
  );
};

export { ProductionFloorKanbanBoard };
