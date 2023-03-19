import Button from '@mui/material/Button';
import Menu, {MenuProps} from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {IMachineList} from "@/widgets/machine-list/interface";
import {useStyle} from "@/widgets/machine-list/style";
import React, {FormEvent, useEffect, useState} from "react";
import {getApiRequest} from "@/services/api-request";
import {useRecoilState} from "recoil";
import {machinesListState} from "@/store/machines";
import {IMachine} from "@/shared/interfaces";
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import {useTranslation} from "react-i18next";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {styled} from "@mui/material/styles";
import {GomakeTextInput} from "@/components";

const MachineList = ({}: IMachineList) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [filter, setFilter] = useState<string>();
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

    const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
        setFilter(event.currentTarget.value);
    }

    const getMachines = () => {
        if (filter) {
            return machines.filter((machine) => machine.name.includes(filter));
        }else {
            return machines;
        }
    }
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
                {/*<span>{t('dashboard-widget.machinesList')}</span>*/}
                Machine list
                <KeyboardArrowDownIcon/>
            </Button>
            <StyledMenu  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                      'aria-labelledby': 'basic-button',
                  }}>
                <FormGroup>
                    <GomakeTextInput placeholder={'search machine'} onChange={handleFilterChange}/>
                    {
                        getMachines().map((machine: IMachine) => {
                            return <MenuItem style={classes.machineName} key={machine.id}>
                                <FormControlLabel  label={machine.name}
                                                  control={<Checkbox checked={machine.checked}
                                                                     onChange={() => {
                                                                         handleChange(machine.id)
                                                                     }}/>}
                                />
                            </MenuItem>

                        })
                    }
                </FormGroup>
            </StyledMenu>
        </div>
    );
}
const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(() => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        width: '190px',
        height: 330,
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',

        },
        '& .MuiMenuItem-root': {
            fontSize: '12px',
            color: '#12133A',

        },
    },
}));
export {MachineList}