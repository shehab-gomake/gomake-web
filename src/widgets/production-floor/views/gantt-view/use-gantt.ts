import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import {
  getTimeLineJobsApi,
  updateJobTimeApi,
} from "@/services/api-service/jobs-time-line/jobs-time-line-endpoints";
import { useGomakeAxios } from "@/hooks";
import {
  IGanttGroup,
  IGanttJob,
} from "@/widgets/production-floor/views/gantt-view/interface";
import { useRecoilState } from "recoil";
import { productionFloorFiltersState } from "@/widgets/production-floor/state/production-floor-filters";
import {
  loadingGanttItemId,
  TimeFrameTabs,
} from "@/widgets/production-floor/views/gantt-view/state";
import { useTranslation } from "react-i18next";
import { ITab } from "@/components/tabs/interface";

const useGantt = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [currentMonth, setCurrentMonth] = useState(moment()); // Track the currently displayed month
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

  //!here when it work
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

    console.log({ startDate: startOfMonth, endDate: endOfMonth }); // Debugging payload

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
    const callBack = (res) => {
      setLoadingItemId("");
      if (res.success) {
        getData(currentMonth.month()).then();
      } else {
        setItems((prevState) =>
          prevState.map((j) => (j.id === updatedItem.id ? updatedItem : j))
        );
      }
    };
    setLoadingItemId(itemId);
    const updatedItem = items.find((j) => j.id === itemId);
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? edge === "left"
          ? { ...item, start_time: moment(time) }
          : { ...item, end_time: moment(time) }
        : item
    );
    setItems(updatedItems);
    if (updatedItem) {
      await updateJobTimeApi(callApi, callBack, {
        id: updatedItem.id,
        startDate: updatedItem.start_time.toDate().toLocaleString(),
        endDate: new Date(time).toLocaleString(),
      });
    }
  };

  const handleItemMove = async (itemId, dragTime, newGroupOrder) => {
    const updatedItem = items.find((j) => j.id === itemId);
    const callBack = (res) => {
      setLoadingItemId("");
      if (res.success) {
        getData(currentMonth.month()).then();
      } else {
        setItems((prevState) =>
          prevState.map((j) => (j.id === updatedItem.id ? updatedItem : j))
        );
      }
    };
    if (updatedItem.group !== groups[newGroupOrder].id) {
      return;
    }
    setLoadingItemId(itemId);
    if (updatedItem) {
      const updatedItems = items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              start_time: moment(dragTime),
              end_time: moment(dragTime).add(
                item.end_time.diff(item.start_time),
                "milliseconds"
              ),
              group: groups[newGroupOrder].id,
            }
          : item
      );
      setItems(updatedItems);

      await updateJobTimeApi(callApi, callBack, {
        id: updatedItem.id,
        startDate: moment(dragTime),
        endDate: moment(dragTime).add(
          updatedItem.end_time.diff(updatedItem.start_time),
          "milliseconds"
        ),
      });
    }
  };

  // Toggle group expansion
  const toggleGroup = (id) => {
    setOpenGroups((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleZoomOld = ({ visibleTimeStart, visibleTimeEnd }) => {
    const startTime = moment(visibleTimeStart);
    const endTime = moment(visibleTimeEnd);
    const durationHours = endTime.diff(startTime, "hours");
    const monthsDifference = endTime.diff(startTime, "months");
    const daysDifference = endTime.diff(startTime, "days");

    if (durationHours <= 24 && durationHours > 6) {
      // Adjust to show only 6 hours from startTime
      const newEndTime = startTime.clone().add(6, "hours").valueOf();
      setVisibleTimeRange({
        start: startTime.valueOf(),
        end: newEndTime,
      });
    } else {
      // Update the time range state for other cases
      setVisibleTimeRange({
        start: visibleTimeStart,
        end: visibleTimeEnd,
      });
    }
    // Determine the zoom level based on the time difference
    if (monthsDifference > 1) {
      // alert("year");
    } else if (monthsDifference === 1) {
      setCurrentMonth(startTime);
    } else if (daysDifference >= 1) {
      // alert("day");
    } else {
      // alert("day"); // Default to day if no significant difference
    }
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

  const scrollTimeline = (direction) => {
    const visibleDuration = visibleTimeRange.end - visibleTimeRange.start;
    const startTime = moment(visibleTimeRange.start);
    const endTime = moment(visibleTimeRange.end);
    let scrollAmount: number;
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
    if (direction === "left") {
      setVisibleTimeRange((prevState) => ({
        start: prevState.start - scrollAmount,
        end: prevState.end - scrollAmount,
      }));
    } else if (direction === "right") {
      setVisibleTimeRange((prevState) => ({
        start: prevState.start + scrollAmount,
        end: prevState.end + scrollAmount,
      }));
    }
  };

  const handleClickZoomOld = (direction) => {
    const MAX_ZOOM_OUT_DURATION = 1000 * 60 * 60 * 24 * 365; // 12 months in milliseconds
    const ONE_MINUTE = 1000 * 60;
    const ONE_HOUR = ONE_MINUTE * 60; // 1 hour in milliseconds
    // const ONE_DAY = ONE_HOUR * 24; // 1 day in milliseconds
    // const ONE_MONTH = ONE_DAY * 30; // Approximation for a month
    // const ONE_YEAR = ONE_DAY * 365; // 1 year in milliseconds
    const SEVEN_HOURS = ONE_HOUR * 7; // 7 hours in milliseconds

    const zoomFactor = direction === "in" ? 1.1 : 0.9; // Adjust zoom factor for in/out
    const duration = visibleTimeRange.end - visibleTimeRange.start;
    let newDuration = duration * zoomFactor;
    const center = (visibleTimeRange.start + visibleTimeRange.end) / 2;

    // Prevent zooming out if duration is <= 5 minutes
    if (direction === "out" && duration <= ONE_MINUTE * 5) {
      return;
    }

    // If zooming in and time range is < 7 hours, reduce by 1 hour
    if (direction === "in" && duration < SEVEN_HOURS && duration > ONE_HOUR) {
      newDuration = duration - ONE_HOUR;
    }

    // Prevent zooming out beyond 12 months
    if (direction === "out" && newDuration > MAX_ZOOM_OUT_DURATION) return;
    //
    // // Ensure zooming does not cross time unit boundaries
    // if (duration >= ONE_YEAR && newDuration < ONE_YEAR) return; // Year to Month
    // if (duration >= ONE_MONTH && newDuration < ONE_MONTH) return; // Month to Day
    // if (duration >= ONE_DAY && newDuration < ONE_DAY) return; // Day to Hour
    // if (duration >= ONE_HOUR && newDuration < ONE_HOUR) return; // Hour to Minute

    setVisibleTimeRange({
      start: center - newDuration / 2,
      end: center + newDuration / 2,
    });
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

  /************************************ NEW *******************************/
  const [activeTab, setActiveTab] = useState(TimeFrameTabs.HOUR);

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

  const handleItemSelectNew = (itemId) => {
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        selected: item.id === itemId,
        isHasSelected: true,
      }))
    );
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

  const [currentDate, setCurrentDate] = useState(moment());

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

  const navigateTimeline = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = prevDate.clone();
      switch (activeTab) {
        case 4:
          return newDate.add(direction, "year");
        case 3:
          return newDate.add(direction, "month");
        case 2:
          return newDate.add(direction, "week");
        case 1:
          return newDate.add(direction, "day");
        case 0:
          return newDate.add(direction, "hour");
        default:
          return newDate;
      }
    });
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    setCurrentDate(moment()); // Reset currentDate to now when changing tabs
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
  };
};

export { useGantt };
