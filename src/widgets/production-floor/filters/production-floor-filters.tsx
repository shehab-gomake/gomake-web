import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Paper,
  MenuItem,
  CircularProgress,
  ClickAwayListener,
  Select,
  FormControl,
} from "@mui/material";
import { Permissions } from "@/components/CheckPermission/enum";
import { useProductionFloorFilters } from "@/widgets/production-floor/filters/use-production-floor-filters";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { filtersInputs } from "@/widgets/production-floor/filters/filters-inputs";
import { styled } from "@mui/system";
import { FONT_FAMILY } from "@/utils/font-family";
import { fetchS3JsonContent } from "@/utils/S3Content";
import { IFilterGroupsList } from "../interfaces/borad-missions-filter-groups";
import { useStyle } from "./style";
import { useRouter } from "next/router";
import { GoMakeDeleteModal, GoMakeMenu } from "@/components";
import { ModalType } from "@/enums";
import { Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { useRecoilState } from "recoil";
import {
  filterGroupsState,
  patternSearchState,
} from "@/widgets/production-floor/state/filter-group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ModalFilters } from "./modal-filters";
import { useUserPermission } from "@/hooks/use-permission";
import { ModalEditGroup } from "./edit-group-modal";
import { AgentsList } from "@/widgets/agents/agents-list";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { EProductionFloorView } from "../state/production-floor-view";
import { useDebounce } from "@/utils/use-debounce";

interface GroupDropdownComponentProps {
  filterGroups: IFilterGroupsList[];
  selectedGroupId: string;
  handleSelectGroup: (groupId: string) => void;
  handleClickMenu: (e: React.MouseEvent<HTMLElement>) => void;
  setSelectedGroup: (group: any) => void;
  onClickOpenModalEditGroup: () => void;
  dir?: string;
  t?: any;
}

const ScrollableDiv = styled("div")(({ theme }) => ({
  maxHeight: "35vh",
  overflowY: "auto",
  overflowX: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "white",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#EAECF0",
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#b0b0b0",
  },
  "&::-webkit-scrollbar-button": {
    display: "none",
  },
}));

const GroupDropdown = styled(FormControl)<{ dir?: string }>(
  ({ theme, dir }) => ({
    minWidth: "200px",
    // border: "1px solid #d0d5dd",
    // borderRadius: "8px",
    "& .MuiOutlinedInput-root": {
      height: "35px",
      borderRadius: "4px",
      "& fieldset": {
        borderColor: "#EAECF0",
      },
      "&:hover fieldset": {
        borderColor: "#2E3092",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2E3092",
      },
    },
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      ...FONT_FAMILY.Inter(400, 14),
    },
    "& .MuiSelect-icon": {
      ...(dir === "rtl" && {
        right: "auto",
        left: "7px",
      }),
    },
    "& .MuiInputBase-input": {
      ...(dir === "rtl" && {
        paddingLeft: "32px",
        paddingRight: "12px !important",
      }),
    },
  })
);

const ColorIndicator = styled(Box)<{ color: string }>(({ color }) => ({
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: color,
  flexShrink: 0,
}));

const GroupMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  minHeight: "40px",
  "&:hover": {
    backgroundColor: "#F8F8F8",
  },
}));

