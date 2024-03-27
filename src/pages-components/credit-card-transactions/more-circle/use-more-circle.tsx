import { useCustomer, useGomakeRouter } from "@/hooks";
import { LoggerIcon } from "@/pages-components/admin/home/widgets/more-circle/icons/logger";
import { ConvertIcon } from "./icons/convert";
import { EditingIcon } from "./icons/editing";
import { PDFIcon } from "./icons/pdf";
import { TickIcon } from "@/icons";
import { DuplicateIcon } from "@/components/icons/icons";

const useMoreCircle = () => {
  const { user } = useCustomer();
  const { navigate } = useGomakeRouter();
  const getMenuList = ({  onClickOpenModal, onClickPdf, onClickDuplicate, onClickLoggers, t }) => {
    return [
      {
        condition: true, 
        onClick: () => navigate(``),
        icon: <TickIcon />,
        name: t("creditcardTransactions.Transfertoanothercustomer")
      },
      {
        condition: true,
        onClick: () => navigate(``),
        icon: <TickIcon />,
        name: t("creditcardTransactions.Makeacredit")
      }
    ];
  };
  return {
    user,
    navigate,
    getMenuList

  };
};

export { useMoreCircle };
