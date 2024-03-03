import { useTranslation } from "react-i18next";
import { useRecoilState, useResetRecoilState } from "recoil";
import { depositState, newDepositState } from "../deposits/components/states";
import { DEPOSIT_TYPE } from "./enums";
import { ITab } from "@/components/tabs/interface";
import { getDepositsMetaDataApi } from "@/services/api-service/generic-doc/deposits-api";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useState } from "react";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { DepositTabTable } from "./components/tabs-table-prices";

const useDeposit = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { alertFaultGetData } = useSnackBar();
    const [cashReceiptsToDeposits, setCashReceiptsToDeposits] = useState();
    const [checksToDeposits, setChecksToDeposits] = useState();
    const [creditCardToDeposits, setCreditCardToDeposits] = useState();
    const [total, setTotal] = useState<number>(0);
    const [itemsCount, setItemsCount] = useState<number>(0);
    const [deposit, setDeposit] = useRecoilState<any>(depositState);
    const resetDepositState = useResetRecoilState(depositState);


    const handleResetTotalAndCount = () => {
        setItemsCount(0);
        setTotal(0);
    }

    const handleCashCheckboxChange = (index, depositItem) => (event) => {
        const isChecked = event.target.checked;
        const cashSum = Number(depositItem?.cashSum) || 0;
        setTotal((prevTotal) => isChecked ? prevTotal + cashSum : prevTotal - cashSum);
        setItemsCount((prevCount) => isChecked ? prevCount + 1 : prevCount - 1);
    };

    const handleCreditCheckboxChange = (index, depositItem) => (event) => {
        const isChecked = event.target.checked;
        const creditTotal = Number(depositItem?.total) || 0;
        setTotal((prevTotal) => isChecked ? prevTotal + creditTotal : prevTotal - creditTotal);
        setItemsCount((prevCount) => isChecked ? prevCount + 1 : prevCount - 1);
    };

    const handleChecksCheckboxChange = (index, depositItem) => (event) => {
        const isChecked = event.target.checked;
        const checksTotal = Number(depositItem?.checkAmount) || 0;
        setTotal((prevTotal) => isChecked ? prevTotal + checksTotal : prevTotal - checksTotal);
        setItemsCount((prevCount) => isChecked ? prevCount + 1 : prevCount - 1);
    };

    const [newDeposit, setNewDeposit] = useRecoilState<any>(newDepositState);

    const getDepositMetaData = async () => {
        const callBack = (res) => {
            if (res?.success) {
                setNewDeposit(res?.data?.erpDeposit);
                const metaData = res?.data?.depositMetaData;
                const mapCashData = metaData?.cashReceiptsToDeposit?.map((deposit: any, index: number) => [
                    <Checkbox
                        icon={<CheckboxIcon />}
                        checkedIcon={<CheckboxCheckedIcon />}
                        onChange={handleCashCheckboxChange(index, deposit)}
                    />,
                    deposit?.taxDate,
                    "test",
                    deposit?.client?.name,
                    deposit?.cashSum,

                ]);
                const mapCreditData = metaData?.creditCardsToDeposit?.map((deposit: any, index: number) => [
                    <Checkbox
                        icon={<CheckboxIcon />}
                        checkedIcon={<CheckboxCheckedIcon />}
                        onChange={handleCreditCheckboxChange(index, deposit)}

                    />, deposit?.payDate,
                    deposit?.voucherNumber,
                    deposit?.customer,
                    deposit?.total
                ]);
                const mapChecksData = metaData?.checksToDeposit?.map((deposit: any, index: number) => [
                    <Checkbox
                        icon={<CheckboxIcon />}
                        checkedIcon={<CheckboxCheckedIcon />}
                        onChange={handleChecksCheckboxChange(index, deposit)}

                    />,
                    deposit?.checkDate,
                    deposit?.customer,
                    deposit?.checkNumber,
                    deposit?.bank,
                    deposit?.branch,
                    deposit?.checkAmount
                ]);
                setCashReceiptsToDeposits(mapCashData);
                setCreditCardToDeposits(mapCreditData);
                setChecksToDeposits(mapChecksData);
            }
            else {
                alertFaultGetData();
            }
        };
        await getDepositsMetaDataApi(callApi, callBack);
    };

    const cashDepositHeaders = [
        t("deposits.date"),
        t("deposits.receiptNum"),
        t("deposits.client"),
        t("deposits.total")
    ];

    const creditDepositHeaders = [
        t("deposits.date"),
        t("deposits.voucherNum"),
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

    const checksTabHeaders = [
        "#",
        t("deposits.date"),
        t("deposits.client"),
        t("deposits.checkNum"),
        t("deposits.bank"),
        t("deposits.branch"),
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


    const depositsTabs: ITab[] = [
        {
            title: t("deposits.checks"),
            component:
                <DepositTabTable
                    tableHeaders={checksTabHeaders}
                    tableRows={checksToDeposits}
                    itemsCount={itemsCount}
                    total={total} />
        },
        {
            title: t("deposits.deferredChecks"),
            component:
                <DepositTabTable
                    tableHeaders={checksTabHeaders}
                    tableRows={checksToDeposits}
                    itemsCount={itemsCount}
                    total={total} />
        },
        {
            title: t("deposits.creditCard"),
            component:
                <DepositTabTable
                    tableHeaders={["#", ...creditDepositHeaders]}
                    tableRows={creditCardToDeposits}
                    itemsCount={itemsCount}
                    total={total} />
        },
        {
            title: t("deposits.cash"),
            component:
                <DepositTabTable
                    tableHeaders={["#", ...cashDepositHeaders]}
                    tableRows={cashReceiptsToDeposits}
                    itemsCount={itemsCount}
                    total={total} />
        },
    ];

    return {
        t,
        depositsTabs,
        deposit,
        renderTableHeaders,
        renderTableRows,
        resetDepositState,
        getDepositMetaData,
        handleResetTotalAndCount
    };
};

export { useDeposit };
