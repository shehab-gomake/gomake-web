import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { useUploadingNewVersionSocketIo } from "@/hooks/socket-io/use-upload-new-version-socket-io";
import { printHouseProfile } from "@/store/print-house-profile";
import { tokenExpiredState } from "@/store/token-expired-modal";
import { navStatusState, pageTitleState } from "@/store/nav-status";
import { hoverStatusState } from "@/store";
import { lastVersionState } from "@/store/last-version-state";
import { versionState } from "@/store/version";
import { useModal } from "@/hooks/use-modal";
import { useHtmlTour } from "@/layouts/customer-auth-layout/use-html-tour";
import { getLastVersionApi } from "@/services/api-service/gomake-versioning/gomake-versioning-endpoint";
import { useStyle } from "./style";
import { LAYOUT_DEFAULT_GAP } from "@/utils/layout-config";
import { useRouter } from "next/router";

const useCustomerAuthLayout = (
  permissionEnumValue: any,
  allowAnonymous: boolean,
  customGap = LAYOUT_DEFAULT_GAP
) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { classes } = useStyle({ isHover: false, navStatus: null, customGap });
  const router = useRouter();
  const isHomePage = router.pathname === "/home" || router.pathname === "/";

  const alertNewVersion = useModal();
  const { openAlertModal, setOpenAlertModal } =
    useUploadingNewVersionSocketIo();

  const profile = useRecoilValue(printHouseProfile);
  const setLastVersion = useSetRecoilState(lastVersionState);
  const { canAccess } = useAuthLayoutHook(permissionEnumValue, allowAnonymous);

  const [pageTitle, setPageTitle] = useRecoilState(pageTitleState);
  const isHover = useRecoilValue(hoverStatusState);
  const setNavStatus = useSetRecoilState(navStatusState);
  const { htmlTour, openModal, onCloseModal } = useHtmlTour();
  const [isTokenExpired, setIsTokenExpired] = useRecoilState(tokenExpiredState);

  const appVersion = useRecoilValue(versionState);

  const getLastVersion = async () => {
    await getLastVersionApi(callApi, (res) => {
      if (res.success) {
        setLastVersion(res.data);
      }
    });
  };

  return {
    t,
    profile,
    canAccess,
    openAlertModal,
    setOpenAlertModal,
    pageTitle,
    setPageTitle,
    isHover,
    setNavStatus,
    htmlTour,
    openModal,
    onCloseModal,
    isTokenExpired,
    setIsTokenExpired,
    alertNewVersion,
    appVersion,
    navigate,
    classes,
    getLastVersion,
    isHomePage,
  };
};

export { useCustomerAuthLayout };
