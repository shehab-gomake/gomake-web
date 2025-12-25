import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "./style";
import { managerInput } from "./inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { useState } from "react";
import { useSnackBar } from "@/hooks";
import { useRecoilValue } from "recoil";
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";
import { useFrontDeskEmailIntegration } from '@/pages-components/quotes/hooks/use-frontdesk-email-integration';
import { FrontDeskEmailComposerWrapper } from '@/pages-components/quotes/components/frontdesk-email-composer-wrapper';
import { DOCUMENT_TYPE } from '@/pages-components/quotes/enums';

interface ManagersState {
    [key: string]: any;
}

interface ManagerApprovalModalProps {
    openModal: boolean;
    onClose: () => void;
    onSend?: (managersId: string[]) => void;
    managersOptions: any[];
    documentId?: string | number;
}

const ManagerApprovalModal = ({ openModal, onClose, managersOptions, onSend, documentId }: ManagerApprovalModalProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { alertFault } = useSnackBar();
    const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);
    const [managers, setManagers] = useState<ManagersState | null>(null);

    // FrontDesk email integration
    const {
        isEmailComposerOpen,
        emailData,
        openEmailComposer,
        closeEmailComposer,
    } = useFrontDeskEmailIntegration({ documentType: DOCUMENT_TYPE.QuoteApprovalRequest });

    const onChangeInputs = (key, value) => {
        setManagers({ ...managers, [key]: value });
    };

    const handleClose = () => {
        setManagers(null);
        onClose();
    }

    const handleSend = async () => {
        if (!managers?.managerIds || managers?.managerIds.length === 0) {
            alertFault(t("sales.cart.approvalRequestAlert"));
            return;
        }

        // If FrontDesk feature is enabled and documentId is available, open email composer
        if (hasFrontDeskFeature && documentId) {
            // Extract manager emails from selected manager IDs
            const selectedManagers = managersOptions.filter((manager) =>
                managers.managerIds.includes(manager.value)
            );
            const managerEmails = selectedManagers
                .map((manager) => manager.email)
                .filter((email) => email && email.trim());

            if (managerEmails.length === 0) {
                alertFault(t("sales.cart.noManagerEmailFound") || "No email addresses found for selected managers");
                return;
            }

            // Open email composer with manager IDs and manager emails
            // The manager emails will be merged into the tos array in the API response
            await openEmailComposer(
                documentId,
                undefined, // contactEmail - will be set by backend from manager emails
                undefined, // contactPhone
                0, // messageType
                true, // sendMailIfNotVerifiedAgent
                false, // sendWithInvoices
                undefined, // customerId
                undefined, // customerName
                undefined, // contactName
                managerEmails // managerEmails - will be added to tos array in the response
            );

            // Close the manager approval modal when email composer opens
            handleClose();
        }
        else {
            // Original behavior: call onSend callback (only when FrontDesk is NOT enabled)
            onSend?.(managers.managerIds);
            handleClose();
        }
    };

    return (
        <>
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
            {isEmailComposerOpen && documentId && (
                <FrontDeskEmailComposerWrapper
                    open={isEmailComposerOpen}
                    onClose={closeEmailComposer}
                    emailData={emailData}
                    documentId={documentId}
                    documentType={DOCUMENT_TYPE.QuoteApprovalRequest}
                />
            )}
        </>
    );
};
export { ManagerApprovalModal };
