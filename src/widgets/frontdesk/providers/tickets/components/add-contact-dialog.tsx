import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useDebounce } from 'use-debounce';
import { getAndSetCustomerById } from '@/services/api-service/customers/customers-api';
import { useGomakeAxios } from '@/hooks/use-gomake-axios';
import type { CustomerSearchResult, Contact } from '../types/customer.types';
import { CLIENT_TYPE } from '@/pages/customers/enums';
import { ContactForm } from '@/widgets/customer-card-modal/components/contacts-tab/form';

interface AddContactDialogProps {
  open: boolean;
  onClose: () => void;
  contactData: {
    name: string;
    email?: string;
    phone?: string;
  };
  onContactAdded?: (customerId: string) => void;
}

export const AddContactDialog: React.FC<AddContactDialogProps> = ({
  open,
  onClose,
  contactData,
  onContactAdded,
}) => {
  const { callApi } = useGomakeAxios();
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [customers, setCustomers] = useState<CustomerSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSearchResult | null>(null);
  const [contactFormData, setContactFormData] = useState<Partial<Contact>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search customers
  React.useEffect(() => {
    if (!open) return;

    const searchCustomers = async () => {
      setLoading(true);
      try {
        // Search both clients and suppliers
        const searchClient = async (clientType: 'C' | 'S') => {
          const result = await callApi("GET", "/v1/customers/get-customers-pagination", {
            clientType,
            pageNumber: 1,
            pageSize: 20,
            name: debouncedQuery || '',
            isActive: true
          }, false);

          const dataContainer = result?.data?.data?.data || result?.data?.data || {};
          const list = dataContainer.data || dataContainer || [];

          return (Array.isArray(list) ? list : []).map((c: any) => ({
            id: c.id || c._id,
            name: c.name,
            mail: c.mail,
            phone: c.phone,
            type: clientType
          }));
        };

        const [clients, suppliers] = await Promise.all([
          searchClient('C'),
          searchClient('S'),
        ]);
        setCustomers([...clients, ...suppliers]);
      } catch (err) {
        console.error('Error searching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    searchCustomers();
  }, [debouncedQuery, open]);

  // Prefill contact form data
  React.useEffect(() => {
    if (step === 'form') {
      // Split name into first and last name
      const nameParts = (contactData.name || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setContactFormData({
        firstName,
        lastName,
        mail: contactData.email || '',
        phone: contactData.phone || '',
      });
    }
  }, [step, contactData]);

  const handleCustomerSelect = (customer: CustomerSearchResult | null) => {
    setSelectedCustomer(customer);
  };

  const handleNext = () => {
    if (selectedCustomer) {
      setStep('form');
      setError(null);
    }
  };

  const handleBack = () => {
    setStep('select');
    setError(null);
  };

  const handleSaveContact = async () => {
    if (!selectedCustomer || !contactFormData.firstName) {
      setError('Please fill in required fields');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // First, fetch the existing customer
      const getCustomerPromise = new Promise<any>((resolve, reject) => {
        const callback = (res: any) => {
          if (res?.success) {
            resolve(res.data);
          } else {
            reject(new Error('Customer not found'));
          }
        };
        getAndSetCustomerById(callApi, callback, { customerId: selectedCustomer.id });
      });

      const existingCustomer = await getCustomerPromise;

      // Update customer with new contact
      const updatedCustomer = {
        ...existingCustomer,
        contacts: [...(existingCustomer.contacts || []), contactFormData]
      };

      const updateResult = await callApi("PUT", "/v1/customers/update-customer", {
        customer: updatedCustomer
      }, false);

      if (updateResult?.success) {
        if (onContactAdded) {
          onContactAdded(selectedCustomer.id);
        }
        // Reset and close
        handleClose();
      } else {
        setError('Failed to add contact');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add contact');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setStep('select');
    setSearchQuery('');
    setSelectedCustomer(null);
    setContactFormData({});
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {step === 'select' ? 'Select Customer' : 'Add Contact Information'}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {step === 'select' && (
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Search for an existing client or supplier to add this contact to:
            </Typography>

            <Autocomplete
              options={customers}
              loading={loading}
              value={selectedCustomer}
              onChange={(_, value) => handleCustomerSelect(value)}
              onInputChange={(_, value) => setSearchQuery(value)}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.type === 'C' ? 'Client' : 'Supplier'} • {option.mail || option.phone || 'No contact'}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search customers"
                  placeholder="Type to search..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
        )}

        {step === 'form' && selectedCustomer && (
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Adding contact to: <strong>{selectedCustomer.name}</strong>
            </Alert>

            <ContactForm
              contact={contactFormData as any}
              onDelete={() => {}}
              setContact={setContactFormData}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>

        {step === 'select' && (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={!selectedCustomer}
          >
            Next
          </Button>
        )}

        {step === 'form' && (
          <>
            <Button onClick={handleBack} disabled={saving}>
              Back
            </Button>
            <Button
              onClick={handleSaveContact}
              variant="contained"
              disabled={saving || !contactFormData.firstName}
            >
              {saving ? <CircularProgress size={20} /> : 'Save Contact'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
