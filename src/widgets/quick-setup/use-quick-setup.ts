import { useTranslation } from "react-i18next";
import { useModal } from "@/hooks/use-modal";

const useQuickSetup = () => {
  const { t } = useTranslation();

  const ActionsModal = useModal();

  return {
    t,
    ActionsModal,
  };
};

export { useQuickSetup };
