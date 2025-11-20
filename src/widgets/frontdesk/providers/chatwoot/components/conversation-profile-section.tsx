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
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Link as LinkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  OpenInNew as OpenInNewIcon,
  SwapHoriz as SwapHorizIcon,
  PersonAdd as PersonAddIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { colorTokens } from "@/widgets/frontdesk/design-system";
import { getAndSetCustomerById, getMostRelevantCustomerByEmailApi, getMostRelevantCustomerByPhoneApi } from "@/services/api-service/customers/customers-api";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useCustomerEdit } from "@/hooks/use-customer-edit";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS, CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { LinkCustomerModal } from "./link-customer-modal";
import { useClientTypesList } from "@/hooks/use-client-types";

interface Customer {
  id: string;
  name: string;
  mail?: string;
  phone?: string;
  code?: string;        // Customer code
  typeClient?: string;  // Client type: "C" = Customer, "S" = Supplier
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
  /** Account ID for Chatwoot operations */
  accountId?: number | null;
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
  accountId,
  onCustomerLinked,
}) => {
  const { primaryColor } = useGomakeTheme();
  const { callApi } = useGomakeAxios();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openLinkModal, setOpenLinkModal] = useState(false);
  const [clientType, setClientType] = useState<CLIENT_TYPE>(CLIENT_TYPE.CUSTOMER);
  const [tempCustomerData, setTempCustomerData] = useState<any>(null);
  const [isAutoSearching, setIsAutoSearching] = useState(false);
  const [hasAutoSearched, setHasAutoSearched] = useState(false);

  const { showCustomerModal, customerForEdit, getCustomerForEdit, closeModal, setCustomerForEdit } = useCustomerEdit();
  const { getClientTypesCategories } = useClientTypesList();

  // Reset auto-search flag when contact changes
  useEffect(() => {
    setHasAutoSearched(false);
  }, [contactId]);

  // Fetch customer if customerId exists
  useEffect(() => {
    if (customerId) {
      loadCustomer(customerId);
    }
  }, [customerId]);

  // Auto-search CRM when contact doesn't have customerId
  useEffect(() => {
    // Only search if:
    // 1. No customerId is linked
    // 2. We haven't already searched for this contact
    // 3. We have either email or phone
    // 4. We have accountId and contactId (needed for linking)
    if (customerId || hasAutoSearched || isAutoSearching || !accountId || !contactId) {
      return;
    }

    const shouldSearch = (contactEmail && contactEmail.trim()) || (contactPhoneNumber && contactPhoneNumber.trim());
    if (!shouldSearch) {
      return;
    }

    const searchCrmForCustomer = async () => {
      setIsAutoSearching(true);
      try {
        let customerResult: any = null;

        // Prefer email search, fallback to phone
        if (contactEmail && contactEmail.trim()) {
          // getSetApiData returns Promise<{ success: boolean; data: any }>
          const result = await getMostRelevantCustomerByEmailApi(
            callApi,
            () => {}, // Callback not needed, we use return value
            { email: contactEmail.trim() }
          );
          if (result?.success && result.data) {
            customerResult = result.data;
          }
        } else if (contactPhoneNumber && contactPhoneNumber.trim()) {
          // getSetApiData returns Promise<{ success: boolean; data: any }>
          const result = await getMostRelevantCustomerByPhoneApi(
            callApi,
            () => {}, // Callback not needed, we use return value
            { phone: contactPhoneNumber.trim() }
          );
          if (result?.success && result.data) {
            customerResult = result.data;
          }
        }

        // If we got exactly one customer result, auto-link it
        if (customerResult) {
          // Check if result is an array with one item, or a single object
          const customers = Array.isArray(customerResult) ? customerResult : [customerResult];
          
          // Filter out null/undefined entries
          const validCustomers = customers.filter((c: any) => c && c.id);
          
          if (validCustomers.length === 1) {
            const foundCustomer = validCustomers[0];
            // Auto-link the customer
            if (onCustomerLinked) {
              await onCustomerLinked(foundCustomer.id);
            }
          }
        }
      } catch (error) {
        console.error("[ConversationProfileSection] Error auto-searching CRM:", error);
        // Silently fail - don't show error to user for auto-search
      } finally {
        setIsAutoSearching(false);
        setHasAutoSearched(true);
      }
    };

    searchCrmForCustomer();
  }, [customerId, contactEmail, contactPhoneNumber, accountId, contactId, hasAutoSearched, isAutoSearching, callApi, onCustomerLinked]);

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

  const handleCreateCustomer = async (type: CLIENT_TYPE) => {
    setClientType(type);

    // Load client types data based on the selected type
    const clientTypeId = type === CLIENT_TYPE.CUSTOMER
      ? CLIENT_TYPE_Id.CUSTOMER
      : CLIENT_TYPE_Id.SUPPLIER;
    await getClientTypesCategories(clientTypeId);

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

  const handleLinkCustomer = async (customerId: string, customerData: any) => {
    // Update local state
    setCustomer(customerData);
    // Notify parent component
    if (onCustomerLinked) {
      onCustomerLinked(customerId);
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

  // Helper to get client type label
  const getClientTypeLabel = (typeClient?: string) => {
    if (typeClient === CLIENT_TYPE.CUSTOMER || typeClient === "C") {
      return "Customer";
    } else if (typeClient === CLIENT_TYPE.SUPPLIER || typeClient === "S") {
      return "Supplier";
    }
    return null;
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
          sx={{
            position: "relative",
            p: 1.5,
            backgroundColor: colorTokens.neutral[50],
            borderRadius: "6px",
            border: `1px solid ${colorTokens.semantic.border.default}`,
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: colorTokens.neutral[100],
            },
          }}
        >
          {/* Customer Name with Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Avatar src={contactAvatarUrl || undefined} sx={{ width: 40, height: 40 }}>
              {customer.name?.charAt(0)}
            </Avatar>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: 15,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {customer.name}
            </Typography>
          </Box>

          {/* Email with Icon */}
          {customer.mail && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <EmailIcon sx={{ fontSize: 16, color: colorTokens.semantic.text.secondary }} />
              <Typography
                variant="caption"
                sx={{
                  color: colorTokens.semantic.text.secondary,
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {customer.mail}
              </Typography>
            </Box>
          )}

          {/* Phone with Icon */}
          {customer.phone && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <PhoneIcon sx={{ fontSize: 16, color: colorTokens.semantic.text.secondary }} />
              <Typography
                variant="caption"
                sx={{
                  color: colorTokens.semantic.text.secondary,
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {customer.phone}
              </Typography>
            </Box>
          )}

          {/* Customer Code and Type with Icon */}
          {(customer.code || customer.typeClient) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <BadgeIcon sx={{ fontSize: 16, color: colorTokens.semantic.text.secondary }} />
              <Typography
                variant="caption"
                sx={{
                  color: colorTokens.semantic.text.secondary,
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {customer.code}
                {customer.typeClient && (
                  <span style={{ marginLeft: customer.code ? "4px" : "0" }}>
                    ({getClientTypeLabel(customer.typeClient)})
                  </span>
                )}
              </Typography>
            </Box>
          )}

          {/* Action Icons - Upper Right Corner */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 0.5,
            }}
          >
            {/* View Customer Details */}
            <Tooltip title="View customer details">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewCustomer();
                }}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  width: 24,
                  height: 24,
                  "&:hover": {
                    backgroundColor: primaryColor(50),
                    color: primaryColor(600),
                  },
                }}
              >
                <OpenInNewIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>

            {/* Change Linked Customer */}
            <Tooltip title="Change linked customer">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenLinkModal(true);
                }}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  width: 24,
                  height: 24,
                  "&:hover": {
                    backgroundColor: primaryColor(50),
                    color: primaryColor(600),
                  },
                }}
              >
                <SwapHorizIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
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

          {/* Contact details - only user-relevant information */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 1 }}>
            {contactPhoneNumber && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <PhoneIcon sx={{ fontSize: 14, color: colorTokens.semantic.text.secondary }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                  {contactPhoneNumber}
                </Typography>
              </Box>
            )}
            {contactBlocked !== null && contactBlocked !== undefined && contactBlocked && (
              <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.error.main }}>
                Blocked
              </Typography>
            )}
            {contactLastActivityAt && (
              <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                Last Activity: {formatTimestamp(contactLastActivityAt)}
              </Typography>
            )}
          </Box>

          {/* Customer Action Buttons - Icon-only with tooltips */}
          <Box sx={{ mt: 2, display: "flex", gap: 1.5, alignItems: "center", justifyContent: "flex-start" }}>
            {/* Create Customer Button */}
            <Tooltip title="Create Customer">
              <IconButton
                size="small"
                onClick={() => handleCreateCustomer(CLIENT_TYPE.CUSTOMER)}
                sx={{
                  backgroundColor: "transparent",
                  color: primaryColor(600),
                  borderRadius: "4px",
                  padding: "6px",
                  minWidth: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: primaryColor(50),
                    color: primaryColor(700),
                  },
                }}
              >
                <PersonAddIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            {/* Create Supplier Button */}
            <Tooltip title="Create Supplier">
              <IconButton
                size="small"
                onClick={() => handleCreateCustomer(CLIENT_TYPE.SUPPLIER)}
                sx={{
                  backgroundColor: "transparent",
                  border: `1px solid ${primaryColor(300)}`,
                  color: primaryColor(600),
                  borderRadius: "4px",
                  padding: "6px",
                  minWidth: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: primaryColor(50),
                    borderColor: primaryColor(400),
                    color: primaryColor(700),
                  },
                }}
              >
                <BusinessIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            {/* Link to Existing Customer Button */}
            <Tooltip title="Link Existing">
              <IconButton
                size="small"
                onClick={() => setOpenLinkModal(true)}
                sx={{
                  backgroundColor: "transparent",
                  color: colorTokens.semantic.text.secondary,
                  borderRadius: "4px",
                  padding: "6px",
                  minWidth: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: colorTokens.neutral[100],
                    color: primaryColor(600),
                  },
                }}
              >
                <LinkIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* Link Customer Modal - Only mount when open to prevent unnecessary API calls */}
      {openLinkModal && (
        <LinkCustomerModal
          open={openLinkModal}
          onClose={() => setOpenLinkModal(false)}
          contactName={contactName || undefined}
          contactEmail={contactEmail || undefined}
          onCustomerLinked={handleLinkCustomer}
        />
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
