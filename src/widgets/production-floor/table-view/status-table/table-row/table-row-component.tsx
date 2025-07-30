import { SecondaryTableCell } from "@/components/tables/secondary-table";
import { CurrentStationComponent } from "@/widgets/production-floor/table-view/status-table/stations/current-station";
import { BoardStatusComponent } from "@/widgets/production-floor/table-view/status-table/board-status/board-status";
import { useDrag, useDrop } from "react-dnd";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  boardMissionsDetailsState,
  selectedBoardsMissionsState,
} from "@/widgets/production-floor/state/boards";
import { useProductionFloorData } from "@/widgets/production-floor/use-production-floor-data";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Checkbox,
  Collapse,
  Skeleton,
  TableCell,
  TableRow,
} from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { MoreMenuWidget } from "./more-circle";
import { ClickableLabelComponent } from "@/widgets/production-floor/label-component/clickable-label-component";
import { NextStationComponent } from "../stations/next-station";
import { useRouter } from "next/router";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { getTruncatedLabel } from "@/utils/get-truncated-text";
import { CheckboxCheckedIcon } from "@/icons/checked-icon";
import { CheckboxIcon } from "@/icons/checkbox-icon";
import { DateTimeProductionFloorComponent } from "@/widgets/production-floor/date-comp/date-componenet";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { ApprovalFileStatusComponent } from "./approval-file-status-component";
import { ExpandIcon } from "@/icons/expand-icon";
import { convertUtcToLocalIsoString } from "@/components/date-time/date-time-component";
import { DateField } from "@/components/date-picker/date-filed";
import { useGomakeAxios } from "@/hooks";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { ProductionFloorNote } from "../board-note/production-floor-note";
import { useSimpleApproveModal } from "@/hooks/use-simple-approve-modal";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";
import { boardMissionsActivitiesState } from "@/widgets/production-floor/state/board-missions-activities";
import { boardMissionsStationsState } from "@/widgets/production-floor/views/board-missions-view/stations/state";
import { boardMissionsFilesState } from "@/widgets/production-floor/views/board-missions-view/files/state";
import { AddStuckReasonWidget } from "@/widgets/production-floor/add-stuck-reason/add-stuck-reason";
import { CharacterDetails } from "@/widgets/quote-new/quote-table/row-details/character-details";

interface IProps {
  boardMission: IBoardMissions;
  status?: any;
  onClickDone?: (mission: any) => void;
  onClickPrintDTicket?: (mission: any) => void;
  onClickClient?: (clientId: any) => void;
  index: number;
  isMobileScreen: boolean;
  isRTL?: boolean;
  isUrgentWork?: boolean;
  onUpdateJobDueDate?: (boardMissionId: string, dueDate: string) => void;
  employeesCategories?: any;
  visibleColumns: string[];
}

enum EDropArea {
  BEFORE,
  AFTER,
  DISABLED,
}

