import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import { getAndSetCustomerById } from '@/services/api-service/customers/customers-api';
import { useGomakeAxios } from '@/hooks/use-gomake-axios';
import { useCustomerEdit } from '@/hooks/use-customer-edit';
import type { Customer } from '../types/customer.types';
import { CustomerCardWidget } from '@/widgets/customer-card-modal';
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from '@/pages/customers/enums';
import { AddContactDialog } from './add-contact-dialog';

interface CustomerProfileSectionProps {
  customerId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  onCustomerLinked?: (customerId: string) => void;
}

export const CustomerProfileSection: React.FC<CustomerProfileSectionProps> = ({
  customerId,
  customerName,
  customerEmail,
  customerPhone,
  onCustomerLinked,
}) => {
  const theme = useTheme();
  const { callApi } = useGomakeAxios();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [clientType, setClientType] = useState<CLIENT_TYPE>(CLIENT_TYPE.CUSTOMER);
  const [openAddContactDialog, setOpenAddContactDialog] = useState(false);

  // Hook for opening customer modal
  const { showCustomerModal, customerForEdit, getCustomerForEdit, closeModal, setCustomerForEdit } = useCustomerEdit();

  // Fetch customer if customerId exists
  useEffect(() => {
    if (customerId) {
      loadCustomer(customerId);
    }
  }, [customerId]);

  const loadCustomer = async (id: string) => {
    setLoading(true);
    try {
      const callback = (res: any) => {
        if (res?.success) {
          setCustomer(res.data);
        }
        setLoading(false);
      };

      await getAndSetCustomerById(callApi, callback, { customerId: id });
    } catch (error) {
      console.error('Error loading customer:', error);
      setLoading(false);
    }
  };

  const handleCreateCustomer = (type: CLIENT_TYPE) => {
    setClientType(type);
    setOpenCreateModal(true);
  };

  const handleCustomerCreated = (newCustomer: any) => {
    if (newCustomer?.id && onCustomerLinked) {
      onCustomerLinked(newCustomer.id);
      setCustomer(newCustomer);
    }
    setOpenCreateModal(false);
  };

  const handleContactAdded = (selectedCustomerId: string) => {
    if (onCustomerLinked) {
      onCustomerLinked(selectedCustomerId);
      loadCustomer(selectedCustomerId);
    }
    setOpenAddContactDialog(false);
  };

  // Prepare prefilled data for new customer
  const prefillCustomerData = {
    name: customerName || '',
    mail: customerEmail || '',
    phone: customerPhone || '',
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  // Show full customer profile if customerId exists
  if (customerId && customer) {
    return (
      <>
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.secondary,
              mb: 1,
              display: 'block',
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: 10,
            }}
          >
            Customer Profile
          </Typography>
          <Box
            onClick={() => getCustomerForEdit(customerId)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              backgroundColor: colorTokens.neutral[50],
              borderRadius: '6px',
              border: `1px solid ${colorTokens.semantic.border.default}`,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: colorTokens.neutral[100],
              },
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: colorTokens.primary[500] }}>
              {customer.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
                {customer.name}
              </Typography>
              <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 11 }}>
                {customer.mail || customer.phone || 'No contact info'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Customer Edit Modal */}
        <CustomerCardWidget
          customerAction={CUSTOMER_ACTIONS.Edit}
          typeClient={customer.type === 'S' ? CLIENT_TYPE.SUPPLIER : CLIENT_TYPE.CUSTOMER}
          openModal={showCustomerModal}
          onClose={closeModal}
          customer={customerForEdit}
          setCustomer={setCustomerForEdit}
        />
      </>
    );
  }

  // Show create/link options if no customerId
  return (
    <>
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: colorTokens.semantic.text.secondary,
            mb: 1,
            display: 'block',
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: 10,
          }}
        >
          Customer Information
        </Typography>

        {/* Basic Info Card */}
        <Box
          sx={{
            p: 1.5,
            backgroundColor: colorTokens.neutral[50],
            borderRadius: '6px',
            border: `1px solid ${colorTokens.semantic.border.default}`,
            mb: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: colorTokens.neutral[400] }}>
              {customerName?.charAt(0).toUpperCase() || '?'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
                {customerName || 'Unknown Customer'}
              </Typography>
              <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 11 }}>
                {customerEmail || customerPhone || 'No contact info'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.secondary,
              fontSize: 11,
              display: 'block',
              mb: 1.5,
            }}
          >
            This customer is not linked to your system. Choose an action:
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<BusinessIcon sx={{ fontSize: 16 }} />}
              onClick={() => handleCreateCustomer(CLIENT_TYPE.CUSTOMER)}
              sx={{
                textTransform: 'none',
                justifyContent: 'flex-start',
                fontSize: 12,
                py: 0.75,
              }}
            >
              Create as Client
            </Button>

            <Button
              size="small"
              variant="outlined"
              startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
              onClick={() => handleCreateCustomer(CLIENT_TYPE.SUPPLIER)}
              sx={{
                textTransform: 'none',
                justifyContent: 'flex-start',
                fontSize: 12,
                py: 0.75,
              }}
            >
              Create as Supplier
            </Button>

            <Button
              size="small"
              variant="outlined"
              startIcon={<ContactMailIcon sx={{ fontSize: 16 }} />}
              onClick={() => setOpenAddContactDialog(true)}
              sx={{
                textTransform: 'none',
                justifyContent: 'flex-start',
                fontSize: 12,
                py: 0.75,
              }}
            >
              Add as Contact to Existing
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Customer Card Modal for Creating New Customer */}
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Add}
        codeFlag={false}
        typeClient={clientType}
        onCustomerAdd={handleCustomerCreated}
        openModal={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        customer={prefillCustomerData}
        setCustomer={() => {}}
      />

      {/* Add Contact Dialog */}
      <AddContactDialog
        open={openAddContactDialog}
        onClose={() => setOpenAddContactDialog(false)}
        contactData={{
          name: customerName || '',
          email: customerEmail || '',
          phone: customerPhone || '',
        }}
        onContactAdded={handleContactAdded}
      />
    </>
  );
};
