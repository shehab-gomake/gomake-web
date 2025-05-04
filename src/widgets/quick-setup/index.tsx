import { ResetPasswordModal } from "./compoennets/reset-password-modal";
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
  } = useQuickSetup();

  useQuickSetupSocketIo();

  return (
    <>
      <SetupGuideMenu
        handleOpenModal={handleOpenModal}
        handleOpenResetPassword={ResetPasswordModalControl.open}
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
