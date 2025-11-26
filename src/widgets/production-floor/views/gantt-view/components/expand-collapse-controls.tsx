import { IconButton, Tooltip } from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { IGanttGroup } from "../interfaces";

interface ExpandCollapseControlsProps {
  groups: IGanttGroup[];
  openGroups: Record<string, boolean>;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export const ExpandCollapseControls = ({
  groups,
  openGroups,
  onExpandAll,
  onCollapseAll,
}: ExpandCollapseControlsProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  // Check if all root groups are expanded
  const rootGroups = groups.filter((group) => group.isRoot);
  const allExpanded =
    rootGroups.length > 0 &&
    rootGroups.every((group) => openGroups[group.id] === true);

  const handleToggle = () => {
    if (allExpanded) {
      onCollapseAll();
    } else {
      onExpandAll();
    }
  };

  return (
    <Tooltip
      title={
        allExpanded
          ? t("productionReport.collapseAll") || "Collapse All"
          : t("productionReport.expandAll") || "Expand All"
      }
    >
      <IconButton
        onClick={handleToggle}
        sx={{
          ...classes.expandCollapseButton,
          pointerEvents: "auto",
          zIndex: 10,
          position: "relative",
        }}
      >
        {allExpanded ? (
          <UnfoldLessIcon sx={classes.expandCollapseIcon} />
        ) : (
          <UnfoldMoreIcon sx={classes.expandCollapseIcon} />
        )}
      </IconButton>
    </Tooltip>
  );
};
