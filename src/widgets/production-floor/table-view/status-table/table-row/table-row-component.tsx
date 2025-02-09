import { SecondaryTableCell } from "@/components/tables/secondary-table";
import { CurrentStationComponent } from "@/widgets/production-floor/table-view/status-table/stations/current-station";
import { BoardStatusComponent } from "@/widgets/production-floor/table-view/status-table/board-status/board-status";
import { useDrag, useDrop } from "react-dnd";
import { useRecoilState } from "recoil";
import { selectedBoardsMissionsState } from "@/widgets/production-floor/state/boards";
import { useProductionFloorData } from "@/widgets/production-floor/use-production-floor-data";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { useRef, useState } from "react";
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
import { DescreptionWidget } from "@/widgets/production-floor/descreption-widget/descreption-widget";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import { ApprovalFileStatusComponent } from "./approval-file-status-component";
import { ExpandIcon } from "@/icons/expand-icon";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { isValidCustomer } from "@/utils/helpers";
import { getAndSetCustomerById } from "@/services/api-service/customers/customers-api";
import { useGomakeAxios } from "@/hooks";
interface IProps {
  boardMission: IBoardMissions;
  status?: any;
  onClickDone?: (mission: any) => void;
  onClickPrintDTicket?: (mission: any) => void;
  onClickClient?: (clientId: any) => void;
  index: number;
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
}: IProps) => {
  console.log("boardMission", boardMission);

  const { push } = useRouter();
  const [selectedIds, setSelectedIds] = useRecoilState(
    selectedBoardsMissionsState
  );

  const onCustomerAdd = (customer) => {
    //setOpenCustomerModal(false);
  };

  const { CheckPermission } = useUserPermission();
  const canDrag = CheckPermission(
    Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
  );
  const [dropArea, setDropArea] = useState<EDropArea>();
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
          updateStatus([item.board], boardMission.statusId).then();
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

  const { updateStatus, updateBoardMissionsOrder, t, onClickPrintJob } =
    useProductionFloorData();

  const onSelectBoardMissions = (id: string, checked: boolean) => {
    setSelectedIds(
      checked
        ? [...selectedIds, boardMission]
        : selectedIds.filter(
          (selectedBoard) =>
            selectedBoard.id !== id &&
            selectedBoard.productType === boardMission.productType
        )
    );
  };

  drag(drop(ref));
  return (
    <>
      <TableRow >
        <TableCell colSpan={10} style={{ padding: 0, transition: "padding 1s" }}>
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
        style={{ cursor: canDrag ? "move" : "default", marginBottom: "100px", }}
      >
        <PermissionCheck
          userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}
        >
          <SecondaryTableCell align={"center"} style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9F9" }}>
            <Checkbox
              checked={
                !!selectedIds?.find(
                  (si) =>
                    si.id === boardMission.id &&
                    si.productType === boardMission.productType
                )
              }
              onChange={(a) => {
                onSelectBoardMissions(boardMission.id, a.target.checked);
              }}
              icon={<CheckboxIcon color="#D0D5DD" width="20" height="20" />}
              checkedIcon={<CheckboxCheckedIcon fill="#2E3092" width="20" height="20" />}
            />
          </SecondaryTableCell>
        </PermissionCheck>
        <SecondaryTableCell align={"center"} style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9F9" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
            <div />
            <div />
            <DateTimeProductionFloorComponent dateString={boardMission.boardMissionCreatedDate} />

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", }}>
              {
                boardMission.showGraphicsApprovalAlert && <ApprovalFileStatusComponent
                  fileStatus={boardMission.showGraphicsApprovalAlert}
                  t={t}
                />
              }

              <div style={{ marginTop: "5px" }}>
                {boardMission.isUrgentWork && (
                  <KeyboardDoubleArrowUpIcon style={{
                    color: errorColor(500),
                  }} />
                )}
              </div>

            </div>
            <div />

          </div>
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"} style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9F9", cursor: "pointer" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }} onClick={() => {
            push(
              `/production-floor?boardMissionsId=${boardMission?.id}&productType=${boardMission?.productType}&step=stations`
            ).then();
          }}>
            <div />
            <div />

            <div

              style={{
                cursor: "pointer",
                textDecoration: "none",
                color: "#000000",
              }}
            >
              {`${boardMission?.boardMissionNumber}`}
              <br />
              {`${boardMission?.orderNumber}`}
            </div>
            <ExpandIcon />
          </div>
        </SecondaryTableCell>

        <SecondaryTableCell align={"center"} style={{ width: "20px",cursor:"pointer", backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9F9" }} onClick={() => onClickClient(boardMission?.clientId)}>
          {getTruncatedLabel(boardMission?.clientName, 15)}
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"} style={{ padding: "0px 10px", backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9F9" }}>
          <ClickableLabelComponent
            label={getTruncatedLabel(boardMission?.productName, 18)}
            id={boardMission.id}
            textColor={boardMission?.productionFloorJobColor}
            t={t}
            key={boardMission.id}
          />
        </SecondaryTableCell>

        <SecondaryTableCell align={"center"} style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9F9" }}>
          <DescreptionWidget desciption={boardMission.description} />
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"} style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9F9" }}>
          <BoardStatusComponent
            statusId={boardMission.statusId}
            id={boardMission.id}
            onChange={(id, statusId) => updateStatus([boardMission], statusId)}
          />
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"} style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9F9" }}>
          <CurrentStationComponent
            {...boardMission.currentStation}
            boardMissionId={boardMission.id}
            status={status}
            textColor={boardMission?.productionFloorJobColor}
          />
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"} style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9F9" }}>
          <NextStationComponent
            {...boardMission.currentStation}
            {...boardMission.nextStation}
            boardMissionId={boardMission.id}
            status={status}
            textColor={boardMission?.productionFloorJobColor}
            onClickDone={() => onClickDone(boardMission)}
          />
        </SecondaryTableCell>
        {/* <SecondaryTableCell
          align={"center"}
          style={{ width: "20px", gap: "2px" }}
        >
          <Stack justifyContent={"center"} direction={"row"} flexWrap={"wrap"}>
            {boardMission?.automatedTags?.map((tag) => (
              <LabelComponent key={tag} label={tag} />
            ))}
          </Stack>
        </SecondaryTableCell> */}
        <SecondaryTableCell align={"center"} style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9F9" }}>
          <MoreMenuWidget
            boardMission={boardMission}
            onClickDone={onClickDone}
            onClickPrintJob={onClickPrintJob}
            onClickPrintDTicket={onClickPrintDTicket}
          />
        </SecondaryTableCell>
      </TableRow>

      <TableRow >
        <TableCell colSpan={10} style={{ padding: 0, transition: "padding 1s" }}>
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
    </>
  );
};

export { TableRowComponent };
