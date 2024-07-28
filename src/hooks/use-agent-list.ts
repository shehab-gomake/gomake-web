import { useEffect, useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";

const useAgentsList = () => {
  const { callApi } = useGomakeAxios();
  const [agentsCategories, setAgentsCategories] = useState<[]>();
  const [agent, setAgent] = useState<{ label: string; id: string } | null>();
  const handleAgentChange = (e: any, value: any) => {
    setAgent(value);
  };

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

  useEffect(() => {
    getAgentCategories(true);
  }, []);

  return {
    agent,
    setAgent,
    agentsCategories,
    handleAgentChange,
    getAgentCategories
  };
};

export { useAgentsList };
