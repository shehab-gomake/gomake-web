import { QrCodeAction } from "@/enums";
import { handleBoardMissionsBarcodeActions, handleBoardMissionsBarcodeActionsApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import { useSnackBar } from "./use-snack-bar";
import { useModal } from "./use-modal";
import { selectedMissionsState } from "@/widgets/production-floor/state/boards";
import { useRecoilState } from "recoil";
import { boardMissionsStationsState } from "@/widgets/production-floor/views/board-missions-view/stations/state";

export enum QR_CODE_LISTENER_FROM {
  PRODUCTION_FLOOR = "productionFloor",
  QUOTES = "quotes",
  JOBS = "jobs"
}

interface UseQrCodeListenerProps {
  qrCodeListenerFrom: QR_CODE_LISTENER_FROM;
}

const useQrCodeListener = ({ qrCodeListenerFrom }: UseQrCodeListenerProps) => {

  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const isOpenDoneModal = useModal()
  const [selectedMission, setSelectedMission] = useRecoilState<any>(selectedMissionsState);

  const [stations, setStations] = useRecoilState(boardMissionsStationsState);
  
  const handleBoardMissionsBarcodeActionsFunction = async (barcode: string, data: any) => {
    
    return new Promise(async (resolve, reject) => {
      barcode = barcode.replace(/½/g, '-');
      const callBack = (res) => {
        if (res?.success) {
          if(res?.data?.isLastStation){
            isOpenDoneModal.open()
          }
          alertSuccessUpdate();
        } 
        else {
          alertFaultUpdate();
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
          if (qrCodeListenerFrom === QR_CODE_LISTENER_FROM.PRODUCTION_FLOOR && router.asPath.includes("boardMissionsId")) {
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
        }
        resolve(true);
      };
      await handleBoardMissionsBarcodeActionsApi(callApi, callBack, {
        barcode
      });
    });
  };

  const [barcode, setBarcode] = useState('');
  const [scanBuffer, setScanBuffer] = useState('');
  //const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isProcessingBarCode = false;
    const handleKeyDown = async (event: KeyboardEvent) => {
      // Check if we're on boardMissionsId route and stations are empty
      if (router.asPath.includes("boardMissionsId")) {
        if (!stations || stations.length === 0) {
          // Don't listen to QR code scanning if no stations
          return;
        }
      }

      // Skip if user is typing in an input field, textarea, or contenteditable
      const target = event.target as HTMLElement;
      if (target?.tagName === 'INPUT' || 
          target?.tagName === 'TEXTAREA' || 
          target?.contentEditable === 'true' ||
          target?.isContentEditable) {
        return;
      }
      if(isProcessingBarCode){
        return;
      }
      // Clear previous timeout if exists
      /*if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }*/

      // Handle Enter key for scan completion
      if (event.key === 'Enter' && scanBuffer.length > 0) {
        setBarcode(scanBuffer);
        isProcessingBarCode = true;
        await handleBoardMissionsQRCodeAction(scanBuffer);
        setScanBuffer('');
        isProcessingBarCode = false;
        return;
      }

      // Only process printable characters and ignore modifier keys
      if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        setScanBuffer((prevBuffer) => prevBuffer + event.key);
        // Prevent the character from being typed in the page
        event.preventDefault();
      }

      // Set timeout to detect end of scanner input
      /*timeoutIdRef.current = setTimeout(() => {
        setScanBuffer('');
      }, 100);*/
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      /*if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }*/
    };
  }, [scanBuffer, stations, router.asPath]); // Added stations and router.asPath to dependencies

  return {
    barcode,
    isOpenDoneModal
  };
};

export { useQrCodeListener };