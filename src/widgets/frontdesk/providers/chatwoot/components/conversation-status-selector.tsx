/**
 * Conversation Status Selector
 *
 * Status selector for conversation header with icon-based dropdown menu.
 * Uses the unified list system for consistent UI.
 */

import React from "react";
import { StatusSelect } from "./unified-list";

interface ConversationStatusSelectorProps {
  status: string;
  onStatusChange: (status: string) => void;
  updating?: boolean;
}

export const ConversationStatusSelector: React.FC<ConversationStatusSelectorProps> = ({
  status,
  onStatusChange,
  updating = false,
}) => {
  return (
    <StatusSelect
      status={status}
      onStatusChange={onStatusChange}
      updating={updating}
    />
  );
};
