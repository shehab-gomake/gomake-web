import { ISideListProps } from "@/components/containers/interface";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useState, useMemo } from "react";
import { usePrintHouseAddMachine } from "@/widgets/machines/hooks/use-print-house-add-machine";
import { DeleteIcon } from "@/components/icons/delete-icon";
import { DuplicateIcon } from "@/components/icons/duplicate-icon";
import { useAdminAddMachine } from "@/widgets/machines/hooks/use-admin-add-machine";
import { OptionsButton } from "@/components/options-button/options-button";
import { useTranslation } from "react-i18next";
import Stack from "@mui/material/Stack";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SortIcon } from "@/icons";
import { useRecoilState } from "recoil";
import { materialCategoriesState } from "@/widgets/materials-widget/state";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  updateCategoriesOrderApi,
  updatePrintHouseCategoriesOrderApi,
} from "@/services/api-service/materials/printhouse-materials-endpoints";
import { useRouter } from "next/router";
import { adaptPaddingLeft } from "@/utils/adapter";
import { CloseIcon } from "@/widgets/quote-new/receipts-table/Payment-methods-details/icons/close-icon";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import {
  HpProfileIcon,
  HpBusinessProfileIcon,
  HpPricingProfileIcon,
  HpProductsIcon,
  HpMailingIcon,
  HpDocumentingIcon,
  HpUsersIcon,
  HpFileApiIcon,
  HpPreferencesIcon,
  HpManageBillingIcon,
} from "@/themes/hp-client/icons";

const HpSearchInput = styled(TextField)(() => {
  return {
    width: "231px",
    "& .MuiOutlinedInput-root": {
      height: "36px",
      padding: "4px 12px",
      backgroundColor: "#FFFFFF",
      borderRadius: "8px",
      fontFamily: "'Forma DJR UI', sans-serif",
      fontSize: "16px",
      lineHeight: "19px",
      "& fieldset": {
        border: "1px solid #FFFFFF",
      },
      "&:hover fieldset": {
        border: "1px solid #FFFFFF",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #FFFFFF",
      },
      "& input": {
        padding: 0,
        "&::placeholder": {
          color: "#A3A3A3",
          opacity: 1,
          fontFamily: "'Forma DJR UI', sans-serif",
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "19px",
        },
      },
    },
  };
});

const HpListButton = styled(ListItemButton)(() => {
  return {
    position: "relative" as "relative",
    isolation: "isolate" as "isolate",
    width: "231px",
    height: "40px",
    padding: "8px",
    gap: "6px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "row" as "row",
    alignItems: "center",
    flex: "none",
    alignSelf: "stretch",
    flexGrow: 0,
    "&.Mui-selected": {
      backgroundColor: "var(--theme-primary-200, #B2D2FF)",
      "&::before": {
        content: '""',
        position: "absolute",
        width: "2px",
        height: "12px",
        left: "0px",
        top: "14px",
        background: "#001CB0",
        border: "2px solid #FFFFFF",
        borderRadius: "4px",
        zIndex: 2,
      },
      "& .MuiListItemText-primary": {
        color: "#001CB0",
        fontFamily: "'Forma DJR UI', sans-serif",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "20px",
        width: "183px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        flex: "none",
        flexGrow: 1,
        zIndex: 1,
      },
      "& .MuiListItemIcon-root": {
        color: "#001CB0",
        minWidth: "24px",
        width: "16px",
        height: "16px",
        flex: "none",
        flexGrow: 0,
        zIndex: 0,
        "& svg": {
          width: "16px",
          height: "16px",
        },
      },
    },

    "&.Mui-selected:hover": {
      backgroundColor: "var(--theme-primary-200, #B2D2FF)",
    },
    "&:hover": {
      backgroundColor:
        "var(--theme-primary-200-alpha, rgba(178, 210, 255, 0.3))",
    },
    "& .MuiListItemText-primary": {
      color: "#1A1A1A",
      fontFamily: "'Forma DJR UI', sans-serif",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "20px",
    },
    "& .MuiListItemIcon-root": {
      // minWidth: "24px",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      flex: "none",
      flexGrow: 0,
      zIndex: 0,
      "& svg": {
        width: "16px",
        height: "16px",
      },
    },
  };
});

