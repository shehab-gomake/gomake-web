import React, {useEffect, useMemo} from "react";
import Timeline, {TimelineHeaders, SidebarHeader, DateHeader} from "react-calendar-timeline";
import {useGantt} from "@/widgets/production-floor/views/gantt-view/use-gantt";
import Stack from "@mui/material/Stack";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {JobComponent} from "@/widgets/production-floor/views/gantt-view/job-component";
import moment from "moment";

const TimelineWidget = () => {
    const {
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
        visibleTimeRange
    } = useGantt();
    const handleItemSelect = (itemId) => {
        const selectedItem = items.find((item) => item.id === itemId);
        if (selectedItem) {
        setItems(prev => prev.map(item => ({...item, selected: selectedItem?.title === item.title, isHasSelected: true})))
        }
    };


    useEffect(() => {
        getData(currentMonth.month()).then();
    }, [currentMonth]);

    const filteredGroups = useMemo(() => {
        return groups
            .filter((group) => group.isRoot || openGroups[group.parent] || items.some(item => item.group === group.id && item.isHasSelected && item.selected))
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
    }, [groups, openGroups, items]);

    return (
        <div>
            <Timeline
                groups={filteredGroups.length > 0 ? filteredGroups : [{id: 'empty', title: 'No Groups Available'}]}
                items={items.length > 0 ? items : []}
                defaultTimeStart={timeRange.defaultTimeStart}
                defaultTimeEnd={timeRange.defaultTimeEnd}
                sidebarWidth={200}
                onItemMove={handleItemMove}
                onItemResize={handleItemResize}
                onZoom={handleZoom}
                canResize={'right'}
                itemRenderer={(props) => {
                    return <JobComponent {...props}/>
                }}
                onTimeChange={onTimeChange}
                visibleTimeStart={visibleTimeRange.start}
                visibleTimeEnd={visibleTimeRange.end}
                onItemSelect={handleItemSelect} // Handle item selection
                onItemDeselect={() => setItems(prev => prev.map(item => ({...item, selected: false, isHasSelected: false})))}
                selected={items.filter(item => !!item.selected).map(i => i.id)}

            >
                <TimelineHeaders>
                    <SidebarHeader>
                        {({ getRootProps }) => {
                            return <div {...getRootProps()} style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '200px'
                            }}>stations</div>
                        }}
                    </SidebarHeader>
                    <DateHeader
                        unit="primaryHeader"/>
                    <DateHeader  labelFormat={([start, end], unit) => {
                        const momentStart = moment(start);
                        switch (unit) {
                            case "year":
                                return `${start.getFullYear()}`;
                            case "month":
                                return `${momentStart.format("MMMM")}`;
                            case "day":
                                return `${momentStart.format("DD")}`;
                            case "hour":
                                return `${momentStart.format("hh:mm A")}`;
                            case "minute":
                                return `${momentStart.format("mm")}`;
                            default:
                                return "";
                        }
                    }} />
                </TimelineHeaders>
            </Timeline>
        </div>
    );
};

export {TimelineWidget};
