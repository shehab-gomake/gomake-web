import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useProperites } from "./use-properites";

const useRule = () => {
  const { setSnackbarStateValue } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();

  const deleteRule = useCallback(
    async (
      actionId: string,
      propertyId: string,
      ruleType: number,
      id: string
    ) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/print-house-action/delete-rule/${actionId}/${propertyId}/${ruleType}/${id}`,
        {
          actionId,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deleteSusuccessfully"),
          type: "sucess",
        });
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deletefailed"),
          type: "error",
        });
      }
    },
    []
  );

  const addRule = useCallback(
    async (
      actionId: string,
      propertyId: string,
      ruleType: number,
      rule: any
    ) => {
      const res = await callApi(
        "POST",
        `/v1/printhouse-config/print-house-action/add-rule/${actionId}/${propertyId}/${ruleType}`,
        {
          rule,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        // getPrintHouseActionById(actionId);
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    []
  );

  return {
    deleteRule,
    addRule,
  };
};

export { useRule };
