import { EditingIcon } from "./icons/editing";
import { PDFIcon } from "./icons/pdf";
import { DoneIcon } from "./icons/done";
import { useRouter } from "next/router";
import { MachineIcon } from "./icons/machine-icon";
import { getBoardMissionDataForMenuApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { ExpandIcon } from "@/icons/expand-icon";
import { DotIcon, LeftArrowIcon, MoreCircleIcon, SearchIcon } from "@/icons";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";

const useMoreCircle = ({
  t,
  boardMission,
  onClickDone,
  onClickPrintJob,
  onClickPrintDTicket,
  onClickUnGroupJob,
}) => {
  const { push } = useRouter();
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const { CheckPermission } = useUserPermission();
  const hasPrintPackagingSlipPermission = CheckPermission(
    Permissions.ALLOW_PRINT_PACKAGING_SLIP_BEFORE_READY
  );

  const handleGetBoardMissionData = async (actionType) => {
    const callBack = (res) => {
      if (res.success) {
        const result = res?.data;
        if (actionType === "edit") {
          push(
            `/products/edit?clientTypeId=${result.clientTypeId}&customerId=${result.clientId
            }&customerName=${result.clientName}&productId=${result?.productId
            }&documentItemId=${result?.orderItemId
            }&documentType=${1}&documentNumber=${boardMission?.orderNumber
            }&documentId=${result.orderId}`
          ).then();
        }
        // if actionType === print
        else {
          onClickPrintDTicket({ ...boardMission, quantity: result?.quantity });
        }
      } else {
        alertFaultGetData();
      }
    };
    await getBoardMissionDataForMenuApi(callApi, callBack, {
      boardMissionId: boardMission?.id,
    });
  };

  const openJobModal = () => {
    push(
      `/production-floor?boardMissionsId=${boardMission?.id}&productType=${boardMission?.productType}&step=stations`
    ).then();
  };

  const getMenuList = () => {
    const openJobHref = `/production-floor?boardMissionsId=${boardMission?.id}&productType=${boardMission?.productType}&step=stations`;

    return [
      {
        condition: true,
        onClick: () => openJobModal(),
        href: openJobHref,
        icon: <SearchIcon width={17} height={17} stroke={"var(--theme-secondary-300, #8283BE)"} />,
        name: t("productionFloor.openJob"),
      },
      {
        condition: true,
        onClick: () => handleGetBoardMissionData("edit"),
        icon: <EditingIcon />,
        name: t("sales.quote.edit"),
      },
      {
        condition: true,
        onClick: () => onClickPrintJob(boardMission),
        icon: <MachineIcon />,
        name: t("productionFloor.printJob"),
      },
      {
        condition: boardMission?.hasRelatedJobs,
        onClick: () => onClickUnGroupJob(boardMission),
        icon: <EditingIcon />,
        name: t("productionFloor.unGroupJob"),
      },
      {
        condition: boardMission?.isReady || hasPrintPackagingSlipPermission,
        onClick: () => handleGetBoardMissionData("print"),
        icon: <PDFIcon />,
        name: t("productionFloor.printDeliverTicket"),
      },
      {
        condition: true,
        onClick: () => onClickDone(boardMission),
        icon: <DoneIcon />,
        name: t("boardMissions.done"),
      },
    ];
  };

  return {
    getMenuList,
  };
};

export { useMoreCircle };
