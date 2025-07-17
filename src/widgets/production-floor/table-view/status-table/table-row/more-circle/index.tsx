import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OptionsButton } from "@/components/options-button/options-button";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { useState, useEffect } from "react";

const MoreMenuWidget = ({ boardMission, onClickDone, onClickPrintJob, onClickPrintDTicket }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { getMenuList } = useMoreCircle({ t, boardMission, onClickDone, onClickPrintJob, onClickPrintDTicket });
  const menuList = getMenuList();

  const [editUrl, setEditUrl] = useState(null);

  // Get the edit URL when component mounts
  useEffect(() => {
    const editMenuItem = menuList.find(item => item.isLink);
    if (editMenuItem && editMenuItem.getUrl) {
      editMenuItem.getUrl().then(url => {
        setEditUrl(url);
      }).catch(error => {
        console.error('Failed to get edit URL:', error);
      });
    }
  }, [boardMission?.id]);

  const handleEditClick = (e, item) => {
    // If it's a middle click or ctrl+click, let the browser handle it
    if (e.button === 1 || e.ctrlKey || e.metaKey) {
      return;
    }

    // For normal clicks, prevent default and use the onClick handler
    e.preventDefault();
    item.onClick();
  };

  return (
    <OptionsButton withCircle={false}>
      {menuList.map((item, index) => (
        item.condition && (
          <MenuItem
            style={classes.menuRowStyle}
            key={index}
            onClick={item.isLink ? undefined : item.onClick}
          >
            {item.isLink && editUrl ? (
              <a
                href={editUrl}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  width: '100%',
                  gap: 8,
                }}
                onClick={item.onClick}
              >
                {item.icon}
                <div style={classes.rowTextStyle}>{item.name}</div>
              </a>
            ) : (
              <>
                {item.icon}
                <div style={classes.rowTextStyle}>{item.name}</div>
              </>
            )}
          </MenuItem>
        )
      ))}
    </OptionsButton>
  );
};

export { MoreMenuWidget };