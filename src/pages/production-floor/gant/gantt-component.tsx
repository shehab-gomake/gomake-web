// pages/timeline.js
import React, {useCallback, useEffect, useState} from 'react';
import Timeline from 'react-calendar-timeline';
import moment from 'moment';
import StartOf = moment.unitOfTime.StartOf;
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Stack from "@mui/material/Stack";
const TimelinePage = () => {
    const [view, setView] = useState<StartOf>('week'); // Default to week view
    const [timeRange, setTimeRange] = useState({
        defaultTimeStart: moment().startOf(view),
        defaultTimeEnd: moment().endOf(view),
    });
    const [openGroups, setOpenGroups] = useState({});
    const [groups] = useState([
        {id: 1, title: 'station 1', isRoot: true, parent: null, isOpen: false},
        {id: 2, title: 'machine 1', isRoot: false, parent: 1, isOpen: false},
        {id: 3, title: 'machine 2', isRoot: false, parent: 1, isOpen: false},
        {id: 4, title: 'machine 3', isRoot: false, parent: 1, isOpen: false},
        {id: 5, title: 'machine 4', isRoot: false, parent: 1, isOpen: false},
        {id: 6, title: 'station 2', isRoot: true, parent: null, isOpen: false},
        {id: 7, title: 'machine 1', isRoot: false, parent: 6, isOpen: false},
        {id: 8, title: 'machine 2', isRoot: false, parent: 6, isOpen: false},
        {id: 9, title: 'machine 3', isRoot: false, parent: 6, isOpen: false},
        {id: 10, title: 'machine 4', isRoot: false, parent: 6, isOpen: false},

    ]);
    const [items, setItems] = useState([
        {
            id: 3,
            group: 2,
            title: 'Item 1',
            start_time: moment().add(0, 'days'),
            end_time: moment().add(1, 'days'),
        },
        {
            id: 2,
            group: 3,
            title: 'Item 2',
            start_time: moment().add(2, 'days'),
            end_time: moment().add(3, 'days')
        }
    ]);

    useEffect(() => {
            switch (view) {
                case 'day':
                    setTimeRange({
                        defaultTimeStart: moment().startOf('day'),
                        defaultTimeEnd: moment().endOf('day'),
                    });
                    break;
                case 'week':
                    setTimeRange({
                        defaultTimeStart: moment().startOf('week'),
                        defaultTimeEnd: moment().endOf('week'),
                    });
                    break;
                case 'month':
                    setTimeRange({
                        defaultTimeStart: moment().startOf('month'),
                        defaultTimeEnd: moment().endOf('month'),
                    });
                    break;
                case 'year':
                    setTimeRange({
                        defaultTimeStart: moment().startOf('year'),
                        defaultTimeEnd: moment().endOf('year'),
                    });
                    break;
                default:
                    setTimeRange({
                        defaultTimeStart: moment().startOf('week'),
                        defaultTimeEnd: moment().endOf('week'),
                    });
            }

    }, [view]); // Re-run when `view` changes

    const toggleGroup = id => {
        setOpenGroups(prevState => ({...prevState, [id]: !prevState[id]}))
    };

    const newGroups = useCallback(() => {
        return groups.filter(g => g.isRoot || openGroups[g.parent])
            .map(group => {
                return {
                    ...group,
                    title: group.isRoot ? (
                        <Stack bgcolor={'red'} onClick={() => toggleGroup(group.id)} direction={'row'} alignItems={'center'} style={{ cursor: "pointer" }}>
                            {openGroups[group.id] ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>} {group.title}
                        </Stack>
                    ) : (
                        <div style={{ paddingLeft: 20 }}>{group.title}</div>
                    )
                }
            });
    }, [groups, openGroups, items])
    return (
        <div>
            <div style={{marginBottom: '10px'}}>
                <button onClick={() => setView('day')}>Day View</button>
                <button onClick={() => setView('week')}>Week View</button>
                <button onClick={() => setView('month')}>Month View</button>
                <button onClick={() => setView('year')}>Year View</button>
            </div>
            <h1>My React Calendar Timeline</h1>
            { view &&
            <Timeline
                groups={newGroups()}
                items={items}
                defaultTimeStart={timeRange.defaultTimeStart}
                defaultTimeEnd={timeRange.defaultTimeEnd}
                canMove={true}
                canResize={'both'}
                lineHeight={50}
                onItemMove={(itemId, dragTime, newGroupOrder) => {
                    const updatedItems = items.map(item =>
                        item.id === itemId
                            ? {...item, start_time: moment(dragTime), end_time: moment(dragTime).add(10, 'hour'), group: groups[newGroupOrder].id}
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
            />
            }
        </div>
    );
};

export default TimelinePage;
