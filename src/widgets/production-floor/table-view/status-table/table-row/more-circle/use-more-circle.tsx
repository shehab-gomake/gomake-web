import { EditingIcon } from "./icons/editing";
import { PDFIcon } from "./icons/pdf";
import { DoneIcon } from "./icons/done";
import { useRouter } from "next/router";
import { MachineIcon } from "./icons/machine-icon";
import { getBoardMissionDataForMenuApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { ExpandIcon } from "@/icons/expand-icon";
import { DotIcon, LeftArrowIcon, MoreCircleIcon, SearchIcon } from "@/icons";

const useMoreCircle = ({ t, boardMission, onClickDone, onClickPrintJob, onClickPrintDTicket }) => {
  const { push } = useRouter();
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();

  const handleGetBoardMissionData = async (actionType) => {
    const callBack = (res) => {
      if (res.success) {
        const result = res?.data;
        if (actionType === "edit") {
          push(`/products/edit?clientTypeId=${result.clientTypeId}&customerId=${result.clientId}&customerName=${result.clientName}&productId=${result?.productId}&documentItemId=${result?.orderItemId}&documentType=${1}&documentNumber=${boardMission?.orderNumber}&documentId=${result.orderId}`).then();
        }
        // if actionType === print
        else {
          onClickPrintDTicket({ ...boardMission, quantity: result?.quantity });
        }
      } else {
        alertFaultGetData();
      }
    }
    await getBoardMissionDataForMenuApi(callApi, callBack, { boardMissionId: boardMission?.id, });
  }

  const openJobModal = () => {
    push(
      `/production-floor?boardMissionsId=${boardMission?.id}&productType=${boardMission?.productType}&step=stations`
    ).then();
  }

  const buildEditUrl = (result) => {
    return `/products/edit?clientTypeId=${result.clientTypeId}&customerId=${result.clientId}&customerName=${result.clientName}&productId=${result?.productId}&documentItemId=${result?.orderItemId}&documentType=${1}&documentNumber=${boardMission?.orderNumber}&documentId=${result.orderId}`;
  };

  // New function to get edit URL (returns promise)
  const getEditUrl = async () => {
    return new Promise((resolve, reject) => {
      const callBack = (res) => {
        if (res.success) {
          const result = res?.data;
          const url = buildEditUrl(result);
          resolve(url);
        } else {
          alertFaultGetData();
          reject(new Error('Failed to get board mission data'));
        }
      };
      getBoardMissionDataForMenuApi(callApi, callBack, { boardMissionId: boardMission?.id });
    });
  };

  const getMenuList = () => {
    return [
      {
        condition: true,
        onClick: () => openJobModal(),
        icon: <SearchIcon width={17} height={17} />,
        name: t("productionFloor.openJob")
      },
      {
        condition: true,
        onClick: () => handleGetBoardMissionData("edit"),
        icon: <EditingIcon />,
        name: t("sales.quote.edit"),
        //isLink: true, // Mark this as a link
        //getUrl: getEditUrl // Function to get the URL
      },
      {
        condition: true,
        onClick: () => onClickPrintJob(boardMission),
        icon: <MachineIcon />,
        name: t("productionFloor.printJob")
      },
      {
        condition: true,
        onClick: () => handleGetBoardMissionData("print"),
        icon: <PDFIcon />,
        name: t("productionFloor.printDeliverTicket")
      },
      {
        condition: true,
        onClick: () => onClickDone(boardMission),
        icon: <DoneIcon />,
        name: t("boardMissions.done")
      },
    ];
  };

  return {
    getMenuList
  };
};

export { useMoreCircle };
