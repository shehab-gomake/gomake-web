import {
  Inbox as InboxIcon,
  Send as SentIcon,
  Drafts as DraftsIcon,
  Delete as TrashIcon,
  Report as SpamIcon,
  Label as LabelIcon,
  Archive as ArchiveIcon,
  Star as StarIcon,
} from "@mui/icons-material";

/**
 * Maps system label IDs and names to appropriate icons
 */
export const getSystemLabelIcon = (labelId: string, labelName: string) => {
  const lowerId = labelId.toLowerCase();
  const lowerName = labelName.toLowerCase();

  if (lowerId.includes("inbox") || lowerName.includes("inbox")) return InboxIcon;
  if (lowerId.includes("sent") || lowerName.includes("sent")) return SentIcon;
  if (lowerId.includes("draft") || lowerName.includes("draft")) return DraftsIcon;
  if (lowerId.includes("trash") || lowerName.includes("trash") || lowerName.includes("bin")) return TrashIcon;
  if (lowerId.includes("spam") || lowerName.includes("spam") || lowerName.includes("junk")) return SpamIcon;
  if (lowerId.includes("starred") || lowerName.includes("starred")) return StarIcon;
  if (lowerId.includes("archive") || lowerName.includes("archive")) return ArchiveIcon;

  return InboxIcon; // Default icon
};

/**
 * Gets the appropriate icon for a label (system or user)
 */
export const getLabelIcon = (labelId: string, labelName: string, isSystem: boolean = false) => {
  return isSystem ? getSystemLabelIcon(labelId, labelName) : LabelIcon;
};
