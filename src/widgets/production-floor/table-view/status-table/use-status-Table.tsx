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
} from "../../state/column-order";

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
    let selected = [...selectedBoards];
    status(statusId).boardMissions.forEach((boardMission) => {
      const isSelectedBoard = !!selected?.find((b) => b.id === boardMission.id);
      if (checked) {
        if (!isSelectedBoard) {
          selected.concat([boardMission]);
        }
      } else {
        if (isSelectedBoard) {
          selected = selected.filter((b) => b.id !== boardMission.id);
        }
      }
    });
    setSelectedBoards(Array.from(selected));
  };
  const status = (statusId: string) =>
    boardsMissions.find(
      (s) => s.boardMissionStatus.boardMissionStatus.id === statusId
    );
  const { CheckPermission } = useUserPermission();

  const tableHeadersOld = (statusId: string) => {
    return [
      CheckPermission(Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR) && (
        <Checkbox
          checked={status(statusId).boardMissions.every((b) =>
            selectedBoards?.find(
              (sb) => sb.id === b.id && sb.productType === b.productType
            )
          )}
          onChange={(e, checked) => {
            onChangeHeaderCheckBox(statusId, checked);
          }}
          icon={<CheckboxIcon color="#D0D5DD" width="20" height="20" />}
          checkedIcon={
            <CheckboxCheckedIcon fill="#2E3092" width="20" height="20" />
          }
        />
      ),
      `${t("productionFloor.job")} / ${t("SourceDocument.order")}`,
      t("sales.quote.deliveryDate"),
      t("productionFloor.customer"),
      CheckPreferenceValue(EPreferences.SHOW_AGENT_IN_PRODUCTION_FLOOR) &&
        t("productionFloor.agent"),
      CheckPreferenceValue(
        EPreferences.SHOW_PRODUCT_NAME_COLUMN_IN_PRODUCTION_FLOOR
      ) && t("sales.quote.productName"),
      CheckPreferenceValue(
        EPreferences.SHOW_DESCRIPTION_COLUMN_IN_PRODUCTION_FLOOR
      ) && t("sales.documentDeliveries.description"),
      CheckPreferenceValue(
        EPreferences.SHOW_NOTES_COLUMN_IN_PRODUCTION_FLOOR
      ) && t("sales.quote.notes"),
      t("productionFloor.status"),
      t("productionFloor.currentStation"),
      t("productionFloor.nextStation"),
      " ",
    ].filter(Boolean);
  };

  const columnOrder = useRecoilValue(columnOrderState);
  const columnVisibility = useRecoilValue(columnVisibilityState);

  const tableHeaders = (statusId: string) => {
    const headerMap = {
      checkbox: (
        <Checkbox
          checked={status(statusId).boardMissions.every((b) =>
            selectedBoards?.find(
              (sb) => sb.id === b.id && sb.productType === b.productType
            )
          )}
          onChange={(e, checked) => {
            onChangeHeaderCheckBox(statusId, checked);
          }}
          icon={<CheckboxIcon color="#D0D5DD" width="20" height="20" />}
          checkedIcon={
            <CheckboxCheckedIcon fill="#2E3092" width="20" height="20" />
          }
        />
      ),
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
      more: " ",
    };

    return columnOrder
      .filter((key) => columnVisibility[key])
      .map((key) => headerMap[key]);
  };
  return {
    isOpen,
    onClickStatus,
    tableHeaders,
  };
};

export { useStatusTable };
