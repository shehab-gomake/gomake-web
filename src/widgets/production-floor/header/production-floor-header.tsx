import {Breadcrumbs, ButtonGroup, Stack, Link} from "@mui/material";
import Button from "@mui/material/Button";
import GridViewIcon from '@mui/icons-material/GridView';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import {useProductionFloorHeader} from "@/widgets/production-floor/header/use-production-floor-header";
import {EProductionFloorView} from "@/widgets/production-floor/state/production-floor-view";
import {PrimaryButton} from "@/components/button/primary-button";
import {FONT_FAMILY} from "@/utils/font-family";
import {SelectGroup} from "@/widgets/production-floor/select-group/select-group";
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import {EPathActionType} from "@/widgets/production-floor/enums/path-action-type";
import * as NextLink from "next/link";


const ProductionFloorHeader = () => {
    const {view, setView, initGroupsFilters, showAllJobsButton, paths, onClickPath, navigateToProductionFloor} = useProductionFloorHeader();
    return (
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Stack direction={'row'} alignItems={'center'} gap={'10px'}>
                {showAllJobsButton &&
                    <Button onClick={initGroupsFilters} variant={'contained'}
                            style={{backgroundColor: '#CBCBE4', color: '#252675', height: '30px'}}
                            startIcon={<KeyboardBackspaceOutlinedIcon/>}>all jobs</Button>}
                <h1 style={{
                    ...FONT_FAMILY.Lexend(700, 20),
                    color: '#2E3092'
                }}>Production floor</h1>
                <Breadcrumbs aria-label="breadcrumb">
                    {
                        paths.map((path, index) => <Link key={path.name + index} onClick={() => onClickPath(path)} underline={'hover'}
                                                         component={NextLink.default} color="inherit"
                                                         href={path?.actionType === EPathActionType.URL ? '/production-floor?groupsId=' + path.data.groupId : '/production-floor'}>
                            {path.name}
                        </Link>)
                    }
                </Breadcrumbs>
            </Stack>
            <Stack direction={'row'} gap={'5px'} alignItems={'center'}>
                <SelectGroup/>
                <ButtonGroup>
                    <PrimaryButton style={{width: '20px'}}
                                   variant={view === EProductionFloorView.KANBAN ? 'contained' : 'outlined'}
                                   onClick={() => {
                                       setView(EProductionFloorView.KANBAN);
                                       navigateToProductionFloor()
                                   }}>
                        <GridViewIcon/>
                    </PrimaryButton>
                    <PrimaryButton style={{width: '20px'}}
                                   variant={view === EProductionFloorView.TABLE ? 'contained' : 'outlined'}
                                   onClick={() => {
                                       setView(EProductionFloorView.TABLE);
                                       navigateToProductionFloor();
                                   }}>
                        <ViewHeadlineIcon/>
                    </PrimaryButton>
                </ButtonGroup>
            </Stack>
        </Stack>
    )
}

export {ProductionFloorHeader}