import { useCallback, useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { getTimeLineJobsApi } from "@/services/api-service/jobs-time-line/jobs-time-line-endpoints";
import { useGomakeAxios } from "@/hooks";
import {
  IGanttGroup,
  IGanttJob,
} from "@/widgets/production-floor/views/gantt-view/interfaces";
import { useRecoilState } from "recoil";
import { productionFloorFiltersState } from "@/widgets/production-floor/state/production-floor-filters";
import {
  loadingGanttItemId,
  TimeFrameTabs,
} from "@/widgets/production-floor/views/gantt-view/state";
import { useTranslation } from "react-i18next";
import { ITab } from "@/components/tabs/interface";

const useGantt = (reschedulingHook?: any) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const { callApi } = useGomakeAxios();

  // Modal state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showRecoverModal, setShowRecoverModal] = useState(false);

  // Use rescheduling hook if provided, otherwise create empty functions
  const {
    addLocalChange = () => {},
    updateTimeChange = () => {},
    hasLocalChanges = () => false,
    submitRescheduleActions = async () => false,
    isSubmitting = false,
  } = reschedulingHook || {};
  const [timeRange, setTimeRange] = useState({
    // defaultTimeStart: moment().startOf("hour").add(-2, "hours"),
    // defaultTimeEnd: moment().startOf("hour").add(3, "hours"),
    defaultTimeStart: moment().startOf("hour"),
    defaultTimeEnd: moment().endOf("hour"),
  });

  const [visibleTimeRange, setVisibleTimeRange] = useState({
    start: timeRange.defaultTimeStart.valueOf(),
    end: timeRange.defaultTimeEnd.valueOf(),
  });

  const [openGroups, setOpenGroups] = useState({});
  const [groups, setGroups] = useState<IGanttGroup[]>([]);
  const [items, setItems] = useState<IGanttJob[]>([]);
  const [filtersState] = useRecoilState(productionFloorFiltersState);
  const [, setLoadingItemId] = useRecoilState<string>(loadingGanttItemId);
  const [currentDate, setCurrentDate] = useState(moment());
  const [currentMonth, setCurrentMonth] = useState(moment());

  const getData = async (month) => {
    // Calculate start and end dates for the selected month in UTC
    const startOfMonth = moment()
      .year(currentMonth.year()) // Ensure the year aligns with the selected month
      .month(month) // Set the correct month
      .startOf("month") // Start of the month
      .utc() // Convert to UTC
      .toISOString();

    const endOfMonth = moment()
      .year(currentMonth.year()) // Ensure the year aligns with the selected month
      .month(month) // Set the correct month
      .endOf("month") // End of the month
      .utc() // Convert to UTC
      .toISOString();

    const callBack = (res) => {
      if (res.success) {
        setGroups(res.data.groups);
        setItems(
          res.data.items?.map((item) => ({
            ...item,
            start_time: moment(item.startTime),
            end_time: moment(item.endTime),
          }))
        );
      }
    };

    await getTimeLineJobsApi(callApi, callBack, {
      startDate: startOfMonth,
      endDate: endOfMonth,
    });
  };

  const handleItemResize = async (itemId, time, edge) => {
    setLoadingItemId(itemId);
    const updatedItem = items.find((j) => j.id === itemId);

    if (!updatedItem) {
      setLoadingItemId("");
      return;
    }

    // Calculate the new times first - use the same format as the original API
    const newStartTime =
      edge === "left"
        ? moment(time).utc().format("YYYY-MM-DD HH:mm:ss")
        : updatedItem.start_time.utc().format("YYYY-MM-DD HH:mm:ss");
    const newEndTime =
      edge === "right"
        ? moment(time).utc().format("YYYY-MM-DD HH:mm:ss")
        : updatedItem.end_time.utc().format("YYYY-MM-DD HH:mm:ss");

    // Update local state immediately for UI responsiveness
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? edge === "left"
          ? { ...item, start_time: moment(time) }
          : { ...item, end_time: moment(time) }
        : item
    );
    setItems(updatedItems);

    // Get the actionId from the group mapping
    const currentGroupForAction = groups.find(
      (g) => g.id === updatedItem.group
    );
    const actionId = currentGroupForAction?.parent || updatedItem.id;

    updateTimeChange(
      itemId, // Use itemId as unique key
      actionId,
      updatedItem.boardMissionId || updatedItem.id, // fallback to itemId if boardMissionId not available
      newStartTime,
      newEndTime,
      updatedItem.start_time.utc().format("YYYY-MM-DD HH:mm:ss"),
      updatedItem.end_time.utc().format("YYYY-MM-DD HH:mm:ss"),
      `Time slot modification - ${
        edge === "left" ? "start" : "end"
      } time changed`,
      updatedItem.productType // Pass productType from job data
    );

    setLoadingItemId("");
  };

  //!here most important
  const handleItemMove = async (itemId, dragTime, newGroupOrder) => {
    const updatedItem = items.find((j) => j.id === itemId);

    if (!updatedItem) {
      return;
    }

    const newGroup = groups[newGroupOrder];
    if (!newGroup) {
      return;
    }

    // Check if moving within the same parent category
    const currentGroup = groups.find((g) => g.id === updatedItem.group);
    const isSameParent =
      currentGroup && newGroup.parent === currentGroup.parent;

    // Allow moving if it's the same group OR if it's within the same parent category
    if (updatedItem.group !== newGroup.id && !isSameParent) {
      return;
    }

    setLoadingItemId(itemId);

    // Update local state immediately for UI responsiveness
    const newStartTime = moment(dragTime);
    const newEndTime = moment(dragTime).add(
      updatedItem.end_time.diff(updatedItem.start_time),
      "milliseconds"
    );

    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            start_time: newStartTime,
            end_time: newEndTime,
            group: newGroup.id,
          }
        : item
    );

    setItems(updatedItems);

    // Get the actionId from the group mapping
    const currentGroupForAction = groups.find(
      (g) => g.id === updatedItem.group
    );
    const actionId = currentGroupForAction?.parent || updatedItem.id;

    // Check if this is a resource change (group change)
    const isResourceChange = updatedItem.group !== newGroup.id;

    // Check if this is a time change (start or end time changed)
    const isTimeChange =
      !updatedItem.start_time.isSame(newStartTime) ||
      !updatedItem.end_time.isSame(newEndTime);

    if (isResourceChange && isTimeChange) {
      debugger;

      // Combined change: Resource + Time
      // Determine if it's an employee or machine change
      const currentGroupId = updatedItem.group.split(",")[1];
      const newGroupId = newGroup.id.split(",")[1];
      const isCurrentEmployee = currentGroupId && currentGroupId.includes("-");
      const isNewEmployee = newGroupId && newGroupId.includes("-");

      let changeType: "employee" | "machine" | "resource";
      let reason: string;

      if (isCurrentEmployee && isNewEmployee) {
        changeType = "employee";
        reason = `Employee and time changed from ${
          currentGroup?.title || "Unknown"
        } to ${newGroup.title}`;
      } else if (!isCurrentEmployee && !isNewEmployee) {
        changeType = "machine";
        reason = `Machine and time changed from ${
          currentGroup?.title || "Unknown"
        } to ${newGroup.title}`;
      } else {
        changeType = "resource";
        reason = `Resource and time changed from ${
          currentGroup?.title || "Unknown"
        } to ${newGroup.title}`;
      }

      // Add combined change with both resource and time information
      addLocalChange(
        itemId, // Use itemId as unique key
        actionId,
        updatedItem.boardMissionId || updatedItem.id,
        changeType,
        newGroup.id,
        updatedItem.group,
        reason,
        newStartTime.utc().format("YYYY-MM-DD HH:mm:ss"),
        newEndTime.utc().format("YYYY-MM-DD HH:mm:ss"),
        updatedItem.start_time.utc().format("YYYY-MM-DD HH:mm:ss"),
        updatedItem.end_time.utc().format("YYYY-MM-DD HH:mm:ss"),
        updatedItem.productType // Pass productType from job data
      );
    } else if (isResourceChange) {
      debugger;

      // Only resource change (no time change)
      const currentGroupId = updatedItem.group.split(",")[1];
      const newGroupId = newGroup.id.split(",")[1];
      const isCurrentEmployee = currentGroupId && currentGroupId.includes("-");
      const isNewEmployee = newGroupId && newGroupId.includes("-");

      let changeType: "employee" | "machine" | "resource";
      let reason: string;

      if (isCurrentEmployee && isNewEmployee) {
        changeType = "employee";
        reason = `Employee changed from ${
          currentGroup?.title || "Unknown"
        } to ${newGroup.title}`;
      } else if (!isCurrentEmployee && !isNewEmployee) {
        changeType = "machine";
        reason = `Machine changed from ${currentGroup?.title || "Unknown"} to ${
          newGroup.title
        }`;
      } else {
        changeType = "resource";
        reason = `Resource changed from ${
          currentGroup?.title || "Unknown"
        } to ${newGroup.title}`;
      }

      addLocalChange(
        itemId, // Use itemId as unique key
        actionId,
        updatedItem.boardMissionId || updatedItem.id,
        changeType,
        newGroup.id,
        updatedItem.group,
        reason,
        undefined, // newStartTime
        undefined, // newEndTime
        undefined, // originalStartTime
        undefined, // originalEndTime
        updatedItem.productType // Pass productType from job data
      );
    } else if (isTimeChange) {
      debugger;
      // Only time change (no resource change)
      updateTimeChange(
        itemId, // Use itemId as unique key
        actionId,
        updatedItem.boardMissionId || updatedItem.id,
        newStartTime.utc().format("YYYY-MM-DD HH:mm:ss"),
        newEndTime.utc().format("YYYY-MM-DD HH:mm:ss"),
        updatedItem.start_time.utc().format("YYYY-MM-DD HH:mm:ss"),
        updatedItem.end_time.utc().format("YYYY-MM-DD HH:mm:ss"),
        "Time slot modification - job moved to new time slot",
        updatedItem.productType // Pass productType from job data
      );
    }

    setLoadingItemId("");
  };

  // Toggle group expansion
  const toggleGroup = (id) => {
    setOpenGroups((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleZoom = ({ visibleTimeStart, visibleTimeEnd }) => {
    const startTime = moment(visibleTimeStart);
    const endTime = moment(visibleTimeEnd);

    const durationHours = endTime.diff(startTime, "hours");
    const durationDays = endTime.diff(startTime, "days");
    const durationMonths = endTime.diff(startTime, "months");

    // Example constraints (optional):
    const MIN_DURATION = moment.duration(5, "minutes").asMilliseconds();
    const MAX_DURATION = moment.duration(365, "days").asMilliseconds();

    let newStart = visibleTimeStart;
    let newEnd = visibleTimeEnd;
    const durationMs = visibleTimeEnd - visibleTimeStart;

    // Limit minimum zoom (e.g., 5 minutes)
    if (durationMs < MIN_DURATION) {
      const center = (visibleTimeStart + visibleTimeEnd) / 2;
      newStart = center - MIN_DURATION / 2;
      newEnd = center + MIN_DURATION / 2;
    }

    // Limit maximum zoom (e.g., 1 year)
    if (durationMs > MAX_DURATION) {
      const center = (visibleTimeStart + visibleTimeEnd) / 2;
      newStart = center - MAX_DURATION / 2;
      newEnd = center + MAX_DURATION / 2;
    }

    // Update visible time range consistently
    setVisibleTimeRange({
      start: newStart,
      end: newEnd,
    });

    // Adjust current month based on zoom level
    if (durationMonths >= 1) {
      setCurrentMonth(startTime);
    }
  };

  const onTimeChange = (
    visibleTimeStart,
    visibleTimeEnd,
    updateScrollCanvas
  ) => {
    updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    setVisibleTimeRange({ start: visibleTimeStart, end: visibleTimeEnd });
  };

  const handleClickZoom = (direction) => {
    const MAX_ZOOM_DURATION = 1000 * 60 * 60 * 24 * 365; // 12 months
    const MIN_ZOOM_DURATION = 1000 * 60 * 5; // 5 minutes minimum zoom
    const ZOOM_IN_FACTOR = 0.8; // Zooming in makes duration shorter (show less time)
    const ZOOM_OUT_FACTOR = 1.25; // Zooming out makes duration longer (show more time)

    const duration = visibleTimeRange.end - visibleTimeRange.start;
    let newDuration;

    if (direction === "in") {
      newDuration = duration * ZOOM_IN_FACTOR;
      if (newDuration < MIN_ZOOM_DURATION) newDuration = MIN_ZOOM_DURATION;
    } else {
      newDuration = duration * ZOOM_OUT_FACTOR;
      if (newDuration > MAX_ZOOM_DURATION) newDuration = MAX_ZOOM_DURATION;
    }

    const center = (visibleTimeRange.start + visibleTimeRange.end) / 2;

    setVisibleTimeRange({
      start: center - newDuration / 2,
      end: center + newDuration / 2,
    });
  };

  const getGanttData = useCallback(() => {
    getData(currentMonth.month()).then();
  }, [currentMonth]);

  useEffect(() => {
    getGanttData();
  }, [filtersState.stations]);

  const [activeTab, setActiveTab] = useState(TimeFrameTabs.DAY);

  const timeFrameTabs: ITab[] = [
    {
      title: t("productionFloor.hour"),
    },
    {
      title: t("productionFloor.day"),
    },
    {
      title: t("productionFloor.week"),
    },
    {
      title: t("productionFloor.month"),
    },
    {
      title: t("productionFloor.year"),
    },
  ];

  const handleItemSelect = (itemId) => {
    const selectedItem = items.find((item) => item.id === itemId);

    if (!selectedItem?.isEditable) {
      //  Don't do anything if not editable
      return;
    }
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

  const handleItemDeselect = () => {
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        selected: false,
        isHasSelected: false,
      }))
    );
  };

  const getDateLabel = () => {
    switch (activeTab) {
      case TimeFrameTabs.YEAR:
        return currentDate.format("YYYY");
      case TimeFrameTabs.MONTH:
        return currentDate.format("MMMM YYYY");
      case TimeFrameTabs.WEEK:
        const weekStart = currentDate.clone().startOf("week").format("MMM DD");
        const weekEnd = currentDate.clone().endOf("week").format("DD, YYYY");
        return `${weekStart}-${weekEnd}`;
      case TimeFrameTabs.DAY:
        return currentDate.format("MMM DD, YYYY");
      case TimeFrameTabs.HOUR:
        return currentDate.format("MMM DD, YYYY hh:mm A");
      default:
        return "";
    }
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    setCurrentDate(moment()); // Reset currentDate to now when changing tabs

    //  If switching from year to another tab, update currentMonth as well
    const newMonth = moment().clone().startOf("month");
    if (!newMonth.isSame(currentMonth, "month")) {
      setCurrentMonth(newMonth);
    }
  };

  const navigateTimeline = (direction: number) => {
    setCurrentDate((prevDate) => {
      const newDate = prevDate.clone();

      switch (activeTab) {
        case TimeFrameTabs.YEAR:
          newDate.add(direction, "year");
          break;
        case TimeFrameTabs.MONTH:
          newDate.add(direction, "month");
          break;
        case TimeFrameTabs.WEEK:
          newDate.add(direction, "week");
          break;
        case TimeFrameTabs.DAY:
          newDate.add(direction, "day");
          break;
        case TimeFrameTabs.HOUR:
          newDate.add(direction, "hour");
          break;
        default:
          break;
      }

      // If month has changed, update currentMonth
      if (!newDate.isSame(currentMonth, "month")) {
        setCurrentMonth(newDate.clone().startOf("month"));
      }
      return newDate;
    });
  };

  const scrollTimeline = (direction) => {
    const visibleDuration = visibleTimeRange.end - visibleTimeRange.start;
    let scrollAmount: number;

    const startTime = moment(visibleTimeRange.start);
    const endTime = moment(visibleTimeRange.end);
    const durationHours = endTime.diff(startTime, "hours");
    const monthsDifference = endTime.diff(startTime, "months");

    if (durationHours === 1) {
      scrollAmount = visibleDuration;
    } else if (durationHours <= 24) {
      scrollAmount = visibleDuration / 6;
    } else if (monthsDifference <= 1) {
      scrollAmount = visibleDuration / 30;
    } else {
      scrollAmount = visibleDuration / 12;
    }

    // Calculate new visible range
    const newStart =
      direction === "left"
        ? visibleTimeRange.start - scrollAmount
        : visibleTimeRange.start + scrollAmount;

    const newEnd =
      direction === "left"
        ? visibleTimeRange.end - scrollAmount
        : visibleTimeRange.end + scrollAmount;

    setVisibleTimeRange({ start: newStart, end: newEnd });

    const newCenterDate = moment((newStart + newEnd) / 2);
    const previousDate = currentDate.clone();

    const isDifferentPeriod = () => {
      switch (activeTab) {
        case TimeFrameTabs.YEAR:
          return !newCenterDate.isSame(previousDate, "year");
        case TimeFrameTabs.MONTH:
          return !newCenterDate.isSame(previousDate, "month");
        case TimeFrameTabs.WEEK:
          return !newCenterDate.isSame(previousDate, "week");
        case TimeFrameTabs.DAY:
          return !newCenterDate.isSame(previousDate, "day");
        case TimeFrameTabs.HOUR:
          return !newCenterDate.isSame(previousDate, "hour");
        default:
          return false;
      }
    };

    if (isDifferentPeriod()) {
      setCurrentDate(newCenterDate);

      if (!newCenterDate.isSame(currentMonth, "month")) {
        const newMonthStart = newCenterDate.clone().startOf("month");
        setCurrentMonth(newMonthStart);
        getData(newMonthStart.month());
      }
    }
  };

  return {
    timeRange,
    setTimeRange,
    groups,
    setGroups,
    items,
    setItems,
    openGroups,
    setOpenGroups,
    getData,
    handleItemResize,
    handleItemMove,
    toggleGroup,
    handleZoom,
    currentMonth,
    setCurrentMonth,
    onTimeChange,
    visibleTimeRange,
    scrollTimeline,
    getGanttData,
    handleClickZoom,
    setVisibleTimeRange,
    t,
    activeTab,
    setActiveTab,
    handleItemSelect,
    handleItemDeselect,
    currentDate,
    setCurrentDate,
    getDateLabel,
    navigateTimeline,
    handleTabChange,
    timeFrameTabs,
    dir,
    isRTL,
    hasLocalChanges,
    submitRescheduleActions,
    isSubmitting,
    showRecoverModal,
    setShowRecoverModal,
    showRescheduleModal,
    setShowRescheduleModal,
  };
};

export { useGantt };
