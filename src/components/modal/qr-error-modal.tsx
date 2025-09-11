import { useTranslation } from "react-i18next";
import { Modal } from "@mui/material";
import { ErrorModalIcon } from "@/icons/modal";
import { useStyle } from "./style";
import { PrimaryButton } from "../button/primary-button";

interface QRErrorModalProps {
    openModal: boolean;
    onClose: () => void;
    errorMessage: string;
    errorKey?: string;
}

const QRErrorModal = ({
    openModal,
    onClose,
    errorMessage,
    errorKey
}: QRErrorModalProps) => {
    const { classes } = useStyle({});
    const { t } = useTranslation();

    const getErrorMessage = () => {
        if (errorKey) {
            switch (errorKey) {
                case "jobNotFound":
                    return t("productionFloor.jobNotFound");
                case "stationNotFound":
                    return t("productionFloor.stationNotFound");
                default:
                    return errorMessage;
            }
        }
        return errorMessage;
    };

    return (
        <Modal
            disableEnforceFocus
            open={openModal}
            onClose={onClose}
            style={{
                outline: "none",
                zIndex: 999999,
            }}
        >
            <div style={classes.modalContainer}>
                <div style={{ ...classes.content, width: "100%" }}>
                    <ErrorModalIcon />
                    <div style={classes.title}>{t("productionFloor.QRScanner")}</div>
                    <div style={classes.subTitle}>{getErrorMessage()}</div>
                    <div style={classes.btnsContainer}>
                        <PrimaryButton
                            variant="contained"
                            style={classes.cancelBtn}
                            onClick={onClose}
                        >
                            {t("modal.ok")}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export { QRErrorModal };
