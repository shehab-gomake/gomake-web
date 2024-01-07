
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


const useBoardMissions = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { data, connectionId } = useBoardMissionsSignalr();
    const [customer, setCustomer] = useState<{ label: string, id: string } | null>();
    const [agent, setAgent] = useState<{ label: string, id: string } | null>();
    const [status, setStatus] = useState<{ label: string, value: PStatus } | null>();
    const [customersList, setCustomersList] = useState([]);
    const [agentsCategories, setAgentsCategories] = useState<[]>();
    const [productIds, setProductIds] = useState<string[]>([]);
    const [productsList, setProductsList] = useState([]);
    const [patternSearch, setPatternSearch] = useState<string>();
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [allBoardMissions, setAllBoardMissions] = useState([]);
    const { GetDateFormat } = useDateFormat();


    const getAllCustomers = useCallback(async (SearchTerm?) => {
        await getAndSetAllCustomers(callApi, setCustomersList, {
            ClientType: "C",
            onlyCreateOrderClients: false,
            searchTerm: SearchTerm,
        });
    }, []);

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

    const renderOptions = () => {
        return customersList;
    };

    const productionStatuses = [
        { label: t("boardMissions.inProduction"), value: PStatus.IN_PROCESS },
        { label: t("boardMissions.done"), value: PStatus.DONE },
    ];

    const tableHeader = [
        t("boardMissions.image"),
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

    const handleClickSearch = () => {
        getAllBoardMissions();
    }

    const handleClickClear = () => {
        setAgent(null);
        setCustomer(null);
        setStatus(null);
        setPatternSearch("");
        getAllBoardMissionsClear();
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
                    fromDate: fromDate,
                    toDate: toDate,
                    productsIds: productIds,
                    productionStatus: status?.value,
                    pageNumber: 1,
                    pageSize: 20,
                })
        }
    };

    const getAllBoardMissionsClear = async () => {
        if (connectionId) {
            const callBack = (res) => {
                if (res?.success) {
                    // do nothing
                }
            }
            await setBoardMissionsFiltersApi(callApi, callBack,
                {
                    signalrConnectionId: connectionId,
                    productsIds: [],
                    pageNumber: 1,
                    pageSize: 20,
                })
        }
    };

    useEffect(() => {
        handleClickSearch();
    }, [connectionId]);

    useEffect(() => {
        const mapData = data?.data?.map((mission: any) => [
            "image test",
            GetDateFormat(mission?.createdDate),
            GetDateFormat(mission?.dueDate),
            mission?.clientName,
            mission?.number,
            mission?.outSourceType,
            mission?.quantity,
            mission?.cost,
            mission?.price,
            "job name test",
            "test",
            mission?.productName,
            mission?.status
        ]);
        setAllBoardMissions(mapData);
    }, [data, connectionId]);

    return {
        tableHeader,
        getAllCustomers,
        getAgentCategories,
        agentsCategories,
        customersList,
        renderOptions,
        setCustomer,
        customer,
        setAgent,
        agent,
        setStatus,
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
    };
};

export { useBoardMissions };