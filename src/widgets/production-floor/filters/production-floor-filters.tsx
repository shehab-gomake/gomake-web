import { useEffect, useState } from "react";
import { Box, Stack, Card, CardContent, Typography, Menu, MenuItem, IconButton } from "@mui/material";
import { useProductionFloorFilters } from "@/widgets/production-floor/filters/use-production-floor-filters";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { filtersInputs } from "@/widgets/production-floor/filters/filters-inputs";
import { SelectComponent } from "@/widgets/production-floor/filters/select/select-component";
import { styled } from '@mui/system';
import { toRgba } from "@/utils/helpers";
import { FONT_FAMILY } from "@/utils/font-family";
import { fetchS3JsonContent } from "@/utils/S3Content";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface CustomCardProps {
    label: string;
    machineId?: string;
    onClick?: () => void;
    isSelected?: boolean;
    dir?: string;
    getColorByMachineId?: any;
    filters?: any;
}

const CustomIconButton = styled(IconButton)(({ theme }) => ({
    width: '30px',
    height: '35px',
    border: `1.5px solid #2E3092`,
    borderRadius: "4px",
    backgroundColor: toRgba("#2E3092", 0.1),
    '& .MuiSvgIcon-root': {
        color: '#2E3092',
    },
    '&:hover': {
        backgroundColor: toRgba("#2E3092", 0.1),
    }
}));


const CustomCard = styled(Card)<{ isSelected?: boolean; color: string }>(({ isSelected, color }) => ({
    border: isSelected ? `none` : `1.5px solid ${color}`,
    backgroundColor: isSelected ? color : toRgba(color, 0.1),
    borderRadius: '4px',
    transition: 'background-color 0.3s ease, border 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    padding: '0px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'fit-content',
    // important
    maxWidth: "250px",
    '&:hover': {
        boxShadow: '0px 2px 4px rgba(16, 24, 40, 0.1)',
    },
}));


const Circle = styled(Box)<{ numColor: string, dir: string }>(({ numColor, dir }) => ({
    width: "16px",
    height: "16px",
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // border: `0.5px solid ${borderColor}`,
    backgroundColor: "#ffffff",
    marginLeft: dir === "rtl" ? 0 : 4,
    marginRight: dir === "rtl" ? 4 : 0,
    fontSize: 12,
    fontWeight: 600,
    color: numColor

}));

const CustomCardComponent = ({
    label,
    onClick,
    isSelected,
    dir,
    machineId,
    getColorByMachineId,
    filters
}: CustomCardProps) => {
    const machineStatus = filters.stations
        .flatMap(station => station?.machineStatuses)
        .find(status => status?.id === machineId);

    const inProcessCount = machineStatus?.inProcessCount || 0;
    const stuckCount = machineStatus?.stuckCount || 0;
    const color = getColorByMachineId(machineId);

    return (
        <CustomCard onClick={onClick} isSelected={isSelected} color={color}>
            <CardContent
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px !important',
                }}
            >
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: isSelected ? '#FFF' : color,
                        ...FONT_FAMILY.Inter(400, 14),
                        maxWidth: '170px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {label}
                </Typography>
                <Box sx={{ display: 'flex' }}>
                    <Circle numColor="#E7D000" dir={dir}>{inProcessCount}</Circle>
                    <Circle numColor="#D92D20" dir={dir}>{stuckCount}</Circle>
                </Box>
            </CardContent>
        </CustomCard>
    );
};

