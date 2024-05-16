import { MenuItem } from "@mui/material";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { OptionsButton } from "@/components/options-button/options-button";

interface IBoardMissionsProps {
  mission?: any;
  onClickDuplicate?: (mission?: any) => void;
  onClickLoggers?: () => void;
    onClickMarksAsDone?: (mission?: any) => void;
    onClickReturnToProduction?: (mission?: any) => void;
  onClickOrderSummeryPdf?:(id : string)=>void;
  onClickWorkMissionPdf?:(id : string)=>void;
  onOpenModal?:(mission?: any) => void;
  onClickPrintPackagingSlip?:(mission?: any) => void;
} 
const MoreMenuWidget = ({ mission, onClickDuplicate, onClickLoggers , onClickMarksAsDone , onClickReturnToProduction , onClickOrderSummeryPdf ,onClickWorkMissionPdf, onClickPrintPackagingSlip ,onOpenModal}: IBoardMissionsProps) => {
  const { classes } = useStyle();
  const { t, menuList } = useMoreCircle({
    mission,
    onClickDuplicate,
    onClickLoggers,
    onClickMarksAsDone,
    onClickReturnToProduction,
    onClickOrderSummeryPdf,
    onClickWorkMissionPdf,
    onClickPrintPackagingSlip,
    onOpenModal
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