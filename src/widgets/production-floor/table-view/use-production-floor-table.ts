import { useRecoilValue, useSetRecoilState } from "recoil";
import { boardsMissionsState } from "@/widgets/production-floor/state/boards";
import { setBoardMissionsFiltersApi } from "@/services/api-service/board-missions/board-missions-table";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  filteredMissionsStateBySearch,
  missionsListState,
  productionFloorTextSearchState,
  searchLoadingState,
} from "../state/text-search";

const useProductionFloorTable = () => {
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const data = useRecoilValue(boardsMissionsState);
  const search = useRecoilValue(productionFloorTextSearchState);
  const setFilteredMissionsBySearch = useSetRecoilState(
    filteredMissionsStateBySearch
  );
  const setMissionsList = useSetRecoilState(missionsListState);
  const setLoading = useSetRecoilState(searchLoadingState);

  const getAllBoardMissions = async () => {
    setLoading(true);
    const callBack = (res) => {
      setLoading(false);
      if (res?.success) {
        const _data = res?.data?.data;
        setMissionsList(_data || []);
      } else {
        alertFaultGetData();
      }
    };
    await setBoardMissionsFiltersApi(
      callApi,
      callBack,
      {
        productsIds: [],
        pageNumber: 1,
        pageSize: 30,
        search,
      },
      false
    );
  };

  return {
    data,
    search,
    setFilteredMissionsBySearch,
    getAllBoardMissions,
    setMissionsList,
  };
};

export { useProductionFloorTable };
