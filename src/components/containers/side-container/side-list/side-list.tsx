import { ISideListProps } from "@/components/containers/interface";
import {
    Box,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from "@mui/material";
import { useStyle } from "@/components/containers/side-container/side-list/style";
import { styled } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { SearchInput } from "@/components/containers/search-input";
import { useCallback, useState } from "react";
import { usePrintHouseAddMachine } from "@/widgets/machines/hooks/use-print-house-add-machine";
import { DeleteIcon } from "@/components/icons/delete-icon";
import { DuplicateIcon } from "@/components/icons/duplicate-icon";
import { useAdminAddMachine } from "@/widgets/machines/hooks/use-admin-add-machine";
import { OptionsButton } from "@/components/options-button/options-button";
import { useTranslation } from "react-i18next";
import Stack from "@mui/material/Stack";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SortIcon } from "@/icons";
import { useRecoilState } from "recoil";
import { materialCategoriesState } from "@/widgets/materials-widget/state";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { updateCategoriesOrderApi, updatePrintHouseCategoriesOrderApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { useRouter } from "next/router";

const ListButton = styled(ListItemButton)(() => {
    const { primaryColor } = useGomakeTheme();
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
    isHaveDeleteIcon,
}: ISideListProps) => {
    const { query } = useRouter();
    const { materialType } = query;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { classes } = useStyle();
    const [filter, setFilter] = useState<string>();
    const { duplicateMachine, deleteMachine } = usePrintHouseAddMachine();
    const { adminDuplicateMachine } = useAdminAddMachine();
    const { t } = useTranslation();
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
    const [materialCategories, setMaterialCategories] = useRecoilState<
        {
            categoryKey: string;
            categoryName: string;
            isDeletable: boolean;
        }[]
    >(materialCategoriesState);
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const newList: any = Array.from(list);
        const [removed] = newList.splice(result.source.index, 1);
        newList.splice(result.destination.index, 0, removed);
        const transformedArray = newList.map((item, index) => ({
            categoryKey: item?.categoryKey,
            order: index + 1,
        }));
        // Update the state with the new order
        setMaterialCategories(newList);

        // If needed, call a reorder function here to handle any side effects
        reOrderMaterialCategories(transformedArray);
    };
    const { callApi } = useGomakeAxios();
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
    const reOrderMaterialCategories = useCallback(async (data: any) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessUpdate()
            } else {
                alertFaultUpdate()
            }
        }
        if (isAdmin) {
            await updateCategoriesOrderApi(callApi, callBack, {
                materialTypeKey: materialType.toString(),
                categories: data,
            })
        } else {
            await updatePrintHouseCategoriesOrderApi(callApi, callBack, {
                materialTypeKey: materialType.toString(),
                categories: data,
            })
        }

    }, []);
    return (
        <>
            <Box style={classes.container}>
                <h1 style={classes.header}>{title}</h1>
                <div data-tour="first-step">
                    <SearchInput
                        name={"side-list-search"}
                        placeholder={t("header.search")}
                        onChange={handleFilterChange}
                        value={filter}
                    />
                </div>
                {
                    isHaveDeleteIcon ? <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <List
                                    style={classes.listContainer}
                                    component="nav"
                                    aria-label="main mailbox folders"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {filteredList().map((item, index) => (
                                        <Draggable
                                            key={item.value}
                                            draggableId={item.value}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <ListButton
                                                    data-tour={item?.dataTour}
                                                    selected={item?.value === selectedItem}
                                                    onClick={() => onSelect(item?.value)}
                                                    style={isHaveDeleteIcon && classes.deleteButtonDirection}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div style={{ marginRight: 8 }}>
                                                        <SortIcon />
                                                    </div>

                                                    <Stack
                                                        direction={"row"}
                                                        alignItems={"center"}
                                                        justifyContent={"space-between"}
                                                        width={"100%"}
                                                    >
                                                        <ListItemText
                                                            style={{ maxWidth: "fit-content" }}
                                                            primary={item.text}
                                                        />
                                                        {selectedItem === item?.value && quickActions && (
                                                            <OptionsButton>
                                                                <MenuItem onClick={onClickDuplicate}>
                                                                    <div style={classes.menuItem}>
                                                                        <DuplicateIcon
                                                                            height={20}
                                                                            width={20}
                                                                            color={classes.iconColor}
                                                                        />{" "}
                                                                        <span>{t("navigationButtons.duplicate")}</span>
                                                                    </div>
                                                                </MenuItem>
                                                                <Divider />
                                                                {!isAdmin && (
                                                                    <MenuItem onClick={onClickDelete}>
                                                                        <div style={classes.menuItem}>
                                                                            <DeleteIcon
                                                                                color={classes.iconColor}
                                                                                width={20}
                                                                                height={20}
                                                                            />{" "}
                                                                            <span>{t("navigationButtons.delete")}</span>
                                                                        </div>
                                                                    </MenuItem>
                                                                )}
                                                            </OptionsButton>
                                                        )}
                                                    </Stack>
                                                    {!!item.icon && (
                                                        <ListItemIcon sx={{ minWidth: 28 }}>
                                                            {item.icon()}
                                                        </ListItemIcon>
                                                    )}
                                                </ListButton>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </List>
                            )}
                        </Droppable>
                    </DragDropContext> :
                        <List
                            style={classes.listContainer}
                            component="nav"
                            aria-label="main mailbox folders"
                        >
                            {filteredList().map((item) => {
                                return (
                                    <ListButton
                                        data-tour={item?.dataTour}
                                        selected={item?.value === selectedItem}
                                        onClick={() => onSelect(item?.value)}
                                        style={isHaveDeleteIcon && classes.deleteButtonDirection}
                                    >
                                        {!!item.icon && (
                                            <ListItemIcon sx={{ minWidth: 28 }}>
                                                {item.icon()}
                                            </ListItemIcon>
                                        )}
                                        <Stack
                                            direction={"row"}
                                            alignItems={"center"}
                                            justifyContent={"space-between"}
                                            width={"100%"}
                                        >
                                            <ListItemText
                                                style={{ maxWidth: "fit-content" }}
                                                primary={item.text}
                                            />
                                            {selectedItem === item?.value && quickActions && (
                                                <OptionsButton>
                                                    <MenuItem onClick={onClickDuplicate}>
                                                        <div style={classes.menuItem}>
                                                            <DuplicateIcon
                                                                height={20}
                                                                width={20}
                                                                color={classes.iconColor}
                                                            />{" "}
                                                            <span>{t("navigationButtons.duplicate")}</span>
                                                        </div>
                                                    </MenuItem>
                                                    <Divider />
                                                    {!isAdmin && (
                                                        <MenuItem onClick={onClickDelete}>
                                                            <div style={classes.menuItem}>
                                                                <DeleteIcon
                                                                    color={classes.iconColor}
                                                                    width={20}
                                                                    height={20}
                                                                />{" "}
                                                                <span>{t("navigationButtons.delete")}</span>
                                                            </div>
                                                        </MenuItem>
                                                    )}
                                                </OptionsButton>
                                            )}
                                        </Stack>
                                    </ListButton>
                                );
                            })}
                        </List>
                }


                {!!children && <div style={classes.buttonWrapper}>{children}</div>}
            </Box>
        </>
    );
};

export { SideList };
