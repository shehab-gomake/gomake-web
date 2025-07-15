import { QrCodeAction } from "@/enums";
import { handleBoardMissionsBarcodeActions, handleBoardMissionsBarcodeActionsApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import { useSnackBar } from "./use-snack-bar";

export enum QR_CODE_LISTENER_FROM {
  PRODUCTION_FLOOR = "productionFloor",
  QUOTES = "quotes",
  JOBS = "jobs"
}

const useQrCodeListener = ({ qrCodeListenerFrom }) => {
  const { callApi } = useGomakeAxios();
  const router =useRouter()
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

  
  const handleBoardMissionsBarcodeActionsFunction = async (barcode: string) => {
    barcode = barcode.replace(/½/g, '-');
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    await handleBoardMissionsBarcodeActions(callApi, callBack, {
      barcode
    });
  };
  
  const handleBoardMissionsQRCodeAction = async (barcode: string) => {
    barcode = barcode.replace(/½/g, '-');
    const callBack = (res) => {
      if (res?.success) {
        if (qrCodeListenerFrom === QR_CODE_LISTENER_FROM.PRODUCTION_FLOOR) {
          if (res?.data?.qrCodeAction === QrCodeAction.START || res?.data?.qrCodeAction === QrCodeAction.FINISH) {
          handleBoardMissionsBarcodeActionsFunction(barcode);
        }
        else {
          const url = `/orders?orderId=${res?.data?.orderId}&clientId=${res?.data?.clientId}&orderNumber=${res?.data?.orderNumber}&isComeFromQR=true`;
          router.push(url);
        }
        }
        else {
          if (res?.data?.qrCodeAction === QrCodeAction.START || res?.data?.qrCodeAction === QrCodeAction.FINISH) {
            const url = `/production-floor?boardMissionsId=${res?.data?.boardMissionId}${res?.data?.productType ? `&productType=${res?.data?.productType}` : ""}&step=stations`;
            router.push(url);
          }
          else {
            const url = `/orders?orderId=${res?.data?.orderId}&clientId=${res?.data?.clientId}&orderNumber=${res?.data?.orderNumber}&isComeFromQR=true`;
            router.push(url);
          }
        }
      }

    };
    await handleBoardMissionsBarcodeActionsApi(callApi, callBack, {
      barcode
    });
  };

  const [barcode, setBarcode] = useState('');
  const [scanBuffer, setScanBuffer] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);
  useEffect(() => {
    /*const handleKeyDown = (event) => {
      // Clear previous timeout if exists
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Detect Enter key for scan completion
      if (event.keyCode === 13 && scanBuffer.length > 0) {
        setBarcode(scanBuffer);
        handleBoardMissionsQRCodeAction(scanBuffer);
        setScanBuffer(''); // Clear buffer for next scan
        return;
      }

      // Append character to buffer
      setScanBuffer((prevBuffer) => prevBuffer + String.fromCharCode(event.keyCode));

      // Set timeout to detect human typing
      const newTimeoutId = setTimeout(() => {
        setScanBuffer(''); // Clear buffer if no further keys are pressed
      }, 100); // Adjust timeout as needed
      setTimeoutId(newTimeoutId);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };*/
  }, [scanBuffer, timeoutId]);

  return {
    barcode
  };
};

export { useQrCodeListener };
