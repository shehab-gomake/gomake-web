import Stack from "@mui/material/Stack";
import {Collapse, MenuItem} from "@mui/material";
import {SecondaryCheckBox} from "@/components/check-box/secondary-check-box";
import {IActionMachines} from "@/widgets/production-floor/state/actions-list";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useState} from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface IProps extends IActionMachines {
    onSelectStation;
    onSelectMachine;
    isFilter: boolean
}

const CollapseOptionComponent = (option: IProps) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <Stack direction={'row'} alignItems={'flex-start'} gap={'3px'}>
            {
                open || option.isFilter ? <KeyboardArrowUpIcon style={{cursor: 'pointer'}} onClick={() => setOpen(false)}/> :
                    <KeyboardArrowDownIcon style={{
                        cursor: option.machines.length > 0 && 'pointer',
                        opacity: option.machines.length > 0 ? 1 : 0
                    }} onClick={() => option.machines.length > 0 && setOpen(true)}/>
            }
            <Stack>
                <MenuItem sx={{padding: 0, flex: 1, gap: '3px'}}
                          onClick={() => option.onSelectStation(option.actionId, !!option.checked)}>
                    <SecondaryCheckBox sx={{width: '10px', height: '10px'}} checked={!!option.checked}/>
                    <span>{option.actionName}</span>
                </MenuItem>
                <Collapse in={open || option.isFilter}>
                    <Stack direction={'row'} padding={'0 20px'}>
                        <div/>
                        <Stack gap={'5px'} padding={'5px'}>
                            {
                                option?.machines?.map((machine) => <MenuItem
                                    sx={{
                                        padding: 0,
                                        gap: '3px',
                                        width: 'auto',
                                        height: 'fit-content',
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                        alignItems: 'flex-start'
                                    }}
                                    onClick={() => option.onSelectMachine(option.actionId, machine.machineId)}>
                                    <SecondaryCheckBox sx={{width: '10px', height: '10px', marginTop: '3px'}}
                                                       checked={!!machine?.checked}/>
                                    <div style={{position: 'relative'}}>
                                        <span>{machine.machineName}</span>
                                    </div>
                                </MenuItem>)
                            }
                        </Stack>
                    </Stack>
                </Collapse>
            </Stack>
        </Stack>
    )
}

export {CollapseOptionComponent}