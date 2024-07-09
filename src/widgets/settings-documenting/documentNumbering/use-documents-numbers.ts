import { useRecoilState } from "recoil";
import { getAllDocumentNumbersApi, updateDocumentNumber } from "@/services/api-service/documenting/document-numbering-api";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { openModalState, documentState, documentsArrayState } from "../state/documents-state";
import { ShowDocumentData } from "./components/show-document-data";
import { useSnackBar } from "@/hooks";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { DocumentsTypeEnum, IDocument } from "./interface/document";
import { useState } from "react";

const useDocumentNumbers = () => {
    const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
    const { callApi } = useGomakeAxios();
    const { t } = useTranslation();
    const { primaryColor } = useGomakeTheme();
    const [openModal, setOpenModal] = useRecoilState<boolean>(openModalState);
    const [showTooltip, setShowTooltip] = useState(false);

    const tableHeaders = [
        t('documentingSettings.name'),
        t('documentingSettings.prefix'),
        t('documentingSettings.value'),
        t('documentingSettings.details'),
        t('documentingSettings.edit'),
    ];

    const [documentsNumbers, setDocumentsNumbers] = useRecoilState<[][]>(documentsArrayState);
    const getAllDocumentsNumbers = () => {
        const callBackFunction = (data) => {
            if (data.success) {
                const tableRows = data.data?.map((document) => [
                    t(`documentingNumbering.${DocumentsTypeEnum[document.docType]}`),
                    document.prefix,
                    document.value, 
                    document.details,
                    ShowDocumentData(document, primaryColor(500), setOpenModal, setDocument, t('documentingSettings.edit')),
                ]);
                setDocumentsNumbers(tableRows);
            }
        }
        getAllDocumentNumbersApi(callApi, callBackFunction).then();
    }

    const [document, setDocument] = useRecoilState<IDocument>(documentState);
    const onUpdateDocument = async (document) => {
        const callback = (data) => {
            if (data.success) {
                alertSuccessUpdate();
                getAllDocumentsNumbers();
                setOpenModal(!openModal)
            } else {
                alertFaultUpdate();
            }
        }
        await updateDocumentNumber(callApi, callback, document);
    }

    const handleOnClose = () => {
        setOpenModal(false);
        setShowTooltip(false);
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
        onUpdateDocument,
        handleOnClose,
        showTooltip,
        setShowTooltip
    }
}

export { useDocumentNumbers }