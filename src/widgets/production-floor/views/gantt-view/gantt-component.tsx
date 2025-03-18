import React, { useEffect, useMemo } from "react";
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
import { IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";
const TimelineWidget = () => {
  const {
    t,
    groups,
    items,
    setItems,
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
    scrollTimeline,
    handleClickZoom,
  } = useGantt();

  const handleItemSelect = (itemId) => {
    const selectedItem = items.find((item) => item.id === itemId);
    if (selectedItem) {
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          selected: selectedItem?.title === item.title,
          isHasSelected: true,
        }))
      );
    }
  };

  useEffect(() => {
    getData(currentMonth.month()).then();
  }, [currentMonth]);

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
            style={{ cursor: "pointer", ...FONT_FAMILY.Inter(500, 12) }}
          >
            {openGroups[group.id] ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
            {group.title}
          </Stack>
        ) : (
          <div
            style={{
              paddingLeft: 20,
              backgroundColor: "#FFF",
              ...FONT_FAMILY.Inter(500, 12),
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {group.title}
          </div>
        ),
      }));
  }, [groups, openGroups, items]);

  // !test
  const resetToCurrentView = () => {
    onTimeChange(
      timeRange.defaultTimeStart,
      timeRange.defaultTimeEnd,
      () => {} // Pass an empty function or a relevant callback
    );
  };

  return (
    <div style={{ position: "relative", direction: "ltr" }}>
      <Stack
        alignItems={"center"}
        direction={"row"}
        gap={"10px"}
        position={"absolute"}
        right={"0px"}
        top={"0px"}
        zIndex={99999}
        height={"60px"}
        style={{ background: "#ededf5" }}
      >
        <IconButton onClick={() => scrollTimeline("right")}>
          <ChevronRightIcon />
        </IconButton>
        {/* !test */}
        <IconButton onClick={resetToCurrentView}>
          <KeyboardReturnRoundedIcon />
        </IconButton>
        {/* !test */}
        <Stack padding={"0 10px 0 0"} gap={"5px"}>
          <RemoveIcon
            onClick={() => handleClickZoom("in")}
            style={{ height: "20px", width: "20px", cursor: "pointer" }}
          />
          <AddIcon
            onClick={() => handleClickZoom("out")}
            style={{ height: "20px", width: "20px", cursor: "pointer" }}
          />
        </Stack>
      </Stack>
      <Timeline
        groups={
          filteredGroups.length > 0
            ? filteredGroups
            : [{ id: "empty", title: "No Groups Available" }]
        }
        items={items.length > 0 ? items : []}
        defaultTimeStart={timeRange.defaultTimeStart}
        defaultTimeEnd={timeRange.defaultTimeEnd}
        sidebarWidth={200}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        onZoom={handleZoom}
        canResize={"right"}
        canChangeGroup={false}
        //!here
        itemRenderer={(props) => {
          return <JobComponent {...props} />;
        }}
        onTimeChange={onTimeChange}
        visibleTimeStart={visibleTimeRange.start}
        visibleTimeEnd={visibleTimeRange.end}
        onItemSelect={handleItemSelect}
        onItemDeselect={() =>
          setItems((prev) =>
            prev.map((item) => ({
              ...item,
              selected: false,
              isHasSelected: false,
            }))
          )
        }
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
                    background: "#504fa11a",
                  }}
                >
                  {t("productionFloor.stations")}
                  <IconButton
                    style={{ position: "absolute", right: 0 }}
                    onClick={() => scrollTimeline("left")}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                </div>
              );
            }}
          </SidebarHeader>
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
                  return `${momentStart?.format("hh:mm A")}`;
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
  );
};

export { TimelineWidget };
