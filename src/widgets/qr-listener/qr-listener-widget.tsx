import React, {useEffect, useMemo, useState} from 'react';
import {
    handleBoardMissionsQrCodeApi, updateBoardMissionsQrCodeApi
} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {barCodeRegex} from "@/utils/regex";
import {useRecoilState} from "recoil";
import {IQrCodeData, qrCodeState, qrDataState} from "@/widgets/qr-listener/state";
import {useRouter} from "next/router";
import {ThreeOptionsModal} from "@/components";
import {PrintPackingSlipModal} from "@/pages-components/board-missions/widgets/print-packing-slip-modal";
import {useTranslation} from "react-i18next";
import {useStyle} from "@/pages-components/board-missions/style";
import {downloadPdf} from "@/utils/helpers";
import {getDeliveryTickerPdfApi} from "@/services/api-service/board-missions-table/board-missions-table";

interface IProps {
    listening: boolean
}

const QrListenerWidget = ({listening}: IProps) => {
        const SCANNER_TYPING_SPEED = 50;
        const {callApi} = useGomakeAxios();
        const {alertFaultUpdate, alertSuccessUpdate, alertFault, alertFaultGetData} = useSnackBar();
        const [inputBuffer, setInputBuffer] = useState('');
        const [lastInputTime, setLastInputTime] = useState(Date.now());
        const [scannedCode, setScannedCode] = useRecoilState(qrCodeState);
        const {push} = useRouter();
        const [qrData, setQrData] = useRecoilState<IQrCodeData>(qrDataState);
        const [openPackagesModal, setOpenPackagesModal] = useState<boolean>(false);
        const [openDeliveryModal, setOpenDeliveryModal] = useState<boolean>(false);
        const [openPrintAndActionModal, setOpenPrintAndActionModal] = useState<boolean>(false);
        const [quantityOfPackages, setQuantityOfPackages] = useState<number>(1);
        const [quantityPerPackage, setQuantityPerPackage] = useState<number>(0);
        const remainingQuantity = qrData?.quantity - quantityPerPackage * (quantityOfPackages - 1);
        const {t} = useTranslation();
        const {classes} = useStyle();

        const onClickPrintPackagingSlip = async () => {
            if (quantityPerPackage > qrData?.quantity) {
                alertFault("boardMissions.alertQuantity");
                return;
            }
            const callBack = (res) => {
                if (res?.success) {
                    const pdfLink = res.data;
                    downloadPdf(pdfLink)
                    setOpenPackagesModal(false);
                } else {
                    alertFaultGetData();
                }
            };
            await getDeliveryTickerPdfApi(callApi, callBack, {
                boardMissionId: qrData.boardMissionId,
                quantityOnPackages: quantityPerPackage
            });
        };
        const packageInputs = useMemo(() => {
            return [...Array(quantityOfPackages)].map((_, index) => (
                <div key={index} style={{width: "40%"}}>
                    <h3 style={classes.packageLabelStyle}>
                        {`${t("boardMissions.package")} ${index + 1}`}
                    </h3>
                    <div style={classes.inputValueStyle}>
                        {
                            index === quantityOfPackages - 1
                                ? remainingQuantity
                                : quantityPerPackage
                        }
                    </div>
                </div>
            ));
        }, [quantityOfPackages, quantityPerPackage, remainingQuantity]);
        const handleQuantityOfPackagesChange = (event) => {
            const newQuantityOfPackages = parseInt(event.target.value, 10);
            const totalQuantity = qrData.quantity || 0;
            const newQuantityPerPackage = Math.ceil(totalQuantity / newQuantityOfPackages);
            setQuantityOfPackages(newQuantityOfPackages);
            setQuantityPerPackage(newQuantityPerPackage);
        };

        const handleQuantityPerPackageChange = (event) => {
            const newQuantityPerPackage = parseInt(event.target.value, 10);
            const totalQuantity = qrData.quantity;
            const newQuantityOfPackages = Math.ceil(totalQuantity / newQuantityPerPackage);
            setQuantityPerPackage(newQuantityPerPackage);
            setQuantityOfPackages(newQuantityOfPackages);
        };
        const handleKeyPress = async (event) => {
            const currentTime = Date.now();
            const timeDifference = currentTime - lastInputTime;
            const isScannerInput = timeDifference < SCANNER_TYPING_SPEED;

            if (event.key === 'Enter') {
                if (barCodeRegex.test(inputBuffer)) {
                    if (inputBuffer === scannedCode) {
                        await updateBoardMissionsQrCode();
                    } else {
                        await handleBoardMissionsQrCode(inputBuffer);
                    }
                }
            } else {
                if (isScannerInput) {
                    setInputBuffer((prevBuffer) => prevBuffer + event.key);
                } else {
                    setInputBuffer(event.key);
                }

                setLastInputTime(currentTime);
            }
        };


        useEffect(() => {
                window.addEventListener('keypress', listening ? handleKeyPress : () => {
                });
                return () => {
                    window.removeEventListener('keypress', listening ? handleKeyPress : () => {
                    });
                };
            }, [inputBuffer, lastInputTime, listening]
        );

        const handleBoardMissionsQrCode = async (qrCode: string) => {
            const callBack = res => {
                if (res.success) {
                    if (res?.data?.qrCodeAction === 3) {
                        setQrData(res?.data)
                        setOpenDeliveryModal(true);
                        setQuantityPerPackage(res?.data?.quantity);
                    } else {
                        setScannedCode(qrCode);
                        setInputBuffer('');
                        setQrData(res?.data)
                        push(`/production-floor?boardMissionsId=${res?.data?.boardMissionId}&productType=${res?.data?.productType}&step=stations`);
                    }
                } else {
                    alertFaultUpdate();
                }
            }
            await handleBoardMissionsQrCodeApi(callApi, callBack, qrCode);
        }


        const updateBoardMissionsQrCode = async () => {
            const callBack = res => {
                if (res.success) {
                    alertSuccessUpdate();
                    setInputBuffer('');
                    setScannedCode('')
                } else {
                    alertFaultUpdate();
                }
            }
            await updateBoardMissionsQrCodeApi(callApi, callBack, qrData);
        }

        return (
            <>
                <ThreeOptionsModal
                    style={{zIndex: 999999}}
                    title={t("qrCode.actionConfirm", {
                        station: qrData.stationName,
                        status: qrData.statusName
                    })}
                    yesBtn={t("qrCode.confirmBtn")}
                    noBtn={''}
                    openModal={!!scannedCode}
                    onClose={() => setScannedCode('')}
                    onClickYes={() => {
                        updateBoardMissionsQrCode().then()
                    }}
                    onClickNo={() => {}}
                />
                <ThreeOptionsModal
                    title={t("boardMissions.printAndMoveToReadyTitle")}
                    yesBtn={t("boardMissions.printAndTransferToReady")}
                    noBtn={t("boardMissions.printOnly")}
                    openModal={openDeliveryModal}
                    onClose={() => setOpenDeliveryModal(false)}
                    onClickYes={() => setOpenPrintAndActionModal(true)}
                    onClickNo={() => setOpenPackagesModal(true)}
                />

                <ThreeOptionsModal
                    title={t("boardMissions.markDoneFromPrintSlipModalTitle")}
                    subTitle={t("boardMissions.markDoneModalSubTitle")}
                    yesBtn={"boardMissions.markDoneModalYes"}
                    noBtn={"boardMissions.markDoneModalNo"}
                    openModal={openPrintAndActionModal}
                    onClose={() => setOpenPrintAndActionModal(false)}
                    onClickYes={() => setOpenPackagesModal(true)}
                    onClickNo={() => setOpenPackagesModal(true)}
                />
                <PrintPackingSlipModal
                    openPackagesModal={openPackagesModal}
                    onClosePackagesModal={() => setOpenPackagesModal(false)}
                    packageInputs={packageInputs}
                    quantityOfPackages={quantityOfPackages}
                    quantityPerPackage={quantityPerPackage}
                    handleQuantityOfPackagesChange={handleQuantityOfPackagesChange}
                    handleQuantityPerPackageChange={handleQuantityPerPackageChange}
                    onClickConfirm={onClickPrintPackagingSlip}
                />
            </>
        );
    }
;

export default QrListenerWidget;