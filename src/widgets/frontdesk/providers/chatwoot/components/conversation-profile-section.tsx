/**
 * Conversation Profile Section
 *
 * Displays contact information for a Chatwoot conversation
 * and provides options to link/create GoMake customers.
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Business as BusinessIcon,
  Link as LinkIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { colorTokens } from "@/widgets/frontdesk/design-system";
import { getAndSetCustomerById } from "@/services/api-service/customers/customers-api";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useCustomerEdit } from "@/hooks/use-customer-edit";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";

interface Customer {
  id: string;
  name: string;
  mail?: string;
  phone?: string;
  [key: string]: any;
}

interface ConversationProfileSectionProps {
  /** Contact name from conversation */
  contactName?: string | null;
  /** Contact email from conversation */
  contactEmail?: string | null;
  /** Contact avatar URL */
  contactAvatarUrl?: string | null;
  /** Contact phone number */
  contactPhoneNumber?: string | null;
  /** Contact ID */
  contactId?: number | null;
  /** Contact identifier */
  contactIdentifier?: string | null;
  /** Contact availability status */
  contactAvailabilityStatus?: string | null;
  /** Contact blocked status */
  contactBlocked?: boolean | null;
  /** Contact additional attributes */
  contactAdditionalAttributes?: Record<string, any> | null;
  /** Contact custom attributes */
  contactCustomAttributes?: Record<string, any> | null;
  /** Contact last activity at */
  contactLastActivityAt?: number | null;
  /** Contact created at */
  contactCreatedAt?: number | null;
  /** Linked GoMake customer ID (if already linked) */
  customerId?: string | null;
  /** Callback when customer is linked */
  onCustomerLinked?: (customerId: string) => void;
}

