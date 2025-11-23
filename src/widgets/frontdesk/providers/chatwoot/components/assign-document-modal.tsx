import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, CircularProgress, Divider, useTheme, Alert, Chip } from '@mui/material';
import { GoMakeModal, GomakePrimaryButton, GoMakeAutoComplate } from '@/components';
import { useTranslation } from 'react-i18next';
import { DOCUMENT_TYPE } from '@/pages-components/quotes/enums';
import { QuickActionConfig } from '@/widgets/frontdesk/providers/tickets/types/quick-actions.types';
import { getClientDocumentsApi } from '@/services/api-service/generic-doc/documents-api';
import { useGomakeAxios } from '@/hooks';
import { useDocumentTitle } from '@/pages-components/quote-new/use-document-title';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  DocumentListItem,
  DocumentApiResponse,
  DocumentAutocompleteOption,
} from '../types/document.types';

interface AssignDocumentModalProps {
  open: boolean;
  onClose: () => void;
  actionConfig: QuickActionConfig | null;
  customerId?: string;
  customerName?: string;
  onConnectToExisting: (documentId: string) => void;
  onCreateNew: () => void;
}

export const AssignDocumentModal: React.FC<AssignDocumentModalProps> = ({
  open,
  onClose,
  actionConfig,
  customerId,
  customerName,
  onConnectToExisting,
  onCreateNew,
}) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [selectedDocument, setSelectedDocument] = useState<DocumentAutocompleteOption | null>(null);
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { documentTitle } = useDocumentTitle(
    actionConfig?.documentType || DOCUMENT_TYPE.quote,
    false
  );

  // Check if customer ID is required for this document type
  const requiresCustomerId = actionConfig?.requiresCustomerId ?? false;
  const canConnectToExisting = requiresCustomerId ? !!customerId : true;

  // Fetch documents when modal opens
  const fetchDocuments = useCallback(async () => {
    if (!actionConfig?.documentType) return;

    // For documents that require customer ID, we need customerId
    if (requiresCustomerId && !customerId) {
      setDocuments([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const callBack = (res: DocumentApiResponse) => {
        if (res?.success) {
          // Filter documents by type
          const filteredDocs = (res.data || []).filter(
            (doc) => doc.documentType === actionConfig.documentType
          );
          setDocuments(filteredDocs);
          setError(null);
        } else {
          // API returned error
          setDocuments([]);
          setError(res.message || t('frontdesk.errorFetchingDocuments', {
            defaultValue: 'Failed to fetch documents'
          }));
        }
        setLoading(false);
      };

      // Only fetch if we have customerId (for customer-scoped documents)
      if (requiresCustomerId && customerId) {
        await getClientDocumentsApi(callApi, callBack, {
          documentType: actionConfig.documentType,
          clientId: customerId,
        });
      } else {
        // For purchase documents, we might need a different API endpoint
        // For now, set empty array
        setDocuments([]);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('[AssignDocumentModal] Error fetching documents:', err);
      setDocuments([]);
      setError(err.message || t('frontdesk.errorFetchingDocuments', {
        defaultValue: 'An error occurred while fetching documents'
      }));
      setLoading(false);
    }
  }, [actionConfig?.documentType, customerId, callApi, requiresCustomerId, t]);

  useEffect(() => {
    if (open && actionConfig?.documentType) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setSelectedDocument(null);
      setSearchTerm('');
      setError(null);
    }
  }, [open, actionConfig?.documentType, fetchDocuments]);

  // Format documents for autocomplete
  const documentOptions = useMemo((): DocumentAutocompleteOption[] => {
    if (!documents.length) return [];

    let filtered = documents;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = documents.filter(
        (doc) =>
          doc.number?.toLowerCase().includes(term) ||
          doc.client?.name?.toLowerCase().includes(term)
      );
    }

    return filtered.map((doc) => ({
      id: doc.id,
      label: `${doc.number || 'N/A'} - ${doc.client?.name || 'Unknown'}`,
      value: doc,
      documentNumber: doc.number,
      documentId: doc.id,
    }));
  }, [documents, searchTerm]);

  const handleConnect = () => {
    if (selectedDocument?.documentId) {
      onConnectToExisting(selectedDocument.documentId);
      onClose();
    }
  };

  const handleCreateNew = () => {
    onCreateNew();
    onClose();
  };

  const theme = useTheme();
  const modalTitle = actionConfig
    ? `${t('frontdesk.assignTo', { defaultValue: 'Assign to' })} ${documentTitle || actionConfig.label.replace('Assign to ', '')}`
    : 'Assign Document';

  return (
    <GoMakeModal
      openModal={open}
      modalTitle={modalTitle}
      onClose={onClose}
      insideStyle={{
        width: 650,
        maxWidth: '92vw',
        padding: '28px',
        borderRadius: '16px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Customer Info - Only show if customer exists */}
        {customerName && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2.5,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <PersonIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
                {t('frontdesk.customer', { defaultValue: 'Customer' })}
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ color: 'text.primary', fontSize: '1rem' }}>
                {customerName}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Connect to Existing Section */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: '10px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#FAFBFC',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LinkIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1rem',
                color: 'text.primary',
              }}
            >
              {t('frontdesk.connectToExisting', { defaultValue: 'Connect to existing' })} {documentTitle}
            </Typography>
          </Box>

          {error ? (
            <Alert
              severity="error"
              icon={<ErrorOutlineIcon />}
              sx={{ mb: 2 }}
              action={
                <GomakePrimaryButton
                  onClick={fetchDocuments}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  {t('frontdesk.retry', { defaultValue: 'Retry' })}
                </GomakePrimaryButton>
              }
            >
              <Typography variant="body2">{error}</Typography>
            </Alert>
          ) : loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 5 }}>
              <CircularProgress size={36} sx={{ color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5, fontSize: '0.875rem' }}>
                {t('frontdesk.loadingDocuments', { defaultValue: 'Loading documents...' })}
              </Typography>
            </Box>
          ) : !canConnectToExisting ? (
            <Box
              sx={{
                p: 3,
                borderRadius: '8px',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#FEE2E2'}`,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
                {t('frontdesk.customerRequired', { defaultValue: 'Customer must be linked to conversation first' })}
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ position: 'relative' }}>
                <GoMakeAutoComplate
                  options={documentOptions}
                  placeholder={t('frontdesk.searchDocuments', { defaultValue: 'Search documents...' })}
                  value={selectedDocument}
                  onChange={(
                    _e: React.SyntheticEvent,
                    value: DocumentAutocompleteOption | null
                  ) => {
                    setSelectedDocument(value);
                  }}
                  onInputChange={(_e: React.SyntheticEvent, value: string) => {
                    setSearchTerm(value || '');
                  }}
                  getOptionLabel={(option: DocumentAutocompleteOption) => option?.label || ''}
                  renderOption={(
                    props: React.HTMLAttributes<HTMLLIElement>,
                    option: DocumentAutocompleteOption
                  ) => (
                    <Box
                      component="li"
                      {...props}
                      key={option.id}
                      sx={{
                        py: 1.5,
                        px: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '8px',
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <DescriptionOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            fontSize: '0.9375rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {option.documentNumber || 'N/A'}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.8125rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                        >
                          {option.value.client?.name || 'Unknown Customer'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText={
                    searchTerm
                      ? t('frontdesk.noResultsFound', { defaultValue: 'No matching documents found' })
                      : t('frontdesk.startTypingToSearch', { defaultValue: 'Start typing to search...' })
                  }
                  loading={loading}
                  disabled={!canConnectToExisting || !!error}
                  style={{ width: '100%' }}
                />
                {!loading && documents.length > 0 && (
                  <Box
                    sx={{
                      mt: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                      {documentOptions.length} {documentOptions.length === 1 ? 'document' : 'documents'} available
                    </Typography>
                  </Box>
                )}
              </Box>

              {documents.length === 0 && !loading && canConnectToExisting && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2.5,
                    borderRadius: '8px',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F9FAFB',
                    textAlign: 'center',
                    border: `1px dashed ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    {requiresCustomerId 
                      ? t('frontdesk.noDocumentsFound', { defaultValue: 'No documents found for this customer' })
                      : t('frontdesk.connectToExistingNotAvailable', { defaultValue: 'Connecting to existing documents is not available for this document type' })
                    }
                  </Typography>
                </Box>
              )}

              {selectedDocument && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: '10px',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.08)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.3)' : 'rgba(33, 150, 243, 0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      backgroundColor: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, display: 'block', mb: 0.25, fontSize: '0.75rem' }}>
                      {t('frontdesk.selectedDocument', { defaultValue: 'Selected Document' })}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '0.9375rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {selectedDocument.documentNumber}
                    </Typography>
                  </Box>
                </Box>
              )}

              <GomakePrimaryButton
                onClick={handleConnect}
                disabled={!selectedDocument || !canConnectToExisting}
                startIcon={<LinkIcon />}
                sx={{
                  mt: selectedDocument ? 2 : 2.5,
                  width: '100%',
                  height: 48,
                  borderRadius: '10px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: selectedDocument ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                  '&:hover': {
                    boxShadow: selectedDocument ? '0 6px 16px rgba(0, 0, 0, 0.2)' : 'none',
                  },
                }}
              >
                {selectedDocument
                  ? t('frontdesk.linkDocument', { defaultValue: 'Link Document' })
                  : t('frontdesk.selectDocumentFirst', { defaultValue: 'Select a document to connect' })}
              </GomakePrimaryButton>
            </>
          )}
        </Box>

        {/* Divider */}
        <Box sx={{ position: 'relative', my: 1 }}>
          <Divider />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              px: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              {t('frontdesk.or', { defaultValue: 'OR' })}
            </Typography>
          </Box>
        </Box>

        {/* Create New Section */}
        <Box
          sx={{
            p: 3,
            borderRadius: '12px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#FAFBFC',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.05)' : 'rgba(33, 150, 243, 0.02)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.success.main,
              }}
            >
              <AddIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'text.primary',
                  lineHeight: 1.3,
                }}
              >
                {t('frontdesk.createNew', { defaultValue: 'Create new' })} {documentTitle}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.8125rem',
                  display: 'block',
                  mt: 0.25,
                }}
              >
                {customerName
                  ? t('frontdesk.createForCustomer', { defaultValue: 'Create for {{customer}}', customer: customerName })
                  : t('frontdesk.startFresh', { defaultValue: 'Start with a blank document' })}
              </Typography>
            </Box>
          </Box>
          <GomakePrimaryButton
            onClick={handleCreateNew}
            startIcon={<AddIcon />}
            sx={{
              width: '100%',
              height: 48,
              borderRadius: '10px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textTransform: 'none',
              backgroundColor: theme.palette.success.main,
              '&:hover': {
                backgroundColor: theme.palette.success.dark,
              },
            }}
          >
            {t('frontdesk.createNewDocument', { defaultValue: 'Create New Document' })}
          </GomakePrimaryButton>
        </Box>
      </Box>
    </GoMakeModal>
  );
};

