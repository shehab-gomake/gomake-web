
import BarcodeReader from 'react-barcode-reader'
import { useState } from "react";
import {
    handleBoardMissionsBarcodeActions,
    handleBoardMissionsBarcodeActionsApi, moveBoardMissionToDoneApi
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { ModalType, QrCodeAction } from "@/enums";
import { QR_CODE_LISTENER_FROM } from "@/hooks/use-qr-code-listener";
import { useRecoilState } from "recoil";
import { selectedMissionsState } from "@/widgets/production-floor/state/boards";
import { boardMissionsStationsState } from "@/widgets/production-floor/views/board-missions-view/stations/state";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from 'react-i18next';
import { GoMakeAlertModal } from "../modal/alert-modal";
import { ThreeOptionsModal } from "@/components";
import {
    PrintPackingSlipModalWidget
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { useIsMobile } from "@/hooks/use-responsive";

interface IProps {
    qrCodeListenerFrom: QR_CODE_LISTENER_FROM;
    onIsLastStationDetect?: () => void;
}
const QrCodeReader = (props: IProps) => {
    const { t } = useTranslation();
    const { alertSuccessUpdate, alertFault, alertFaultUpdate } = useSnackBar();
    const { callApi } = useGomakeAxios();
    const router = useRouter();
    const isMobile = useIsMobile();
    const [selectedMission, setSelectedMission] = useRecoilState<any>(selectedMissionsState);
    const [stations, setStations] = useRecoilState(boardMissionsStationsState);
    const [myState, setMyState] = useState("helll");
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [deliveryQRData, setDeliveryQRData] = useState<any>(null);
    const [openMarkReadyModal, setOpenMarkReadyModal] = useState<boolean>(false);
    const [openPackagesModal, setOpenPackagesModal] = useState<boolean>(false);
    const [openMoveToReadyModal, setOpenMoveToReadyModal] = useState<boolean>(false);
    const [selectedJobQuantity, setSelectedJobQuantity] = useState<number | null>(null);
    const handleBoardMissionsBarcodeActionsFunction = async (barcode: string, data: any) => {

        return new Promise(async (resolve, reject) => {
            barcode = barcode.replace(/½/g, '-');
            const callBack = (res) => {
                if (res?.success) {
                    if (res?.data?.isLastStation) {
                        //isOpenDoneModal.open()
                        if (props?.onIsLastStationDetect) {
                            props.onIsLastStationDetect();
                        }
                    }
                    alertSuccessUpdate();
                }
                else {
                    alertFault(t("productionFloor.qrReadError"))
                }
                resolve(true)
            };
            await handleBoardMissionsBarcodeActions(callApi, callBack, {
                barcode
            });
        })
    };

    const handleDeliveryQRCode = (qrData: any) => {
        if (deliveryQRData && deliveryQRData.orderId === qrData.orderId) {
            // User has already seen the warning for this QR code, proceed to order page
            const url = `/orders?orderId=${qrData?.orderId}&clientId=${qrData?.clientId}&orderNumber=${qrData?.orderNumber}&isComeFromQR=true`;
            router.push(url);
        } else {
            // First time scanning this delivery QR code, show warning
            setDeliveryQRData(qrData);
            setIsDeliveryModalOpen(true);
        }
    };

    const handleBoardMissionsQRCodeAction = async (barcode: string) => {
        return new Promise(async (resolve, reject) => {
            barcode = barcode.replace(/½/g, '-');
            const callBack = async (res) => {
                setSelectedMission(res?.data);
                if (res?.success) {
                    if (props.qrCodeListenerFrom === QR_CODE_LISTENER_FROM.PRODUCTION_FLOOR && router.asPath.includes("boardMissionsId")) {
                        const currentBoardMissionId = (router.query as any)?.boardMissionsId;
                        if (res?.data?.qrCodeAction === QrCodeAction.START) {
                            // If a different job START is scanned while a job modal is open, navigate to the new job
                            if (currentBoardMissionId && String(currentBoardMissionId) !== String(res?.data?.boardMissionId)) {
                                const url = `/production-floor?boardMissionsId=${res?.data?.boardMissionId}${res?.data?.productType ? `&productType=${res?.data?.productType}` : ""}&step=stations`;
                                router.push(url);
                            } else {
                                if (stations?.length > 0) {
                                    await handleBoardMissionsBarcodeActionsFunction(barcode, res?.data);
                                }
                            }
                        } else if (res?.data?.qrCodeAction === QrCodeAction.FINISH) {
                            if (stations?.length > 0) {
                                await handleBoardMissionsBarcodeActionsFunction(barcode, res?.data);
                            }
                        } else if (res?.data?.qrCodeAction === QrCodeAction.DELIVERY) {
                            setSelectedJobQuantity(res?.data?.quantity);
                            setOpenMoveToReadyModal(true)
                        }
                    }
                    else {
                        if (res?.data?.qrCodeAction === QrCodeAction.START || res?.data?.qrCodeAction === QrCodeAction.FINISH) {
                            const url = `/production-floor?boardMissionsId=${res?.data?.boardMissionId}${res?.data?.productType ? `&productType=${res?.data?.productType}` : ""}&step=stations`;
                            router.push(url);
                        }
                        else {
                            if (res?.data?.qrCodeAction === QrCodeAction.DELIVERY) {
                                setSelectedJobQuantity(res?.data?.quantity);
                                setOpenMoveToReadyModal(true)
                            }
                        }
                    }
                } else {
                    alertFault(t("productionFloor.qrReadError"))
                }
                resolve(true);
            };
            await handleBoardMissionsBarcodeActionsApi(callApi, callBack, {
                barcode
            });
        });
    };
    const handleScan = async (data) => {
        await handleBoardMissionsQRCodeAction(data);
    }
    const handleError = (err) => {
        console.error(err)
    }

    const handleModalConfirm = () => {
        setIsDeliveryModalOpen(false);
        if (deliveryQRData) {
            const url = `/orders?orderId=${deliveryQRData?.orderId}&clientId=${deliveryQRData?.clientId}&orderNumber=${deliveryQRData?.orderNumber}&isComeFromQR=true`;
            router.push(url);
        }
    };
    const onClickMoveBoardMissionToDone = async (sendMessage: boolean) => {
        const callBack = (res) => {
            setOpenMarkReadyModal(false);
            if (res?.success) {
                alertSuccessUpdate();
                if (
                    selectedMission.productType === "" ||
                    !selectedMission.productType
                ) {
                    setOpenPackagesModal(true);
                }
                // handleRemoveBoardMission(selectedMissionId);
            } else {
                alertFaultUpdate();
            }
        };
        await moveBoardMissionToDoneApi(callApi, callBack, {
            boardMissionId: selectedMission.id || selectedMission.boardMissionId,
            sendMessage,
            productType: selectedMission.productType ?? "",
            storage: selectedMission.storage ?? "",
        });
    };

    return (
        <div>
            <BarcodeReader
                onError={handleError}
                onScan={handleScan}
            />
            <GoMakeAlertModal
                openModal={isDeliveryModalOpen}
                onClose={() => setIsDeliveryModalOpen(false)}
                title={t("delivery")}
                subTitle={t("productionFloor.deliveryQrCodeError")}
                onClickConfirm={handleModalConfirm}
                yesBtn="modal.ok"
                withCancelBtn={true}
            />
            <ThreeOptionsModal
                modalType={ModalType.WARNING}
                title={t("boardMissions.markDoneModalTitle")}
                subTitle={t("boardMissions.markDoneModalSubTitle")}
                yesBtn={"boardMissions.markDoneModalYes"}
                noBtn={"boardMissions.markDoneModalNo"}
                openModal={openMoveToReadyModal}
                onClose={() => setOpenMoveToReadyModal(false)}
                onClickYes={() => onClickMoveBoardMissionToDone(true)}
                onClickNo={() => onClickMoveBoardMissionToDone(false)}
                style={
                    isMobile
                        ? {
                            width: "95vw",
                            maxWidth: 600,
                            minWidth: "unset",
                        }
                        : undefined
                }
            />
            <PrintPackingSlipModalWidget
                openModal={openPackagesModal}
                onClose={() => setOpenPackagesModal(false)}
                boardMissionId={selectedMission?.id || selectedMission?.boardMissionId}
                quantity={selectedJobQuantity}
            />
        </div>
    )
}
export default QrCodeReader;