import { useCallback, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { recoverOverdueApi } from "@/services/api-service/jobs-time-line/jobs-time-line-endpoints";
import { useRecoilValue } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";

export const useRecoverOverdue = () => {
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [isRecovering, setIsRecovering] = useState(false);
  // const printHouseProfileState = useRecoilValue<any>(printHouseProfile);

  const recoverOverdue = useCallback(
    async (onSuccess?: () => void) => {
      setIsRecovering(true);

      const callBack = (res: any) => {
        setIsRecovering(false);
        if (res?.success) {
          alertSuccessUpdate();
          if (onSuccess) {
            onSuccess();
          }
        } else {
          alertFaultUpdate();
        }
      };

      await recoverOverdueApi(callApi, callBack);
    },
    [callApi, alertSuccessUpdate, alertFaultUpdate]
  );

  return {
    recoverOverdue,
    isRecovering,
  };
};
