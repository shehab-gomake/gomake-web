/**
 * Channel Feature Service
 *
 * Determines reply box features based on channel type, following Chatwoot's patterns.
 * Based on REPLY_BOX_REFACTORING_GUIDE.md
 */

import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { ChannelType } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

/**
 * Message length limits per channel type
 */
const MESSAGE_MAX_LENGTH = {
  GENERAL: 10000,
  FACEBOOK: 2000,
  INSTAGRAM: 1000,
  TWILIO_SMS: 320,
  TWILIO_WHATSAPP: 1600,
  WHATSAPP_CLOUD: 4096,
  TELEGRAM: 4096,
  LINE: 2000,
  EMAIL: 25000,
};

/**
 * Channel Feature Configuration
 */
export interface ChannelFeatures {
  // Editor type
  shouldUseRichEditor: boolean;

  // Email-specific
  shouldShowEmailHeader: boolean;
  shouldShowQuotedReply: boolean;

  // WhatsApp-specific
  shouldShowWhatsAppTemplates: boolean;
  shouldShowContentTemplates: boolean;

  // File upload
  supportsFileUpload: boolean;
  supportsMultipleFileUpload: boolean;

  // Reply-to message
  supportsReplyTo: boolean;

  // Message limits
  maxMessageLength: number;

  // Audio format
  audioFormat: "mp3" | "wav";

  // Message sending behavior
  shouldSplitMessages: boolean;

  // Editor toggle (API inbox only)
  shouldShowEditorToggle: boolean;
}

/**
 * Channel Feature Service Class
 *
 * Determines which features to show based on inbox channel type
 */
export class ChannelFeatureService {
  private inbox: ChatwootInbox | null;
  private uiSettings: {
    display_rich_content_editor?: boolean;
    quotedEmailReply?: boolean;
  };

  constructor(
    inbox: ChatwootInbox | null,
    uiSettings: { display_rich_content_editor?: boolean; quotedEmailReply?: boolean } = {}
  ) {
    this.inbox = inbox;
    this.uiSettings = uiSettings;
  }

  /**
   * Channel Type Detection
   */
  getChannelType(): string | null {
    return this.inbox?.channel_type || null;
  }

  isEmailChannel(): boolean {
    return this.inbox?.channel_type === ChannelType.EMAIL;
  }

  isWhatsAppChannel(): boolean {
    const channelType = this.inbox?.channel_type;
    // Handle both "Channel::Whatsapp" and "Channel::WhatsApp" formats
    return (
      channelType === ChannelType.WHATSAPP ||
      channelType === "Channel::Whatsapp" ||
      (channelType === ChannelType.TWILIO_SMS && this.inbox?.medium === "whatsapp")
    );
  }

  isWebWidgetChannel(): boolean {
    return this.inbox?.channel_type === ChannelType.WEB_WIDGET;
  }

  isAPIChannel(): boolean {
    return this.inbox?.channel_type === ChannelType.API;
  }

  isFacebookChannel(): boolean {
    return this.inbox?.channel_type === ChannelType.FACEBOOK_PAGE;
  }

  isInstagramChannel(): boolean {
    return this.inbox?.channel_type === "Channel::Instagram";
  }

  isTelegramChannel(): boolean {
    return this.inbox?.channel_type === ChannelType.TELEGRAM;
  }

  isTwilioWhatsAppChannel(): boolean {
    // Access medium from the inbox (it may be in additional attributes)
    const medium = (this.inbox as any)?.medium as string | undefined;
    return this.inbox?.channel_type === ChannelType.TWILIO_SMS && medium === "whatsapp";
  }

  /**
   * Get WhatsApp provider sub-type
   */
  getWhatsAppProvider(): string | null {
    if (!this.isWhatsAppChannel()) return null;
    return this.inbox?.provider || "default";
  }

  isWhatsAppCloudChannel(): boolean {
    const channelType = this.inbox?.channel_type;
    const provider = this.inbox?.provider as string | undefined;
    return (channelType === ChannelType.WHATSAPP || channelType === "Channel::Whatsapp") && provider === "whatsapp_cloud";
  }

  is360DialogWhatsAppChannel(): boolean {
    const channelType = this.inbox?.channel_type;
    const provider = this.inbox?.provider as string | undefined;
    return (channelType === ChannelType.WHATSAPP || channelType === "Channel::Whatsapp") && (provider === "default" || !provider);
  }

  /**
   * Editor Configuration
   */
  shouldUseRichEditor(isPrivateNote: boolean = false): boolean {
    // Private notes always use rich editor
    if (isPrivateNote) return true;

    // Email and Web Widget always use rich editor
    if (this.isEmailChannel() || this.isWebWidgetChannel()) {
      return true;
    }

    // API inbox is configurable
    if (this.isAPIChannel()) {
      return this.uiSettings.display_rich_content_editor === true;
    }

    return false;
  }

  /**
   * Feature Flags
   */
  shouldShowEmailHeader(isPrivateNote: boolean = false): boolean {
    return !isPrivateNote && this.isEmailChannel();
  }

  shouldShowQuotedEmailReply(isPrivateNote: boolean = false): boolean {
    return this.isEmailChannel() && !isPrivateNote && this.uiSettings.quotedEmailReply === true;
  }

  shouldShowWhatsAppTemplates(isPrivateNote: boolean = false): boolean {
    const channelType = this.inbox?.channel_type;
    const provider = this.inbox?.provider as string | undefined;
    return (
      !isPrivateNote &&
      (channelType === ChannelType.WHATSAPP || channelType === "Channel::Whatsapp") &&
      provider === "whatsapp_cloud"
    );
  }

