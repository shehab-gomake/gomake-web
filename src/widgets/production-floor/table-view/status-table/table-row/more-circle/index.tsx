import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { OptionsButton } from "@/components/options-button/options-button";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";

const MoreMenuWidget = ({ boardMission, onClickDone, onClickPrintJob, onClickPrintDTicket, onClickUnGroupJob }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { getMenuList } = useMoreCircle({ t, boardMission, onClickDone, onClickPrintJob, onClickPrintDTicket, onClickUnGroupJob });
  const menuList = getMenuList();

  return (
    <OptionsButton withCircle={false}>
      {menuList.map((item, index) => (
        item.condition && (
          <MenuItem
            style={classes.menuRowStyle}
            key={index}
            onClick={item.href ? undefined : item.onClick}
          >
            {item.href ? (
              <Link
                href={item.href}
                rel="noopener noreferrer"
                onClick={(e) => {
                  // Normal click: prevent navigation and execute onClick function
                  if (item.onClick && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    item.onClick();
                  }
                  // Right-click, Ctrl+Click, Cmd+Click will open in new tab naturally
                }}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  gap: 8,
                  color: "inherit",
                }}
              >
                {item.icon}
                <div style={classes.rowTextStyle}>{item.name}</div>
              </Link>
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