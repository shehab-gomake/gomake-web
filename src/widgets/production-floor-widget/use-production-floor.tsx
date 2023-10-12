import {useCallback, useState} from "react";
import {IBoard} from "@/widgets/production-floor-widget/interface";
import {
    getAllWorkJobsApi,
    updateWorkJobStatusApi
} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";
import {SecondaryCheckBox} from "@/components/check-box/secondary-check-box";
import {TaskCategoryLabel} from "@/widgets/production-floor-widget/components/task-category-label";
import {EStatus, StatusBtn} from "@/widgets/production-floor-widget/components/status-btn";
import {OptionsButton} from "@/components/options-button/options-button";
import Link from "next/link";
import {formatDate} from "tough-cookie";
import {DateFormatterDDMMYYYY} from "@/utils/adapter";
import {useRouter} from "next/router";
import {useRecoilState, useRecoilValue} from "recoil";
import {productionStatusesState, workJobsState} from "@/widgets/production-floor-widget/state";

const useProductionFloor = () => {
    const {callApi} = useGomakeAxios();
    const [workJobs, setWorkJobs] = useRecoilState(workJobsState);
    const {query} = useRouter();
    const statuses = useRecoilValue(productionStatusesState);
    const [load, setLoad] = useState(false)

    const product = useCallback(() => {
        if (!!query?.productId && workJobs.length > 0) {
            const workJob = workJobs.find(job => job.id === query.productId)
            return !!workJob ? workJob : {} as IBoard
        }
        return {} as IBoard
    }, [query, workJobs])
    const tableHeaders = ['', 'jobs', 'task category', 'station', 'status', 'customer', "Station Delivery time", 'Delivery time', 'tags', 'more']
    const demo = [
        {id: '1', name: 'demo1', checked: true},
        {id: '2', name: 'demo2', checked: true},
        {id: '3', name: 'demo3', checked: true},
        {id: '4', name: 'demo4', checked: true},
        {id: '5', name: 'demo5', checked: true},
        {id: '6', name: 'demo6', checked: true},
        {id: '7', name: 'demo7', checked: true},
        {id: '8', name: 'demo8', checked: true},
        {id: '9', name: 'demo9', checked: true},
        {id: '10', name: 'demo10', checked: true},
    ]
    const getWorkJobs = async () => {
        const callBack = (res) => {
            if (res.success) {
                const add = [...workJobs, ...res.data.map(bordMission => ({...bordMission, checked: false}))]
                setWorkJobs(add);
                setLoad(false)
            }
        };
        if (!load) {
            setLoad(true)
         await getAllWorkJobsApi(callApi, callBack);
        }
    }

    const onUpdateStatus = async (id: string, status: EStatus) => {
        const callBack = (res: { success: boolean, data: IBoard }) => {
            if (res.success) {
                setWorkJobs(workJobs.map(job => job.id === id ? res.data : job))
            }
        }
        await updateWorkJobStatusApi(callApi, callBack, {id, status})
    }

    const handleBordMissionChange = (id: string) => {
        setWorkJobs(workJobs.map(mission => mission.id === id ? {...mission, checked: !mission.checked} : mission))
    }

    const getWorkJobsRows = useCallback(() => {
        const checkedStatuses = statuses.filter(status => status.checked).map(status => status.value);
        return workJobs
            .filter(bordMission => checkedStatuses.includes(bordMission.statusId))
            .map(workJob => ({
                checked: workJob.checked,
                values: [
                    <SecondaryCheckBox checked={workJob.checked} onChange={() => handleBordMissionChange(workJob.id)}/>,
                    <Link
                        href={'/production-floor?productId=' + workJob.id}>{`${workJob.boardMissionNumber}\\${workJob.orderNumber}`}</Link>,
                    <TaskCategoryLabel label={workJob.productName}/>,
                    workJob.currentStation.name,
                    <StatusBtn id={workJob.id} onChange={onUpdateStatus} status={workJob.statusId}/>,
                    workJob?.orderNumber.toString(),
                    DateFormatterDDMMYYYY(workJob.stationInDate.toString()),
                    DateFormatterDDMMYYYY(workJob.actionDueDate?.toString()),
                    workJob.tags[0],
                    <OptionsButton><></>
                    </OptionsButton>
                ]
            }))
    }, [workJobs, statuses]);


    return {
        getWorkJobs,
        tableHeaders,
        getWorkJobsRows,
        demo,
        product
    }
}

export {useProductionFloor}