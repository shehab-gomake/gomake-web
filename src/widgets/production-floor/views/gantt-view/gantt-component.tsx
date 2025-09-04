import { useEffect, useMemo } from "react";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
import { useGantt } from "@/widgets/production-floor/views/gantt-view/use-gantt";
import Stack from "@mui/material/Stack";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { JobComponent } from "@/widgets/production-floor/views/gantt-view/job-component";
import moment from "moment";
import { FONT_FAMILY } from "@/utils/font-family";
import { Box, Button, IconButton, Typography } from "@mui/material";
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

const TimelineWidget = () => {
  const { classes } = useStyle();
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
  } = useGantt();

  useEffect(() => {
    getData(currentMonth.clone().month());
  }, [currentMonth.valueOf()]);

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
      .map((group) => ({
        ...group,
        height: 40,
        title: group.isRoot ? (
          <Stack
            bgcolor={openGroups[group.id] ? "#F6F6F6" : "#FFF"}
            onClick={() => toggleGroup(group.id)}
            direction="row"
            alignItems="center"
            style={{
              cursor: "pointer",
              ...FONT_FAMILY.Inter(500, 14),
            }}
          >
            {openGroups[group.id] ? (
              <KeyboardArrowUpIcon
                sx={{ color: "#757575", marginRight: "5px" }}
              />
            ) : (
              <KeyboardArrowDownIcon
                sx={{ color: "#757575", marginRight: "5px" }}
              />
            )}
            {group.title}
          </Stack>
        ) : (
          <div
            style={{
              paddingLeft: 10,
              backgroundColor: "#FFF",
              ...FONT_FAMILY.Inter(500, 14),
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {group.title}
          </div>
        ),
      }));
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
    <Stack gap={"10px"}>
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
              sx={{
                backgroundColor: "#FD7E14",
                "&:hover": { backgroundColor: "#E8690B" },
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Auto-Schedule
            </Button>
          </Stack>
        </Stack>
      </Box>

      <div style={{ position: "relative", direction: "ltr" }}>
        <Stack
          alignItems={"center"}
          direction={"row"}
          position={"absolute"}
          right={"0px"}
          top={"0px"}
          zIndex={99999}
          height={"60px"}
          style={{ background: "#fff" }}
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
          // items={items.length > 0 ? items : []}
          items={items.filter((item) => {
            const isGroupOpen = openGroups[item.group];
            return isGroupOpen ? item.isEditable : true;
          })}
          defaultTimeStart={timeRange.defaultTimeStart}
          defaultTimeEnd={timeRange.defaultTimeEnd}
          sidebarWidth={200}
          onItemMove={handleItemMove}
          onItemResize={handleItemResize}
          onZoom={handleZoom}
          canResize={"right"}
          canChangeGroup={false}
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
        >
          <TimelineHeaders style={{ ...FONT_FAMILY.Inter(500, 12) }}>
            <SidebarHeader>
              {({ getRootProps }) => {
                return (
                  <div
                    {...getRootProps()}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "200px",
                      ...FONT_FAMILY.Inter(500, 14),
                      position: "relative",
                      // background: "#504fa11a",
                    }}
                  >
                    {t("productionFloor.stations")}
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        pointerEvents: "auto",
                        zIndex: 10,
                      }}
                    >
                      <IconButton onClick={() => scrollTimeline("left")}>
                        <KeyboardArrowLeftIcon />
                      </IconButton>
                    </div>
                  </div>
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
