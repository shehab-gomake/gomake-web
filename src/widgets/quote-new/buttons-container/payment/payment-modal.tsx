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
import { usePaymentsTable } from "../../payments-table/use-payments-table";

interface IPaymentModalProps {
    openModal: boolean;
    onClose: () => void;
    selectedTab: number
}

const PaymentModal = ({ openModal, onClose, selectedTab }: IPaymentModalProps) => {
    const { classes } = useStyle();
    const { t, resetTotalPayment , resetTotalBit, resetTotalCash , resetTotalTransfer , resetTotalChecks,resetChecksTable} = usePaymentsTable();

    const tabs: ITab[] = [
        { title: t("payment.creditCard"), component: <CreditCardTab /> },
        { title: t("payment.cash"), component: <CashTab /> },
        { title: t("payment.transfer"), component: <TransferTab /> },
        { title: t("payment.check"), component: <CheckTab /> },
        { title: t("payment.bit"), component: <BitTab /> }
    ];

  const handleModalClose = () => {
    resetTotalPayment();
    resetTotalBit();
    resetTotalCash();
    resetTotalTransfer();
    resetTotalChecks();
    resetChecksTable();
    onClose();
  };

    return (
        <GoMakeModal
            modalTitle={t('payment.choosePaymentMethod')}
            insideStyle={classes.insideStyle}
            openModal={openModal}
            onClose={handleModalClose}
        >
            <div style={classes.boxStyle}>
                <div style={{ maxHeight: "70%", height: "65%", overflow: "hidden" }}><PrimaryTabsComponent tabs={tabs} selectedTabIndex={selectedTab} /></div>
                <FooterSection onCloseModal={onClose}/>
            </div>
        </GoMakeModal>
    );
}
export { PaymentModal }