const ProductionFloorFilters = () => {
    const { tagsList } = filtersInputs();
    const {
        t,
        dir,
        search,
        setSearch,
        actionsMachinesIds,
        data,
        filters,
        selectedChip,
        setSelectedChip,
        onTagsChange,
        onSelectDeliveryTimeDates,
        onSelectCreateDates,
        createDateFilter,
        deliveryDateFilter,
        isRTL,
        getColorByMachineId,
        handleMoreClick,
        handleChipClick,
        handleMenuItemClick,
        handleClose,
        anchorEl,
        visibleCards,
        hiddenCards,
        setMachinesColors,
        isFromFilter,
        setVisibleCards,
        setHiddenCards,
        scrollContainerRef,
        originalDataRef,
        setIsFromFilters
    } = useProductionFloorFilters();

    useEffect(() => {
        if (data.length > 0 && originalDataRef.current.length === 0) {
            originalDataRef.current = data;
        }
        else if ((data.length > 0 && !isFromFilter && originalDataRef.current.length !== 0)) {
            setSelectedChip(null);
            originalDataRef.current = data;
        }
        if (isFromFilter) {
            setIsFromFilters(false);
        }
    }, [data]);

    useEffect(() => {
        const fetchMachinesColors = async () => {
            try {
                const data = await fetchS3JsonContent("machinesColors.json");
                setMachinesColors(data);
            } catch (error) {
                console.error("Error fetching machines colors :", error);
            }
        };
        fetchMachinesColors();
    }, []);

    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const updateContainerWidth = () => {
            if (scrollContainerRef.current) {
                setContainerWidth(scrollContainerRef.current.clientWidth);
            }
        };
        updateContainerWidth();
        window.addEventListener('resize', updateContainerWidth);

        return () => {
            window.removeEventListener('resize', updateContainerWidth);
        };
    }, []); 

    useEffect(() => {
        if (scrollContainerRef.current) {
            let totalWidth = 0;
            let visible: { label: string, machineId: string }[] = [];
            let hidden: { label: string, machineId: string }[] = [];

            actionsMachinesIds.forEach(item => {
                const { actionName = 'Unknown Action', machineIds = [], machineNames = [] } = item;

                machineNames.forEach((machineName, index) => {
                    // important
                    const cardWidth = 240;

                    totalWidth += cardWidth;

                    const cardLabel = `${actionName} | ${machineName}`;
                    const machineId = machineIds[index];

                    if (totalWidth <= containerWidth) {
                        visible.push({ label: cardLabel, machineId: machineId || '' });
                    } else {
                        hidden.push({ label: cardLabel, machineId: machineId || '' });
                    }
                });
            });

            setVisibleCards(visible);
            setHiddenCards(hidden);
        }
    }, [actionsMachinesIds, containerWidth]);

    return (
        <Stack direction={'row'} padding={'12px 0'} style={{ backgroundColor: '#FFF' }} alignItems={'center'} gap={'20px'}>
            <SearchInputComponent bgColor={'#F8F8F8'} value={search} onChange={setSearch} />
            <SelectComponent buttonLabel={'productionFloor.tags'} list={tagsList} onChange={onTagsChange} />
            <GoMakeDatepicker value={deliveryDateFilter} onChange={onSelectDeliveryTimeDates} placeholder={t('productionFloor.deliveryTime')} />
            <GoMakeDatepicker value={createDateFilter} onChange={onSelectCreateDates} placeholder={t('productionFloor.createTime')} />
            <Box
                ref={scrollContainerRef}
                sx={{
                    width: "60%",
                    maxHeight: '100px',
                     maxWidth: '60%',
                    overflowX: 'scroll',
                    overflowY: 'scroll',
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: '5px',
                    whiteSpace: 'nowrap',
                    borderRadius: '4px',
                    backgroundColor: '#FFF',
                    alignItems: 'center',
                    // important
                    justifyContent:"flex-end"
                }}
            >
                {visibleCards.map((card, index) => (
                    <CustomCardComponent
                        dir={dir}
                        key={index}
                        label={card.label}
                        machineId={card.machineId}
                        onClick={() => handleChipClick(card)}
                        isSelected={selectedChip === card.label}
                        getColorByMachineId={getColorByMachineId}
                        filters={filters}
                    />
                ))}
                {hiddenCards.length > 0 && (
                    <>
                        <CustomIconButton onClick={handleMoreClick}>
                            <MoreHorizIcon />
                        </CustomIconButton>
                        <Menu
                            transformOrigin={{ horizontal: isRTL ? "left" : "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: isRTL ? "left" : "right", vertical: "bottom" }}
                            PaperProps={{
                                style: {
                                    marginTop: 8,
                                },
                            }}
                            anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            {hiddenCards.map((card, index) => (
                                <MenuItem key={index} onClick={() => handleMenuItemClick(card)}>

                                    {card.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </>
                )}
            </Box>
        </Stack>
    );
};

export { ProductionFloorFilters };
