import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  Menu,
  IconButton,
  Paper,
  MenuItem,
  CircularProgress,
  ClickAwayListener,
} from "@mui/material";
import { Permissions } from "@/components/CheckPermission/enum";
import { useProductionFloorFilters } from "@/widgets/production-floor/filters/use-production-floor-filters";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { filtersInputs } from "@/widgets/production-floor/filters/filters-inputs";
import { styled } from "@mui/system";
import { toRgba } from "@/utils/helpers";
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
import { adaptMarginLeft, adaptMarginRight } from "@/utils/adapter";

interface CustomGroupsProps {
  dir?: string;
  onClick: () => void;
  isSelected: boolean;
  onClickDelete: (v) => void;
  group: IFilterGroupsList;
  isFromMenu?: boolean;
  handleClickMenu?: (e: React.MouseEvent<HTMLElement>) => void;
  setSelectedGroup?: any;
  isDoneJobs?: boolean;
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

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  width: "35px",
  height: "35px",
  border: `1.5px solid #2E3092`,
  borderRadius: "4px",
  backgroundColor: toRgba("#2E3092", 0.1),
  "& .MuiSvgIcon-root": {
    color: "#2E3092",
  },
  "&:hover": {
    backgroundColor: toRgba("#2E3092", 0.1),
  },

  ...FONT_FAMILY.Inter(400, 16),
  color: toRgba("#2E3092", 0.9),
}));

const CustomGroup = styled(Card)<{
  isSelected?: boolean;
  color: string;
  isFromMenu: boolean;
}>(({ isSelected, color, isFromMenu }) => ({
  border: isSelected ? `none` : `1.5px solid ${color}`,
  backgroundColor: isSelected ? color : toRgba(color, 0.1),
  borderRadius: "4px",
  transition: "background-color 0.3s ease, border 0.3s ease",
  cursor: "pointer",
  boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
  padding: "0px",
  height: "35px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: isFromMenu ? "100%" : "fit-content",
  maxWidth: "300px",
  "&:hover": {
    boxShadow: "0px 2px 4px rgba(16, 24, 40, 0.1)",
  },
}));

