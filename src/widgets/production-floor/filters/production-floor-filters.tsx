import { Button, Stack } from "@mui/material";
import { useProductionFloorFilters } from "@/widgets/production-floor/filters/use-production-floor-filters";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import {
    ActionsListComponent
} from "@/widgets/production-floor/filters/select/actions-select/action-list-select-component";
import React from "react";
import { useTranslation } from "react-i18next";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { filtersInputs } from "@/widgets/production-floor/filters/filters-inputs";
import { SelectComponent } from "@/widgets/production-floor/filters/select/select-component";
import { Source } from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import { IStation } from "../interfaces/filters";
import { FONT_FAMILY } from "@/utils/font-family";

const ProductionFloorFilters = () => {
    const { tagsList } = filtersInputs()
    const {
        search,
        setSearch,
        onTagsChange,
        onSelectDeliveryTimeDates,
        onSelectCreateDates,
        createDateFilter,
        deliveryDateFilter,
        onStationsChange,
        onClickClearFilters
    } = useProductionFloorFilters();
    const { t } = useTranslation();


    return (
        <Stack direction={'row'} padding={'12px 5px'} style={{ backgroundColor: '#FFF' }} alignItems={'center'} width={"100%"} justifyContent={"space-between"}>
            <Stack direction={'row'} alignItems={'center'} gap={'10px'}>
                <ActionsListComponent onClickApply={onStationsChange} source={Source.PRODUCTION_FLOOR} />
                <Stack flexGrow={1} direction={'row'} position={'relative'}>
                    <SelectComponent buttonLabel={'productionFloor.tags'} list={tagsList} onChange={onTagsChange} />
                </Stack>
                <Button variant="text" style={{color:"black" , ...FONT_FAMILY.Inter(500,14) , textTransform:"capitalize"}} onClick={onClickClearFilters}>Clear filters</Button>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} gap={'20px'}>
                <SearchInputComponent bgColor={'#F8F8F8'} value={search} onChange={setSearch} />
                <GoMakeDatepicker value={deliveryDateFilter} onChange={onSelectDeliveryTimeDates}
                    placeholder={t('productionFloor.deliveryTime')} />
                <GoMakeDatepicker value={createDateFilter} onChange={onSelectCreateDates}
                    placeholder={t('productionFloor.createTime')} />
            </Stack>
        </Stack>

    )
}

export { ProductionFloorFilters }