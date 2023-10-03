import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks";
import { resetUserPassword } from "@/services/api-service/profiles/user-profile-api";
import { useRecoilState } from "recoil";
import { resetPassModalState } from "./state";

const useGomakeUser = () => {
  const { callApi } = useGomakeAxios();
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const [openModal, setOpenModal] = useRecoilState<boolean>(resetPassModalState);

  const updateUserPassword = async (data: {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  }, userId ) => {

    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        setOpenModal(false)
      } else {
        alertFaultUpdate();
      }
    }
    await resetUserPassword(callApi, callBack, { id: userId, ...data })
  }
  return {
    updateUserPassword
  };
};
export { useGomakeUser };