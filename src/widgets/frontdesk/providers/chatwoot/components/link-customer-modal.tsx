/**
 * Link Customer Modal
 *
 * Modal for searching and selecting a GoMake customer to link with a Chatwoot contact.
 * Uses the existing ClientAutocomplete component for customer search.
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { useCustomerDropDownList } from "@/hooks/use-customer-drop-down-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { colorTokens } from "@/widgets/frontdesk/design-system";

interface LinkCustomerModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Contact name for display */
  contactName?: string;
  /** Contact email for display */
  contactEmail?: string;
  /** Callback when customer is selected and linked */
  onCustomerLinked: (customerId: string, customerData: any) => void;
}

export const LinkCustomerModal: React.FC<LinkCustomerModalProps> = ({
  open,
  onClose,
  contactName,
  contactEmail,
  onCustomerLinked,
}) => {
  const { t } = useTranslation();
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isLinking, setIsLinking] = useState(false);

  const {
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    getRecentClients,
  } = useCustomerDropDownList({
    clientType: CLIENT_TYPE.CUSTOMER,
    shouldRenderOnMount: true,
    isUseRecoilState: false,
  });

  const handleCustomerChange = (event: any, value: any) => {
    setSelectedCustomer(value);
  };

  const handleLink = async () => {
    if (!selectedCustomer?.id) return;

    setIsLinking(true);
    try {
      // Call the parent callback with customer ID and data
      await onCustomerLinked(selectedCustomer.id, selectedCustomer);
      onClose();
    } catch (error) {
      console.error("Failed to link customer:", error);
    } finally {
      setIsLinking(false);
    }
  };

  const handleClose = () => {
    if (!isLinking) {
      setSelectedCustomer(null);
      onClose();
    }
  };

  const handleAddCustomer = (newCustomer: any) => {
    setSelectedCustomer(newCustomer);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 18 }}>
            Link Customer
          </Typography>
          <IconButton onClick={handleClose} size="small" disabled={isLinking}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Contact Info Display */}
        {(contactName || contactEmail) && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: colorTokens.neutral[50],
              borderRadius: 1,
              border: `1px solid ${colorTokens.semantic.border.default}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: colorTokens.semantic.text.secondary,
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                display: "block",
                mb: 0.5,
              }}
            >
              Contact
            </Typography>
            {contactName && (
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14 }}>
                {contactName}
              </Typography>
            )}
            {contactEmail && (
              <Typography
                variant="caption"
                sx={{ color: colorTokens.semantic.text.secondary, fontSize: 12 }}
              >
                {contactEmail}
              </Typography>
            )}
          </Box>
        )}

        {/* Customer Search */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.secondary,
              fontSize: 12,
              fontWeight: 600,
              display: "block",
              mb: 1,
            }}
          >
            Search and select a customer
          </Typography>
          <ClientAutocomplete
            clientType={CLIENT_TYPE.CUSTOMER}
            options={renderOptions()}
            onChangeTextField={checkWhatRenderArray}
            onChange={handleCustomerChange}
            onAddCustomer={handleAddCustomer}
            value={selectedCustomer}
            loading={isFetching}
            isFetching={isFetching}
            placeholder="Search for a customer..."
            defaultFiltering={false}
          />
        </Box>

        {selectedCustomer && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: colorTokens.primary[50],
              borderRadius: 1,
              border: `1px solid ${colorTokens.primary[200]}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: colorTokens.primary[700],
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                display: "block",
                mb: 0.5,
              }}
            >
              Selected Customer
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14 }}>
              {selectedCustomer.name}
            </Typography>
            {selectedCustomer.mail && (
              <Typography
                variant="caption"
                sx={{ color: colorTokens.semantic.text.secondary, fontSize: 12 }}
              >
                {selectedCustomer.mail}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isLinking} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleLink}
          disabled={!selectedCustomer || isLinking}
          variant="contained"
          color="primary"
        >
          {isLinking ? "Linking..." : "Link Customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
