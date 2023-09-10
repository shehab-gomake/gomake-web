import {useRecoilState} from "recoil";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useTranslation} from "react-i18next";
import {addEmployeeOpenModalState} from "@/widgets/settings-users/state/open-modat-state";
const useProfileSettings = () => {
    const {setSnackbarStateValue} = useSnackBar();
    const {callApi} = useGomakeAxios();
    const [openModal, setOpenModal] = useRecoilState<boolean>(addEmployeeOpenModalState);
    const {t} = useTranslation();

    return {
        openModal,
        setOpenModal
    }
}

export {useProfileSettings}