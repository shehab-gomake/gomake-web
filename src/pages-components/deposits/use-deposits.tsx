import { useGomakeAxios } from "@/hooks";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAndSetAllCustomers } from "@/services/hooks";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { useRecoilState, useSetRecoilState } from "recoil";
import { agentsCategoriesState } from "@/pages/customers/customer-states";
import { employeesListsState } from "../quotes/states";

const useDeposits = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const [page, setPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_VALUES.PageSize);
    const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();


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
        {label:t("payment.check") , value : 1},
        {label:t("payment.cash") , value : 2},
        {label:t("payment.creditCard") , value : 3},
    ];

    const onClickClearFilter = () => {
        setAgentId(null);
        setCustomerId(null);
        setTypeId(null);
        setDepositNumber("");
        setFromDate(null);
        setToDate(null);
        setResetDatePicker(true);
        setPage(1);
      };
    

    //////////////////////////// FILTERS ////////////////////////////////////

    const [customerId, setCustomerId] = useState<any>();
    const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
    const [customersListCreateOrder, setCustomersListCreateOrder] = useState([]);
    const [canOrder, setCanOrder] = useState(false);
    const [agentId, setAgentId] = useState<any>();
    const [agentsCategories, setAgentsCategories] = useRecoilState(agentsCategoriesState);
    const setEmployeeListValue = useSetRecoilState<string[]>(employeesListsState);
    const [typeId, setTypeId] = useState<any>();
    const [depositNumber, setDepositNumber] = useState<string>();


    const handleCustomerChange = (e: any, value: any) => {
        setCustomerId(value);
    };

    const handleAgentChange = (e: any, value: any) => {
        setAgentId(value);
    };

    const handleDepositTypeChange = (e: any, value: any) => {
        setTypeId(value);
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
        typeId,
        handleDepositTypeChange,
        onClickClearFilter,
        depositNumber,
        handleDepositNumberChange
    };
};

export { useDeposits };
