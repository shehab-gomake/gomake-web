import {useState} from "react";
import {useRecoilState} from "recoil";
import {boardsMissionsState, selectedBoardsMissionsState} from "@/widgets/production-floor/state/boards";
import {SecondaryCheckBox} from "@/components/check-box/secondary-check-box";
import {useTranslation} from "react-i18next";

const useStatusTable = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [boardsMissions] = useRecoilState(boardsMissionsState);
    const [selectedBoards, setSelectedBoards] = useRecoilState(selectedBoardsMissionsState)
    const {t} = useTranslation();
    const onClickStatus = () => {
        setIsOpen(prevState => !prevState);
    }

    const onChangeHeaderCheckBox = (statusId: string, checked: boolean) => {
        const selected = new Set<string>(...selectedBoards);
        status(statusId).boardMissions.forEach((boardMission) => {
            if (checked) {
                selected.add(boardMission.id)
            } else {
                selected.delete(boardMission.id)
            }
        })
        setSelectedBoards(Array.from(selected));
    }
    const status = (statusId: string) => boardsMissions.find(s => s.boardMissionStatus.boardMissionStatus.id === statusId);

    const tableHeaders = (statusId: string) => {
        return [<SecondaryCheckBox checked={status(statusId).boardMissions.every(b => selectedBoards.includes(b.id))}
                                   onChange={(e, checked) => {
                                       onChangeHeaderCheckBox(statusId, checked);
                                   }}/>,
            t('productionFloor.jobs'),
            t('productionFloor.taskCategory'),
            t('productionFloor.station'),
            t('productionFloor.status'),
            t('productionFloor.customer'),
            t("productionFloor.stationDeliveryTime"),
            t('productionFloor.deliveryTime'),
            t('productionFloor.tags')
        ]
    }

    return {
        isOpen,
        onClickStatus,
        tableHeaders
    }
}

export {useStatusTable}