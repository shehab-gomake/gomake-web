/**
 * Channel Features Configuration
 *
 * Configuration-based approach for channel features.
 * Provides a declarative way to define features per channel type.
 *
 * Based on REPLY_BOX_REFACTORING_GUIDE.md
 */

import { ChannelType } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

/**
 * Message length limits by channel
 */
export const MESSAGE_LIMITS = {
  GENERAL: 10000,
  FACEBOOK: 2000,
  INSTAGRAM: 1000,
  TWILIO_SMS: 320,
  TWILIO_WHATSAPP: 1600,
  WHATSAPP_CLOUD: 4096,
  TELEGRAM: 4096,
  LINE: 2000,
  EMAIL: 25000,
} as const;

/**
 * Channel feature configuration interface
 */
export interface ChannelConfig {
  /** Editor type: rich or plain */
  editor: "rich" | "plain";
  /** Maximum message length */
  maxLength: number;
  /** Show email header (TO/CC/BCC) */
  supportsEmailHeader: boolean;
  /** Show quoted reply option */
  supportsQuotedReply: boolean;
  /** File upload support */
  supportsFileUpload: boolean;
  /** Multiple file upload support */
  supportsMultipleUpload: boolean;
  /** Reply-to message support */
  supportsReplyTo: boolean;
  /** Audio recording format */
  audioFormat: "mp3" | "wav";
  /** Split long messages into multiple */
  splitMessages: boolean;
  /** Template configuration */
  templates?: {
    type: "whatsapp_cloud" | "content" | "none";
    enabled: boolean | ((inbox: ChatwootInbox) => boolean);
  };
  /** Special conditions */
  conditions?: {
    /** Exclude certain providers */
    excludeProviders?: string[];
    /** Additional checks */
    customCheck?: (inbox: ChatwootInbox) => Partial<ChannelConfig>;
  };
}

/**
 * Channel features configuration map
 */
export const CHANNEL_FEATURES_CONFIG: Record<string, ChannelConfig> = {
  /**
   * Email Channel
   * - Rich editor always
   * - Email header (TO/CC/BCC)
   * - Quoted reply support
   * - Large message limit (25KB)
   */
  [ChannelType.EMAIL]: {
    editor: "rich",
    maxLength: MESSAGE_LIMITS.EMAIL,
    supportsEmailHeader: true,
    supportsQuotedReply: true,
    supportsFileUpload: true,
    supportsMultipleUpload: true,
    supportsReplyTo: false,
    audioFormat: "wav",
    splitMessages: false,
  },

  /**
   * WhatsApp Channel (Cloud API)
   * - Plain editor
   * - WhatsApp templates (cloud only)
   * - MP3 audio format
   * - Message splitting for long messages
   */
  [ChannelType.WHATSAPP]: {
    editor: "plain",
    maxLength: MESSAGE_LIMITS.WHATSAPP_CLOUD,
    supportsEmailHeader: false,
    supportsQuotedReply: false,
    supportsFileUpload: true,
    supportsMultipleUpload: true,
    supportsReplyTo: true,
    audioFormat: "mp3",
    splitMessages: true,
    templates: {
      type: "whatsapp_cloud",
      enabled: (inbox) => (inbox.provider as string) === "whatsapp_cloud",
    },
    conditions: {
      // 360Dialog (default provider) doesn't support reply-to
      excludeProviders: ["default"],
      customCheck: (inbox) => {
        if ((inbox.provider as string) === "default" || !inbox.provider) {
          return {
            supportsReplyTo: false,
            templates: {
              type: "none",
              enabled: false,
            },
          };
        }
        return {};
      },
    },
  },

  /**
   * Twilio SMS Channel
   * - Can be SMS or WhatsApp (check medium)
   * - Content templates for Twilio WhatsApp
   */
  [ChannelType.TWILIO_SMS]: {
    editor: "plain",
    maxLength: MESSAGE_LIMITS.TWILIO_SMS,
    supportsEmailHeader: false,
    supportsQuotedReply: false,
    supportsFileUpload: true,
    supportsMultipleUpload: false,
    supportsReplyTo: false,
    audioFormat: "wav",
    splitMessages: false,
    conditions: {
      // If medium is WhatsApp, use WhatsApp-like features
      customCheck: (inbox) => {
        if ((inbox as any).medium === "whatsapp") {
          return {
            maxLength: MESSAGE_LIMITS.TWILIO_WHATSAPP,
            supportsMultipleUpload: true,
            supportsReplyTo: true,
            audioFormat: "mp3",
            splitMessages: true,
            templates: {
              type: "content",
              enabled: true,
            },
          };
        }
        return {};
      },
    },
  },

  /**
   * Web Widget Channel
   * - Rich editor always
   * - Full feature set
   */
  [ChannelType.WEB_WIDGET]: {
    editor: "rich",
    maxLength: MESSAGE_LIMITS.GENERAL,
    supportsEmailHeader: false,
    supportsQuotedReply: false,
    supportsFileUpload: true,
    supportsMultipleUpload: true,
    supportsReplyTo: true,
    audioFormat: "wav",
    splitMessages: false,
  },

  /**
   * API Channel
   * - Configurable editor (user setting)
   * - Full feature set
   */
  [ChannelType.API]: {
    editor: "plain", // Can be overridden by user setting
    maxLength: MESSAGE_LIMITS.GENERAL,
    supportsEmailHeader: false,
    supportsQuotedReply: false,
    supportsFileUpload: true,
    supportsMultipleUpload: true,
    supportsReplyTo: true,
    audioFormat: "mp3",
    splitMessages: false,
  },

  /**
   * Facebook Page
   * - Plain editor
   * - Limited message length (2KB)
   */
  [ChannelType.FACEBOOK_PAGE]: {
    editor: "plain",
    maxLength: MESSAGE_LIMITS.FACEBOOK,
    supportsEmailHeader: false,
    supportsQuotedReply: false,
    supportsFileUpload: true,
    supportsMultipleUpload: false,
    supportsReplyTo: true,
    audioFormat: "wav",
    splitMessages: false,
  },

  /**
   * Instagram
   * - Plain editor
   * - Very limited message length (1KB)
   * - Message splitting
   */
  "Channel::Instagram": {
    editor: "plain",
    maxLength: MESSAGE_LIMITS.INSTAGRAM,
    supportsEmailHeader: false,
    supportsQuotedReply: false,
    supportsFileUpload: true,
    supportsMultipleUpload: false,
    supportsReplyTo: false,
    audioFormat: "wav",
    splitMessages: true,
  },

  /**
   * Telegram
   * - Plain editor
   * - MP3 audio format
   * - Good feature support
   */
  [ChannelType.TELEGRAM]: {
    editor: "plain",
    maxLength: MESSAGE_LIMITS.TELEGRAM,
    supportsEmailHeader: false,
    supportsQuotedReply: false,
    supportsFileUpload: true,
    supportsMultipleUpload: true,
    supportsReplyTo: true,
    audioFormat: "mp3",
    splitMessages: false,
  },

  /**
   * LINE
   * - Plain editor
   * - Limited message length (2KB)
   */
  [ChannelType.LINE]: {
    editor: "plain",
    maxLength: MESSAGE_LIMITS.LINE,
    supportsEmailHeader: false,
    supportsQuotedReply: false,
    supportsFileUpload: true,
    supportsMultipleUpload: false,
    supportsReplyTo: false,
    audioFormat: "wav",
    splitMessages: false,
  },

  /**
   * Twitter
   * - Plain editor
   * - Standard limits
   */
  [ChannelType.TWITTER]: {
    editor: "plain",
    maxLength: MESSAGE_LIMITS.GENERAL,
    supportsEmailHeader: false,
    supportsQuotedReply: false,
    supportsFileUpload: false,
    supportsMultipleUpload: false,
    supportsReplyTo: true,
    audioFormat: "wav",
    splitMessages: false,
  },

  /**
   * SMS Channel
   * - Plain editor
   * - Very limited length (320 chars)
   */
  [ChannelType.SMS]: {
    editor: "plain",
    maxLength: MESSAGE_LIMITS.TWILIO_SMS,
    supportsEmailHeader: false,
    supportsQuotedReply: false,
    supportsFileUpload: true,
    supportsMultipleUpload: false,
    supportsReplyTo: false,
    audioFormat: "wav",
    splitMessages: false,
  },
};

