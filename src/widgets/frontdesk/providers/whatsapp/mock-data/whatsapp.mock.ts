import type { ConversationItem } from "@/widgets/frontdesk/components/providers/provider-types";
import type { ConversationMessage } from "@/widgets/frontdesk/components/conversation/conversation-types";

/**
 * Helper to generate ISO timestamp with offset
 */
function nowIso(offsetMinutes = 0): string {
  const d = new Date(Date.now() + offsetMinutes * 60 * 1000);
  return d.toISOString();
}

/**
 * Helper to convert ISO timestamp to human-readable time
 */
function toHumanTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString();
}

/**
 * Mock WhatsApp conversations for development
 */
export const MOCK_CONVERSATIONS: ConversationItem[] = [
  {
    id: "wa_1",
    from: "+1 650-555-0100",
    subject: "Sam (WhatsApp)",
    snippet: "Got the quote, thanks!",
    receivedAt: nowIso(-12),
    unread: true,
  },
  {
    id: "wa_2",
    from: "+44 20 7946 0958",
    subject: "Maya (WA)",
    snippet: "Can we reschedule to Friday?",
    receivedAt: nowIso(-45),
  },
  {
    id: "wa_3",
    from: "+972 52-555-1122",
    subject: "Order #54821",
    snippet: "Payment received. Preparing shipment.",
    receivedAt: nowIso(-80),
  },
];

/**
 * Mock WhatsApp messages by conversation ID
 */
export const MOCK_MESSAGES: Record<string, ConversationMessage[]> = {
  wa_1: [
    { id: "m1", from: "them", text: "Hi, this is Sam.", at: toHumanTime(nowIso(-180)) },
    { id: "m2", from: "me", text: "Hey Sam! Sharing the quote now.", at: toHumanTime(nowIso(-170)) },
    { id: "m3", from: "them", text: "Got the quote, thanks!", at: toHumanTime(nowIso(-12)) },
  ],
  wa_2: [{ id: "m1", from: "them", text: "Can we reschedule to Friday?", at: toHumanTime(nowIso(-45)) }],
  wa_3: [{ id: "m1", from: "them", text: "Payment received. Preparing shipment.", at: toHumanTime(nowIso(-80)) }],
};

/**
 * Utility exports for mock data generation
 */
export const mockUtils = {
  nowIso,
  toHumanTime,
};