import Stack from "@mui/material/Stack";
import { Avatar, Divider, IconButton, Skeleton, Tooltip } from "@mui/material";
import { useStyle } from "@/widgets/production-floor/views/board-missions-view/header/style";
import { DateHourFormatterShort } from "@/utils/date-formatters";
import TocIcon from "@mui/icons-material/Toc";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
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
import { useIsMobile } from "@/hooks/use-responsive";
import { FONT_FAMILY } from "@/utils/font-family";
import { DateField } from "@/components/date-picker/date-filed";
import { updateJobDueDateApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios } from "@/hooks";
import moment from "moment/moment";
import { GoMakeDeleteModal } from "@/components/modal-deleted/modal";
import { AddStuckReasonWidget } from "@/widgets/production-floor/add-stuck-reason/add-stuck-reason";
import { ModalType } from "@/enums";

const HeaderTitleComponent = ({ title }: { title?: string }) => {
  const { classes } = useStyle();
  const isMobile = useIsMobile();

  return (
    <span
      style={{
        ...classes.title,
        ...(isMobile && { ...FONT_FAMILY.Inter(600, 16) }),
      }}
    >
      {title}
    </span>
  );
};

const HeaderDividerComponent = () => {
  const { classes } = useStyle();
  return <Divider orientation={"vertical"} style={classes.divider} flexItem />;
};

