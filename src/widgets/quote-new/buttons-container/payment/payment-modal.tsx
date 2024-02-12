import { useTranslation } from "react-i18next";
import { ITab } from "@/components/tabs/interface";
import { GoMakeModal } from "@/components";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { useStyle } from "../style";
import { CreditCardTab } from "./credit-card-tab";
import { BitTab } from "./bit-tab";
import { CashTab } from "./cash-tab";
import { CheckTab } from "./check-tab";
import { TransferTab } from "./transfer-tab";

interface IPaymentModalProps {
    openModal: boolean;
    onClose: () => void;
    selectedTab: number

}
const PaymentModal = ({ openModal, onClose, selectedTab }: IPaymentModalProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const tabs: ITab[] = [
        { title: t("payment.creditCard"), component:  <CreditCardTab/> },
        { title: t("payment.cash"), component:  <CashTab/> },
        { title: t("payment.transfer"), component: <TransferTab/>  },
        { title: t("payment.check"), component:  <CheckTab/> },
        { title: t("payment.bit"), component:  <BitTab/>},

    ];

    return (
        <GoMakeModal
            insideStyle={classes.insideStyle}
            openModal={openModal}
            onClose={onClose}
            withClose={false}
        >
            <PrimaryTabsComponent tabs={tabs} selectedTabIndex={selectedTab} />
        </GoMakeModal>
    );
}
export { PaymentModal }