import React, { useRef, useState, useEffect } from "react";
import { Box, Stack, Card, CardContent, Typography, Menu, MenuItem, IconButton } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useProductionFloorFilters } from "@/widgets/production-floor/filters/use-production-floor-filters";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { filtersInputs } from "@/widgets/production-floor/filters/filters-inputs";
import { SelectComponent } from "@/widgets/production-floor/filters/select/select-component";
import { Source, useActionsList } from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import { styled } from '@mui/system';
import { useTranslation } from "react-i18next";
import { toRgba } from "@/utils/helpers";
import { FONT_FAMILY } from "@/utils/font-family";

interface CustomCardProps {
    label: string;
    onClick?: () => void; 
    isSelected?: boolean;
    dir?:string;
}

const CustomIconButton = styled(IconButton)(({ theme }) => ({
    width: '30px',
    height: '35px',
    border: `1.5px solid #2E3092`,
    borderRadius:"4px",
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
    // minWidth: 'fit-content',
    width:'fit-content',
    maxWidth:"300px",
    '&:hover': {
        boxShadow: '0px 2px 4px rgba(16, 24, 40, 0.1)',
    },
}));


const Circle = styled(Box)<{ borderColor: string; bgColor: string , dir : string }>(({ borderColor, bgColor , dir }) => ({
    width: "16px",
    height: "16px",
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: `0.5px solid ${borderColor}`,
    backgroundColor: bgColor,
    marginLeft: dir==="rtl" ? 0 : 4,
    marginRight: dir==="rtl" ? 4: 0,
    fontSize: 12,
    fontWeight: 600, 
    color:borderColor

}));

const CustomCardComponent = ({ label, onClick, isSelected ,dir }: CustomCardProps) => (
    <CustomCard onClick={onClick} isSelected={isSelected} color="#088AB2">
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: "10px !important" }}>
            <Typography
                variant="subtitle2"
                sx={{
                    color: isSelected ? '#FFF' : '#088AB2',
                    ...FONT_FAMILY.Inter(400, 14),
                    maxWidth:"150px",
                    overflow: 'hidden',
                    whiteSpace: 'nowrap', 
                    textOverflow: 'ellipsis' 
                }}
            >
                {label}
            </Typography>
            <Box sx={{ display: 'flex' }}>
                <Circle borderColor="#079455" bgColor="#ECFDF3" dir={dir} >4</Circle>
                <Circle borderColor="#D92D20" bgColor="#FEF3F2" dir={dir} >5</Circle>
            </Box>
        </CardContent>
    </CustomCard>
);


const ProductionFloorFilters = () => {
    const { tagsList } = filtersInputs();
    const { search, setSearch, onTagsChange, onSelectDeliveryTimeDates, onSelectCreateDates, createDateFilter, deliveryDateFilter } = useProductionFloorFilters();
    const { t } = useTranslation();
    const dir = t("direction");
    const isRTL = dir === "rtl";
    const { actionsMachinesIds } = useActionsList(Source.PRODUCTION_FLOOR);
    const [selectedChip, setSelectedChip] = React.useState<string | null>(null);
    const [visibleCards, setVisibleCards] = useState<string[]>([]);
    const [hiddenCards, setHiddenCards] = useState<string[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleChipClick = (label: string) => {
        setSelectedChip(selectedChip === label ? null : label);
    };

    const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (label: string) => {
        setHiddenCards(prevHidden => prevHidden.filter(card => card !== label));

        setVisibleCards(prevVisible => {
            const newVisibleCards = [label, ...prevVisible];

            setSelectedChip(label);

          
            if (newVisibleCards.length > 0) {
                setHiddenCards(prevHidden => [...prevHidden, newVisibleCards[newVisibleCards.length - 1]]);
            }

            return newVisibleCards.slice(0, -1); 
        });

        handleClose();
    };


    useEffect(() => {
        if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.clientWidth;
            let totalWidth = 0;
            let visible: string[] = [];
            let hidden: string[] = [];

            actionsMachinesIds.forEach(item => {
                (item.machineNames || []).forEach((machineName) => {
                    const cardWidth = 200;

                    totalWidth += cardWidth;

                    const actionName = item.actionName || 'Unknown Action';
                    const labelMachineName = machineName || 'Unknown Machine';
                    const cardLabel = `${actionName} | ${labelMachineName}`;

                    if (totalWidth <= containerWidth) {
                        visible.push(cardLabel);
                    } else {
                        hidden.push(cardLabel);
                    }
                });
            });

            setVisibleCards(visible);
            setHiddenCards(hidden);
        }
    }, [actionsMachinesIds]);

    return (
        <Stack direction={'row'} padding={'12px 0'} style={{ backgroundColor: '#FFF' }} alignItems={'center'} gap={'20px'}>
            <SearchInputComponent bgColor={'#F8F8F8'} value={search} onChange={setSearch} />
            <SelectComponent buttonLabel={'productionFloor.tags'} list={tagsList} onChange={onTagsChange} />
            <GoMakeDatepicker value={deliveryDateFilter} onChange={onSelectDeliveryTimeDates} placeholder={t('productionFloor.deliveryTime')} />
            <GoMakeDatepicker value={createDateFilter} onChange={onSelectCreateDates} placeholder={t('productionFloor.createTime')} />
            <Box
                ref={scrollContainerRef}
                sx={{
                    width: "45%",
                    maxHeight: '100px',
                    maxWidth: '50%',
                    overflowX: 'scroll',
                    overflowY: 'scroll',
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: '5px',
                    whiteSpace: 'nowrap',
                    borderRadius: '4px',
                    backgroundColor: '#FFF',
                    alignItems:'center'
                }}
            >
                {visibleCards.map((label, index) => (
                    <CustomCardComponent
                    dir={dir}
                        key={index}
                        label={label}
                        onClick={() => handleChipClick(label)}
                        isSelected={selectedChip === label}
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
                            {hiddenCards.map((label, index) => (
                                <MenuItem key={index} onClick={() => handleMenuItemClick(label)}>
                                    {label}
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
