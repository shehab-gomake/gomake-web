import { useCustomer, useGomakeRouter } from "@/hooks";
import { EditingIcon } from "./icons/editing";
import { PDFIcon } from "./icons/pdf";
import { DoneIcon } from "./icons/done";
import { useRouter } from "next/router";
import { MachineIcon } from "./icons/machine-icon";

const useMoreCircle = ({t , boardMission}) => {
  const { user } = useCustomer();
  const { push} = useRouter();

  const handleClickEdit = () => {
    console.log("board mission from table" ,boardMission )
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
        onClick: () => null,
        icon: <PDFIcon />,
        name: t("Print deliver ticket")
      },
      {
        condition: true,
        onClick: () => null,
        icon: <MachineIcon />,
        name: t("Print Job")
      },
      {
        condition: true,
        onClick: () => null,
        icon: <DoneIcon />,
        name: t("Done")
      },
    ];
  };

  return {
    user,
    getMenuList
  };
};

export { useMoreCircle };
