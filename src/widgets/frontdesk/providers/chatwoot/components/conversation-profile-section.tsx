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
import { colorTokens, radiusTokens, shadowTokens, semanticSpacing } from "@/widgets/frontdesk/design-system";
import { getAndSetCustomerById, getMostRelevantCustomerByEmailApi, getMostRelevantCustomerByPhoneApi } from "@/services/api-service/customers/customers-api";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useCustomerEdit } from "@/hooks/use-customer-edit";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS, CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { LinkCustomerModal } from "./link-customer-modal";
import { useClientTypesList } from "@/hooks/use-client-types";
import { generateContactAvatar } from "../utils/avatar.utils";

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
  onCustomerLinked?: (customerId: string, customerData?: any) => void;
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
  const { callApi } = useGomakeAxios();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openLinkModal, setOpenLinkModal] = useState(false);
  const [clientType, setClientType] = useState<CLIENT_TYPE>(CLIENT_TYPE.CUSTOMER);
  
  // Generate avatar data for contact
  const contactAvatarData = React.useMemo(() => generateContactAvatar({
    id: contactId,
    name: contactName,
    email: contactEmail,
    thumbnail: contactAvatarUrl,
    availability_status: contactAvailabilityStatus,
  }), [contactId, contactName, contactEmail, contactAvatarUrl, contactAvailabilityStatus]);
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
            // Auto-link the customer with full customer data
            if (onCustomerLinked) {
              await onCustomerLinked(foundCustomer.id, foundCustomer);
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
      onCustomerLinked?.(newCustomer.id, newCustomer);
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
    // Notify parent component with full customer data
    if (onCustomerLinked) {
      await onCustomerLinked(customerId, customerData);
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

  // Shared container styles
  const containerStyles = {
    p: 1.5,
    backgroundColor: colorTokens.neutral[50],
    borderRadius: "6px",
    border: `1px solid ${colorTokens.semantic.border.default}`,
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: colorTokens.neutral[100],
    },
  };

  // Display name and email based on whether customer is linked
  const displayName = customer?.name || contactName || contactEmail || "Unknown Contact";
  const displayEmail = customer?.mail || contactEmail;
  const displayPhone = customer?.phone || contactPhoneNumber;

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
      ) : (
        <Box sx={containerStyles}>
          {/* Action Buttons Row - Top of card */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 0.5,
              mb: 1.5,
            }}
          >
            {customer ? (
              // Linked Customer Actions
              <>
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
                        backgroundColor: colorTokens.primary[50],
                        color: colorTokens.primary[600],
                      },
                    }}
                  >
                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
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
                        backgroundColor: colorTokens.primary[50],
                        color: colorTokens.primary[600],
                      },
                    }}
                  >
                    <SwapHorizIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              // Unlinked Contact Actions
              <>
                <Tooltip title="Create Customer">
                  <IconButton
                    size="small"
                    onClick={() => handleCreateCustomer(CLIENT_TYPE.CUSTOMER)}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                      width: 24,
                      height: 24,
                      "&:hover": {
                        backgroundColor: colorTokens.primary[50],
                        color: colorTokens.primary[600],
                      },
                    }}
                  >
                    <PersonAddIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Create Supplier">
                  <IconButton
                    size="small"
                    onClick={() => handleCreateCustomer(CLIENT_TYPE.SUPPLIER)}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                      width: 24,
                      height: 24,
                      "&:hover": {
                        backgroundColor: colorTokens.primary[50],
                        color: colorTokens.primary[600],
                      },
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Link Existing">
                  <IconButton
                    size="small"
                    onClick={() => setOpenLinkModal(true)}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                      width: 24,
                      height: 24,
                      "&:hover": {
                        backgroundColor: colorTokens.primary[50],
                        color: colorTokens.primary[600],
                      },
                    }}
                  >
                    <LinkIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>

          {/* Contact/Customer Name with Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar 
              src={contactAvatarData.src} 
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: contactAvatarData.backgroundColor,
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
              alt={contactAvatarData.displayName}
              title={contactAvatarData.displayName}
            >
              {contactAvatarData.initials}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: 15,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </Typography>
              {displayEmail && (
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.semantic.text.secondary,
                    fontSize: 13,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {displayEmail}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Additional Details */}
          {customer ? (
            // Linked Customer - Additional details
            <>
              {/* Phone with Icon */}
              {displayPhone && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
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
                    {displayPhone}
                  </Typography>
                </Box>
              )}

              {/* Customer Code and Type with Icon */}
              {(customer.code || customer.typeClient) && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
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
            </>
          ) : (
            // Unlinked Contact - Additional details
            (contactPhoneNumber || contactBlocked) && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 1.5 }}>
                {contactPhoneNumber && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: colorTokens.semantic.text.secondary }} />
                    <Typography variant="caption" sx={{ fontSize: 13, color: colorTokens.semantic.text.secondary }}>
                      {contactPhoneNumber}
                    </Typography>
                  </Box>
                )}
                {contactBlocked !== null && contactBlocked !== undefined && contactBlocked && (
                  <Typography variant="caption" sx={{ fontSize: 13, color: colorTokens.error[600] }}>
                    Blocked
                  </Typography>
                )}
              </Box>
            )
          )}
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
