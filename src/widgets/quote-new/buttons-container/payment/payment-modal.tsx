import { useTranslation } from "react-i18next";
import { ITab } from "@/components/tabs/interface";
import { GoMakeModal } from "@/components";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { useStyle } from "../style";

interface IPaymentModalProps {
    openModal: boolean;
    onClose: () => void;
    selectedTab: number

}
const PaymentModal = ({ openModal, onClose, selectedTab }: IPaymentModalProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const tabs: ITab[] = [
        { title: t("payment.creditCard"), component:  <div>{t("payment.check")}</div> },
        { title: t("payment.cash"), component:  <div>{t("payment.check")}</div> },
        { title: t("payment.transfer"), component:  <div>{t("payment.check")}</div> },
        { title: t("payment.check"), component:  <div>{t("payment.check")}</div> },
        { title: t("payment.bit"), component:  <div>{t("payment.check")}</div> },

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