const TableRowComponent = ({
  boardMission,
  status,
  onClickDone,
  onClickPrintDTicket,
  onClickClient,
  index,
  isMobileScreen,
  isRTL,
  isUrgentWork,
  onUpdateJobDueDate,
  employeesCategories,
  visibleColumns,
}: IProps) => {
  const { push } = useRouter();
  const [selectedIds, setSelectedIds] = useRecoilState(
    selectedBoardsMissionsState
  );
  const { CheckPermission } = useUserPermission();
  const { callApi } = useGomakeAxios();
  const canDrag =
    CheckPermission(Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR) &&
    !status.isGroup;
  const [dropArea, setDropArea] = useState<EDropArea>();
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const { errorColor } = useGomakeTheme();
  const ref = useRef(null);
  const [, drag] = useDrag(
    () => ({
      type: "task",
      item: { board: boardMission, type: "TASK", selectedIds },
      canDrag: () => canDrag,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [selectedIds, canDrag]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "task",
      drop: (
        item: { board: IBoardMissions; selectedIds: IBoardMissions[] },
        monitor
      ) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        if (boardMission.statusId !== item.board.statusId) {
          if (
            boardMission.statusId === "79251980-1c2d-4b4f-9ab4-9ccb9cb9fb63" &&
            boardMission.isNeedExample
          ) {
            handleOpenModal(
              boardMission.statusId,
              [boardMission],
              boardMission.id
            );
          } else if (
            boardMission.statusId === "56dd1e80-7436-462c-82e9-cf8a90afd614"
          ) {
            handleOpenStuckModal(
              boardMission.statusId,
              [boardMission],
              boardMission.id,
              boardMission.productType
            );
          } else {
            updateStatus([item.board], boardMission.statusId).then();
          }
        }
        if (
          item.board.priority !== boardMission.priority &&
          item.board.statusId === boardMission.statusId
        ) {
          updateBoardMissionsOrder({
            source: {
              id: item.board.id,
              productType: item.board.productType,
              priority: item.board.priority,
            },
            destination: {
              id: boardMission.id,
              productType: boardMission.productType,
              priority: boardMission.priority,
            },
            statusId: boardMission.statusId,
          }).then();
        }
      },
      hover: (item: {
        board: IBoardMissions;
        selectedIds: IBoardMissions[];
      }) => {
        if (
          item.board.id === boardMission.id ||
          item.board.statusId !== boardMission.statusId
        ) {
          setDropArea(EDropArea.DISABLED);
        } else {
          if (boardMission.priority < item.board.priority) {
            setDropArea(EDropArea.BEFORE);
          } else {
            setDropArea(EDropArea.AFTER);
          }
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [boardMission]
  );

  const {
    updateStatus,
    updateBoardMissionsOrder,
    t,
    onClickPrintJob,
    onClickUnGroupJob,
    updateNotes,
  } = useProductionFloorData();

  const {
    openSimpleApproveModal,
    handleOpenModal,
    handleCloseModal,
    handleConfirm,
    openSimpleStuckModal,
    handleOpenStuckModal,
    handleCloseStuckModal,
    stuckReason,
    setStuckReason,
    onUpdateStuckReason,
  } = useSimpleApproveModal(updateStatus);

  const { GetProductionFontSizeFromPreferences } = usePrintHousePreferences();

  // const onSelectBoardMissions = (id: string, checked: boolean) => {
  //   setSelectedIds(
  //     checked
  //       ? [...selectedIds, boardMission]
  //       : selectedIds.filter(
  //           (selectedBoard) =>
  //             selectedBoard.id !== id &&
  //             selectedBoard.productType === boardMission.productType
  //         )
  //   );
  // };

  const onSelectBoardMissions = (id: string, checked: boolean) => {
    setSelectedIds(
      checked
        ? [...selectedIds, boardMission] // Add the full object, not just the ID
        : selectedIds.filter(
          (selectedBoard) => selectedBoard.id !== id
        )
    );
  };
  const onClickOpenDatePicker = () => {
    setOpenDatePicker(true);
  };
  drag(drop(ref));

  const setFiles = useSetRecoilState(boardMissionsFilesState);
  const setStations = useSetRecoilState(boardMissionsStationsState);
  const setBoardMissionsDetails = useSetRecoilState(boardMissionsDetailsState);
  const setActivities = useSetRecoilState(boardMissionsActivitiesState);

  const selectedIdsSet = useMemo(
    () => new Set(selectedIds.map((item) => item.id)),
    [selectedIds]
  );

  const renderCell = useCallback(
    (key: string) => {
      const commonStyle = {
        backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9F9",
      };

      switch (key) {
        case "checkbox":
          return (
            <PermissionCheck
              userPermission={
                Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
              }
            >
              <SecondaryTableCell
                align={"center"}
                style={{
                  ...commonStyle,
                  ...(isMobileScreen && {
                    position: "sticky",
                    [isRTL ? "right" : "left"]: 0,
                    zIndex: 11,
                  }),
                }}
              >
                <Checkbox
                  checked={selectedIdsSet.has(boardMission.id)}
                  onChange={(a) => {
                    onSelectBoardMissions(boardMission.id, a.target.checked);
                  }}
                  icon={<CheckboxIcon color="#D0D5DD" width="20" height="20" />}
                  checkedIcon={
                    <CheckboxCheckedIcon
                      fill="#2E3092"
                      width="20"
                      height="20"
                    />
                  }
                />
              </SecondaryTableCell>
            </PermissionCheck>
          );

        case "job_order":
          return (
            <SecondaryTableCell
              align={"center"}
              style={{
                ...commonStyle,
                cursor: "pointer",
                ...(isMobileScreen && {
                  position: "sticky",
                  [isRTL ? "right" : "left"]: 48,
                  zIndex: 10,
                }),
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
                onClick={() => {
                  push(
                    `/production-floor?boardMissionsId=${boardMission?.id}&productType=${boardMission?.productType}&step=stations`
                  );
                  setFiles([]);
                  setStations([]);
                  setBoardMissionsDetails(null);
                  setActivities([]);
                }}
              >
                <div />

                <div
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "#000000",
                    fontWeight: "bolder",
                    fontSize: GetProductionFontSizeFromPreferences(),
                  }}
                >
                  {boardMission?.productType
                    ? boardMission?.sectionName
                      ? boardMission?.sectionName + " / "
                      : boardMission?.productType + " / "
                    : null}
                  {`${boardMission?.boardMissionNumber}`}
                  <br />
                  {`${boardMission?.orderNumber}`}
                </div>
                <ExpandIcon />
              </div>
            </SecondaryTableCell>
          );

        case "deliveryDate":
          return (
            <SecondaryTableCell
              align={"center"}
              style={{
                backgroundColor: boardMission.jobDeliveryTimeAlertColor
                  ? boardMission.jobDeliveryTimeAlertColor
                  : index % 2 === 0
                    ? "#FFFFFF"
                    : "#F9F9F9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div />
                <div />
                <div onClick={onClickOpenDatePicker}>
                  <DateTimeProductionFloorComponent
                    dateString={convertUtcToLocalIsoString(
                      boardMission.dueDate?.toString()
                    )}
                  />
                </div>
                <div style={{ visibility: "hidden" }}>
                  <div>
                    <DateField
                      label={""}
                      date={convertUtcToLocalIsoString(
                        boardMission.dueDate?.toString()
                      )}
                      handleChange={(newDate) => {
                        onUpdateJobDueDate(boardMission.id, newDate);
                      }}
                      isEditable={true}
                      withTime={true}
                      inputWidth={"1px"}
                      openPicker={openDatePicker}
                      onClose={() => setOpenDatePicker(false)}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: isUrgentWork ? "50px" : null,
                    minWidth: isUrgentWork ? "50px" : null,
                    width: isUrgentWork ? "50px" : null,
                  }}
                >
                  {boardMission.showGraphicsApprovalAlert && (
                    <ApprovalFileStatusComponent
                      fileStatus={boardMission.showGraphicsApprovalAlert}
                      t={t}
                    />
                  )}

                  <div style={{ marginTop: "5px" }}>
                    {boardMission.isUrgentWork && (
                      <KeyboardDoubleArrowUpIcon
                        style={{
                          color: errorColor(500),
                        }}
                      />
                    )}
                  </div>
                </div>
                <div />
              </div>
            </SecondaryTableCell>
          );

        case "customer":
          return (
            <SecondaryTableCell
              align={"center"}
              style={{
                width: "20px",
                cursor: "pointer",
                fontSize: GetProductionFontSizeFromPreferences(),
                ...commonStyle,
              }}
              onClick={() => onClickClient(boardMission?.clientId)}
            >
              {getTruncatedLabel(boardMission?.clientName, 15)}
            </SecondaryTableCell>
          );

        case "agent":
          return (
            <SecondaryTableCell
              align={"center"}
              style={{
                width: "15px",
                cursor: "pointer",
                fontSize: GetProductionFontSizeFromPreferences(),
                ...commonStyle,
              }}
            >
              {getTruncatedLabel(boardMission?.agentName, 15)}
            </SecondaryTableCell>
          );

        case "productName":
          return (
            <SecondaryTableCell
              align={"center"}
              style={{
                padding: "0px 10px",
                ...commonStyle,
              }}
            >
              <ClickableLabelComponent
                label={getTruncatedLabel(boardMission?.productName, 18)}
                id={boardMission.id}
                textColor={boardMission?.productionFloorJobColor}
                t={t}
                key={boardMission.id}
              />
            </SecondaryTableCell>
          );

        case "description":
          return (
            <SecondaryTableCell style={commonStyle}>
              <CharacterDetails
                details={boardMission.description}
                canUpdate={false}
              />
            </SecondaryTableCell>
          );

        case "notes":
          return (
            <SecondaryTableCell
              align="center"
              style={{ ...commonStyle, maxWidth: "180px", padding: "8px" }}
            >
              <ProductionFloorNote
                key={boardMission.id}
                value={boardMission?.noteColumn || ""}
                onSave={(val, reset, closeEditing) =>
                  updateNotes(
                    boardMission?.id,
                    boardMission?.productType,
                    val,
                    reset,
                    closeEditing
                  )
                }
              />
            </SecondaryTableCell>
          );

        case "status":
          return (
            <SecondaryTableCell align="center" style={commonStyle}>
              <BoardStatusComponent
                statusId={boardMission.statusId}
                id={boardMission.id}
                onChange={(id, statusId) => {
                  if (
                    statusId === "79251980-1c2d-4b4f-9ab4-9ccb9cb9fb63" &&
                    boardMission.isNeedExample
                  ) {
                    handleOpenModal(statusId, [boardMission], boardMission.id);
                  } else if (
                    statusId === "56dd1e80-7436-462c-82e9-cf8a90afd614"
                  ) {
                    handleOpenStuckModal(
                      statusId,
                      [boardMission],
                      boardMission.id,
                      boardMission.productType
                    );
                  } else {
                    updateStatus([boardMission], statusId);
                  }
                }}
              />
            </SecondaryTableCell>
          );

        case "currentStation":
          return (
            <SecondaryTableCell
              align={"center"}
              style={{
                backgroundColor: boardMission?.currentStationColor
                  ? boardMission?.currentStationColor
                  : index % 2 === 0
                    ? "#FFFFFF"
                    : "#F9F9F9",
              }}
            >
              <CurrentStationComponent
                {...boardMission.currentStation}
                boardMissionId={boardMission.id}
                status={status}
                textColor={boardMission?.productionFloorJobColor}
                onClickDone={() => onClickDone(boardMission)}
                employeesCategories={employeesCategories}
              />
            </SecondaryTableCell>
          );

        case "nextStation":
          return (
            <SecondaryTableCell align="center" style={commonStyle}>
              <NextStationComponent
                {...boardMission.currentStation}
                {...boardMission.nextStation}
                boardMissionId={boardMission.id}
                status={status}
                textColor={boardMission.productionFloorJobColor}
                onClickDone={() => onClickDone(boardMission)}
              />
            </SecondaryTableCell>
          );

        case "more":
          return (
            <SecondaryTableCell align="center" style={commonStyle}>
              <MoreMenuWidget
                boardMission={boardMission}
                onClickDone={onClickDone}
                onClickPrintJob={onClickPrintJob}
                onClickPrintDTicket={onClickPrintDTicket}
                onClickUnGroupJob={onClickUnGroupJob}
              />
            </SecondaryTableCell>
          );

        default:
          return null;
      }
    },
    [
      selectedIds,
      boardMission,
      index,
      isMobileScreen,
      isRTL,
      onClickClient,
      onSelectBoardMissions,
    ]
  );

  return (
    <>
      <TableRow>
        <TableCell
          colSpan={10}
          style={{ padding: 0, transition: "padding 1s" }}
        >
          {
            <Collapse
              in={
                selectedIds.length === 0 &&
                isOver &&
                dropArea === EDropArea.BEFORE
              }
            >
              <Skeleton height={"50px"} />
            </Collapse>
          }
        </TableCell>
      </TableRow>
      <TableRow
        ref={ref}
        style={{ cursor: canDrag ? "move" : "default", marginBottom: "100px" }}
      >
        {visibleColumns.map((key) => renderCell(key))}
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={10}
          style={{ padding: 0, transition: "padding 1s" }}
        >
          {
            <Collapse
              in={
                selectedIds.length === 0 &&
                isOver &&
                dropArea === EDropArea.AFTER
              }
            >
              <Skeleton height={"50px"} />
            </Collapse>
          }
        </TableCell>
      </TableRow>
      <GoMakeDeleteModal
        title={t("sales.quote.simpleApproveMail")}
        yesBtn={t("modal.yes")}
        modalType={ModalType.WARNING}
        subTitle={" "}
        openModal={openSimpleApproveModal}
        onClose={handleCloseModal}
        onClickDelete={handleConfirm}
        onClickCancel={handleCloseModal}
      />
      <GoMakeDeleteModal
        title={t("sales.quote.stuckReasonTitleModal")}
        yesBtn={t("modal.yes")}
        modalType={ModalType.WARNING}
        subTitle={" "}
        openModal={openSimpleStuckModal}
        onClose={handleCloseStuckModal}
        onClickDelete={() => onUpdateStuckReason(stuckReason)}
      >
        <AddStuckReasonWidget
          stuckReason={stuckReason}
          setStuckReason={setStuckReason}
        />
      </GoMakeDeleteModal>
    </>
  );
};

export { TableRowComponent };