const InfoSection = ({ boardMissionsDetails, CheckPreferenceValue, t }) => {
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const [jobDueDate, setJobDueDate] = useState(
    boardMissionsDetails.dueDate?.toString()
  );
  useEffect(() => {
    setJobDueDate(boardMissionsDetails.dueDate?.toString());
  }, [boardMissionsDetails]);
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);

  const fieldMappings = useMemo(
    () => [
      {
        condition: boardMissionsDetails.createdDate,
        label: t("productionFloor.started"),
        value: DateHourFormatterShort(
          convertUtcToLocalIsoString(
            boardMissionsDetails.createdDate?.toString()
          )
        ),
      },
      {
        condition: boardMissionsDetails.dueDate,
        label: t("sales.quote.deliveryDate"),
        value: (
          <div>
            <div style={{ visibility: "hidden", width: 0, height: 0 }}>
              <div>
                <DateField
                  label={""}
                  date={convertUtcToLocalIsoString(jobDueDate)}
                  handleChange={(newDate) => {
                    let utcDueDate = new Date(newDate).toUTCString();
                    let mom = moment(newDate);
                    let formattedDueDate = mom
                      .utc()
                      .format("YYYY-MM-DD HH:mm:ss");
                    setJobDueDate(formattedDueDate);
                    updateJobDueDateApi(callApi, () => { }, {
                      boardMissionId: boardMissionsDetails.boardMissionId,
                      dueDate: utcDueDate,
                    }).then();
                  }}
                  isEditable={true}
                  withTime={true}
                  inputWidth={"100"}
                  format={"DD/MM HH:mm"}
                  openPicker={openDatePicker}
                  onClose={() => setOpenDatePicker(false)}
                />
              </div>
            </div>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setOpenDatePicker(true)}
            >
              {DateHourFormatterShort(convertUtcToLocalIsoString(jobDueDate))}
            </span>
          </div>
        ),
      },
      {
        condition: boardMissionsDetails.agentName,
        label: t("productionFloor.agent"),
        value: boardMissionsDetails.agentName,
      },
      {
        condition: boardMissionsDetails.contactName,
        label: t("sales.quote.contactName"),
        value: boardMissionsDetails.contactName,
      },
      {
        condition: boardMissionsDetails.clientEmail,
        label: t("login.email"),
        value: boardMissionsDetails.clientEmail,
      },
      {
        condition:
          boardMissionsDetails.clientPhone &&
          clearPhoneNumberPrefix(boardMissionsDetails.clientPhone) !== "",
        label: t("sales.quote.phone"),
        value: !CheckPreferenceValue(EPreferences.SHOW_PHONE_PREFIX)
          ? clearPhoneNumberPrefix(boardMissionsDetails.clientPhone)
          : boardMissionsDetails.clientPhone,
      },
    ],
    [boardMissionsDetails, t, jobDueDate, openDatePicker, callApi]
  );

  const statusLabels = [
    {
      condition: boardMissionsDetails?.isNeedExample,
      label: t("boardMissions.sampleRequired") + " : " + (boardMissionsDetails?.exampleType === 1 ? t("products.offsetPrice.admin.Physical") : t("products.offsetPrice.admin.Digital")),
      background: "#BE0270",
    },
    {
      condition: boardMissionsDetails?.isUrgentWork,
      label: t("boardMissions.urgent"),
      background: undefined,
    },
    {
      condition: boardMissionsDetails?.isRepetitiveWork,
      label: t("boardMissions.isRepetitiveWork"),
      background: "#B93815",
    },
    {
      condition: boardMissionsDetails?.isHaveDelivery,
      label: t("boardMissions.isHaveDelivery"),
      background: "#F4A100",
    },
  ];

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={"12px"}
      flexWrap={"wrap"}
    >
      {/* Render Fields */}
      {fieldMappings.map(
        ({ condition, label, value }, index) =>
          condition && (
            <Stack direction={"row"} gap={"5px"} key={index}>
              <span style={classes.newParameterLabel}>{label}</span>
              <span style={classes.newParameterValue}>{value}</span>
            </Stack>
          )
      )}

      {/* Render Status Labels */}
      {statusLabels.map(
        ({ condition, label, background }, index) =>
          condition && (
            <span key={index} style={{ ...classes.labelsStyle, background }}>
              {label}
            </span>
          )
      )}
    </Stack>
  );
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
    sortedStations,
    openSimpleApproveModal,
    openSimpleStuckModal,
    stuckReason,
    setStuckReason,
    handleCloseStuckModal,
    onUpdateStuckReason,
  } = useBoardMissionsDetailsHeader();

  const isLoading = !boardMissionsDetails?.boardMissionId; // Check if boardMissionId exists
  const isLoadingTimer = isLoading || sortedStations?.length === 0;

  useEffect(() => {
    setBoardMissionsDetails({} as IBoardMissionsDetails);
  }, []);

  useEffect(() => {
    setBoardMissionsDetails(boardMissionsDetails);
  }, [boardMissionsDetails]);

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

  const isMobile = useIsMobile();

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
            <Skeleton
              variant="rectangular"
              width={isMobile ? 60 : 80}
              height={isMobile ? 60 : 80}
            />

            <Stack gap="10px">
              {/* Skeleton for product/client names */}
              <Skeleton variant="text" width={200} height={20} />
              <Skeleton variant="text" width={150} height={20} />

              <Stack direction="row" alignItems="center" gap="5px">
                <Skeleton variant="text" width={100} height={20} />
              </Stack>
            </Stack>
          </Stack>
          {!isMobile && (
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
          )}
        </Stack>
      ) : (
        <>
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
                  sx={{
                    width: isMobile ? 60 : 80,
                    height: isMobile ? 60 : 80,
                    borderRadius: "8px",
                  }}
                  variant={"square"}
                >
                  <TocIcon
                    style={{
                      width: isMobile ? "40px" : "60px",
                      height: isMobile ? "40px" : "60px",
                    }}
                  />
                </Avatar>
              </Stack>

              <Stack gap={"10px"}>
                {/* First row */}
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  gap={"5px"}
                  style={{ ...(isMobile && { flexWrap: "wrap" }) }}
                >
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
                      title={`${boardMissionsDetails.boardMissionNumber}/${boardMissionsDetails.orderNumber
                        }${!!boardMissionsDetails.productType ? "/" : ""}`}
                    />
                    <span style={classes.productType}>
                      {boardMissionsDetails.sectionName}
                    </span>
                  </Stack>
                  {/* Status */}
                  <Stack
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
                      <span
                        style={{
                          ...classes.doneLabel,
                          color: doneBoardMissionsColors.color,
                          border: `1px solid ${doneBoardMissionsColors.color}`,
                          background: doneBoardMissionsColors.bfColor,
                        }}
                      >
                        {t("boardMissions.done")}
                      </span>
                    ) : (
                      <BoardStatusComponent
                        statusId={boardMissionsDetails.boardMissionStatus?.id}
                        id={boardMissionsDetails?.boardMissionId}
                        onChange={(id, statusId, productType) => {
                          handleStatusChange(id, statusId, productType);
                        }}
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
                        productType={boardMissionsDetails?.productType}
                      />
                    )}
                  </Stack>
                  {!boardMissionsDetails?.isReady &&
                    (isLoadingTimer ? (
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        gap={"8px"}
                      >
                        <Skeleton
                          variant="circular"
                          width={isMobile ? 22 : 32}
                          height={isMobile ? 22 : 32}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={isMobile ? 80 : 90}
                          height={isMobile ? 30 : 40}
                          style={{ borderRadius: 12 }}
                        />
                      </Stack>
                    ) : (
                      <ActionCountDown
                        loading={timerLoading}
                        onToggle={onToggleTimer}
                        {...boardMissionsDetails?.currentStation
                          ?.boardMissionActionTimer}
                      />
                    ))}
                </Stack>
                {/* Second row */}
                {!isMobile && (
                  <InfoSection
                    boardMissionsDetails={boardMissionsDetails}
                    CheckPreferenceValue={CheckPreferenceValue}
                    t={t}
                  />
                )}
              </Stack>
            </Stack>
            {/* Navigation buttons + Actions and Documents buttons*/}
            {!isMobile && (
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
                      style={{
                        border: "1px solid",
                        width: "40px",
                        height: "40px",
                      }}
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
                      style={{
                        border: "1px solid",
                        width: "40px",
                        height: "40px",
                      }}
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
                    height={"30px"}
                    width={"30px"}
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
            )}
          </Stack>
          {isMobile && (
            <InfoSection
              boardMissionsDetails={boardMissionsDetails}
              CheckPreferenceValue={CheckPreferenceValue}
              t={t}
            />
          )}

          {isMobile && (
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={"12px"}
              justifyContent={isMobile ? "flex-end" : undefined}
            >
              <ApprovalFileStatusComponent
                height={isMobile ? "20px" : "30px"}
                width={isMobile ? "20px" : "30px"}
                fileStatus={boardMissionsDetails.showGraphicsApprovalAlert}
                t={t}
              />
              <DocumentsButton isMobile={isMobile} />
              <PermissionCheck
                userPermission={
                  Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
                }
              >
                <MoreActionsButton isMobile={isMobile} />
              </PermissionCheck>
            </Stack>
          )}

          <GoMakeDeleteModal
            title={t("sales.quote.stuckReasonTitleModal")}
            yesBtn={t("modal.yes")}
            modalType={ModalType.WARNING}
            subTitle={" "}
            openModal={openSimpleStuckModal}
            onClose={handleCloseStuckModal}
            onClickDelete={() =>
              onUpdateStuckReason(
                stuckReason,
                boardMissionsDetails?.boardMissionId,
                boardMissionsDetails.productType
              )
            }
          >
            <AddStuckReasonWidget
              stuckReason={stuckReason}
              setStuckReason={setStuckReason}
            />
          </GoMakeDeleteModal>
        </>
      )}
    </>
  );
};

export { BoardMissionsDetailsHeader };
