import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Switch,
  Button,
  Divider,
} from '@mui/material';
import { colorTokens, radiusTokens } from '../../tokens';
import SendIcon from '@mui/icons-material/Send';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CodeIcon from '@mui/icons-material/Code';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

export type MessageChannel = 'whatsapp' | 'email' | 'sms' | 'phone' | 'internal';

export interface MessageComposerProps {
  /** Placeholder text */
  placeholder?: string;

  /** Available channels */
  availableChannels?: MessageChannel[];

  /** Default channel */
  defaultChannel?: MessageChannel;

  /** Available sender identities */
  availableFrom?: Array<{
    id: string;
    name: string;
    identifier: string; // email, phone, etc.
  }>;

  /** Default sender */
  defaultFrom?: string;

  /** Show AI instant reply toggle */
  showAIToggle?: boolean;

  /** AI instant reply enabled by default */
  aiEnabled?: boolean;

  /** Callback when message is sent */
  onSend?: (data: {
    message: string;
    channel: MessageChannel;
    fromId: string;
    aiEnabled: boolean;
  }) => void;

  /** Callback when AI toggle changes */
  onAIToggle?: (enabled: boolean) => void;

  /** Callback for file attachment */
  onAttachFile?: () => void;

  /** Callback for image attachment */
  onAttachImage?: () => void;
}

const channelIcons: Record<MessageChannel, string> = {
  whatsapp: '💬',
  email: '📧',
  sms: '📱',
  phone: '📞',
  internal: '💬',
};

const channelLabels: Record<MessageChannel, string> = {
  whatsapp: 'Whatsapp',
  email: 'Email',
  sms: 'SMS',
  phone: 'Phone',
  internal: 'Internal',
};

/**
 * MessageComposer Component
 *
 * Rich text message composer with channel selection, sender identity,
 * AI instant reply toggle, and formatting toolbar.
 */
export const MessageComposer: React.FC<MessageComposerProps> = ({
  placeholder = 'Hi, please check this article for more information',
  availableChannels = ['whatsapp', 'email', 'sms'],
  defaultChannel = 'whatsapp',
  availableFrom = [],
  defaultFrom,
  showAIToggle = true,
  aiEnabled = false,
  onSend,
  onAIToggle,
  onAttachFile,
  onAttachImage,
}) => {
  const [message, setMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<MessageChannel>(defaultChannel);
  const [selectedFrom, setSelectedFrom] = useState(defaultFrom || availableFrom[0]?.id || '');
  const [aiToggleEnabled, setAIToggleEnabled] = useState(aiEnabled);

  const handleSend = () => {
    if (message.trim()) {
      onSend?.({
        message,
        channel: selectedChannel,
        fromId: selectedFrom,
        aiEnabled: aiToggleEnabled,
      });
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
  };

  const handleAIToggle = (checked: boolean) => {
    setAIToggleEnabled(checked);
    onAIToggle?.(checked);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderTop: `1px solid ${colorTokens.semantic.border.default}`,
        p: 2.5,
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Channel and From Selectors */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
          pb: 2,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
        }}
      >
        {/* Channel Selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: colorTokens.neutral[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            {channelIcons[selectedChannel]}
          </Box>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value as MessageChannel)}
              sx={{
                fontSize: 14,
                '& .MuiSelect-select': {
                  py: 0.75,
                },
              }}
            >
              {availableChannels.map((channel) => (
                <MenuItem key={channel} value={channel}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{channelIcons[channel]}</span>
                    <span>{channelLabels[channel]}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* From Selector */}
        {availableFrom.length > 0 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 13 }}>
                From
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={selectedFrom}
                  onChange={(e) => setSelectedFrom(e.target.value)}
                  sx={{
                    fontSize: 14,
                    '& .MuiSelect-select': {
                      py: 0.75,
                    },
                  }}
                >
                  {availableFrom.map((from) => (
                    <MenuItem key={from.id} value={from.id}>
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>
                          {from.name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                          {from.identifier}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          </>
        )}

        {/* AI Toggle */}
        {showAIToggle && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z"
                  fill={aiToggleEnabled ? colorTokens.primary[600] : colorTokens.neutral[400]}
                />
              </svg>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 13,
                  color: aiToggleEnabled ? colorTokens.primary[700] : colorTokens.semantic.text.secondary,
                  fontWeight: aiToggleEnabled ? 600 : 400,
                }}
              >
                Instant reply with AI
              </Typography>
            </Box>
            <Switch
              size="small"
              checked={aiToggleEnabled}
              onChange={(e) => handleAIToggle(e.target.checked)}
            />
          </Box>
        )}
      </Box>

      {/* Text Input */}
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            backgroundColor: colorTokens.neutral[50],
            fontSize: 14,
            borderRadius: '10px',
            '& fieldset': {
              borderColor: colorTokens.neutral[300],
            },
            '&:hover fieldset': {
              borderColor: colorTokens.neutral[400],
            },
            '&.Mui-focused fieldset': {
              borderColor: colorTokens.primary[500],
              borderWidth: '2px',
            },
          },
          '& .MuiOutlinedInput-input': {
            lineHeight: 1.6,
          },
        }}
      />

      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Formatting Tools */}
        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <IconButton size="small" title="Bold">
            <FormatBoldIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" title="Italic">
            <FormatItalicIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" title="Underline">
            <FormatUnderlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" title="Insert Link">
            <InsertLinkIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" title="Code">
            <CodeIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" title="Emoji">
            <SentimentSatisfiedAltIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          <IconButton size="small" title="Attach File" onClick={onAttachFile}>
            <AttachFileIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" title="Insert Image" onClick={onAttachImage}>
            <InsertPhotoIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Send Button */}
        <Button
          variant="contained"
          size="medium"
          endIcon={<SendIcon sx={{ fontSize: 18 }} />}
          onClick={handleSend}
          disabled={!message.trim()}
          sx={{
            textTransform: 'none',
            px: 3,
            py: 1,
            fontSize: 14,
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            },
            '&:disabled': {
              backgroundColor: colorTokens.neutral[300],
              color: colorTokens.neutral[500],
            },
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};
