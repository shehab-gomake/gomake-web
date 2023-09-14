import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAndSetCurrency } from "@/services/hooks/get-set-enums";
import { getAndSetEmployees2, getAndSetClientTypes } from "@/services/hooks";

const useCustomersModal = () => {
  const { callApi } = useGomakeAxios();
  const [agentsCategores, setAgentsCategores] = useState([]);
  const [clientTypesCategores, setClientTypesCategores] = useState([]);
  //const [currencyCategores, setCurrencyCategores] = useState([]);


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

  ///////////////////////// select clientType //////////////////////////////
  const getClientTypesCategores = useCallback(async () => {

    const data = await getAndSetClientTypes(
      callApi,
      setClientTypesCategores,
    );
    const clientTypes = data.map(types => ({
      label: `${types.name}`,
      id: types.id
    }));
    setClientTypesCategores(clientTypes);
  }, []);

  useEffect(() => {
    getClientTypesCategores();
  }, []);

  ///////////////////////// select currency //////////////////////////////
  // const getCurrencyCategores = useCallback(async () => {
  //   await getAndSetCurrency(
  //     callApi,
  //     setCurrencyCategores,
  //   );
  // }, []);

  // useEffect(() => {
  //   getCurrencyCategores();
  // }, []);



  return {
    agentsCategores,
    clientTypesCategores
  };
};
export { useCustomersModal };
