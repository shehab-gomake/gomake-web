import {useRecoilState} from "recoil";
import { getAllDocumentNumbersApi , updateDocumentNumber } from "@/services/api-service/documenting/document-numbering-api";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation} from "react-i18next";
import { openModalState ,documentState , documentsArrayState} from "../state/documents-state";
import { ShowDocumentData } from "./components/show-document-data";
import { useStyle } from "./style";
import { useSnackBar } from "@/hooks";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useDocumentNumbers = () => {
    const {alertFaultUpdate, alertSuccessUpdate} = useSnackBar();
    const { callApi } = useGomakeAxios();
    const { classes } = useStyle();
    const {t} = useTranslation();
    const { primaryColor } = useGomakeTheme();

    const [openModal, setOpenModal] = useRecoilState<boolean>(openModalState);
    const tableHeaders = [
        t('documentingSettings.name'),
        t('documentingSettings.prefix'),
        t('documentingSettings.value'),
        t('documentingSettings.details'),
        t('documentingSettings.edit'),
    ];

    const [documentsNumbers, setDocumentsNumbers] = useRecoilState<[]>(documentsArrayState);
    const getAllDocumentsNumbers = () => {
        const callBackFunction = (data) => {
            if (data.success) {
                const tableRows = data.data?.map((document) => [
                    document.documentName,
                    document.prefix,
                    document.value,
                    document.nextValue,
                    ShowDocumentData(document, primaryColor(500), setOpenModal , setDocument , t('documentingSettings.edit')),
                ]);
                setDocumentsNumbers(tableRows);
            }
        }
        getAllDocumentNumbersApi(callApi, callBackFunction).then();
    }

    const [document, setDocument] = useRecoilState<{}>(documentState);
    const onUpdateDocument = async (document) => {
        const callback = (data) => {
            if (data.success) {
                alertSuccessUpdate();
                getAllDocumentsNumbers();
                // not sure 
                setOpenModal(!openModal)
            } else {
                alertFaultUpdate();
            }
        }
        await updateDocumentNumber(callApi, callback, document);
    }

    return {
        getAllDocumentsNumbers,
        documentsNumbers,
        setDocumentsNumbers,
        document,
        setDocument,
        tableHeaders,
        openModal,
        setOpenModal,
        onUpdateDocument
    }
}

export {useDocumentNumbers}
