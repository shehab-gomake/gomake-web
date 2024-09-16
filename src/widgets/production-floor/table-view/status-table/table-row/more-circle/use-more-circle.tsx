import { EditingIcon } from "./icons/editing";
import { PDFIcon } from "./icons/pdf";
import { DoneIcon } from "./icons/done";
import { useRouter } from "next/router";
import { MachineIcon } from "./icons/machine-icon";

const useMoreCircle = ({ t, boardMission, onClickDone, onClickPrintJob ,onClickPrintDTicket}) => {
  const { push } = useRouter();

  const handleClickEdit = () => {
    console.log("board mission from table", boardMission)
    //  push(`/products/edit?clientTypeId=${boardMission.clientTypeId}&customerId=${boardMission.clientId}&customerName=${boardMission.clientName}&productId=${boardMission.productId}&documentItemId=${boardMission.orderItemId}&documentType=${1}&documentNumber=${boardMission?.orderNumber}&documentId=${boardMission.orderId}`).then()
  }

  const getMenuList = () => {
    return [
      {
        condition: true,
        onClick: () => handleClickEdit(),
        icon: <EditingIcon />,
        name: t("sales.quote.edit")
      },
      {
        condition: true,
        onClick: () => onClickPrintJob(boardMission),
        icon: <MachineIcon />,
        name: t("productionFloor.printJob")
      },
      {
        condition: true,
        onClick: () => onClickPrintDTicket(boardMission),
        icon: <PDFIcon />,
        name: t("productionFloor.printDeliverTicket")
      },
      {
        condition: true,
        onClick: () => onClickDone(boardMission?.id),
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
