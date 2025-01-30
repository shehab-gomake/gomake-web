import { useState } from "react";
import { useRecoilState } from "recoil";
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

const useStatusTable = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [boardsMissions] = useRecoilState(boardsMissionsState);
  const [selectedBoards, setSelectedBoards] = useRecoilState(
    selectedBoardsMissionsState
  );
  const { t } = useTranslation();
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

  const tableHeaders = (statusId: string) => {
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
          checkedIcon={<CheckboxCheckedIcon fill="#2E3092" width="20" height="20" />}
        />
      ),
      t("home.headers.deliveryDate"),
      `${t("productionFloor.job")} / ${t("SourceDocument.order")}`,
      t("productionFloor.customer"),
      // t("home.headers.jobName"),
      t("sales.quote.productName"),
      t("sales.documentDeliveries.description"),
      t("productionFloor.status"),
      t("productionFloor.currentStation"),
      t("productionFloor.nextStation"),
      " ",
    ].filter(Boolean);
  };

  return {
    isOpen,
    onClickStatus,
    tableHeaders,
  };
};

export { useStatusTable };
