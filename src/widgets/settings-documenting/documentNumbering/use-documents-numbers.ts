import {useRecoilState} from "recoil";

import { getAllDocumentNumbersApi } from "@/services/api-service/documenting/document-numbering-api";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation} from "react-i18next";
import { editOpenModalState ,documentState , documentsArrayState} from "../state/documents-state";
import { ShowDocumentData } from "./components";

const useDocuments = () => {
    const { callApi } = useGomakeAxios();
    const {t} = useTranslation();

    const tableHeaders = [
        t('documentingSettings.name'),
        t('documentingSettings.prefix'),
        t('documentingSettings.value'),
        t('documentingSettings.details'),
        t('documentingSettings.edit'),
    ];

    const [openModal, setOpenModal] = useRecoilState<boolean>(editOpenModalState);
    const [document, setDocument] = useRecoilState<{}>(documentState);

    const [documentsNumbers, setDocumentsNumbers] = useRecoilState<[]>(documentsArrayState);
    const getAllDocumentsNumbers = () => {
        const callBackFunction = (data) => {
            if (data.success) {
                const tableRows = data.data?.map((document) => [
                    document.documentName,
                    document.prefix,
                    document.value,
                    document.nextValue,
                    ShowDocumentData(document)   
                             ]);

                setDocumentsNumbers(tableRows);
            }
        }
        getAllDocumentNumbersApi(callApi, callBackFunction).then();
    }


    return {
        getAllDocumentsNumbers,
        documentsNumbers,
        setDocumentsNumbers,
        document,
        setDocument,
        tableHeaders,
        openModal,
        setOpenModal
    }
}

export {useDocuments}