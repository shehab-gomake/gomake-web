import Stack from "@mui/material/Stack";
import { Avatar, Divider, IconButton, Skeleton, Tooltip } from "@mui/material";
import { useStyle } from "@/widgets/production-floor/views/board-missions-view/header/style";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";
import TocIcon from "@mui/icons-material/Toc";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { IBoardMissionsDetails } from "@/widgets/production-floor/interfaces/board-missions";
import { BoardStatusComponent } from "@/widgets/production-floor/table-view/status-table/board-status/board-status";
import { useBoardMissionsDetailsHeader } from "./use-board-nissions-details-header";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { clearPhoneNumberPrefix } from "@/utils/helpers";
import { convertUtcToLocalIsoString } from "@/components/date-time/date-time-component";
import { ApprovalFileStatusComponent } from "@/widgets/production-floor/table-view/status-table/table-row/approval-file-status-component";
import { DocumentsButton } from "../navigation-buttons/documents-button";
import { PermissionCheck } from "@/components/CheckPermission";
import { MoreActionsButton } from "../navigation-buttons/more-actions-button";
import { Permissions } from "@/components/CheckPermission/enum";
import { ActionCountDown } from "./action-count-down/action-count-down";

const HeaderTitleComponent = ({ title }: { title?: string }) => {
  const { classes } = useStyle();
  return <span style={classes.title}>{title}</span>;
};
const HeaderDividerComponent = () => {
  const { classes } = useStyle();
  return <Divider orientation={"vertical"} style={classes.divider} flexItem />;
};
const doneBoardMissionsColors = {
  color: "#66D671",
  bfColor: "#D9F5DC",
};

