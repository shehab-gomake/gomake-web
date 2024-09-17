import { Box, Chip, Stack } from "@mui/material";
import { useProductionFloorFilters } from "@/widgets/production-floor/filters/use-production-floor-filters";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import React from "react";
import { useTranslation } from "react-i18next";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { filtersInputs } from "@/widgets/production-floor/filters/filters-inputs";
import { SelectComponent } from "@/widgets/production-floor/filters/select/select-component";
import { Source, useActionsList } from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import { styled } from '@mui/system';

const CustomChip = styled(Chip)(({ theme }) => ({
    color: 'var(--Primary-600, #2E3092)',
    fontFamily: 'Inter',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '24px',
    borderRadius: '4px',
    border: '1.5px solid rgba(237, 2, 140, 0.40)',
    background: 'rgba(237, 2, 140, 0.40)',
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
}));

const Circle = styled(Box)(({ theme }) => ({
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: 'rgba(237, 2, 140, 0.60)', // Adjust color as needed
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFF',
    fontSize: '10px',
    fontWeight: 500,
    marginLeft: '4px',
}));

const CustomChipComponent = ({ label, onClick, isSelected }: { label: string; onClick?: () => void; isSelected?: boolean }) => {
    return (
        <CustomChip
            label={label}
            onClick={onClick}
            sx={{
                animation: isSelected ? 'flicker 1s infinite' : 'none',
                '@keyframes flicker': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                },
                backgroundColor: isSelected ? 'rgba(237, 2, 140, 0.60)' : 'rgba(237, 2, 140, 0.40)',
                border: isSelected ? '2px solid rgba(237, 2, 140, 0.70)' : '1.5px solid rgba(237, 2, 140, 0.40)',
                transition: 'background-color 0.3s ease, border 0.3s ease',
            }}

            icon={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Circle>5</Circle>
                    <Circle>5</Circle>
                </Box>
            }
        />
    );
};

export default CustomChipComponent;

// here...
const ProductionFloorFilters = () => {
    const { tagsList } = filtersInputs()
    const {
        search,
        setSearch,
        onTagsChange,
        onSelectDeliveryTimeDates,
        onSelectCreateDates,
        createDateFilter,
        deliveryDateFilter
    } = useProductionFloorFilters();
    const { t } = useTranslation();
    const {actionsMachinesIds } = useActionsList(Source.PRODUCTION_FLOOR);
    const [selectedChip, setSelectedChip] = React.useState<string | null>(null);

    const handleChipClick = (label: string) => {
        console.log(`Chip clicked: ${label}`);
        setSelectedChip(selectedChip === label ? null : label); 

        // filter by the selected machine
    };

    return (
        <Stack direction={'row'} padding={'12px 0'} style={{ backgroundColor: '#FFF' }} alignItems={'center'}
            gap={'20px'}>
            <SearchInputComponent bgColor={'#F8F8F8'} value={search} onChange={setSearch} />
            <SelectComponent buttonLabel={'productionFloor.tags'} list={tagsList} onChange={onTagsChange} />
            <GoMakeDatepicker value={deliveryDateFilter} onChange={onSelectDeliveryTimeDates}
                placeholder={t('productionFloor.deliveryTime')} />
            <GoMakeDatepicker value={createDateFilter} onChange={onSelectCreateDates}
                placeholder={t('productionFloor.createTime')} />
            <Box
                sx={{
                    maxHeight: '100px',
                    maxWidth: "50%",
                    overflowX: 'auto', 
                    overflowY: 'hidden', 
                    borderRadius: '4px',
                    backgroundColor: '#FFF',
                    padding: '8px',
                    display: 'flex',
                    flexWrap: 'nowrap', 
                    gap: '10px',
                    whiteSpace: 'nowrap', 
                }}
            >
                {actionsMachinesIds.flatMap((item) =>
                    (item.machineNames || []).map((machineName, index) => (
                        <CustomChipComponent
                            key={`${item.actionId}-${index}`}
                            label={`${item.actionName || 'Unknown Action'} | ${machineName || 'Unknown Machine'}`}
                            onClick={() => handleChipClick(`${item.actionName || 'Unknown Action'} | ${machineName || 'Unknown Machine'}`)}
                            isSelected={selectedChip === `${item.actionName || 'Unknown Action'} | ${machineName || 'Unknown Machine'}`}

                        />
                    ))
                )}
            </Box>
        </Stack>
    )
}

export { ProductionFloorFilters }