const GroupDropdownComponent = ({
  filterGroups,
  selectedGroupId,
  handleSelectGroup,
  handleClickMenu,
  setSelectedGroup,
  onClickOpenModalEditGroup,
  dir,
  t,
}: GroupDropdownComponentProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedGroup = filterGroups.find(
    (group) => group.id === selectedGroupId
  );

  const handleDropdownChange = (event: any) => {
    const value = event.target.value;
    if (value === "new-group") {
      onClickOpenModalEditGroup();
    } else {
      handleSelectGroup(value);
    }
    setDropdownOpen(false);
  };

  const handleMenuClick = (
    e: React.MouseEvent<HTMLElement>,
    group: IFilterGroupsList
  ) => {
    e.stopPropagation();
    handleClickMenu(e);
    setSelectedGroup({
      id: group.id,
      name: group.name,
      inProcessCount: group.inProcessCount || 0,
      stuckCount: group.stuckCount || 0,
      color: group.color || "#7355de",
    });
  };

  return (
    <GroupDropdown dir={dir}>
      <Select
        value={selectedGroupId || ""}
        onChange={handleDropdownChange}
        open={dropdownOpen}
        onOpen={() => setDropdownOpen(true)}
        onClose={() => setDropdownOpen(false)}
        displayEmpty
        renderValue={(selected) => {
          if (!selected || !selectedGroup) {
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{ color: "#9CA3AF", ...FONT_FAMILY.Inter(400, 15) }}
                >
                  {t("productionFloor.selectGroup")}
                </Typography>
              </Box>
            );
          }
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ColorIndicator color={selectedGroup.color || "#7355de"} />
              <Typography sx={{ ...FONT_FAMILY.Inter(400, 15) }}>
                {selectedGroup.name}
              </Typography>
            </Box>
          );
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: "300px",
              width: "250px",
              overflowY: "auto",
            },
            sx: {
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#c1c1c1",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#a8a8a8",
              },
            },
          },
        }}
      >
        {filterGroups.map((group) => (
          <GroupMenuItem key={group.id} value={group.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
              }}
            >
              <ColorIndicator color={group.color || "#7355de"} />
              <Typography sx={{ ...FONT_FAMILY.Inter(400, 14) }}>
                {group.name}
              </Typography>
            </Box>
            {group.id !== "all" && (
              <IconButton
                onClick={(e) => handleMenuClick(e, group)}
                size="small"
                sx={{ padding: "2px" }}
              >
                <MoreVertIcon
                  sx={{ fontSize: "16px", color: group.color || "#7355de" }}
                />
              </IconButton>
            )}
          </GroupMenuItem>
        ))}
      </Select>
    </GroupDropdown>
  );
};

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 600,
  },
});

