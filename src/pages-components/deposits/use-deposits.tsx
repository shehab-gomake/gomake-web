import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import { cancelDepositApi, getAllDepositsApi, showDepositApi } from "@/services/api-service/generic-doc/deposits-api";
import { useDateFormat } from "@/hooks/use-date-format";
import { MoreMenuWidget } from "./more-circle";
import { allDepositsState, depositPaymentTypeSate, depositState, depositsFromDateState, depositsPageCountState, depositsPageSizeState, depositsPageState, depositsToDateState } from "./components/states";
import { DEPOSIT_TYPE, PAYMENT_TYPE } from "../deposit/enums";
import { useDebounce } from "@/utils/use-debounce";

const useDeposits = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { navigate } = useGomakeRouter();
    const { alertFaultDelete, alertSuccessDelete, alertFaultGetData } = useSnackBar();
    const { GetDateFormat , GetShortDateFormat} = useDateFormat();
    const [page, setPage] = useRecoilState<number>(depositsPageState);
    const resetPage = useResetRecoilState(depositsPageState);
    const [pagesCount, setPagesCount] = useRecoilState<number>(depositsPageCountState);
    const [pageSize, setPageSize] = useRecoilState<number>(depositsPageSizeState);
    const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
    const [fromDate, setFromDate] = useRecoilState<Date>(depositsFromDateState);
    const [toDate, setToDate] = useRecoilState<Date>(depositsToDateState);
    const [allDeposits, setAllDeposits] = useRecoilState<any>(allDepositsState);
    const setDeposit = useSetRecoilState<any>(depositState);
    const [depositPaymentType, setDepositPaymentType] = useRecoilState<any>(depositPaymentTypeSate);
    const [patternSearch, setPatternSearch] = useState("");
    const [finalPatternSearch, setFinalPatternSearch] = useState("");
    const debounce = useDebounce(patternSearch, 500);

    const handlePageSizeChange = (event) => {
        setPage(1);
        setPageSize(event.target.value);
    };

    const onSelectDateRange = (fromDate: Date, toDate: Date) => {
        setResetDatePicker(false);
        setFromDate(fromDate);
        setToDate(toDate);
    };

    const tableHeaders = [
        t("deposits.creationDate"),
        t("deposits.depositNumber"),
        t("deposits.accountNumber"),
        t("deposits.status"),
        t("deposits.typeOfDeposit"),
        t("deposits.depositAmount"),
        t("properties.more")
    ];

    const typeOfDeposit = [
        { label: t("payment.cash"), value: PAYMENT_TYPE.Cash },
        { label: t("payment.check"), value: PAYMENT_TYPE.Checks },
        { label: t("payment.creditCard"), value: PAYMENT_TYPE.CreditCard }
    ];

    const getDepositTypeText = (typeNum: number) => {
        switch (typeNum) {
            case (DEPOSIT_TYPE.Checks):
                return t("payment.check");
            case (DEPOSIT_TYPE.CreditCard):
                return t("payment.creditCard");
            case (DEPOSIT_TYPE.Cash):
                return t("payment.cash");
        }
    };

    const getDepositStatusText = (status: any) => {
        switch (status) {
            case (true):
                return t("sales.quote.canceled");
            default:
                return t("deposits.open");
        }
    };

    const getAllDeposits = async (isClear = false) => {
        const callBack = (res) => {
            if (res?.success) {
                const data = res?.data?.data;
                const totalItems = res?.data?.totalItems;
                const mapData = data?.map((deposit: any) => [
                    GetShortDateFormat(deposit?.createdDate),
                    deposit?.number,
                    deposit?.accountNumber,
                    getDepositStatusText(deposit?.isCanceled),
                    getDepositTypeText(deposit?.depositType),
                    deposit?.totalAmount,
                    <MoreMenuWidget deposit={deposit} onClickShowDeposit={() => getDepositBYId(deposit?.id)} onClickCancel={() => cancelDeposit(deposit?.id)} />
                ]);
                setAllDeposits(mapData);
                setPagesCount(Math.ceil(totalItems / (pageSize)));
            }
        };
        await getAllDepositsApi(callApi, callBack,
            isClear ?
                {
                    model: {
                        pageNumber: page,
                        pageSize: pageSize,
                    }
                }
                :
                {
                    model: {
                        pageNumber: page,
                        pageSize: pageSize,
                    },
                    patternSearch: finalPatternSearch,
                    fromDate: fromDate && GetDateFormat(fromDate),
                    toDate: toDate && GetDateFormat(toDate),
                    paymentType: depositPaymentType?.value
                }
        );
    };

    const getDepositBYId = async (depositId: string) => {
        const callBack = (res) => {
            if (res?.success) {
                const data = res?.data;
                const cashDepositData = [
                    GetDateFormat(data?.depositDate),
                    data?.receiptNumber,
                    data?.depositor,
                    data?.cashAmount,
                ];
                const creditDepositData = data?.creditCards?.map((deposit: any) => [
                    deposit?.payDate,
                    deposit?.voucherNumber,
                    deposit?.customer,
                    deposit?.total,
                ]);
                const checksDepositData = data?.checks?.map((deposit: any) => [
                    GetDateFormat(deposit?.checkDate),
                    deposit?.customer,
                    deposit?.checkNumber,
                    deposit?.bank,
                    deposit?.branch,
                    deposit?.receiptsNumber,
                    deposit?.checkAmount,
                ]);
                const newData = {
                    ...data,
                    cashDepositData,
                    creditDepositData,
                    checksDepositData
                };
                setDeposit(newData);
                navigate(`/deposits/show?id=${data?.id}`);
            }
            else {
                alertFaultGetData();
            }
        };
        await showDepositApi(callApi, callBack, { Id: depositId });
    };

    const cancelDeposit = async (depositId: string) => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessDelete();
                getAllDeposits();
            }
            else {
                alertFaultDelete();
            }
        };
        await cancelDepositApi(callApi, callBack, { Id : depositId });
    };

    const handleDepositTypeChange = (e: any, value: any) => {
        setDepositPaymentType(value);
    };

    const onClickSearchFilter = () => {
        resetPage();
        getAllDeposits();
    };

    const onClickClearFilter = () => {
        setDepositPaymentType(null);
        setFromDate(null);
        setToDate(null);
        setResetDatePicker(true);
        resetPage();
        getAllDeposits(true);
    };

    const handleSearchChange = (e) => {
        setPatternSearch(e)
    };

    useEffect(() => {
        setFinalPatternSearch(debounce);
    }, [debounce]);

    return {
        page,
        setPage,
        pagesCount,
        pageSize,
        handlePageSizeChange,
        tableHeaders,
        onSelectDateRange,
        resetDatePicker,
        typeOfDeposit,
        depositPaymentType,
        handleDepositTypeChange,
        getAllDeposits,
        allDeposits,
        onClickSearchFilter,
        onClickClearFilter,
        setPatternSearch,
        finalPatternSearch,
        handleSearchChange
    };
};

export { useDeposits };