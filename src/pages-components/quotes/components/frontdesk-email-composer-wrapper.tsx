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
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import type { ContactDetail } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import type { ContactableInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { ChannelType } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import type { ContactCreatePayload } from "@/services/frontdesk/api/chatwoot/types/contacts.types";

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

/**
 * Helper function to find existing contact by email or create new one
 * Same pattern as useComposeConversation
 */
async function findOrCreateContact(
    accountId: number,
    createPayload: ContactCreatePayload
): Promise<ContactDetail | null> {
    // Step 1: If email is provided, search for existing contact first
    if (createPayload.email?.trim()) {
        try {
            const searchResults = await chatwootService.contacts.searchContacts(
                accountId,
                createPayload.email.trim()
            );

            // Find exact email match (case-insensitive)
            const exactMatch = searchResults.payload?.find(
                (c) => c.email?.toLowerCase() === createPayload.email?.toLowerCase()
            );

            if (exactMatch?.id) {
                console.log(
                    `[findOrCreateContact] Found existing contact with email ${createPayload.email}, ID: ${exactMatch.id}`
                );
                return {
                    id: exactMatch.id,
                    name: exactMatch.name,
                    email: exactMatch.email,
                    phone_number: exactMatch.phone_number,
                    thumbnail: exactMatch.thumbnail,
                    additional_attributes: exactMatch.additional_attributes,
                } as ContactDetail;
            }
        } catch (searchError) {
            console.warn(
                `[findOrCreateContact] Failed to search for existing contact: ${searchError}`
            );
        }
    }

    // Step 2: Try to create new contact
    try {
        const createResponse = await chatwootService.contacts.createContact(accountId, createPayload);
        return createResponse;
    } catch (createError: any) {
        // Step 3: Handle 422 "Email has already been taken" by searching again
        if (createError?.status === 422 && createPayload.email?.trim()) {
            console.warn(
                `[findOrCreateContact] Contact creation failed with 422, attempting to find existing contact by email`
            );

            try {
                const searchResults = await chatwootService.contacts.searchContacts(
                    accountId,
                    createPayload.email.trim()
                );

                // Find exact email match
                const exactMatch = searchResults.payload?.find(
                    (c) => c.email?.toLowerCase() === createPayload.email?.toLowerCase()
                );

                if (exactMatch?.id) {
                    console.log(
                        `[findOrCreateContact] Successfully recovered by finding existing contact ID: ${exactMatch.id}`
                    );
                    return {
                        id: exactMatch.id,
                        name: exactMatch.name,
                        email: exactMatch.email,
                        phone_number: exactMatch.phone_number,
                        thumbnail: exactMatch.thumbnail,
                        additional_attributes: exactMatch.additional_attributes,
                    } as ContactDetail;
                } else {
                    throw createError;
                }
            } catch (fallbackError) {
                throw createError;
            }
        } else {
            throw createError;
        }
    }
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
     * Resolve Chatwoot contact from GoMake customer data
     * Follows the EXACT same pattern as useComposeConversation
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
            let chatwootContact: ContactDetail | null = null;

            // Step 1: Search GoMake customer by customerId to get contacts
            if (customerId) {
                try {
                    const customerResult = await callApi(
                        "GET",
                        "/v1/customers/get-customers-pagination",
                        {
                            clientType: "C",
                            pageNumber: 1,
                            pageSize: 1,
                            id: customerId,
                            isActive: true,
                        },
                        false
                    );

                    if (customerResult?.data?.data?.data?.length > 0) {
                        const customer = customerResult.data.data.data[0];
                        
                        // Get customer contacts from gomake CRM
                        const contactsResponse = await callApi(
                            "GET",
                            "/v1/crm-service/customer/get-client-contacts",
                            { ClientId: customerId },
                            false
                        );

                        let contactsArray: any[] = [];
                        
                        // Handle different response formats (same as useComposeConversation)
                        if (contactsResponse?.data?.data?.data && Array.isArray(contactsResponse.data.data.data)) {
                            contactsArray = contactsResponse.data.data.data;
                        } else if (contactsResponse?.data?.data && Array.isArray(contactsResponse.data.data)) {
                            contactsArray = contactsResponse.data.data;
                        } else if (contactsResponse?.data && Array.isArray(contactsResponse.data)) {
                            contactsArray = contactsResponse.data;
                        } else if (Array.isArray(contactsResponse)) {
                            contactsArray = contactsResponse;
                        }
                        
                        // Find matching contact by email or use first contact
                        let selectedContact = contactsArray.find(
                            (c: any) => (c.mail || c.email)?.toLowerCase() === contactEmail?.toLowerCase()
                        ) || contactsArray[0] || null;

                        // If no contact found but customer has email/phone, create fallback contact
                        if (!selectedContact && (customer.mail || customer.phone)) {
                            selectedContact = {
                                id: undefined,
                                name: customer.name || contactName || "",
                                mail: customer.mail || contactEmail || "",
                                phone: customer.phone || contactPhone || "",
                            };
                        }

                        if (selectedContact) {
                            const gomakeContact = {
                                id: undefined,
                                name: selectedContact.name || contactName || customer.name || "",
                                email: selectedContact.mail || selectedContact.email || contactEmail || customer.mail || "",
                                phone_number: selectedContact.phone || selectedContact.phone_number || contactPhone || customer.phone || "",
                                gomake_contact_id: selectedContact.id || selectedContact._id,
                                gomake_customer_id: customerId,
                                gomake_customer_name: customer.name || "",
                                gomake_client_code: customer.code || customer.customerCode || "",
                                gomake_agent_id: customer.agentId || customer.agent_id || "",
                                gomake_is_main_contact: selectedContact.isMainContact || selectedContact.is_main_contact || true,
                            };

                            // Step 2: Search Chatwoot for contact with gomake_contact_id (if available)
                            if (gomakeContact.gomake_contact_id) {
                                const filters = [
                                    {
                                        attribute_key: "gomake_contact_id",
                                        filter_operator: "equal_to",
                                        values: [gomakeContact.gomake_contact_id],
                                        attribute_model: "standard",
                                    },
                                ];

                                // Filter contacts WITHOUT including contact inboxes (Chatwoot pattern)
                                const filterResponse = await chatwootService.contacts.filterContacts(
                                    selectedAccountId,
                                    { payload: filters },
                                    {
                                        include_contact_inboxes: false,
                                        page: 1,
                                        sort: "name",
                                    }
                                );

                                const foundContacts = filterResponse.payload || [];
                                
                                if (foundContacts.length === 1) {
                                    // Found existing contact - use it
                                    chatwootContact = foundContacts[0];
                                } else if (foundContacts.length === 0) {
                                    // Not found, create new contact
                                    const createPayload: ContactCreatePayload = {
                                        name: gomakeContact.name,
                                        email: gomakeContact.email || undefined,
                                        phone_number: gomakeContact.phone_number || undefined,
                                        custom_attributes: {
                                            gomake_contact_id: gomakeContact.gomake_contact_id,
                                            gomake_customer_id: gomakeContact.gomake_customer_id,
                                            gomake_client_code: gomakeContact.gomake_client_code,
                                            gomake_agent_id: gomakeContact.gomake_agent_id,
                                            gomake_is_main_contact: gomakeContact.gomake_is_main_contact,
                                        },
                                    };
                                    chatwootContact = await findOrCreateContact(selectedAccountId, createPayload);
                                } else {
                                    // Multiple found - use first one
                                    console.warn(
                                        `[FrontDeskEmailComposerWrapper] Multiple contacts found with gomake_contact_id ${gomakeContact.gomake_contact_id}, using first one`
                                    );
                                    chatwootContact = foundContacts[0];
                                }
                            } else {
                                // No gomake_contact_id, use find-or-create pattern
                                const createPayload: ContactCreatePayload = {
                                    name: gomakeContact.name,
                                    email: gomakeContact.email || undefined,
                                    phone_number: gomakeContact.phone_number || undefined,
                                    custom_attributes: {
                                        gomake_customer_id: gomakeContact.gomake_customer_id,
                                        gomake_client_code: gomakeContact.gomake_client_code,
                                        gomake_agent_id: gomakeContact.gomake_agent_id,
                                        gomake_is_main_contact: gomakeContact.gomake_is_main_contact,
                                    },
                                };
                                chatwootContact = await findOrCreateContact(selectedAccountId, createPayload);
                            }
                        }
                    }
                } catch (error) {
                    console.error("[FrontDeskEmailComposerWrapper] Failed to fetch GoMake customer:", error);
                }
            }

            // Step 3: Fallback - if no customer found, try to create contact from email/phone
            if (!chatwootContact && contactEmail) {
                const createPayload: ContactCreatePayload = {
                    name: contactName || contactEmail,
                    email: contactEmail,
                    phone_number: contactPhone || undefined,
                };
                chatwootContact = await findOrCreateContact(selectedAccountId, createPayload);
            }

            if (chatwootContact?.id) {
                setResolvedContact(chatwootContact);
                
                // Step 4: Fetch contactable inboxes SEPARATELY (Chatwoot pattern)
                // This is the key - fetch inboxes AFTER contact is resolved
                try {
                    const inboxResponse = await chatwootService.contacts.getContactableInboxes(chatwootContact.id);
                    const contactableInboxesData = inboxResponse.payload || [];
                    setContactableInboxes(contactableInboxesData);

                    // Step 5: Build sender options from contactable inboxes
                    // Filter for email inboxes only
                    const emailContactableInboxes = contactableInboxesData.filter(
                        (item) => item.inbox && item.inbox.channel_type === ChannelType.EMAIL
                    );
                    
                    // Build a map of inbox ID to contact's source_id (email) for API calls
                    const sourceIdMap = new Map<number, string>();
                    
                    // Transform contactable inboxes to sender options
                    // IMPORTANT: 
                    // - contactableInbox.source_id = CONTACT's email (what we send in API as source_id)
                    // - inbox.name/email = INBOX's email (what we display in the "From" dropdown)
                    const options: EmailSenderOption[] = emailContactableInboxes.map((contactableInbox) => {
                        const inbox = contactableInbox.inbox;
                        
                        // Store the contact's source_id (email) for this inbox for API use
                        sourceIdMap.set(inbox.id, contactableInbox.source_id);
                        
                        // Get the inbox's sending email address from various possible properties
                        const inboxEmail = 
                            inbox.name || // OAuth inboxes store email in name
                            inbox.forward_to_email || // Forward-to email
                            inbox.email || // Direct email property
                            (inbox as any)._emailAccount?.email || // OAuth email account
                            `inbox-${inbox.id}@mail.gomake.com`; // Fallback generated email
                        
                        return {
                            inboxId: inbox.id,
                            inboxName: inbox.name || `Inbox ${inbox.id}`,
                            sourceId: inboxEmail, // The INBOX's email for display in dropdown
                            channelType: inbox.channel_type,
                        };
                    });
                    
                    setInboxToSourceIdMap(sourceIdMap);
                    setSenderOptions(options);
                    
                    // Set default sender option (first email inbox)
                    if (options.length > 0) {
                        setDefaultSenderOption(options[0]);
                        console.log(`[FrontDeskEmailComposerWrapper] Found ${options.length} email inbox(es) for contact. User can select from dropdown.`, options);
                    } else {
                        console.warn("[FrontDeskEmailComposerWrapper] No email inboxes found for contact");
                    }
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
            const hasAttachments = (draft.attachments?.length ?? 0) > 0;
            const assigneeId = currentUser?.id;

            // Get the contact's source_id (email) for this inbox from our map
            // This is what Chatwoot expects as source_id (the contact's identifier, not the inbox's email)
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

            let payload: FormData | Record<string, any>;

            // Build content_attributes for email metadata
            const contentAttributes: Record<string, any> = {};
            if (toEmails.length > 0 || ccEmails.length > 0 || bccEmails.length > 0) {
                contentAttributes.email = {};
                if (toEmails.length > 0) {
                    contentAttributes.email.to = toEmails;
                }
                if (ccEmails.length > 0) {
                    contentAttributes.email.cc = ccEmails;
                }
                if (bccEmails.length > 0) {
                    contentAttributes.email.bcc = bccEmails;
                }
            }

            if (hasAttachments) {
                const formData = new FormData();
                formData.append("inbox_id", senderOption.inboxId.toString());
                formData.append("contact_id", contactId.toString());
                formData.append("source_id", contactSourceId); // Contact's email (identifier in this channel)
                formData.append("status", "open");
                if (assigneeId) {
                    formData.append("assignee_id", assigneeId.toString());
                }
                if (messageContent) {
                    formData.append("message[content]", messageContent);
                    formData.append("message[content_type]", "input_email"); // Email content type
                }
                
                // Email-specific fields
                if (ccEmails.length > 0) {
                    formData.append("message[cc_emails]", ccEmails.join(","));
                }
                if (bccEmails.length > 0) {
                    formData.append("message[bcc_emails]", bccEmails.join(","));
                }
                
                // Add content_attributes as JSON string for FormData
                if (Object.keys(contentAttributes).length > 0) {
                    formData.append("message[content_attributes]", JSON.stringify(contentAttributes));
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
                // Use JSON for no attachments
                const jsonPayload: Record<string, any> = {
                    inbox_id: senderOption.inboxId,
                    contact_id: contactId,
                    source_id: contactSourceId, // Contact's email (identifier in this channel)
                    status: "open",
                };

                if (assigneeId) {
                    jsonPayload.assignee_id = assigneeId;
                }

                // Message with email content_attributes
                if (messageContent || Object.keys(contentAttributes).length > 0 || ccEmails.length > 0 || bccEmails.length > 0) {
                    jsonPayload.message = {
                        content: messageContent,
                        content_type: "input_email", // Email content type
                        ...(Object.keys(contentAttributes).length > 0 && {
                            content_attributes: contentAttributes,
                        }),
                        ...(ccEmails.length > 0 && { cc_emails: ccEmails.join(",") }),
                        ...(bccEmails.length > 0 && { bcc_emails: bccEmails.join(",") }),
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

