export const STATUS_COLUMNS = [
  { name: "Upcoming Works", color: "#3949ab", bgColor: "#e8eaf6" },
  // { name: "Upcoming Works", color: "#000000", bgColor: "#E0E0E0" },
  { name: "Waiting", color: "#1976d2", bgColor: "#e3f2fd" },
  { name: "Urgent", color: "#d32f2f", bgColor: "#ffebee" },
  { name: "In Progress", color: "#388e3c", bgColor: "#e8f5e8" },
  { name: "Waiting Approval", color: "#f57c00", bgColor: "#fff3e0" },
  { name: "Stuck", color: "#d32f2f", bgColor: "#ffebee" },
];

export const STATUS_NAME_MAPPING: Record<string, string[]> = {
  Waiting: ["Waiting", "waiting", "WAITING"],
  Urgent: ["Urgent", "urgent", "URGENT"],
  "In Progress": [
    "In Progress",
    "in progress",
    "IN_PROGRESS",
    "InProcess",
    "In process",
  ],
  "Waiting Approval": [
    "Waiting Approval",
    "waiting approval",
    "WAITING_APPROVAL",
    "Approval required",
  ],
  Stuck: ["Stuck", "stuck", "STUCK"],
  "Upcoming Works": ["Upcoming Works", "upcomingWorks", "UPCOMING_WORKS"],
};
