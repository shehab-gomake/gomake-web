import { DemoVideoModal } from "./compoennets/demo-video-modal";
import { ResetPasswordModal } from "./compoennets/reset-password-modal";
import { WelcomeModal } from "./compoennets/welcome-modal";
import { SetupGuideMenu } from "./quick-setup-menu/setup-guide-menu";
import { SetupModal } from "./quick-setup-modal/quick-setup-modal";
import { useQuickSetup } from "./use-quick-setup";
import { useQuickSetupSocketIo } from "@/hooks/socket-io/use-quick-setup-socket-io";

const SetupSection = () => {
  const {
    ActionsModal,
    handleOpenModal,
    initialSetupData,
    ResetPasswordModalControl,
    DemoVideoModalControl,
    updatePrintHouseSetupSteps,
    handleOpenDemoVideo,
    videoUrl,
    setVideoUrl,
  } = useQuickSetup();

  const {} = useQuickSetupSocketIo();

  return (
    <>
      <SetupGuideMenu
        handleOpenModal={handleOpenModal}
        handleOpenResetPassword={ResetPasswordModalControl.open}
        updatePrintHouseSetupSteps={updatePrintHouseSetupSteps}
        handleOpenDemoVideo={handleOpenDemoVideo}
      />
      <SetupModal
        ActionsModal={ActionsModal}
        initialSetupData={initialSetupData}
      />
      <ResetPasswordModal modalControl={ResetPasswordModalControl} />
      <WelcomeModal
        updatePrintHouseSetupSteps={updatePrintHouseSetupSteps}
        handleOpenResetPassword={ResetPasswordModalControl.open}
      />
      <DemoVideoModal
        modalControl={DemoVideoModalControl}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
      />
    </>
  );
};

export { SetupSection };
