import {Stack} from "@mui/material";
import {useProductionFloorFilters} from "@/widgets/production-floor/filters/use-production-floor-filters";
import {SearchInputComponent} from "@/components/form-inputs/search-input-component";
import {
    ActionsListComponent
} from "@/widgets/production-floor/filters/select/actions-select/action-list-select-component";
import React from "react";
import {useTranslation} from "react-i18next";
import {GoMakeDatepicker} from "@/components/date-picker/date-picker-component";
import {filtersInputs} from "@/widgets/production-floor/filters/filters-inputs";
import {SelectComponent} from "@/widgets/production-floor/filters/select/select-component";

const ProductionFloorFilters = () => {
    const {tagsList} = filtersInputs()
    const {
        search,
        setSearch,
        onTagsChange,
        onSelectDeliveryTimeDates,
        onSelectCreateDates,
        createDateFilter,
        deliveryDateFilter,
        onStationsChange
    } = useProductionFloorFilters();
    const {t} = useTranslation();
    return (
        <Stack direction={'row'} padding={'12px 0'} style={{backgroundColor: '#FFF'}} alignItems={'center'}
               gap={'20px'}>
            <SearchInputComponent bgColor={'#F8F8F8'} value={search} onChange={setSearch}/>
            <ActionsListComponent onClickApply={onStationsChange}/>
            <GoMakeDatepicker value={deliveryDateFilter} onChange={onSelectDeliveryTimeDates}
                              placeholder={t('productionFloor.deliveryTime')}/>
            <GoMakeDatepicker value={createDateFilter} onChange={onSelectCreateDates}
                              placeholder={t('productionFloor.createTime')}/>
            <Stack flexGrow={1} direction={'row'} position={'relative'}>
                <SelectComponent buttonLabel={'tags'} list={tagsList} onChange={onTagsChange}/>
            </Stack>
        </Stack>
    )
}

export {ProductionFloorFilters}