const BoardMissionsDetailsHeader = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const direction = t("direction");
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const {
    boards,
    boardFromTable,
    setBoardFromTable,
    boardMissionsDetails,
    setBoardMissionsDetails,
    onNavigateBoardMissions,
    handleStatusChange,
    isLoadingStatus,
    onToggleTimer,
    timerLoading,
    stations,
    sortedStations,
  } = useBoardMissionsDetailsHeader();

  const isLoading = !boardMissionsDetails?.boardMissionId; // Check if boardMissionId exists
  const isLoadingTimer = isLoading || sortedStations?.length === 0;

  useEffect(() => {
    setBoardMissionsDetails({} as IBoardMissionsDetails);
  }, []);

  useEffect(() => {
    if (!!boardMissionsDetails?.boardMissionId && boards.length > 0) {
      const statusBoards = boards?.find(
        (b) =>
          b.boardMissionStatus?.boardMissionStatus?.id ===
          boardMissionsDetails.boardMissionStatus.id
      )?.boardMissions;
      setBoardFromTable(
        statusBoards?.find(
          (bm) => bm?.id === boardMissionsDetails?.boardMissionId
        )
      );
    }
  }, [boards, boardMissionsDetails]);

  return (
    <>
      {isLoading ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={"flex-start"}
        >
          {/* Avatar Skeleton */}
          <Stack direction="row" gap="14px" alignItems="center">
            <Skeleton variant="rectangular" width={80} height={80} />

            <Stack gap="10px">
              {/* Skeleton for product/client names */}
              <Skeleton variant="text" width={200} height={20} />
              <Skeleton variant="text" width={150} height={20} />

              <Stack direction="row" alignItems="center" gap="5px">
                <Skeleton variant="text" width={100} height={20} />
              </Stack>
            </Stack>
          </Stack>
          <Stack gap={"10px"}>
            {/* Navigation buttons Skeleton */}
            <Stack
              direction="row"
              gap="10px"
              alignItems="center"
              alignSelf={"flex-end"}
            >
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </Stack>
            {/* Action Buttons (DocumentsButton and MoreActionsButton) Skeletons  */}
            <Stack direction={"row"} alignItems={"center"} gap={"12px"}>
              <Skeleton
                variant="rectangular"
                width={200}
                height={40}
                style={{ borderRadius: 12 }}
              />
              <Skeleton
                variant="rectangular"
                width={50}
                height={40}
                style={{ borderRadius: 12 }}
              />
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems="flex-start"
        >
          <Stack gap={"14px"} direction={"row"} alignItems={"center"}>
            {/* Avatar */}
            <Stack
              style={{ borderRadius: "12px", border: "2px solid #E6E4E4" }}
            >
              <Avatar
                src={boardMissionsDetails?.boardMissionImage}
                style={{ width: "80px", height: "80px", borderRadius: "8px" }}
                variant={"square"}
              >
                <TocIcon style={{ width: "60px", height: "60px" }} />
              </Avatar>
            </Stack>

            <Stack gap={"10px"}>
              {/* First row */}
              <Stack direction={"row"} alignItems={"center"} gap={"5px"}>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  gap={"5px"}
                  height={"25px"}
                  minHeight={"fit-content"}
                >
                  <HeaderTitleComponent
                    title={boardMissionsDetails?.productName}
                  />
                  <HeaderDividerComponent />
                  <HeaderTitleComponent
                    title={boardMissionsDetails.clientName}
                  />
                  <HeaderDividerComponent />
                  <HeaderTitleComponent
                    title={`${boardMissionsDetails.boardMissionNumber}/${
                      boardMissionsDetails.orderNumber
                    }${!!boardMissionsDetails.productType ? "/" : ""}`}
                  />
                  <span style={classes.productType}>
                    {boardMissionsDetails.sectionName}
                  </span>
                </Stack>
                {/* Status */}
                <Stack
                  style={{
                    backgroundColor: boardMissionsDetails?.isReady
                      ? doneBoardMissionsColors.bfColor
                      : "transparent",
                  }}
                  padding={"0 5px"}
                  direction={"row"}
                  gap={"5px"}
                  color={
                    boardMissionsDetails?.isReady
                      ? doneBoardMissionsColors.color
                      : boardMissionsDetails?.boardMissionStatus?.textColor
                  }
                >
                  {isLoadingStatus ? (
                    <Skeleton
                      variant="rectangular"
                      width={120}
                      height={40}
                      sx={{ borderRadius: "5px" }}
                    />
                  ) : boardMissionsDetails?.isReady ? (
                    <span>{t("boardMissions.done")}</span>
                  ) : (
                    <BoardStatusComponent
                      statusId={boardMissionsDetails.boardMissionStatus?.id}
                      id={boardMissionsDetails?.boardMissionId}
                      onChange={handleStatusChange}
                      isFromMissionView={true}
                      currentStation={boardMissionsDetails?.currentActionName}
                      statusColorBg={
                        boardMissionsDetails?.boardMissionStatus
                          ?.backgroundColor
                      }
                      statusColorText={
                        boardMissionsDetails?.boardMissionStatus?.textColor
                      }
                      statusText={t(
                        `productionStatuses.${boardMissionsDetails.boardMissionStatus?.name}`
                      )}
                    />
                  )}
                </Stack>

                {isLoadingTimer ? (
                  <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton
                      variant="rectangular"
                      width={90}
                      height={40}
                      style={{ borderRadius: 12 }}
                    />
                  </Stack>
                ) : (
                  <ActionCountDown
                    loading={timerLoading}
                    onToggle={onToggleTimer}
                    {...stations.find(
                      (station) =>
                        station.boardMissionActionId ===
                        boardMissionsDetails?.currentBoardMissionActionId
                    )?.boardMissionActionTimer}
                  />
                )}
              </Stack>
              {/* Second row */}
              <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
                {boardMissionsDetails.createdDate && (
                  <Stack direction={"row"} gap={"5px"}>
                    <span style={classes.newParameterLabel}>
                      {t("productionFloor.started")}
                    </span>
                    <span style={classes.newParameterValue}>
                      {DateFormatterDDMMYYYY(
                        convertUtcToLocalIsoString(
                          boardMissionsDetails.createdDate?.toString()
                        )
                      )}
                    </span>
                  </Stack>
                )}
                {boardMissionsDetails.agentName && (
                  <Stack direction={"row"} gap={"5px"}>
                    <span style={classes.newParameterLabel}>
                      {t("productionFloor.agent")}
                    </span>
                    <span style={classes.newParameterValue}>
                      {boardMissionsDetails.agentName}
                    </span>
                  </Stack>
                )}
                {boardMissionsDetails.clientEmail && (
                  <Stack direction={"row"} gap={"5px"}>
                    <span style={classes.newParameterLabel}>
                      {t("login.email")}
                    </span>
                    <span style={classes.newParameterValue}>
                      {boardMissionsDetails.clientEmail}
                    </span>
                  </Stack>
                )}
                {boardMissionsDetails.clientPhone &&
                  clearPhoneNumberPrefix(boardMissionsDetails.clientPhone) !==
                    "" && (
                    <Stack direction={"row"} gap={"5px"}>
                      <span style={classes.newParameterLabel}>
                        {t("sales.quote.phone")}
                      </span>
                      <span style={classes.newParameterValue}>
                        {!CheckPreferenceValue(EPreferences.SHOW_PHONE_PREFIX)
                          ? clearPhoneNumberPrefix(
                              boardMissionsDetails.clientPhone
                            )
                          : boardMissionsDetails.clientPhone}
                      </span>
                    </Stack>
                  )}
                {boardMissionsDetails.dueDate && (
                  <Stack direction={"row"} gap={"5px"}>
                    <span style={classes.newParameterLabel}>
                      {t("productionFloor.deliveredOn")}
                    </span>
                    <span style={classes.newParameterValue}>
                      {DateFormatterDDMMYYYY(boardMissionsDetails.dueDate)}
                    </span>
                  </Stack>
                )}
                {boardMissionsDetails?.isNeedExample && (
                  <span
                    style={{ ...classes.labelsStyle, background: "#BE0270" }}
                  >
                    {t("boardMissions.sampleRequired")}
                  </span>
                )}
                {boardMissionsDetails?.isUrgentWork && (
                  <span style={classes.labelsStyle}>
                    {t("boardMissions.urgent")}
                  </span>
                )}
              </Stack>
            </Stack>
          </Stack>
          {/* Navigation buttons + Actions and Documents buttons*/}
          <Stack gap={"10px"}>
            <Stack
              direction={"row"}
              gap={"10px"}
              alignItems={"center"}
              alignSelf={"flex-end"}
            >
              <Tooltip
                title={`${boardFromTable?.previousBoardMission?.productName} |  ${boardFromTable?.previousBoardMission?.clientName} | ${boardFromTable?.previousBoardMission?.boardMissionNumber} / ${boardFromTable?.previousBoardMission?.orderNumber}`}
                arrow
              >
                <IconButton
                  onClick={() =>
                    onNavigateBoardMissions(
                      boardFromTable?.previousBoardMission?.boardMissionId,
                      boardFromTable?.previousBoardMission?.productType
                    )
                  }
                  style={{ border: "1px solid", width: "40px", height: "40px" }}
                  color={"error"}
                  disabled={!boardFromTable?.previousBoardMission}
                >
                  {direction === "ltr" ? (
                    <NavigateBeforeIcon />
                  ) : (
                    <NavigateNextIcon />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip
                title={`${boardFromTable?.nextBoardMission?.productName} |  ${boardFromTable?.nextBoardMission?.clientName} | ${boardFromTable?.nextBoardMission?.boardMissionNumber} / ${boardFromTable?.nextBoardMission?.orderNumber}`}
                arrow
              >
                <IconButton
                  onClick={() =>
                    onNavigateBoardMissions(
                      boardFromTable?.nextBoardMission?.boardMissionId,
                      boardFromTable?.nextBoardMission?.productType
                    )
                  }
                  style={{ border: "1px solid", width: "40px", height: "40px" }}
                  color={"success"}
                  disabled={!boardFromTable?.nextBoardMission}
                >
                  {direction === "ltr" ? (
                    <NavigateNextIcon />
                  ) : (
                    <NavigateBeforeIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} gap={"12px"}>
              <ApprovalFileStatusComponent
                height={"40px"}
                width={"40px"}
                fileStatus={boardMissionsDetails.showGraphicsApprovalAlert}
                t={t}
              />
              <DocumentsButton />
              <PermissionCheck
                userPermission={
                  Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
                }
              >
                <MoreActionsButton />
              </PermissionCheck>
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export { BoardMissionsDetailsHeader };
