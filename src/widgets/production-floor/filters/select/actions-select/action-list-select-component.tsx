import { FormEvent, useCallback } from "react";
import { Button, Chip, FormGroup, MenuItem, Paper, TextField } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { GomakeTextInput } from "@/components";
import Stack from "@mui/material/Stack";
import { SecondaryCheckBox } from "@/components/check-box/secondary-check-box";
import { Source, useActionsList } from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import { SecondaryButton } from "@/components/button/secondary-button";
import { IStation } from "@/widgets/production-floor/interfaces/filters";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { adaptRight } from "@/utils/adapter";
import ClearIcon from '@mui/icons-material/Clear';
import { FONT_FAMILY } from "@/utils/font-family";


interface IProps {
    onClickApply: (v: IStation[]) => void,
    source: Source
}

const ActionsListComponent = ({ onClickApply, source }: IProps) => {

    const {
        t,
        actionsList,
        onSelectMachine,
        onSelectStation,
        actionsMachinesIds,
        open,
        setOpen,
        filter,
        setFilter,
        actionsListRef
    } = useActionsList(source);

    const direction = t('direction')
    const isRTL = direction === "rtl";

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
    }, [actionsList, filter])


    // const handleRemoveChip = (stationId: string) => {
    //      onSelectStation(stationId, true); 
    // }

    const handleRemoveChip = (stationId: string) => {
        onSelectStation(stationId, true);
        const updatedActionsMachinesIds = actionsListRef.current
            .filter(station => station.checked || station.machines.some(machine => machine.checked))
            .map(station => ({
                actionId: station.actionId,
                actionName: station.actionName,
                machineIds: station.machines.filter(machine => machine.checked).map(machine => machine.machineId)
            }));

        onClickApply(updatedActionsMachinesIds);
    };

    return (
        <div style={{ position: 'relative' }}>
            <TextField
                variant="outlined"
                style={{ width: "fit-content" }}
                onClick={handleClick}
                InputProps={{
                    style: { borderRadius:"6px",border: '1px solid #9E9E9E', color: "#9E9E9E", width: "min-content", minWidth: "100px", height: '40px' },
                    startAdornment: actionsMachinesIds?.map((station, index) => (
                        <Chip
                            key={index}
                            label={station.actionName}
                            onDelete={() => handleRemoveChip(station.actionId)}
                            deleteIcon={<ClearIcon />}
                            sx={{
                                marginRight: isRTL ? '0' : '5px',
                                marginLeft: isRTL ? '5px' : '0',
                                '& .MuiChip-deleteIcon': {
                                    marginLeft: isRTL ? '5px' : '0px',
                                    marginRight: isRTL ? '0px' : '5px',
                                },
                            }}

                        />
                    )),
                    endAdornment: <KeyboardArrowDownIcon />,
                }}
                placeholder={actionsMachinesIds.length === 0 ? t('productionFloor.selectStations') : ''}
                sx={{
                    '& .MuiInputBase-input::placeholder': {
                        ...FONT_FAMILY.Heebo(500, 14),
                        color: "#9e9e9e",
                        textTransform: 'uppercase',
                        opacity: 1,
                        padding: "10px"
                    },
                }}
            />
            {open &&
                <ClickOutside onClick={() => setOpen(false)}>
                    <Paper sx={{
                        position: 'absolute', ...adaptRight(direction, 0),
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
                            {
                                getList().map((option, index) => {
                                    return <Stack key={index + option.actionId + option.actionName}>
                                        <MenuItem onClick={() => onSelectStation(option.actionId, !!option.checked)}>
                                            <SecondaryCheckBox checked={!!option.checked} />
                                            <span>{option.actionName}</span>
                                        </MenuItem>
                                        <Stack direction={'row'} gap={'30px'}>
                                            <div />
                                            <Stack>
                                                {
                                                    option?.machines?.map((machine) => <MenuItem
                                                        onClick={() => onSelectMachine(option.actionId, machine.machineId)}>
                                                        <SecondaryCheckBox checked={!!machine?.checked} />
                                                        {machine.machineName}
                                                    </MenuItem>)
                                                }
                                            </Stack>
                                        </Stack>
                                    </Stack>

                                })
                            }
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
                            }
                            }>{t("productionFloor.apply")}</SecondaryButton>
                        </div>
                    </Paper>
                </ClickOutside>
            }
        </div>
    )
}

export { ActionsListComponent }