import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";

export interface ExportData {
  statusBoards: IStatusesBoardsMissions[];
  visibleColumns: string[];
  columnHeaders: { [key: string]: string };
}

/**
 * Flattens the production floor data structure for export
 */
export const flattenProductionFloorData = (
  statusBoards: IStatusesBoardsMissions[]
): any[] => {
  const flattenedData: any[] = [];

  // Build a map of all statuses (statusId -> status name) from all status boards
  const statusMap = new Map<string, string>();
  statusBoards.forEach((statusBoard) => {
    const status = statusBoard.boardMissionStatus?.boardMissionStatus;
    if (status?.id && status?.name) {
      statusMap.set(status.id, status.name);
    }
  });

  statusBoards.forEach((statusBoard) => {
    const boardStatusName =
      statusBoard.boardMissionStatus?.boardMissionStatus?.name ||
      "Unknown Status";
    const boardStatusKey =
      statusBoard.boardMissionStatus?.boardMissionStatus?.key || "";

    // Check if this is an "upcoming" status board
    const isUpcomingBoard =
      boardStatusName.toLowerCase().includes("upcoming") ||
      boardStatusKey.toLowerCase().includes("upcoming");

    statusBoard.boardMissions.forEach((mission: IBoardMissions) => {
      let statusName = boardStatusName;

      // If this is an upcoming board, append the mission's own status wrapped in parentheses
      if (isUpcomingBoard && mission.statusId) {
        const missionStatusName = statusMap.get(mission.statusId);
        if (missionStatusName) {
          statusName = `${boardStatusName} (${missionStatusName})`;
        }
      }

      flattenedData.push({
        status: statusName,
        boardMissionNumber: mission.boardMissionNumber,
        orderNumber: mission.orderNumber,
        jobName: mission.jobName,
        clientName: mission.clientName,
        productName: mission.productName,
        productType: mission.productType,
        quantity: mission.quantity,
        dueDate: mission.dueDate,
        createdDate: mission.boardMissionCreatedDate,
        stationInDate: mission.stationInDate,
        currentStation: mission.currentStation?.actionName || "",
        currentMachine: mission.currentStation?.machineName || "",
        agentName: mission.agentName,
        priority: mission.priority,
        isUrgentWork: mission.isUrgentWork ? "Yes" : "No",
        storage: mission.storage || "",
        description: mission.description || "",
        sectionName: mission.sectionName || "",
        tags: mission.tags?.join(", ") || "",
        automatedTags: mission.automatedTags?.join(", ") || "",
        noteColumn: mission.noteColumn || "",
        numberOfJobsInOrder: mission.numberOfJobsInOrder || "",
      });
    });
  });

  return flattenedData;
};

/**
 * Exports production floor data to Excel
 */
export const exportProductionFloorToExcel = (
  statusBoards: IStatusesBoardsMissions[],
  filename: string = "production-floor-data.xlsx"
): void => {
  try {
    const flattenedData = flattenProductionFloorData(statusBoards);

    if (flattenedData.length === 0) {
      throw new Error("No data to export");
    }

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Production Floor Data");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save file
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, filename);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw error;
  }
};

/**
 * Utility function to format date for export
 */
export const formatDateForExport = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if invalid date
    }
    return date.toLocaleDateString();
  } catch {
    return dateString;
  }
};

/**
 * Utility function to get export filename with timestamp
 */
export const getExportFilename = (
  baseName: string,
  extension: string
): string => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, "-");
  return `${baseName}_${timestamp}.${extension}`;
};