const HpSideList = ({
  list,
  selectedItem,
  onSelect,
  title,
  quickActions = false,
  children,
  isAdmin,
  isHaveDeleteIcon = false,
  onClickCloseSidebar,
}: ISideListProps) => {
  const { query } = useRouter();
  const { materialType } = query;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filter, setFilter] = useState<string>();
  const { duplicateMachine, deleteMachine } = usePrintHouseAddMachine();
  const { adminDuplicateMachine } = useAdminAddMachine();
  const { t } = useTranslation();
  const isRTL = t("direction") === "rtl";

  const classes = useMemo(() => {
    return {
      container: {
        boxSizing: "border-box" as "border-box",
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "flex-start",
        padding: "24px 25px 0px 24px",
        gap: "24px",
        width: "280px",
        backgroundColor: "#FFFFFF",
        ...(isRTL
          ? { borderLeft: "1px solid #E0E0E0" }
          : { borderRight: "1px solid #E0E0E0" }),
        borderRadius: "0px",
        position: "relative" as "relative",
      },
      closeIcon: {
        position: "absolute" as "absolute",
        top: 5,
        right: 5,
        cursor: "pointer" as "pointer",
      },
      header: {
        width: "231px",
        height: "40px",
        fontFamily: "'Forma DJR UI', sans-serif",
        fontStyle: "normal" as "normal",
        fontWeight: 500,
        fontSize: "32px",
        lineHeight: "40px",
        color: "#1A1A1A",
        margin: 0,
        padding: 0,
      },
      searchContainer: {
        width: "231px",
      },
      listContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "flex-start",
        padding: "0px",
        gap: "4px",
        width: "231px",
        backgroundColor: "inherit",
        overflow: "auto",
        height: isHaveDeleteIcon
          ? "calc(100vh - 305px)"
          : "calc(100vh - 235px)",
      },
      buttonWrapper: {
        padding: "3px 14px",
      },
      deleteButtonDirection: {
        display: "flex",
        flexDirection: "row-reverse" as "row-reverse",
        zIndex: 0,
      },
      menuItem: {
        display: "flex",
        width: 125,
        justifyContent: "space-between",
        alignItems: "center",
        color: "var(--theme-primary-color, #024AD8)",
      },
      iconColor: "var(--theme-primary-color, #024AD8)",
    };
  }, [isHaveDeleteIcon, isRTL]);

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
    setMaterialCategories(newList);
    reOrderMaterialCategories(transformedArray);
  };

  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

  const reOrderMaterialCategories = useCallback(async (data: any) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    if (isAdmin) {
      await updateCategoriesOrderApi(callApi, callBack, {
        materialTypeKey: materialType.toString(),
        categories: data,
      });
    } else {
      await updatePrintHouseCategoriesOrderApi(callApi, callBack, {
        materialTypeKey: materialType.toString(),
        categories: data,
      });
    }
  }, []);

  // Helper function to render icon with selected state
  const renderIcon = useCallback((item: any, isSelected: boolean) => {
    if (!item.icon) return null;

    // Map icon paths to HP Client icons
    // Add more mappings as you create new icons
    const iconMap: Record<
      string,
      React.ComponentType<{ selected?: boolean }>
    > = {
      profile: HpProfileIcon,
      "company-profile": HpBusinessProfileIcon,
      "price-profit": HpPricingProfileIcon,
      products: HpProductsIcon,
      mailing: HpMailingIcon,
      documents: HpDocumentingIcon,
      users: HpUsersIcon,
      "file-api-settings": HpFileApiIcon,
      preferences: HpPreferencesIcon,
      subscriptions: HpManageBillingIcon,
      translations: (props: { selected?: boolean }) => (
        <TranslateOutlinedIcon
          width={16}
          height={16}
          style={{ color: props.selected ? "#001CB0" : "#1A1A1A" }}
        />
      ),
    };

    // Check if we have an HP Client icon for this item
    const IconComponent = item.path && iconMap[item.path];

    if (IconComponent) {
      return <IconComponent selected={isSelected} />;
    }

    // Fallback to original icon
    return item.icon();
  }, []);

  return (
    <>
      <Box style={classes.container}>
        <h1 style={classes.header}>{title}</h1>
        {isHaveDeleteIcon && (
          <IconButton style={classes.closeIcon} onClick={onClickCloseSidebar}>
            <CloseIcon />
          </IconButton>
        )}
        <div style={classes.searchContainer}>
          <HpSearchInput
            placeholder={t("header.search")}
            onChange={(e) => handleFilterChange(e)}
            value={filter || ""}
            variant="outlined"
          />
        </div>
        {isHaveDeleteIcon ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <List
                  style={classes.listContainer}
                  component="nav"
                  aria-label="main mailbox folders"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="custom-scrollbar"
                >
                  {filteredList().map((item, index) => (
                    <Draggable
                      key={item.value}
                      draggableId={item.value}
                      index={index}
                    >
                      {(provided) => (
                        <HpListButton
                          selected={item?.value === selectedItem}
                          onClick={() => onSelect(item?.value)}
                          style={
                            isHaveDeleteIcon
                              ? classes.deleteButtonDirection
                              : undefined
                          }
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            style={{
                              ...adaptPaddingLeft(t("direction"), 10),
                            }}
                          >
                            <SortIcon />
                          </div>

                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            width={"100%"}
                            sx={{ flexGrow: 1 }}
                          >
                            <ListItemText
                              primary={item.text}
                              sx={{
                                margin: 0,
                                "& .MuiTypography-root": {
                                  fontFamily: "'Forma DJR UI', sans-serif",
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  lineHeight: "20px",
                                  color:
                                    item?.value === selectedItem
                                      ? "#001CB0"
                                      : "#1A1A1A",
                                },
                              }}
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
                                    <span>
                                      {t("navigationButtons.duplicate")}
                                    </span>
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
                                      <span>
                                        {t("navigationButtons.delete")}
                                      </span>
                                    </div>
                                  </MenuItem>
                                )}
                              </OptionsButton>
                            )}
                          </Stack>
                          {renderIcon(item, item?.value === selectedItem) && (
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              {renderIcon(item, item?.value === selectedItem)}
                            </ListItemIcon>
                          )}
                        </HpListButton>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <List
            style={classes.listContainer}
            component="nav"
            aria-label="main mailbox folders"
            className="custom-scrollbar"
          >
            {filteredList().map((item) => {
              return (
                <HpListButton
                  key={item.value}
                  selected={item?.value === selectedItem}
                  onClick={() => onSelect(item?.value)}
                  style={
                    isHaveDeleteIcon ? classes.deleteButtonDirection : undefined
                  }
                >
                  {renderIcon(item, item?.value === selectedItem) && (
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      {renderIcon(item, item?.value === selectedItem)}
                    </ListItemIcon>
                  )}
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    width={"100%"}
                    sx={{ flexGrow: 1 }}
                  >
                    <ListItemText
                      primary={item.text}
                      sx={{
                        margin: 0,
                        "& .MuiTypography-root": {
                          fontFamily: "'Forma DJR UI', sans-serif",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "20px",
                          color:
                            item?.value === selectedItem
                              ? "#001CB0"
                              : "#1A1A1A",
                        },
                      }}
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
                </HpListButton>
              );
            })}
          </List>
        )}
        {!!children && <div style={classes.buttonWrapper}>{children}</div>}
      </Box>
    </>
  );
};

export { HpSideList };
