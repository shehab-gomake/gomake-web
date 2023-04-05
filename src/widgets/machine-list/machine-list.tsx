import Button from '@mui/material/Button';
import Menu, {MenuProps} from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {IMachineList} from "@/widgets/machine-list/interface";
import {useStyle} from "@/widgets/machine-list/style";
import React, {FormEvent, useEffect, useState} from "react";
import {IMachine} from "@/shared/interfaces";
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import {useTranslation} from "react-i18next";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {styled} from "@mui/material/styles";
import {GomakeTextInput} from "@/components";
import {useGomakeMachines} from "@/hooks";

const MachineList = ({}: IMachineList) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [filter, setFilter] = useState<string>();
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const {classes} = useStyle();
    const {t} = useTranslation();

    const {getMachinesList, machines, setMachineChecked} = useGomakeMachines();

    const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
        setFilter(event.currentTarget.value);
    }

    const getMachines = () => {
        if (filter) {
            return machines.filter((machine) => machine.name.toLowerCase().includes(filter.toLowerCase()));
        }else {
            return machines;
        }
    }


    useEffect(() => {
        getMachinesList();
    }, []);

    return (
        <div>
            <Button style={classes.button} variant={'contained'} onClick={handleClick}>
                <span>{t('machines-list-widget.machinesList')}</span>
                <KeyboardArrowDownIcon/>
            </Button>
            <StyledMenu  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                      'aria-labelledby': 'basic-button',
                  }}>
                <FormGroup>
                    <div style={classes.searchInput}>
                        <GomakeTextInput  placeholder={'search machine'} value={filter} onChange={handleFilterChange}/>
                    </div>
                    {
                        getMachines().map((machine: IMachine) => {
                            return <MenuItem style={classes.machineName} key={machine.id}>
                                <FormControlLabel  label={machine.name}
                                                  control={<Checkbox checked={machine.checked}
                                                                     onChange={() => {
                                                                         setMachineChecked(machine.id)
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
        width: '250px',
        height: 500,
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',

        },
        '& .MuiMenuItem-root': {
            fontSize: '12px',
            color: '#12133A',
            padding: 0

        },
        '& .MuiFormControlLabel-root': {
            margin: 0
        }
    },
}));
export {MachineList}