import apiRequest from "@/services/api-request";
import { loadgingState } from "@/store/loading";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { ResponseType } from "axios";
import { loadingWithShadowState } from "@/store/loading-with-shadow";

const useGomakeAxios = () => {
  const setLoading = useSetRecoilState(loadgingState);
  const setLoadingWithShadow = useSetRecoilState(loadingWithShadowState);
  const { t } = useTranslation();
  const language = t("language");

  const callApi = useCallback(
    async (
      method: string,
      url: string,
      data?: any,
      lockScreen: boolean = true,
      requestAbortController: AbortController = null,
      responseType?: ResponseType,
      withShadow = false
    ) => {
      if (lockScreen) {
        if (withShadow) {
          setLoadingWithShadow(true);
        } else {
          setLoading(true);
        }
      }
      const result = await apiRequest(
        method,
        url,
        data,
        language,
        requestAbortController,
        responseType
      );
      if (lockScreen) {
        setTimeout(() => {
          if (withShadow) {
            setLoadingWithShadow(false);
          } else {
            setLoading(false);
          }
        }, 500);
      }
      return result;
    },
    []
  );

  return { callApi };
};

export { useGomakeAxios };
