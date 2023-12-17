import React from "react";
import Stack from "@mui/material/Stack";
import {useProductionFloorData} from "@/widgets/production-floor-widget/hooks/use-production-floor-data";
import {Button, ButtonGroup} from "@mui/material";
import {SearchInputComponent} from "@/components/form-inputs/search-input-component";
import {StatusesButtonsComponent} from "@/widgets/production-floor-widget/production-statuses/production-statuses";
import {SecondaryTable} from "@/components/tables/secondary-table";
import {useProductionFloorTable} from "@/widgets/production-floor-widget/hooks/use-production-floor-table";
import {LoadMore} from "@/widgets/production-floor-widget/components/load-more";
import {HEADER_HEIGHT, SCREEN_HEIGHT} from "@/utils/layout-config";
import {useProductionFloorFilters} from "@/widgets/production-floor-widget/hooks/use-production-floor-filters";
import {ActionsMachinesSelect} from "@/widgets/production-floor-widget/components/actions-machines-select";
import Drawer from "@mui/material/Drawer";
import {useBoardMissionDrawer} from "@/widgets/production-floor-widget/hooks/use-board-mission-drawer";
import {BoardMissionsWidget} from "@/widgets/board-mission-widget/board-missions-widget";
import {DrawerCloseHeader} from "@/widgets/production-floor-widget/components/drawer-close-header";
import {GoMakeDatepicker} from "@/components/date-picker/date-picker-component";
import {useDatesFilters} from "@/widgets/production-floor-widget/hooks/use-dates-filters";

const ProductionFloorWidget = () => {
    const {} = useProductionFloorData();
    const {} = useProductionFloorFilters();
    const {onSelectDeliveryTimeDates, onSelectCreationDates} = useDatesFilters();
    const {
        getBoardsMissionsRows,
        hasMoreBoards,
        setLoadingBoards,
        loadingBoards,
        handelEndGettingData,
        tableHeaders
    } = useProductionFloorTable();
    const {open, handleClose, anchor} = useBoardMissionDrawer()
    return (
        <Stack direction={'column'} gap={'5px'} maxHeight={SCREEN_HEIGHT - HEADER_HEIGHT} overflow={'hidden'}>
            <Stack direction={'row'} justifyContent={'space-between'} padding={'10px 0'}>
                <ButtonGroup>
                    <Button>table</Button>
                    <Button>kanban</Button>
                </ButtonGroup>
                <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
                    <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={'select delivery time'}/>
                    <GoMakeDatepicker onChange={onSelectCreationDates} placeholder={'select creation time'}/>
                    <ActionsMachinesSelect/>
                    <SearchInputComponent onChange={() => {
                    }}/>
                </Stack>
            </Stack>
            <StatusesButtonsComponent/>
            <Stack overflow={'auto'}>
                <SecondaryTable onScrolledBottom={() => {
                    setLoadingBoards(true)
                }} rows={getBoardsMissionsRows()} headers={tableHeaders}/>
                {
                    loadingBoards && hasMoreBoards && <LoadMore setHasMoreBoards={handelEndGettingData}/>
                }
            </Stack>
            <Drawer open={open()} anchor={anchor} onClose={handleClose}>
                <Stack width={'80vw'}>
                    <DrawerCloseHeader/>
                    <BoardMissionsWidget/>
                </Stack>
            </Drawer>
        </Stack>
    )
}

export {ProductionFloorWidget}