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
import { ErpAccountType } from "../states";

interface IPaymentModalProps {
    openModal: boolean;
    onClose: () => void;
    selectedTab: number;
    getERPAccounts: (selectedTabIndex: ErpAccountType) => void;
}

const PaymentModal = ({ openModal, onClose, selectedTab, getERPAccounts }: IPaymentModalProps) => {
    const { classes } = useStyle();
    const { t, resetTotalPayment, resetTotalBit, resetTotalCash, resetTotalTransfer, resetTotalChecks, resetChecksTable } = usePaymentsTable();

    const tabs: ITab[] = [
        { title: t("payment.transfer"), component: <TransferTab /> },
        { title: t("payment.check"), component: <CheckTab /> },
        { title: t("payment.cash"), component: <CashTab /> },
        { title: t("payment.creditCard"), component: <CreditCardTab /> },
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


    const handleTabChange = async (newTabIndex) => {
        await getERPAccounts(newTabIndex)
    };

    return (
        <GoMakeModal
            modalTitle={t('payment.choosePaymentMethod')}
            insideStyle={classes.insideStyle}
            openModal={openModal}
            onClose={handleModalClose} 
            >
            <div style={classes.boxStyle}>
                <div style={classes.firstSection}><PrimaryTabsComponent tabs={tabs} selectedTabIndex={selectedTab} onSelectTab={handleTabChange}
                /></div>
                <FooterSection onCloseModal={onClose} />
            </div>
        </GoMakeModal>
    );
}
export { PaymentModal }