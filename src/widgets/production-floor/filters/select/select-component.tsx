import {FormEvent, useCallback, useState} from "react";
import {Button, Checkbox, FormControlLabel, FormGroup, Menu, MenuItem, MenuProps} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useTranslation} from "react-i18next";
import {styled} from "@mui/material/styles";
import {GomakeTextInput} from "@/components";

interface ISelectComponentProps {
    buttonLabel: string;
    list: {id: string, name: string, checked: boolean}[];
    onChange: (v: string) => void;
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
        height: 'fit-content',
        maxHeight: 500,
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
const SelectComponent = ({buttonLabel, list, onChange}: ISelectComponentProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [filter, setFilter] = useState<string>();
    const open = Boolean(anchorEl);
    const {t} = useTranslation();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
        setFilter(event.currentTarget.value);
    }

    const getList = useCallback(()=> {
        if (filter) {
            return list.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
        }
        return list
    }, [list, filter])
    return(
        <div>
            <Button style={{color: '#9E9E9E', borderColor: '#9E9E9E'}} variant={'outlined'} onClick={handleClick}>
                <span>{t(buttonLabel)}</span>
                <KeyboardArrowDownIcon/>
            </Button>
            <StyledMenu  anchorEl={anchorEl}
                         open={open}
                         onClose={handleClose}>
                <FormGroup>
                    <div>
                        <GomakeTextInput  placeholder={t('productionFloor.search')} value={filter} onChange={handleFilterChange}/>
                    </div>
                    {
                        getList().map((item, index) => {
                            return <MenuItem key={item.id + index}>
                                <FormControlLabel  label={item.name}
                                                   control={<Checkbox checked={item.checked}
                                                                      onChange={() => {onChange(item.id)}}/>}
                                />
                            </MenuItem>

                        })
                    }
                </FormGroup>
            </StyledMenu>
        </div>
    )
}

export {SelectComponent}