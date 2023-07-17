import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";

import { useRouter } from "next/router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const useParameters = ({ productState, onChangeStateProduct }) => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const router = useRouter();
  const { t } = useTranslation();
  const { setSnackbarStateValue } = useSnackBar();

  const updatedProductParameterHidden = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter`,
        {
          productId: router?.query?.productId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: {
            id: parameter?.id,
            name: parameter?.name,
            defaultValue: parameter?.defaultValue,
            parameterType: parameter?.parameterType,
            isHidden: !parameter?.isHidden,
            isRequired: parameter?.isRequired,
            valuesConfigs: parameter?.valuesConfigs,
          },
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        // router.reload();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [router]
  );

  const updatedProductParameteRequierd = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter`,
        {
          productId: router?.query?.productId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: {
            id: parameter?.id,
            name: parameter?.name,
            defaultValue: parameter?.defaultValue,
            parameterType: parameter?.parameterType,
            isHidden: parameter?.isHidden,
            isRequired: !parameter?.isRequired,
            valuesConfigs: parameter?.valuesConfigs,
          },
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        // router.reload();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [router]
  );
  return {
    t,
    updatedProductParameterHidden,
    updatedProductParameteRequierd,
  };
};

export { useParameters };
