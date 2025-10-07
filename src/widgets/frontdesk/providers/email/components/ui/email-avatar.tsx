import React from "react";
import { Avatar, Badge, alpha } from "@mui/material";
import { Circle as CircleIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { getAvatarColor, getAccountInitials } from "@/widgets/frontdesk/utils";
import { getAvatarStyles } from "../../utils/styling-utils";

interface EmailAvatarProps {
  email: string;
  displayName?: string;
  size?: number;
  showStatus?: boolean;
  isActive?: boolean;
  isSelected?: boolean;
}

export const EmailAvatar: React.FC<EmailAvatarProps> = ({
  email,
  displayName,
  size = 32,
  showStatus = false,
  isActive = true,
  isSelected = false,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  const avatarColor = getAvatarColor(email);
  const initials = getAccountInitials(email, displayName);
  const avatarStyles = getAvatarStyles(size);

  const avatar = (
    <Avatar
      sx={{
        ...avatarStyles,
        backgroundColor: isSelected ? primaryColor(500) : avatarColor,
        color: "white",
      }}
    >
      {initials}
    </Avatar>
  );

  if (showStatus) {
    return (
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={isActive ? <CircleIcon sx={{ fontSize: 8, color: "success.main" }} /> : null}
      >
        {avatar}
      </Badge>
    );
  }

  return avatar;
};
