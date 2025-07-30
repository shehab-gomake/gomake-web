
import BarcodeReader from 'react-barcode-reader'
import {useState} from "react";
import {
    handleBoardMissionsBarcodeActions,
    handleBoardMissionsBarcodeActionsApi
} from "@/services/api-service/production-floor/production-floor-endpoints";
import {QrCodeAction} from "@/enums";
import {QR_CODE_LISTENER_FROM} from "@/hooks/use-qr-code-listener";
import {useRecoilState} from "recoil";
import {selectedMissionsState} from "@/widgets/production-floor/state/boards";
import {boardMissionsStationsState} from "@/widgets/production-floor/views/board-missions-view/stations/state";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRouter} from "next/router";
import {useModal} from "@/hooks/use-modal";
interface IProps {
    qrCodeListenerFrom: QR_CODE_LISTENER_FROM;
    onIsLastStationDetect?:()=>void;
}
const QrCodeReader = (props:IProps)=>{
    const { alertSuccessUpdate, alertFault } = useSnackBar();
    const { callApi } = useGomakeAxios();
    const router = useRouter();
    const [selectedMission, setSelectedMission] = useRecoilState<any>(selectedMissionsState);
    const [stations, setStations] = useRecoilState(boardMissionsStationsState);
    const [myState,setMyState] = useState("helll");
    const handleBoardMissionsBarcodeActionsFunction = async (barcode: string, data: any) => {

        return new Promise(async (resolve, reject) => {
            barcode = barcode.replace(/½/g, '-');
            const callBack = (res) => {
                if (res?.success) {
                    if(res?.data?.isLastStation){
                        //isOpenDoneModal.open()
                        if(props?.onIsLastStationDetect){
                            props.onIsLastStationDetect();
                        }
                    }
                    alertSuccessUpdate();
                }
                else {
                    alertFault("Dected qr code in not valid")
                }
                resolve(true)
            };
            await handleBoardMissionsBarcodeActions(callApi, callBack, {
                barcode
            });
        })
    };

    const handleBoardMissionsQRCodeAction = async (barcode: string) => {
        return new Promise(async (resolve, reject) => {
            barcode = barcode.replace(/½/g, '-');
            const callBack = async (res) => {
                setSelectedMission(res?.data);
                if (res?.success) {
                    if (props.qrCodeListenerFrom === QR_CODE_LISTENER_FROM.PRODUCTION_FLOOR && router.asPath.includes("boardMissionsId")) {
                        if (res?.data?.qrCodeAction === QrCodeAction.START || res?.data?.qrCodeAction === QrCodeAction.FINISH) {
                            if(stations?.length > 0){
                                await handleBoardMissionsBarcodeActionsFunction(barcode, res?.data);
                            }
                        }
                        else {
                            if(res?.data?.qrCodeAction === QrCodeAction.DELIVERY){
                                const url = `/orders?orderId=${res?.data?.orderId}&clientId=${res?.data?.clientId}&orderNumber=${res?.data?.orderNumber}&isComeFromQR=true`;
                                router.push(url);
                            }

                        }
                    }
                    else {
                        if (res?.data?.qrCodeAction === QrCodeAction.START || res?.data?.qrCodeAction === QrCodeAction.FINISH) {
                            const url = `/production-floor?boardMissionsId=${res?.data?.boardMissionId}${res?.data?.productType ? `&productType=${res?.data?.productType}` : ""}&step=stations`;
                            router.push(url);
                        }
                        else {
                            if(res?.data?.qrCodeAction === QrCodeAction.DELIVERY){
                                const url = `/orders?orderId=${res?.data?.orderId}&clientId=${res?.data?.clientId}&orderNumber=${res?.data?.orderNumber}&isComeFromQR=true`;
                                router.push(url);
                            }
                        }
                    }
                }else{
                    alertFault("Dected qr code in not valid")
                }
                resolve(true);
            };
            await handleBoardMissionsBarcodeActionsApi(callApi, callBack, {
                barcode
            });
        });
    };
    const handleScan = async (data)=>{
        console.log("handleScan", data);
        await handleBoardMissionsQRCodeAction(data);
    }
    const handleError = (err)=>{
        console.error(err)
    }
    return (
        <div>
            <BarcodeReader
                onError={handleError}
                onScan={handleScan}
            />
        </div>
    )
}
export default QrCodeReader;