export const ConversationProfileSection: React.FC<ConversationProfileSectionProps> = ({
  contactName,
  contactEmail,
  contactAvatarUrl,
  contactPhoneNumber,
  contactId,
  contactIdentifier,
  contactAvailabilityStatus,
  contactBlocked,
  contactAdditionalAttributes,
  contactCustomAttributes,
  contactLastActivityAt,
  contactCreatedAt,
  customerId,
  onCustomerLinked,
}) => {
  const { neutralColor, primaryColor } = useGomakeTheme();
  const { callApi } = useGomakeAxios();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [clientType, setClientType] = useState<CLIENT_TYPE>(CLIENT_TYPE.CUSTOMER);
  const [linkMenuAnchor, setLinkMenuAnchor] = useState<null | HTMLElement>(null);
  const [tempCustomerData, setTempCustomerData] = useState<any>(null);

  const { showCustomerModal, customerForEdit, getCustomerForEdit, closeModal, setCustomerForEdit } = useCustomerEdit();

  // Fetch customer if customerId exists
  useEffect(() => {
    if (customerId) {
      loadCustomer(customerId);
    }
  }, [customerId]);

  const loadCustomer = async (id: string) => {
    if (!id) return;

    setLoading(true);
    try {
      const callback = (res: any) => {
        if (res?.success && res.data) {
          setCustomer(res.data);
        } else {
          console.warn("Customer not found or invalid response:", res);
        }
        setLoading(false);
      };

      await getAndSetCustomerById(callApi, callback, { customerId: id });
    } catch (error) {
      console.error("Error loading customer:", error);
      // TODO: Show error state in UI
      setLoading(false);
    }
  };

  const handleCreateCustomer = (type: CLIENT_TYPE) => {
    setClientType(type);
    setLinkMenuAnchor(null); // Close menu first

    // Initialize temp data for the modal with available contact info
    setTempCustomerData({
      name: contactName?.trim() || "",
      mail: contactEmail?.trim() || "",
      phone: "",
    });
    setOpenCreateModal(true);
  };

  const handleCustomerCreated = (newCustomer: any) => {
    if (newCustomer?.id) {
      setCustomer(newCustomer);
      onCustomerLinked?.(newCustomer.id);
    }
    setOpenCreateModal(false);
    setTempCustomerData(null);
  };

  const handleViewCustomer = () => {
    if (customer?.id) {
      getCustomerForEdit(customer.id);
    }
  };

  // Helper to format timestamp
  const formatTimestamp = (timestamp: number) => {
    try {
      return new Date(timestamp * 1000).toLocaleString();
    } catch {
      return String(timestamp);
    }
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="caption"
        sx={{
          color: colorTokens.semantic.text.secondary,
          mb: 1,
          display: "block",
          fontWeight: 600,
          textTransform: "uppercase",
          fontSize: 10,
        }}
      >
        Contact
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : customer ? (
        // Linked Customer View
        <Box
          onClick={handleViewCustomer}
          sx={{
            p: 1.5,
            backgroundColor: colorTokens.neutral[50],
            borderRadius: "6px",
            border: `1px solid ${colorTokens.semantic.border.default}`,
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: colorTokens.neutral[100],
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Avatar src={contactAvatarUrl || undefined} sx={{ width: 32, height: 32 }}>
              {customer.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {customer.name}
              </Typography>
              {customer.mail && (
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.semantic.text.secondary,
                    fontSize: 11,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {customer.mail}
                </Typography>
              )}
            </Box>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: colorTokens.primary[600],
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            Click to view customer details
          </Typography>
        </Box>
      ) : (
        // Unlinked Contact View - Simple display without background or functionality
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1,
            }}
          >
            <Avatar src={contactAvatarUrl || undefined} sx={{ width: 32, height: 32 }}>
              {contactName?.charAt(0) || contactEmail?.charAt(0) || "?"}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {contactName || contactEmail || "Unknown Contact"}
              </Typography>
              {contactEmail && (
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.semantic.text.secondary,
                    fontSize: 11,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {contactEmail}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Additional contact fields (for testing) */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 1 }}>
            {contactPhoneNumber && (
              <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                Phone: {contactPhoneNumber}
              </Typography>
            )}
            {contactId && (
              <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                Contact ID: {contactId}
              </Typography>
            )}
            {contactIdentifier && (
              <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                Identifier: {contactIdentifier}
              </Typography>
            )}
            {contactAvailabilityStatus && (
              <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                Status: {contactAvailabilityStatus}
              </Typography>
            )}
            {contactBlocked !== null && contactBlocked !== undefined && (
              <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                Blocked: {contactBlocked ? "Yes" : "No"}
              </Typography>
            )}
            {contactLastActivityAt && (
              <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                Last Activity: {formatTimestamp(contactLastActivityAt)}
              </Typography>
            )}
            {contactCreatedAt && (
              <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                Created: {formatTimestamp(contactCreatedAt)}
              </Typography>
            )}
            {contactAdditionalAttributes && Object.keys(contactAdditionalAttributes).length > 0 && (
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600, color: colorTokens.semantic.text.secondary }}>
                  Additional Attributes:
                </Typography>
                {Object.entries(contactAdditionalAttributes).map(([key, value]) => (
                  <Typography key={key} variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary, display: "block" }}>
                    {key}: {JSON.stringify(value)}
                  </Typography>
                ))}
              </Box>
            )}
            {contactCustomAttributes && Object.keys(contactCustomAttributes).length > 0 && (
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600, color: colorTokens.semantic.text.secondary }}>
                  Custom Attributes:
                </Typography>
                {Object.entries(contactCustomAttributes).map(([key, value]) => (
                  <Typography key={key} variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary, display: "block" }}>
                    {key}: {JSON.stringify(value)}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Customer Creation Modal */}
      {openCreateModal && tempCustomerData && (
        <CustomerCardWidget
          openModal={openCreateModal}
          onClose={() => {
            setOpenCreateModal(false);
            setTempCustomerData(null);
          }}
          onCustomerAdd={handleCustomerCreated}
          customer={tempCustomerData}
          setCustomer={setTempCustomerData}
          typeClient={clientType}
          customerAction={CUSTOMER_ACTIONS.Add}
        />
      )}

      {/* Customer Edit Modal */}
      {showCustomerModal && customerForEdit && (
        <CustomerCardWidget
          openModal={showCustomerModal}
          onClose={closeModal}
          onCustomerAdd={(updatedCustomer) => {
            setCustomer(updatedCustomer);
            closeModal();
          }}
          customer={customerForEdit}
          setCustomer={setCustomerForEdit}
          typeClient={clientType}
          customerAction={CUSTOMER_ACTIONS.Edit}
        />
      )}
    </Box>
  );
};
