import {FormEvent, useCallback, useState} from "react";
import {Button, Checkbox, FormControlLabel, FormGroup, Menu, MenuItem, MenuProps} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowRight";
import {useTranslation} from "react-i18next";
import {styled} from "@mui/material/styles";
import {GomakeTextInput} from "@/components";

interface ISelectComponentProps {
    buttonLabel: string;
    list: {id: string, name: string, checked: boolean}[]
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
const SelectComponent = ({buttonLabel, list}: ISelectComponentProps) => {
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
          <Button variant={'contained'} onClick={handleClick}>
              <span>{t(buttonLabel)}</span>
              <KeyboardArrowDownIcon/>
          </Button>
          <StyledMenu  anchorEl={anchorEl}
                       open={open}
                       onClose={handleClose}>
              <FormGroup>
                  <div>
                      <GomakeTextInput  placeholder={'search machine'} value={filter} onChange={handleFilterChange}/>
                  </div>
                  <MenuItem>
                      <FormControlLabel  label={t('All')}
                                         control={<Checkbox checked={list.every(item => !!item.checked)}
                                                            onChange={() => {
                                                            }}/>}
                      />
                  </MenuItem>
                  {
                      getList().map(item => {
                          return <MenuItem key={item.id}>
                              <FormControlLabel  label={item.name}
                                                 control={<Checkbox checked={item.checked}
                                                                    onChange={() => {
                                                                    }}/>}
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