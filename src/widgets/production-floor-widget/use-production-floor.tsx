import {useCallback, useEffect, useState} from "react";
import {IBoard, ICurrentStation} from "@/widgets/production-floor-widget/interface";
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
import {useDateFormat} from "@/hooks/use-date-format";
import {useProductionFloorSignalr} from "@/hooks/signalr/use-production-floor-signalr";

const useProductionFloor = () => {
    const {callApi} = useGomakeAxios();
    const {GetDateFormat} = useDateFormat();
    const [workJobs, setWorkJobs] = useRecoilState(workJobsState);
    const {query} = useRouter();
    const statuses = useRecoilValue(productionStatusesState);
    const [load, setLoad] = useState(false)
    const data = useProductionFloorSignalr();
    const product = useCallback(() => {
        if (!!query?.productId && workJobs.length > 0) {
            const workJob = workJobs.find(job => job.id === query.productId)
            return !!workJob ? workJob : {} as IBoard
        }
        return {} as IBoard
    }, [query, workJobs])
    useEffect(()=>console.log(data),[data])
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
        {id: '10', name: 'demo10', checked: true}]
    const mockData :IBoard[] = [
        {
            id: "3123",
            currentStation: {
                name:'Cutting',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "D7781",
            orderNumber: "O-124888",
            orderId: "string",
            jobName: "Books",
            productName: "Books",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.IN_PROCESS,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["#cover"],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "5122",
            currentStation: {
                name:'Printing',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "DB8981",
            orderNumber: "O-124890",
            orderId: "string",
            jobName: "Business card",
            productName: "Business card",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.DONE,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "88991",
            currentStation: {
                name:'Finish',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "DB8983",
            orderNumber: "O-124890",
            orderId: "string",
            jobName: "Stickers",
            productName: "Stickers",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.WAITING,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "512112",
            currentStation: {
                name:'Printing',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "F8985",
            orderNumber: "O-124892",
            orderId: "string",
            jobName: "Rolls",
            productName: "Rolls",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.STUCK,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "988122",
            currentStation: {
                name:'Pre printing',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "F8986",
            orderNumber: "O-124892",
            orderId: "string",
            jobName: "Foil",
            productName: "Foil",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.WAITING,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "6612",
            currentStation: {
                name:'Packaging',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "X8312",
            orderNumber: "O-124597",
            orderId: "string",
            jobName: "Magnet",
            productName: "Magnet",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.IN_PROCESS,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "55323",
            currentStation: {
                name:'Cutting',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "D7783",
            orderNumber: "O-124869",
            orderId: "string",
            jobName: "Books",
            productName: "Books",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.IN_PROCESS,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["#cover"],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "55215",
            currentStation: {
                name:'Printing',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "DB8983",
            orderNumber: "O-124892",
            orderId: "string",
            jobName: "Business card",
            productName: "Business card",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.WAITING,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "656556",
            currentStation: {
                name:'Printing',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "DB8987",
            orderNumber: "O-124890",
            orderId: "string",
            jobName: "Stickers",
            productName: "Stickers",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.STUCK,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "553523",
            currentStation: {
                name:'Printing',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "F8987",
            orderNumber: "O-124865",
            orderId: "string",
            jobName: "Rolls",
            productName: "Rolls",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.DONE,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "6643434",
            currentStation: {
                name:'Graphics',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "F8977",
            orderNumber: "O-124854",
            orderId: "string",
            jobName: "Foil",
            productName: "Foil",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.DONE,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "53322",
            currentStation: {
                name:'Finish',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "X8344",
            orderNumber: "O-124567",
            orderId: "string",
            jobName: "Magnet",
            productName: "Magnet",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.WAITING,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "662223",
            currentStation: {
                name:'Printing',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "F8960",
            orderNumber: "O-124886",
            orderId: "string",
            jobName: "Rolls",
            productName: "Rolls",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.STUCK,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "553222",
            currentStation: {
                name:'Pre printing',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "F8955",
            orderNumber: "O-124854",
            orderId: "string",
            jobName: "Foil",
            productName: "Foil",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.DONE,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        },
        {
            id: "53523",
            currentStation: {
                name:'Packaging',
                id:'',
                actionId:'',
                machineId:"",
                employeeId:""
            },
            boardMissionNumber: "X8332",
            orderNumber: "O-1245997",
            orderId: "string",
            jobName: "Magnet",
            productName: "Magnet",
            productId: "string",
            clientName: "string",
            clientId: "string",
            statusId: EStatus.STUCK,
            actionDueDate: new Date(),
            dueDate: new Date(),
            creationDate: new Date(),
            stationInDate: new Date(),
            tags: ["",""],
            workOrder:"",
            startDate:new Date(),
            checked: false
        }
    ]
    const getWorkJobs = async () => {
        /*const callBack = (res) => {
            if (res.success) {
                const add = [...workJobs, ...res.data.map(bordMission => ({...bordMission, checked: false}))]
                setWorkJobs(add);
                setLoad(false)
            }
        };
        if (!load) {
            setLoad(true)
         await getAllWorkJobsApi(callApi, callBack);
        }*/
        setWorkJobs(mockData)
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
                    GetDateFormat(workJob.stationInDate),
                    GetDateFormat(workJob.actionDueDate),
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