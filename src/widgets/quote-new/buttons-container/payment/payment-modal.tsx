import { ITab } from "@/components/tabs/interface";
import { GoMakeModal } from "@/components";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { useStyle } from "../style";
import { CreditCardTab } from "./payment-methods-tabs/credit-card-tab";
import { BitTab } from "./payment-methods-tabs/bit-tab";
import { CashTab } from "./payment-methods-tabs/cash-tab";
import { CheckTab } from "./payment-methods-tabs/check-tab";
import { TransferTab } from "./payment-methods-tabs/transfer-tab";
import { FooterSection } from "./payment-methods-tabs/footer-section";
import { usePaymentsTable } from "../../receipts-table/use-payments-table";
import { ErpAccountType } from "../states";
import { useEffect } from "react";
import { SupplierCreditCardTab } from "./payment-methods-tabs/supplier-credit-card-tab";

interface IPaymentModalProps {
  openModal: boolean;
  onClose: () => void;
  selectedTab: number;
}

const PaymentModal = ({
  openModal,
  onClose,
  selectedTab,
}: IPaymentModalProps) => {
  const { classes } = useStyle();
  const {
    t,
    revertToPreviousState,
    firstWidget,
    secondWidget,
    thirdWidget,
    handleFirstButtonClick,
    handleSecondButtonClick,
    handleThirdButtonClick,
    handleSave,
    documentItemValue,
    setActiveWidget,
    isOutgoingPayments,
    validateRequiredAccountCodes,
  } = usePaymentsTable();

  const handleSaveAndClose = (transactionData) => {
    if (!validateRequiredAccountCodes()) return;

    handleSave(transactionData);
    onClose();
  };

  const tabs: ITab[] = [
    { title: t("payment.transfer"), component: <TransferTab /> },
    { title: t("payment.check"), component: <CheckTab /> },
    { title: t("payment.cash"), component: <CashTab /> },
    {
      title: t("payment.creditCard"),
      component: isOutgoingPayments ? (
        <SupplierCreditCardTab />
      ) : (
        <CreditCardTab
          firstWidget={firstWidget}
          secondWidget={secondWidget}
          thirdWidget={thirdWidget}
          setActiveWidget={setActiveWidget}
          handleFirstButtonClick={handleFirstButtonClick}
          handleSecondButtonClick={handleSecondButtonClick}
          handleThirdButtonClick={handleThirdButtonClick}
          handleSaveAndClose={handleSaveAndClose}
          documentItemValue={documentItemValue}
        />
      ),
    },
    documentItemValue?.isBitAccountExist && {
      title: t("payment.bit"),
      component: <BitTab />,
    },
  ].filter(Boolean);

  const handleModalClose = () => {
    revertToPreviousState(); // if we don't save
    onClose(); // close modal
  };

  return (
    <GoMakeModal
      modalTitle={t("payment.choosePaymentMethod")}
      insideStyle={classes.insideStyle}
      openModal={openModal}
      onClose={handleModalClose}
    >
      <div style={classes.boxStyle}>
        <div className={`custom-scroller`} style={classes.firstSection}>
          <PrimaryTabsComponent
            tabs={tabs}
            selectedTabIndex={selectedTab}
            withBackGround={true}
          />
        </div>
        <FooterSection onCloseModal={onClose} />
      </div>
    </GoMakeModal>
  );
};
export { PaymentModal };
