
import BarcodeReader from 'react-barcode-reader'
import { useState, useCallback } from "react";
import {
    handleBoardMissionsBarcodeActions,
    handleBoardMissionsBarcodeActionsApi, moveBoardMissionToDoneApi
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { moveOrderToDoneApi, getDocumentMailDataApi } from "@/services/api-service/generic-doc/documents-api";
import { ModalType, QrCodeAction } from "@/enums";
import { QR_CODE_LISTENER_FROM } from "@/hooks/use-qr-code-listener";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedMissionsState } from "@/widgets/production-floor/state/boards";
import { boardMissionsStationsState } from "@/widgets/production-floor/views/board-missions-view/stations/state";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from 'react-i18next';
import { GoMakeAlertModal, QRErrorModal } from "../modal";
import { ThreeOptionsModal } from "@/components";
import {
    PrintPackingSlipModalWidget
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { useIsMobile } from "@/hooks/use-responsive";
import { useFrontDeskEmailIntegration } from '@/pages-components/quotes/hooks/use-frontdesk-email-integration';
import { FrontDeskEmailComposerWrapper } from '@/pages-components/quotes/components/frontdesk-email-composer-wrapper';
import { DOCUMENT_TYPE } from '@/pages-components/quotes/enums';
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";
import { contactResolutionService, conversationComposerService } from "@/services/frontdesk";
import { chatwootSelectedAccountAtom, chatwootProfileAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useChatwootProfile } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-profile";
import { useChatwootInboxes } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-inboxes";
import { ChannelType } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import type { ContactCreatePayload } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import { getCapitalizedNameFromEmail } from "@/widgets/frontdesk/providers/chatwoot/utils/contact-utils";
import { convertAttachmentsToFiles } from "@/widgets/frontdesk/providers/chatwoot/utils/attachment.utils";
import type { AttachmentSource } from "@/widgets/frontdesk/providers/chatwoot/types/attachment.types";
import { EmailAttachment } from "@/widgets/frontdesk/providers/email/types/email.types";
import { getFileExtension, getMimeTypeFromExtension } from "@/widgets/frontdesk/providers/chatwoot/utils/attachment.utils";

interface IProps {
    qrCodeListenerFrom: QR_CODE_LISTENER_FROM;
    onIsLastStationDetect?: () => void;
}
const QrCodeReader = (props: IProps) => {
    const { t } = useTranslation();
    const { alertSuccessUpdate, alertFault, alertFaultUpdate } = useSnackBar();
    const { callApi } = useGomakeAxios();
    const router = useRouter();
    const isMobile = useIsMobile();
    const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);
    const [selectedMission, setSelectedMission] = useRecoilState<any>(selectedMissionsState);
    const [stations, setStations] = useRecoilState(boardMissionsStationsState);
    const [myState, setMyState] = useState("helll");
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [deliveryQRData, setDeliveryQRData] = useState<any>(null);
    const [openMarkReadyModal, setOpenMarkReadyModal] = useState<boolean>(false);
    const [openPackagesModal, setOpenPackagesModal] = useState<boolean>(false);
    const [openMoveToReadyModal, setOpenMoveToReadyModal] = useState<boolean>(false);
    const [selectedJobQuantity, setSelectedJobQuantity] = useState<number | null>(null);
    const [isQRErrorModalOpen, setIsQRErrorModalOpen] = useState<boolean>(false);
    const [qrErrorMessage, setQrErrorMessage] = useState<string>("");
    const [qrErrorKey, setQrErrorKey] = useState<string>("");
    const handleBoardMissionsBarcodeActionsFunction = async (barcode: string, data: any) => {

        return new Promise(async (resolve, reject) => {
            barcode = barcode.replace(/½/g, '-');
            const callBack = (res) => {
                if (res?.data?.success) {
                    if (res?.data?.isLastStation) {
                        //isOpenDoneModal.open()
                        if (props?.onIsLastStationDetect) {
                            props.onIsLastStationDetect();
                        }
                    }
                    alertSuccessUpdate();
                }
                else {
                    if (res?.data?.errorMessage && res?.data?.errorMessage !== "") {
                        setQrErrorMessage(res.data.errorMessage);
                        setQrErrorKey(res.data.errorMessage);
                        setIsQRErrorModalOpen(true);
                    } else {
                        alertFault(t("productionFloor.qrReadError"));
                    }
                }
                resolve(true)
            };
            await handleBoardMissionsBarcodeActions(callApi, callBack, {
                barcode
            });
        })
    };

    const handleDeliveryQRCode = (qrData: any) => {
        if (deliveryQRData && deliveryQRData.orderId === qrData.orderId) {
            // User has already seen the warning for this QR code, proceed to order page
            const url = `/orders?orderId=${qrData?.orderId}&clientId=${qrData?.clientId}&orderNumber=${qrData?.orderNumber}&isComeFromQR=true`;
            router.push(url);
        } else {
            // First time scanning this delivery QR code, show warning
            setDeliveryQRData(qrData);
            setIsDeliveryModalOpen(true);
        }
    };

    const handleBoardMissionsQRCodeAction = async (barcode: string) => {
        return new Promise(async (resolve, reject) => {
            if (barcode && barcode.startsWith("https")) {
                window.open(barcode, "_blank");
                return;
            }
            barcode = barcode.replace(/½/g, '-');
            const callBack = async (res) => {
                setSelectedMission(res?.data);
                if (res?.success) {
                    if (props.qrCodeListenerFrom === QR_CODE_LISTENER_FROM.PRODUCTION_FLOOR && router.asPath.includes("boardMissionsId")) {
                        const currentBoardMissionId = (router.query as any)?.boardMissionsId;
                        if (res?.data?.qrCodeAction === QrCodeAction.START) {
                            // If a different job START is scanned while a job modal is open, navigate to the new job
                            if (currentBoardMissionId && String(currentBoardMissionId) !== String(res?.data?.boardMissionId)) {
                                const url = `/production-floor?boardMissionsId=${res?.data?.boardMissionId}${res?.data?.productType ? `&productType=${res?.data?.productType}` : ""}&step=stations`;
                                router.push(url);
                            } else {
                                if (stations?.length > 0) {
                                    await handleBoardMissionsBarcodeActionsFunction(barcode, res?.data);
                                }
                            }
                        } else if (res?.data?.qrCodeAction === QrCodeAction.FINISH) {
                            if (stations?.length > 0) {
                                await handleBoardMissionsBarcodeActionsFunction(barcode, res?.data);
                            }
                        } else if (res?.data?.qrCodeAction === QrCodeAction.DELIVERY) {
                            setSelectedJobQuantity(res?.data?.quantity);
                            setOpenMoveToReadyModal(true)
                        } else if (res?.data?.qrCodeAction === QrCodeAction.OrderToReady) {
                            setSelectedJobQuantity(res?.data?.quantity);
                            setOpenMoveToReadyModal(true)
                        }
                    }
                    else {
                        if (res?.data?.qrCodeAction === QrCodeAction.START || res?.data?.qrCodeAction === QrCodeAction.FINISH) {
                            const url = `/production-floor?boardMissionsId=${res?.data?.boardMissionId}${res?.data?.productType ? `&productType=${res?.data?.productType}` : ""}&step=stations`;
                            router.push(url);
                        }
                        else {
                            if (res?.data?.qrCodeAction === QrCodeAction.DELIVERY) {
                                setSelectedJobQuantity(res?.data?.quantity);
                                setOpenMoveToReadyModal(true)
                            } else if (res?.data?.qrCodeAction === QrCodeAction.OrderToReady) {
                                setSelectedJobQuantity(res?.data?.quantity);
                                setOpenMoveToReadyModal(true)
                            }
                        }
                    }
                } else {
                    if (res?.errorMessage && res?.errorMessage !== "") {
                        setQrErrorMessage(res.errorMessage);
                        setQrErrorKey(res.errorMessage);
                        setIsQRErrorModalOpen(true);
                    } else {
                        alertFault(t("productionFloor.qrReadError"));
                    }
                }
                resolve(true);
            };
            await handleBoardMissionsBarcodeActionsApi(callApi, callBack, {
                barcode
            });
        });
    };
    const handleScan = async (data) => {
        await handleBoardMissionsQRCodeAction(data);
    }
    const handleError = (err) => {
        console.error(err)
    }

    const handleModalConfirm = () => {
        setIsDeliveryModalOpen(false);
        if (deliveryQRData) {
            const url = `/orders?orderId=${deliveryQRData?.orderId}&clientId=${deliveryQRData?.clientId}&orderNumber=${deliveryQRData?.orderNumber}&isComeFromQR=true`;
            router.push(url);
        }
    };

    const {
        isEmailComposerOpen,
        emailData,
        openEmailComposer,
        closeEmailComposer,
    } = useFrontDeskEmailIntegration({ documentType: DOCUMENT_TYPE.boardMission });

    // FrontDesk email sending setup for programmatic sending
    const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
    const setSelectedAccountId = useSetRecoilState(chatwootSelectedAccountAtom);
    const currentUser = useRecoilValue(chatwootProfileAtom);
    const { profile: profileUser, fetchProfile } = useChatwootProfile();
    const { inboxes } = useChatwootInboxes();

    // Helper function to send email programmatically without opening modal
    const sendEmailProgrammatically = useCallback(
        async (
            boardMissionId: string | number,
            contactEmail?: string,
            contactPhone?: string,
            contactName?: string,
            customerId?: string | number,
            customerName?: string
        ): Promise<boolean> => {
            if (!hasFrontDeskFeature) {
                console.log("FrontDesk feature not enabled, skipping email send");
                return false;
            }

            try {
                // 1. Get email data from API
                let emailData: any = null;
                await new Promise<void>((resolve) => {
                    getDocumentMailDataApi(
                        callApi,
                        (res) => {
                            if (res?.success && res?.data) {
                                emailData = res.data;
                                console.log("[sendEmailProgrammatically] Email data received:", {
                                    tos: emailData.tos,
                                    subject: emailData.subject,
                                    hasBody: !!emailData.body,
                                    hasAttachments: !!emailData.attachments,
                                });
                            } else {
                                console.error("[sendEmailProgrammatically] API response error:", res);
                            }
                            resolve();
                        },
                        {
                            documentType: DOCUMENT_TYPE.boardMission,
                            document: {
                                boardMissionId,
                                ...(contactEmail && { contactEmail }),
                                ...(contactPhone && { contactPhone }),
                                messageType: 0,
                                sendMailIfNotVerifiedAgent: true,
                                sendWithInvoices: false,
                                ...(customerId && { customerId }),
                                ...(customerName && { customerName }),
                                ...(contactName && { contactName }),
                            },
                        }
                    );
                });

                if (!emailData) {
                    console.error("[sendEmailProgrammatically] Failed to load email data - emailData is null");
                    return false;
                }

                console.log("[sendEmailProgrammatically] Processing email data:", emailData);

                // 2. Resolve account ID
                const extractAccountId = (profile: any) => {
                    if (!profile) return null;
                    return (
                        profile.account_id ||
                        profile.accountId ||
                        (profile.meta && (profile.meta.account_id || profile.meta.accountId)) ||
                        null
                    );
                };

                let resolvedAccountId =
                    typeof selectedAccountId === "number" ? selectedAccountId : null;
                if (!resolvedAccountId) {
                    resolvedAccountId =
                        extractAccountId(currentUser) ?? extractAccountId(profileUser);
                }
                if (!resolvedAccountId) {
                    const refreshedProfile = await fetchProfile();
                    resolvedAccountId = extractAccountId(refreshedProfile);
                }
                if (resolvedAccountId) {
                    setSelectedAccountId(resolvedAccountId);
                }

                if (!resolvedAccountId) {
                    console.error("Unable to resolve Chatwoot account");
                    return false;
                }

                const accountId = Number(resolvedAccountId);
                if (Number.isNaN(accountId)) {
                    console.error("Resolved account ID is not a number");
                    return false;
                }

                // 3. Get sender inbox (use first email inbox)
                const emailInboxes = inboxes?.filter(
                    (inbox) => inbox.channel_type === ChannelType.EMAIL
                ) || [];
                if (emailInboxes.length === 0) {
                    console.error("No email inboxes found");
                    return false;
                }
                const senderInbox = emailInboxes[0];

                // 4. Prepare email data from API response
                // Handle tos array - ensure it's always an array
                const toEmails = Array.isArray(emailData.tos)
                    ? emailData.tos.filter((email: string) => email && email.trim())
                    : emailData.tos && typeof emailData.tos === "string"
                        ? [emailData.tos.trim()].filter(Boolean)
                        : [];

                // Handle cc - can be null, array, or string
                const ccEmails = emailData.cc === null || emailData.cc === undefined
                    ? []
                    : Array.isArray(emailData.cc)
                        ? emailData.cc.filter((email: string) => email && email.trim())
                        : typeof emailData.cc === "string"
                            ? [emailData.cc.trim()].filter(Boolean)
                            : [];

                // Handle bcc - can be null, array, or string
                const bccEmails = emailData.bcc === null || emailData.bcc === undefined
                    ? []
                    : Array.isArray(emailData.bcc)
                        ? emailData.bcc.filter((email: string) => email && email.trim())
                        : typeof emailData.bcc === "string"
                            ? [emailData.bcc.trim()].filter(Boolean)
                            : [];
                const messageContent = emailData.body || emailData.html || emailData.text || "";
                const subject = emailData.subject || "";

                console.log("[sendEmailProgrammatically] Prepared email data:", {
                    toEmails,
                    ccEmails,
                    bccEmails,
                    subject,
                    messageLength: messageContent.length,
                });

                if (toEmails.length === 0) {
                    console.error("[sendEmailProgrammatically] No recipients found in tos array");
                    return false;
                }

                // 5. Convert attachments
                const mapToAttachmentSource = (attachment: EmailAttachment): AttachmentSource => ({
                    content: attachment.content,
                    data: attachment.data,
                    url: attachment.url,
                    filename: attachment.filename,
                    mimeType: attachment.mimeType,
                    contentType: attachment.contentType,
                    size: attachment.size,
                });

                const normalizedAttachments =
                    Array.isArray(emailData.attachments)
                        ? emailData.attachments.map((attachment: EmailAttachment) => {
                            let filename = attachment.filename || "document";
                            const extension = getFileExtension(attachment.url || "", null);
                            if (extension && !filename.includes(".")) {
                                filename = `${filename}.${extension}`;
                            }
                            const mimeType =
                                attachment.mimeType ||
                                attachment.contentType ||
                                (extension ? getMimeTypeFromExtension(extension) : "application/octet-stream");
                            return {
                                id: attachment.id,
                                filename,
                                mimeType,
                                contentType: mimeType,
                                size: attachment.size,
                                url: attachment.url,
                                content: attachment.content ?? attachment.data,
                            };
                        })
                        : [];

                const attachmentSources = normalizedAttachments.map(mapToAttachmentSource);
                const attachments = await convertAttachmentsToFiles(attachmentSources);

                // 6. Send email to each recipient via Chatwoot
                console.log(`[sendEmailProgrammatically] Sending email to ${toEmails.length} recipient(s)`);
                const results = await Promise.allSettled(
                    toEmails.map(async (recipientEmail: string) => {
                        try {
                            console.log(`[sendEmailProgrammatically] Processing recipient: ${recipientEmail}`);
                            const contactNameForEmail =
                                contactName || getCapitalizedNameFromEmail(recipientEmail);
                            const contactPayload: ContactCreatePayload = {
                                name: contactNameForEmail,
                                email: recipientEmail,
                            };

                            const contact = await contactResolutionService.findOrCreateContact(
                                accountId,
                                contactPayload
                            );

                            if (!contact?.id) {
                                throw new Error(`Failed to find or create contact for ${recipientEmail}`);
                            }

                            console.log(`[sendEmailProgrammatically] Contact created/found: ${contact.id} for ${recipientEmail}`);

                            const conversationId = await conversationComposerService.composeAndCreate(
                                accountId,
                                {
                                    inboxId: senderInbox.id,
                                    contactId: contact.id,
                                    sourceId: recipientEmail,
                                    message: messageContent,
                                    subject: subject,
                                    ccEmails,
                                    bccEmails,
                                    toEmails: [recipientEmail],
                                    attachments,
                                    channelType: ChannelType.EMAIL,
                                    additionalAttributes: {
                                        gomake_document: {
                                            id: boardMissionId,
                                            type: DOCUMENT_TYPE.boardMission,
                                        },
                                    },
                                }
                            );

                            if (!conversationId) {
                                throw new Error(`Failed to create conversation for ${recipientEmail}`);
                            }

                            console.log(`[sendEmailProgrammatically] Email sent successfully to ${recipientEmail}, conversationId: ${conversationId}`);
                            return { recipientEmail, success: true, conversationId };
                        } catch (error) {
                            console.error(`[sendEmailProgrammatically] Error sending email to ${recipientEmail}:`, error);
                            return { recipientEmail, success: false, error: error instanceof Error ? error.message : String(error) };
                        }
                    })
                );

                const successfulSends = results.filter(
                    (result) => result.status === "fulfilled" && result.value.success
                );
                const failedSends = results.filter(
                    (result) => result.status === "rejected" || (result.status === "fulfilled" && !result.value.success)
                );

                console.log(`[sendEmailProgrammatically] Email sending results: ${successfulSends.length} successful, ${failedSends.length} failed`);
                if (failedSends.length > 0) {
                    console.error("[sendEmailProgrammatically] Failed sends:", failedSends);
                }

                return successfulSends.length > 0;
            } catch (error) {
                console.error("Error sending email programmatically:", error);
                return false;
            }
        },
        [
            callApi,
            hasFrontDeskFeature,
            selectedAccountId,
            setSelectedAccountId,
            currentUser,
            profileUser,
            fetchProfile,
            inboxes,
        ]
    );

    const onClickMoveBoardMissionToDone = async (isSendMessage: boolean = false) => {
        const callBack = async (res) => {
            setOpenMoveToReadyModal(false);
            if (res?.success) {
                alertSuccessUpdate();

                // If isSendMessage is true and hasFrontDeskFeature, send email programmatically without opening modal
                if (isSendMessage && hasFrontDeskFeature) {
                    try {
                        const success = await sendEmailProgrammatically(
                            selectedMission?.id || selectedMission?.boardMissionId,
                            selectedMission?.contactEmail,
                            selectedMission?.contactPhone,
                            selectedMission?.contactName,
                            selectedMission?.customerId,
                            selectedMission?.customerName
                        );
                        if (!success) {
                            console.warn("Failed to send email programmatically, but mission was marked as done");
                        }
                    } catch (error) {
                        console.error("Error sending email programmatically:", error);
                    }
                }

                setOpenPackagesModal(true);
            } else {
                alertFaultUpdate();
            }
        };

        // Check if this is an order action (OrderToReady) or board mission action
        if (selectedMission?.qrCodeAction === QrCodeAction.OrderToReady) {
            await moveOrderToDoneApi(callApi, callBack, {
                orderId: selectedMission.orderId,
                isSendMessage: hasFrontDeskFeature ? false : isSendMessage, // Always false if FrontDesk - we handle email sending programmatically
            });
        } else {
            // Mark as ready - send email programmatically if isSendMessage is true and hasFrontDeskFeature
            await moveBoardMissionToDoneApi(callApi, callBack, {
                boardMissionId: selectedMission?.id || selectedMission?.boardMissionId,
                sendMessage: hasFrontDeskFeature ? false : isSendMessage, // Always false if FrontDesk - we handle email sending programmatically
                productType: "",
                storage: selectedMission?.storage ?? "",
            });
        }
    };

    return (
        <div>
            <BarcodeReader
                onError={handleError}
                onScan={handleScan}
            />
            <GoMakeAlertModal
                openModal={isDeliveryModalOpen}
                onClose={() => setIsDeliveryModalOpen(false)}
                title={t("delivery")}
                subTitle={t("productionFloor.deliveryQrCodeError")}
                onClickConfirm={handleModalConfirm}
                yesBtn="modal.ok"
                withCancelBtn={true}
            />
            <ThreeOptionsModal
                modalType={ModalType.WARNING}
                title={t("boardMissions.markDoneModalTitle")}
                subTitle={t("boardMissions.markDoneModalSubTitle")}
                openModal={openMoveToReadyModal}
                onClose={() => setOpenMoveToReadyModal(false)}
                onClickYes={() => onClickMoveBoardMissionToDone(true)}
                onClickNo={() => onClickMoveBoardMissionToDone(false)}
                yesBtn={t("boardMissions.markDoneModalYes")}
                noBtn={t("boardMissions.markDoneModalNo")}
                style={
                    isMobile
                        ? {
                            width: "95vw",
                            maxWidth: 600,
                            minWidth: "unset",
                        }
                        : undefined
                }
            />
            <PrintPackingSlipModalWidget
                openModal={openPackagesModal}
                onClose={() => setOpenPackagesModal(false)}
                boardMissionId={selectedMission?.id || selectedMission?.boardMissionId}
                quantity={selectedJobQuantity}
            />
            <QRErrorModal
                openModal={isQRErrorModalOpen}
                onClose={() => setIsQRErrorModalOpen(false)}
                errorMessage={qrErrorMessage}
                errorKey={qrErrorKey}
            />
            {isEmailComposerOpen && (
                <FrontDeskEmailComposerWrapper
                    open={isEmailComposerOpen}
                    onClose={closeEmailComposer}
                    emailData={emailData}
                    documentId={selectedMission?.id}
                    documentType={DOCUMENT_TYPE.boardMission}
                />
            )}
        </div>
    )
}
export default QrCodeReader;