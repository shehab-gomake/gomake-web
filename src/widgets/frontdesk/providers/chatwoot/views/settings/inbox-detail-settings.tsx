/**
 * Inbox Detail Settings View
 *
 * Displays detailed settings for a specific inbox with tabs for
 * Settings, Collaborators, Business Hours, CSAT, and Bot Configuration.
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Link,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

interface InboxDetailSettingsProps {
  inbox: ChatwootInbox;
  onBack: () => void;
}

type SettingsTab = "settings" | "collaborators" | "business-hours" | "csat" | "bot-configuration";

export const InboxDetailSettings: React.FC<InboxDetailSettingsProps> = ({ inbox, onBack }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("settings");
  const [inboxName, setInboxName] = useState(inbox.name || "");
  const [greetingEnabled, setGreetingEnabled] = useState("disabled");
  const [helpCenter, setHelpCenter] = useState("");
  const [senderNameType, setSenderNameType] = useState<"friendly" | "professional">("friendly");

  const inboxDisplayName = inbox.name || inbox.email || "Unknown Inbox";
  const inboxEmail = inbox.email || `${inbox.name?.toLowerCase().replace(/\s+/g, ".")}@gomake.net`;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      {/* Header */}
      <Box sx={{ px: 3, pt: 2, pb: 1, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Link
            component="button"
            onClick={onBack}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
              cursor: "pointer",
              border: "none",
              background: "none",
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">Back</Typography>
          </Link>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Inboxes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {inboxDisplayName} ({inboxEmail})
        </Typography>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              minHeight: 48,
            },
            "& .Mui-selected": {
              color: "primary.main",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "primary.main",
            },
          }}
        >
          <Tab label="Settings" value="settings" />
          <Tab label="Collaborators" value="collaborators" />
          <Tab label="Business Hours" value="business-hours" />
          <Tab label="CSAT" value="csat" />
          <Tab label="Bot Configuration" value="bot-configuration" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto", display: "flex" }}>
        {/* Left Sidebar */}
        <Box
          sx={{
            width: 280,
            p: 3,
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}>
            Inbox Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your inbox settings
          </Typography>
        </Box>

        {/* Right Content */}
        <Box sx={{ flex: 1, p: 3, bgcolor: "background.default" }}>
          {activeTab === "settings" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 800 }}>
              {/* Channel Avatar */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Channel Avatar
                </Typography>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "grey.300",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid",
                    borderColor: "grey.400",
                  }}
                >
                  <EmailIcon sx={{ fontSize: 48, color: "grey.600" }} />
                </Box>
              </Box>

              {/* Inbox Name */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Inbox Name
                </Typography>
                <TextField
                  fullWidth
                  value={inboxName}
                  onChange={(e) => setInboxName(e.target.value)}
                  placeholder="Enter inbox name"
                  sx={{
                    maxWidth: 500,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "grey.50",
                      borderRadius: "8px",
                    },
                  }}
                />
              </Box>

              {/* Enable channel greeting */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Enable channel greeting
                </Typography>
                <FormControl sx={{ minWidth: 200, mb: 1 }}>
                  <Select
                    value={greetingEnabled}
                    onChange={(e) => setGreetingEnabled(e.target.value)}
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: "8px",
                    }}
                  >
                    <MenuItem value="disabled">Disabled</MenuItem>
                    <MenuItem value="enabled">Enabled</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="body2" color="text.secondary">
                  Auto-send greeting messages when customers start a conversation and send their first message.
                </Typography>
              </Box>

              {/* Help Center */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Help Center
                </Typography>
                <FormControl sx={{ minWidth: 200, mb: 1 }}>
                  <Select
                    value={helpCenter}
                    onChange={(e) => setHelpCenter(e.target.value)}
                    displayEmpty
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: "8px",
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Help Center</em>
                    </MenuItem>
                    <MenuItem value="default">Default Help Center</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="body2" color="text.secondary">
                  Attach a Help Center with the inbox
                </Typography>
              </Box>

              {/* Sender name */}
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}>
                      Sender name
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select the name shown to your customer when they receive emails from your agents.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  {/* Friendly Card */}
                  <Card
                    onClick={() => setSenderNameType("friendly")}
                    sx={{
                      flex: 1,
                      cursor: "pointer",
                      border: senderNameType === "friendly" ? "2px solid" : "1px solid",
                      borderColor: senderNameType === "friendly" ? "primary.main" : "divider",
                      bgcolor: senderNameType === "friendly" ? "grey.50" : "background.paper",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "grey.50",
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Friendly
                        </Typography>
                        {senderNameType === "friendly" && <CheckCircleIcon sx={{ color: "primary.main", fontSize: 20 }} />}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Add the name of the agent who sent the reply in the sender name to make it friendly.
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1.5,
                          bgcolor: "background.paper",
                          borderRadius: 1,
                        }}
                      >
                        <Avatar sx={{ width: 24, height: 24, bgcolor: "primary.main", fontSize: 12 }}>S</Avatar>
                        <Typography variant="body2" sx={{ fontSize: "0.813rem" }}>
                          <strong>S Smith</strong> from Chatwoot &lt;support@yourbusiness.com&gt;
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Professional Card */}
                  <Card
                    onClick={() => setSenderNameType("professional")}
                    sx={{
                      flex: 1,
                      cursor: "pointer",
                      border: senderNameType === "professional" ? "2px solid" : "1px solid",
                      borderColor: senderNameType === "professional" ? "primary.main" : "divider",
                      bgcolor: senderNameType === "professional" ? "grey.50" : "background.paper",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "grey.50",
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Professional
                        </Typography>
                        {senderNameType === "professional" && <CheckCircleIcon sx={{ color: "primary.main", fontSize: 20 }} />}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Use only the configured business name as the sender name in the email header.
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1.5,
                          bgcolor: "background.paper",
                          borderRadius: 1,
                        }}
                      >
                        <Avatar sx={{ width: 24, height: 24, bgcolor: "grey.400", fontSize: 12 }}>C</Avatar>
                        <Typography variant="body2" sx={{ fontSize: "0.813rem" }}>
                          <strong>C Chatwoot</strong> &lt;support@yourbusiness.com&gt;
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                <Link
                  href="#"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  + Configure your business name
                </Link>
              </Box>
            </Box>
          )}

          {activeTab === "collaborators" && (
            <Box>
              <Typography variant="h6">Collaborators</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Manage agents assigned to this inbox
              </Typography>
            </Box>
          )}

          {activeTab === "business-hours" && (
            <Box>
              <Typography variant="h6">Business Hours</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Configure working hours for this inbox
              </Typography>
            </Box>
          )}

          {activeTab === "csat" && (
            <Box>
              <Typography variant="h6">CSAT</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Configure customer satisfaction surveys
              </Typography>
            </Box>
          )}

          {activeTab === "bot-configuration" && (
            <Box>
              <Typography variant="h6">Bot Configuration</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Configure automated bot responses
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
