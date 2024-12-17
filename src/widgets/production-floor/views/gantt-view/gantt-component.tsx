import React, { useEffect, useMemo, useState } from "react";
import Timeline from "react-calendar-timeline";
import moment from "moment";
import { useGantt } from "@/widgets/production-floor/views/gantt-view/use-gantt";
import Stack from "@mui/material/Stack";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const TimelineWidget = () => {
    const {
        groups,
        items,
        timeRange,
        openGroups,
        setOpenGroups,
        getData,
        handleItemResize,
        handleItemMove
    } = useGantt();

    const [currentMonth, setCurrentMonth] = useState(moment()); // Track the currently displayed month

    // Fetch data for the current month when the component mounts or the month changes
    useEffect(() => {
        getData(currentMonth.month()).then();
    }, [currentMonth]);

    // Toggle group expansion
    const toggleGroup = (id) => {
        setOpenGroups((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    };

    const handleZoom = ({ visibleTimeStart, visibleTimeEnd }) => {
        const startMoment = moment(visibleTimeStart);
        const endMoment = moment(visibleTimeEnd);

        const monthsDifference = endMoment.diff(startMoment, 'months');
        const daysDifference = endMoment.diff(startMoment, 'days');
        const yearsDifference = endMoment.diff(startMoment, 'years');

        // Determine the zoom level based on the time difference
        if (monthsDifference > 1) {
            // alert("year");
        } else if (monthsDifference === 1) {
            setCurrentMonth(startMoment);
        } else if (daysDifference >= 1) {
            // alert("day");
        } else {
            // alert("day"); // Default to day if no significant difference
        }
    };

    // Filter and format groups for display
    const filteredGroups = useMemo(() => {
        return groups
            .filter((group) => group.isRoot || openGroups[group.parent])
            .map((group) => ({
                ...group,
                title: group.isRoot ? (
                    <Stack
                        bgcolor={openGroups[group.id] ? "#F6F6F6" : "#FFF"}
                        onClick={() => toggleGroup(group.id)}
                        direction="row"
                        alignItems="center"
                        style={{ cursor: "pointer" }}
                    >
                        {openGroups[group.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        {group.title}
                    </Stack>
                ) : (
                    <div style={{ paddingLeft: 20, backgroundColor: "#FFF" }}>{group.title}</div>
                ),
            }));
    }, [groups, openGroups]);

    // Custom item rendering
    const customItemRenderer = ({ item, getItemProps }) => {
        const isEditable = item.isEditable;

        return (
            <div
                {...getItemProps({
                    style: {
                        backgroundColor: isEditable ? item.bgColor : "#2E3091",
                        pointerEvents: isEditable ? "auto" : "none",
                        color: "white",
                        borderRadius: "4px",
                        border: "1px solid inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                })}
            >
                <div className="rct-item-content" style={{ textAlign: "center" }}>
                    {item.title}
                </div>
            </div>
        );
    };

    // const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    //     const updatedItems = items.map((item) =>
    //         item.id === itemId
    //             ? {
    //                 ...item,
    //                 start_time: moment(dragTime),
    //                 end_time: moment(dragTime).add(
    //                     item.end_time.diff(item.start_time),
    //                     "milliseconds"
    //                 ),
    //                 group: groups[newGroupOrder].id,
    //             }
    //             : item
    //     );
    //     setItems(updatedItems);
    // };


    return (
        <div>
            {/* Timeline Component */}
            {groups.length > 0 && (
                <Timeline
                    groups={filteredGroups}
                    items={items}
                    defaultTimeStart={timeRange.defaultTimeStart}
                    defaultTimeEnd={timeRange.defaultTimeEnd}
                    sidebarWidth={200}
                    onItemMove={handleItemMove}
                    onItemResize={handleItemResize}
                    itemRenderer={customItemRenderer}
                    onZoom={handleZoom}
                    canResize={'right'}
                />
            )}
        </div>
    );
};

export { TimelineWidget };
