import { useTranslation } from "react-i18next";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { depositState, newDepositState } from "../deposits/components/states";
import { DEPOSIT_TYPE } from "./enums";
import { ITab } from "@/components/tabs/interface";
import { getDepositsMetaDataApi } from "@/services/api-service/generic-doc/deposits-api";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useMemo, useState } from "react";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { DepositTabTable } from "./components/tabs-table-prices";

const useDeposit = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { alertFaultGetData } = useSnackBar();
    const [checksToDeposits, setChecksToDeposits] = useState();
    const [deferredChecksToDeposits, setDeferredChecksToDeposits] = useState();

    const [creditCardToDeposits, setCreditCardToDeposits] = useState();
    const [accounts, setAccounts] = useState();
    const [total, setTotal] = useState<number>(0);
    const [itemsCount, setItemsCount] = useState<number>(0);
    const deposit = useRecoilValue<any>(depositState);
    const setNewDeposit = useSetRecoilState<any>(newDepositState);
    const resetDepositState = useResetRecoilState(depositState);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [metaData, setMetaData] = useState<any>();


    const handleResetTotalAndCount = () => {
        setItemsCount(0);
        setTotal(0);
        setSelectAllChecked(false);
    }

    

    
    const handleSelectAllChange = (cashReceiptsToDeposits, metaData) => {
        setSelectAllChecked((prev) => !prev);
    
        let newTotal = 0;
        let newItemsCount = 0;
    
        cashReceiptsToDeposits.forEach((data, index) => {
            const depositItem = metaData?.cashReceiptsToDeposit[index];
            const isChecked = !selectAllChecked;
    
            // Update total and itemsCount based on whether the checkbox is checked or unchecked
            newTotal += isChecked ? Number(depositItem?.cashSum) || 0 : 0;
            newItemsCount += isChecked ? 1 : 0;
    
            // Update metaData state
            handleCashCheckboxChange(index, depositItem)({
                target: { checked: isChecked },
            });
        });
    
        // Set the updated total and itemsCount
        setTotal(newTotal);
        setItemsCount(newItemsCount);
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

    const isDeferredCheckEligible = (checkDate: string): boolean => {
        const currentDate = new Date();
        const checkDateObj = new Date(checkDate);
        return checkDateObj > currentDate;
    };




    const handleSelectAllChangeee = (cashReceiptsToDeposits, metaData) => {
        setSelectAllChecked((prev) => !prev);
            cashReceiptsToDeposits.forEach((data, index) => {
            const depositItem = metaData?.cashReceiptsToDeposit[index];
            handleCashCheckboxChange(index, depositItem)({
                target: { checked: !selectAllChecked },
            });
        });
    };

    const handleCashCheckboxChange = (index, depositItem) => (event) => {
        const isChecked = event.target.checked;
        const cashSum = Number(depositItem?.cashSum) || 0;
    
        // Update total and itemsCount based on whether the checkbox is checked or unchecked
        setTotal((prevTotal) => isChecked ? prevTotal + cashSum : prevTotal - cashSum);
        setItemsCount((prevCount) => isChecked ? prevCount + 1 : prevCount - 1);
    
        // Update metaData state
        setMetaData((prevMetaData) => {
            const updatedCashReceiptsToDeposit = [...prevMetaData.cashReceiptsToDeposit];
            updatedCashReceiptsToDeposit[index] = {
                ...updatedCashReceiptsToDeposit[index],
                isChecked: isChecked,
            };
            return {
                ...prevMetaData,
                cashReceiptsToDeposit: updatedCashReceiptsToDeposit,
            };
        });
    };
    

    const getDepositMetaData = async () => {
        const callBack = (res) => {
            if (res?.success) {
                const metaData = res?.data?.depositMetaData;
                setNewDeposit(res?.data?.erpDeposit);
                setMetaData(metaData)
                setAccounts(metaData?.accounts);
               
                const mapCreditData = metaData?.creditCardsToDeposit?.map((deposit: any, index: number) => [
                    <Checkbox
                        key={index}
                        icon={<CheckboxIcon />}
                        checkedIcon={<CheckboxCheckedIcon />}
                        onChange={handleCreditCheckboxChange(index, deposit)}

                    />,
                    deposit?.payDate,
                    deposit?.voucherNumber,
                    deposit?.customer,
                    deposit?.total
                ]);
                const mapChecksData = metaData?.checksToDeposit?.map((deposit: any, index: number) => {
                    return !isDeferredCheckEligible(deposit?.checkDate) && [
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
                    ];
                }).filter(Boolean);
                const mapDeferredChecksData = metaData?.checksToDeposit?.map((deposit: any, index: number) => {
                    return isDeferredCheckEligible(deposit?.checkDate) && [
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
                    ];
                }).filter(Boolean);
                setCreditCardToDeposits(mapCreditData);
                setChecksToDeposits(mapChecksData);
                setDeferredChecksToDeposits(mapDeferredChecksData)
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


    const mapCashData = useMemo(()=>{
        return  metaData?.cashReceiptsToDeposit?.map((deposit: any, index: number) => {
            return [
                <Checkbox
                    key={`${index}-cash-checkBox`}
                    icon={<CheckboxIcon />}
                    checkedIcon={<CheckboxCheckedIcon />}
                    onChange={handleCashCheckboxChange(index, deposit)}
                    checked={deposit.isChecked}
                />,
                deposit?.taxDate,
                "test",
                deposit?.client?.name,
                deposit?.cashSum,
            ];
        });

    },[metaData]) ;


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
                    total={total}
                    handleSelectAll={() => handleSelectAllChange(checksToDeposits, metaData)}
                    selectAllChecked={selectAllChecked}
                />
        },
        {
            title: t("deposits.deferredChecks"),
            component:
                <DepositTabTable
                    tableHeaders={checksTabHeaders}
                    tableRows={deferredChecksToDeposits}
                    itemsCount={itemsCount}
                    total={total}
                    handleSelectAll={() => handleSelectAllChange(deferredChecksToDeposits, metaData)}
                    selectAllChecked={selectAllChecked}
                />
        },
        {
            title: t("deposits.creditCard"),
            component:
                <DepositTabTable
                    tableHeaders={["#", ...creditDepositHeaders]}
                    tableRows={creditCardToDeposits}
                    itemsCount={itemsCount}
                    total={total}
                    handleSelectAll={() => handleSelectAllChange(creditCardToDeposits, metaData)}
                    selectAllChecked={selectAllChecked}
                />
        },
        {
            title: t("deposits.cash"),
            component:
                <div>
                    <DepositTabTable
                        tableHeaders={["#", ...cashDepositHeaders]}
                        tableRows={mapCashData}
                        itemsCount={itemsCount}
                        total={total}
                        handleSelectAll={() => handleSelectAllChange(mapCashData, metaData)}
                        selectAllChecked={selectAllChecked}
                    />
                </div>
        },
    ];

    return {
        t,
        depositsTabs,
        deposit,
        accounts,
        renderTableHeaders,
        renderTableRows,
        resetDepositState,
        getDepositMetaData,
        handleResetTotalAndCount
    };
};

export { useDeposit };