import { useEffect, useMemo, useState } from "react";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  TimelineMarkers,
  TodayMarker,
} from "react-calendar-timeline";
import { useGantt } from "@/widgets/production-floor/views/gantt-view/use-gantt";
import { useRescheduling, useRecoverOverdue } from "./hooks";
import { restoreOldBoardApi } from "@/services/api-service/jobs-time-line/jobs-time-line-endpoints";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
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
  CircularProgress,
  IconButton,
  Tooltip,
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
import EventIcon from "@mui/icons-material/Event";
import { TimeFrameTabs } from "./state";
import { ExpandCollapseControls } from "./components/expand-collapse-controls";
import { TimelineActionButtons } from "./components/timeline-action-buttons";
import {
  adaptLeft,
  adaptMarginLeft,
  adaptPaddingLeft,
  adaptPaddingRight,
  adaptRight,
} from "@/utils/adapter";
import { GoMakeDeleteModal } from "@/components/modal-deleted";
import { ModalType } from "@/enums";

const TimelineWidget = () => {
  const { classes } = useStyle();

  // Initialize rescheduling hook at component level
  const reschedulingHook = useRescheduling();

  // Initialize recover overdue hook
  const { recoverOverdue, isRecovering } = useRecoverOverdue();

  // Track if rescheduling was successful
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  // For restoreOldBoardApi
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

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
    expandAllGroups,
    collapseAllGroups,
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
    isRTL,
    showRecoverModal,
    setShowRecoverModal,
    showRescheduleModal,
    setShowRescheduleModal,
    isTimeLineLocked,
    primaryColor,
  } = useGantt(reschedulingHook);

  const {
    hasLocalChanges,
    submitRescheduleActions,
    isSubmitting,
    clearAllLocalChanges,
  } = reschedulingHook;

  // Reset rescheduleSuccess when new local changes are made
  useEffect(() => {
    if (hasLocalChanges() && rescheduleSuccess) {
      setRescheduleSuccess(false);
    }
  }, [hasLocalChanges, rescheduleSuccess]);

  // No need for this useEffect - getGanttData already handles initial load
  // useEffect(() => {
  //   getData(currentMonth.clone().month(), {
  //     stations: [],
  //     groupId: null,
  //   });
  // }, [currentMonth.valueOf()]);

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
    // Get all items in this group AND its children
    const groupItems = items.filter((item) => {
      // Exclude items that have group equal to root group IDs
      const isRootGroup = groups.find(
        (group) => group.isRoot && group.id === item.group
      );
      if (isRootGroup) return false;

      // Include items directly in this group
      if (item.group === groupId) return true;

      // Include items in child groups of this group
      const childGroups = groups.filter((group) => group.parent === groupId);
      return childGroups.some((childGroup) => item.group === childGroup.id);
    });

    const totalJobs = groupItems.length;
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
    // Get all items in this station AND its children
    const stationItems = items.filter((item) => {
      // Include items directly in this station
      if (item.group === stationId) return true;

      // Include items in child groups of this station
      const childGroups = groups.filter((group) => group.parent === stationId);
      return childGroups.some((childGroup) => item.group === childGroup.id);
    });

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
                <Tooltip
                  title={group.title}
                  arrow
                  disableHoverListener={group.title.length <= 10}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      maxWidth: "90px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {group.title}
                  </Typography>
                </Tooltip>
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
                <Typography variant="caption" color="#6C757D" fontSize="11px">
                  {stats.totalJobs} {t("sales.quote.jobs")}
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
                height: "50px",
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
              <Tooltip
                title={group.title}
                arrow
                disableHoverListener={group.title.length <= 15}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    maxWidth: "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {group.title}
                </Typography>
              </Tooltip>
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
            {/* Previous button */}
            <IconButton
              onClick={() => navigateTimeline(isRTL ? 1 : -1)}
              size="small"
              sx={classes.dateSelectorButton}
            >
              {isRTL ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
            </IconButton>

            <Typography variant="body1" sx={classes.dateLabel}>
              {getDateLabel()}
            </Typography>

            {/* Next button */}
            <IconButton
              onClick={() => navigateTimeline(isRTL ? -1 : 1)}
              size="small"
              sx={classes.dateSelectorButton}
            >
              {isRTL ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
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
                      ...adaptMarginLeft(dir, 1),
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

          <Stack direction="row" gap={1} alignItems="center">
            <TimelineActionButtons
              hasLocalChanges={hasLocalChanges}
              isSubmitting={isSubmitting}
              isRecovering={isRecovering}
              isTimeLineLocked={isTimeLineLocked}
              rescheduleSuccess={rescheduleSuccess}
              isRTL={isRTL}
              onRescheduleClick={() => setShowRescheduleModal(true)}
              onRecoverClick={() => setShowRecoverModal(true)}
              clearAllLocalChanges={clearAllLocalChanges}
              setRescheduleSuccess={setRescheduleSuccess}
              getData={getData}
              currentMonth={currentMonth}
              callApi={callApi}
              alertSuccessUpdate={alertSuccessUpdate}
              alertFaultUpdate={alertFaultUpdate}
            />
          </Stack>
        </Stack>
      </Box>

      {isTimeLineLocked ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "500px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress
              size={70}
              thickness={3}
              sx={{
                color: primaryColor(500),
                animationDuration: "1.4s",
              }}
            />
            <Typography variant="body1" color="text.secondary">
              {t("productionFloor.processingReschedule") ||
                "Processing reschedule. Please wait..."}
            </Typography>
          </Stack>
        </Box>
      ) : (
        <div style={{ position: "relative", direction: "ltr" }}>
          <Stack
            alignItems="center"
            direction="row"
            position="absolute"
            right="0px"
            top="0px"
            zIndex={1200}
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
            <Stack
              padding={isRTL ? "0px 0px 0px 8px" : "0px 8px 0px 0px"}
              gap={"5px"}
            >
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
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* Red Overdue Indicator */}
            <TimelineMarkers>
              <TodayMarker>
                {({ styles }) => (
                  <div
                    style={{
                      ...styles,
                      backgroundColor: "red",
                      width: "2px",
                      zIndex: 10,
                    }}
                  />
                )}
              </TodayMarker>
            </TimelineMarkers>
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
                        paddingLeft: "24px",
                        backgroundColor: "#F8F9FA",
                        ...FONT_FAMILY.Inter(600, 14),
                        color: "#495057",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        sx={{
                          pointerEvents: "auto",
                          position: "relative",
                          zIndex: 10,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          {t("productionFloor.stations")}
                        </Typography>
                        <Box
                          sx={{
                            pointerEvents: "auto",
                            position: "relative",
                            zIndex: 11,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExpandCollapseControls
                            groups={groups}
                            openGroups={openGroups}
                            onExpandAll={expandAllGroups}
                            onCollapseAll={collapseAllGroups}
                          />
                        </Box>
                      </Stack>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        style={{
                          height: "60px",
                          ...adaptRight(dir, 0),
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
      )}
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        openModal={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        title="productionFloor.confirmReschedule"
        subTitle="productionFloor.confirmRescheduleMessage"
        onClickDelete={async () => {
          const success = await submitRescheduleActions();
          if (success) {
            // Success: refresh the data and enable restore button
            setRescheduleSuccess(true);
            getData(currentMonth.clone().month());
          } else {
            // Failure: revert to original state and clear local changes
            setRescheduleSuccess(false);
            getData(currentMonth.clone().month()); // Refresh to get original data
            clearAllLocalChanges(); // Clear the local changes payload
          }
        }}
        yesBtn={t("sales.quote.Confirm")}
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        openModal={showRecoverModal}
        onClose={() => setShowRecoverModal(false)}
        title="productionFloor.confirmRecoverOverdue"
        subTitle="productionFloor.confirmRecoverOverdueMessage"
        onClickDelete={async () => {
          await recoverOverdue(() => {
            getData(currentMonth.clone().month());
          });
        }}
        yesBtn={t("sales.quote.Confirm")}
      />
    </Stack>
  );
};

export { TimelineWidget };
