/**
 * Message Templates Tab
 * Displays and manages message templates
 */

import React, { useMemo } from 'react';
import { Box, Typography, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Edit as EditIcon, FileCopy as DuplicateIcon } from '@mui/icons-material';
import { Panel, PanelHeader, PanelContent, Button, SearchInput } from '@/widgets/frontdesk/design-system';
import { useMessageTemplates } from '../../hooks/use-message-templates';
import { PrimaryTable } from '@/components/tables/primary-table';

export const MessageTemplatesTab: React.FC = () => {
  const {
    templates,
    templateTypes,
    filters,
    isLoading,
    error,
    setFilters,
    openEditorModal,
    setAddGroupModalOpen,
  } = useMessageTemplates();

  // Helper function to parse HTML to plain text (clean)
  const getPlainText = (html: string): string => {
    if (!html) return '';
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    } catch (e) {
      return html; // Fallback to original if parsing fails
    }
  };

  // Format templates for table display
  const tableRows = useMemo(() => {
    // Filter templates by search query if provided
    const filteredTemplates = filters.searchQuery
      ? templates.filter((template) => {
          const searchLower = filters.searchQuery!.toLowerCase();
          const titleText = getPlainText(template.title || '');
          const bodyText = getPlainText(template.text || '');
          const typeText = templateTypes.find((t) => t.value === template.templateType)?.text || '';
          return (
            titleText.toLowerCase().includes(searchLower) ||
            bodyText.toLowerCase().includes(searchLower) ||
            typeText.toLowerCase().includes(searchLower)
          );
        })
      : templates;

    return filteredTemplates.map((template) => {
      const templateType = templateTypes.find((t) => t.value === template.templateType);

      return [
        // Type
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {templateType?.text || 'Unknown'}
        </Typography>,

        // Subject (clean text, no HTML)
        <Typography variant="body2" noWrap sx={{ maxWidth: '250px' }}>
          {getPlainText(template.title || '') || <em style={{ color: '#9CA3AF' }}>No subject</em>}
        </Typography>,

        // Body preview (clean text, truncated to 80 chars)
        <Typography variant="body2" noWrap sx={{ maxWidth: '400px', color: '#6B7280' }}>
          {(() => {
            const bodyText = getPlainText(template.text || '');
            return bodyText || <em style={{ color: '#9CA3AF' }}>No content</em>;
          })()}
        </Typography>,

        // Attachment
        template.attachment ? (
          <Typography variant="body2" sx={{ color: '#2563EB', fontWeight: 500 }}>
            {template.attachment}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: '#D1D5DB' }}>
            —
          </Typography>
        ),

        // Actions
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
          <Tooltip title="Edit template">
            <IconButton
              size="small"
              onClick={() => openEditorModal(template.id)}
              sx={{
                color: '#2563EB',
                '&:hover': {
                  backgroundColor: '#EFF6FF',
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Duplicate template">
            <IconButton
              size="small"
              onClick={() => {
                // TODO: Implement duplicate functionality
                console.log('Duplicate template:', template.id);
              }}
              sx={{
                color: '#6B7280',
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
              }}
            >
              <DuplicateIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>,
      ];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, templateTypes, filters.searchQuery, openEditorModal]);

  const tableHeaders = ['Type', 'Subject', 'Body', 'Attachment', 'Actions'];

  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      searchQuery: event.target.value,
    });
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error loading templates
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      {/* Header with search and actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          px: 2,
          pt: 2,
        }}
      >
        <SearchInput
          placeholder="Search templates..."
          value={filters.searchQuery || ''}
          onChange={handleSearchChange}
          onClear={() => setFilters({ ...filters, searchQuery: '' })}
          showClear={!!filters.searchQuery}
          sx={{ maxWidth: 400 }}
        />

        <Button
          variant="primary"
          onClick={() => setAddGroupModalOpen(true)}
          sx={{ minWidth: 140 }}
        >
          Add New Group
        </Button>
      </Box>

      {/* Templates table */}
      <Panel elevation={0} border="none" padding="none" sx={{ flex: 1, overflow: 'hidden' }}>
        <PanelContent padding="none" scrollable sx={{ height: '100%' }}>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
              }}
            >
              <CircularProgress />
            </Box>
          ) : templates.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
                gap: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No templates found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new template group to get started
              </Typography>
            </Box>
          ) : (
            <PrimaryTable
              stickyFirstCol={false}
              stickyHeader={true}
              rows={tableRows}
              headers={tableHeaders}
              maxHeight="calc(100vh - 280px)"
            />
          )}
        </PanelContent>
      </Panel>
    </Box>
  );
};
