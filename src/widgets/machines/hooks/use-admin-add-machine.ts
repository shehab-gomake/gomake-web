import { useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { machineState } from "@/widgets/machines/state/machine-state";
import { initState } from "@/widgets/machines/state/init-state";
import { useTranslation } from "react-i18next";
import { ECategoryId } from "@/widgets/machines/enums/category-id";
import { useRouter } from "next/router";
import { useAdminMachines } from "@/widgets/machines/hooks/use-admin-machines";

const useAdminAddMachine = () => {
  const { callApi } = useGomakeAxios();
  const state = useRecoilValue(machineState);
  const setState = useSetRecoilState(machineState);
  const { push } = useRouter();
  const { setSnackbarStateValue } = useSnackBar();
  const { setUpdatedMachine, addMachineToList } = useAdminMachines();
  const { t } = useTranslation();
  const initMachineStateCategory = (categoryId: ECategoryId) => {
    setState(initState[categoryId]);
  };

  const curMachineCategoryId = useCallback(
    () => (state?.category ? state?.category.toString() : ""),
    [state]
  );

  const adminAddMachine = useCallback(() => {
    callApi("POST", "/v1/administrator/add-machine", { ...state }).then(
      (res) => {
        if (res?.success) {
          push("/admin/machine/category/" + res.data.data.category).then(() =>
            setState(res.data.data)
          );
          setSnackbarStateValue({
            state: true,
            message: t("modal.addedSusuccessfully"),
            type: "sucess",
          });
        } else {
          setSnackbarStateValue({
            state: true,
            message: t("modal.addedfailed"),
            type: "error",
          });
        }
      }
    );
  }, [state]);

  const adminDuplicateMachine = () => {
    const payload = { ...state };
    delete payload["_id"];
    delete payload["id"];
    payload.nickName = payload?.nickName + "duplicated";
    callApi("POST", "/v1/administrator/add-machine", payload).then((res) => {
      if (res?.success) {
        addMachineToList(res.data.data);
        setState(res?.data?.data);
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "success",
        });
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    });
  };

  const updateMachine = async () => {
    const result = await callApi("POST", "/v1/administrator/update-machine", {
      ...state,
    });
    if (result?.success) {
      setUpdatedMachine(result.data.data);
      setState(result.data.data);
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  };

  return {
    adminAddMachine,
    curMachineCategoryId,
    initMachineStateCategory,
    updateMachine,
    adminDuplicateMachine,
  };
};

export { useAdminAddMachine };
