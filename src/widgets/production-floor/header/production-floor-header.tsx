import { Breadcrumbs, ButtonGroup, Link, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import GridViewIcon from '@mui/icons-material/GridView';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import { useProductionFloorHeader } from "@/widgets/production-floor/header/use-production-floor-header";
import { EProductionFloorView } from "@/widgets/production-floor/state/production-floor-view";
import { PrimaryButton } from "@/components/button/primary-button";
import { FONT_FAMILY } from "@/utils/font-family";
import { SelectGroup } from "@/widgets/production-floor/select-group/select-group";
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { EPathActionType } from "@/widgets/production-floor/enums/path-action-type";
import * as NextLink from "next/link";
import AvTimerIcon from '@mui/icons-material/AvTimer';
import { useTranslation } from "react-i18next";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { SettingsIcon } from "./components/settings-icon";
import ActionsDropdown from "./components/action-drop-down";

const ProductionFloorHeader = () => {
    const {
        view,
        setView,
        showAllJobsButton,
        paths,
        onClickPath,
        navigateToProductionFloor,
        onClickBack,
        currentPathIndex,
        onStationsChange,
        actionsMachinesIds,
        open,
        setOpen,
        filter,
        handleClick,
        handleFilterChange,
        getList,
        onSelectMachine,
        onSelectStation,
        buttonRef
    } = useProductionFloorHeader();
    const { t } = useTranslation();
    const dir = t('direction');

    return (
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Stack direction={'row'} alignItems={'center'} gap={'10px'}>
                {(showAllJobsButton || view === EProductionFloorView.GROUPS) && view !== EProductionFloorView.DASHBOARD &&
                    <Button onClick={() => {
                        onClickBack()
                    }} variant={'contained'}
                        style={{ backgroundColor: '#CBCBE4', color: '#252675', height: '30px', gap: '5px', alignItems: 'center' }}
                        startIcon={dir === 'rtl' ? <ArrowForwardIcon /> : <KeyboardBackspaceOutlinedIcon />}>{t('materials.buttons.back')}</Button>}
                <h1 style={{
                    ...FONT_FAMILY.Lexend(700, 20),
                    color: '#2E3092'
                }}>{t('tabs.productFloor')}</h1>
                <Breadcrumbs aria-label="breadcrumb">
                    {
                        paths.map((path, index) => <Link key={path.name + index} onClick={() => onClickPath(path, index)} underline={'hover'}
                            component={NextLink.default} color={index <= currentPathIndex() ? 'purple' : "inherit"}
                            href={path?.actionType === EPathActionType.URL ? '/production-floor?groupsId=' + path.data.groupId : '/production-floor'}>
                            {path.name}
                        </Link>)
                    }
                </Breadcrumbs>
            </Stack>
            <Stack direction={'row'} gap={'5px'} alignItems={'center'}>
                <div style={{ position: 'relative' }}>
                    <PrimaryButton
                        ref={buttonRef}
                        style={{ minWidth: '40px', height: '40px', padding: 0 }}
                        variant={'outlined'}
                        onClick={handleClick}
                    >
                        <SettingsIcon />
                    </PrimaryButton>
                    <ActionsDropdown
                        open={open}
                        setOpen={setOpen}
                        filter={filter}
                        handleFilterChange={handleFilterChange}
                        getList={getList}
                        onSelectStation={onSelectStation}
                        onSelectMachine={onSelectMachine}
                        actionsMachinesIds={actionsMachinesIds}
                        onStationsChange={onStationsChange}
                        buttonRef={buttonRef}
                        dir={dir}
                    />
                </div>
                <SelectGroup />
                <ButtonGroup dir={'ltr'}>
                    <PrimaryButton style={{ width: '40px', height: '40px', padding: 0 }}
                        variant={view === EProductionFloorView.DASHBOARD ? 'contained' : 'outlined'}
                        onClick={() => {
                            setView(EProductionFloorView.DASHBOARD);
                            navigateToProductionFloor();
                        }}>
                        <AvTimerIcon />
                    </PrimaryButton>
                    <PrimaryButton style={{ width: '20px', height: '40px', padding: 0 }}
                        variant={view === EProductionFloorView.KANBAN ? 'contained' : 'outlined'}
                        onClick={() => {
                            setView(EProductionFloorView.KANBAN);
                            navigateToProductionFloor()
                        }}>
                        <GridViewIcon />
                    </PrimaryButton>
                    <PrimaryButton style={{ width: '20px', height: '40px', padding: 0 }}
                        variant={view === EProductionFloorView.TABLE ? 'contained' : 'outlined'}
                        onClick={() => {
                            setView(EProductionFloorView.TABLE);
                            navigateToProductionFloor();
                        }}>
                        <ViewHeadlineIcon />
                    </PrimaryButton>
                </ButtonGroup>
            </Stack>
        </Stack>
    )
}

export { ProductionFloorHeader }