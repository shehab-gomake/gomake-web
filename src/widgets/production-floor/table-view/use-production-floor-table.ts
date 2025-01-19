import { useRecoilValue, useSetRecoilState } from "recoil";
import { boardsMissionsState } from "@/widgets/production-floor/state/boards";
import {
  searchJobsApi,
} from "@/services/api-service/board-missions/board-missions-table";
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

  const getAllBoardMissionsFromSearch = async () => {
    setLoading(true);
    const callBack = (res) => {
      setLoading(false);
      if (res?.success) {

        setMissionsList(res.data);
      } else {
        setMissionsList([]);
        alertFaultGetData();
      }
    };
    await searchJobsApi(
      callApi,
      callBack,
      {
        search,
      },
      false
    );
  };

  return {
    data,
    search,
    setFilteredMissionsBySearch,
    getAllBoardMissionsFromSearch,
    setMissionsList,
  };
};

export { useProductionFloorTable };
