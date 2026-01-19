import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { SettingsIcon } from "@/icons/settings";
import { useStyle } from "./style";

interface MenuAction {
  name: string;
  icon: JSX.Element;
  onClick: () => void;
}

interface ReportActionsMenuProps {
  actions: MenuAction[];
}

export const ReportActionsMenu = ({ actions }: ReportActionsMenuProps) => {
  const { classes, neutralColor } = useStyle();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleOpenMenu} size="small">
        <SettingsIcon stroke={neutralColor(600)} width={25} height={25} />
      </IconButton>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClick={handleCloseMenu}
        PaperProps={{
          style: {
            marginTop: 8,
          },
        }}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            style={classes.menuItemContainer}
            onClick={action.onClick}
          >
            <div style={classes.actionIconStyle}>{action.icon}</div>
            <div style={classes.rowTextStyle}>{action.name}</div>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
