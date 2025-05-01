import { SetupGuideMenu } from "./quick-setup-menu/setup-guide-menu";
import { SetupModal } from "./quick-setup-modal/quick-setup-modal";
import { useQuickSetup } from "./use-quick-setup";

const SetupSection = () => {
  const { ActionsModal, handleOpenModal, initialSetupData } = useQuickSetup();

  return (
    <>
      <SetupGuideMenu handleOpenModal={handleOpenModal} />
      <SetupModal
        ActionsModal={ActionsModal}
        initialSetupData={initialSetupData}
      />
    </>
  );
};

export { SetupSection };
