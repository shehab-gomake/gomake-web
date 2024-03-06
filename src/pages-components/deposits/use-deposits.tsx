import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAndSetAllCustomers } from "@/services/hooks";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import { agentsCategoriesState } from "@/pages/customers/customer-states";
import { employeesListsState } from "../quotes/states";
import { getAllDepositsApi, showDepositApi } from "@/services/api-service/generic-doc/deposits-api";
import { useDateFormat } from "@/hooks/use-date-format";
import { MoreMenuWidget } from "./more-circle";
import { allDepositsState, depositPaymentTypeSate, depositState, depositsFromDateState, depositsPageCountState, depositsPageSizeState, depositsPageState, depositsToDateState } from "./components/states";
import { DEPOSIT_TYPE, PAYMENT_TYPE } from "../deposit/enums";

const useDeposits = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { navigate } = useGomakeRouter();
    const { GetDateFormat, GetShortDateFormat } = useDateFormat();
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

    const getAllDeposits = async (isClear = false) => {
        const callBack = (res) => {
            if (res?.success) {
                const data = res?.data?.data;
                const totalItems = res?.data?.totalItems;
                const mapData = data?.map((deposit: any) => [
                    deposit?.createdDate,
                    deposit?.number,
                    deposit?.accountNumber,
                    deposit?.number,
                    getDepositTypeText(deposit?.depositType),
                    deposit?.totalAmount,
                    <MoreMenuWidget onClickShowDeposit={(depositId) => getDepositBYId(deposit?.id)} />
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
                    patternSearch: "",
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
                    data?.cashAmount,
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
                    // deposit?.clientName,
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

            }
        };
        await showDepositApi(callApi, callBack, { Id: depositId });
    };

    const handleDepositTypeChange = (e: any, value: any) => {
        setDepositPaymentType(value);
    };

    const onClickSearchFilter = () => {
        resetPage();
        getAllDeposits();
    };

    const onClickClearFilter = () => {
        setAgentId(null);
        setCustomerId(null);
        setDepositPaymentType(null);
        setDepositNumber("");
        setFromDate(null);
        setToDate(null);
        setResetDatePicker(true);
        resetPage();
        getAllDeposits(true);
    };
    //////////////////////////// FILTERS ////////////////////////////////////

    const [customerId, setCustomerId] = useState<any>();
    const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
    const [customersListCreateOrder, setCustomersListCreateOrder] = useState([]);
    const [canOrder, setCanOrder] = useState(false);
    const [agentId, setAgentId] = useState<any>();
    const [agentsCategories, setAgentsCategories] = useRecoilState(agentsCategoriesState);
    const [depositNumber, setDepositNumber] = useState<string>();
    const setEmployeeListValue = useSetRecoilState<string[]>(employeesListsState);


    const handleCustomerChange = (e: any, value: any) => {
        setCustomerId(value);
    };

    const handleAgentChange = (e: any, value: any) => {
        setAgentId(value);
    };


    const handleDepositNumberChange = (e: any) => {
        setDepositNumber(e.target.value);
    };

    const renderOptions = () => {
        if (!!canOrder) {
            return customersListCreateOrder;
        } else return customersListCreateQuote;
    };

    const getAllCustomersCreateQuote = useCallback(async () => {
        await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
            ClientType: "C",
            onlyCreateOrderClients: false,
        });
    }, []);

    const getAllCustomersCreateOrder = useCallback(async () => {
        await getAndSetAllCustomers(callApi, setCustomersListCreateOrder, {
            ClientType: "C",
            onlyCreateOrderClients: true,
        });
    }, []);

    const checkWhatRenderArray = (e) => {
        if (e.target.value) {
            setCanOrder(true);
        } else {
            setCanOrder(false);
        }
    };

    const getAgentCategories = async (isAgent: boolean, setState: any) => {
        const callBack = (res) => {
            if (res.success) {
                const agentNames = res.data.map((agent) => ({
                    label: agent.text,
                    id: agent.value,
                }));
                setState(agentNames);
            }
        };
        await getAndSetEmployees2(callApi, callBack, { isAgent: isAgent });
    };

    //////////////////////////// FILTERS ////////////////////////////////////


    return {
        page,
        setPage,
        pagesCount,
        pageSize,
        handlePageSizeChange,
        tableHeaders,
        getAllCustomersCreateQuote,
        getAllCustomersCreateOrder,
        getAgentCategories,
        setAgentsCategories,
        setEmployeeListValue,
        renderOptions,
        checkWhatRenderArray,
        customerId,
        handleCustomerChange,
        agentId,
        handleAgentChange,
        agentsCategories,
        onSelectDateRange,
        resetDatePicker,
        typeOfDeposit,
        depositPaymentType,
        handleDepositTypeChange,
        depositNumber,
        handleDepositNumberChange,
        getAllDeposits,
        allDeposits,
        onClickSearchFilter,
        onClickClearFilter
    };
};

export { useDeposits };
