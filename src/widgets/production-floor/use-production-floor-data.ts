import {useGomakeAxios, useSnackBar} from "@/hooks";
import {
    getProductionFloorData,
    updateBoardsMissionsStatusApi
} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useRecoilState} from "recoil";
import {productionFloorFiltersState} from "@/widgets/production-floor/state/production-floor-filters";
import {boardsMissionsState} from "@/widgets/production-floor/state/boards";
import {tagsState} from "@/widgets/production-floor/state/tags";
import {userProductionFloorGroupsState} from "@/widgets/production-floor/state/production-floor-groups-state";
import {productionFloorPathsState} from "@/widgets/production-floor/state/production-floor-paths";
import {IBoardMissions} from "@/widgets/production-floor/interfaces/board-missions";
import { useTranslation } from "react-i18next";

const useProductionFloorData = () => {
    const {t} = useTranslation();
    const {callApi} = useGomakeAxios();
    const [data,setData] = useRecoilState(boardsMissionsState);
    const [, setFilters] = useRecoilState(productionFloorFiltersState);
    const [, setTags] = useRecoilState(tagsState);
    const [, setUserGroups] = useRecoilState(userProductionFloorGroupsState);
    const [, setPath] = useRecoilState(productionFloorPathsState);
    const {alertSuccessGetData, alertFaultGetData, alertFaultUpdate, alertSuccessUpdate} = useSnackBar();

    const getData = async (connectionId?: string) => {
        const callBack = (res) => {
            if (res.success) {
                setData(res?.data?.boardMissionsCollections);
                setFilters(res?.data?.filter);
                setTags(res?.data?.automatedTagsFilter);
                setUserGroups(res?.data?.groups);
                setPath(res?.data?.path ? res?.data?.path : []);
                alertSuccessGetData();
            }else {
                alertFaultGetData();
            }
        }
        return await getProductionFloorData(callApi, callBack, connectionId);
    }


    const updateStatus = async (boards: IBoardMissions[], statusId: string) => {
        const boardsIds = boards?.filter(b => b.statusId !== statusId);
        setData(data?.map((status) => {
            if (status.boardMissionStatus?.boardMissionStatus?.id === statusId) {
                return {
                    ...status,
                    boardMissions: [...status.boardMissions, ...boardsIds?.map(b => ({...b, statusId: status.boardMissionStatus.boardMissionStatus.id}))]
                }
            }else {
                return {
                    ...status,
                    boardMissions: status.boardMissions.filter(b => !!!boardsIds.find(bs => b.id === bs.id && b.productType === bs.productType))
                }
            }
        }))
        const callBack = (res) => {
            if (res.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await updateBoardsMissionsStatusApi(callApi, callBack, {boardsIds: boardsIds?.map(b => ({BoardMissionId: b.id, productType: b.productType})), statusId})
    }
    return {getData, updateStatus, setData,t}
}

export {useProductionFloorData}