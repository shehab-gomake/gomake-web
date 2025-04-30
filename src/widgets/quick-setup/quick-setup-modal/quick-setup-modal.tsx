import { useRecoilValue } from "recoil";
import { setupGuideOpenState } from "@/store/setup-guide-state";
import { SetupSteps } from "./components/setup-steps";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ModalControls } from "@/hooks/use-modal";
import { useTranslation } from "react-i18next";

interface SetupModalProps {
  ActionsModal: ModalControls;
}

const SetupModal = ({ ActionsModal }: SetupModalProps) => {
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
        <SetupSteps />
      </DialogContent>
    </Dialog>
  );
};

export { SetupModal };