/**
 * Get channel configuration with custom conditions applied
 *
 * @param channelType - The channel type string
 * @param inbox - The inbox object for conditional checks
 * @returns Merged channel configuration
 *
 * @example
 * ```typescript
 * const config = getChannelConfig('Channel::Whatsapp', inbox);
 * console.log(config.maxLength); // 4096
 * console.log(config.templates?.enabled); // true if whatsapp_cloud
 * ```
 */
export function getChannelConfig(channelType: string, inbox: ChatwootInbox): ChannelConfig {
  // Get base configuration
  const baseConfig = CHANNEL_FEATURES_CONFIG[channelType] || CHANNEL_FEATURES_CONFIG[ChannelType.API];

  // Apply custom conditions if they exist
  if (baseConfig.conditions?.customCheck) {
    const customOverrides = baseConfig.conditions.customCheck(inbox);
    return {
      ...baseConfig,
      ...customOverrides,
    };
  }

  return baseConfig;
}

/**
 * Check if a feature is enabled for a channel
 *
 * @param channelType - The channel type string
 * @param inbox - The inbox object
 * @param featureName - The feature to check
 * @returns Whether the feature is enabled
 *
 * @example
 * ```typescript
 * if (isFeatureEnabled('Channel::Email', inbox, 'supportsEmailHeader')) {
 *   // Show email header
 * }
 * ```
 */
export function isFeatureEnabled(
  channelType: string,
  inbox: ChatwootInbox,
  featureName: keyof ChannelConfig
): boolean {
  const config = getChannelConfig(channelType, inbox);
  const value = config[featureName];

  // Handle boolean values
  if (typeof value === "boolean") {
    return value;
  }

  // Handle function values (like templates.enabled)
  if (featureName === "templates" && config.templates) {
    const enabled = config.templates.enabled;
    if (typeof enabled === "function") {
      return enabled(inbox);
    }
    return Boolean(enabled);
  }

  return false;
}

/**
 * Get feature matrix as a human-readable object
 *
 * Useful for debugging or documentation
 *
 * @returns Feature matrix for all channels
 */
export function getFeatureMatrix(): Record<string, Record<string, any>> {
  const matrix: Record<string, Record<string, any>> = {};

  Object.entries(CHANNEL_FEATURES_CONFIG).forEach(([channelType, config]) => {
    matrix[channelType] = {
      editor: config.editor,
      maxLength: config.maxLength,
      emailHeader: config.supportsEmailHeader ? "✅" : "❌",
      quotedReply: config.supportsQuotedReply ? "✅" : "❌",
      fileUpload: config.supportsFileUpload ? "✅" : "❌",
      multipleUpload: config.supportsMultipleUpload ? "✅" : "❌",
      replyTo: config.supportsReplyTo ? "✅" : "❌",
      audioFormat: config.audioFormat,
      splitMessages: config.splitMessages ? "✅" : "❌",
      templates: config.templates?.type || "none",
    };
  });

  return matrix;
}
