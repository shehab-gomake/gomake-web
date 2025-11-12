/**
 * WebSocket Events Log Component
 *
 * Displays real-time WebSocket events with filtering and search capabilities.
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { ChatwootWebSocketEvent } from '@/store/frontdesk/atoms/chatwoot.atoms';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface WebSocketEventsLogProps {
  events: ChatwootWebSocketEvent[];
  onClearEvents: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

export const WebSocketEventsLog: React.FC<WebSocketEventsLogProps> = ({
  events,
  onClearEvents,
  onExportJSON,
  onExportCSV,
}) => {
  const theme = useTheme();
  const logEndRef = useRef<HTMLDivElement>(null);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventTypes, setSelectedEventTypes] = useState<Set<string>>(new Set());
  const [autoScroll, setAutoScroll] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);

  // Get unique event types
  const eventTypes = useMemo(() => {
    const types = new Set(events.map(e => e.event));
    return Array.from(types).sort();
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesEvent = event.event.toLowerCase().includes(query);
        const matchesData = JSON.stringify(event.data).toLowerCase().includes(query);
        if (!matchesEvent && !matchesData) {
          return false;
        }
      }

      // Filter by event type
      if (selectedEventTypes.size > 0 && !selectedEventTypes.has(event.event)) {
        return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedEventTypes]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredEvents, autoScroll]);

  // Event type colors
  const getEventTypeColor = (eventType: string): string => {
    if (eventType.startsWith('message')) return '#10b981'; // Green
    if (eventType.startsWith('conversation')) return '#3b82f6'; // Blue
    if (eventType.startsWith('notification')) return '#f59e0b'; // Yellow
    if (eventType.includes('typing') || eventType.includes('presence')) return '#8b5cf6'; // Purple
    if (eventType.includes('error')) return '#ef4444'; // Red
    return '#6b7280'; // Gray
  };

  // Toggle event expansion
  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  // Toggle event type filter
  const toggleEventTypeFilter = (eventType: string) => {
    setSelectedEventTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventType)) {
        newSet.delete(eventType);
      } else {
        newSet.add(eventType);
      }
      return newSet;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedEventTypes(new Set());
  };

  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: theme.shadows[1],
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, p: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              color: colorTokens.neutral[900],
            }}
          >
            Event Log
            {filteredEvents.length !== events.length && (
              <Chip
                label={`${filteredEvents.length} of ${events.length}`}
                size="small"
                sx={{
                  ml: 1,
                  height: 20,
                  fontSize: '0.75rem',
                  backgroundColor: colorTokens.neutral[100],
                }}
              />
            )}
          </Typography>

          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Filter events">
              <IconButton
                size="small"
                onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                sx={{
                  color: selectedEventTypes.size > 0 ? theme.palette.primary.main : colorTokens.neutral[600],
                }}
              >
                <FilterListIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export events">
              <IconButton
                size="small"
                onClick={(e) => setExportMenuAnchor(e.currentTarget)}
                disabled={events.length === 0}
              >
                <FileDownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Clear log">
              <IconButton
                size="small"
                onClick={onClearEvents}
                disabled={events.length === 0}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Divider />

        {/* Search and Controls */}
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 0.5, color: colorTokens.neutral[400] }} />,
            }}
            sx={{ flex: 1 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                Auto-scroll
              </Typography>
            }
          />
        </Stack>

        {/* Active Filters */}
        {(searchQuery || selectedEventTypes.size > 0) && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: colorTokens.neutral[600] }}>
              Filters:
            </Typography>
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                size="small"
                onDelete={() => setSearchQuery('')}
                sx={{ height: 24, fontSize: '0.75rem' }}
              />
            )}
            {Array.from(selectedEventTypes).map(type => (
              <Chip
                key={type}
                label={type}
                size="small"
                onDelete={() => toggleEventTypeFilter(type)}
                sx={{ height: 24, fontSize: '0.75rem' }}
              />
            ))}
            <Button
              size="small"
              onClick={clearFilters}
              sx={{ textTransform: 'none', fontSize: '0.75rem', minWidth: 'auto', p: 0.5 }}
            >
              Clear all
            </Button>
          </Box>
        )}

        {/* Events List */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            border: `1px solid ${colorTokens.neutral[200]}`,
            borderRadius: 1,
            backgroundColor: colorTokens.neutral[50],
          }}
        >
          {filteredEvents.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 3,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: colorTokens.neutral[400],
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}
              >
                {events.length === 0 ? 'No events yet. Connect to start receiving events.' : 'No events match the current filters.'}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 1.5 }}>
              <Stack spacing={1}>
                {filteredEvents.map((event) => {
                  const isExpanded = expandedEvents.has(event.id);
                  const eventColor = getEventTypeColor(event.event);

                  return (
                    <Box
                      key={event.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${colorTokens.neutral[200]}`,
                        '&:hover': {
                          borderColor: colorTokens.neutral[300],
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleEventExpansion(event.id)}
                      >
                        <IconButton size="small" sx={{ mt: -0.5 }}>
                          {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                        </IconButton>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.75rem',
                                color: colorTokens.neutral[500],
                                fontFamily: 'monospace',
                              }}
                            >
                              {formatTime(event.timestamp)}
                            </Typography>
                            <Chip
                              label={event.event}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                backgroundColor: `${eventColor}20`,
                                color: eventColor,
                                border: `1px solid ${eventColor}`,
                              }}
                            />
                          </Box>

                          {isExpanded && (
                            <Box
                              sx={{
                                mt: 1,
                                p: 1.5,
                                borderRadius: 1,
                                backgroundColor: colorTokens.neutral[50],
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                                overflow: 'auto',
                                maxHeight: 300,
                              }}
                            >
                              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {JSON.stringify(event.data, null, 2)}
                              </pre>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={logEndRef} />
              </Stack>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
      >
        <MenuItem disabled>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Event Types
          </Typography>
        </MenuItem>
        <Divider />
        {eventTypes.map(type => (
          <MenuItem key={type} onClick={() => toggleEventTypeFilter(type)}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedEventTypes.has(type)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {type}
                </Typography>
              }
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={() => setExportMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            onExportJSON();
            setExportMenuAnchor(null);
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Export as JSON
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onExportCSV();
            setExportMenuAnchor(null);
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Export as CSV
          </Typography>
        </MenuItem>
      </Menu>
    </Card>
  );
};
