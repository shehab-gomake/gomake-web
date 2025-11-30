import { PrimaryButton } from "@/components/button/primary-button";
import { CircularProgress, MenuItem, Paper } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { ArrowDownIcon } from "@/icons";

import {
  getBoardMissionPDF,
  GetPrintingTicketPDFApi,
} from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PDFIcon } from "@/pages-components/quotes/more-circle/icons/pdf";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { getOrderSummeryPdfApi } from "@/services/api-service/board-missions/board-missions-table";
import { PackageIcon } from "@/icons/package-icon";
import { GoMakeDeleteModal, ThreeOptionsModal } from "@/components";
import { isReadyBoardMissionsState } from "@/widgets/production-floor/views/board-missions-view/stations/state";
import { moveBoardMissionToDoneApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { PrintPackingSlipModalWidget } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { ModalType } from "@/enums";
import { FONT_FAMILY } from "@/utils/font-family";
import { adaptPaddingRight } from "@/utils/adapter";
import { useFrontDeskEmailIntegration } from "@/pages-components/quotes/hooks/use-frontdesk-email-integration";
import { FrontDeskEmailComposerWrapper } from "@/pages-components/quotes/components/frontdesk-email-composer-wrapper";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";
import { getDocumentMailDataApi } from "@/services/api-service/generic-doc/documents-api";
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
import { useCallback } from "react";

const DocumentsButton = ({ isMobile = false }) => {
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const [open, setOpen] = useState<boolean>(false);
  const [openPackagesModal, setOpenPackagesModal] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [openMarkReadyModal, setOpenMarkReadyModal] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  // ===== NEW STATE FOR PRINT TYPE SELECTION MODAL =====
  const [openPrintTypeModal, setOpenPrintTypeModal] = useState<boolean>(false);
  const [pendingPrintMission, setPendingPrintMission] = useState(null);

  const isReady = useRecoilValue(isReadyBoardMissionsState);
  const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);

  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const dir = t("direction");
  const { primaryColor } = useGomakeTheme();
  const { alertFaultGetData, alertFaultUpdate, alertSuccessUpdate } =
    useSnackBar();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const menuList = useMemo(
    () => [
      {
        condition: true,
        name: "boardMissions.pdfWorkMission",
        icon: <PDFIcon />,
        onclick: () => handlePrintClick(boardMissions), // CHANGED: Now calls handlePrintClick
      },
      {
        condition: true,
        name: "boardMissions.pdfProductionOrderSummary",
        icon: <PDFIcon />,
        onclick: () => onClickOrderSummeryPdf(boardMissions.boardMissionId),
      },
      {
        condition: true,
        name: t("boardMissions.printProductionPdf"),
        icon: <PDFIcon />,
        onclick: () => GetPrintingTicketPDF(boardMissions.boardMissionId),
      },
      {
        condition: true,
        name: t("boardMissions.printPackagingSlip"),
        icon: <PackageIcon />,
        onclick: () =>
          isReady ? setOpenPackagesModal(true) : setOpenConfirmModal(true),
      },
    ],
    [boardMissions]
  );

  const downloadPdf = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.addEventListener("click", () => {
      setTimeout(() => {
        anchor.remove();
      }, 100);
    });
    anchor.click();
  };

  const onClickOrderSummeryPdf = async (boardMissionId: string) => {
    setOpen(false);
    setDownloading(true);
    const callBack = (res) => {
      setDownloading(false);
      if (res?.success) {
        const pdfLink = res.data;
        window.open(pdfLink, "_blank");
      } else {
      }
    };
    await getOrderSummeryPdfApi(callApi, callBack, { boardMissionId });
  };

  // ===== NEW FUNCTION: Handle print click - checks if productType exists =====
  const handlePrintClick = (mission) => {
    setOpen(false); // Close the menu

    if (mission?.productType) {
      // Has productType - show modal to ask user
      setPendingPrintMission(mission);
      setOpenPrintTypeModal(true);
    } else {
      // No productType - proceed with full job
      processPrintRequest(mission, "");
    }
  };

  // ===== NEW FUNCTION: Process the actual print request =====
  const processPrintRequest = async (mission, productType) => {
    setDownloading(true);
    const callBack = (res) => {
      setDownloading(false);
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
      } else {
        // Handle error
      }
    };

    await getBoardMissionPDF(callApi, callBack, {
      boardMissionId: mission?.boardMissionId,
      productType: productType, // Will be "" for full job or actual productType for specific
    });
  };

  // ===== NEW FUNCTION: Handle user's choice from modal =====
  const handlePrintTypeChoice = (printAll: boolean) => {
    if (!pendingPrintMission) return;

    // Close modal
    setOpenPrintTypeModal(false);

    if (printAll) {
      // User wants full job - send empty string
      processPrintRequest(pendingPrintMission, "");
    } else {
      // User wants specific product type
      processPrintRequest(pendingPrintMission, pendingPrintMission.productType);
    }

    // Clear pending mission
    setPendingPrintMission(null);
  };

  // ===== REMOVED OLD onClickPrint function - replaced with handlePrintClick and processPrintRequest =====

  const GetPrintingTicketPDF = async (boardMissionId) => {
    setDownloading(true);
    const callBack = (res) => {
      setDownloading(false);

      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
      } else {
        alertFaultGetData();
      }
    };
    await GetPrintingTicketPDFApi(callApi, callBack, { boardMissionId });
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
        // Get email data from API
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

        // Resolve account ID
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

        // Get sender inbox
        const emailInboxes = inboxes?.filter(
          (inbox) => inbox.channel_type === ChannelType.EMAIL
        ) || [];
        if (emailInboxes.length === 0) {
          console.error("No email inboxes found");
          return false;
        }
        const senderInbox = emailInboxes[0];

        // Prepare email data from API response
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

        // Convert attachments
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

        // Send email to each recipient via Chatwoot
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
      setOpenMarkReadyModal(false);

      // If isSendMessage is true, send email programmatically without opening modal
      if (isSendMessage && hasFrontDeskFeature && res?.success) {
        try {
          const success = await sendEmailProgrammatically(
            boardMissions?.boardMissionId,
            boardMissions?.clientEmail,
            boardMissions?.clientPhone,
            boardMissions?.contactName,
            boardMissions?.clientId,
            boardMissions?.clientName
          );
          if (!success) {
            console.warn("Failed to send email programmatically, but mission was marked as done");
          }
        } catch (error) {
          console.error("Error sending email programmatically:", error);
        }
      }

      if (boardMissions.productType === "" || !boardMissions.productType) {
        setOpenPackagesModal(true);
      }
      if (res?.success) {
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    // Mark as ready - send email programmatically if isSendMessage is true
    await moveBoardMissionToDoneApi(callApi, callBack, {
      boardMissionId: boardMissions?.boardMissionId,
      sendMessage: false, // Always false - we handle email sending programmatically via FrontDesk
      productType: boardMissions?.productType
    });
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        zIndex: 9999999,
      }}
    >
      <PrimaryButton
        ref={buttonRef}
        style={{
          backgroundColor: primaryColor(300),
          borderRadius: isMobile ? "8px" : "12px",
          ...(isMobile && { height: "30px", ...FONT_FAMILY.Inter(500, 14) }),
        }}
        onClick={() => setOpen(!open)}
        variant={"contained"}
        disabled={downloading}
        startIcon={
          dir === "rtl" ? (
            <ArrowDownIcon
              fill={"#FFF"}
              width={isMobile ? "13px" : undefined}
              height={isMobile ? "10px" : undefined}
            />
          ) : undefined
        }
        endIcon={
          downloading ? (
            <CircularProgress size={isMobile ? 18 : 25} />
          ) : dir === "ltr" ? (
            <ArrowDownIcon
              fill={"#FFF"}
              width={isMobile ? "13px" : undefined}
              height={isMobile ? "10px" : undefined}
            />
          ) : undefined
        }
      >
        {t("productionFloor.documents")}
      </PrimaryButton>
      {!!open && (
        <ClickOutside exceptionRef={buttonRef} onClick={() => setOpen(false)}>
          <Paper
            sx={{
              position: "absolute",
              right: 0,
              top: "110%",
              zIndex: 9999999,
            }}
          >
            {menuList.map(
              (item, index) =>
                item.condition && (
                  <MenuItem
                    style={{
                      display: "flex",
                      flexDirection: "row" as "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 8,
                      color: primaryColor(300),
                      ...adaptPaddingRight(dir, isMobile ? 10 : 15),
                      ...(isMobile && { ...FONT_FAMILY.Inter(500, 12) }),
                    }}
                    key={index}
                    onClick={item?.onclick}
                  >
                    {item?.icon}
                    {t(item?.name)}
                  </MenuItem>
                )
            )}
          </Paper>
        </ClickOutside>
      )}

      {/* ===== NEW MODAL: Print Type Selection Modal ===== */}
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.selectPrintContent")}
        subTitle={
          pendingPrintMission?.productType
            ? t("boardMissions.askPrintType", {
              productType: pendingPrintMission.productTypeName || pendingPrintMission.productType
            })
            : ""
        }
        yesBtn={t("boardMissions.printAllJobs")}
        noBtn={t("boardMissions.printProductTypeOnly", {
          productType: pendingPrintMission?.productTypeName || pendingPrintMission?.productType
        })}
        openModal={openPrintTypeModal}
        onClose={() => {
          setOpenPrintTypeModal(false);
          setPendingPrintMission(null);
        }}
        onClickYes={() => handlePrintTypeChoice(true)}
        onClickNo={() => handlePrintTypeChoice(false)}
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
        boardMissionId={boardMissions?.boardMissionId}
        quantity={boardMissions?.quantity}
      />
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.printAndMoveToReadyTitle")}
        subTitle={" "}
        yesBtn={t("boardMissions.printAndTransferToReady")}
        noBtn={t("boardMissions.printOnly")}
        openModal={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onClickYes={() => {
          setOpenPackagesModal(false);
          setOpenMarkReadyModal(true);
        }}
        onClickNo={() => setOpenPackagesModal(true)}
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
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        openModal={openMarkReadyModal}
        onClose={() => setOpenMarkReadyModal(false)}
        onClickDelete={() => onClickMoveBoardMissionToDone(true)}
        onClickCancel={() => onClickMoveBoardMissionToDone(false)}
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
      {isEmailComposerOpen && (
        <FrontDeskEmailComposerWrapper
          open={isEmailComposerOpen}
          onClose={closeEmailComposer}
          emailData={emailData}
          documentId={boardMissions?.boardMissionId}
          documentType={DOCUMENT_TYPE.boardMission}
        />
      )}
    </div>
  );
};

export { DocumentsButton };
