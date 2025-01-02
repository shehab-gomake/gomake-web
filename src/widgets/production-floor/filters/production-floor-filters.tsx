import { useCallback, useEffect, useState } from "react";
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
} from "@mui/material";
import { useProductionFloorFilters } from "@/widgets/production-floor/filters/use-production-floor-filters";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { filtersInputs } from "@/widgets/production-floor/filters/filters-inputs";
import { SelectComponent } from "@/widgets/production-floor/filters/select/select-component";
import { styled } from "@mui/system";
import { toRgba } from "@/utils/helpers";
import { FONT_FAMILY } from "@/utils/font-family";
import { fetchS3JsonContent } from "@/utils/S3Content";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IFilterGroupsList } from "../interfaces/borad-missions-filter-groups";
import ClearIcon from "@mui/icons-material/Clear";
import { useStyle } from "./style";
import { useRouter } from "next/router";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";
import { Tooltip, tooltipClasses, TooltipProps } from "@mui/material";

interface CustomGroupsProps {
  dir?: string;
  onClick: () => void;
  isSelected: boolean;
  onClickDelete: (v) => void;
  group: IFilterGroupsList;
  isFromMenu?: boolean;
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
  maxWidth: "250px",
  "&:hover": {
    boxShadow: "0px 2px 4px rgba(16, 24, 40, 0.1)",
  },
}));

const Circle = styled(Box)<{ numColor: string; dir: string }>(
  ({ numColor, dir }) => ({
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginLeft: dir === "rtl" ? 0 : 4,
    marginRight: dir === "rtl" ? 4 : 0,
    fontSize: 12,
    fontWeight: 600,
    color: numColor,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  })
);

const IconButtonWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  "& .clear-icon": {
    visibility: "hidden",
    opacity: 0,
    transition: "visibility 0.2s, opacity 0.2s",
  },
  "&:hover .clear-icon": {
    visibility: "visible",
    opacity: 1,
  },
});

const CustomGroupComponent = ({
  onClick,
  onClickDelete,
  isSelected,
  group,
  dir,
  isFromMenu,
}: CustomGroupsProps) => {
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: isSelected ? "#FFF" : group?.color,
              ...FONT_FAMILY.Inter(400, 14),
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {group?.name}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Circle numColor="#E7D000" dir={dir}>
            {group?.inProcessCount}
          </Circle>
          <Circle numColor="#D92D20" dir={dir}>
            {group?.stuckCount}
          </Circle>
          <Circle
            numColor={group?.color}
            dir={dir}
            sx={{
              backgroundColor: "transparent",
            }}
          >
            <IconButton
              onClick={onClickDelete}
              size="small"
              style={{
                padding: "4px",
              }}
            >
              <ClearIcon
                className="clear-icon"
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  color: isSelected ? "#FFF" : group?.color,
                }}
              />
            </IconButton>
          </Circle>
        </Box>
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

const ProductionFloorFilters = ({ filterGroups, getStationFilterGroups }) => {
  const { classes } = useStyle();
  const { push } = useRouter();
  const { tagsList } = filtersInputs();
  const [containerWidth, setContainerWidth] = useState(0);
  const {
    t,
    dir,
    search,
    setSearch,
    onTagsChange,
    onSelectDeliveryTimeDates,
    onSelectCreateDates,
    createDateFilter,
    deliveryDateFilter,
    isRTL,
    handleMoreClick,
    handleClose,
    anchorEl,
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
    openModal,
    handleDeleteConfirm,
    handleCancel,
    handleClearClick,
  } = useProductionFloorFilters({ getStationFilterGroups });

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
        setContainerWidth(scrollContainerRef.current.clientWidth + 300);
      }
    };
    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

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
        } = item;

        const cardWidth = 240;

        totalWidth += cardWidth;

        if (totalWidth <= containerWidth) {
          visible.push({ id, name, inProcessCount, stuckCount, color });
        } else {
          hidden.push({ id, name, inProcessCount, stuckCount, color });
        }
      });

      setVisibleFilterGroups(visible);
      setHiddenFilterGroups(hidden);
    }
  }, [filterGroups, containerWidth]);

  const getMissionsList = useCallback(() => {
    return missionsList.length > 0 ? missionsList : [];
  }, [missionsList]);

  const renderMenuItem = (option, handleClick) => (
    <MenuItem
      key={option?.id}
      sx={classes.missionRowStyle}
      onClick={() => handleClick(option?.id)}
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

  const SearchMissionList = ({ missionsList, handleMissionClick }) => (
    <Paper elevation={3} sx={classes.paperStyle}>
      <ScrollableDiv>
        {missionsList?.map((option) =>
          renderMenuItem(option, handleMissionClick)
        )}
      </ScrollableDiv>
    </Paper>
  );

  const handleMissionClick = (id) => {
    push(`/production-floor?boardMissionsId=${id}&step=stations`).then(() => {
      setSearch("");
      setMissionsList([]);
    });
  };

  return (
    <Stack style={classes.headerFilterContainer}>
      <Stack>
        <SearchInputComponent
          bgColor={"#F8F8F8"}
          value={search}
          onChange={setSearch}
          filtersButton={
            isSearchLoading && (
              <CircularProgress color="inherit" size={20} sx={{ ml: 2 }} />
            )
          }
        />
        {filteredMissionsBySearch?.length === 0 &&
          getMissionsList().length !== 0 && (
            <SearchMissionList
              missionsList={getMissionsList()}
              handleMissionClick={handleMissionClick}
            />
          )}
      </Stack>
      <SelectComponent
        buttonLabel={"productionFloor.tags"}
        list={tagsList}
        onChange={onTagsChange}
      />
      <GoMakeDatepicker
        value={deliveryDateFilter}
        onChange={onSelectDeliveryTimeDates}
        placeholder={t("productionFloor.deliveryTime")}
      />
      <GoMakeDatepicker
        value={createDateFilter}
        onChange={onSelectCreateDates}
        placeholder={t("productionFloor.createTime")}
      />
      <Box ref={scrollContainerRef} sx={classes.filtersCardBox}>
        {visibleFilterGroups?.map((group, index) => (
          <CustomGroupComponent
            dir={dir}
            key={index}
            group={group}
            onClick={() => handleSelectGroup(group?.id)}
            onClickDelete={(event) => {
              event.stopPropagation();
              handleClearClick(group?.id);
            }}
            isSelected={selectedGroupId === group?.id ? true : false}
            isFromMenu={false}
          />
        ))}
        {hiddenFilterGroups.length > 0 && (
          <>
            <CustomIconButton onClick={handleMoreClick}>
              {/* <MoreHorizIcon /> */}
              +1
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
                    key={index}
                    group={group}
                    onClick={() => handleSelectGroup(group?.id)}
                    onClickDelete={(event) => {
                      event.stopPropagation();
                      handleClearClick(group?.id);
                    }}
                    isSelected={selectedGroupId === group?.id ? true : false}
                    isFromMenu={true}
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
      />
    </Stack>
  );
};

export { ProductionFloorFilters };
