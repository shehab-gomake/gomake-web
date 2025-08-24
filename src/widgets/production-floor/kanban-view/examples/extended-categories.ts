import { ICategory } from "../types/kanban-types";

// Example of extended categories for a larger production facility
//!here not sure
export const EXTENDED_CATEGORIES: ICategory[] = [
  {
    id: "pre-press",
    name: "Pre-Press",
    icon: "🎨",
    stations: [
      {
        id: "design-studio",
        name: "Design Studio",
        machineIds: [],
        capacity: 3,
        activeJobs: 0,
      },
      {
        id: "prepress-station-1",
        name: "Prepress Station 1",
        machineIds: [],
        capacity: 2,
        activeJobs: 0,
      },
      {
        id: "prepress-station-2",
        name: "Prepress Station 2",
        machineIds: [],
        capacity: 2,
        activeJobs: 0,
      },
      {
        id: "prepress-plating",
        name: "Pre-Press / Plating",
        machineIds: [],
        capacity: 1,
        activeJobs: 0,
      },
      {
        id: "proofing-station",
        name: "Proofing Station",
        machineIds: [],
        capacity: 2,
        activeJobs: 0,
      },
    ],
  },
  {
    id: "design",
    name: "Design",
    icon: "✏️",
    stations: [
      {
        id: "design-station-1",
        name: "Design Station 1",
        machineIds: [],
        capacity: 3,
        activeJobs: 0,
      },
      {
        id: "design-station-2",
        name: "Design Station 2",
        machineIds: [],
        capacity: 3,
        activeJobs: 0,
      },
      {
        id: "graphics-station",
        name: "Graphics Station",
        machineIds: [],
        capacity: 2,
        activeJobs: 0,
      },
    ],
  },
  {
    id: "printing-press",
    name: "Printing Press",
    icon: "🖨️",
    stations: [
      {
        id: "digital-press-1",
        name: "Digital Press 1",
        machineIds: [],
        capacity: 2,
        activeJobs: 0,
      },
      {
        id: "digital-press-2",
        name: "Digital Press 2",
        machineIds: [],
        capacity: 2,
        activeJobs: 0,
      },
      {
        id: "offset-press-1",
        name: "Offset Press 1",
        machineIds: [],
        capacity: 1,
        activeJobs: 0,
      },
      {
        id: "offset-press-2",
        name: "Offset Press 2",
        machineIds: [],
        capacity: 1,
        activeJobs: 0,
      },
      {
        id: "wide-format-press",
        name: "Wide Format Press",
        machineIds: [],
        capacity: 1,
        activeJobs: 0,
      },
    ],
  },
  {
    id: "finishing",
    name: "Finishing",
    icon: "✨",
    stations: [
      {
        id: "cutting-station-1",
        name: "Cutting Station 1",
        machineIds: [],
        capacity: 2,
        activeJobs: 0,
      },
      {
        id: "cutting-station-2",
        name: "Cutting Station 2",
        machineIds: [],
        capacity: 2,
        activeJobs: 0,
      },
      {
        id: "folding-station",
        name: "Folding Station",
        machineIds: [],
        capacity: 2,
        activeJobs: 0,
      },
      {
        id: "binding-station",
        name: "Binding Station",
        machineIds: [],
        capacity: 1,
        activeJobs: 0,
      },
      {
        id: "lamination-station",
        name: "Lamination Station",
        machineIds: [],
        capacity: 1,
        activeJobs: 0,
      },
    ],
  },
  {
    id: "packaging",
    name: "Packaging",
    icon: "📦",
    stations: [
      {
        id: "packaging-station-1",
        name: "Packaging Station 1",
        machineIds: [],
        capacity: 3,
        activeJobs: 0,
      },
      {
        id: "packaging-station-2",
        name: "Packaging Station 2",
        machineIds: [],
        capacity: 3,
        activeJobs: 0,
      },
      {
        id: "shipping-station",
        name: "Shipping Station",
        machineIds: [],
        capacity: 2,
        activeJobs: 0,
      },
    ],
  },
  {
    id: "quality-control",
    name: "Quality Control",
    icon: "🔍",
    stations: [
      {
        id: "qc-station-1",
        name: "QC Station 1",
        machineIds: [],
        capacity: 2,
        activeJobs: 0,
      },
      {
        id: "qc-station-2",
        name: "QC Station 2",
        machineIds: [],
        capacity: 2,
        activeJobs: 0,
      },
      {
        id: "final-inspection",
        name: "Final Inspection",
        machineIds: [],
        capacity: 1,
        activeJobs: 0,
      },
    ],
  },
];

