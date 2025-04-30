import { SetupGuideMenu } from "./quick-setup-menu/setup-guide-menu";
import { SetupModal } from "./quick-setup-modal/quick-setup-modal";
import { useQuickSetup } from "./use-quick-setup";

const SetupSection = () => {
  const { ActionsModal } = useQuickSetup();
  return (
    <>
      <SetupGuideMenu ActionsModal={ActionsModal} />
      <SetupModal ActionsModal={ActionsModal} />
    </>
  );
};

export { SetupSection };
