import { useBoardMissionsNavigationButtons } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/use-navigationButtons";
import Stack from "@mui/material/Stack";
import { Skeleton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";

const NavigationButtonsComponent = () => {
  const { t } = useTranslation();
  const { handleViewChange, step, boardMissionsViews } =
    useBoardMissionsNavigationButtons();
  const [boardMissionsDetails] = useRecoilState(boardMissionsDetailsState);
  const isLoading = !boardMissionsDetails?.boardMissionId;

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      {isLoading ? (
        // Skeleton for the Toggle Button Group
        <Stack direction="row" gap="10px">
          <Skeleton
            variant="rectangular"
            width={240}
            height={42}
            style={{ borderRadius: 16 }}
          />
        </Stack>
      ) : (
        <PrimaryToggleButtonGroup
          value={step}
          exclusive
          onChange={handleViewChange}
        >
          {boardMissionsViews.map((view) => (
            <PrimaryToggleButton value={view.value} key={view.value}>
              {t(view.labelKey)}
            </PrimaryToggleButton>
          ))}
        </PrimaryToggleButtonGroup>
      )}
    </Stack>
  );
};

const PrimaryToggleButtonGroup = styled(ToggleButtonGroup)(() => {
  return {
    borderRadius: "16px",
    border: "1px solid #D0D5DD",
    overflow: "hidden",
    width: "fit-content",
  };
});

const PrimaryToggleButton = styled(ToggleButton)(() => {
  const { primaryColor } = useGomakeTheme();
  return {
    color: primaryColor(500),
    backgroundColor: "white",
    height: "40px",
    border: 0,
    "&:hover": {
      color: "white",
      backgroundColor: primaryColor(500),
    },
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "white",
      backgroundColor: primaryColor(500),
    },
  };
});

export { NavigationButtonsComponent };
