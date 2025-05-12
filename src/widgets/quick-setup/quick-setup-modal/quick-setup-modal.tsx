import { useRecoilValue } from "recoil";
import { setupGuideOpenState } from "@/store/setup-guide-state";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ModalControls } from "@/hooks/use-modal";
import { useTranslation } from "react-i18next";
import { ProductsSetupData } from "../compoennets/interfaces";
import { SetupSteps } from "./components/setup-steps";
import { NewSetupSteps } from "./components/setup-steps-new";

interface SetupModalProps {
  ActionsModal: ModalControls;
  initialSetupData: ProductsSetupData;
}

const SetupModal = ({ ActionsModal, initialSetupData }: SetupModalProps) => {
  const isOpen = useRecoilValue(setupGuideOpenState);
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  if (!isOpen) return null;

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
      open={ActionsModal.isOpen}
      fullWidth
    >
      <DialogContent sx={{ padding: 0, position: "relative" }}>
        <IconButton
          onClick={() => ActionsModal.close()}
          sx={{
            position: "absolute",
            top: 8,
            ...(isRTL ? { left: 8 } : { right: 8 }),
            zIndex: 1,
            color: "grey.600",
          }}
        >
          <CloseIcon />
        </IconButton>
        <NewSetupSteps
          initialSetupData={initialSetupData}
          ActionsModal={ActionsModal}
        />
      </DialogContent>
    </Dialog>
  );
};

export { SetupModal };
