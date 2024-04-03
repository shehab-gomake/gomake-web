import { MenuItem } from "@mui/material";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { OptionsButton } from "@/components/options-button/options-button";

interface IBoardMissionsProps {
  mission?: any;
  onClickDuplicate?: (mission?: any) => void;
  onClickLoggers?: () => void;
  onClickMarksAsDone?:()=>void;
  onClickReturnToProduction?:()=>void;
}
const MoreMenuWidget = ({ mission, onClickDuplicate, onClickLoggers , onClickMarksAsDone , onClickReturnToProduction}: IBoardMissionsProps) => {
  const { classes } = useStyle();
  const { t , menuList} = useMoreCircle({
    mission,
    onClickDuplicate,
    onClickLoggers,
    onClickMarksAsDone,
    onClickReturnToProduction
  });

  return (
    <>
      <OptionsButton>
        {menuList.map((item, index) => (
          item.condition && (
            <MenuItem
              style={classes.menuItemContainer}
              key={index}
              onClick={item?.onclick}
            >
              {item?.icon}
              <div style={classes.menuTitleStyle}>{t(item?.name)}</div>
            </MenuItem>
          )
        ))}
      </OptionsButton>
    </>
  );
};

export { MoreMenuWidget };