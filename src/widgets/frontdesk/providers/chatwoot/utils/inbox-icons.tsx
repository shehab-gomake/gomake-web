/**
 * Inbox Icons Utility
 *
 * Maps Chatwoot channel types and mediums to Material-UI icons.
 * Provides a consistent icon representation for different communication channels.
 *
 * @see CONVERSATION_LIST_ICONS_GUIDE.md
 */

import React from 'react';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';
import CloudIcon from '@mui/icons-material/Cloud';
import SmsIcon from '@mui/icons-material/Sms';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { ChannelType } from '@/services/frontdesk/api/chatwoot/types/inboxes.types';

// ============================================================================
// Type Definitions
// ============================================================================

export type InboxIconVariant = 'fill' | 'outline';
export type IconComponent = React.ComponentType<SvgIconProps>;

export interface InboxIconProps {
  channelType: string | null | undefined;
  medium?: string | null;
  size?: number;
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_ICON_SIZE = 12; // size-3 equivalent (12px)

/**
 * Channel type to icon mapping
 * Maps Chatwoot channel types to their corresponding Material-UI icons
 */
const CHANNEL_ICON_MAP: Record<string, IconComponent> = {
  [ChannelType.EMAIL]: EmailIcon,
  [ChannelType.WHATSAPP]: WhatsAppIcon,
  [ChannelType.WEB_WIDGET]: ChatIcon,
  [ChannelType.FACEBOOK_PAGE]: ChatIcon,
  [ChannelType.TWITTER]: ChatIcon,
  [ChannelType.TELEGRAM]: ChatIcon,
  [ChannelType.LINE]: ChatIcon,
  [ChannelType.VOICE]: PhoneIcon,
  [ChannelType.API]: CloudIcon,
  [ChannelType.SMS]: SmsIcon,
  // Legacy/alternative channel type names
  'Channel::Whatsapp': WhatsAppIcon,
  'Channel::TwitterProfile': ChatIcon,
  'Channel::Instagram': ChatIcon,
  'Channel::Voice': PhoneIcon,
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Determines the appropriate icon for Twilio SMS channels based on medium
 */
function getTwilioSmsIcon(medium?: string | null): IconComponent {
  return medium === 'whatsapp' ? WhatsAppIcon : SmsIcon;
}

/**
 * Gets the icon component for a given channel type, with fallback to default
 */
function getChannelIcon(channelType: string): IconComponent {
  return CHANNEL_ICON_MAP[channelType] || ChatIcon;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Gets the Material-UI icon component for a given channel type and medium
 *
 * @param channelType - The channel type (e.g., "Channel::Email")
 * @param medium - Optional medium (e.g., "whatsapp" for TwilioSMS)
 * @param _variant - Icon variant (maintained for API compatibility, not used with MUI)
 * @returns React component for the icon
 *
 * @example
 * ```tsx
 * const EmailIconComponent = getInboxIconByType('Channel::Email');
 * const WhatsAppIconComponent = getInboxIconByType('Channel::TwilioSms', 'whatsapp');
 * const DefaultIconComponent = getInboxIconByType(null); // Returns ChatIcon
 * ```
 */
export function getInboxIconByType(
  channelType: string | null | undefined,
  medium?: string | null,
  _variant: InboxIconVariant = 'fill' // Kept for API compatibility
): IconComponent {
  if (!channelType) {
    return ChatIcon;
  }

  // Special handling for Twilio SMS - check medium first
  if (channelType === ChannelType.TWILIO_SMS) {
    return getTwilioSmsIcon(medium);
  }

  return getChannelIcon(channelType);
}

// ============================================================================
// Component
// ============================================================================

/**
 * InboxIcon Component
 *
 * Renders a channel-specific icon with configurable size.
 * Automatically selects the appropriate icon based on channel type and medium.
 *
 * @example
 * ```tsx
 * <InboxIcon channelType="Channel::Email" size={16} />
 * <InboxIcon channelType="Channel::TwilioSms" medium="whatsapp" size={12} />
 * ```
 */
export const InboxIcon: React.FC<InboxIconProps> = ({
  channelType,
  medium,
  size = DEFAULT_ICON_SIZE,
  className,
}) => {
  const IconComponent = getInboxIconByType(channelType, medium);

  return (
    <IconComponent
      sx={{
        fontSize: size,
        color: 'inherit',
      }}
      className={className}
    />
  );
};
