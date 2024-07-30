import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "./style";
import { managerInput } from "./inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { useState } from "react";
import { useSnackBar } from "@/hooks";

interface ManagersState {
    [key: string]: any;
}

interface ManagerApprovalModalProps {
    openModal: boolean;
    onClose: () => void;
    onSend?: (managersId: string[]) => void;
    managersOptions: any[];
}

const ManagerApprovalModal = ({ openModal, onClose, managersOptions, onSend }: ManagerApprovalModalProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { alertFault } = useSnackBar();
    const [managers, setManagers] = useState<ManagersState | null>(null);

    const onChangeInputs = (key, value) => {
        setManagers({ ...managers, [key]: value });
    };

    const handleClose = () => {
        setManagers(null);
        onClose();
    }

    const handleSend = () => {
        if (!managers?.managerIds || managers?.managerIds.length===0) {
            alertFault(t("sales.cart.approvalRequestAlert"));
            return;
        }
        onSend(managers.managerIds);
    };

    return (
        <GoMakeModal
            openModal={openModal}
            modalTitle={t("sales.cart.approvalRequest")}
            onClose={handleClose}
            insideStyle={classes.insideStyle}
            modalTitleColor={"black"}
        >
            <div style={classes.mainContainer}>
                {managerInput(managers, managersOptions).map((item) => (
                    <div style={{ marginBottom: 10 }}>
                        <FormInput
                            input={item as IInput}
                            changeState={onChangeInputs}
                            error={item.required}
                            readonly={false}
                        />
                    </div>
                ))}
                <div style={classes.mainBtnContainer}>
                    <PrimaryButton
                        style={classes.cancelContainer}
                        onClick={handleClose}
                        variant="outlined"
                    >
                        {t("sales.quote.cancel")}
                    </PrimaryButton>
                    <PrimaryButton
                        style={classes.sendButtonStyle}
                        onClick={handleSend}
                        variant="contained"
                    >
                        {t("sales.cart.select&send")}
                    </PrimaryButton>

                </div>
            </div>
        </GoMakeModal>
    );
};
export { ManagerApprovalModal };
