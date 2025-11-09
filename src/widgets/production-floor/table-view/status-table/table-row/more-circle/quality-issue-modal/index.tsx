import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { useState } from "react";

interface QualityIssueModalProps {
  openModal: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const QualityIssueModal = ({
  openModal,
  onClose,
  onConfirm,
}: QualityIssueModalProps) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
      onClose();
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle={t("productionFloor.reportQualityIssue")}
      onClose={handleClose}
      insideStyle={clasess.insideStyle}
    >
      <div style={clasess.mainModalContainer}>
        <GomakeTextInput
          multiline
          rows={6}
          style={clasess.textInputStyle}
          placeholder={t("productionFloor.qualityIssueReason")}
          value={reason}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setReason(event.target.value)
          }
        />
        <div style={clasess.btnContainer}>
          <GomakePrimaryButton
            style={clasess.sendBtn}
            onClick={handleConfirm}
            disabled={!reason.trim()}
          >
            {t("modal.confirm")}
          </GomakePrimaryButton>
        </div>
      </div>
    </GoMakeModal>
  );
};

export { QualityIssueModal };

