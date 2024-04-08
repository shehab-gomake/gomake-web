import {Stack} from "@mui/material";
import {useProductionFloorFilters} from "@/widgets/production-floor/filters/use-production-floor-filters";
import {SearchInputComponent} from "@/components/form-inputs/search-input-component";
import {ActionsListComponent} from "@/widgets/production-floor/filters/actions-select/action-list-select-component";
import React from "react";
import {useTranslation} from "react-i18next";
import {GoMakeDatepicker} from "@/components/date-picker/date-picker-component";
import {filtersInputs} from "@/widgets/production-floor/filters/filters-inputs";
import {FormInput} from "@/components/form-inputs/form-input";

const ProductionFloorFilters = () => {
    const {tagsInput} = filtersInputs()
    const {
        search,
        setSearch,
        onTagsChange,
        onSelectDeliveryTimeDates,
        handleSelectStation,
        onSelectCreateDates,
        createDateFilter,
        deliveryDateFilter,
        handelSelectMachine
    } = useProductionFloorFilters();
    const {t} = useTranslation();
    return (
        <Stack direction={'row'} padding={'12px 0'} style={{backgroundColor: '#FFF'}} alignItems={'center'}
               gap={'20px'}>
            <SearchInputComponent bgColor={'#F8F8F8'} value={search} onChange={setSearch}/>
            <ActionsListComponent onClickAction={handleSelectStation} onClickMachine={handelSelectMachine}/>
            <GoMakeDatepicker value={deliveryDateFilter} onChange={onSelectDeliveryTimeDates}
                              placeholder={t('productionFloor.deliveryTime')}/>
            <GoMakeDatepicker value={createDateFilter} onChange={onSelectCreateDates}
                              placeholder={t('productionFloor.createTime')}/>
            <Stack flexGrow={1} direction={'row'} position={'relative'}>
                <div style={{position: 'absolute', bottom: '-13px'}}>
                <FormInput input={tagsInput} changeState={(key, value) => onTagsChange(value)} error={false}/>
                </div>
            </Stack>
        </Stack>
    )
}

export {ProductionFloorFilters}