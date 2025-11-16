import { useState, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { getDocumentMailDataApi } from "@/services/api-service/generic-doc/documents-api";
import { chatwootService } from "@/services/frontdesk";
import { chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { ChannelType, type ContactableInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { EmailAttachment, EmailSenderOption } from "@/widgets/frontdesk/providers/email/types/email.types";
import { DOCUMENT_TYPE } from "../enums";

interface EmailData {
  tos: string[];
  ccs?: string[];
  bccs?: string[];
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
  sender?: string;
  contactId?: number;
  contactEmail?: string;
  contactableInboxes?: ContactableInbox[];
  senderOptions?: EmailSenderOption[];
  defaultSenderOption?: EmailSenderOption | null;
  senderInboxId?: number | null;
  senderInboxName?: string | null;
}

interface UseFrontDeskEmailIntegrationProps {
  documentType: DOCUMENT_TYPE;
}

export const useFrontDeskEmailIntegration = ({
  documentType,
}: UseFrontDeskEmailIntegrationProps) => {
  const { callApi } = useGomakeAxios();
  const { alertFault } = useSnackBar();
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [emailData, setEmailData] = useState<EmailData | null>(null);
  const [isLoadingEmailData, setIsLoadingEmailData] = useState(false);

  const normalizeRecipients = useCallback((value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === "string")
        .map((email) => email.trim())
        .filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);
    }

    return [];
  }, []);

  const buildSenderOptions = useCallback(
    (inboxes: ContactableInbox[]): EmailSenderOption[] => {
      return inboxes
        .filter((item) => item.inbox && item.inbox.channel_type === ChannelType.EMAIL)
        .map((item) => ({
          inboxId: item.inbox.id,
          inboxName: item.inbox.name || item.source_id,
          sourceId: item.source_id,
          channelType: item.inbox.channel_type,
        }));
    },
    []
  );

  const mergeSenderOptions = useCallback((current: EmailSenderOption[], incoming: EmailSenderOption[]) => {
    const map = new Map<string, EmailSenderOption>();
    [...current, ...incoming].forEach((option) => {
      const key = `${option.inboxId}:${option.sourceId}`;
      if (!map.has(key)) {
        map.set(key, option);
      }
    });
    return Array.from(map.values());
  }, []);

  const mergeContactableInboxes = useCallback((current: ContactableInbox[], incoming: ContactableInbox[]) => {
    const list = [...current];
    incoming.forEach((incomingInbox) => {
      const exists = list.some(
        (existing) =>
          existing.source_id?.toLowerCase() === incomingInbox.source_id?.toLowerCase() &&
          existing.inbox?.id === incomingInbox.inbox?.id
      );
      if (!exists) {
        list.push(incomingInbox);
      }
    });
    return list;
  }, []);

  const openEmailComposer = useCallback(
    async (documentId: string | number, contactEmail?: string, contactPhone?: string) => {
      setIsLoadingEmailData(true);
      
      try {
        await getDocumentMailDataApi(
          callApi,
          async (res) => {
            if (res?.success && res?.data) {
              const normalizedAttachments = Array.isArray(res.data.attachments)
                ? res.data.attachments.map((attachment: EmailAttachment) => ({
                    id: attachment.id,
                    filename: attachment.filename,
                    mimeType: attachment.mimeType,
                    contentType: attachment.contentType,
                    size: attachment.size,
                    url: attachment.url,
                    content: attachment.content ?? attachment.data,
                  }))
                : [];

              const sender = typeof res.data.sender === "string" ? res.data.sender : undefined;
              const primaryContactEmail =
                contactEmail ||
                res.data.contactEmail ||
                (Array.isArray(res.data.tos) ? res.data.tos[0] : undefined);

              const senderInboxIdCandidate =
                res.data.senderInboxId ??
                res.data.sender_inbox_id ??
                res.data.inboxId ??
                res.data.inbox_id ??
                res.data.selectedInboxId ??
                res.data.selected_inbox_id;
              const senderInboxId =
                typeof senderInboxIdCandidate === "number"
                  ? senderInboxIdCandidate
                  : senderInboxIdCandidate
                  ? Number(senderInboxIdCandidate)
                  : undefined;
              const senderInboxName =
                typeof res.data.senderInboxName === "string"
                  ? res.data.senderInboxName
                  : typeof res.data.inboxName === "string"
                  ? res.data.inboxName
                  : undefined;

              const responseContactableInboxes: ContactableInbox[] = Array.isArray(res.data.contactableInboxes)
                ? (res.data.contactableInboxes as ContactableInbox[])
                : [];

              let resolvedContactId: number | undefined;
              const contactIdCandidate =
                res.data.contactId ??
                res.data.contact_id ??
                res.data.contact?.id ??
                res.data.contact?.contact_id ??
                res.data.contactDetails?.id;
              if (contactIdCandidate !== undefined && contactIdCandidate !== null) {
                const parsed = Number(contactIdCandidate);
                if (!Number.isNaN(parsed)) {
                  resolvedContactId = parsed;
                }
              }

              let senderOptions: EmailSenderOption[] = buildSenderOptions(responseContactableInboxes);
              let combinedContactableInboxes: ContactableInbox[] = [...responseContactableInboxes];

              if (primaryContactEmail) {
                try {
                  const accountId = selectedAccountId || 1;
                  const filterPayload = {
                    payload: [
                      {
                        attribute_key: "email",
                        filter_operator: "equal_to",
                        values: [primaryContactEmail],
                        attribute_model: "standard",
                      },
                    ],
                  };

                  const filteredContacts = await chatwootService.contacts.filterContacts(
                    accountId,
                    filterPayload,
                    {
                      include_contact_inboxes: true,
                      page: 1,
                      sort: "name",
                    }
                  );

                  const contacts =
                    (filteredContacts as any)?.payload ||
                    (filteredContacts as any)?.data?.payload ||
                    [];

                  const contactMatch = contacts.find(
                    (contact: any) =>
                      contact?.id && contact?.email?.toLowerCase() === primaryContactEmail.toLowerCase()
                  );

                  if (contactMatch?.id) {
                    resolvedContactId = contactMatch.id;
                    const inboxResponse = await chatwootService.contacts.getContactableInboxes(contactMatch.id);
                    const inboxes =
                      (inboxResponse as any)?.payload ||
                      (inboxResponse as any)?.data?.payload ||
                      [];
                    if (Array.isArray(inboxes)) {
                      combinedContactableInboxes = mergeContactableInboxes(combinedContactableInboxes, inboxes);
                      senderOptions = mergeSenderOptions(senderOptions, buildSenderOptions(inboxes));
                    }
                  }
                } catch (error) {
                  console.error("Failed to resolve contactable inboxes", error);
                }
              }

              if (!resolvedContactId && primaryContactEmail) {
                try {
                  const accountId = selectedAccountId || 1;
                  const searchResponse = await chatwootService.contacts.searchContacts(accountId, primaryContactEmail);
                  const searchContacts =
                    (searchResponse as any)?.payload ||
                    (searchResponse as any)?.data?.payload ||
                    [];

                  const searchMatch = searchContacts?.find(
                    (contact: any) =>
                      contact?.id && contact?.email?.toLowerCase() === primaryContactEmail.toLowerCase()
                  );

                  if (searchMatch?.id) {
                    resolvedContactId = searchMatch.id;
                    const inboxResponse = await chatwootService.contacts.getContactableInboxes(searchMatch.id);
                    const inboxes =
                      (inboxResponse as any)?.payload ||
                      (inboxResponse as any)?.data?.payload ||
                      [];
                    if (Array.isArray(inboxes)) {
                      combinedContactableInboxes = mergeContactableInboxes(combinedContactableInboxes, inboxes);
                      senderOptions = mergeSenderOptions(senderOptions, buildSenderOptions(inboxes));
                    }
                  }
                } catch (searchError) {
                  console.error("Fallback contact search failed:", searchError);
                }
              }

              if (resolvedContactId && !combinedContactableInboxes.length) {
                try {
                  const inboxResponse = await chatwootService.contacts.getContactableInboxes(resolvedContactId);
                  const inboxes =
                    (inboxResponse as any)?.payload ||
                    (inboxResponse as any)?.data?.payload ||
                    [];
                  if (Array.isArray(inboxes)) {
                    combinedContactableInboxes = mergeContactableInboxes(combinedContactableInboxes, inboxes);
                    senderOptions = mergeSenderOptions(senderOptions, buildSenderOptions(inboxes));
                  }
                } catch (error) {
                  console.error("Failed to fetch contactable inboxes from contactId:", error);
                }
              }

              if (combinedContactableInboxes.length && !senderOptions.length) {
                senderOptions = buildSenderOptions(combinedContactableInboxes);
              }

              if (!senderOptions.length) {
                try {
                  const inboxResponse = await chatwootService.inboxes.listAllInboxes();
                  const inboxes =
                    (inboxResponse as any)?.payload ||
                    (inboxResponse as any)?.data?.payload ||
                    [];

                  const fallbackOptions = (inboxes || [])
                    .filter((inbox: any) => inbox?.channel_type === ChannelType.EMAIL)
                    .map((inbox: any) => {
                      const channelEmail =
                        inbox?.channel?.email ||
                        inbox?.email ||
                        inbox?.channel?.immediate_reply_email ||
                        inbox?.additional_attributes?.email_address ||
                        inbox?.channel?.forward_to_email ||
                        null;

                      const finalSource = channelEmail || sender || inbox?.name;
                      if (!finalSource) {
                        return null;
                      }

                      return {
                        inboxId: inbox.id,
                        inboxName: inbox.name || finalSource,
                        sourceId: finalSource,
                        channelType: inbox.channel_type,
                      } as EmailSenderOption;
                    })
                    .filter(Boolean) as EmailSenderOption[];

                  if (fallbackOptions.length) {
                    senderOptions = mergeSenderOptions(senderOptions, fallbackOptions);
                  }
                } catch (inboxError) {
                  console.error("Fallback listAllInboxes failed:", inboxError);
                }
              }

              const defaultSenderOption =
                senderOptions.find((option) => sender && option.sourceId.toLowerCase() === sender.toLowerCase()) ??
                (senderOptions.length > 0 ? senderOptions[0] : null);

              // let normalizedDefaultSenderOption = defaultSenderOption;
              let normalizedSenderOptions = senderOptions;
              let erpSenderOption: EmailSenderOption | null = null;


              // if (erpSenderOption) {
              //   normalizedDefaultSenderOption = erpSenderOption;
              // }

              // if (normalizedDefaultSenderOption) {
              //   const exists = normalizedSenderOptions.some(
              //     (option) =>
              //       option.inboxId === normalizedDefaultSenderOption?.inboxId &&
              //       option.sourceId.toLowerCase() === normalizedDefaultSenderOption.sourceId.toLowerCase()
              //   );
              //   if (!exists) {
              //     normalizedSenderOptions = mergeSenderOptions(normalizedSenderOptions, [normalizedDefaultSenderOption]);
              //   }
              // }

              const normalizedEmailData: EmailData = {
                tos: res.data.tos || [],
                ccs: normalizeRecipients(res.data.cc || res.data.ccs),
                bccs: normalizeRecipients(res.data.bcc || res.data.bccs),
                subject: res.data.subject || "",
                body: res.data.body || "",
                attachments: normalizedAttachments,
                sender,
                contactId: resolvedContactId,
                contactEmail: primaryContactEmail,
                contactableInboxes: combinedContactableInboxes,
                senderOptions: normalizedSenderOptions,
                // defaultSenderOption: normalizedDefaultSenderOption,
                // senderInboxId: normalizedDefaultSenderOption?.inboxId ?? senderInboxId ?? null,
                // senderInboxName: normalizedDefaultSenderOption?.inboxName ?? senderInboxName ?? null,
              };

              setEmailData(normalizedEmailData);
              setIsEmailComposerOpen(true);
            } else {
              alertFault("Failed to load email data");
            }
            setIsLoadingEmailData(false);
          },
          {
            documentType,
            document: {
              documentId,
              ...(contactEmail && { contactEmail }),
              ...(contactPhone && { contactPhone }),
            },
          }
        );
      } catch (error) {
        console.error("Error fetching email data:", error);
        alertFault("Failed to load email data");
        setIsLoadingEmailData(false);
      }
    },
    [callApi, documentType, alertFault, selectedAccountId, normalizeRecipients, buildSenderOptions, mergeSenderOptions, mergeContactableInboxes]
  );

  const closeEmailComposer = useCallback(() => {
    setIsEmailComposerOpen(false);
    setEmailData(null);
  }, []);

  return {
    isEmailComposerOpen,
    emailData,
    isLoadingEmailData,
    openEmailComposer,
    closeEmailComposer,
  };
};
