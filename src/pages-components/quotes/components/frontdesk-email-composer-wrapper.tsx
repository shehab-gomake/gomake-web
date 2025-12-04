/**
 * FrontDesk Email Composer Wrapper
 *
 * Wrapper component that integrates the EmailComposer with Chatwoot's
 * conversation creation flow for sending quotes via email.
 */

import React, { useCallback, useEffect, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { EmailComposer } from "@/widgets/frontdesk/providers/email/components/email-composer";
import { EmailAttachment, EmailDraft, EmailSenderOption } from "@/widgets/frontdesk/providers/email/types/email.types";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { contactResolutionService, conversationComposerService } from "@/services/frontdesk";
import { chatwootProfileAtom, chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { DOCUMENT_TYPE } from "../enums";
import { useChatwootProfile } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-profile";
import { useChatwootInboxes } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-inboxes";
import { ChannelType, ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import type { ContactCreatePayload } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import { getCapitalizedNameFromEmail } from "@/widgets/frontdesk/providers/chatwoot/utils/contact-utils";
import { convertAttachmentsToFiles } from "@/widgets/frontdesk/providers/chatwoot/utils/attachment.utils";
import type { AttachmentSource } from "@/widgets/frontdesk/providers/chatwoot/types/attachment.types";
import { htmlToText } from "@/widgets/frontdesk/utils/string.utils";

// ============================================================================
// Constants
// ============================================================================

const LOG_PREFIX = "[FrontDeskEmailComposerWrapper]";

/**
 * Map EmailAttachment to AttachmentSource for conversion
 */
const mapToAttachmentSource = (attachment: EmailAttachment): AttachmentSource => ({
  content: attachment.content,
  data: attachment.data,
  url: attachment.url,
  filename: attachment.filename,
  mimeType: attachment.mimeType,
  contentType: attachment.contentType,
  size: attachment.size,
});

/**
 * Extract email address from inbox configuration
 * Checks multiple possible properties where email might be stored
 * Based on Chatwoot's inbox API response structure
 */
const getInboxEmailAddress = (inbox: ChatwootInbox): string => {
  // Priority order for email address resolution
  // Chatwoot returns: email, imap_login, smtp_login, forward_to_email
  return (
    inbox.email ||             // Direct email property (primary)
    inbox.imap_login ||        // IMAP login (usually same as email)
    inbox.smtp_login ||        // SMTP login (usually same as email)
    inbox.forward_to_email ||  // Forward-to email
    inbox._emailAccount?.email || // OAuth email account (internal)
    inbox.sender_email ||      // Alternative sender field
    `inbox-${inbox.id}@mail.gomake.com` // Fallback generated email
  );
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
  isLoading?: boolean;
}

export const FrontDeskEmailComposerWrapper: React.FC<FrontDeskEmailComposerWrapperProps> = ({
  open,
  onClose,
  emailData,
  documentId,
  documentType,
  isLoading = false,
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
  const senderOptions = useMemo((): EmailSenderOption[] => {
    if (!inboxes || inboxes.length === 0) {
      return [];
    }

    // Filter only email inboxes
    const emailInboxes = inboxes.filter(
      (inbox): inbox is ChatwootInbox =>
        inbox.channel_type === ChannelType.EMAIL ||
        inbox.channel_type === "Channel::Email"
    );

    // Build sender options from email inboxes
    return emailInboxes.map((inbox) => ({
      inboxId: inbox.id,
      inboxName: inbox.name || `Inbox ${inbox.id}`,
      sourceId: getInboxEmailAddress(inbox),
      channelType: inbox.channel_type as string,
    }));
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
   * Resolve sender option from available options
   */
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
        console.error(`${LOG_PREFIX} Missing sender option`, {
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
        console.error(`${LOG_PREFIX} Unable to resolve Chatwoot account`, {
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
        console.error(`${LOG_PREFIX} Resolved account ID is not a number`, {
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

      // Convert attachments using the utility function
      const attachmentSources = (draft.attachments || []).map(mapToAttachmentSource);
      const attachments = await convertAttachmentsToFiles(attachmentSources);

      console.log(`${LOG_PREFIX} Converted ${attachments.length} attachments from ${draft.attachments?.length ?? 0} originals`);

      // Validate at least one TO recipient
      if (toEmails.length === 0) {
        console.error(`${LOG_PREFIX} Missing TO recipients`, { emailData, toEmails });
        alertFaultSend();
        setIsSending(false);
        return false;
      }

      // Process EACH TO recipient individually
      // Create separate contact and conversation for each recipient
      console.log(`${LOG_PREFIX} Processing ${toEmails.length} recipients:`, toEmails);

      const results = await Promise.allSettled(
        toEmails.map(async (recipientEmail) => {
          try {
            console.log(`${LOG_PREFIX} Processing recipient: ${recipientEmail}`);

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

            console.log(`${LOG_PREFIX} Contact resolved: ${contact.id} for ${recipientEmail}`);

            // 2. Create conversation for this specific recipient
            // Note: Each recipient gets their own conversation per Chatwoot's architecture
            // IMPORTANT: Do NOT set contentType for email channels - it defaults to "text"
            // "input_email" is for widget email collection, not for sending emails
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
              // DO NOT set contentType - let Chatwoot use default "text"
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

            console.log(`${LOG_PREFIX} Conversation created: ${conversationId} for ${recipientEmail}`);

            return {
              recipientEmail,
              contactId: contact.id,
              conversationId,
              success: true,
            };
          } catch (error) {
            console.error(`${LOG_PREFIX} Error processing ${recipientEmail}:`, error);
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

      console.log(`${LOG_PREFIX} Results: ${successfulSends.length} successful, ${failedSends.length} failed`);

      if (successfulSends.length > 0) {
        // At least some emails were sent successfully
        if (failedSends.length > 0) {
          console.warn(`${LOG_PREFIX} Partial success: ${failedSends.length} recipients failed`);
          failedSends.forEach((result) => {
            if (result.status === "fulfilled") {
              console.error(`${LOG_PREFIX} Failed recipient: ${result.value.recipientEmail}`, result.value.error);
            }
          });
        }
        alertSuccessSend();
        return true;
      }

      // All sends failed
      console.error(`${LOG_PREFIX} All recipients failed`);
      alertFaultSend();
      return false;
    } catch (error) {
      console.error(`${LOG_PREFIX} Unexpected error:`, error);
      alertFaultSend();
      return false;
    } finally {
      setIsSending(false);
    }
  };

  // Convert emailData to EmailDraft format
  // Use htmlToText to preserve line breaks from HTML block elements (p, br, div, etc.)
  const draft: EmailDraft | undefined = emailData
    ? {
        // Use contactEmail from API if provided, otherwise use tos array
        to: emailData.contactEmail ? [{ email: emailData.contactEmail }] : (emailData.tos || []).map((email) => ({ email })),
        cc: (emailData.ccs || []).map((email) => ({ email })),
        bcc: (emailData.bccs || []).map((email) => ({ email })),
        subject: emailData.subject || "",
        message: htmlToText(emailData.body || ""),
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
      isLoading={isLoading}
      fromOptions={senderOptions}
      defaultSenderOption={defaultSenderOption}
    />
  );
};
