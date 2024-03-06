import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { depositState, newDepositState } from "../deposits/components/states";
import { DEPOSIT_TYPE } from "./enums";
import { ITab } from "@/components/tabs/interface";
import { createDepositApi, getDepositsMetaDataApi } from "@/services/api-service/generic-doc/deposits-api";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useMemo, useState } from "react";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { DepositTabTable } from "./components/tabs-table-prices";
import { useDateFormat } from "@/hooks/use-date-format";
import { Console } from "console";

const useDeposit = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { navigate } = useGomakeRouter();
    const { GetShortDateFormat } = useDateFormat();
    const { alertSuccessAdded, alertFaultAdded, alertFaultGetData } = useSnackBar();
    const [accounts, setAccounts] = useState([]);
    const [depositAccounts, setDepositAccounts] = useState([]);
    const [total, setTotal] = useState<number>(0);
    const [itemsCount, setItemsCount] = useState<number>(0);
    const deposit = useRecoilValue<any>(depositState);
    const [newDeposit, setNewDeposit] = useRecoilState<any>(newDepositState);
    const resetDepositState = useResetRecoilState(depositState);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [balanceDeposits, setBalanceDeposits] = useState<{ checksBalance: number, creditCardBalance: number, cashBalance: number }>({ checksBalance: 0, creditCardBalance: 0, cashBalance: 0 })
    const [newItemsSelected, setNewItemsSelected] = useState([]); // for create
    const [metaData, setMetaData] = useState<any>();
    const [depositMetaData, setDepositMetaData] = useState<any>();

    const onSelectTab = (index: number) => {
        setNewDeposit({ ...newDeposit, balance: renderBalance(index), allocationAccount: renderAccountCode(index) })
        setItemsCount(0);
        setTotal(0);
        setSelectAllChecked(false);
        setNewItemsSelected([]); // resetSelectedItems
        const updatedChecksToDeposit = depositMetaData?.checksToDeposit?.map((deposit) => {
            return {
                ...deposit,
                isChecked: false,
            };
        })
        const updatedDeferredChecksToDeposit = depositMetaData?.deferredChecksToDeposit?.map((deposit) => {
            return {
                ...deposit,
                isChecked: false,
            };
        })
        const updatedCashReceiptsToDeposit = depositMetaData?.cashReceiptsToDeposit?.map((deposit) => {
            return {
                ...deposit,
                isChecked: false,
            };
        });
        const updatedCreditsToDeposit = depositMetaData?.creditCardsToDeposit?.map((deposit) => {
            return {
                ...deposit,
                isChecked: false,
            };
        });
        setDepositMetaData((prevMetaData) => ({
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

    /////// handle CheckBox ///////
    const handleChecksCheckboxChange = (index, depositItem) => (event) => {
        const isChecked = event.target.checked;
        const checksTotal = Number(depositItem?.checkAmount) || 0;
        setTotal((prevTotal) => isChecked ? prevTotal + checksTotal : prevTotal - checksTotal);
        setItemsCount((prevCount) => isChecked ? prevCount + 1 : prevCount - 1);
        setDepositMetaData((prevMetaData) => {
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
        setDepositMetaData((prevMetaData) => {
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
        // const cashSum = Number(depositItem?.cashSum) || 0;
        //   setTotal((prevTotal) => isChecked ? prevTotal + cashSum : prevTotal - cashSum);
        setItemsCount((prevCount) => isChecked ? prevCount + 1 : prevCount - 1);
        setDepositMetaData((prevMetaData) => {
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
        setDepositMetaData((prevMetaData) => {
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
    /////// handle CheckBox ///////

    const getDepositMetaData = async () => {
        const callBack = (res) => {
            if (res?.success) {
                setIsLoading(false);
                const metaData = res?.data;
                const depositMetaData = res?.data?.depositMetaData;
                setMetaData(metaData)
                setAccounts(depositMetaData?.accounts);
                setDepositAccounts(metaData?.depositAccounts);
                const cashSumTotal = depositMetaData?.cashReceiptsToDeposit?.reduce((total, deposit) => {
                    return total + (deposit?.cashSum || 0);
                }, 0);
                const checksSumTotal = ((depositMetaData?.checksToDeposit || []).concat(depositMetaData?.deferredChecksToDeposit || [])).reduce((total, deposit) => {
                    return total + (deposit?.checkAmount || 0);
                }, 0);
                const creditSumTotal = depositMetaData?.creditCardsToDeposit?.reduce((total, deposit) => {
                    return total + (deposit?.total || 0);
                }, 0);
                setBalanceDeposits({
                    cashBalance: cashSumTotal,
                    checksBalance: checksSumTotal,
                    creditCardBalance: creditSumTotal
                });
                setNewDeposit({ ...res?.data?.erpDeposit, balance: checksSumTotal, allocationAccount: "71100", depositAccount: metaData?.depositAccounts[0].code })

                const updatedCashReceipts = depositMetaData?.cashReceiptsToDeposit?.map(cashReceipt => {
                    return {
                        ...cashReceipt,
                        cashSumOriginal: cashReceipt.cashSum
                    };
                });

                setDepositMetaData({
                    ...depositMetaData,
                    cashReceiptsToDeposit: updatedCashReceipts
                });
            }
            else {
                alertFaultGetData();
            }
        };
        await getDepositsMetaDataApi(callApi, callBack);
    };

    const createDeposit = async (labelArray: string) => {
        if (itemsCount === 0) {
            alertFaultAdded();
            return;
        }
        const metaDataCopy = {
            ...metaData,
            erpDeposit: { ...newDeposit, depositType: renderDepositType(labelArray), cashAmount: updatedTotal },
            depositMetaData: {
                accounts: metaData.depositMetaData.accounts,
                [labelArray]: newItemsSelected
            }
        }
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessAdded();
                navigate(`/deposits`)
            }
            else {
                alertFaultAdded();
            }
        };
        await createDepositApi(callApi, callBack, metaDataCopy);
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

    const renderAccountCode = (tabIndex: number) => {
        switch (tabIndex) {
            case (0):
                return "71100";
            case (DEPOSIT_TYPE.Checks):
                return "71100";
            case (DEPOSIT_TYPE.CreditCard):
                return "73601";
            case (DEPOSIT_TYPE.Cash):
                return "71101";
            default:
                return 0;
        }
    };

    const renderDepositType = (labelArray: string) => {
        switch (labelArray) {
            case ("checksToDeposit"):
                return DEPOSIT_TYPE.Checks;
            case ("creditCardsToDeposit"):
                return DEPOSIT_TYPE.CreditCard;
            case ("cashReceiptsToDeposit"):
                return DEPOSIT_TYPE.Cash;
        }
    };

    const handleCashInputChange = (index, value) => {
        const updatedCashReceiptsToDeposit = [...depositMetaData.cashReceiptsToDeposit];
        updatedCashReceiptsToDeposit[index] = {
            ...updatedCashReceiptsToDeposit[index],
            cashSum: value,
        };
        setDepositMetaData((prevMetaData) => ({
            ...prevMetaData,
            cashReceiptsToDeposit: updatedCashReceiptsToDeposit,
        }));

        const depositItem = updatedCashReceiptsToDeposit[index];
        const isChecked = depositItem.isChecked || false;


        setNewItemsSelected((prevSelectedItems) => {
            if (isChecked) {
                const updatedSelectedItems = prevSelectedItems.map((item) =>
                    item.id === depositItem.id ? depositItem : item
                );
                return updatedSelectedItems;
            } else {
                return prevSelectedItems.filter((item) => item.id !== depositItem.id);
            }
        });
    };

    const mapDepositsData = {
        cash: useMemo(() => {
            return depositMetaData?.cashReceiptsToDeposit?.map((deposit: any, index: number) => {
                const isChecked = deposit.isChecked || false;
                return [
                    <Checkbox
                        key={`${index}-cash-checkBox`}
                        icon={<CheckboxIcon />}
                        checkedIcon={<CheckboxCheckedIcon />}
                        onChange={handleCashCheckboxChange(index, deposit)}
                        checked={isChecked}
                    />,
                    GetShortDateFormat(deposit?.dueDate),
                    "test",
                    deposit?.client?.name,
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2px", }}>
                        <input
                            style={{ width: "100px" }}
                            type="text"
                            value={deposit?.cashSum}
                            onChange={(e) => handleCashInputChange(index, e.target.value)}
                        />{t("deposits.from")}<span>{deposit?.cashSumOriginal}</span>
                    </div>,
                ];
            });
        }, [depositMetaData]),
        deferredChecks: useMemo(() => {
            return depositMetaData?.deferredChecksToDeposit?.map((deposit: any, index: number) => {
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
        }, [depositMetaData]),
        checks: useMemo(() => {
            return depositMetaData?.checksToDeposit?.map((deposit: any, index: number) => {
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
        }, [depositMetaData]),
        credit: useMemo(() => {
            return depositMetaData?.creditCardsToDeposit?.map((deposit: any, index: number) => {
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
        }, [depositMetaData]),
    };

    const updatedTotal = useMemo(() => {
        let newTotal = 0;
        mapDepositsData?.cash?.forEach((data, index) => {
            const depositItem = depositMetaData?.cashReceiptsToDeposit[index];
            newTotal += depositItem?.isChecked ? Number(depositItem?.cashSum) || 0 : 0;
        });
        return (newTotal);
    }, [depositMetaData])


    const depositsTabs: ITab[] = [
        {
            title: t("deposits.checks"),
            component:
                <DepositTabTable
                    tableHeaders={checksTabHeaders}
                    tableRows={mapDepositsData.checks}
                    itemsCount={itemsCount}
                    total={total}
                    handleSelectAll={() => handleSelectAllChange(mapDepositsData.checks, "checksToDeposit", handleChecksCheckboxChange, "checkAmount", depositMetaData)}
                    selectAllChecked={selectAllChecked}
                    onClickMakePayment={() => createDeposit("checksToDeposit")}

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
                    handleSelectAll={() => handleSelectAllChange(mapDepositsData.deferredChecks, "deferredChecksToDeposit", handleDeferredChecksCheckboxChange, "checkAmount", depositMetaData)}
                    selectAllChecked={selectAllChecked}
                    onClickMakePayment={() => createDeposit("checksToDeposit")}
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
                    handleSelectAll={() => handleSelectAllChange(mapDepositsData.credit, "creditCardsToDeposit", handleCreditCheckboxChange, "total", depositMetaData)}
                    selectAllChecked={selectAllChecked}
                    onClickMakePayment={() => createDeposit("creditCardsToDeposit")}

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
                        total={updatedTotal}
                        handleSelectAll={() => handleSelectAllChange(mapDepositsData.cash, "cashReceiptsToDeposit", handleCashCheckboxChange, "cashSum", depositMetaData)}
                        selectAllChecked={selectAllChecked}
                        onClickMakePayment={() => createDeposit("cashReceiptsToDeposit")}
                    />
                </div>
        },
    ];

    return {
        t,
        depositsTabs,
        deposit,
        accounts,
        depositAccounts,
        renderTableHeaders,
        renderTableRows,
        resetDepositState,
        getDepositMetaData,
        onSelectTab,
        isLoading,
    };
};

export { useDeposit };