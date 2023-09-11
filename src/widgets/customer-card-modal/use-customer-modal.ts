import { useCallback, useEffect,  useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAndSetCurrency } from "@/services/hooks/get-set-enums";
import { getAndSetEmployees2} from "@/services/hooks";

const useCustomersModal = () => {
  const { callApi } = useGomakeAxios();
  const [agentsCategores, setAgentsCategores] = useState([]);


  ///////////////////////// select agent //////////////////////////////

  const getAgentCategores = useCallback(async () => {
    const data = await getAndSetEmployees2(
      callApi,
      setAgentsCategores,
      { isAgent: true }
    );
    const agentNames = data.map(agent => ({
      label: `${agent.firstname} ${agent.lastname}`,
      id: agent.id
    }));
    setAgentsCategores(agentNames);
  }, []);

  useEffect(() => {
    getAgentCategores();
  }, []);

  ///////////////////////// select currency //////////////////////////////
  
  const [currencyCategores, setCurrencyCategores] = useState([]);
  const getCurrencyCategores = useCallback(async () => {
    await getAndSetCurrency(
      callApi,
      setCurrencyCategores,
    );
  }, []);

  useEffect(() => {
    getCurrencyCategores();
  }, []);


  return {
    currencyCategores,
    agentsCategores
  };
};
export { useCustomersModal };
