import { useTranslation } from "react-i18next";
import { ITab } from "@/components/tabs/interface";
import { GoMakeModal } from "@/components";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { useStyle } from "../style";
import { CreditCardTab } from "./payment-methods-tabs/credit-card-tab";
import { BitTab } from "./payment-methods-tabs/bit-tab";
import { CashTab } from "./payment-methods-tabs/cash-tab";
import { CheckTab } from "./payment-methods-tabs/check-tab";
import { TransferTab } from "./payment-methods-tabs/transfer-tab";
import { SecondaryButton } from "@/components/button/secondary-button";
import { FooterSection } from "./payment-methods-tabs/footer-section";

interface IPaymentModalProps {
    openModal: boolean;
    onClose: () => void;
    selectedTab: number
}

const PaymentModal = ({ openModal, onClose, selectedTab }: IPaymentModalProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const tabs: ITab[] = [
        { title: t("payment.creditCard"), component: <CreditCardTab/> },
        { title: t("payment.cash"), component: <CashTab /> },
        { title: t("payment.transfer"), component: <TransferTab/> },
        { title: t("payment.check"), component:<CheckTab />},
        { title: t("payment.bit"), component: <BitTab />}
    ];

    return (
        <GoMakeModal
            modalTitle={t('payment.choosePaymentMethod')}
            insideStyle={classes.insideStyle}
            openModal={openModal}
            onClose={onClose}
            >
           <div style={classes.boxStyle}>
           <div><PrimaryTabsComponent tabs={tabs} selectedTabIndex={selectedTab}/></div>
           <FooterSection/>
           </div>
        </GoMakeModal>
    );
}
export { PaymentModal }