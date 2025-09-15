import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  CircularProgress,
  ClickAwayListener,
  MenuItem,
} from "@mui/material";
import { Permissions } from "@/components/CheckPermission/enum";
import { useProductionFloorFilters } from "@/widgets/production-floor/filters/use-production-floor-filters";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { filtersInputs } from "@/widgets/production-floor/filters/filters-inputs";
import { fetchS3JsonContent } from "@/utils/S3Content";
import { IFilterGroupsList } from "../interfaces/borad-missions-filter-groups";
import { useStyle } from "./style";
import { useRouter } from "next/router";
import { GoMakeDeleteModal, GoMakeMenu } from "@/components";
import { ModalType } from "@/enums";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  filterGroupsState,
  patternSearchState,
} from "@/widgets/production-floor/state/filter-group";
import { ModalFilters } from "./modal-filters";
import { useUserPermission } from "@/hooks/use-permission";
import { EditGroupModal } from "./components/edit-group-modal";
import { AgentsList } from "@/widgets/agents/agents-list";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { EProductionFloorView } from "../state/production-floor-view";
import { useDebounce } from "@/utils/use-debounce";
import { GroupDropdownComponent } from "./components/group-dropdown";
import { SearchMissionList } from "./components/search-mission-list";

const ProductionFloorFilters = ({
  getStationFilterGroups,
  connectionId,
  isMobile,
  view,
}) => {
  const { classes } = useStyle();
  const { push } = useRouter();
  const { tagsList } = filtersInputs();
  const filterGroups = useRecoilValue<IFilterGroupsList[]>(filterGroupsState);
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
      <EditGroupModal
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
