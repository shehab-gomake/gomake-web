/**
 * useChannelFeatures Hook
 *
 * React hook for accessing channel-specific features in Chatwoot conversations.
 * Provides memoized feature flags based on inbox type and conversation state.
 *
 * @example
 * ```tsx
 * const features = useChannelFeatures(inbox, isPrivateNote, uiSettings);
 *
 * return (
 *   <div>
 *     {features.shouldShowEmailHeader && <EmailHeader />}
 *     {features.shouldUseRichEditor ? <RichEditor /> : <PlainTextArea />}
 *   </div>
 * );
 * ```
 */

import { useMemo } from "react";
import { ChannelFeatureService, type ChannelFeatures } from "../utils/channel-features.service";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

/**
 * UI Settings for channel features
 */
export interface ChannelUISettings {
  /** Whether to display rich content editor for API channels */
  display_rich_content_editor?: boolean;
  /** Whether to enable quoted email reply for Email channels */
  quotedEmailReply?: boolean;
}

/**
 * Hook return type with all channel features
 */
export interface UseChannelFeaturesReturn extends ChannelFeatures {
  // Channel type checks
  isEmail: boolean;
  isWhatsApp: boolean;
  isWebWidget: boolean;
  isAPI: boolean;
  isFacebook: boolean;
  isTelegram: boolean;
  isInstagram: boolean;

  // WhatsApp sub-types
  isWhatsAppCloud: boolean;
  is360DialogWhatsApp: boolean;
  isTwilioWhatsApp: boolean;

  // Editor configuration
  editorType: "rich" | "plain";

  // Service instance (for advanced use cases)
  service: ChannelFeatureService;
}

/**
 * React hook for channel features
 *
 * Memoizes the ChannelFeatureService and all computed values to prevent
 * unnecessary recalculations on re-renders.
 *
 * @param inbox - The Chatwoot inbox object
 * @param isPrivateNote - Whether the current message is a private note
 * @param uiSettings - Optional UI settings for configurable features
 * @returns Object containing all channel features and helper flags
 *
 * @example
 * ```tsx
 * function ReplyBox({ inbox, conversation, isPrivateNote }) {
 *   const features = useChannelFeatures(inbox, isPrivateNote);
 *
 *   return (
 *     <div>
 *       {features.shouldShowEmailHeader && (
 *         <EmailHeaderFields
 *           to={conversation.meta?.sender?.email}
 *         />
 *       )}
 *
 *       {features.shouldUseRichEditor ? (
 *         <RichTextEditor maxLength={features.maxMessageLength} />
 *       ) : (
 *         <PlainTextArea maxLength={features.maxMessageLength} />
 *       )}
 *
 *       {features.supportsFileUpload && (
 *         <FileUploadButton
 *           multiple={features.supportsMultipleFileUpload}
 *         />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useChannelFeatures(
  inbox: ChatwootInbox | null,
  isPrivateNote: boolean = false,
  uiSettings: ChannelUISettings = {}
): UseChannelFeaturesReturn {
  // Memoize the service instance
  // Only recreate when inbox or uiSettings change
  const service = useMemo(
    () => new ChannelFeatureService(inbox, uiSettings),
    [inbox, uiSettings.display_rich_content_editor, uiSettings.quotedEmailReply]
  );

  // Memoize all feature flags
  // Only recalculate when service or isPrivateNote changes
  const features = useMemo(() => {
    const baseFeatures = service.getFeatures(isPrivateNote);

    return {
      // Base features
      ...baseFeatures,

      // Channel type checks
      isEmail: service.isEmailChannel(),
      isWhatsApp: service.isWhatsAppChannel(),
      isWebWidget: service.isWebWidgetChannel(),
      isAPI: service.isAPIChannel(),
      isFacebook: service.isFacebookChannel(),
      isTelegram: service.isTelegramChannel(),
      isInstagram: service.isInstagramChannel(),

      // WhatsApp sub-types
      isWhatsAppCloud: service.isWhatsAppCloudChannel(),
      is360DialogWhatsApp: service.is360DialogWhatsAppChannel(),
      isTwilioWhatsApp: service.isTwilioWhatsAppChannel(),

      // Editor type (convenience property)
      editorType: baseFeatures.shouldUseRichEditor ? ("rich" as const) : ("plain" as const),

      // Service instance for advanced use cases
      service,
    };
  }, [service, isPrivateNote]);

  return features;
}

/**
 * Hook variant that returns only the service instance
 *
 * Useful when you need direct access to service methods without
 * automatically computing all features.
 *
 * @param inbox - The Chatwoot inbox object
 * @param uiSettings - Optional UI settings
 * @returns ChannelFeatureService instance
 *
 * @example
 * ```tsx
 * function MessageComposer({ inbox }) {
 *   const service = useChannelFeatureService(inbox);
 *
 *   const handleSend = (message: string) => {
 *     const maxLength = service.getMaxMessageLength(false);
 *     if (message.length > maxLength) {
 *       alert(`Message too long! Max: ${maxLength}`);
 *       return;
 *     }
 *     // Send message...
 *   };
 * }
 * ```
 */
export function useChannelFeatureService(
  inbox: ChatwootInbox | null,
  uiSettings: ChannelUISettings = {}
): ChannelFeatureService {
  return useMemo(
    () => new ChannelFeatureService(inbox, uiSettings),
    [inbox, uiSettings.display_rich_content_editor, uiSettings.quotedEmailReply]
  );
}

/**
 * Hook for checking if specific features are enabled
 *
 * Lighter-weight alternative when you only need a few specific checks.
 *
 * @param inbox - The Chatwoot inbox object
 * @param isPrivateNote - Whether the current message is a private note
 * @returns Object with common feature checks
 *
 * @example
 * ```tsx
 * function FileUploadButton({ inbox }) {
 *   const { canUpload, canUploadMultiple } = useChannelFeatureChecks(inbox);
 *
 *   if (!canUpload) return null;
 *
 *   return (
 *     <button>
 *       Upload File{canUploadMultiple && 's'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useChannelFeatureChecks(
  inbox: ChatwootInbox | null,
  isPrivateNote: boolean = false
) {
  const service = useChannelFeatureService(inbox);

  return useMemo(
    () => ({
      canUpload: service.supportsFileUpload(),
      canUploadMultiple: service.supportsMultipleFileUpload(),
      canReplyTo: service.supportsReplyTo(),
      useRichEditor: service.shouldUseRichEditor(isPrivateNote),
      maxLength: service.getMaxMessageLength(isPrivateNote),
    }),
    [service, isPrivateNote]
  );
}