const ProductionFloorFilters = ({
  getStationFilterGroups,
  connectionId,
  isMobile,
  view,
}) => {
  const { classes } = useStyle();
  const { push } = useRouter();
  const { tagsList } = filtersInputs();
  const [filterGroups, setFilterGroups] =
    useRecoilState<IFilterGroupsList[]>(filterGroupsState);
  const { CheckPermission } = useUserPermission();
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const {
    t,
    dir,
    onSelectDeliveryTimeDates,
    onSelectCreateDates,
    createDateFilter,
    deliveryDateFilter,
    isRTL,
    anchorElMenu,
    openMenu,
    handleClickMenu,
    handleCloseMenu,
    setMachinesColors,
    handleSelectGroup,
    selectedGroupId,
    missionsList,
    setMissionsList,
    filteredMissionsBySearch,
    isSearchLoading,
    setIsSearchLoading,
    openModal,
    handleDeleteConfirm,
    handleCancel,
    handleClearClick,
    selectedGroup,
    actions,
    setSelectedGroup,
    openModalDuplicateGroup,
    onClickOpenModalDuplicateGroup,
    onClickCloseModalDuplicateGroup,
    users,
    selectedUsers,
    handleSelectAllUsers,
    handleUserSelect,
    duplicateStationFilterByGroupId,
    openModalEditGroup,
    onClickOpenModalEditGroup,
    onClickCloseModalEditGroup,
    handleAgentChange,
    setFilters,
    searchInputFilterRef,
    getAllData,
    debouncedSearchValue,
    globalSearch,
    setGlobalSearch,
    localSearch,
    setLocalSearch,
    debouncedSearch,
  } = useProductionFloorFilters({
    getStationFilterGroups: getStationFilterGroups,
    connectionId: connectionId,
  });

  useEffect(() => {
    const fetchMachinesColors = async () => {
      try {
        const data = await fetchS3JsonContent("machinesColors.json");
        setMachinesColors(data);
      } catch (error) {
        console.error("Error fetching machines colors :", error);
      }
    };
    fetchMachinesColors();
  }, []);

  const getMissionsList = useCallback(() => {
    return missionsList;
  }, [missionsList]);

  const renderMenuItem = (option, handleClick) => (
    <MenuItem
      key={option?.id}
      sx={classes.missionRowStyle}
      onClick={() => handleClick(option?.id, option?.productType)}
    >
      <CustomWidthTooltip
        title={`${option?.boardMissionNumber}\\${option?.orderNumber} - ${option?.clientName}`}
        placement={isRTL ? "left" : "right"}
        arrow
      >
        <span style={classes.labelList}>
          {`${option?.boardMissionNumber}\\${option?.orderNumber} - ${option?.clientName}`}
        </span>
      </CustomWidthTooltip>
    </MenuItem>
  );

  const SearchMissionList = ({ missionsList, handleMissionClick }) => {
    return (
      <Paper elevation={3} sx={classes.paperStyle}>
        <ScrollableDiv>
          {missionsList?.map((option) =>
            renderMenuItem(option, handleMissionClick)
          )}
        </ScrollableDiv>
      </Paper>
    );
  };

  //!there is no productType
  const handleMissionClick = (id, productType) => {
    push(
      `/production-floor?boardMissionsId=${id}&step=stations&productType=${productType}`
    ).then(() => {
      setGlobalSearch("");
      setLocalSearch("");
      setMissionsList([]);
    });
  };

  const [isListOpen, setIsListOpen] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearchChange = useCallback((value) => {
    setLocalSearch(value); // Update local state immediately for fast UI
    if (value) {
      setIsSearchLoading(true);
    }
  }, []);

  useEffect(() => {
    setGlobalSearch(debouncedSearchValue);
    setIsSearchLoading(false);

    if (!debouncedSearchValue) {
      setIsListOpen(false);
      setMissionsList([]);
    } else {
      setIsListOpen(true);
      setMissionsList(getMissionsList());
    }
  }, [debouncedSearchValue, setGlobalSearch]);

  // React to debounced value changes
  useEffect(() => {
    // This runs 500ms after user stops typing
    setIsSearchLoading(false);

    if (!debouncedSearchValue) {
      setIsListOpen(false);
      setMissionsList([]);
    } else {
      setIsListOpen(true);
      setMissionsList(getMissionsList());
    }
  }, [debouncedSearchValue]);

  const [patternSearch, setPatternSearch] =
    useRecoilState<any>(patternSearchState);
  const debouncedPatternSearch = useDebounce(patternSearch, 500);

  const onChangeMissionsSearch = (value: string) => {
    setPatternSearch(value);
  };

  useEffect(() => {
    if (view === EProductionFloorView.DONE_JOBS) {
      if (debouncedPatternSearch && debouncedPatternSearch.trim() !== "") {
        getAllData(1, 10, debouncedPatternSearch);
      } else {
        getAllData(1, 10);
      }
    }
  }, [debouncedPatternSearch]);

  return (
    <Stack style={classes.headerFilterContainer}>
      <ClickAwayListener
        onClickAway={(event) => {
          if (
            searchInputRef.current &&
            searchInputRef.current.contains(event.target)
          ) {
            return;
          }
          setIsListOpen(false);
        }}
      >
        <Stack>
          <div ref={searchInputRef}>
            {view === EProductionFloorView.DONE_JOBS && (
              <SearchInputComponent
                bgColor={"#F8F8F8"}
                onChange={onChangeMissionsSearch}
                value={patternSearch}
                inputRef={searchInputFilterRef}
                filtersButton={
                  isSearchLoading && (
                    <CircularProgress
                      color="inherit"
                      size={20}
                      sx={{ ml: 2 }}
                    />
                  )
                }
              />
            )}
            {view !== EProductionFloorView.DONE_JOBS && (
              <SearchInputComponent
                bgColor={"#F8F8F8"}
                value={localSearch} // Use local state for immediate updates
                onChange={handleSearchChange}
                filtersButton={
                  isSearchLoading && (
                    <CircularProgress
                      color="inherit"
                      size={20}
                      sx={{ ml: 2 }}
                    />
                  )
                }
              />
            )}
          </div>
          {getMissionsList().length !== 0 &&
            isListOpen &&
            view !== EProductionFloorView.DONE_JOBS && (
              <SearchMissionList
                missionsList={getMissionsList()}
                handleMissionClick={handleMissionClick}
              />
            )}
        </Stack>
      </ClickAwayListener>
      {CheckPreferenceValue(EPreferences.SHOW_AGENT_IN_PRODUCTION_FLOOR) &&
        view !== EProductionFloorView.DONE_JOBS && (
          <AgentsList onClickApply={handleAgentChange} applyButton={true} />
        )}
      {view !== EProductionFloorView.DONE_JOBS && (
        <GoMakeDatepicker
          value={deliveryDateFilter}
          onChange={onSelectDeliveryTimeDates}
          placeholder={t("sales.quote.deliveryDate")}
        />
      )}
      {view !== EProductionFloorView.DONE_JOBS && (
        <GoMakeDatepicker
          value={createDateFilter}
          onChange={onSelectCreateDates}
          placeholder={t("productionFloor.createTime")}
        />
      )}
      <Box sx={{ flexGrow: 1 }} />

      <GroupDropdownComponent
        filterGroups={filterGroups}
        selectedGroupId={selectedGroupId}
        handleSelectGroup={handleSelectGroup}
        handleClickMenu={handleClickMenu}
        setSelectedGroup={setSelectedGroup}
        onClickOpenModalEditGroup={onClickOpenModalEditGroup}
        dir={dir}
        t={t}
      />
      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        openModal={openModal}
        onClose={handleCancel}
        onClickDelete={handleDeleteConfirm}
        onClickCancel={handleCancel}
        style={{
          width: "90vw",
          maxWidth: 600,
          minWidth: "unset",
        }}
      />
      <GoMakeMenu
        handleClose={handleCloseMenu}
        open={openMenu}
        anchorEl={anchorElMenu}
      >
        {CheckPermission(Permissions.IS_CAN_SHARE_GROUP) && (
          <MenuItem onClick={onClickOpenModalDuplicateGroup}>
            <div>{t("productionFloor.copyToUsers")}</div>
          </MenuItem>
        )}
        <MenuItem onClick={onClickOpenModalEditGroup}>
          <div>{t("navigationButtons.edit")}</div>
        </MenuItem>

        <MenuItem
          onClick={(event) => {
            event.stopPropagation();
            handleClearClick(selectedGroup?.id);
            handleCloseMenu();
          }}
        >
          <div>{t("navigationButtons.delete")}</div>
        </MenuItem>
      </GoMakeMenu>
      <ModalFilters
        openModalDuplicateGroup={openModalDuplicateGroup}
        onClickCloseModalDuplicateGroup={onClickCloseModalDuplicateGroup}
        handleCloseMenu={handleCloseMenu}
        selectedUsers={selectedUsers}
        users={users}
        handleSelectAllUsers={handleSelectAllUsers}
        handleUserSelect={handleUserSelect}
        duplicateStationFilterByGroupId={duplicateStationFilterByGroupId}
      />

      <ModalEditGroup
        openModalEditGroup={openModalEditGroup}
        onClickCloseModalEditGroup={onClickCloseModalEditGroup}
        handleCloseMenu={handleCloseMenu}
        selectedGroupId={selectedGroup}
        actions={actions}
        getStationFilterGroups={getStationFilterGroups}
        setFilters={setFilters}
      />
    </Stack>
  );
};

export { ProductionFloorFilters };
