import React from "react";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ConversationItem } from "./provider-types";

interface ConversationListRowProps {
  item: ConversationItem;
  isSelected: boolean;
  density: 'comfortable' | 'compact';
  onSelect: (item: ConversationItem) => void;
  style?: React.CSSProperties;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const ConversationListRow = React.memo<ConversationListRowProps>(
  ({ item, isSelected, density, onSelect, style }) => {
    const { primaryColor, neutralColor, secondColor } = useGomakeTheme();

    const isCompact = density === 'compact';
    const avatarSize = isCompact ? 28 : 32;
    const paddingY = isCompact ? 0.75 : 1;

    return (
      <ListItem disableGutters sx={{ px: 0 }} style={style}>
        <ListItemButton
          sx={{
            borderRadius: 1,
            px: 1.5,
            py: paddingY,
            gap: 1,
            bgcolor: item.unread ? primaryColor(50) : "transparent",
            "&:hover": { bgcolor: primaryColor(100) },
            "&.Mui-selected": {
              bgcolor: primaryColor(100),
              boxShadow: `inset 3px 0 0 ${secondColor(500)}`,
            },
          }}
          selected={isSelected}
          onClick={() => onSelect(item)}
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                width: avatarSize,
                height: avatarSize,
                bgcolor: neutralColor(200),
                color: neutralColor(700),
                fontSize: isCompact ? '0.75rem' : '0.875rem'
              }}
            >
              {getInitials(item.from)}
            </Avatar>
          </ListItemAvatar>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            gap={1}
            sx={{ minWidth: 0 }}
          >
            <Stack spacing={isCompact ? 0.125 : 0.25} sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant={isCompact ? "caption" : "body2"}
                sx={{ fontWeight: item.unread ? 700 : 500 }}
                noWrap
              >
                {item.from}
              </Typography>
              <Typography
                variant={isCompact ? "caption" : "body2"}
                sx={{ color: "#475467", fontWeight: item.unread ? 600 : 400 }}
                noWrap
              >
                {item.subject}
              </Typography>
              {!isCompact && !!item.snippet && (
                <Typography variant="caption" sx={{ color: "#667085" }} noWrap>
                  {item.snippet}
                </Typography>
              )}
            </Stack>
            <Typography
              variant="caption"
              sx={{
                color: "#667085",
                whiteSpace: "nowrap",
                fontSize: isCompact ? '0.65rem' : '0.75rem'
              }}
            >
              {item.receivedAt}
            </Typography>
          </Stack>
        </ListItemButton>
      </ListItem>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.unread === nextProps.item.unread &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.density === nextProps.density
    );
  }
);

ConversationListRow.displayName = "ConversationListRow";