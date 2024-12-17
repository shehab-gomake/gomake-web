import {useState} from "react";
import moment from "moment";
import {getTimeLineJobsApi, updateJobTimeApi} from "@/services/api-service/jobs-time-line/jobs-time-line-endpoints";
import {useGomakeAxios} from "@/hooks";

const useGantt = () => {
    const {callApi} = useGomakeAxios();

    const [timeRange, setTimeRange] = useState({
        defaultTimeStart: moment().startOf("hour"),
        defaultTimeEnd: moment().endOf("hour"),
    });

    const [openGroups, setOpenGroups] = useState({});
    const [groups, setGroups] = useState([]);
    const [items, setItems] = useState([]);

    const getData = async (month) => {
        const startOfMonth = moment().month(month).startOf("month").toISOString();
        const endOfMonth = moment().month(month).endOf("month").toISOString();

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
                startDate: updatedItem.start_time,
                endDate: moment(time)
            })
        }
        const updatedItems = items.map((item) =>
            item.id === itemId
                ? edge === "left"
                    ? { ...item, start_time: moment(time) }
                    : { ...item, end_time: moment(time) }
                : item
        );
        setItems(updatedItems);
    };

    const handleItemMove = async (itemId, dragTime, newGroupOrder) => {
        const updatedItem = items.find(j => j.id === itemId);
        if (updatedItem ) {
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
        handleItemMove
    };
};

export {useGantt};
