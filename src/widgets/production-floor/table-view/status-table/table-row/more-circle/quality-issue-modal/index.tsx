import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { useState, useEffect } from "react";
import { useGomakeAxios } from "@/hooks";
import { getQualityIssueReasonsApi } from "@/services/api-service/quotes/qoutes-endpoints";
import { useRecoilValue } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import { CircularProgress, Paper, MenuItem } from "@mui/material";
import { ClickOutside } from "@/components/click-out-side/click-out-side";

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
    <GoMakeModal
      openModal={openModal}
      modalTitle={t("productionFloor.reportQualityIssue")}
      onClose={handleClose}
      insideStyle={clasess.insideStyle}
    >
      <div style={clasess.mainModalContainer}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <div style={{ width: "100%", minWidth: 300, position: "relative" }}>
              <GomakeTextInput
                placeholder={t("productionFloor.qualityIssueReason")}
                style={clasess.textInputStyle}
                value={inputValue}
                onChange={handleInputChange}
                onClick={handleInputClick}
              />
              {openDropdown && (
                <ClickOutside onClick={() => setOpenDropdown(false)}>
                  <Paper
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1300,
                      maxHeight: 200,
                      overflowY: "auto",
                      marginTop: 1,
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
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
            <div style={clasess.btnContainer}>
              <GomakePrimaryButton
                style={clasess.sendBtn}
                onClick={handleConfirm}
                disabled={!reason.trim()}
              >
                {t("modal.confirm")}
              </GomakePrimaryButton>
            </div>
          </>
        )}
      </div>
    </GoMakeModal>
  );
};

export { QualityIssueModal };

