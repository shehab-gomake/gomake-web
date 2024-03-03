import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { depositState } from "../deposits/components/states";
import { DEPOSIT_TYPE } from "./enums";

const useDeposit = () => {
    const { t } = useTranslation();
    const deposit =useRecoilValue<any>(depositState);

    const cashDepositHeaders = [
        t("deposits.date"),
        t("deposits.receiptNum"),
        t("deposits.client"),
        t("deposits.total")
    ];

    const checksDepositHeaders = [
        t("deposits.date"),
        t("deposits.client"),
        t("deposits.checkNum"),
        t("deposits.bank"),
        t("deposits.branch"),
        t("deposits.receiptNum"),
        t("deposits.total")
    ];

    const creditDepositHeaders = [
        t("deposits.date"),
        t("deposits.voucherNum"),
        t("deposits.client"),
        t("deposits.total")
    ];


    const renderTableHeaders = () => {
        switch (deposit?.depositType) {
            case (DEPOSIT_TYPE.Checks):
                return checksDepositHeaders;
            case (DEPOSIT_TYPE.CreditCard):
                return creditDepositHeaders;
            case (DEPOSIT_TYPE.Cash):
                return cashDepositHeaders;
            default:
                return [];
        }
    };

    
    const renderTableRows = () => {
        switch (deposit?.depositType) {
            case (DEPOSIT_TYPE.Checks):
                return deposit?.checksDepositData;
            case (DEPOSIT_TYPE.CreditCard):
                return deposit?.creditDepositData;
            case (DEPOSIT_TYPE.Cash):
                return [deposit?.cashDepositData];
            default:
                return [];
        }
    };

    return {
        t,
        deposit,
        renderTableHeaders,
        renderTableRows
    };
};

export { useDeposit };
