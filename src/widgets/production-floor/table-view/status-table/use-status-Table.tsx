import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  boardsMissionsState,
  selectedBoardsMissionsState,
} from "@/widgets/production-floor/state/boards";
import { SecondaryCheckBox } from "@/components/check-box/secondary-check-box";
import { useTranslation } from "react-i18next";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";
import { Checkbox } from "@mui/material";
import { CheckboxCheckedIcon } from "@/icons";
import { CheckboxIcon } from "@/icons";
import { EPreferences } from "@/enums/prefernces";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import {
  columnOrderState,
  columnVisibilityState,
} from "../../state/production-floor-coulmns-table-settings";

const useStatusTable = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [boardsMissions] = useRecoilState(boardsMissionsState);
  const [selectedBoards, setSelectedBoards] = useRecoilState(
    selectedBoardsMissionsState
  );
  const { t } = useTranslation();
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const onClickStatus = () => {
    setIsOpen((prevState) => !prevState);
  };

  const onChangeHeaderCheckBox = (statusId: string, checked: boolean) => {
    const currentStatus = status(statusId);
    if (!currentStatus) return;

    const boardsInStatus = currentStatus.boardMissions || [];

    if (checked) {
      // Add all boards in this status that are not already selected (by id + productType)
      const toAdd = boardsInStatus.filter(
        (b) =>
          !selectedBoards?.some(
            (sb) => sb.id === b.id && sb.productType === b.productType
          )
      );
      setSelectedBoards([...(selectedBoards || []), ...toAdd]);
    } else {
      // Remove all boards in this status (by id + productType)
      const keysToRemove = new Set(
        boardsInStatus.map((b) => `${b.id}__${b.productType}`)
      );
      const remaining = (selectedBoards || []).filter(
        (sb) => !keysToRemove.has(`${sb.id}__${sb.productType}`)
      );
      setSelectedBoards(remaining);
    }
  };
  const status = (statusId: string) =>
    boardsMissions.find(
      (s) => s.boardMissionStatus.boardMissionStatus.id === statusId
    );
  const { CheckPermission } = useUserPermission();

  const columnOrder = useRecoilValue(columnOrderState);
  const columnVisibility = useRecoilValue(columnVisibilityState);

  const tableHeaders = (statusId: string) => {
    const headerMap = {
      ...(CheckPermission(
        Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
      ) && {
        checkbox: (
          <Checkbox
            checked={status(statusId).boardMissions.every((b) =>
              selectedBoards?.find(
                (sb) => sb.id === b.id && sb.productType === b.productType
              )
            )}
            indeterminate={
              status(statusId).boardMissions.some((b) =>
                selectedBoards?.find(
                  (sb) => sb.id === b.id && sb.productType === b.productType
                )
              ) &&
              !status(statusId).boardMissions.every((b) =>
                selectedBoards?.find(
                  (sb) => sb.id === b.id && sb.productType === b.productType
                )
              )
            }
            onChange={(e, checked) => {
              onChangeHeaderCheckBox(statusId, checked);
            }}
            icon={<CheckboxIcon color="#D0D5DD" width="20" height="20" />}
            checkedIcon={
              <CheckboxCheckedIcon fill="#2E3092" width="20" height="20" />
            }
          />
        ),
      }),
      job_order: `${t("productionFloor.job")} / ${t("SourceDocument.order")}`,
      deliveryDate: t("sales.quote.deliveryDate"),
      customer: t("productionFloor.customer"),
      agent: t("productionFloor.agent"),
      productName: t("sales.quote.productName"),
      description: t("sales.documentDeliveries.description"),
      notes: t("sales.quote.notes"),
      status: t("productionFloor.status"),
      currentStation: t("productionFloor.currentStation"),
      nextStation: t("productionFloor.nextStation"),
      changeMachineEmployee: t("productionFloor.changeMachineEmployee"),
      totalTime: t("productionFloor.totalTime"),
      more: " ",
    };

    return columnOrder
      .filter((key) => columnVisibility[key] && headerMap[key])
      .map((key) => headerMap[key]);
  };

  return {
    isOpen,
    onClickStatus,
    tableHeaders,
  };
};

export { useStatusTable };
