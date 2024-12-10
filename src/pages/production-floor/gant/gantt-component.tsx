// pages/timeline.js
import React, {useCallback, useEffect, useState} from 'react';
import Timeline from 'react-calendar-timeline';
import moment from 'moment';
import StartOf = moment.unitOfTime.StartOf;
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Stack from "@mui/material/Stack";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const TimelinePage = () => {
    const {primaryColor, grayColor} = useGomakeTheme();
    const [view, setView] = useState<StartOf>('day');
    const [timeRange] = useState({
        defaultTimeStart: moment().startOf(view),
        defaultTimeEnd: moment().endOf(view),
    });
    const [, setVisibleTime] = useState({start: moment().startOf(view), end: moment().endOf(view)});
    const [openGroups, setOpenGroups] = useState({});
    const [groups] = useState([
        {id: 1, title: 'station 1', isRoot: true, parent: null},
        {id: 2, title: 'machine 1', isRoot: false, parent: 1},
        {id: 3, title: 'machine 2', isRoot: false, parent: 1},
        {id: 4, title: 'machine 3', isRoot: false, parent: 1},
        {id: 5, title: 'machine 4', isRoot: false, parent: 1},
        {id: 6, title: 'station 2', isRoot: true, parent: null},
        {id: 7, title: 'machine 1', isRoot: false, parent: 6},
        {id: 8, title: 'machine 2', isRoot: false, parent: 6},
        {id: 9, title: 'machine 3', isRoot: false, parent: 6},
        {id: 10, title: 'machine 4', isRoot: false, parent: 6},

    ]);
    const [items, setItems] = useState([
        {
            id: 3,
            group: 2,
            title: 'Item 1',
            start_time: moment().add(0, 'days'),
            end_time: moment().add(1, 'days'),
            bgColor: 'green'
        },
        {
            id: 2,
            group: 3,
            title: 'Item 2',
            start_time: moment().add(2, 'days'),
            end_time: moment().add(3, 'days'),
            bgColor: 'gray'
        }
    ]);

    const customItemRenderer = ({ item, itemContext, getItemProps, getResizeProps }) => {
        const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
        return (
            <div
                {...getItemProps({
                    style: {
                        backgroundColor: item.bgColor || 'lightgray', // Use item.bgColor if defined
                        color: 'white',
                        borderRadius: '4px',
                        border: '1px solid #d3d3d3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                })}
            >
                <div {...leftResizeProps} />
                <div className="rct-item-content" style={{ textAlign: 'center',  }}>
                    {item.title}
                </div>
                <div {...rightResizeProps} />
            </div>
        );
    };


    useEffect(() => {
        const elements = document.querySelector('.rct-horizontal-lines').children;
        if (elements.length > 0) {
            groups.filter(g => g.isRoot || openGroups[g.parent]).forEach((group, index) => {
                if (group.isRoot) {
                    if (elements[index]) {
                        (elements[index] as HTMLElement).style.backgroundColor = primaryColor(500);
                        (elements[index] as HTMLElement).style.color = '#FFF';
                        (elements[index] as HTMLElement).style.position = 'relative';
                        (elements[index] as HTMLElement).style.zIndex = '300';
                        // (elements[index] as HTMLElement).innerHTML = `<div class="aaaa">${group.title}</div>`;
                        // (elements[index] as HTMLElement).classList.remove('rct-hl-even', 'rct-hl-odd')
                    }
                }
                    else {
                        (elements[index] as HTMLElement).style.backgroundColor = 'white';
                        (elements[index] as HTMLElement).style.position = 'relative';
                        (elements[index] as HTMLElement).style.zIndex = '80';
                        (elements[index] as HTMLElement).style.border = '0';
                    }
            });
        }
    }, [openGroups]);

    const toggleGroup = id => {
        setOpenGroups(prevState => ({...prevState, [id]: !prevState[id]}))
    };

    const newGroups = useCallback(() => {
        return groups.filter(g => g.isRoot || openGroups[g.parent])
            .map(group => {
                return {
                    ...group,
                    title: group.isRoot ? (
                        <Stack bgcolor={grayColor(200)} onClick={() => toggleGroup(group.id)} direction={'row'}
                               alignItems={'center'} style={{cursor: "pointer"}}>
                            {openGroups[group.id] ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>} {group.title}
                        </Stack>
                    ) : (
                        <div style={{paddingLeft: 20, backgroundColor: '#FFF'}}>{group.title}</div>
                    )
                }
            });
    }, [groups, openGroups, items])
    return (
        <div>
            <div style={{marginBottom: '10px'}}>
                <button onClick={() => setView('day')}>Day View</button>
                <button onClick={() => {
                    const start =  moment().startOf('week');
                    const end = moment(start).add(1, 'week');
                    setVisibleTime({start, end})
                } }>Week View</button>
                <button onClick={() => setView('month')}>Month View</button>
                <button onClick={() => setView('year')}>Year View</button>
            </div>
            {view &&
                <Timeline
                    groups={newGroups()}
                    items={items}
                    defaultTimeStart={timeRange.defaultTimeStart}
                    defaultTimeEnd={timeRange.defaultTimeEnd}
                    canMove={true}
                    canResize={'both'}
                    lineHeight={30}
                    // visibleTimeStart={visibleTime.start}
                    // visibleTimeEnd={visibleTime.end}
                    onItemMove={(itemId, dragTime, newGroupOrder) => {
                        const updatedItems = items.map(item =>
                            item.id === itemId
                                ? {
                                    ...item,
                                    start_time: moment(dragTime),
                                    end_time: moment(dragTime).add(item.end_time.diff(item.start_time), 'milliseconds'),
                                    group: groups[newGroupOrder].id
                                }
                                : item
                        );
                        setItems(updatedItems);
                    }}
                    onItemResize={(itemId, time, edge) => {
                        const updatedItems = items.map(item =>
                            item.id === itemId
                                ? edge === 'left'
                                    ? {...item, start_time: moment(time)}
                                    : {...item, end_time: moment(time)}
                                : item
                        );
                        setItems(updatedItems);
                    }}
                    itemRenderer={customItemRenderer}
                >
                    {/*<TimelineHeaders*/}
                    {/*    style={{*/}
                    {/*        backgroundColor: '#FFF', // Set header background color*/}
                    {/*        color: 'black', // Set header text color*/}
                    {/*        border: '0px'*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <SidebarHeader>*/}
                    {/*        {({ getRootProps }) => {*/}
                    {/*            return (*/}
                    {/*                <Stack bgcolor={'#FFF'} color={'black'} alignItems={'center'} justifyContent={'center'}*/}
                    {/*                    {...getRootProps({*/}
                    {/*                        style: {*/}
                    {/*                            padding: '10px',*/}
                    {/*                            fontWeight: 'bold',*/}

                    {/*                        }*/}
                    {/*                    })}*/}
                    {/*                >*/}
                    {/*                    Stations*/}
                    {/*                </Stack>*/}
                    {/*            );*/}
                    {/*        }}*/}
                    {/*    </SidebarHeader>*/}

                    {/*    <DateHeader*/}
                    {/*        unit="primaryHeader"*/}
                    {/*        labelFormat="MMM D, YYYY"*/}
                    {/*        intervalRenderer={({ getIntervalProps, intervalContext }) => {*/}
                    {/*            return (*/}
                    {/*                <Stack bgcolor={'#FFF'} height={'100%'} alignItems={'center'} justifyContent={'center'}*/}
                    {/*                    {...getIntervalProps({*/}
                    {/*                        style: {*/}
                    {/*                            color: 'black', // Text color for primary date header*/}
                    {/*                            fontWeight: 'bold',*/}
                    {/*                            border: 0*/}
                    {/*                        },*/}
                    {/*                    })}*/}
                    {/*                >*/}
                    {/*                    {intervalContext.intervalText}*/}
                    {/*                </Stack>*/}
                    {/*            );*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*    <DateHeader*/}
                    {/*        unit="day"*/}
                    {/*        labelFormat="D MMM"*/}
                    {/*        intervalRenderer={({ getIntervalProps, intervalContext }) => {*/}
                    {/*            return (*/}
                    {/*                <div*/}
                    {/*                    {...getIntervalProps({*/}
                    {/*                        style: {*/}
                    {/*                            backgroundColor: '#FFF', // Background color for secondary date header (days)*/}
                    {/*                            color: '#000', // Text color for secondary date header*/}
                    {/*                            padding: '5px',*/}
                    {/*                            textAlign: 'center',*/}
                    {/*                            border: 0*/}
                    {/*                        },*/}
                    {/*                    })}*/}
                    {/*                >*/}
                    {/*                    {intervalContext.intervalText}*/}
                    {/*                </div>*/}
                    {/*            );*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</TimelineHeaders>*/}
                </Timeline>
            }
        </div>
    );
};

export default TimelinePage;
