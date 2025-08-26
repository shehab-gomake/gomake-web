import { DemoVideoModal } from "./compoennets/demo-video-modal";
import { ResetPasswordModal } from "./compoennets/reset-password-modal";
import { WelcomeModal } from "./compoennets/welcome-modal";
import { SetupGuideMenu } from "./quick-setup-menu/setup-guide-menu";
import { QuickSetupModalNew, useQuickSetupModalNew } from "./on-boarding-setup";
import { SetupModal } from "./quick-setup-modal/quick-setup-modal";
import { useQuickSetup } from "./use-quick-setup";
import { useQuickSetupSocketIo } from "@/hooks/socket-io/use-quick-setup-socket-io";

const SetupSection = () => {
  const {
    ActionsModal,
    handleOpenModal,
    initialSetupData,
    DemoVideoModalControl,
    updatePrintHouseSetupSteps,
    handleOpenDemoVideo,
    videoUrl,
    setVideoUrl,
    resetPasswordModal,
    onOpenResetModal,
    onCloseResetModal,
  } = useQuickSetup();

  const {} = useQuickSetupSocketIo();

  return (
    <>
      <SetupGuideMenu
        handleOpenModal={handleOpenModal}
        handleOpenResetPassword={onOpenResetModal}
        updatePrintHouseSetupSteps={updatePrintHouseSetupSteps}
        handleOpenDemoVideo={handleOpenDemoVideo}
      />
      <SetupModal
        ActionsModal={ActionsModal}
        initialSetupData={initialSetupData}
      />
      <ResetPasswordModal
        openModal={resetPasswordModal}
        onClose={onCloseResetModal}
      />
      <WelcomeModal
        updatePrintHouseSetupSteps={updatePrintHouseSetupSteps}
        handleOpenDemoVideo={DemoVideoModalControl.open}
      />
      <DemoVideoModal
        modalControl={DemoVideoModalControl}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        updatePrintHouseSetupSteps={updatePrintHouseSetupSteps}
      />
    </>
  );
};

export { SetupSection };
