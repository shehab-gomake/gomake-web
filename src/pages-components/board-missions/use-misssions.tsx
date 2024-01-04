
import { useGomakeAxios } from "@/hooks";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { getAndSetAllCustomers } from "@/services/hooks/cart-side/customers/get-all-customers";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

const useMissions = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const [customersList, setCustomersList] = useState([]);
    const [customerId, setCustomerId] = useState<{}>();
    const [agentId, setAgentId] = useState<{}>();
    const [status, setStatus] = useState<{label:string , value:number}>();
    const [agentsCategories, setAgentsCategories] = useState<[]>();
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const productionStatuses = [
        { label: t("boardMissions.inProduction"), value: "0" },
        { label: t("boardMissions.done"), value: "1" },
      ];

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
      setSelectedValues(newValues);
      console.log("from handle " , newValues)
    };
  

    return {
        tableHeader,
        getAllCustomers,
        getAgentCategories,
        agentsCategories,
        customersList,
        renderOptions,
        setCustomerId,
        customerId,
        setAgentId,
        agentId,
        setStatus,
        status,
        productionStatuses,
        handleMultiSelectChange,
        selectedValues

    };
};

export { useMissions };
