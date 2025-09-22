import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailAccount } from "../../types/email.types";
import { EmailAvatar } from "../ui/email-avatar";

interface AccountListItemProps {
  account: EmailAccount;
  isSelected: boolean;
  onSelect: (accountId: string) => void;
  children?: React.ReactNode;
}

export const AccountListItem: React.FC<AccountListItemProps> = ({ account, isSelected, onSelect, children }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  return (
    <ListItem
      disablePadding
      sx={{
        borderRadius: 1,
        mb: 0.5,
        mx: 1,
      }}
    >
      <ListItemButton
        selected={isSelected}
        onClick={() => onSelect(account.id)}
        sx={{
          borderRadius: 1,
          "&.Mui-selected": {
            backgroundColor: primaryColor(100),
            "&:hover": {
              backgroundColor: primaryColor(200),
            },
          },
          "&:hover": {
            backgroundColor: neutralColor(50),
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <EmailAvatar
            email={account.email}
            displayName={account.displayName}
            size={32}
            isSelected={isSelected}
          />
        </ListItemIcon>

        <ListItemText
          primary={
            <Typography
              variant="body2"
              sx={{
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? primaryColor(700) : neutralColor(700),
                fontSize: "0.875rem",
              }}
              noWrap
            >
              {account.displayName || account.email.split("@")[0]}
            </Typography>
          }
          secondary={
            <Typography
              variant="caption"
              sx={{
                color: isSelected ? primaryColor(600) : neutralColor(500),
                fontSize: "0.75rem",
              }}
              noWrap
            >
              {account.email}
            </Typography>
          }
        />
        {children}
      </ListItemButton>
    </ListItem>
  );
};
