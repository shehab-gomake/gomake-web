import { CSSProperties, FormEvent, useCallback, useState } from "react";
import { Button, Checkbox, Chip, FormControlLabel, FormGroup, Menu, MenuItem, MenuProps, TextField } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { GomakeTextInput } from "@/components";
import ClearIcon from '@mui/icons-material/Clear';
import { FONT_FAMILY } from "@/utils/font-family";

interface ISelectComponentProps {
    buttonLabel: string;
    list: { id: string, name: string, checked: boolean }[];
    onChange: (v: string) => void;
    style?: CSSProperties;
    checkWhatRenderArray?: any
}

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: props.dir === "rtl" ? 'right' : 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: props.dir === "rtl" ? 'right' : 'left',
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

const SelectComponent = ({ buttonLabel, list, onChange, style, checkWhatRenderArray }: ISelectComponentProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [filter, setFilter] = useState<string>();
    const open = Boolean(anchorEl);
    const { t } = useTranslation();
    // const direction = t('direction')
    // const isRTL = direction === "rtl";

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setFilter("")
    };
    const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
        if (buttonLabel === "dashboard-widget.clients") {
            setFilter(event.currentTarget.value);
            checkWhatRenderArray(event.currentTarget.value)
        } else {
            setFilter(event.currentTarget.value);

        }
    }

    const getList = useCallback(() => {
        if (filter) {
            return list.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
        }
        return list
    }, [list, filter]);

    // const selectedItems = list.filter(item => item.checked);


    return (
        // <div>
        //     <TextField
        //         variant="outlined"
        //         onClick={handleClick}
        //         InputProps={{
        //             style: {borderRadius:"6px", border: '1px solid #9E9E9E', color: "#9E9E9E", width: "min-content", minWidth: "100px", height: '40px' },
        //             startAdornment: selectedItems.map((item, index) => (
        //                 <Chip
        //                     key={item.id + index}
        //                     label={item.name}
        //                     onDelete={() => onChange(item.id)}
        //                     deleteIcon={<ClearIcon />}
        //                     sx={{
        //                         marginRight: isRTL ? '0' : '5px',
        //                         marginLeft: isRTL ? '5px' : '0',
        //                         '& .MuiChip-deleteIcon': {
        //                             marginLeft: isRTL ? '5px' : '0px',
        //                             marginRight: isRTL ? '0px' : '5px',
        //                         },
        //                     }}
        //                 />
        //             )),
        //             endAdornment: <KeyboardArrowDownIcon />,
        //         }}
        //         placeholder={selectedItems.length === 0 ? t(buttonLabel) : ''}
        //         sx={{
        //             '& .MuiInputBase-input::placeholder': {
        //                 ...FONT_FAMILY.Heebo(500, 14),
        //                 color: "#9e9e9e",
        //                 textTransform: 'uppercase',
        //                 opacity: 1,
        //                 // padding:"10px"
        //             },
        //         }}
        //     />
        //     <StyledMenu
        //         dir={direction}
        //         anchorEl={anchorEl}
        //         open={open}
        //         onClose={handleClose}>
        //         <FormGroup>
        //             <div>
        //                 <GomakeTextInput placeholder={t('productionFloor.search')} value={filter} onChange={handleFilterChange} />
        //             </div>
        //             {
        //                 getList().map((item, index) => {
        //                     return <MenuItem key={item.id + index}>
        //                         <FormControlLabel label={item.name}
        //                             control={<Checkbox checked={item.checked}
        //                                 onChange={() => { onChange(item.id) }} />}
        //                         />
        //                     </MenuItem>
        //                 })
        //             }
        //         </FormGroup>
        //     </StyledMenu>
        // </div>
        <div>
            <Button style={!!style ? style : { color: '#9E9E9E', borderColor: '#9E9E9E' }} variant={!!style ? 'contained' : 'outlined'} onClick={handleClick}>
                <span>{t(buttonLabel)}</span>
                <KeyboardArrowDownIcon />
            </Button>
            <StyledMenu anchorEl={anchorEl}
                open={open}
                onClose={handleClose}>
                <FormGroup>
                    <div>
                        <GomakeTextInput placeholder={t('productionFloor.search')} value={filter} onChange={handleFilterChange} />
                    </div>
                    {
                        getList().map((item, index) => {
                            return <MenuItem key={item.id + index}>
                                <FormControlLabel label={item.name}
                                    control={<Checkbox checked={item.checked}
                                        onChange={() => { onChange(item.id) }} />}
                                />
                            </MenuItem>

                        })
                    }
                </FormGroup>
            </StyledMenu>
        </div>
    )
}

export { SelectComponent }