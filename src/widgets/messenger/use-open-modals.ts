import {useState} from "react";

const useOpenModals = () => {
    const [openAddDialogModal, setOpenAddDialogModal] = useState<boolean>(false);
    const [openUploadedFiles, setOpenUploadedFiles] = useState<boolean>(false);

    const openAddDialog = () => {
        setOpenAddDialogModal(true);
    };

    const closeAddDialog = () => {
        setOpenAddDialogModal(false);
    }
    const openFiles = () => {
        setOpenUploadedFiles(true);
    };

    const closeFiles = () => {
        setOpenUploadedFiles(false);
    }

    const filesHistory = {
        open: openFiles,
        close: closeFiles,
        isOpened: openUploadedFiles
    }

    const addDialog = {
        open: openAddDialog,
        close: closeAddDialog,
        isOpened: openAddDialogModal
    }

    return {
        addDialog, filesHistory
    }

}

export {useOpenModals}