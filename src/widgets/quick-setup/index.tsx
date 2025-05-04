import { ResetPasswordModal } from "./compoennets/reset-password-modal";
import { SetupGuideMenu } from "./quick-setup-menu/setup-guide-menu";
import { SetupModal } from "./quick-setup-modal/quick-setup-modal";
import { useQuickSetup } from "./use-quick-setup";

const SetupSection = () => {
  const {
    ActionsModal,
    handleOpenModal,
    initialSetupData,
    ResetPasswordModalControl,
  } = useQuickSetup();

  return (
    <>
      <SetupGuideMenu
        handleOpenModal={handleOpenModal}
        handleOpenResetPassword={ResetPasswordModalControl.open} // 🆕 pass it
      />
      <SetupModal
        ActionsModal={ActionsModal}
        initialSetupData={initialSetupData}
      />
      <ResetPasswordModal modalControl={ResetPasswordModalControl} />
    </>
  );
};

export { SetupSection };
