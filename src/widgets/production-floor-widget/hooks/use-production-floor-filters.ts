import {useRecoilValue} from "recoil";
import {productionFloorFiltersState} from "@/widgets/production-floor-widget/state";
import {useGomakeAxios} from "@/hooks";
import {useEffect} from "react";
import {setBoardFiltersApi} from "@/services/api-service/production-floor/production-floor-endpoints";

const useProductionFloorFilters = () => {
    const {callApi} = useGomakeAxios();
    const filters = useRecoilValue(productionFloorFiltersState);

    useEffect(() => {
        setBoardFiltersApi(callApi, () => {
        }, filters).then();
    }, [filters]);

    return {}
}

export {useProductionFloorFilters}