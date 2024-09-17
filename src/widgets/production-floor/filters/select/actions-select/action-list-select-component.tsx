import { FormEvent, useCallback, useContext } from "react";
import { Button, FormGroup, MenuItem, Paper, Box, Chip, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { GomakeTextInput } from "@/components";
import Stack from "@mui/material/Stack";
import { SecondaryCheckBox } from "@/components/check-box/secondary-check-box";
import { Source, useActionsList } from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import { SecondaryButton } from "@/components/button/secondary-button";
import { IStation } from "@/widgets/production-floor/interfaces/filters";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { adaptRight } from "@/utils/adapter";
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { LeftArrowIcon } from "@/components/icons/left-arrow-icon";
import { RightArrowIcon } from "@/components/icons/right-arrow-icon";

interface IProps {
    onClickApply: (v: IStation[]) => void,
    source: Source
}

const ActionsListComponent = ({ onClickApply, source }: IProps) => {
    const {
        actionsList,
        onSelectMachine,
        onSelectStation,
        actionsMachinesIds,
        open,
        setOpen,
        filter,
        setFilter,
        t
    } = useActionsList(source);
    const direction = t('direction')
    const RTL = direction === 'rtl';

    const handleClick = () => {
        setOpen(!open)
    };
    const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
        setFilter(event.currentTarget.value);
    }

    const getList = useCallback(() => {
        let list = [...actionsList];
        if (filter) {
            list = actionsList?.map(action => ({
                ...action,
                machines: action.machines.filter(m => m.machineName?.toLowerCase().includes(filter?.toLowerCase()) || action.actionName?.toLowerCase().includes(filter?.toLowerCase()))
            }))
                ?.filter(action => action.actionName?.toLowerCase().includes(filter?.toLowerCase()) || action.machines.length > 0)
        }
        return list?.length > 0 ? list?.sort((a, b) => a.checked === b.checked ? 0 : !!a.checked ? -1 : 0) : []
    }, [actionsList, filter]);


    function LeftArrow() {
        const { scrollPrev } = useContext(VisibilityContext);
        return (
            <IconButton onClick={() => scrollPrev()} style={{ display: "flex" }}>
                {RTL ? <RightArrowIcon /> : <LeftArrowIcon />}
            </IconButton>
        );
    }

    function RightArrow() {
        const { scrollNext } = useContext(VisibilityContext);
        return (
            <IconButton onClick={() => scrollNext()} style={{ display: "flex" }}>
                {RTL ? <LeftArrowIcon /> : <RightArrowIcon />}
            </IconButton>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* Scrollable Chips Menu */}
            {/* <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}  RTL={RTL}>
                    {actionsMachinesIds?.map((option) => (
                        <button
                        key={option.actionId}
                        style={{ margin: '4px' }}
                            // onClick={() => AddVariable(option)}
                        >
                            {option.actionName || 'Unknown'}
                        </button>
                    ))}
                </ScrollMenu> */}

{/* //////////////// test ////////////////// */}
            {/* <Box sx={{
                position: 'absolute',
                top: '50%',
                left: 'calc(100% + 10px)', // Adjust as needed
                maxHeight: '100px',
                overflowY: 'auto',
                border: '1px solid #E0E0E0',
                borderRadius: '4px',
                backgroundColor: '#FFF',
                zIndex: 99999999999999,
                padding: '8px',
                display: 'flex',
                flexWrap: 'wrap'
            }}>
                {actionsMachinesIds.map((item) => (
                    <Chip
                        key={item.actionId}
                        label={item.actionName || 'Unknown'}
                        sx={{ margin: '4px' }}
                        // Optionally add a delete button or similar functionality if needed
                    />
                ))}
            </Box> */}

            {/* Dropdown Button */}
            <Button style={{ color: '#9E9E9E', borderColor: '#9E9E9E', height: '38px' }} variant={'outlined'}
                    onClick={handleClick}>
                <span>{t('productionFloor.selectStations')}</span>
                <KeyboardArrowDownIcon />
            </Button>

            {open &&
                <ClickOutside onClick={() => setOpen(false)}>
                    <Paper sx={{
                        position: 'absolute',
                        ...adaptRight(direction, 0),
                        top: source === Source.PRODUCTION_FLOOR ? '110%' : '-610px',
                        maxWidth: '300px',
                        height: 'fit-content',
                        maxHeight: '600px',
                        overflow: 'auto',
                        zIndex: 99999999999999
                    }}>
                        <FormGroup>
                            <div style={{ position: 'sticky', top: 0, backgroundColor: '#FFF', zIndex: 1 }}>
                                <GomakeTextInput placeholder={t('productionFloor.search')} value={filter}
                                                 onChange={handleFilterChange} />
                            </div>
                            <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100% - 120px)' }}>
                                {getList().map((option, index) => (
                                    <Stack key={index + option.actionId + option.actionName}>
                                        <MenuItem onClick={() => onSelectStation(option.actionId, !!option.checked)}>
                                            <SecondaryCheckBox checked={!!option.checked} />
                                            <span>{option.actionName}</span>
                                        </MenuItem>
                                        <Stack direction={'row'} gap={'30px'}>
                                            <div />
                                            <Stack>
                                                {option?.machines?.map((machine) => (
                                                    <MenuItem
                                                        key={machine.machineId}
                                                        onClick={() => onSelectMachine(option.actionId, machine.machineId)}>
                                                        <SecondaryCheckBox checked={!!machine?.checked} />
                                                        {machine.machineName}
                                                    </MenuItem>
                                                ))}
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                ))}
                            </Box>
                        </FormGroup>
                        <div style={{
                            position: 'sticky',
                            bottom: 0,
                            right: 0,
                            left: 0,
                            backgroundColor: '#FFF',
                            zIndex: 1
                        }}>
                            <SecondaryButton style={{ width: '100%' }} variant={'contained'} onClick={() => {
                                setOpen(false)
                                onClickApply(actionsMachinesIds)
                            }}>
                                {t("productionFloor.apply")}
                            </SecondaryButton>
                        </div>
                    </Paper>
                </ClickOutside>
            }
        </div>
    );
}

export { ActionsListComponent }
