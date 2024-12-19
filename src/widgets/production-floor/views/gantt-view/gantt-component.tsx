import React, {useEffect, useMemo} from "react";
import Timeline from "react-calendar-timeline";
import {useGantt} from "@/widgets/production-floor/views/gantt-view/use-gantt";
import Stack from "@mui/material/Stack";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {JobComponent} from "@/widgets/production-floor/views/gantt-view/job-component";

const TimelineWidget = () => {
    const {
        groups,
        items,
        timeRange,
        openGroups,
        getData,
        handleItemResize,
        handleItemMove,
        currentMonth,
        toggleGroup,
        handleZoom
    } = useGantt();

    useEffect(() => {
        getData(currentMonth.month()).then();
    }, [currentMonth]);

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
                        style={{cursor: "pointer"}}
                    >
                        {openGroups[group.id] ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        {group.title}
                    </Stack>
                ) : (
                    <div style={{paddingLeft: 20, backgroundColor: "#FFF"}}>{group.title}</div>
                ),
            }));
    }, [groups, openGroups]);


    return (
        <div>
                <Timeline
                    groups={filteredGroups.length > 0 ? filteredGroups : [{ id: 'empty', title: 'No Groups Available' }]}
                    items={items.length > 0 ? items : []}
                    defaultTimeStart={timeRange.defaultTimeStart}
                    defaultTimeEnd={timeRange.defaultTimeEnd}
                    sidebarWidth={200}
                    onItemMove={handleItemMove}
                    onItemResize={handleItemResize}
                    itemRenderer={JobComponent}
                    onZoom={handleZoom}
                    canResize={'right'}
                    minResizeWidth={500*500}
                />
        </div>
    );
};

export {TimelineWidget};
