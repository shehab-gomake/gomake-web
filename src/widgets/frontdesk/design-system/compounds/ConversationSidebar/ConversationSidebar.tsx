import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  ArchiveOutlined,
} from '@mui/icons-material';
import { Panel, PanelHeader, PanelContent } from '../Panel';

export type ConversationFilterType = 'active' | 'archived';

export interface ConversationSidebarProps {
  /**
   * Title to display in the header
   * @default "Conversations"
   */
  title?: string;

  /**
   * Current filter type
   */
  filter?: ConversationFilterType;

  /**
   * Callback when filter changes
   */
  onFilterChange?: (filter: ConversationFilterType) => void;

  /**
   * Callback when search button is clicked
   */
  onSearch?: () => void;

  /**
   * Callback when new conversation button is clicked
   */
  onNewConversation?: () => void;

  /**
   * Custom actions to add to the header
   */
  customActions?: React.ReactNode;

  /**
   * Content to display (typically a conversation list)
   */
  children: React.ReactNode;

  /**
   * Width of the sidebar
   * @default 280
   */
  width?: number;

  /**
   * Whether to show the archive filter toggle
   * @default true
   */
  showArchiveFilter?: boolean;
}

/**
 * ConversationSidebar
 *
 * Sidebar component for displaying conversation lists with header actions.
 * Includes search, new conversation, and archive filter controls.
 *
 * @example
 * ```tsx
 * <ConversationSidebar
 *   title="Direct Messages"
 *   filter="active"
 *   onFilterChange={setFilter}
 *   onSearch={handleSearch}
 *   onNewConversation={handleNew}
 * >
 *   <ConversationList conversations={conversations} />
 * </ConversationSidebar>
 * ```
 */
export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  title = 'Conversations',
  filter = 'active',
  onFilterChange,
  onSearch,
  onNewConversation,
  customActions,
  children,
  width = 280,
  showArchiveFilter = true,
}) => {
  const handleArchiveToggle = () => {
    if (onFilterChange) {
      onFilterChange(filter === 'archived' ? 'active' : 'archived');
    }
  };

  return (
    <div style={{ width, minWidth: width, height: '100%' }}>
      <Panel
        elevation={0}
        border="default"
        sx={{
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PanelHeader
          title={title}
          actions={
            <>
              {onSearch && (
                <Tooltip title="Search conversations">
                  <IconButton size="small" onClick={onSearch}>
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {onNewConversation && (
                <Tooltip title="Start new conversation">
                  <IconButton size="small" onClick={onNewConversation}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {showArchiveFilter && onFilterChange && (
                <Tooltip
                  title={
                    filter === 'archived'
                      ? 'Show active conversations'
                      : 'Show archived conversations'
                  }
                >
                  <IconButton
                    size="small"
                    onClick={handleArchiveToggle}
                    sx={{
                      color: filter === 'archived' ? 'primary.main' : 'inherit',
                    }}
                  >
                    <ArchiveOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {customActions}
            </>
          }
        />

        <PanelContent padding="none" scrollable sx={{ flex: 1 }}>
          {children}
        </PanelContent>
      </Panel>
    </div>
  );
};