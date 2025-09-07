import { useEffect, useMemo } from "react";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
import { useGantt } from "@/widgets/production-floor/views/gantt-view/use-gantt";
import { useRescheduling } from "@/hooks";
import Stack from "@mui/material/Stack";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { JobComponent } from "@/widgets/production-floor/views/gantt-view/job-component";
import moment from "moment";
import { FONT_FAMILY } from "@/utils/font-family";
import {
  Badge,
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useStyle } from "./style";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import BoltIcon from "@mui/icons-material/Bolt";
import EventIcon from "@mui/icons-material/Event";
import { TimeFrameTabs } from "./state";
import { adaptPaddingLeft, adaptPaddingRight } from "@/utils/adapter";

const TimelineWidget = () => {
  const { classes } = useStyle();

  // Initialize rescheduling hook at component level
  const reschedulingHook = useRescheduling();

  const {
    t,
    groups,
    items,
    timeRange,
    openGroups,
    getData,
    handleItemResize,
    handleItemMove,
    currentMonth,
    toggleGroup,
    handleZoom,
    onTimeChange,
    visibleTimeRange,
    handleClickZoom,
    activeTab,
    handleItemSelect,
    handleItemDeselect,
    currentDate,
    getDateLabel,
    navigateTimeline,
    handleTabChange,
    timeFrameTabs,
    scrollTimeline,
    dir,
  } = useGantt(reschedulingHook);

  // Extract rescheduling functionality
  const {
    hasLocalChanges,
    submitRescheduleActions,
    isSubmitting,
    clearAllLocalChanges,
  } = reschedulingHook;

  useEffect(() => {
    getData(currentMonth.clone().month());
  }, [currentMonth.valueOf()]);

  const getGroupColor = (title: string) => {
    // Generate a consistent color based on the title string hash
    // This ensures the same title always gets the same color without hardcoding
    const colors = [
      "#007BFF", // Blue
      "#28A745", // Green
      "#FD7E14", // Orange
      "#DC3545", // Red
      "#6F42C1", // Purple
      "#20C997", // Teal
      "#FF9800", // Amber
      "#795548", // Brown
      "#9C27B0", // Deep Purple
      "#607D8B", // Blue Grey
      "#E91E63", // Pink
      "#00BCD4", // Cyan
    ];

    // Create a simple hash from the title string
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      const char = title.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use the hash to select a color
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  const getGroupStats = (groupId: string) => {
    const groupItems = items.filter((item) => item.group === groupId);
    const totalJobs = groupItems.length; //!here fix this
    const completedJobs = groupItems.filter(
      (item) => item.statusColor === "#28A745"
    ).length;
    const inProgressJobs = groupItems.filter(
      (item) => item.statusColor === "#FD7E14"
    ).length;
    const pendingJobs = groupItems.filter(
      (item) => item.statusColor === "#DC3545"
    ).length;

    return { totalJobs, completedJobs, inProgressJobs, pendingJobs };
  };

  const getStationStats = (stationId: string) => {
    const stationItems = items.filter((item) => item.group === stationId);
    return stationItems.length;
  };

  const filteredGroups = useMemo(() => {
    return groups
      .filter(
        (group) =>
          group.isRoot ||
          openGroups[group.parent] ||
          items.some(
            (item) =>
              item.group === group.id && item.isHasSelected && item.selected
          )
      )
      .map((group) => {
        const stats = getGroupStats(group.id);
        return {
          ...group,
          height: 50,
          title: group.isRoot ? (
            <Stack
              bgcolor={openGroups[group.id] ? "#F8F9FA" : "#FFF"}
              onClick={() => toggleGroup(group.id)}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                cursor: "pointer",
                padding: "8px 12px",
                // borderRadius: "8px",
                border: "1px solid #E9ECEF",
                ...FONT_FAMILY.Inter(600, 14),
                color: "#495057",
                "&:hover": {
                  backgroundColor: "#F8F9FA",
                  borderColor: getGroupColor(group.title),
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                {openGroups[group.id] ? (
                  <KeyboardArrowUpIcon
                    sx={{ color: "#6C757D", fontSize: 20 }}
                  />
                ) : (
                  <KeyboardArrowDownIcon
                    sx={{ color: "#6C757D", fontSize: 20 }}
                  />
                )}
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: getGroupColor(group.title),
                  }}
                />
                <Typography variant="body2" fontWeight={600}>
                  {group.title}
                </Typography>
                <Chip
                  label={groups.filter((g) => g.parent === group.id).length}
                  size="small"
                  sx={{
                    backgroundColor: getGroupColor(group.title),
                    color: "white",
                    fontSize: "11px",
                    height: "20px",
                    fontWeight: 600,
                  }}
                />
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                gap={1}
                height={"31px"}
              >
                {/* !here need to fix */}
                <Typography variant="caption" color="#6C757D" fontSize="11px">
                  {stats.totalJobs} jobs
                </Typography>
                {stats.inProgressJobs > 0 && (
                  <Badge
                    badgeContent={stats.inProgressJobs}
                    color="warning"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#FD7E14",
                        color: "white",
                        fontSize: "10px",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#FD7E14",
                      }}
                    />
                  </Badge>
                )}
              </Stack>
            </Stack>
          ) : (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                padding: "8px 12px 8px 32px",
                height: "50px", //!here new to hide or not
                backgroundColor: "#FFF",
                borderBottom: "1px solid #F1F3F4",
                ...FONT_FAMILY.Inter(500, 13),
                color: "#495057",
                "&:hover": {
                  backgroundColor: "#F8F9FA",
                },
                transition: "background-color 0.2s ease",
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                {group.title}
              </Typography>
              <Chip
                label={getStationStats(group.id)}
                size="small"
                sx={{
                  backgroundColor: "#E9ECEF",
                  color: "#495057",
                  fontSize: "11px",
                  height: "20px",
                  fontWeight: 600,
                }}
              />
            </Stack>
          ),
        };
      });
  }, [groups, openGroups, items]);

  useEffect(() => {
    let start, end;
    switch (activeTab) {
      case TimeFrameTabs.HOUR:
        start = currentDate.clone().startOf("hour");
        end = currentDate.clone().endOf("hour");
        break;
      case TimeFrameTabs.DAY:
        start = currentDate.clone().startOf("day");
        end = currentDate.clone().endOf("day");
        break;
      case TimeFrameTabs.WEEK:
        start = currentDate.clone().startOf("week");
        end = currentDate.clone().endOf("week");
        break;
      case TimeFrameTabs.MONTH:
        start = currentDate.clone().startOf("month");
        end = currentDate.clone().endOf("month");
        break;
      case TimeFrameTabs.YEAR:
        start = currentDate.clone().startOf("year");
        end = currentDate.clone().endOf("year");
        break;
      default:
        start = currentDate.clone().startOf("hour");
        end = currentDate.clone().endOf("hour");
    }

    onTimeChange(start.valueOf(), end.valueOf(), () => {});
    // setVisibleTimeRange({ start: start.valueOf(), end: end.valueOf() });
  }, [currentDate, activeTab]);

  return (
    <Stack gap={3} sx={classes.mainContainer}>
      {/* Time Frame Tabs */}
      <Box sx={classes.headerContainer}>
        <Stack sx={classes.headerContent}>
          {/* Date Selector */}
          <Stack sx={classes.dateSelector}>
            <IconButton
              onClick={() => navigateTimeline(-1)}
              size="small"
              sx={classes.dateSelectorButton}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>

            <Typography variant="body1" sx={classes.dateLabel}>
              {getDateLabel()}
            </Typography>

            <IconButton
              onClick={() => navigateTimeline(1)}
              size="small"
              sx={classes.dateSelectorButton}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </Stack>

          {/* Tabs */}
          <Stack direction="row" sx={classes.tabsContainer}>
            {timeFrameTabs.map((tab, index) => {
              // Get the appropriate icon for each tab
              const getTabIcon = (tabIndex: number) => {
                switch (tabIndex) {
                  case 0: // Hour
                    return <AccessTimeIcon sx={{ fontSize: "18px" }} />;
                  case 1: // Day
                    return <CalendarTodayIcon sx={{ fontSize: "18px" }} />;
                  case 2: // Week
                    return <ViewWeekIcon sx={{ fontSize: "18px" }} />;
                  case 3: // Month
                    return <CalendarMonthIcon sx={{ fontSize: "18px" }} />;
                  case 4: // Year
                    return <EventIcon sx={{ fontSize: "18px" }} />;
                  default:
                    return <CalendarTodayIcon sx={{ fontSize: "18px" }} />;
                }
              };

              return (
                <Button
                  key={index}
                  onClick={() => handleTabChange(index)}
                  variant="text"
                  startIcon={getTabIcon(index)}
                  sx={{
                    color: activeTab === index ? "#2e3092" : "white",
                    backgroundColor:
                      activeTab === index ? "white" : "transparent",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textTransform: "none",
                    minWidth: "auto",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor:
                        activeTab === index
                          ? "white"
                          : "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-1px)",
                    },
                    "& .MuiButton-startIcon": {
                      marginRight: "8px",
                    },
                    "& .MuiSvgIcon-root": {
                      color: activeTab === index ? "#2e3092" : "white",
                    },
                  }}
                >
                  {tab.title}
                </Button>
              );
            })}
          </Stack>

          <Stack direction="row" gap={1}>
            <Button
              variant="contained"
              startIcon={<BoltIcon />}
              disabled={!hasLocalChanges() || isSubmitting}
              onClick={async () => {
                const success = await submitRescheduleActions();
                if (success) {
                  // Success: refresh the data
                  getData(currentMonth.clone().month());
                } else {
                  // Failure: revert to original state and clear local changes
                  getData(currentMonth.clone().month()); // Refresh to get original data
                  clearAllLocalChanges(); // Clear the local changes payload
                }
              }}
              sx={{
                backgroundColor: "#FD7E14",
                "&:hover": { backgroundColor: "#E8690B" },
                "&:disabled": {
                  backgroundColor: "#ccc",
                  color: "#666",
                },
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {isSubmitting ? "Submitting..." : "Re-Schedule"}
            </Button>
          </Stack>
        </Stack>
      </Box>

      <div style={{ position: "relative", direction: "ltr" }}>
        <Stack
          alignItems="center"
          direction="row"
          position="absolute"
          right="0px"
          top="0px"
          zIndex={99999}
          height="60px"
          sx={{
            background: "#fff",
            borderRadius: "8px",
            padding: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <IconButton onClick={() => scrollTimeline("right")}>
            <ChevronRightIcon />
          </IconButton>
          <Stack padding={"0px 8px 0px 0px"} gap={"5px"}>
            <AddIcon
              onClick={() => handleClickZoom("in")}
              style={{ height: "20px", width: "20px", cursor: "pointer" }}
            />
            <RemoveIcon
              onClick={() => handleClickZoom("out")}
              style={{ height: "20px", width: "20px", cursor: "pointer" }}
            />
          </Stack>
        </Stack>
        <Timeline
          groups={
            filteredGroups.length > 0
              ? filteredGroups
              : [
                  {
                    id: "empty",
                    title: (
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#7A7A7A",
                          textAlign: "center",
                          padding: "0px 10px",
                          borderRadius: "8px",
                        }}
                      >
                        {t("productionFloor.noGroupsAvailable")}
                      </div>
                    ),
                  },
                ]
          }
          items={items.filter((item) => {
            const isGroupOpen = openGroups[item.group];
            return isGroupOpen ? item.isEditable : true;
          })}
          defaultTimeStart={timeRange.defaultTimeStart}
          defaultTimeEnd={timeRange.defaultTimeEnd}
          sidebarWidth={240}
          onItemMove={handleItemMove}
          onItemResize={handleItemResize}
          onZoom={handleZoom}
          canResize={"right"}
          canChangeGroup={true}
          itemRenderer={(props) => {
            return <JobComponent {...props} toggleGroup={toggleGroup} />;
          }}
          onTimeChange={onTimeChange}
          visibleTimeStart={visibleTimeRange.start}
          visibleTimeEnd={visibleTimeRange.end}
          onItemSelect={handleItemSelect}
          onItemDeselect={handleItemDeselect}
          selected={items.filter((item) => !!item.selected).map((i) => i.id)}
          dragSnap={1000 * 60}
          // !here new
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <TimelineHeaders style={{ ...FONT_FAMILY.Inter(500, 12) }}>
            <SidebarHeader>
              {({ getRootProps }) => {
                return (
                  <Box
                    {...getRootProps()}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "280px",
                      ...adaptPaddingRight(dir, 3),
                      backgroundColor: "#F8F9FA",
                      // borderBottom: "2px solid #E9ECEF", //!here
                      ...FONT_FAMILY.Inter(600, 14),
                      color: "#495057",
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t("productionFloor.stations")}
                    </Typography>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      style={{
                        height: "60px",
                        right: 0,
                        pointerEvents: "auto",
                        zIndex: 10,
                        background: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <IconButton onClick={() => scrollTimeline("left")}>
                        <KeyboardArrowLeftIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                );
              }}
            </SidebarHeader>
            {/* this the header that top of hours,days, etc..  */}
            <DateHeader unit="primaryHeader" />
            <DateHeader
              labelFormat={([start, end], unit) => {
                const momentStart = moment(start);
                switch (unit) {
                  case "year":
                    return `${start?.getFullYear()}`;
                  case "month":
                    return `${momentStart?.format("MMMM")}`;
                  case "day":
                    return `${momentStart?.format("DD")}`;
                  case "hour":
                    // return `${momentStart?.format("hh:mm A")}`;
                    return `${momentStart.format("ha")}`; // <-- Simplified format here
                  case "minute":
                    return `${momentStart?.format("mm")}`;
                  default:
                    return "";
                }
              }}
            />
          </TimelineHeaders>
        </Timeline>
      </div>
    </Stack>
  );
};

export { TimelineWidget };
