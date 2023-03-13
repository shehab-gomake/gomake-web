import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {IMachineList} from "@/widgets/machine-list/interface";
import {useStyle} from "@/widgets/machine-list/style";
import {useEffect, useState} from "react";
import {getApiRequest} from "@/services/api-request";
import {useRecoilState} from "recoil";
import {machinesListState} from "@/store/machines";
import {IMachine} from "@/shared/interfaces";
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import {useTranslation} from "react-i18next";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const MachineList = ({}: IMachineList) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [machines, setMachines] = useRecoilState(machinesListState);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const {classes} = useStyle();
    const {t} = useTranslation();
    const handleChange = (id: string) => {
        const updatedMachines: IMachine[] = machines.map((machine) => {
            if (machine.id === id) {
                return {...machine, checked: !machine.checked}
            }
            return machine
        })
        setMachines(updatedMachines);
    }

    useEffect(() => {
        getApiRequest('/machines', {}).then(
            (res) => {
                if (res && res.data) {
                    setMachines(res.data.map((m: IMachine) => ({...m, checked: true})));
                }
            });
    }, []);

    return (
        <div>
            <Button style={classes.button} variant={'contained'} onClick={handleClick}>
                <span>{t('dashboard.machinesList')}</span>
                <KeyboardArrowDownIcon/>
            </Button>
            <Menu anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                      'aria-labelledby': 'basic-button',
                  }}>
                <FormGroup>
                    {
                        machines.map((machine: IMachine) => {
                            return <MenuItem key={machine.id}>
                                <FormControlLabel label={machine.name}
                                                  control={<Checkbox checked={machine.checked}
                                                                     onChange={() => {
                                                                         handleChange(machine.id)
                                                                     }}/>}
                                />
                            </MenuItem>

                        })
                    }
                </FormGroup>
            </Menu>
        </div>
    );
}

export {MachineList}