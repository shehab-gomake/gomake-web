import {ISideListProps} from "@/widgets/machines/components/side-list/interface";
import {Box, Divider, IconButton, List, ListItemButton, ListItemText, Menu, MenuItem} from "@mui/material";
import {useStyle} from "@/widgets/machines/components/side-list/style";
import {styled} from "@mui/material/styles";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {SearchInput} from "@/widgets/machines/components/side-list/search-input";
import {useCallback, useState} from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {usePrintHouseAddMachine} from "@/widgets/machines/hooks/use-print-house-add-machine";
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import {DeleteIcon} from "@/components/icons/delete-icon";
import {DuplicateIcon} from "@/components/icons/duplicate-icon";
const ListButton = styled(ListItemButton)(() => {
    const {primaryColor} = useGomakeTheme();
    return {
        '&.Mui-selected': {
            backgroundColor: primaryColor(50)
        },
        '&.Mui-selected:hover': {
            backgroundColor: primaryColor(50)
        },
        '&:hover': {
            backgroundColor: primaryColor(50)
        }
    }
})
const SideList = ({list, selectedItem, onSelect, title, quickActions = false, children}: ISideListProps) => {
    const {primaryColor} = useGomakeTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const {classes} = useStyle();
    const [filter, setFilter] = useState<string>();
    const {duplicateMachine, deleteMachine} = usePrintHouseAddMachine();
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    }

    const handleMoreOptionIconClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const onClickDuplicate = () => {
        duplicateMachine();
        handleCloseMenu();
    }

    const onClickDelete = () => {
        deleteMachine();
        handleCloseMenu();
    }

    const filteredList = useCallback(() => {
        if (filter) {
            return list.filter(item => item.text.toLowerCase().includes(filter.toLowerCase()))
        } else {
            return list
        }
    }, [filter, list])
    return (
        <>
            <Box style={classes.container}>
                <h1 style={classes.header}>{title}</h1>
                <SearchInput placeholder={'Search'} onChange={handleFilterChange} value={filter}/>
                <List style={classes.listContainer} component="nav" aria-label="main mailbox folders">
                    {
                        filteredList().map(item => <ListButton
                            selected={item.value === selectedItem}
                            onClick={() => onSelect(item.value)}>
                            <ListItemText primary={item.text}/>
                            {selectedItem === item.value && quickActions &&
                                <IconButton onClick={handleMoreOptionIconClick} sx={{border: '1px solid', color: primaryColor(500)}}
                                            size={'small'}>
                                    <MoreVertIcon sx={{width: 23, height: 23}}>M</MoreVertIcon>
                                </IconButton>}
                        </ListButton>)
                    }
                </List>
                {!!children && <div style={classes.buttonWrapper}>
                    {children}
                </div>
                }
            </Box>
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseMenu}
                PaperProps={classes.menuStyle}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem onClick={onClickDuplicate}>
                    <div style={classes.menuItem}><DuplicateIcon/> <span>Duplicate</span></div>
                </MenuItem>
                <Divider/>
                <MenuItem onClick={onClickDelete}>
                    <div style={classes.menuItem}><DeleteIcon/> <span>Delete</span></div>
                </MenuItem>
            </Menu>
        </>
    );
}

export {SideList};