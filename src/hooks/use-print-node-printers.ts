import {useGomakeAxios} from "@/hooks/use-gomake-axios";
import {useRecoilState, useRecoilValue} from "recoil";
import {printNodePrintersState} from "@/store/print-node-printers-state";
import {getAllPrintersFromPrintNodeApi} from "@/services/api-service/print-node/print-node-endpoints";
import {useEffect} from "react";
import {printHouseUsePrintNode} from "@/store/print-house-profile";

const usePrintNodePrinters = () => {
    const {callApi} = useGomakeAxios();
    const [state, setState] = useRecoilState(printNodePrintersState);
    const  isPrintHouseUsePrintNode = useRecoilValue(printHouseUsePrintNode);

    const getPrinterById = (printerId: number) => {
        return state.find(printer => printer.printerId === printerId)
    }
    const getPrinterBins = (printerId: number): string[] => {
        const printer = getPrinterById(printerId);
        return printer ? printer.bins : [];
    }

    const getPrinterNameByPrinterId = (printerId: number): string => {
        const printer = getPrinterById(printerId);
        return printer ? printer.printerName : '';
    }
    const callBack = (res) => {
        if (res.success) {
            setState(res.data?.map(printer => ({...printer, label: printer.printerName})));
        }
    }
    const getPrintNodePrinter = async () => {
        await getAllPrintersFromPrintNodeApi(callApi, callBack)
    }
    useEffect(() => {
        if (isPrintHouseUsePrintNode) {
            getPrintNodePrinter().then();
        }

    }, [isPrintHouseUsePrintNode]);
    return {
        printers: state,
        isPrintHouseUsePrintNode,
        getPrinterBins,
        getPrinterNameByPrinterId
    }
}

export {usePrintNodePrinters}