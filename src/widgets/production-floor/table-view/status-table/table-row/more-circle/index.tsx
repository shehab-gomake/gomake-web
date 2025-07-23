import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OptionsButton } from "@/components/options-button/options-button";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";

const MoreMenuWidget = ({boardMission , onClickDone ,onClickPrintJob ,onClickPrintDTicket}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { getMenuList } = useMoreCircle({t, boardMission ,onClickDone , onClickPrintJob , onClickPrintDTicket});
  const menuList = getMenuList();
  
  return (
    <OptionsButton withCircle={false}>
      {menuList.map((item, index) => (
        item.condition && (
          <MenuItem style={classes.menuRowStyle} key={index} onClick={item.onClick}>
            {item.icon}
            <div style={classes.rowTextStyle}>{item.name}</div>
          </MenuItem>
        )
      ))}
    </OptionsButton>
  );
};

export { MoreMenuWidget };