import { useRecoilValue } from "recoil";
import { Stack } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { isReadyBoardMissionsState } from "@/widgets/production-floor/views/board-missions-view/stations/state";
import { useTranslation } from "react-i18next";

const CompletedBoardMissionsComponent = () => {
  const isReady = useRecoilValue(isReadyBoardMissionsState);
  const { primaryColor } = useGomakeTheme();
  const { t } = useTranslation();

  return (
    isReady && (
      <Stack
        borderRadius={"8px"}
        style={{ backgroundColor: primaryColor(500), color: "white" }}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        minHeight={"50px"}
      >
        <span>{t("productionFloor.allTasksCompleted")}</span>
      </Stack>
    )
  );
};

export { CompletedBoardMissionsComponent };
