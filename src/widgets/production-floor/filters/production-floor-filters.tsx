import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  Menu,
  IconButton,
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
import { useRecoilState } from "recoil";
import { productionFloorFiltersState } from "../state/production-floor-filters";

interface CustomCardProps {
  label: string;
  machineId?: string;
  onClick?: () => void;
  isSelected?: boolean;
  dir?: string;
  getColorByMachineId?: any;
  filters?: any;
}

interface CustomGroupsProps {
  dir?: string;
  onClick: () => void;
  isSelected: boolean;
  onClickDelete: (v) => void;
  group: IFilterGroupsList;
  isFromMenu?: boolean;
}

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  width: "30px",
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
}));

const CustomCard = styled(Card)<{ isSelected?: boolean; color: string }>(
  ({ isSelected, color }) => ({
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
    // width: 'fit-content',
    width: "100%",
    // important
    maxWidth: "250px",
    "&:hover": {
      boxShadow: "0px 2px 4px rgba(16, 24, 40, 0.1)",
    },
  })
);

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

const CustomCardComponent = ({
  label,
  onClick,
  isSelected,
  dir,
  machineId,
  getColorByMachineId,
  filters,
}: CustomCardProps) => {
  const machineStatus = filters.stations
    .flatMap((station) => station?.machineStatuses)
    .find((status) => status?.id === machineId);

  const inProcessCount = machineStatus?.inProcessCount || 0;
  const stuckCount = machineStatus?.stuckCount || 0;
  const color = getColorByMachineId(machineId);

  return (
    <CustomCard onClick={onClick} isSelected={isSelected} color={color}>
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px !important",
          width: "100%",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: isSelected ? "#FFF" : color,
            ...FONT_FAMILY.Inter(400, 14),
            // maxWidth: '170px',
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Circle numColor="#E7D000" dir={dir}>
            {inProcessCount}
          </Circle>
          <Circle numColor="#D92D20" dir={dir}>
            {stuckCount}
          </Circle>
        </Box>
      </CardContent>
    </CustomCard>
  );
};

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
          padding:
            dir === "ltr"
              ? "0px 5px 0px 0px !important"
              : "0px 0px 0px 5px !important",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={onClickDelete}>
            <ClearIcon
              style={{
                cursor: "pointer",
                fontSize: "14px",
                color: isSelected ? "#FFF" : group?.color,
              }}
            />
          </IconButton>
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
        <Box sx={{ display: "flex" }}>
          <Circle numColor="#E7D000" dir={dir}>
            {group?.inProcessCount}
          </Circle>
          <Circle numColor="#D92D20" dir={dir}>
            {group?.stuckCount}
          </Circle>
        </Box>
      </CardContent>
    </CustomGroup>
  );
};

const ProductionFloorFilters = ({ filterGroups, getStationFilterGroups }) => {
  const { classes } = useStyle();
  const { tagsList } = filtersInputs();
  const [containerWidth, setContainerWidth] = useState(0);
  const {
    t,
    dir,
    search,
    setSearch,
    filters,
    onTagsChange,
    onSelectDeliveryTimeDates,
    onSelectCreateDates,
    createDateFilter,
    deliveryDateFilter,
    isRTL,
    getColorByMachineId,
    handleMoreClick,
    handleChipClick,
    handleClose,
    anchorEl,
    visibleCards,
    hiddenCards,
    setMachinesColors,
    setVisibleCards,
    setHiddenCards,
    scrollContainerRef,
    selectedChips,
    visibleFilterGroups,
    setVisibleFilterGroups,
    hiddenFilterGroups,
    setHiddenFilterGroups,
    handleSelectGroup,
    selectedGroupId,
    deleteStationFilterGroupById,
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
        setContainerWidth(scrollContainerRef.current.clientWidth);
      }
    };
    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  // useEffect(() => {
  //   if (scrollContainerRef.current) {
  //     let totalWidth = 0;
  //     let visible: { label: string; machineId: string }[] = [];
  //     let hidden: { label: string; machineId: string }[] = [];

  //     actionsMachinesIds.forEach((item) => {
  //       const {
  //         actionName = "Unknown Action",
  //         machineIds = [],
  //         machineNames = [],
  //       } = item;

  //       machineNames.forEach((machineName, index) => {
  //         const cardWidth = 240;

  //         totalWidth += cardWidth;

  //         const cardLabel = `${actionName} | ${machineName}`;
  //         const machineId = machineIds[index];

  //         if (totalWidth <= containerWidth) {
  //           visible.push({ label: cardLabel, machineId: machineId || "" });
  //         } else {
  //           hidden.push({ label: cardLabel, machineId: machineId || "" });
  //         }
  //       });
  //     });

  //     setVisibleCards(visible);
  //     setHiddenCards(hidden);
  //   }
  // }, [actionsMachinesIds, containerWidth]);

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

  const [filtersState, setFiltersState] = useRecoilState(
    productionFloorFiltersState
  );

  return (
    <Stack style={classes.headerFilterContainer}>
      <SearchInputComponent
        bgColor={"#F8F8F8"}
        value={search}
        onChange={setSearch}
      />
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
        {/* {filterGroups?.length === 0 &&
          visibleCards?.map((card, index) => (
            <CustomCardComponent
              dir={dir}
              key={index}
              label={card.label}
              machineId={card.machineId}
              onClick={() => handleChipClick(card)}
              isSelected={selectedChips?.includes(card.label)}
              getColorByMachineId={getColorByMachineId}
              filters={filters}
            />
          ))} */}
        {/* {filterGroups?.length === 0 && hiddenCards.length > 0 && (
          <>
            <CustomIconButton onClick={handleMoreClick}>
              <MoreHorizIcon />
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
                sx: {
                  padding: "0px 8px",
                  maxHeight: "438px",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#ffffff",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#CCCDCF",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#888",
                  },
                },
              }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Stack spacing={1}>
                {hiddenCards?.map((card, index) => (
                  <CustomCardComponent
                    dir={dir}
                    key={index}
                    label={card.label}
                    machineId={card.machineId}
                    onClick={() => handleChipClick(card)}
                    isSelected={selectedChips?.includes(card.label)}
                    getColorByMachineId={getColorByMachineId}
                    filters={filters}
                  />
                ))}
              </Stack>
            </Menu>
          </>
        )} */}
        {visibleFilterGroups?.map((group, index) => (
          <CustomGroupComponent
            dir={dir}
            key={index}
            group={group}
            onClick={() => handleSelectGroup(group?.id)}
            onClickDelete={(event) => {
              event.stopPropagation();
              deleteStationFilterGroupById(group?.id);
            }}
            isSelected={selectedGroupId === group?.id ? true : false}
            isFromMenu={false}
          />
        ))}
        {hiddenFilterGroups.length > 0 && (
          <>
            <CustomIconButton onClick={handleMoreClick}>
              <MoreHorizIcon />
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
                      deleteStationFilterGroupById(group?.id);
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
    </Stack>
  );
};

export { ProductionFloorFilters };
