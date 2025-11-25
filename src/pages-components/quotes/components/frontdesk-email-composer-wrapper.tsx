import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { EmailComposer } from "@/widgets/frontdesk/providers/email/components/email-composer";
import { EmailAttachment, EmailDraft, EmailSenderOption } from "@/widgets/frontdesk/providers/email/types/email.types";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { contactResolutionService, conversationComposerService } from "@/services/frontdesk";
import { chatwootProfileAtom, chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { DOCUMENT_TYPE } from "../enums";
import { useChatwootProfile } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-profile";
import { useChatwootInboxes } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-inboxes";
import { ChannelType } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import type { ContactCreatePayload, ContactDetail } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import { getCapitalizedNameFromEmail } from "@/widgets/frontdesk/providers/chatwoot/utils/contact-utils";

// Helper function to convert HTML to plain text
const htmlToPlainText = (html: string): string => {
  if (!html) return "";

  // Create a temporary div element
  const temp = document.createElement("div");
  temp.innerHTML = html;

  // Get text content (automatically strips HTML tags)
  return temp.textContent || temp.innerText || "";
};

interface FrontDeskEmailComposerWrapperProps {
  open: boolean;
  onClose: () => void;
  emailData: {
    tos: string[];
    ccs?: string[];
    bccs?: string[];
    subject: string;
    body: string;
    attachments?: EmailAttachment[];
    sender?: string;
    senderInboxId?: number | null;
    senderInboxName?: string | null;
    contactId?: number;
    contactEmail?: string;
    contactName?: string;
    contactPhone?: string;
    customerId?: string | number;
    customerName?: string;
    senderOptions?: EmailSenderOption[];
    defaultSenderOption?: EmailSenderOption | null;
  } | null;
  documentId: string | number;
  documentType: DOCUMENT_TYPE;
}

export const FrontDeskEmailComposerWrapper: React.FC<FrontDeskEmailComposerWrapperProps> = ({
  open,
  onClose,
  emailData,
  documentId,
  documentType,
}) => {
  const { alertSuccessSend, alertFaultSend } = useSnackBar();
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const setSelectedAccountId = useSetRecoilState(chatwootSelectedAccountAtom);
  const currentUser = useRecoilValue(chatwootProfileAtom);
  const { profile: profileUser, loading: profileLoading, fetchProfile } = useChatwootProfile();
  const { inboxes } = useChatwootInboxes(); // Fetch inboxes independently (same as FrontDesk Chatwoot)
  const [isSending, setIsSending] = React.useState(false);

  // Build sender options from all email inboxes (independent of contact)
  // Same pattern as FrontDesk Chatwoot - fetch inboxes independently
  const senderOptions = useMemo(() => {
    if (!inboxes || inboxes.length === 0) {
      return [];
    }

    // Filter only email inboxes
    const emailInboxes = inboxes.filter(
      (inbox) => inbox.channel_type === ChannelType.EMAIL || inbox.channel_type === "Channel::Email"
    );

    // Build sender options from email inboxes (same logic as InboxResolutionService)
    const options: EmailSenderOption[] = emailInboxes
      .map((inbox) => {
        // Get the inbox's sending email address from various possible properties
        // For SMTP email inboxes, it's in `smtp_email` or `imap_email`
        // For OAuth email inboxes, it's in `_emailAccount.email`
        // NOTE: inbox.name is the display name, NOT the email address
        const inboxEmail =
          (inbox as any).smtp_email || // SMTP sending email (most common)
          (inbox as any).imap_email || // IMAP email address
          (inbox as any).email || // Direct email property
          (inbox as any).forward_to_email || // Forward-to email
          (inbox as any)._emailAccount?.email || // OAuth email account
          (inbox as any).sender_email || // Alternative sender field
          `inbox-${inbox.id}@mail.gomake.com`; // Fallback generated email

        return {
          inboxId: inbox.id,
          inboxName: inbox.name || `Inbox ${inbox.id}`, // Display name
          sourceId: inboxEmail, // Email address for sending
          channelType: inbox.channel_type,
        } as EmailSenderOption;
      })
      .filter((option): option is EmailSenderOption => option !== null);

    return options;
  }, [inboxes]);

  // Default sender option (first email inbox)
  const defaultSenderOption = useMemo(() => {
    return senderOptions.length > 0 ? senderOptions[0] : null;
  }, [senderOptions]);

  useEffect(() => {
    if (!profileUser && !profileLoading) {
      fetchProfile();
    }
  }, [profileUser, profileLoading, fetchProfile]);

  useEffect(() => {
    if (selectedAccountId) {
      return;
    }

    const resolvedAccount =
      currentUser?.accounts?.find((account) => typeof account.id === "number")?.id ??
      profileUser?.accounts?.find((account) => typeof account.id === "number")?.id ??
      currentUser?.account_id ??
      profileUser?.account_id ??
      null;

    if (resolvedAccount) {
      setSelectedAccountId(resolvedAccount);
    }
  }, [selectedAccountId, currentUser, profileUser, setSelectedAccountId]);

  /**
   * Convert attachment to File object
   * Handles both base64-encoded content and URL-based attachments
   */
  const convertAttachmentToFile = async (attachment: EmailAttachment): Promise<File | null> => {
    const base64 = attachment.content ?? attachment.data;
    const mimeType = attachment.contentType ?? attachment.mimeType ?? "application/octet-stream";

    // Handle base64-encoded content
    if (base64) {
      try {
        const byteCharacters = window.atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        return new File([blob], attachment.filename, { type: mimeType });
      } catch (error) {
        console.error("[FrontDeskEmailComposerWrapper] Failed to convert base64 attachment to file", error);
        return null;
      }
    }

    // Handle URL-based attachments
    if (attachment.url) {
      try {
        console.log(`[FrontDeskEmailComposerWrapper] Fetching attachment from URL: ${attachment.url}`);
        const response = await fetch(attachment.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch attachment: ${response.status}`);
        }
        const blob = await response.blob();
        return new File([blob], attachment.filename, { type: mimeType });
      } catch (error) {
        console.error("[FrontDeskEmailComposerWrapper] Failed to fetch URL attachment", error);
        return null;
      }
    }

    console.warn("[FrontDeskEmailComposerWrapper] Attachment has no content, data, or url", attachment);
    return null;
  };

  const resolveSenderOption = useCallback(
    (option?: EmailSenderOption | null): EmailSenderOption | null => {
      const normalizedSource = option?.sourceId?.toLowerCase();

      if (normalizedSource) {
        const positiveMatch = senderOptions.find(
          (candidate) => candidate.sourceId?.toLowerCase() === normalizedSource && candidate.inboxId > 0
        );

        if (positiveMatch) {
          return positiveMatch;
        }

        const looseMatch = senderOptions.find((candidate) => candidate.sourceId?.toLowerCase() === normalizedSource);

        if (looseMatch) {
          return looseMatch;
        }
      }

      return null;
    },
    [senderOptions]
  );

  const extractAccountId = useCallback((profile: typeof currentUser | typeof profileUser | null | undefined) => {
    if (!profile) return null;
    const fromAccounts = profile.accounts?.find((account) => typeof account.id === "number")?.id;
    if (typeof fromAccounts === "number") return fromAccounts;
    if (typeof profile.account_id === "number") return profile.account_id;
    return null;
  }, []);

  const ensureAccountId = useCallback(async (): Promise<number | null> => {
    let resolved = typeof selectedAccountId === "number" ? selectedAccountId : null;

    if (!resolved) {
      resolved = extractAccountId(currentUser) ?? extractAccountId(profileUser);
    }

    if (!resolved) {
      const refreshedProfile = await fetchProfile();
      resolved = extractAccountId(refreshedProfile);
    }

    if (resolved) {
      setSelectedAccountId(resolved);
      return resolved;
    }

    return null;
  }, [selectedAccountId, currentUser, profileUser, fetchProfile, extractAccountId, setSelectedAccountId]);

  const handleSend = async (draft: EmailDraft): Promise<boolean> => {
    setIsSending(true);

    try {
      const senderOption = resolveSenderOption(draft.sender ?? defaultSenderOption);

      if (!senderOption) {
        console.error("[FrontDeskEmailComposerWrapper] Missing sender option", {
          draftSender: draft.sender,
          defaultSenderOption,
          senderOptions,
        });
        alertFaultSend();
        setIsSending(false);
        return false;
      }

      const resolvedAccountId = await ensureAccountId();

      if (!resolvedAccountId) {
        console.error("[FrontDeskEmailComposerWrapper] Unable to resolve Chatwoot account", {
          selectedAccountId,
          currentUser,
          profileUser,
        });
        alertFaultSend();
        setIsSending(false);
        return false;
      }

      const accountId = Number(resolvedAccountId);
      if (Number.isNaN(accountId)) {
        console.error("[FrontDeskEmailComposerWrapper] Resolved account ID is not a number", {
          resolvedAccountId,
        });
        alertFaultSend();
        setIsSending(false);
        return false;
      }

      const messageContent = draft.html || draft.text || draft.body || draft.message || "";
      const toEmails = draft.to?.map((recipient) => recipient.email).filter(Boolean) ?? [];
      const ccEmails = draft.cc?.map((recipient) => recipient.email).filter(Boolean) ?? [];
      const bccEmails = draft.bcc?.map((recipient) => recipient.email).filter(Boolean) ?? [];
      
      // Convert attachments - now async to handle URL-based attachments
      const attachmentPromises = draft.attachments?.map(convertAttachmentToFile) ?? [];
      const attachmentResults = await Promise.all(attachmentPromises);
      const attachments = attachmentResults.filter((file): file is File => file !== null);
      
      console.log(`[FrontDeskEmailComposerWrapper] Converted ${attachments.length} attachments from ${draft.attachments?.length ?? 0} originals`);

      // Validate at least one TO recipient
      if (toEmails.length === 0) {
        console.error("[FrontDeskEmailComposerWrapper] Missing TO recipients", {
          emailData,
          toEmails,
        });
        alertFaultSend();
        setIsSending(false);
        return false;
      }

      // Process EACH TO recipient individually
      // Create separate contact and conversation for each recipient
      console.log(`[FrontDeskEmailComposerWrapper] Processing ${toEmails.length} recipients:`, toEmails);

      const results = await Promise.allSettled(
        toEmails.map(async (recipientEmail) => {
          try {
            console.log(`[FrontDeskEmailComposerWrapper] Processing recipient: ${recipientEmail}`);

            // 1. Find or create contact for this recipient
            const contactName = getCapitalizedNameFromEmail(recipientEmail);
            const contactPayload: ContactCreatePayload = {
              name: contactName,
              email: recipientEmail,
            };

            const contact = await contactResolutionService.findOrCreateContact(accountId, contactPayload);

            if (!contact?.id) {
              throw new Error(`Failed to find or create contact for ${recipientEmail}`);
            }

            console.log(`[FrontDeskEmailComposerWrapper] Contact resolved: ${contact.id} for ${recipientEmail}`);

            // 2. Create conversation for this specific recipient
            // Note: Each recipient gets their own conversation per Chatwoot's architecture
            const conversationId = await conversationComposerService.composeAndCreate(accountId, {
              inboxId: senderOption.inboxId,
              contactId: contact.id, // This recipient's contact
              sourceId: recipientEmail, // This recipient's email
              message: messageContent,
              subject: draft.subject,
              ccEmails,
              bccEmails,
              toEmails: [recipientEmail], // Only this recipient as primary TO
              attachments,
              channelType: ChannelType.EMAIL,
              contentType: "input_email",
              additionalAttributes: {
                gomake_document: {
                  id: documentId,
                  type: documentType,
                },
              },
            });

            if (!conversationId) {
              throw new Error(`Failed to create conversation for ${recipientEmail}`);
            }

            console.log(`[FrontDeskEmailComposerWrapper] Conversation created: ${conversationId} for ${recipientEmail}`);

            return {
              recipientEmail,
              contactId: contact.id,
              conversationId,
              success: true,
            };
          } catch (error) {
            console.error(`[FrontDeskEmailComposerWrapper] Error processing ${recipientEmail}:`, error);
            return {
              recipientEmail,
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            };
          }
        })
      );

      // Check results
      const successfulSends = results.filter(
        (result) => result.status === "fulfilled" && result.value.success
      );
      const failedSends = results.filter(
        (result) => result.status === "rejected" || (result.status === "fulfilled" && !result.value.success)
      );

      console.log(`[FrontDeskEmailComposerWrapper] Results: ${successfulSends.length} successful, ${failedSends.length} failed`);

      if (successfulSends.length > 0) {
        // At least some emails were sent successfully
        if (failedSends.length > 0) {
          console.warn(`[FrontDeskEmailComposerWrapper] Partial success: ${failedSends.length} recipients failed`);
          // Log failed recipients
          failedSends.forEach((result) => {
            if (result.status === "fulfilled") {
              console.error(`[FrontDeskEmailComposerWrapper] Failed recipient: ${result.value.recipientEmail}`, result.value.error);
            }
          });
        }
        alertSuccessSend();
        return true;
      }

      // All sends failed
      console.error("[FrontDeskEmailComposerWrapper] All recipients failed");
      alertFaultSend();
      return false;
    } catch (error) {
      console.error("[FrontDeskEmailComposerWrapper] Unexpected error:", error);
      alertFaultSend();
      return false;
    } finally {
      setIsSending(false);
    }
  };

  // Convert emailData to EmailDraft format
  const draft: EmailDraft | undefined = emailData
    ? {
        // Use contactEmail from API if provided, otherwise use tos array
        to: emailData.contactEmail ? [{ email: emailData.contactEmail }] : (emailData.tos || []).map((email) => ({ email })),
        cc: (emailData.ccs || []).map((email) => ({ email })),
        bcc: (emailData.bccs || []).map((email) => ({ email })),
        subject: emailData.subject || "",
        message: htmlToPlainText(emailData.body || ""),
        attachments: emailData.attachments,
        sender: defaultSenderOption,
      }
    : undefined;

  return (
    <EmailComposer
      open={open}
      onClose={onClose}
      onSend={handleSend}
      draft={draft}
      isSending={isSending}
      fromOptions={senderOptions}
      defaultSenderOption={defaultSenderOption}
    />
  );
};
