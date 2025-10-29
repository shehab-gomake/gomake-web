import { Button } from "@mui/material";
import { ICurrentStation } from "@/widgets/production-floor/interfaces/current-station";
import { useStyle } from "@/widgets/production-floor/table-view/style";
import Stack from "@mui/material/Stack";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useSetRecoilState } from "recoil";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { boardsMissionsState } from "@/widgets/production-floor/state/boards";
import { RightArrowIcon } from "../table-row/more-circle/icons/right-arrow";
import { LeftArrowIcon } from "../table-row/more-circle/icons/left-arrow-icon";
import { INextStation } from "@/widgets/production-floor/interfaces/next-station";
import { useStations } from "./use-stations";
import { GoMakeDeleteModal } from "@/components";
import { useTranslation } from "react-i18next";
import { ModalType } from "@/enums";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";

interface IProps extends ICurrentStation, INextStation {
  boardMissionId: string;
  status?: any;
  textColor?: string;
  onClickDone: () => void;
}

const NextStationComponent = ({
  boardMissionId,
  textColor,
  productType,
  status,
  nextStationName,
  nextStationId,
  onClickDone,
}: IProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle({ textColor });
  const { GetProductionFontSizeFromPreferences } = usePrintHousePreferences();
  const {
    onUpdateToNextStation,
    dir,
    openModal,
    onClickOpenModal,
    onClickCloseModal,
  } = useStations();
  const setData =
    useSetRecoilState<IStatusesBoardsMissions[]>(boardsMissionsState);

  const handleRemoveBoardMission = (statusKey, boardMissionId) => {
    setData((prevData) => {
      return prevData.map((item) => {
        if (item.boardMissionStatus?.boardMissionStatus?.key === statusKey) {
          const updatedBoardMissions = item.boardMissions.filter(
            (mission) => mission.id !== boardMissionId
          );
          return {
            ...item,
            boardMissions: updatedBoardMissions,
          };
        }
        return item;
      });
    });
  };

  return (
    <Stack direction="row" justifyContent={"center"} alignItems={"center"}>
      <PermissionCheck
        userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}
      >
        {
          <Button
            sx={classes.moveToBtn}
            onClick={nextStationId ? onClickOpenModal : onClickDone}
          >
            <span
              style={{
                ...classes.actionText,
                fontSize: GetProductionFontSizeFromPreferences(),
              }}
            >
              {nextStationId
                ? nextStationName
                : t("productionFloor.moveToDone")}
            </span>
            {dir === "ltr" ? <RightArrowIcon /> : <LeftArrowIcon />}
          </Button>
        }
      </PermissionCheck>
      <GoMakeDeleteModal
        hideIcon={true}
        modalType={ModalType.WARNING}
        title={t("customers.modal.nextStationModalTitle")}
        yesBtn={t("sales.quote.yesBtn")}
        cancelBtn={t("modal.no")}
        openModal={openModal}
        onClose={onClickCloseModal}
        onClickDelete={() => {
          handleRemoveBoardMission(status?.key, boardMissionId);
          onUpdateToNextStation(boardMissionId, productType);
        }}
      />

    </Stack>
  );
};

export { NextStationComponent };