const CustomGroupComponent = ({
  onClick,
  onClickDelete,
  isSelected,
  group,
  dir,
  isFromMenu,
  handleClickMenu,
  setSelectedGroup,
  isDoneJobs,
}: CustomGroupsProps) => {
  // Format time as HH:MM (input is already in minutes)
  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate sum of both old numbers
  const totalCount = (group?.inProcessCount || 0) + (group?.stuckCount || 0);

  return (
    <CustomGroup
      onClick={onClick}
      isSelected={isSelected}
      color={group?.color}
      isFromMenu={isFromMenu}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "space-between",
          padding: dir === "rtl" ? "0px 8px !important" : "0px 8px !important",
          width: "100%",
        }}
      >
        {/* First Box - Group Name */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: "1 1 auto",
            minWidth: 0,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: isSelected ? "#FFF" : group?.color,
              ...FONT_FAMILY.Inter(400, 14),
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {group?.name}
          </Typography>
        </Box>

        {!isDoneJobs && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {/* <Typography
              variant="caption"
              sx={{
                color: isSelected ? "#FFF" : group?.color,
                ...FONT_FAMILY.Inter(500, 12),
                fontFamily: "monospace",
                minWidth: "fit-content",
                ...adaptMarginLeft(dir, 1),
              }}
            >
              |
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isSelected ? "#FFF" : group?.color,
                ...FONT_FAMILY.Inter(500, 12),
                fontFamily: "monospace",
                minWidth: "fit-content",
                ...adaptMarginLeft(dir, 1),
              }}
            >
              {formatTime(group?.inProcessTotalProductionTime)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isSelected ? "#FFF" : group?.color,
                ...FONT_FAMILY.Inter(600, 12),
                backgroundColor: isSelected
                  ? "rgba(255,255,255,0.2)"
                  : `${group?.color}15`,
                borderRadius: "12px",
                padding: "2px 6px",
                minWidth: "fit-content",
                textAlign: "center",
                border: isSelected
                  ? "1px solid rgba(255,255,255,0.3)"
                  : `1px solid ${group?.color}30`,
              }}
            >
              {totalCount}
            </Typography> */}
            {group.id !== "all" && (
              <IconButton
                onClick={(e) => {
                  handleClickMenu(e);
                  setSelectedGroup(group);
                }}
                size="small"
                style={{
                  padding: "2px",
                  cursor: "pointer",
                  ...adaptMarginRight(dir, 1),
                }}
              >
                <MoreVertIcon
                  style={{
                    cursor: "pointer",
                    fontSize: "16px",
                    color: isSelected ? "#FFF" : group?.color,
                  }}
                />
              </IconButton>
            )}
          </Box>
        )}
      </CardContent>
    </CustomGroup>
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
  const [containerWidth, setContainerWidth] = useState(0);
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
    handleMoreClick,
    handleClose,
    anchorEl,
    anchorElMenu,
    openMenu,
    handleClickMenu,
    handleCloseMenu,
    setMachinesColors,
    scrollContainerRef,
    visibleFilterGroups,
    setVisibleFilterGroups,
    hiddenFilterGroups,
    setHiddenFilterGroups,
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

  useEffect(() => {
    const updateContainerWidth = () => {
      if (scrollContainerRef.current) {
        // setContainerWidth(scrollContainerRef.current.clientWidth );
        setContainerWidth(
          scrollContainerRef.current.clientWidth + (isMobile ? 100 : 300)
        );
      }
    };
    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, [isMobile]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      let totalWidth = 0;
      const visible: IFilterGroupsList[] = [];
      const hidden: IFilterGroupsList[] = [];

      filterGroups.forEach((item) => {
        const {
          id = "Unknown ID",
          name = "Unknown Name",
          inProcessCount = 0,
          stuckCount = 0,
          color = "#7355de",
          inProcessTotalProductionTime = 0,
        } = item;

        const cardWidth = 300;

        totalWidth += cardWidth;

        if (totalWidth <= containerWidth) {
          visible.push({
            id,
            name,
            inProcessCount,
            stuckCount,
            color,
            inProcessTotalProductionTime,
          });
        } else {
          hidden.push({
            id,
            name,
            inProcessCount,
            stuckCount,
            color,
            inProcessTotalProductionTime,
          });
        }
      });

      setVisibleFilterGroups(visible);
      setHiddenFilterGroups(hidden);
    }
  }, [filterGroups, containerWidth]);

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
      <Box ref={scrollContainerRef} sx={classes.filtersCardBox}>
        {visibleFilterGroups?.map((group, index) => (
          <CustomGroupComponent
            dir={dir}
            key={"visibleGroup" + index}
            group={group}
            onClick={() => handleSelectGroup(group?.id)}
            onClickDelete={(event) => {
              event.stopPropagation();
              handleClearClick(group?.id);
            }}
            isSelected={selectedGroupId === group?.id ? true : false}
            isFromMenu={false}
            handleClickMenu={handleClickMenu}
            setSelectedGroup={setSelectedGroup}
            isDoneJobs={group?.id === "doneJobs"}
          />
        ))}
        {hiddenFilterGroups.length > 0 && (
          <>
            <CustomIconButton onClick={handleMoreClick}>
              {/* <MoreHorizIcon /> */}+{hiddenFilterGroups.length}
            </CustomIconButton>
            <Menu
              transformOrigin={{
                horizontal: isRTL ? "left" : "right",
                vertical: "top",
              }}
              anchorOrigin={{
                horizontal: isRTL ? "left" : "right",
                vertical: "bottom",
              }}
              PaperProps={{
                style: {
                  marginTop: 8,
                  padding: "0px 8px",
                  maxHeight: "438px",
                  zIndex: 1300,
                },
              }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Stack spacing={1}>
                {hiddenFilterGroups?.map((group, index) => (
                  <CustomGroupComponent
                    dir={dir}
                    key={"hiddenGroup" + index}
                    group={group}
                    onClick={() => handleSelectGroup(group?.id)}
                    onClickDelete={(event) => {
                      event.stopPropagation();
                      handleClearClick(group?.id);
                    }}
                    isSelected={selectedGroupId === group?.id ? true : false}
                    isFromMenu={true}
                    handleClickMenu={handleClickMenu}
                    setSelectedGroup={setSelectedGroup}
                    isDoneJobs={group?.id === "doneJobs"}
                  />
                ))}
              </Stack>
            </Menu>
          </>
        )}
      </Box>
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
