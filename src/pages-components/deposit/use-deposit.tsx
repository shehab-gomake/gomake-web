import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { depositState, newDepositState } from "../deposits/components/states";
import { DEPOSIT_TYPE } from "./enums";
import { ITab } from "@/components/tabs/interface";
import { getDepositsMetaDataApi } from "@/services/api-service/generic-doc/deposits-api";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useMemo, useState } from "react";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { DepositTabTable } from "./components/tabs-table-prices";
import { useDateFormat } from "@/hooks/use-date-format";

const useDeposit = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { GetShortDateFormat } = useDateFormat();
    const { alertFaultGetData } = useSnackBar();
    const [accounts, setAccounts] = useState();
    const [total, setTotal] = useState<number>(0);
    const [itemsCount, setItemsCount] = useState<number>(0);
    const deposit = useRecoilValue<any>(depositState);
    const [newDeposit, setNewDeposit] = useRecoilState<any>(newDepositState);
    const resetDepositState = useResetRecoilState(depositState);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [metaData, setMetaData] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [balanceDeposits, setBalanceDeposits] = useState<{ checksBalance: number, creditCardBalance: number, cashBalance: number }>({ checksBalance: 0, creditCardBalance: 0, cashBalance: 0 })
    const [newItemsSelected, setNewItemsSelected] = useState([]); // for create
    const [selectedArray, setSelectedArray] = useState<string>("lama default"); // for create
    const [metaDataBig, setMetaDataBig] = useState<any>();

    const onSelectTab = (index: number) => {
        setNewDeposit({ ...newDeposit, balance: renderBalance(index) })
        setItemsCount(0);
        setTotal(0);
        setSelectAllChecked(false);
        setNewItemsSelected([]); // resetSelectedItems
        setSelectedArray(`array-${index}`)
        const updatedChecksToDeposit = metaData?.checksToDeposit?.map((deposit) => {
            return {
                ...deposit,
                isChecked: false,
            };
        })
        const updatedDeferredChecksToDeposit = metaData?.deferredChecksToDeposit?.map((deposit) => {
            return {
                ...deposit,
                isChecked: false,
            };
        })
        const updatedCashReceiptsToDeposit = metaData?.cashReceiptsToDeposit?.map((deposit) => {
            return {
                ...deposit,
                isChecked: false,
            };
        });
        const updatedCreditsToDeposit = metaData?.creditCardsToDeposit?.map((deposit) => {
            return {
                ...deposit,
                isChecked: false,
            };
        });
        setMetaData((prevMetaData) => ({
            ...prevMetaData,
            cashReceiptsToDeposit: updatedCashReceiptsToDeposit,
            creditCardsToDeposit: updatedCreditsToDeposit,
            checksToDeposit: updatedChecksToDeposit,
            deferredChecksToDeposit: updatedDeferredChecksToDeposit
        }));
    }


    const handleSelectAllChange = (itemsToDeposits, stringItemToDeposits, handleCheckBox, totalSting, metaData) => {
        setSelectAllChecked((prev) => !prev);

        let newTotal = 0;
        let newItemsCount = 0;
        let selectedItems = [];

        itemsToDeposits.forEach((data, index) => {
            const depositItem = metaData?.[stringItemToDeposits][index];
            const isChecked = !selectAllChecked;
            newTotal += isChecked ? Number(depositItem?.[totalSting]) || 0 : 0;
            newItemsCount += isChecked ? 1 : 0;

            handleCheckBox(index, depositItem)({
                target: { checked: isChecked },
            });

            if (isChecked) {
                selectedItems.push(depositItem);
            }

        });
        setTotal(newTotal);
        setItemsCount(newItemsCount);
        setNewItemsSelected(selectedItems);
    };

    const handleChecksCheckboxChange = (index, depositItem) => (event) => {
        const isChecked = event.target.checked;
        const checksTotal = Number(depositItem?.checkAmount) || 0;
        setTotal((prevTotal) => isChecked ? prevTotal + checksTotal : prevTotal - checksTotal);
        setItemsCount((prevCount) => isChecked ? prevCount + 1 : prevCount - 1);
        setMetaData((prevMetaData) => {
            const updatedChecksToDeposit = [...prevMetaData.checksToDeposit];
            updatedChecksToDeposit[index] = {
                ...updatedChecksToDeposit[index],
                isChecked: isChecked,
            };
            return {
                ...prevMetaData,
                checksToDeposit: updatedChecksToDeposit,
            };
        });
        setNewItemsSelected((prevSelectedItems) => {
            if (isChecked) {
                return [...prevSelectedItems, depositItem];
            } else {
                return prevSelectedItems.filter((item) => item.checkKey !== depositItem.checkKey);
            }
        });
    };

    const handleDeferredChecksCheckboxChange = (index, depositItem) => (event) => {
        const isChecked = event.target.checked;
        const checksTotal = Number(depositItem?.checkAmount) || 0;
        setTotal((prevTotal) => isChecked ? prevTotal + checksTotal : prevTotal - checksTotal);
        setItemsCount((prevCount) => isChecked ? prevCount + 1 : prevCount - 1);
        setMetaData((prevMetaData) => {
            const updatedChecksToDeposit = [...prevMetaData.deferredChecksToDeposit];
            updatedChecksToDeposit[index] = {
                ...updatedChecksToDeposit[index],
                isChecked: isChecked,
            };
            return {
                ...prevMetaData,
                deferredChecksToDeposit: updatedChecksToDeposit,
            };
        });
        setNewItemsSelected((prevSelectedItems) => {
            if (isChecked) {
                return [...prevSelectedItems, depositItem];
            } else {
                return prevSelectedItems.filter((item) => item.checkKey !== depositItem.checkKey);
            }
        });
    };

    const handleCashCheckboxChange = (index, depositItem) => (event) => {
        const isChecked = event.target.checked;
        const cashSum = Number(depositItem?.cashSum) || 0;
        setTotal((prevTotal) => isChecked ? prevTotal + cashSum : prevTotal - cashSum);
        setItemsCount((prevCount) => isChecked ? prevCount + 1 : prevCount - 1);
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

        setNewItemsSelected((prevSelectedItems) => {
            if (isChecked) {
                return [...prevSelectedItems, depositItem];
            } else {
                return prevSelectedItems.filter((item) => item.id !== depositItem.id);
            }
        });
    };

    const handleCreditCheckboxChange = (index, depositItem) => (event) => {
        const isChecked = event.target.checked;
        const creditTotal = Number(depositItem?.total) || 0;
        setTotal((prevTotal) => isChecked ? prevTotal + creditTotal : prevTotal - creditTotal);
        setItemsCount((prevCount) => isChecked ? prevCount + 1 : prevCount - 1);
        setMetaData((prevMetaData) => {
            const updatedCreditCardsToDeposit = [...prevMetaData.creditCardsToDeposit];
            updatedCreditCardsToDeposit[index] = {
                ...updatedCreditCardsToDeposit[index],
                isChecked: isChecked,
            };
            return {
                ...prevMetaData,
                creditCardsToDeposit: updatedCreditCardsToDeposit,
            };
        });
        setNewItemsSelected((prevSelectedItems) => {
            if (isChecked) {
                return [...prevSelectedItems, depositItem];
            } else {
                return prevSelectedItems.filter((item) => item.absId !== depositItem.absId);
            }
        });
    };

    const getDepositMetaData = async () => {
        const callBack = (res) => {
            if (res?.success) {

                setIsLoading(false);
                setMetaDataBig(res?.data)
                const metaData = res?.data?.depositMetaData;
                setMetaData(metaData)
                setAccounts(metaData?.accounts);
                const cashSumTotal = metaData?.cashReceiptsToDeposit?.reduce((total, deposit) => {
                    return total + (deposit?.cashSum || 0);
                }, 0);
                const checksSumTotal = ((metaData?.checksToDeposit || []).concat(metaData?.deferredChecksToDeposit || [])).reduce((total, deposit) => {
                    return total + (deposit?.checkAmount || 0);
                }, 0);
                const creditSumTotal = metaData?.creditCardsToDeposit?.reduce((total, deposit) => {
                    return total + (deposit?.total || 0);
                }, 0);
                setBalanceDeposits({
                    cashBalance: cashSumTotal,
                    checksBalance: checksSumTotal,
                    creditCardBalance: creditSumTotal
                });
                setNewDeposit({ ...res?.data?.erpDeposit, balance: checksSumTotal })
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

    const renderBalance = (tabIndex: number) => {
        switch (tabIndex) {
            case (0):
                return balanceDeposits?.checksBalance;
            case (DEPOSIT_TYPE.Checks):
                return balanceDeposits?.checksBalance;
            case (DEPOSIT_TYPE.CreditCard):
                return balanceDeposits?.creditCardBalance;
            case (DEPOSIT_TYPE.Cash):
                return balanceDeposits?.cashBalance;
            default:
                return 0;
        }
    };

    const mapDepositsData = {
        cash: useMemo(() => {
            return metaData?.cashReceiptsToDeposit?.map((deposit: any, index: number) => {
                const isChecked = deposit.isChecked || false;
                return [
                    <Checkbox
                        key={`${index}-cash-checkBox`}
                        icon={<CheckboxIcon />}
                        checkedIcon={<CheckboxCheckedIcon />}
                        onChange={handleCashCheckboxChange(index, deposit)}
                        checked={isChecked}
                    />,
                    GetShortDateFormat(deposit?.taxDate),
                    "test",
                    deposit?.client?.name,
                    deposit?.cashSum,
                ];
            });
        }, [metaData]),
        deferredChecks: useMemo(() => {
            return metaData?.deferredChecksToDeposit?.map((deposit: any, index: number) => {
                const isChecked = deposit.isChecked || false;
                return [
                    <Checkbox
                        key={`${index}-deferredCheck-checkBox`}
                        icon={<CheckboxIcon />}
                        checkedIcon={<CheckboxCheckedIcon />}
                        onChange={handleDeferredChecksCheckboxChange(index, deposit)}
                        checked={isChecked}
                    />,
                    GetShortDateFormat(deposit?.checkDate),
                    deposit?.customer,
                    deposit?.checkNumber,
                    deposit?.bank,
                    deposit?.branch,
                    deposit?.checkAmount
                ];
            }).filter(Boolean);
        }, [metaData]),
        checks: useMemo(() => {
            return metaData?.checksToDeposit?.map((deposit: any, index: number) => {
                const isChecked = deposit.isChecked || false;
                return [
                    <Checkbox
                        key={`${index}-check-checkBox`}
                        icon={<CheckboxIcon />}
                        checkedIcon={<CheckboxCheckedIcon />}
                        onChange={handleChecksCheckboxChange(index, deposit)}
                        checked={isChecked}
                    />,
                    GetShortDateFormat(deposit?.checkDate),
                    deposit?.customer,
                    deposit?.checkNumber,
                    deposit?.bank,
                    deposit?.branch,
                    deposit?.checkAmount
                ];
            }).filter(Boolean);
        }, [metaData]),
        credit: useMemo(() => {
            return metaData?.creditCardsToDeposit?.map((deposit: any, index: number) => {
                const isChecked = deposit.isChecked || false;
                return [
                    <Checkbox
                        key={`${index}-creditCard-checkBox`}
                        icon={<CheckboxIcon />}
                        checkedIcon={<CheckboxCheckedIcon />}
                        onChange={handleCreditCheckboxChange(index, deposit)}
                        checked={isChecked}
                    />,
                    GetShortDateFormat(deposit?.payDate),
                    deposit?.voucherNumber,
                    deposit?.customer,
                    deposit?.total
                ];
            });
        }, [metaData]),
    };

    const handleClickButton = (labelArray) => {
        const arrayCopy = { ...metaDataBig, erpDeposit: newDeposit, depositMetaData: selectedArray, [labelArray]: newItemsSelected }
        console.log("the array will be ", arrayCopy)
    };


    const depositsTabs: ITab[] = [
        {
            title: t("deposits.checks"),
            component:
                <DepositTabTable
                    tableHeaders={checksTabHeaders}
                    tableRows={mapDepositsData.checks}
                    itemsCount={itemsCount}
                    total={total}
                    handleSelectAll={() => handleSelectAllChange(mapDepositsData.checks, "checksToDeposit", handleChecksCheckboxChange, "checkAmount", metaData)}
                    selectAllChecked={selectAllChecked}
                    onClickMakePayment={() => handleClickButton("checksToDeposit")}

                />
        },
        {
            title: t("deposits.deferredChecks"),
            component:
                <DepositTabTable
                    tableHeaders={checksTabHeaders}
                    tableRows={mapDepositsData.deferredChecks}
                    itemsCount={itemsCount}
                    total={total}
                    handleSelectAll={() => handleSelectAllChange(mapDepositsData.deferredChecks, "deferredChecksToDeposit", handleDeferredChecksCheckboxChange, "checkAmount", metaData)}
                    selectAllChecked={selectAllChecked}
                    onClickMakePayment={() => handleClickButton("checksToDeposit")}
                />
        },
        {
            title: t("deposits.creditCard"),
            component:
                <DepositTabTable
                    tableHeaders={["#", ...creditDepositHeaders]}
                    tableRows={mapDepositsData.credit}
                    itemsCount={itemsCount}
                    total={total}
                    handleSelectAll={() => handleSelectAllChange(mapDepositsData.credit, "creditCardsToDeposit", handleCreditCheckboxChange, "total", metaData)}
                    selectAllChecked={selectAllChecked}
                    onClickMakePayment={() => handleClickButton("creditCardsToDeposit")}

                />
        },
        {
            title: t("deposits.cash"),
            component:
                <div>
                    <DepositTabTable
                        tableHeaders={["#", ...cashDepositHeaders]}
                        tableRows={mapDepositsData.cash}
                        itemsCount={itemsCount}
                        total={total}
                        handleSelectAll={() => handleSelectAllChange(mapDepositsData.cash, "cashReceiptsToDeposit", handleCashCheckboxChange, "cashSum", metaData)}
                        selectAllChecked={selectAllChecked}
                        onClickMakePayment={() => handleClickButton("cashReceiptsToDeposit")}
                    />
                </div>
        },
    ];

    return {
        t,
        metaData,
        depositsTabs,
        deposit,
        accounts,
        renderTableHeaders,
        renderTableRows,
        resetDepositState,
        getDepositMetaData,
        onSelectTab,
        isLoading,
        handleClickButton
    };
};

export { useDeposit };