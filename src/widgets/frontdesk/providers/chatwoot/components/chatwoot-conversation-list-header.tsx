import React, { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Stack,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { useChatwootTeams } from "../hooks/resources/use-chatwoot-teams";
import {
  ConversationStatus,
  ConversationAssigneeType,
  ConversationListParams,
  ConversationSortBy,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { chatwootConversationCountsAtom, chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { ChatwootConversationFilters } from "./chatwoot-conversation-filters";
import { ComposeConversationModal } from "./compose/ComposeConversationModal";

interface ChatwootConversationListHeaderProps {
  status?: ConversationStatus;
  filters?: Partial<ConversationListParams>;
  onFiltersChange?: (filters: Partial<ConversationListParams>) => void;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  onNextClick?: () => void;
  conversations?: any[];
  mineCount?: number;
  unassignedCount?: number;
  allCount?: number;
}

export const ChatwootConversationListHeader: React.FC<ChatwootConversationListHeaderProps> = ({
  status,
  filters = {},
  onFiltersChange = () => {},
  onFilterClick,
  onSortClick,
  onNextClick,
  conversations = [],
  mineCount,
  unassignedCount,
  allCount,
}) => {
  const theme = useTheme();
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);

  // Get counts from API response (stored in atom)
  const apiCounts = useRecoilValue(chatwootConversationCountsAtom);
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);

  // Fetch teams for team filter
  const { teams } = useChatwootTeams(accountId);

  // Local search state for immediate UI updates
  const [searchValue, setSearchValue] = useState(filters.q || "");
  const debouncedSearch = useDebouncedValue(searchValue, 300);

  // Apply debounced search to filters
  React.useEffect(() => {
    if (debouncedSearch !== filters.q) {
      onFiltersChange({ ...filters, q: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch]);

  // Use provided counts if available, otherwise use counts from API
  const counts = useMemo(() => {
    if (mineCount !== undefined && unassignedCount !== undefined && allCount !== undefined) {
      return { mine: mineCount, unassigned: unassignedCount, all: allCount };
    }
    return apiCounts;
  }, [mineCount, unassignedCount, allCount, apiCounts]);

  // Get current assignee type filter
  const currentAssigneeType = filters.assignee_type;

  // Get status label
  const getStatusLabel = (status?: ConversationStatus): string => {
    if (!status || status === ConversationStatus.ALL) return "All";
    const labels: Record<ConversationStatus, string> = {
      [ConversationStatus.OPEN]: "Open",
      [ConversationStatus.RESOLVED]: "Resolved",
      [ConversationStatus.PENDING]: "Pending",
      [ConversationStatus.SNOOZED]: "Snoozed",
      [ConversationStatus.ALL]: "All",
    };
    return labels[status] || "All";
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    let assignee_type: ConversationAssigneeType | undefined;

    if (newValue === "mine") {
      assignee_type = ConversationAssigneeType.ME;
    } else if (newValue === "unassigned") {
      assignee_type = ConversationAssigneeType.UNASSIGNED;
    } else if (newValue === "all") {
      assignee_type = ConversationAssigneeType.ALL;
    }

    onFiltersChange({ ...filters, assignee_type, page: 1 });
  };

  const getTabValue = (): string => {
    if (currentAssigneeType === ConversationAssigneeType.ME) return "mine";
    if (currentAssigneeType === ConversationAssigneeType.UNASSIGNED) return "unassigned";
    return "all";
  };

  return (
    <Box
      sx={{
        backgroundColor: neutralColor(25), // Light background
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Top Section: Title, Status Tag, Action Buttons */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 1.5,
          py: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              color: neutralColor(900),
            }}
          >
            Conversations
          </Typography>
          {status && status !== ConversationStatus.ALL && (
            <Chip
              label={getStatusLabel(status)}
              size="small"
              sx={{
                height: 24,
                fontSize: "0.75rem",
                fontWeight: 500,
                backgroundColor: neutralColor(100),
                color: neutralColor(700),
                border: `1px solid ${neutralColor(300)}`,
                "& .MuiChip-label": {
                  px: 1.5,
                },
              }}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={0.5}>
          {/* New Conversation Button */}
          <Tooltip title="New Conversation">
            <IconButton
              size="small"
              onClick={() => setShowComposeModal(true)}
              sx={{
                color: "white",
                backgroundColor: primaryColor(600),
                "&:hover": {
                  backgroundColor: primaryColor(700),
                },
                width: 32,
                height: 32,
              }}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Filter Button */}
          <Tooltip title="Filter">
            <IconButton
              size="small"
              onClick={(e) => {
                setFilterMenuAnchor(e.currentTarget);
                onFilterClick?.();
              }}
              sx={{
                color: neutralColor(600),
                backgroundColor: neutralColor(100),
                "&:hover": {
                  backgroundColor: neutralColor(200),
                },
                width: 32,
                height: 32,
              }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Filter Menu */}
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={() => setFilterMenuAnchor(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 280,
                backgroundColor: neutralColor(0),
                border: `1px solid ${neutralColor(200)}`,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                maxHeight: 500,
                overflow: "auto",
              },
            }}
          >
            {/* Team Filter */}
            <Box sx={{ px: 2, py: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.688rem",
                  fontWeight: 600,
                  color: neutralColor(500),
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Team
              </Typography>
            </Box>
            <MenuItem
              onClick={() => {
                onFiltersChange({ ...filters, team_id: undefined, page: 1 });
              }}
              sx={{
                py: 1,
                px: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: neutralColor(900),
                "&:hover": {
                  backgroundColor: neutralColor(100),
                },
              }}
            >
              <ListItemText
                primary="All Teams"
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: !filters.team_id ? 600 : 400,
                }}
              />
              {!filters.team_id && <CheckIcon sx={{ fontSize: 18, color: primaryColor(400) }} />}
            </MenuItem>
            {teams?.map((team) => {
              const isSelected = filters.team_id === team.id;
              return (
                <MenuItem
                  key={team.id}
                  onClick={() => {
                    onFiltersChange({ ...filters, team_id: team.id, page: 1 });
                  }}
                  sx={{
                    py: 1,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: neutralColor(900),
                    "&:hover": {
                      backgroundColor: neutralColor(100),
                    },
                  }}
                >
                  <ListItemText
                    primary={team.name || "Unknown Team"}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  />
                  {isSelected && <CheckIcon sx={{ fontSize: 18, color: primaryColor(400) }} />}
                </MenuItem>
              );
            })}

            <Divider sx={{ my: 1, borderColor: neutralColor(200) }} />

            {/* Status Filter */}
            <Box sx={{ px: 2, py: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.688rem",
                  fontWeight: 600,
                  color: neutralColor(500),
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Status
              </Typography>
            </Box>
            {[
              { label: "All", value: ConversationStatus.ALL },
              { label: "Open", value: ConversationStatus.OPEN },
              { label: "Resolved", value: ConversationStatus.RESOLVED },
              { label: "Pending", value: ConversationStatus.PENDING },
              { label: "Snoozed", value: ConversationStatus.SNOOZED },
            ].map((option) => {
              const isSelected =
                filters.status === option.value ||
                (Array.isArray(filters.status) && filters.status.includes(option.value));
              return (
                <MenuItem
                  key={option.value}
                  onClick={() => {
                    onFiltersChange({
                      ...filters,
                      status: option.value === ConversationStatus.ALL ? undefined : option.value,
                      page: 1,
                    });
                    setFilterMenuAnchor(null);
                  }}
                  sx={{
                    py: 1,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: neutralColor(900),
                    "&:hover": {
                      backgroundColor: neutralColor(100),
                    },
                  }}
                >
                  <ListItemText
                    primary={option.label}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  />
                  {isSelected && (
                    <CheckIcon sx={{ fontSize: 18, color: primaryColor(400) }} />
                  )}
                </MenuItem>
              );
            })}

            <Divider sx={{ my: 1, borderColor: neutralColor(200) }} />

            {/* Assignee Filter - Already handled by tabs, but keep for consistency */}
            <Box sx={{ px: 2, py: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.688rem",
                  fontWeight: 600,
                  color: neutralColor(500),
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Additional Filters
              </Typography>
            </Box>
          </Menu>

          {/* Sort Button */}
          <Tooltip title="Sort">
            <IconButton
              size="small"
              onClick={(e) => {
                setSortMenuAnchor(e.currentTarget);
                onSortClick?.();
              }}
              sx={{
                color: neutralColor(600),
                backgroundColor: neutralColor(100),
                "&:hover": {
                  backgroundColor: neutralColor(200),
                },
                width: 32,
                height: 32,
              }}
            >
              <SwapVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Sort Menu */}
          <Menu
            anchorEl={sortMenuAnchor}
            open={Boolean(sortMenuAnchor)}
            onClose={() => setSortMenuAnchor(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                backgroundColor: neutralColor(0),
                border: `1px solid ${neutralColor(200)}`,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Box sx={{ p: 1 }}>
              {[
                { label: "Last Activity (Newest)", value: ConversationSortBy.LAST_ACTIVITY_AT_DESC },
                { label: "Last Activity (Oldest)", value: ConversationSortBy.LAST_ACTIVITY_AT_ASC },
                { label: "Created (Newest)", value: ConversationSortBy.CREATED_AT_DESC },
                { label: "Created (Oldest)", value: ConversationSortBy.CREATED_AT_ASC },
              ].map((option) => (
                <Box
                  key={option.value}
                  onClick={() => {
                    onFiltersChange({ ...filters, sort_by: option.value });
                    setSortMenuAnchor(null);
                  }}
                  sx={{
                    px: 2,
                    py: 1,
                    cursor: "pointer",
                    color: filters.sort_by === option.value ? primaryColor(700) : neutralColor(900),
                    "&:hover": {
                      backgroundColor: neutralColor(100),
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    {option.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Menu>

          {/* Next/Navigation Button */}
          <Tooltip title="Next">
            <IconButton
              size="small"
              onClick={onNextClick}
              sx={{
                color: neutralColor(600),
                backgroundColor: neutralColor(100),
                "&:hover": {
                  backgroundColor: neutralColor(200),
                },
                width: 32,
                height: 32,
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Bottom Section: Filter Tabs */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          px: 1.5,
          py: 0.5,
        }}
      >
        <Tabs
          value={getTabValue()}
          onChange={handleTabChange}
          sx={{
            minHeight: "auto",
            "& .MuiTab-root": {
              minHeight: "auto",
              py: 0.25,
              px: 1.5,
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 400,
              color: neutralColor(600),
              "&.Mui-selected": {
                color: primaryColor(700),
                fontWeight: 500,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: primaryColor(500),
              height: 2,
            },
          }}
        >
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "inherit",
                  }}
                >
                  Mine
                </Typography>
                <Chip
                  label={counts.mine}
                  size="small"
                  sx={{
                    height: 18,
                    minWidth: 18,
                    fontSize: "0.688rem",
                    fontWeight: 500,
                    backgroundColor: getTabValue() === "mine" ? primaryColor(100) : neutralColor(100),
                    color: getTabValue() === "mine" ? primaryColor(700) : neutralColor(700),
                    "& .MuiChip-label": {
                      px: 0.75,
                      py: 0,
                    },
                  }}
                />
              </Stack>
            }
            value="mine"
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "inherit",
                  }}
                >
                  Unassigned
                </Typography>
                <Chip
                  label={counts.unassigned}
                  size="small"
                  sx={{
                    height: 18,
                    minWidth: 18,
                    fontSize: "0.688rem",
                    fontWeight: 500,
                    backgroundColor: getTabValue() === "unassigned" ? primaryColor(100) : neutralColor(100),
                    color: getTabValue() === "unassigned" ? primaryColor(700) : neutralColor(700),
                    "& .MuiChip-label": {
                      px: 0.75,
                      py: 0,
                    },
                  }}
                />
              </Stack>
            }
            value="unassigned"
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "inherit",
                  }}
                >
                  All
                </Typography>
                <Chip
                  label={counts.all}
                  size="small"
                  sx={{
                    height: 18,
                    minWidth: 18,
                    fontSize: "0.688rem",
                    fontWeight: 500,
                    backgroundColor: getTabValue() === "all" ? primaryColor(100) : neutralColor(100),
                    color: getTabValue() === "all" ? primaryColor(700) : neutralColor(700),
                    "& .MuiChip-label": {
                      px: 0.75,
                      py: 0,
                    },
                  }}
                />
              </Stack>
            }
            value="all"
          />
        </Tabs>
      </Box>

      {/* Search Bar - Below Filter Menu */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          px: 2,
          py: 1,
        }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder="Search conversations..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: neutralColor(400) }} />
              </InputAdornment>
            ),
            endAdornment: searchValue ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchValue("")} sx={{ padding: 0.5 }}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.875rem",
              backgroundColor: neutralColor(0),
            },
          }}
        />
      </Box>

      {/* Compose Conversation Modal */}
      <ComposeConversationModal
        open={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSuccess={(conversationId) => {
          console.log("[ChatwootConversationListHeader] Conversation created:", conversationId);
          // TODO: Navigate to the new conversation or refresh conversation list
        }}
      />
    </Box>
  );
};

