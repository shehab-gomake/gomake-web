import { useState } from "react";
import { useRecoilState } from "recoil";
import { boardsMissionsState, selectedBoardsMissionsState } from "@/widgets/production-floor/state/boards";
import { SecondaryCheckBox } from "@/components/check-box/secondary-check-box";
import { useTranslation } from "react-i18next";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";

const useStatusTable = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [boardsMissions] = useRecoilState(boardsMissionsState);
    const [selectedBoards, setSelectedBoards] = useRecoilState(selectedBoardsMissionsState)
    const { t } = useTranslation();
    const onClickStatus = () => {
        setIsOpen(prevState => !prevState);
    }

    const onChangeHeaderCheckBox = (statusId: string, checked: boolean) => {
        let selected = [...selectedBoards];
        status(statusId).boardMissions.forEach((boardMission) => {
            const isSelectedBoard = !!selected?.find(b => b.id === boardMission.id);
            if (checked) {
                if (!isSelectedBoard) {
                    selected.concat([boardMission]);
                }
            } else {
                if (isSelectedBoard) {
                    selected = selected.filter(b => b.id !== boardMission.id)
                }
            }
        })
        setSelectedBoards(Array.from(selected));
    }
    const status = (statusId: string) => boardsMissions.find(s => s.boardMissionStatus.boardMissionStatus.id === statusId);
    const { CheckPermission } = useUserPermission();

    const tableHeaders = (statusId: string) => {
        return [
            CheckPermission(Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR) &&
            <SecondaryCheckBox checked={status(statusId).boardMissions.every(b => selectedBoards?.find(sb => sb.id === b.id && sb.productType === b.productType))}
                onChange={(e, checked) => {
                    onChangeHeaderCheckBox(statusId, checked);
                }} />,
            t('productionFloor.jobs'),
            t('productionFloor.taskCategory'),
            t('productionFloor.station'),
            t('productionFloor.status'),
            t('productionFloor.customer'),
            t("productionFloor.stationDeliveryTime"),
            t('productionFloor.deliveryTime'),
            t('productionFloor.tags')
        ].filter(Boolean);
    }

    return {
        isOpen,
        onClickStatus,
        tableHeaders
    }
}

export { useStatusTable }