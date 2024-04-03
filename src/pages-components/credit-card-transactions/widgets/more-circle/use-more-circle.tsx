import { useCustomer, useGomakeRouter } from "@/hooks";
import { TwoArrowsIcon } from "./icons/arrows-icon";
import { ClientIcon } from "./icons/transfer-to-client-icon";

const useMoreCircle = () => {
  const { user } = useCustomer();
  const { navigate } = useGomakeRouter();
  const getMenuList = ({ transaction, onClickOpenModal, onClickSecondModal, t }) => {

    return [
      {
        condition: true,
        onClick: () => onClickOpenModal(transaction),
        icon: <ClientIcon />,
        name: t("creditCardTransactions.TransferToAnotherCustomer")
      },
      {
        condition: true,
        onClick: onClickSecondModal,
        icon: <TwoArrowsIcon />,
        name: t("creditCardTransactions.MakeACredit")
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