  shouldShowContentTemplates(isPrivateNote: boolean = false): boolean {
    const medium = (this.inbox as any)?.medium as string | undefined;
    return !isPrivateNote && this.inbox?.channel_type === ChannelType.TWILIO_SMS && medium === "whatsapp";
  }

  shouldShowEditorToggle(isPrivateNote: boolean = false): boolean {
    return this.isAPIChannel() && !isPrivateNote;
  }

  /**
   * File Upload Support
   */
  supportsFileUpload(): boolean {
    const channelType = this.inbox?.channel_type;

    const supportedTypes = [
      ChannelType.WEB_WIDGET,
      ChannelType.FACEBOOK_PAGE,
      ChannelType.WHATSAPP,
      "Channel::Whatsapp", // Handle both formats
      ChannelType.EMAIL,
      ChannelType.API,
      ChannelType.SMS,
      ChannelType.TELEGRAM,
      ChannelType.LINE,
      "Channel::Instagram", // Handle Instagram format
    ];

    return supportedTypes.includes(channelType as ChannelType) || this.isTwilioWhatsAppChannel();
  }

  supportsMultipleFileUpload(): boolean {
    return (
      this.isEmailChannel() ||
      this.isWebWidgetChannel() ||
      this.isAPIChannel() ||
      this.isWhatsAppChannel() ||
      this.isTelegramChannel()
    );
  }

  /**
   * Reply-To Message Support
   */
  supportsReplyTo(): boolean {
    const channelType = this.inbox?.channel_type;

    const supportedTypes = [
      ChannelType.FACEBOOK_PAGE,
      ChannelType.WEB_WIDGET,
      ChannelType.TWITTER,
      ChannelType.WHATSAPP,
      "Channel::Whatsapp", // Handle both formats
      ChannelType.TELEGRAM,
      ChannelType.API,
    ];

    // Exclude 360Dialog WhatsApp (default provider)
    const provider = this.inbox?.provider as string | undefined;
    if ((channelType === ChannelType.WHATSAPP || channelType === "Channel::Whatsapp") && (provider === "default" || !provider)) {
      return false;
    }

    return supportedTypes.includes(channelType as any);
  }

  /**
   * Message Length Limits
   */
  getMaxMessageLength(isPrivate: boolean = false): number {
    if (isPrivate) return MESSAGE_MAX_LENGTH.GENERAL;

    const channelType = this.inbox?.channel_type;

    switch (channelType) {
      case ChannelType.FACEBOOK_PAGE:
      case "Channel::FacebookPage":
        return MESSAGE_MAX_LENGTH.FACEBOOK;
      case "Channel::Instagram":
        return MESSAGE_MAX_LENGTH.INSTAGRAM;
      case ChannelType.TWILIO_SMS:
        const medium = (this.inbox as any)?.medium as string | undefined;
        if (medium === "whatsapp") {
          return MESSAGE_MAX_LENGTH.TWILIO_WHATSAPP;
        }
        return MESSAGE_MAX_LENGTH.TWILIO_SMS;
      case ChannelType.WHATSAPP:
      case "Channel::Whatsapp":
        return MESSAGE_MAX_LENGTH.WHATSAPP_CLOUD;
      case ChannelType.EMAIL:
        return MESSAGE_MAX_LENGTH.EMAIL;
      case ChannelType.TELEGRAM:
        return MESSAGE_MAX_LENGTH.TELEGRAM;
      case ChannelType.LINE:
        return MESSAGE_MAX_LENGTH.LINE;
      case "Channel::Instagram":
        return MESSAGE_MAX_LENGTH.INSTAGRAM;
      default:
        return MESSAGE_MAX_LENGTH.GENERAL;
    }
  }

  /**
   * Audio Configuration
   */
  getAudioFormat(): "mp3" | "wav" {
    if (this.isWhatsAppChannel() || this.isTelegramChannel()) {
      return "mp3";
    }
    if (this.isAPIChannel()) {
      return "mp3";
    }
    return "wav";
  }

  /**
   * Message Sending Behavior
   */
  shouldSplitMessagesForWhatsApp(): boolean {
    return this.isWhatsAppChannel() || this.isInstagramChannel();
  }

  /**
   * Get all features for a given state
   */
  getFeatures(isPrivateNote: boolean = false): ChannelFeatures {
    return {
      shouldUseRichEditor: this.shouldUseRichEditor(isPrivateNote),
      shouldShowEmailHeader: this.shouldShowEmailHeader(isPrivateNote),
      shouldShowQuotedReply: this.shouldShowQuotedEmailReply(isPrivateNote),
      shouldShowWhatsAppTemplates: this.shouldShowWhatsAppTemplates(isPrivateNote),
      shouldShowContentTemplates: this.shouldShowContentTemplates(isPrivateNote),
      supportsFileUpload: this.supportsFileUpload(),
      supportsMultipleFileUpload: this.supportsMultipleFileUpload(),
      supportsReplyTo: this.supportsReplyTo(),
      maxMessageLength: this.getMaxMessageLength(isPrivateNote),
      audioFormat: this.getAudioFormat(),
      shouldSplitMessages: this.shouldSplitMessagesForWhatsApp(),
      shouldShowEditorToggle: this.shouldShowEditorToggle(isPrivateNote),
    };
  }
}

/**
 * Helper function to create a channel feature service
 */
export function createChannelFeatureService(
  inbox: ChatwootInbox | null,
  uiSettings?: { display_rich_content_editor?: boolean; quotedEmailReply?: boolean }
): ChannelFeatureService {
  return new ChannelFeatureService(inbox, uiSettings);
}
