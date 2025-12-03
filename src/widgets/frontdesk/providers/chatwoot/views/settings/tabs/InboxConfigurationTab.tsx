/**
 * Inbox Configuration Tab
 *
 * Technical settings: webhook URLs, API tokens, installation scripts, etc.
 * Channel-specific configuration.
 */

import React from "react";
import { Box, Typography, Alert, Button, Link } from "@mui/material";
import { OpenInNew as ExternalLinkIcon } from "@mui/icons-material";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { SettingsSection, CodeDisplay } from "../../../components/settings";

interface InboxConfigurationTabProps {
  inbox: ChatwootInbox;
  accountId: number;
}

export const InboxConfigurationTab: React.FC<InboxConfigurationTabProps> = ({
  inbox,
  accountId,
}) => {
  const isEmail = inbox.channel_type?.includes("Email");
  const isWhatsApp = inbox.channel_type?.includes("WhatsApp");
  const isWebWidget = inbox.channel_type?.includes("WebWidget");
  const isAPI = inbox.channel_type?.includes("Api");
  const isTwilio = inbox.channel_type?.includes("Twilio");

  const baseUrl = window.location.origin;
  const webhookUrl = `${baseUrl}/api/v1/webhooks/chatwoot/${inbox.id}`;
  const widgetScript = `<script>
  (function(d,t) {
    var BASE_URL="${baseUrl}";
    var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=BASE_URL+"/packs/js/sdk.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g,s);
    g.onload=function(){
      window.chatwootSDK.run({
        websiteToken: '${inbox.website_token || 'YOUR_WEBSITE_TOKEN'}',
        baseUrl: BASE_URL
      })
    }
  })(document,"script");
</script>`;

  return (
    <Box sx={{ maxWidth: 800 }}>
      {/* Email Configuration */}
      {isEmail && (
        <>
          <SettingsSection
            title="Forward Email Address"
            description="Forward emails to this address to create conversations"
          >
            <CodeDisplay
              code={inbox.forward_to_email || `inbox-${inbox.id}@mail.gomake.com`}
              label="Forward-to Email"
            />
            <Typography variant="caption" color="text.secondary">
              Add this email as a forwarding address in your email client to
              automatically create conversations from incoming emails.
            </Typography>
          </SettingsSection>

          <SettingsSection
            title="IMAP/SMTP Settings"
            description="Email server configuration (view only)"
            showDivider={!isWhatsApp && !isWebWidget && !isAPI}
          >
            <Alert severity="info">
              IMAP and SMTP settings are configured during inbox setup. Contact your
              administrator to modify these settings.
            </Alert>
          </SettingsSection>
        </>
      )}

      {/* WhatsApp Configuration */}
      {isWhatsApp && (
        <>
          <SettingsSection
            title="Webhook Verification Token"
            description="Use this token to verify webhooks from WhatsApp"
          >
            <CodeDisplay
              code={(inbox.provider_config?.webhook_verify_token as string) || "WEBHOOK_TOKEN_NOT_SET"}
              label="Webhook Token"
            />
          </SettingsSection>

          <SettingsSection
            title="API Configuration"
            description="API key for WhatsApp Cloud API integration"
          >
            <CodeDisplay code={(inbox.provider_config?.api_key as string) || "API_KEY_NOT_SET"} label="API Key" />
            <Button variant="outlined" size="small" sx={{ mt: 2 }}>
              Sync Templates
            </Button>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
              Sync message templates from your WhatsApp Business Account
            </Typography>
          </SettingsSection>

          <SettingsSection
            title="Webhook URL"
            description="Configure this webhook URL in your WhatsApp Business settings"
            showDivider={!isWebWidget && !isAPI}
          >
            <CodeDisplay code={webhookUrl} label="Webhook URL" showLineNumbers={false} />
          </SettingsSection>
        </>
      )}

      {/* Web Widget Configuration */}
      {isWebWidget && (
        <>
          <SettingsSection
            title="Installation Code"
            description="Add this code to your website to display the chat widget"
          >
            <CodeDisplay
              code={widgetScript}
              label="Widget Script"
              language="html"
              showLineNumbers={true}
              maxHeight={300}
            />
            <Box sx={{ mt: 2 }}>
              <Link
                href="https://www.chatwoot.com/docs/product/channels/live-chat/create-website-channel"
                target="_blank"
                rel="noopener"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <Typography variant="body2">View installation guide</Typography>
                <ExternalLinkIcon sx={{ fontSize: 16 }} />
              </Link>
            </Box>
          </SettingsSection>

          <SettingsSection
            title="HMAC Verification"
            description="Enable HMAC token verification for secure widget authentication"
          >
            <CodeDisplay
              code={inbox.hmac_token || "HMAC_TOKEN_NOT_SET"}
              label="HMAC Token"
            />
            <Typography variant="caption" color="text.secondary">
              Use this token to generate HMAC signatures for user authentication
            </Typography>
          </SettingsSection>

          <SettingsSection
            title="Allowed Domains"
            description="Domains where the widget can be embedded (one per line)"
            showDivider={false}
          >
            <CodeDisplay
              code={inbox.allowed_domains?.join("\n") || "No domains configured"}
              label="Allowed Domains"
              maxHeight={150}
            />
            <Typography variant="caption" color="text.secondary">
              Leave empty to allow all domains (not recommended for production)
            </Typography>
          </SettingsSection>
        </>
      )}

      {/* API Inbox Configuration */}
      {isAPI && (
        <>
          <SettingsSection
            title="Inbox Identifier"
            description="Use this identifier when creating conversations via API"
          >
            <CodeDisplay code={inbox.inbox_identifier || inbox.id.toString()} label="Inbox ID" />
          </SettingsSection>

          <SettingsSection
            title="HMAC Token"
            description="Token for API request authentication"
            showDivider={false}
          >
            <CodeDisplay code={inbox.hmac_token || "HMAC_TOKEN_NOT_SET"} label="HMAC Token" />
            <Typography variant="caption" color="text.secondary">
              Include this token in your API requests for authentication
            </Typography>
          </SettingsSection>
        </>
      )}

      {/* Twilio Configuration */}
      {isTwilio && (
        <SettingsSection
          title="Twilio Webhook"
          description="Configure this webhook in your Twilio console"
          showDivider={false}
        >
          <CodeDisplay code={webhookUrl} label="Callback URL" />
          <Typography variant="caption" color="text.secondary">
            Set this URL as the webhook for incoming messages in your Twilio account
          </Typography>
        </SettingsSection>
      )}

      {/* Generic/Unknown Channel Type */}
      {!isEmail && !isWhatsApp && !isWebWidget && !isAPI && !isTwilio && (
        <Alert severity="info">
          Configuration options vary by channel type. Technical settings will appear
          here based on your inbox configuration.
        </Alert>
      )}
    </Box>
  );
};
