import {useRecoilState} from "recoil";
import {productionFloorFiltersState} from "@/widgets/production-floor-widget/state";

const useDatesFilters = () => {
    const [filters, setFilters] = useRecoilState(productionFloorFiltersState);
    const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
        setFilters({
            ...filters,
            fromDeliveryTime: fromDate,
            toDeliveryTime: toDate
        })
    }

    const onSelectCreationDates = (fromDate: Date, toDate: Date) => {
        setFilters({
            ...filters,
            fromCreateDate: fromDate,
            toCreateDate: toDate
        })
    }
    return {
        onSelectCreationDates,
        onSelectDeliveryTimeDates

    }
}

export {useDatesFilters}