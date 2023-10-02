import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks";
import { resetUserPassword } from "@/services/api-service/profiles/user-profile-api";

const useGomakeUser = () => {
  const { callApi } = useGomakeAxios();

  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();

  const updateUserPassword = async (data: {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  }, userId) => {

    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
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