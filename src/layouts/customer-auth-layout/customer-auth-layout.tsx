import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useThemeComponent } from "@/contexts/theme/useThemeComponent";
import { HeaderWidget } from "@/widgets/header";
import { LAYOUT_DEFAULT_GAP } from "@/utils/layout-config";
import { GoMakeAlertModal, GoMakeModal } from "@/components";
import { FilesUploaderWidget } from "@/widgets/file-uploader-widget/files-uploader-widget";
import { MobileHeaderWidget } from "./mobile-top-list/mobile-header-widget";
import { useMediaQuery } from "@mui/material";
import { SetupSection } from "@/widgets/quick-setup";
import Head from "next/head";
import { useEffect } from "react";
import { useCustomerAuthLayout } from "./use-customer-auth-layout";
import { useTrialRedirect } from "@/hooks/use-trial-redirect";
import {
  TicketChatbotSidebar,
  TicketChatbotProvider,
  useTicketChatbot,
  RequestNotificationProvider,
  RequestNotificationModal,
  useGlobalRequestListener,
} from "@/components/ticket-chatbot";

const CustomerAuthLayoutInner = ({
  children,
  permissionEnumValue,
  customGap = LAYOUT_DEFAULT_GAP,
  allowAnonymous,
  disableHeaderSideMenu,
  className,
  backgroundColor,
  staticPageTitle,
  customHeaderStyle,
}: IAuthLayout) => {
  const isMobileScreen = useMediaQuery("(max-width:768px)");
  const { isOpen, closeChatbot } = useTicketChatbot();

  // Set up global request listener (works even when chatbot is closed)
  useGlobalRequestListener();

  const {
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
    classes,
    getLastVersion,
    isHomePage,
  } = useCustomerAuthLayout(permissionEnumValue, allowAnonymous, customGap);

  // Get theme-aware LeftSideLayout component
  const ThemeLeftSideLayout = useThemeComponent(
    "LeftSideLayout",
    LeftSideLayout
  );

  // Handle trial redirect in case of trial finished
  useTrialRedirect();

  useEffect(() => {
    getLastVersion();
  }, []);

  useEffect(() => {
    setPageTitle(staticPageTitle);
  }, [staticPageTitle]);

  const getPageTitle = () => {
    if (pageTitle) {
      return pageTitle;
    }
    return "Gomake";
  };

  // Show nothing while authentication is being checked to prevent flash
  if (canAccess === null) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#f6f6f6",
        }}
      >
        {/* Empty div - prevents flash of content while checking auth */}
      </div>
    );
  }

  return (
    <>
      {disableHeaderSideMenu ? (
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
          <div style={classes.container}>
            <Head>
              <title>{getPageTitle()}</title>
            </Head>
            {isMobileScreen ? (
              <div></div>
            ) : (
              <ThemeLeftSideLayout customGap={customGap} />
            )}

            <div
              style={{
                ...classes.rightContainer,
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
              }}
              onMouseEnter={() => {
                if (!isHover) {
                  setNavStatus({ isClosed: true });
                }
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                {isMobileScreen ? (
                  <MobileHeaderWidget />
                ) : (
                  <HeaderWidget customStyle={customHeaderStyle} />
                )}

                {canAccess && (
                  <div style={classes.bodyContainer} className={className}>
                    {children}
                  </div>
                )}
              </div>
              <TicketChatbotSidebar isOpen={isOpen} onClose={closeChatbot} />
            </div>
            <FilesUploaderWidget />
            {profile?.isShowOnBoardingMenu && !isMobileScreen ? (
              <SetupSection />
            ) : (
              <></>
            )}
          </div>
        </>
      )}

      {/* Shared modals - always render regardless of disableHeaderSideMenu */}
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
          }}
          subTitle="modal.alertTokenExpired"
          yesBtn="login.login"
          withCancelBtn={false}
        />
      )}
      {/* Request notification modal for huddle and remote session */}
      <RequestNotificationModal />
    </>
  );
};

const CustomerAuthLayout = (props: IAuthLayout) => {
  return (
    <TicketChatbotProvider>
      <RequestNotificationProvider>
        <CustomerAuthLayoutInner {...props} />
      </RequestNotificationProvider>
    </TicketChatbotProvider>
  );
};

export { CustomerAuthLayout };
