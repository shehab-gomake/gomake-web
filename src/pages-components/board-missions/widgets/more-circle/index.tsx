import { MenuItem } from "@mui/material";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { OptionsButton } from "@/components/options-button/options-button";

interface IBoardMissionsProps {
  mission?: any;
  onClickDuplicate?: (mission?: any) => void;
  onClickLoggers?: () => void;
  onClickMarksAsDone?: (mission?: any, markAllReady?: boolean) => void;
  onClickReturnToProduction?: (mission?: any) => void;
  onClickOrderSummeryPdf?: (id: string) => void;
  onClickWorkMissionPdf?: (id: string, actionId: string, productType: string, productName: string) => void;
  onOpenModal?: (mission?: any) => void;
  onClickPrintPackagingSlip?: (mission?: any) => void;
  onClickMarksAsDoneForProductType?: (mission?: any) => void;
  isDoneJobs?: boolean;
  handleClickBackToProcess?: (mission?: any) => void;
  onOpenMarkReadyModalForHasJobs?: (mission?: any, markAllReady?: boolean) => void;
  printJobUsingPrintNode?: (jobId: string, productType?: string, productName?: string) => void;
  onOpenMarkReadyTypeModal?: (mission?: any) => void;
  onReportQualityIssue?: (mission?: any) => void;
}
const MoreMenuWidget = ({
  mission,
  onClickDuplicate,
  onClickLoggers,
  onClickMarksAsDone,
  onClickReturnToProduction,
  onClickOrderSummeryPdf,
  onClickWorkMissionPdf,
  onClickPrintPackagingSlip,
  onOpenModal,
  onClickMarksAsDoneForProductType,
  isDoneJobs,
  handleClickBackToProcess,
  onOpenMarkReadyModalForHasJobs,
  printJobUsingPrintNode,
  onOpenMarkReadyTypeModal,
  onReportQualityIssue
}: IBoardMissionsProps) => {
  const { classes } = useStyle();

  const handleClickEdit = (boardMissions) => {
    return `/products/edit?clientTypeId=${boardMissions.clientTypeId}&customerId=${boardMissions.customerID}&customerName=${boardMissions.clientName}&productId=${boardMissions.productID}&documentItemId=${boardMissions.orderItemId}&documentType=${1}&documentNumber=${boardMissions?.orderNumber}&documentId=${boardMissions.orderID}`;
  }
  const { t, menuList } = useMoreCircle({
    mission,
    onClickDuplicate,
    onClickLoggers,
    onClickMarksAsDone,
    onClickMarksAsDoneForProductType,
    onClickReturnToProduction,
    onClickOrderSummeryPdf,
    onClickWorkMissionPdf,
    onClickPrintPackagingSlip,
    onOpenModal,
    handleClickEdit,
    isDoneJobs,
    handleClickBackToProcess,
    onOpenMarkReadyModalForHasJobs,
    printJobUsingPrintNode,
    onOpenMarkReadyTypeModal,
    onReportQualityIssue
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
              <div style={classes.menuTitleStyle}>{item?.name}</div>
            </MenuItem>
          )
        ))}
      </OptionsButton>
    </>
  );
};

export { MoreMenuWidget };