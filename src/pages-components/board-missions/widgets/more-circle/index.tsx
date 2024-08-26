import { MenuItem } from "@mui/material";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { OptionsButton } from "@/components/options-button/options-button";
import { useRouter } from "next/router";

interface IBoardMissionsProps {
  mission?: any;
  onClickDuplicate?: (mission?: any) => void;
  onClickLoggers?: () => void;
  onClickMarksAsDone?: (mission?: any) => void;
  onClickReturnToProduction?: (mission?: any) => void;
  onClickOrderSummeryPdf?: (id: string) => void;
  onClickWorkMissionPdf?: (id: string, actionId: string) => void;
  onOpenModal?: (mission?: any) => void;
  onClickPrintPackagingSlip?: (mission?: any) => void;
}
const MoreMenuWidget = ({ mission, onClickDuplicate, onClickLoggers, onClickMarksAsDone, onClickReturnToProduction, onClickOrderSummeryPdf, onClickWorkMissionPdf, onClickPrintPackagingSlip, onOpenModal }: IBoardMissionsProps) => {
  const { classes } = useStyle();
  const { push } = useRouter();
  const handleClickEdit = (boardMissions) => {
    push(`/products/edit?clientTypeId=${boardMissions.clientTypeId}&customerId=${boardMissions.customerID}&productId=${boardMissions.productID}&documentItemId=${boardMissions.orderItemId}&documentType=${1}&documentId=${boardMissions.id}`).then()
  }
  const { t, menuList } = useMoreCircle({
    mission,
    onClickDuplicate,
    onClickLoggers,
    onClickMarksAsDone,
    onClickReturnToProduction,
    onClickOrderSummeryPdf,
    onClickWorkMissionPdf,
    onClickPrintPackagingSlip,
    onOpenModal,
    handleClickEdit
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