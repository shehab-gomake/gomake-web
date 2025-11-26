/**
 * Conversation Priority Selector
 *
 * Minimal icon-button priority selector for conversation header.
 * Uses the unified list system for consistent UI.
 */

import React from "react";
import { PrioritySelect } from "./unified-list";
import { ConversationPriority } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

type PriorityValue = ConversationPriority.URGENT | ConversationPriority.HIGH | ConversationPriority.MEDIUM | ConversationPriority.LOW | null;

interface ConversationPrioritySelectorProps {
  priority: PriorityValue;
  onPriorityChange: (priority: PriorityValue) => void;
  updating?: boolean;
}

export const ConversationPrioritySelector: React.FC<ConversationPrioritySelectorProps> = ({
  priority,
  onPriorityChange,
  updating = false,
}) => {
  return (
    <PrioritySelect
      priority={priority}
      onPriorityChange={onPriorityChange}
      updating={updating}
    />
  );
};
