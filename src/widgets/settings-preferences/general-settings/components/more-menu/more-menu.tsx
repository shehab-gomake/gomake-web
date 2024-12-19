import { MenuItem } from "@mui/material";
import { useMoreMenu } from "./use-more-menu";
import { OptionsButton } from "@/components/options-button/options-button";
import { useStyle } from "../style";

interface IGeneralSettingsMenuProps {
  preferenceItem: any;
  onClickEdit: (text: string) => void;
}
const GeneralSettingsMenu = ({
  preferenceItem,
  onClickEdit,
}: IGeneralSettingsMenuProps) => {
  const { menuList } = useMoreMenu({ preferenceItem, onClickEdit });
  const { classes } = useStyle();
  return (
    <OptionsButton>
      {menuList.map((item, index) => (
        <MenuItem
          style={classes.menuRowStyle}
          key={index}
          onClick={item.onclick}
        >
          {item.icon}
          <div style={classes.rowTextStyle}>{item.name}</div>
        </MenuItem>
      ))}
    </OptionsButton>
  );
};
export { GeneralSettingsMenu };
