import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { HeaderWidget } from "@/widgets/header";
import { navStatusState, pageTitleState } from "@/store/nav-status";
import { hoverStatusState } from "@/store";
import { LAYOUT_DEFAULT_GAP } from "@/utils/layout-config";
import { GoMakeAlertModal, GoMakeModal } from "@/components";
import { useHtmlTour } from "@/layouts/customer-auth-layout/use-html-tour";
import { FilesUploaderWidget } from "@/widgets/file-uploader-widget/files-uploader-widget";
import { MobileHeaderWidget } from "./mobile-top-list/mobile-header-widget";
import { useUploadingNewVersionSocketIo } from "@/hooks/socket-io/use-upload-new-version-socket-io";
import { useMediaQuery } from "@mui/material";
import { useModal } from "@/hooks/use-modal";
import { versionState } from "@/store/version";
import { SetupSection } from "@/widgets/quick-setup";
import { printHouseProfile } from "@/store/print-house-profile";
import { tokenExpiredState } from "@/store/token-expired-modal";
import { useGomakeRouter } from "@/hooks";
import Head from "next/head";
import { useEffect } from "react";


const CustomerAuthLayout = ({
  children,
  permissionEnumValue,
  customGap = LAYOUT_DEFAULT_GAP,
  allowAnonymous,
  disableHeaderSideMenu,
  className,
  backgroundColor,
  staticPageTitle
}: IAuthLayout) => {
  const { navigate } = useGomakeRouter();
  const isMobileScreen = useMediaQuery("(max-width:768px)");
  const { openAlertModal, setOpenAlertModal } =
    useUploadingNewVersionSocketIo();
  const profile = useRecoilValue(printHouseProfile);
  const { canAccess } = useAuthLayoutHook(permissionEnumValue, allowAnonymous);
  const { classes } = useStyle({
    isHover: false,
    navStatus: null,
    customGap,
  });
  const setNavStatus = useSetRecoilState(navStatusState);
  const [pageTitle, setPageTitle] = useRecoilState(pageTitleState);
  const isHover = useRecoilValue(hoverStatusState);
  const { htmlTour, openModal, onCloseModal } = useHtmlTour();
  const [isTokenExpired, setIsTokenExpired] = useRecoilState(tokenExpiredState);

  const alertNewVersion = useModal();
  const appVersion = useRecoilValue(versionState);
  useEffect(() => {
    setPageTitle(staticPageTitle)
  }, [staticPageTitle])
  const getPageTitle = () => {
    if (pageTitle) {
      return pageTitle;
    }
    return "Gomake";
  }
  /*useEffect(() => {
    const lastSeenVersion = localStorage.getItem("lastSeenAppVersion");
    if (!lastSeenVersion) {
      localStorage.setItem("lastSeenAppVersion", appVersion);
    }

    if (appVersion && appVersion !== Number(lastSeenVersion)) {
      alertNewVersion.open();
      localStorage.setItem("lastSeenAppVersion", appVersion);
    }
  }, [appVersion]);*/

  return disableHeaderSideMenu ? (
    <>
      {canAccess && (
        <div
          style={{
            ...classes.bodyContainer,
            backgroundColor: backgroundColor ?? "#FFF",
          }}
        >
          {children}
        </div>
      )}
    </>
  ) : (
    <>
      {
        <div style={classes.container}>
          <Head>
            <title>{getPageTitle()}</title>
          </Head>
          {isMobileScreen ? (
            <div></div>
          ) : (
            <LeftSideLayout customGap={customGap} />
          )}

          <div
            style={classes.rightContainer}
            onMouseEnter={() => {
              if (!isHover) {
                setNavStatus({ isClosed: true });
              }
            }}
          >
            {isMobileScreen ? <MobileHeaderWidget /> : <HeaderWidget />}

            {canAccess && (
              <div style={classes.bodyContainer} className={className}>
                {children}
              </div>
            )}
          </div>
          <FilesUploaderWidget />
          <GoMakeModal
            insideStyle={{ height: "fit-content" }}
            openModal={openModal}
            onClose={onCloseModal}
          >
            <div
              dangerouslySetInnerHTML={{ __html: htmlTour }}
              style={{ padding: "10px" }}
            />
          </GoMakeModal>
          <GoMakeAlertModal
            openModal={openAlertModal}
            onClose={() => setOpenAlertModal(false)}
            subTitle={"modal.alertNewVersion"}
            yesBtn={"modal.ok"}
            onClickConfirm={() => setOpenAlertModal(false)}
            withCancelBtn={false}
          />
          <GoMakeAlertModal
            openModal={alertNewVersion.isOpen}
            onClose={alertNewVersion.close}
            onClickConfirm={() => {
              alertNewVersion.close();
              window.location.reload();
            }}
            subTitle="modal.alertNewAppVersion"
            yesBtn="modal.reload"
            withCancelBtn={false}
          />

          {isTokenExpired && (
            <GoMakeAlertModal
              openModal={isTokenExpired}
              onClose={() => setIsTokenExpired(false)}
              onClickConfirm={() => {
                setIsTokenExpired(false);
                 window.open("/login", "_blank");
                /*const currentPath =
                  window.location.pathname + window.location.search;
                const loginUrl =
                  currentPath && currentPath !== "/"
                    ? `/login?redirect=${encodeURIComponent(currentPath)}`
                    : "/login";
                navigate(loginUrl);*/
              }}
              subTitle="modal.alertTokenExpired"
              yesBtn="login.login"
              withCancelBtn={false}
            />
          )}

          {profile?.isShowOnBoardingMenu ? <SetupSection /> : <></>}
        </div>
      }
    </>
  );
};

export { CustomerAuthLayout };
