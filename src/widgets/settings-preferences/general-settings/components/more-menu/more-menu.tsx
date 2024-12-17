import { MenuItem } from "@mui/material";
import { useMoreMenu } from "./use-more-menu";
import { OptionsButton } from "@/components/options-button/options-button";
import { useStyle } from "../style";

interface IGeneralSettingsMenuProps {
  name: string;
  onClickEdit: (text: string) => void;
}
const GeneralSettingsMenu = ({
  name,
  onClickEdit,
}: IGeneralSettingsMenuProps) => {
  const { menuList } = useMoreMenu({ name, onClickEdit });
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
