import { ButtonGroup, Tooltip } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import { useTranslation } from "react-i18next";

interface JobsViewToggleProps {
  currentView: "table" | "cards";
  onViewChange: (view: "table" | "cards") => void;
}

const JobsViewToggle = ({ currentView, onViewChange }: JobsViewToggleProps) => {
  const { t } = useTranslation();
  return (
    <ButtonGroup dir={"ltr"}>
      <Tooltip title={t("repeatOrders.cards")}>
        <PrimaryButton
          style={{ width: "20px", height: "40px", padding: 0 }}
          variant={currentView === "cards" ? "contained" : "outlined"}
          onClick={() => onViewChange("cards")}
          aria-label={t("boardMissions.cards")}
        >
          <GridViewIcon />
        </PrimaryButton>
      </Tooltip>

      <Tooltip title={t("productionFloor.table")}>
        <PrimaryButton
          style={{ width: "20px", height: "40px", padding: 0 }}
          variant={currentView === "table" ? "contained" : "outlined"}
          onClick={() => onViewChange("table")}
          aria-label={t("repeatOrders.table")}
        >
          <ViewHeadlineIcon />
        </PrimaryButton>
      </Tooltip>
    </ButtonGroup>
  );
};

export { JobsViewToggle };
