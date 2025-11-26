/**
 * Conversation Labels Filter Menu
 *
 * Button with dropdown menu that displays labels with show_on_sidebar enabled
 * and allows filtering conversations by labels.
 * Uses the unified list system for consistent UI.
 *
 * @deprecated Use LabelSelect from unified-list directly for new implementations.
 */

import React, { useState, useCallback } from 'react';
import { useChatwootLabels } from '../../hooks/use-chatwoot-labels';
import { useChatwootPermissions } from '../../hooks/use-chatwoot-permissions';
import { SETTINGS_PERMISSIONS } from '../../constants/permissions.constants';
import { AddEditLabelModal } from '../settings/add-edit-label-modal';
import { LabelSelect } from '../unified-list';
import type { Label } from '../unified-list';
import type { ConversationListParams } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import type { CreateLabelPayload } from '@/services/frontdesk/api/chatwoot';

interface ConversationLabelsFilterProps {
  accountId: number | null;
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
  onLabelClick?: () => void;
  primaryColor: (shade: number) => string;
  neutralColor: (shade: number) => string;
}

export const ConversationLabelsFilter: React.FC<ConversationLabelsFilterProps> = ({
  accountId,
  filters,
  onFiltersChange,
  onLabelClick,
}) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { labels: allLabels = [], loading: labelsLoading, createLabel } = useChatwootLabels(
    accountId ?? undefined,
    !!accountId
  );
  const { canAccess } = useChatwootPermissions();

  // Check if user can manage labels (admin only)
  const canManageLabels = canAccess(SETTINGS_PERMISSIONS.labels);

  // Get currently selected labels from filters (ensure it's always an array)
  const selectedLabels: string[] = Array.isArray(filters.labels)
    ? filters.labels
    : filters.labels
    ? [filters.labels]
    : [];

  // Convert labels to the format expected by LabelSelect
  const labelsForSelect: Label[] = (Array.isArray(allLabels) ? allLabels : []).map((label) => ({
    id: label.id,
    title: label.title,
    color: label.color,
    description: label.description,
    show_on_sidebar: label.show_on_sidebar,
  }));

  // Handle label selection
  const handleLabelSelect = useCallback(
    (titles: string[], _labels: Label[]) => {
      onLabelClick?.();
      onFiltersChange({
        ...filters,
        labels: titles.length > 0 ? titles : undefined,
        page: 1, // Reset to first page when filters change
      });
    },
    [filters, onFiltersChange, onLabelClick]
  );

  // Handle create label
  const handleCreateLabel = async (payload: CreateLabelPayload) => {
    try {
      await createLabel(payload);
      setCreateModalOpen(false);
    } catch (error) {
      console.error('[ConversationLabelsFilter] Failed to create label:', error);
    }
  };

  // Don't render if no sidebar labels and user can't create new ones
  const sidebarLabels = labelsForSelect.filter((label) => label.show_on_sidebar === true);
  if (sidebarLabels.length === 0 && !canManageLabels) {
    return null;
  }

  return (
    <>
      <LabelSelect
        selectedLabels={selectedLabels}
        labels={labelsForSelect}
        onSelect={handleLabelSelect}
        loading={labelsLoading}
        sidebarOnly
        canCreate={canManageLabels}
        onCreateClick={() => setCreateModalOpen(true)}
        headerText="Filter by Labels (AND)"
        emptyText={
          canManageLabels
            ? 'Create a label and enable "Show on sidebar"'
            : 'No labels available'
        }
      />

      {/* Create Label Modal - Admin Only */}
      {canManageLabels && (
        <AddEditLabelModal
          open={createModalOpen}
          label={null}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateLabel}
          onUpdate={async () => {}} // Not used for creation
          loading={labelsLoading}
        />
      )}
    </>
  );
};
