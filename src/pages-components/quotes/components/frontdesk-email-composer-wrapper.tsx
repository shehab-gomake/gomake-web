import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { EmailComposer } from "@/widgets/frontdesk/providers/email/components/email-composer";
import {
    EmailAttachment,
    EmailDraft,
    EmailSenderOption,
} from "@/widgets/frontdesk/providers/email/types/email.types";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { chatwootService } from "@/services/frontdesk";
import { chatwootProfileAtom, chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { DOCUMENT_TYPE } from "../enums";
import { useChatwootProfile } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-profile";

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
    const [isSending, setIsSending] = React.useState(false);
    const [senderOptions, setSenderOptions] = useState<EmailSenderOption[]>([]);
    const [defaultSenderOption, setDefaultSenderOption] = useState<EmailSenderOption | null>(null);

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

    const mapContactableToOptions = useCallback((contactable: unknown): EmailSenderOption[] => {
        if (!Array.isArray(contactable)) return [];
        return contactable
            .filter((item) => item?.inbox?.channel_type === "Channel::Email")
            .map((item) => ({
                inboxId: item.inbox.id,
                inboxName: item.inbox.name || item.source_id,
                sourceId: item.source_id,
                channelType: item.inbox.channel_type,
            }));
    }, []);

    useEffect(() => {
        if (!emailData) {
            setSenderOptions([]);
            setDefaultSenderOption(null);
            return;
        }

        const baseOptions = emailData.senderOptions ?? [];
        let mergedOptions = dedupeOptions(baseOptions);

        setSenderOptions(mergedOptions);
        setDefaultSenderOption(null);
    }, [emailData, dedupeOptions]);

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

    useEffect(() => {
        let cancelled = false;

        const resolveContactInboxes = async () => {
            if (!open || !emailData?.contactId) return;

            const hasServerProvidedOptions = (emailData.senderOptions?.length ?? 0) > 0;
            if (hasServerProvidedOptions) return;

            try {
                const response = await chatwootService.contacts.getContactableInboxes(emailData.contactId);
                const inboxes =
                    (response as any)?.payload ||
                    (response as any)?.data?.payload ||
                    [];

                const additionalOptions = mapContactableToOptions(inboxes);
                if (additionalOptions.length === 0) return;
                if (cancelled) return;

                const merged = dedupeOptions([...senderOptions, ...additionalOptions]);

                let nextDefault = defaultSenderOption;
                if (!nextDefault && emailData.sender) {
                    nextDefault =
                        merged.find(
                            (option) => option.sourceId.toLowerCase() === emailData.sender.toLowerCase()
                        ) ?? null;
                }

                setSenderOptions(merged);
                setDefaultSenderOption(nextDefault);
            } catch (error) {
                console.error("Failed to fetch contactable inboxes for composer:", error);
            }
        };

        resolveContactInboxes();

        return () => {
            cancelled = true;
        };
    }, [
        open,
        emailData,
        senderOptions,
        defaultSenderOption,
        dedupeOptions,
        mapContactableToOptions,
    ]);

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
            let contactId = draft.contactId ?? emailData?.contactId ?? null;

            if (!senderOption) {
                console.error("[FrontDeskEmailComposerWrapper] Missing sender or contact", {
                    draftSender: draft.sender,
                    defaultSenderOption,
                    resolvedSenderOption: senderOption,
                    contactId,
                    senderOptions,
                    emailData,
                });
                alertFaultSend();
                setIsSending(false);
                return false;
            }

            const resolvedAccountId = await ensureAccountId();

            if (!resolvedAccountId) {
                console.log("[FrontDeskEmailComposerWrapper] Unable to resolve Chatwoot account", {
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
                console.log("[FrontDeskEmailComposerWrapper] Resolved account ID is not a number", {
                    resolvedAccountId,
                });
                alertFaultSend();
                setIsSending(false);
                return false;
            }

            if (!contactId) {
                const fallbackEmail =
                    emailData?.contactEmail ||
                    emailData?.tos?.[0] ||
                    draft.to?.[0]?.email ||
                    null;

                if (!fallbackEmail) {
                    console.error("[FrontDeskEmailComposerWrapper] Missing contact email for conversation payload", {
                        draft,
                        emailData,
                    });
                    alertFaultSend();
                    setIsSending(false);
                    return false;
                }



            }

            const messageContent = draft.html || draft.text || draft.body || draft.message || "";
            const ccEmails = draft.cc?.map((recipient) => recipient.email).filter(Boolean) ?? [];
            const bccEmails = draft.bcc?.map((recipient) => recipient.email).filter(Boolean) ?? [];
            const hasAttachments = (draft.attachments?.length ?? 0) > 0;
            const assigneeId = currentUser?.id;

            let payload: FormData | Record<string, any>;

            if (hasAttachments) {
                const formData = new FormData();
                formData.append("inbox_id", senderOption.inboxId.toString());
                formData.append("contact_id", contactId.toString());
                formData.append("source_id", senderOption.sourceId);
                formData.append("status", "open");
                if (assigneeId) {
                    formData.append("assignee_id", assigneeId.toString());
                }
                if (messageContent) {
                    formData.append("message[content]", messageContent);
                }
                if (ccEmails.length > 0) {
                    formData.append("message[cc_emails]", ccEmails.join(","));
                }
                if (bccEmails.length > 0) {
                    formData.append("message[bcc_emails]", bccEmails.join(","));
                }
                if (draft.subject) {
                    formData.append("additional_attributes[mail_subject]", draft.subject);
                }
                formData.append("additional_attributes[gomake_document][id]", String(documentId));
                formData.append("additional_attributes[gomake_document][type]", String(documentType));

                draft.attachments?.forEach((attachment) => {
                    const file = convertAttachmentToFile(attachment);
                    if (file) {
                        formData.append("message[attachments][]", file);
                    }
                });

                payload = formData;
            } else {
                const jsonPayload: Record<string, any> = {
                    inbox_id: senderOption.inboxId,
                    contact_id: contactId,
                    source_id: senderOption.sourceId,
                    status: "open",
                };

                if (assigneeId) {
                    jsonPayload.assignee_id = assigneeId;
                }

                if (messageContent || ccEmails.length > 0 || bccEmails.length > 0) {
                    jsonPayload.message = {
                        content: messageContent,
                        ...(ccEmails.length > 0 ? { cc_emails: ccEmails.join(",") } : {}),
                        ...(bccEmails.length > 0 ? { bcc_emails: bccEmails.join(",") } : {}),
                    };
                }

                const additionalAttributes: Record<string, any> = {
                    gomake_document: {
                        id: documentId,
                        type: documentType,
                    },
                };

                if (draft.subject) {
                    additionalAttributes.mail_subject = draft.subject;
                }

                jsonPayload.additional_attributes = additionalAttributes;

                payload = jsonPayload;
            }

            const response = await chatwootService.conversations.createConversation(accountId, payload);
            const conversation = (response as any)?.data || (response as any)?.payload || response;
            if (conversation?.id) {
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
            contactId: emailData.contactId ?? null,
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
            contactId={emailData?.contactId ?? null}
        />
    );
};

