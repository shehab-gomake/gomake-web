import Button from "@mui/material/Button";
import { Menu } from "@mui/material";
import { GomakePrimaryButton } from "@/components";
import { CreditCardIcon } from "@/icons/credit-card-icon";
import { useStyle } from "../style";
import { ErpAccountType } from "../states";
import { useButtonsContainer } from "../use-buttons-container";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface IPaymentBtn {
  handleOpenModal: (selectedTabIndex: number) => void;
}

const PaymentBtn = ({ handleOpenModal }: IPaymentBtn) => {
  const { classes } = useStyle();
  const router = useRouter();
  const isOutgoingPayments = router.query?.isOutgoingPayments === "true";
  const { ClientId, documentNumber } = router.query;
  const {
    t,
    quoteItemValue,
    alertFault,
    anchorEl,
    open,
    handleClose,
    handleClick,
  } = useButtonsContainer(DOCUMENT_TYPE.receipt);

  const onSelectPaymentMethod = async (paymentMethod: number) => {
    if (quoteItemValue?.client === null) {
      alertFault(
        `sales.quote.${
          isOutgoingPayments ? "chooseSupplier" : "chooseCustomer"
        }`
      );
      return;
    }
    handleOpenModal(paymentMethod);
    handleClose();
  };

  //To automatically select the "Cash Payment" option when the ClientId and documentNumber are present in the router
  useEffect(() => {
    if (ClientId && documentNumber) {
      onSelectPaymentMethod(ErpAccountType.CashPayment);
    }
  }, [ClientId, documentNumber]);

  return (
    <>
      <GomakePrimaryButton
        leftIcon={<CreditCardIcon color={"#344054"} />}
        onClick={handleClick}
        style={classes.btnContainer}
      >
        {t("payment.payment")}
      </GomakePrimaryButton>
      <Menu
        closeAfterTransition={false}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ sx: { width: anchorEl?.offsetWidth, padding: 0 } }}
      >
        <Button
          sx={{ ...classes.statusLabel, borderRadius: 0 }}
          onClick={() => onSelectPaymentMethod(ErpAccountType.TransferPayment)}
        >
          {t("payment.transfer")}
        </Button>
        <Button
          sx={{ ...classes.statusLabel, borderRadius: 0 }}
          onClick={() => onSelectPaymentMethod(ErpAccountType.ChecksPayment)}
        >
          {t("payment.check")}
        </Button>
        <Button
          sx={{ ...classes.statusLabel, borderRadius: 0 }}
          onClick={() => onSelectPaymentMethod(ErpAccountType.CashPayment)}
        >
          {t("payment.cash")}
        </Button>
        <Button
          sx={{ ...classes.statusLabel, borderRadius: 0 }}
          onClick={() =>
            onSelectPaymentMethod(ErpAccountType.CreditCardPayment)
          }
        >
          {t("payment.creditCard")}
        </Button>
        {quoteItemValue?.isBitAccountExist && (
          <Button
            sx={{ ...classes.statusLabel, borderRadius: 0 }}
            onClick={() =>
              onSelectPaymentMethod(ErpAccountType.CreditCardPayment + 1)
            }
          >
            {t("payment.bit")}
          </Button>
        )}
      </Menu>
    </>
  );
};

export { PaymentBtn };
