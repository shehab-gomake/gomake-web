import {ISideListProps} from "@/widgets/machines/components/side-list/interface";
import {
    Box,
    Divider,
    IconButton,
    List,
    ListItemButton, ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import {useStyle} from "@/widgets/machines/components/side-list/style";
import {styled} from "@mui/material/styles";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {SearchInput} from "@/widgets/machines/components/side-list/search-input";
import {useCallback, useState} from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {usePrintHouseAddMachine} from "@/widgets/machines/hooks/use-print-house-add-machine";
import {DeleteIcon} from "@/components/icons/delete-icon";
import {DuplicateIcon} from "@/components/icons/duplicate-icon";
import {useAdminAddMachine} from "@/widgets/machines/hooks/use-admin-add-machine";
import {OptionsButton} from "@/components/options-button/options-button";

const ListButton = styled(ListItemButton)(() => {
    const {primaryColor} = useGomakeTheme();
    return {
        "&.Mui-selected": {
            backgroundColor: primaryColor(50),
        },
        "&.Mui-selected:hover": {
            backgroundColor: primaryColor(50),
        },
        "&:hover": {
            backgroundColor: primaryColor(50),
        },
    };
});
const SideList = ({
                      list,
                      selectedItem,
                      onSelect,
                      title,
                      quickActions = false,
                      children,
                      isAdmin,
                  }: ISideListProps) => {
    const {primaryColor} = useGomakeTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const {classes} = useStyle();
    const [filter, setFilter] = useState<string>();
    const {duplicateMachine, deleteMachine} = usePrintHouseAddMachine();
    const {adminDuplicateMachine} = useAdminAddMachine();
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleMoreOptionIconClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const onClickDuplicate = () => {
        if (isAdmin) {
            adminDuplicateMachine();
        } else {

            duplicateMachine();
        }
        handleCloseMenu();
    };

    const onClickDelete = () => {
        deleteMachine();
        handleCloseMenu();
    };

    const filteredList = useCallback(() => {
        if (filter) {
            return list.filter((item) =>
                item.text.toLowerCase().includes(filter.toLowerCase())
            );
        } else {
            return list;
        }
    }, [filter, list]);
    return (
        <>
            <Box style={classes.container}>
                <h1 style={classes.header}>{title}</h1>
                <SearchInput
                    placeholder={"Search"}
                    onChange={handleFilterChange}
                    value={filter}
                />
                <List
                    style={classes.listContainer}
                    component="nav"
                    aria-label="main mailbox folders"
                >
                    {filteredList().map((item) => (
                        <ListButton
                            selected={item?.value === selectedItem}
                            onClick={() => onSelect(item?.value)}
                        >
                            {!!item.icon && <ListItemIcon sx={{minWidth: 28}}>{item.icon()}</ListItemIcon>}
                            <ListItemText primary={item.text}/>
                            {selectedItem === item?.value && quickActions && (
                                <OptionsButton>
                                    <MenuItem onClick={onClickDuplicate}>
                                        <div style={classes.menuItem}>
                                            <DuplicateIcon height={20} width={20} color={classes.iconColor}/>{" "}
                                            <span>Duplicate</span>
                                        </div>
                                    </MenuItem>
                                    <Divider/>
                                    {
                                        !isAdmin &&
                                        <MenuItem onClick={onClickDelete}>
                                            <div style={classes.menuItem}>
                                                <DeleteIcon color={classes.iconColor} width={20} height={20}/>{" "}
                                                <span>Delete</span>
                                            </div>
                                        </MenuItem>
                                    }
                                </OptionsButton>
                            )}
                        </ListButton>
                    ))}
                </List>
                {!!children && <div style={classes.buttonWrapper}>{children}</div>}
            </Box>
        </>
    );
};

export {SideList};
