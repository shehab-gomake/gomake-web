import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { EmailComposer } from "@/widgets/frontdesk/providers/email/components/email-composer";
import {
    EmailAttachment,
    EmailDraft,
    EmailSenderOption,
} from "@/widgets/frontdesk/providers/email/types/email.types";
import { useSnackBar } from "@/hooks/use-snack-bar";
import {
    chatwootService,
    contactResolutionService,
    conversationComposerService,
    inboxResolutionService,
} from "@/services/frontdesk";
import { chatwootProfileAtom, chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { DOCUMENT_TYPE } from "../enums";
import { useChatwootProfile } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-profile";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import type { ContactDetail } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import type { ContactableInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { ChannelType } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import type { InboxSourceIdMap } from "@/services/frontdesk/api/chatwoot/services/chatwoot-inbox-resolution.service";

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
    const { callApi } = useGomakeAxios();
    const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
    const setSelectedAccountId = useSetRecoilState(chatwootSelectedAccountAtom);
    const currentUser = useRecoilValue(chatwootProfileAtom);
    const { profile: profileUser, loading: profileLoading, fetchProfile } = useChatwootProfile();
    const [isSending, setIsSending] = React.useState(false);
    const [isLoadingContact, setIsLoadingContact] = React.useState(false);
    const [senderOptions, setSenderOptions] = useState<EmailSenderOption[]>([]);
    const [defaultSenderOption, setDefaultSenderOption] = useState<EmailSenderOption | null>(null);
    const [resolvedContact, setResolvedContact] = useState<ContactDetail | null>(null);
    const [contactableInboxes, setContactableInboxes] = useState<ContactableInbox[]>([]);
    const resolvedContactRef = React.useRef<string | null>(null); // Track what we've resolved
    
    // Map to track inbox ID to contact's source_id (email) for API calls
    // Key: inboxId, Value: contact's email (source_id from contactable inbox)
    const [inboxToSourceIdMap, setInboxToSourceIdMap] = useState<Map<number, string>>(new Map());

    const dedupeOptions = useCallback((options: EmailSenderOption[]) => {
        const map = new Map<string, EmailSenderOption>();
        options.forEach((option) => {
            const key = `${option.inboxId}:${option.sourceId.toLowerCase()}`;
            if (!map.has(key)) {
                map.set(key, option);
            }
        });
        return Array.from(map.values());
    }, []);


    /**
     * Resolve Chatwoot contact from GoMake customer data using ContactResolutionService
     */
    const resolveContactFromGomakeCustomer = useCallback(async (
        customerId?: string | number,
        contactEmail?: string,
        contactName?: string,
        contactPhone?: string
    ) => {
        if (!open || !selectedAccountId) return;

        // Create a unique key for this resolution attempt
        const resolutionKey = `${customerId || ''}_${contactEmail || ''}_${selectedAccountId}`;

        // Skip if we've already resolved for this combination
        if (resolvedContactRef.current === resolutionKey) {
            return;
        }

        if (!customerId && !contactEmail) {
            console.warn("[FrontDeskEmailComposerWrapper] No customer ID or contact email provided");
            return;
        }

        // Mark that we're resolving this combination
        resolvedContactRef.current = resolutionKey;
        setIsLoadingContact(true);
        try {
            // Step 1: Resolve contact from GoMake customer using ContactResolutionService
            const chatwootContact = await contactResolutionService.resolveContactFromGomakeCustomer(
                selectedAccountId,
                { callApi },
                {
                    customerId,
                    contactEmail,
                    contactName,
                    contactPhone,
                }
            );

            if (chatwootContact?.id) {
                setResolvedContact(chatwootContact);

                // Step 2: Fetch contactable inboxes and build sender options using InboxResolutionService
                try {
                    const { senderOptions, sourceIdMap, defaultSenderOption, contactableInboxes } =
                        await inboxResolutionService.resolveInboxesForContact(
                            chatwootContact.id,
                            ChannelType.EMAIL
                        );

                    setContactableInboxes(contactableInboxes);
                    setInboxToSourceIdMap(sourceIdMap);
                    setSenderOptions(senderOptions);
                    setDefaultSenderOption(defaultSenderOption);

                    console.log(`[FrontDeskEmailComposerWrapper] Found ${senderOptions.length} email inbox(es) for contact.`, senderOptions);
                } catch (error) {
                    console.error("[FrontDeskEmailComposerWrapper] Failed to fetch contactable inboxes:", error);
                    // Don't block the flow - contact is still resolved even if inbox fetch fails
                }
            }
        } catch (error) {
            console.error("[FrontDeskEmailComposerWrapper] Failed to resolve contact:", error);
            alertFaultSend();
            // Reset ref on error so we can retry
            resolvedContactRef.current = null;
        } finally {
            setIsLoadingContact(false);
        }
    }, [open, selectedAccountId, callApi, alertFaultSend]);

    // Reset when modal closes
    useEffect(() => {
        if (!open) {
            resolvedContactRef.current = null;
            setResolvedContact(null);
            setContactableInboxes([]);
            setSenderOptions([]);
            setDefaultSenderOption(null);
            setInboxToSourceIdMap(new Map());
        }
    }, [open]);

    useEffect(() => {
        if (!open || !emailData) {
            return;
        }

        // Only resolve if we have the required data and haven't resolved yet
        const customerId = emailData.customerId;
        const contactEmail = emailData.contactEmail;
        const contactName = emailData.contactName;
        const contactPhone = emailData.contactPhone;
        
        if (!selectedAccountId) {
            return; // Wait for account ID
        }

        const resolutionKey = `${customerId || ''}_${contactEmail || ''}_${selectedAccountId}`;
        
        if (resolvedContactRef.current !== resolutionKey && (customerId || contactEmail)) {
            resolveContactFromGomakeCustomer(customerId, contactEmail, contactName, contactPhone);
        }
    }, [
        open,
        emailData?.customerId,
        emailData?.contactEmail,
        emailData?.contactName,
        emailData?.contactPhone,
        selectedAccountId,
        resolveContactFromGomakeCustomer
    ]);

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


    const convertAttachmentToFile = (attachment: EmailAttachment): File | null => {
        const base64 = attachment.content ?? attachment.data;
        if (!base64) return null;

        try {
            const byteCharacters = window.atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const mimeType = attachment.contentType ?? attachment.mimeType ?? "application/octet-stream";
            const blob = new Blob([byteArray], { type: mimeType });
            return new File([blob], attachment.filename, { type: mimeType });
        } catch (error) {
            console.error("Failed to convert attachment to file", error);
            return null;
        }
    };

    const resolveSenderOption = useCallback(
        (option?: EmailSenderOption | null): EmailSenderOption | null => {
            const normalizedSource = option?.sourceId?.toLowerCase();

            if (normalizedSource) {
                const positiveMatch = senderOptions.find(
                    (candidate) =>
                        candidate.sourceId?.toLowerCase() === normalizedSource && candidate.inboxId > 0
                );

                if (positiveMatch) {
                    return positiveMatch;
                }

                const looseMatch = senderOptions.find(
                    (candidate) => candidate.sourceId?.toLowerCase() === normalizedSource
                );

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
            const contactId = resolvedContact?.id ?? emailData?.contactId ?? null;

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

            if (!contactId) {
                console.error("[FrontDeskEmailComposerWrapper] Missing contact ID", {
                    resolvedContact,
                    emailData,
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
            const attachments = draft.attachments?.map(convertAttachmentToFile).filter(Boolean) as File[];

            // Get the contact's source_id (email) for this inbox from our map
            const contactSourceId = inboxToSourceIdMap.get(senderOption.inboxId) || emailData?.contactEmail || "";

            if (!contactSourceId) {
                console.error("[FrontDeskEmailComposerWrapper] Missing contact source_id for inbox", {
                    inboxId: senderOption.inboxId,
                    inboxToSourceIdMap,
                    emailData
                });
                alertFaultSend();
                setIsSending(false);
                return false;
            }

            // Prepare payload using ConversationComposerService
            const conversationId = await conversationComposerService.composeAndCreate(accountId, {
                inboxId: senderOption.inboxId,
                contactId,
                sourceId: contactSourceId,
                message: messageContent,
                subject: draft.subject,
                ccEmails,
                bccEmails,
                toEmails,
                attachments,
                assigneeId: currentUser?.id,
                channelType: ChannelType.EMAIL,
                contentType: "input_email",
                additionalAttributes: {
                    gomake_document: {
                        id: documentId,
                        type: documentType,
                    },
                },
            });

            if (conversationId) {
                alertSuccessSend();
                return true;
            }

            alertFaultSend();
            return false;
        } catch (error) {
            console.error("Error sending email:", error);
            alertFaultSend();
            return false;
        } finally {
            setIsSending(false);
        }
    };

    // Convert emailData to EmailDraft format
    const draft: EmailDraft | undefined = emailData
        ? {
            to: (emailData.tos || []).map(email => ({ email })),
            cc: (emailData.ccs || []).map((email) => ({ email })),
            bcc: (emailData.bccs || []).map((email) => ({ email })),
            subject: emailData.subject || "",
            message: htmlToPlainText(emailData.body || ""),
            attachments: emailData.attachments,
            sender: defaultSenderOption,
            contactId: resolvedContact?.id ?? emailData.contactId ?? null,
        }
        : undefined;

    return (
        <EmailComposer
            open={open}
            onClose={onClose}
            onSend={handleSend}
            draft={draft}
            isSending={isSending || isLoadingContact}
            fromOptions={senderOptions}
            defaultSenderOption={defaultSenderOption}
            contactId={resolvedContact?.id ?? emailData?.contactId ?? null}
        />
    );
};

