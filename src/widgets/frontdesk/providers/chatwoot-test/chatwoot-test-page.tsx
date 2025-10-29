/**
 * Chatwoot API Test Page
 * Super basic testing interface for all 31 Chatwoot API categories
 * Base URL: http://localhost:8080
 */

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getUserToken } from "@/services/storage-data";

interface TestResult {
  status: "idle" | "loading" | "success" | "error";
  data?: any;
  error?: string;
  timestamp?: Date;
}

const BASE_URL = "http://localhost:8080";

const ChatwootTestPage: React.FC = () => {
  const [results, setResults] = useState<Record<string, TestResult>>({});

  const updateResult = (key: string, update: Partial<TestResult>) => {
    setResults((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...update, timestamp: new Date() },
    }));
  };

  const callApi = async (method: string, path: string): Promise<any> => {
    const token = getUserToken();
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  const testApi = async (key: string, method: string, path: string, label: string) => {
    updateResult(key, { status: "loading" });
    try {
      const data = await callApi(method, path);
      console.log(`✅ ${label} Success:`, data);
      updateResult(key, { status: "success", data });
    } catch (error: any) {
      console.error(`❌ ${label} Error:`, error);
      updateResult(key, {
        status: "error",
        error: error.message,
      });
    }
  };

  // Render test button with result
  const renderTest = (key: string, label: string, onClick: () => void) => {
    const result = results[key];
    const isLoading = result?.status === "loading";

    return (
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" size="small" onClick={onClick} disabled={isLoading} sx={{ minWidth: 200, mb: 1 }}>
          {isLoading ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
          {label}
        </Button>
        {result && result.status !== "idle" && (
          <Alert severity={result.status === "success" ? "success" : result.status === "error" ? "error" : "info"} sx={{ mt: 1 }}>
            {result.status === "success" && (
              <Typography variant="caption">
                ✅ Success - {Array.isArray(result.data) ? `${result.data.length} items` : "Data received"}
              </Typography>
            )}
            {result.status === "error" && <Typography variant="caption">❌ {result.error}</Typography>}
          </Alert>
        )}
      </Box>
    );
  };

  // ========== CORE OPERATIONS ==========
  const testConversationsList = () => testApi("conversations-list", "GET", "/api/accounts/conversations", "List Conversations");
  const testMessagesList = () =>
    testApi("messages-list", "GET", "/api/accounts/conversations/1/messages", "List Messages (Conv 1)");
  const testContactsList = () => testApi("contacts-list", "GET", "/api/accounts/contacts", "List Contacts");
  const testInboxesList = () => testApi("inboxes-list", "GET", "/api/accounts/inboxes", "List Inboxes");

  // ========== ACCOUNT MANAGEMENT ==========
  const testAccountDetails = () => testApi("account-details", "GET", "/api/accounts", "Get Account Details");
  const testAccountUsersList = () => testApi("account-users-list", "GET", "/api/accounts/profile", "Get Profile");
  const testAccountAgentBotsList = () => testApi("account-agent-bots-list", "GET", "/api/accounts/agent_bots", "List Agent Bots");

  // ========== TEAM & USER MANAGEMENT ==========
  const testAgentsList = () => testApi("agents-list", "GET", "/api/accounts/agents", "List Agents");
  const testTeamsList = () => testApi("teams-list", "GET", "/api/accounts/teams", "List Teams");

  // ========== AUTOMATION & WORKFLOWS ==========
  const testAutomationRulesList = () =>
    testApi("automation-rules-list", "GET", "/api/accounts/automation_rules", "List Automation Rules");
  const testWebhooksList = () => testApi("webhooks-list", "GET", "/api/accounts/webhooks", "List Webhooks");

  // ========== CUSTOMER SUPPORT TOOLS ==========
  const testCannedResponsesList = () =>
    testApi("canned-responses-list", "GET", "/api/accounts/canned_responses", "List Canned Responses");
  const testContactLabelsList = () =>
    testApi("contact-labels-list", "GET", "/api/accounts/contacts/1/labels", "List Contact Labels");
  const testCustomAttributesList = () =>
    testApi(
      "custom-attributes-list",
      "GET",
      "/api/accounts/custom_attribute_definitions?attribute_model=0",
      "List Custom Attributes"
    );
  const testCustomFiltersList = () =>
    testApi("custom-filters-list", "GET", "/api/accounts/custom_filters?filter_type=conversation", "List Custom Filters");

  // ========== ASSIGNMENTS & ROUTING ==========
  const testConversationAssignment = () =>
    testApi("conversation-assignment", "GET", "/api/accounts/conversations/1", "Get Conversation Details");

  // ========== ANALYTICS & REPORTING ==========
  const testReportsConversations = () =>
    testApi(
      "reports-conversations",
      "GET",
      "/api/accounts/reports/conversations?type=account&metric=conversations_count",
      "Get Conversation Reports"
    );
  const testAuditLogsList = () => testApi("audit-logs-list", "GET", "/api/accounts/audit_logs", "List Audit Logs");

  // ========== HELP CENTER ==========
  const testHelpCenterList = () => testApi("help-center-list", "GET", "/api/accounts/portals", "List Help Center Portals");

  // ========== INTEGRATIONS ==========
  const testIntegrationsList = () => testApi("integrations-list", "GET", "/api/accounts/integrations/apps", "List Integrations");

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ mb: 3, pb: 2, borderBottom: "2px solid #e0e0e0" }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Chatwoot API Testing
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label="http://localhost:8080" size="small" />
          <Chip label="All paths: /api/accounts/*" size="small" color="primary" />
        </Stack>
      </Box>

      {/* Core Operations */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Core Operations (4 APIs)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            {renderTest("conversations-list", "List Conversations", testConversationsList)}
            {renderTest("messages-list", "List Messages (Conv 1)", testMessagesList)}
            {renderTest("contacts-list", "List Contacts", testContactsList)}
            {renderTest("inboxes-list", "List Inboxes", testInboxesList)}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Account Management */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Account Management (3 APIs)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            {renderTest("account-details", "Get Account Details", testAccountDetails)}
            {renderTest("account-users-list", "Get Profile", testAccountUsersList)}
            {renderTest("account-agent-bots-list", "List Agent Bots", testAccountAgentBotsList)}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Team & User Management */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Team & User Management (2 APIs)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            {renderTest("agents-list", "List Agents", testAgentsList)}
            {renderTest("teams-list", "List Teams", testTeamsList)}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Automation & Workflows */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Automation & Workflows (2 APIs)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            {renderTest("automation-rules-list", "List Automation Rules", testAutomationRulesList)}
            {renderTest("webhooks-list", "List Webhooks", testWebhooksList)}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Customer Support Tools */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Customer Support Tools (4 APIs)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            {renderTest("canned-responses-list", "List Canned Responses", testCannedResponsesList)}
            {renderTest("contact-labels-list", "List Contact Labels", testContactLabelsList)}
            {renderTest("custom-attributes-list", "List Custom Attributes", testCustomAttributesList)}
            {renderTest("custom-filters-list", "List Custom Filters", testCustomFiltersList)}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Assignments & Routing */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Assignments & Routing (1 API)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            {renderTest("conversation-assignment", "Get Conversation Details", testConversationAssignment)}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Analytics & Reporting */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Analytics & Reporting (2 APIs)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            {renderTest("reports-conversations", "Get Conversation Reports", testReportsConversations)}
            {renderTest("audit-logs-list", "List Audit Logs", testAuditLogsList)}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Help Center */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Help Center (1 API)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>{renderTest("help-center-list", "List Help Center Portals", testHelpCenterList)}</Stack>
        </AccordionDetails>
      </Accordion>

      {/* Integrations */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Integrations (1 API)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>{renderTest("integrations-list", "List Integrations", testIntegrationsList)}</Stack>
        </AccordionDetails>
      </Accordion>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
          📡 All requests use /api/accounts/* paths
        </Typography>
        <Typography variant="caption" sx={{ display: "block" }}>
          🔄 Your proxy automatically injects the correct account ID into the path
        </Typography>
        <Typography variant="caption" sx={{ display: "block" }}>
          🔍 Check browser console (F12) for detailed request/response data
        </Typography>
      </Alert>
    </Box>
  );
};

export default ChatwootTestPage;
