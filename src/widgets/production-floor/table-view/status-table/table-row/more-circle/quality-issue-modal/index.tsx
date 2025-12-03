import { useTranslation } from "react-i18next";
import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useState, useEffect } from "react";
import { useGomakeAxios } from "@/hooks";
import { getQualityIssueReasonsApi } from "@/services/api-service/quotes/qoutes-endpoints";
import { useRecoilValue } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import {
  CircularProgress,
  Paper,
  MenuItem,
  Modal,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { CloseIcon } from "@/widgets/quote-new/receipts-table/Payment-methods-details/icons/close-icon";
import { FONT_FAMILY } from "@/utils/font-family";
import { QualityIssueIcon } from "@/icons";

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
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const printHouse = useRecoilValue(printHouseProfile);
  const [reason, setReason] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [existingReasons, setExistingReasons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (openModal && printHouse?.id) {
      fetchExistingReasons();
    }
  }, [openModal, printHouse?.id]);

  useEffect(() => {
    // Reset when modal closes
    if (!openModal) {
      setReason("");
      setInputValue("");
      setOpenDropdown(false);
    }
  }, [openModal]);

  const fetchExistingReasons = async () => {
    if (!printHouse?.id) return;

    setLoading(true);
    const callBack = (res) => {
      if (res?.success && res?.data) {
        setExistingReasons(res.data || []);
      }
      setLoading(false);
    };
    await getQualityIssueReasonsApi(callApi, callBack, printHouse.id);
  };

  const handleConfirm = () => {
    const finalReason = reason.trim();
    if (finalReason) {
      onConfirm(finalReason);
      setReason("");
      setInputValue("");
      setOpenDropdown(false);
      onClose();
    }
  };

  const handleClose = () => {
    setReason("");
    setInputValue("");
    setOpenDropdown(false);
    onClose();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setReason(newValue);
    setOpenDropdown(true);
  };

  const handleSelectReason = (selectedReason: string) => {
    setReason(selectedReason);
    setInputValue(selectedReason);
    setOpenDropdown(false);
  };

  const handleInputClick = () => {
    setOpenDropdown(true);
  };

  // Filter options based on input value
  const filteredReasons = existingReasons.filter((r) =>
    r.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Check if inputValue matches any existing reason
  const isNewReason =
    inputValue &&
    !existingReasons.find((r) => r.toLowerCase() === inputValue.toLowerCase());

  return (
    <Modal
      // disableEnforceFocus
      open={openModal}
      onClose={handleClose}
      style={{ outline: "none", zIndex: 999999 }}
    >
      <div style={classes.container}>
        <div style={classes.content}>
          <div style={classes.closeIcon} onClick={handleClose}>
            <Tooltip title={t("modal.close")}>
              <IconButton>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div style={classes.icon}>
            <QualityIssueIcon />
          </div>
          <div style={classes.title}>
            {t("productionFloor.reportQualityIssue")}
          </div>
          {loading ? (
            <div style={classes.loadingContainer}>
              <CircularProgress />
            </div>
          ) : (
            <>
              <div style={classes.inputContainer}>
                <GomakeTextInput
                  placeholder={t("productionFloor.qualityIssueReason")}
                  style={classes.textInputStyle}
                  value={inputValue}
                  onChange={handleInputChange}
                  onClick={handleInputClick}
                />
                {openDropdown && (
                  <ClickOutside onClick={() => setOpenDropdown(false)}>
                    <Paper style={classes.dropdownPaper}>
                      {isNewReason && (
                        <MenuItem
                          onClick={() => handleSelectReason(inputValue)}
                          sx={{ fontWeight: 500 }}
                        >
                          {t("productionFloor.addNewReason")}: "{inputValue}"
                        </MenuItem>
                      )}
                      {filteredReasons.map((reasonOption) => (
                        <MenuItem
                          key={reasonOption}
                          onClick={() => handleSelectReason(reasonOption)}
                          selected={reasonOption === reason}
                        >
                          {reasonOption}
                        </MenuItem>
                      ))}
                      {filteredReasons.length === 0 && !isNewReason && (
                        <MenuItem disabled>
                          {t("productionFloor.noReasonsFound")}
                        </MenuItem>
                      )}
                    </Paper>
                  </ClickOutside>
                )}
              </div>
              <div style={classes.btnsContainer}>
                <GomakePrimaryButton
                  style={{
                    ...classes.confirmBtn,
                    ...(t("modal.confirm").length > 16
                      ? FONT_FAMILY.Lexend(600, 14)
                      : FONT_FAMILY.Lexend(600, 16)),
                    ...(!reason.trim() && classes.disabledBtn),
                  }}
                  onClick={handleConfirm}
                  disabled={!reason.trim()}
                >
                  {t("modal.confirm")}
                </GomakePrimaryButton>
                <GomakePrimaryButton
                  style={classes.cancelBtn}
                  onClick={handleClose}
                >
                  {t("modal.cancel")}
                </GomakePrimaryButton>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export { QualityIssueModal };
