/**
 * InboxSelector Component
 *
 * Dropdown for selecting an inbox (channel) where the contact can be reached.
 * Shows available inboxes based on contact's communication channels.
 */

import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import MessageIcon from "@mui/icons-material/Message";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import type { ContactableInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

export interface InboxSelectorProps {
  /** Available inboxes for the selected contact */
  contactableInboxes: ContactableInbox[];

  /** Currently selected inbox */
  selectedInbox: ContactableInbox | null;

  /** Loading state */
  isLoading: boolean;

  /** Disabled state (e.g., no contact selected) */
  disabled?: boolean;

  /** Callback when inbox is selected */
  onSelect: (inbox: ContactableInbox) => void;

  /** Validation error message */
  error?: string;
}

/**
 * Get icon for channel type
 */
function getChannelIcon(channelType: string) {
  switch (channelType) {
    case "Channel::Email":
      return <MailIcon className="w-4 h-4" />;
    case "Channel::WhatsApp":
      return <MessageIcon className="w-4 h-4" />;
    case "Channel::Sms":
    case "Channel::TwilioSms":
      return <PhoneIcon className="w-4 h-4" />;
    case "Channel::WebWidget":
      return <PublicIcon className="w-4 h-4" />;
    default:
      return <MessageIcon className="w-4 h-4" />;
  }
}

/**
 * Get display name for channel type
 */
function getChannelTypeName(channelType: string): string {
  switch (channelType) {
    case "Channel::Email":
      return "Email";
    case "Channel::WhatsApp":
      return "WhatsApp";
    case "Channel::Sms":
      return "SMS";
    case "Channel::TwilioSms":
      return "Twilio SMS";
    case "Channel::WebWidget":
      return "Web Widget";
    case "Channel::Api":
      return "API";
    default:
      return "Channel";
  }
}

export const InboxSelector: React.FC<InboxSelectorProps> = ({
  contactableInboxes,
  selectedInbox,
  isLoading,
  disabled,
  onSelect,
  error,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Inbox (Channel) <span className="text-red-500">*</span>
      </label>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            Loading available inboxes...
          </span>
        </div>
      ) : disabled || contactableInboxes.length === 0 ? (
        /* Disabled/Empty State */
        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
          {disabled
            ? "Select a contact first to see available inboxes"
            : "No inboxes available for this contact"}
        </div>
      ) : (
        /* Inbox Selection */
        <div className="space-y-2">
          {contactableInboxes.map((contactableInbox) => {
            const isSelected = selectedInbox?.source_id === contactableInbox.source_id;
            const channelType = contactableInbox.inbox.channel_type;

            return (
              <button
                key={`${contactableInbox.inbox.id}-${contactableInbox.source_id}`}
                type="button"
                onClick={() => onSelect(contactableInbox)}
                className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Channel Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {getChannelIcon(channelType)}
                  </div>

                  {/* Inbox Info */}
                  <div className="text-left">
                    <div
                      className={`font-medium ${
                        isSelected
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {contactableInbox.inbox.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <span>{getChannelTypeName(channelType)}</span>
                      <span>•</span>
                      <span className="font-mono text-xs">{contactableInbox.source_id}</span>
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
