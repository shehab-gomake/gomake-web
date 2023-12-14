import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import config from "@/config";
import {IBoard, IProductionStatus} from "@/widgets/production-floor-widget/interface";
import {useState} from "react";

export interface IProductionSignalRResponse {
    boardMissionStatusFilter: IProductionStatus[];
    boardMissions: IBoard[]
}
const useProductionFloorSignalr = () => {
    const [appendData, setAppendData] = useState<IProductionSignalRResponse>(null)
    const {data, connection} = useGoMakeSignalr<IProductionSignalRResponse>({
        accessToken: getUserToken(),
        url: config.erp_server + '/hubs/boardMissions',
        methodName: "AddBoardMissions"
    })
    connection?.on('AppendBoardMissions', (newData) => {
        setAppendData(newData);
        console.log(newData);
    });
    return {
        data,
        connection,
        appendData
    }
};
export {useProductionFloorSignalr}