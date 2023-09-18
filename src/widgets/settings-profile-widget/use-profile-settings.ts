import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useTranslation} from "react-i18next";
import {useState} from "react";
const useProfileSettings = () => {
    const {setSnackbarStateValue} = useSnackBar();
    const {callApi} = useGomakeAxios();
    const [openModal, setOpenModal] = useState<boolean>();
    const {t} = useTranslation();

    return {
        openModal,
        setOpenModal
    }
}

export {useProfileSettings}