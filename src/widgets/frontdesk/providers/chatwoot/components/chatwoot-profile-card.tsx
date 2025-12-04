import React, { useMemo } from "react";
import { Box, Avatar, Typography, Chip, Divider } from "@mui/material";

import { useRecoilValue } from "recoil";
import {
  chatwootProfileAtom,
  chatwootProfileLoadingAtom,
  chatwootSelectedAccountAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import PersonIcon from "@mui/icons-material/Person";
import { generateUserAvatar } from "../utils/avatar.utils";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";

interface ChatwootProfileCardProps {
  isCollapsed?: boolean;
}

export const ChatwootProfileCard: React.FC<ChatwootProfileCardProps> = ({ isCollapsed = false }) => {
  const profile = useRecoilValue(chatwootProfileAtom);
  const profileLoading = useRecoilValue(chatwootProfileLoadingAtom);
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);

  const selectedAccount = profile?.accounts?.find((acc: any) => acc.id === selectedAccountId) || profile?.accounts?.[0];

  if (profileLoading || !profile) {
    return (
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${colorTokens.neutral[200]}`,
          backgroundColor: colorTokens.neutral[25],
        }}
      >
        {isCollapsed ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <PersonIcon sx={{ color: colorTokens.neutral[400], fontSize: 24 }} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: colorTokens.neutral[200] }}>
              <PersonIcon sx={{ color: colorTokens.neutral[500] }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: colorTokens.neutral[600], fontSize: "0.75rem" }}>
                Loading...
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  const displayName = profile.name || profile.available_name || profile.email || "Unknown User";
  const email = profile.email || "";
  
  // Generate avatar data using unified utility
  const avatarData = useMemo(() => generateUserAvatar(profile), [profile]);

  return (
    <Box
      sx={{
        p: isCollapsed ? 1.5 : 2,
        borderTop: `1px solid ${colorTokens.neutral[200]}`,
        backgroundColor: colorTokens.neutral[25],
      }}
    >
      {isCollapsed ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar
            src={avatarData.src}
            sx={{
              width: 36,
              height: 36,
              bgcolor: avatarData.backgroundColor,
              border: `2px solid ${colorTokens.neutral[200]}`,
              fontSize: "0.813rem",
              fontWeight: 600,
            }}
            alt={avatarData.displayName}
            title={avatarData.displayName}
          >
            {avatarData.initials}
          </Avatar>
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <Avatar
              src={avatarData.src}
              sx={{
                width: 40,
                height: 40,
                bgcolor: avatarData.backgroundColor,
                border: `2px solid ${colorTokens.neutral[200]}`,
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
              alt={avatarData.displayName}
              title={avatarData.displayName}
            >
              {avatarData.initials}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: colorTokens.neutral[900],
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </Typography>
              {email && (
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.neutral[600],
                    fontSize: "0.75rem",
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {email}
                </Typography>
              )}
            </Box>
          </Box>

          {selectedAccount && (
            <>
              <Divider sx={{ my: 1, borderColor: colorTokens.neutral[200] }} />
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.neutral[600],
                    fontSize: "0.688rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Account
                </Typography>
                <Chip
                  label={selectedAccount.name || `Account #${selectedAccount.id}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.688rem",
                    bgcolor: colorTokens.primary[50],
                    color: colorTokens.primary[700],
                    fontWeight: 500,
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              </Box>
              {selectedAccount.role && (
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colorTokens.neutral[500],
                      fontSize: "0.688rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedAccount.role}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

