import {useState} from "react";
import moment from "moment";
import {getTimeLineJobsApi, updateJobTimeApi} from "@/services/api-service/jobs-time-line/jobs-time-line-endpoints";
import {useGomakeAxios} from "@/hooks";
import {IGanttGroup, IGanttJob} from "@/widgets/production-floor/views/gantt-view/interface";

const useGantt = () => {
    const {callApi} = useGomakeAxios();
    const [currentMonth, setCurrentMonth] = useState(moment()); // Track the currently displayed month
    const [timeRange, setTimeRange] = useState({
        defaultTimeStart: moment().startOf("day"),
        defaultTimeEnd: moment().startOf("day").add(10, 'hours'),
    });
    const [visibleTimeRange, setVisibleTimeRange] = useState({
        start: timeRange.defaultTimeStart.valueOf(),
        end: timeRange.defaultTimeEnd.valueOf(),
    });
    const [openGroups, setOpenGroups] = useState({});
    const [groups, setGroups] = useState<IGanttGroup[]>([]);
    const [items, setItems] = useState<IGanttJob[]>([]);

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

        console.log({startDate: startOfMonth, endDate: endOfMonth}); // Debugging payload

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

        await getTimeLineJobsApi(callApi, callBack, {startDate: startOfMonth, endDate: endOfMonth});
    };

    const handleItemResize = async (itemId, time, edge) => {
        const updatedItem = items.find(j => j.id === itemId);
        if (updatedItem) {
            await updateJobTimeApi(callApi, () => {
            }, {
                id: updatedItem.id,
                startDate: updatedItem.start_time.toDate().toLocaleString(),
                endDate: new Date(time).toLocaleString()
            })
        }
        const updatedItems = items.map((item) =>
            item.id === itemId
                ? edge === "left"
                    ? {...item, start_time: moment(time)}
                    : {...item, end_time: moment(time)}
                : item
        );
        setItems(updatedItems);
    };

    const handleItemMove = async (itemId, dragTime, newGroupOrder) => {
        const updatedItem = items.find(j => j.id === itemId);
        if (updatedItem) {
            await updateJobTimeApi(callApi, () => {
            }, {
                id: updatedItem.id,
                startDate: moment(dragTime),
                endDate: moment(dragTime).add(
                    updatedItem.end_time.diff(updatedItem.start_time),
                    "milliseconds"
                ),
            })
        }
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
    };

    // Fetch data for the current month when the component mounts or the month changes

    // Toggle group expansion
    const toggleGroup = (id) => {
        setOpenGroups((prevState) => ({...prevState, [id]: !prevState[id]}));
    };

    const handleZoom = ({visibleTimeStart, visibleTimeEnd}) => {
        const startTime  = moment(visibleTimeStart);
        const endTime  = moment(visibleTimeEnd);
        const durationHours = endTime.diff(startTime, "hours");
        const monthsDifference = endTime.diff(startTime, 'months');
        const daysDifference = endTime.diff(startTime, 'days');

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

    const onTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
        updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
        setVisibleTimeRange({start: visibleTimeStart, end: visibleTimeEnd})
    }

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
        visibleTimeRange
    };
};

export {useGantt};
