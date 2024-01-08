
import { useGomakeAxios } from "@/hooks";
import { useBoardMissionsSignalr } from "@/hooks/signalr/use-board-missions-signalr";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { getAllProductsForDropDownList } from "@/services/hooks";
import { getAndSetAllCustomers } from "@/services/hooks/cart-side/customers/get-all-customers";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PStatus } from "./enums";
import { setBoardMissionsFiltersApi } from "@/services/api-service/board-missions-table/set-borad-missions-filters-api";
import { useDateFormat } from "@/hooks/use-date-format";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { EWorkSource } from "@/widgets/product-pricing-widget/enums";

const useBoardMissions = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { data, connectionId } = useBoardMissionsSignalr();
    const [canOrder, setCanOrder] = useState(false);
    const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
    const [customersListCreateOrder, setCustomersListCreateOrder] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pagesCount, setPagesCount] = useState(0);
    const [customer, setCustomer] = useState<{ label: string, id: string } | null>();
    const [agent, setAgent] = useState<{ label: string, id: string } | null>();
    const [status, setStatus] = useState<{ label: string, value: PStatus } | null>();
    const [agentsCategories, setAgentsCategories] = useState<[]>();
    const [productIds, setProductIds] = useState<string[]>([]);
    const [productsList, setProductsList] = useState([]);
    const [patternSearch, setPatternSearch] = useState<string>();
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [allBoardMissions, setAllBoardMissions] = useState([]);
    const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
    const { GetDateFormat } = useDateFormat();
    const pageSize = DEFAULT_VALUES.PageSize;

    const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
        setResetDatePicker(false);
        setFromDate(fromDate);
        setToDate(toDate);
    }

    const getAgentCategories = async (isAgent: boolean) => {
        const callBack = (res) => {
            if (res.success) {
                const agentNames = res.data.map((agent) => ({
                    label: agent.text,
                    id: agent.value,
                }));
                setAgentsCategories(agentNames);
            }
        };
        await getAndSetEmployees2(callApi, callBack, { isAgent: isAgent });
    };

    const productionStatuses = [
        { label: t("boardMissions.inProduction"), value: PStatus.IN_PROCESS },
        { label: t("boardMissions.done"), value: PStatus.DONE },
    ];

    const tableHeader = [
        // t("boardMissions.image"),
        t("boardMissions.creationDate"),
        t("boardMissions.dueDate"),
        t("boardMissions.clientName"),
        t("boardMissions.missionNumber"),
        t("boardMissions.outSourceType"),
        t("boardMissions.quantity"),
        t("boardMissions.costFromOrderItem"),
        t("boardMissions.priceFromOrderItem"),
        t("boardMissions.jobName"),
        t("boardMissions.numberOfBoardMissionsInOrder"),
        t("boardMissions.productName"),
        t("boardMissions.currentBoardMissionStatus"),
    ];

    const handleMultiSelectChange = (newValues: string[]) => {
        setProductIds(newValues);
    };

    const handleAgentChange = (e: any, value: any) => {
        setAgent(value);
    };

    const handleCustomerChange = (e: any, value: any) => {
        setCustomer(value);
    };
    const handleStatusChange = (e: any, value: any) => {
        setStatus(value);
    };

    const handleClickSearch = () => {
        setPageNumber(1);
        getAllBoardMissions();
    }

    const handleClickClear = () => {
        setAgent(null);
        setCustomer(null);
        setStatus(null);
        setProductIds([]);
        setPatternSearch("");
        setFromDate(null);
        setToDate(null);
        setResetDatePicker(true);
        pageNumber === 1 ? getAllBoardMissionsClear() : setPageNumber(1);
    };

    const onChangeMissionsSearch = (value: string) => {
        setPatternSearch(value);
    }

    const getAllProducts = useCallback(async () => {
        const products = await getAllProductsForDropDownList(callApi, setProductsList);
        setProductsList(products.map(({ id, name }) => ({ label: name, value: id })))
    }, []);

    const getAllBoardMissions = async () => {
        if (connectionId) {
            const callBack = (res) => {
                if (res?.success) {
                    // do nothing
                }
            }
            await setBoardMissionsFiltersApi(callApi, callBack,
                {
                    signalrConnectionId: connectionId,
                    clientId: customer?.id,
                    agentId: agent?.id,
                    search: patternSearch,
                    fromDate: fromDate && GetDateFormat(fromDate),
                    toDate: toDate && GetDateFormat(toDate),
                    productsIds: productIds,
                    productionStatus: status?.value,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                })
        }
    };

    const getAllBoardMissionsClear = async () => {
        if (connectionId) {
            const callBack = (res) => {
                if (res?.success) {
                }
            }
            await setBoardMissionsFiltersApi(callApi, callBack,
                {
                    signalrConnectionId: connectionId,
                    productsIds: [],
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                })
        }
    };

    useEffect(() => {
        const mapData = data?.data?.map((mission: any) => [
            GetDateFormat(mission?.createdDate),
            GetDateFormat(mission?.dueDate),
            mission?.clientName,
            mission?.number,
            EWorkSource[mission?.outSourceType],
            mission?.quantity,
            mission?.cost,
            mission?.price,
            mission?.jobName,
            mission?.numberOfBoardMissions,
            mission?.productName,
            mission?.status
        ]);
        setAllBoardMissions(mapData);
        setPagesCount(Math.ceil(data?.totalItems / pageSize));
        console.log(data)
    }, [data, connectionId]);

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

    useEffect(() => {
        getAllBoardMissions();
    }, [connectionId, pageNumber])

    const handlePageChange = (event, value) => {
        setPageNumber(value);
    };

    return {
        tableHeader,
        getAgentCategories,
        agentsCategories,
        renderOptions,
        customer,
        agent,
        status,
        productionStatuses,
        handleMultiSelectChange,
        productIds,
        productsList,
        getAllProducts,
        handleClickSearch,
        handleClickClear,
        onChangeMissionsSearch,
        allBoardMissions,
        patternSearch,
        handleAgentChange,
        handleStatusChange,
        handleCustomerChange,
        checkWhatRenderArray,
        getAllCustomersCreateQuote,
        getAllCustomersCreateOrder,
        pagesCount,
        pageNumber,
        handlePageChange,
        onSelectDeliveryTimeDates,
        fromDate,
        toDate,
        resetDatePicker
    };
};

export { useBoardMissions };