import {useRecoilValue} from "recoil";
import {boardsMissionsState} from "@/widgets/production-floor/state/boards";

const useProductionFloorTable = () => {
    const data = useRecoilValue(boardsMissionsState);

    return{
        data
    }
}

export {useProductionFloorTable}