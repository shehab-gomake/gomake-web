import { ButtonGroup, Tooltip } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";

interface JobsViewToggleProps {
  currentView: "table" | "cards";
  onViewChange: (view: "table" | "cards") => void;
}

const JobsViewToggle = ({ currentView, onViewChange }: JobsViewToggleProps) => {
  return (
    <ButtonGroup dir={"ltr"}>
      <Tooltip title="Cards">
        <PrimaryButton
          style={{ width: "20px", height: "40px", padding: 0 }}
          variant={currentView === "cards" ? "contained" : "outlined"}
          onClick={() => onViewChange("cards")}
          aria-label="Cards"
        >
          <GridViewIcon />
        </PrimaryButton>
      </Tooltip>

      <Tooltip title="Table">
        <PrimaryButton
          style={{ width: "20px", height: "40px", padding: 0 }}
          variant={currentView === "table" ? "contained" : "outlined"}
          onClick={() => onViewChange("table")}
          aria-label="Table"
        >
          <ViewHeadlineIcon />
        </PrimaryButton>
      </Tooltip>
    </ButtonGroup>
  );
};

export { JobsViewToggle };
