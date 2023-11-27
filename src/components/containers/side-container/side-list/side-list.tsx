import {ISideListProps} from "@/components/containers/interface";
import {
    Box,
    Divider,
    List,
    ListItemButton, ListItemIcon,
    ListItemText,
    MenuItem,
} from "@mui/material";
import {useStyle} from "@/components/containers/side-container/side-list/style";
import {styled} from "@mui/material/styles";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {SearchInput} from "@/components/containers/search-input";
import {useCallback, useState} from "react";
import {usePrintHouseAddMachine} from "@/widgets/machines/hooks/use-print-house-add-machine";
import {DeleteIcon} from "@/components/icons/delete-icon";
import {DuplicateIcon} from "@/components/icons/duplicate-icon";
import {useAdminAddMachine} from "@/widgets/machines/hooks/use-admin-add-machine";
import {OptionsButton} from "@/components/options-button/options-button";
import {useTranslation} from "react-i18next";
import Stack from "@mui/material/Stack";

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
                      isHaveDeleteIcon
                  }: ISideListProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const {classes} = useStyle();
    const [filter, setFilter] = useState<string>();
    const {duplicateMachine, deleteMachine} = usePrintHouseAddMachine();
    const {adminDuplicateMachine} = useAdminAddMachine();
    const {t} = useTranslation();
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
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
                    name={'side-list-search'}
                    placeholder={t('header.search')}
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
                            style={isHaveDeleteIcon && classes.deleteButtonDirection}
                        >
                            {!!item.icon && <ListItemIcon sx={{minWidth: 28 }}>{item.icon()}</ListItemIcon>}
                            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
                                <ListItemText style={{maxWidth: 'fit-content'}} primary={item.text}/>
                                {selectedItem === item?.value && quickActions && (
                                    <OptionsButton>
                                        <MenuItem onClick={onClickDuplicate}>
                                            <div style={classes.menuItem}>
                                                <DuplicateIcon height={20} width={20} color={classes.iconColor}/>{" "}
                                                <span>{t('navigationButtons.duplicate')}</span>
                                            </div>
                                        </MenuItem>
                                        <Divider/>
                                        {
                                            !isAdmin &&
                                            <MenuItem onClick={onClickDelete}>
                                                <div style={classes.menuItem}>
                                                    <DeleteIcon color={classes.iconColor} width={20} height={20}/>{" "}
                                                    <span>{t('navigationButtons.delete')}</span>
                                                </div>
                                            </MenuItem>
                                        }
                                    </OptionsButton>
                                )}
                            </Stack>
                        </ListButton>
                    ))}
                </List>
                {!!children && <div style={classes.buttonWrapper}>{children}</div>}
            </Box>
        </>
    );
};

export {SideList};