// Example of how to map machine IDs to specific stations
export const MACHINE_TO_STATION_MAPPING: Record<string, string> = {
  // Pre-Press machines
  "machine-001": "design-studio",
  "machine-002": "prepress-station-1",
  "machine-003": "prepress-station-2",
  "machine-004": "prepress-plating",
  "machine-005": "proofing-station",

  // Design machines
  "machine-006": "design-station-1",
  "machine-007": "design-station-2",
  "machine-008": "graphics-station",

  // Printing machines
  "machine-009": "digital-press-1",
  "machine-010": "digital-press-2",
  "machine-011": "offset-press-1",
  "machine-012": "offset-press-2",
  "machine-013": "wide-format-press",

  // Finishing machines
  "machine-014": "cutting-station-1",
  "machine-015": "cutting-station-2",
  "machine-016": "folding-station",
  "machine-017": "binding-station",
  "machine-018": "lamination-station",

  // Packaging machines
  "machine-019": "packaging-station-1",
  "machine-020": "packaging-station-2",
  "machine-021": "shipping-station",

  // Quality control machines
  "machine-022": "qc-station-1",
  "machine-023": "qc-station-2",
  "machine-024": "final-inspection",
};

// Example function to get station ID from machine ID
export const getStationIdFromMachineId = (machineId: string): string | null => {
  return MACHINE_TO_STATION_MAPPING[machineId] || null;
};

// Example of enhanced station mapping function
export const enhancedGetStationIdFromMission = (
  mission: any
): string | null => {
  const machineId = mission.currentStation?.machineId;
  const actionName = mission.currentStation?.actionName?.toLowerCase();
  const machineName = mission.currentStation?.machineName?.toLowerCase();

  // First, try to map by machine ID
  if (machineId && MACHINE_TO_STATION_MAPPING[machineId]) {
    return MACHINE_TO_STATION_MAPPING[machineId];
  }

  // Then, try to map by action name and machine name
  if (actionName?.includes("design") || machineName?.includes("design")) {
    return "design-station-1";
  }

  if (
    actionName?.includes("prepress") ||
    actionName?.includes("pre-press") ||
    machineName?.includes("prepress") ||
    machineName?.includes("pre-press")
  ) {
    if (actionName?.includes("plating") || machineName?.includes("plating")) {
      return "prepress-plating";
    }
    if (actionName?.includes("proof") || machineName?.includes("proof")) {
      return "proofing-station";
    }
    return "prepress-station-1";
  }

  if (
    actionName?.includes("print") ||
    actionName?.includes("press") ||
    machineName?.includes("print") ||
    machineName?.includes("press")
  ) {
    if (actionName?.includes("digital") || machineName?.includes("digital")) {
      return "digital-press-1";
    }
    if (actionName?.includes("offset") || machineName?.includes("offset")) {
      return "offset-press-1";
    }
    if (actionName?.includes("wide") || machineName?.includes("wide")) {
      return "wide-format-press";
    }
    return "digital-press-1";
  }

  if (actionName?.includes("cut") || machineName?.includes("cut")) {
    return "cutting-station-1";
  }

  if (actionName?.includes("fold") || machineName?.includes("fold")) {
    return "folding-station";
  }

  if (actionName?.includes("bind") || machineName?.includes("bind")) {
    return "binding-station";
  }

  if (
    actionName?.includes("lamination") ||
    machineName?.includes("lamination")
  ) {
    return "lamination-station";
  }

  if (actionName?.includes("pack") || machineName?.includes("pack")) {
    return "packaging-station-1";
  }

  if (actionName?.includes("ship") || machineName?.includes("ship")) {
    return "shipping-station";
  }

  if (
    actionName?.includes("qc") ||
    actionName?.includes("quality") ||
    machineName?.includes("qc") ||
    machineName?.includes("quality")
  ) {
    return "qc-station-1";
  }

  // Fallback to design station
  return "design-station-1";
};
