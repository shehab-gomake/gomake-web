import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { getAndSetCustomers, getAndSetAllCustomers } from "@/services/hooks/get-set-customers";
import { getAndSetAgents } from "@/services/hooks/get-set-agents";


const useCustomers = (clientType) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState(undefined);
  const [agentsCategores, setAgentsCategores] = useState([]);

  const [customersCategores, setCustomersCategores] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [isAgent, setIsAgent] = useState(true);


  // test
  const [allCustomers, setAllCustomers] = useState([]);

  //////////////////////for later use/////////////////////////////
  const [customerId, setCustomerId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [status, setStatus] = useState("");

  const onChangeCustomer = useCallback(async (e: any, value: any) => {
    setCustomerId(value?.value);
  }, []);

  const onChangeAgent = useCallback(async (e: any, value: any) => {
    setAgentId(value?.value);
  }, []);

  const onChangeCustomerType = useCallback(async (e: any, value: any) => {
    setCustomerType(value?.value);
  }, []);

  const onChangeStatus = useCallback(async (e: any, value: any) => {
    setStatus(value?.value);
  }, []);

  //////////////////////for later use/////////////////////////////

  // Fixed data
  const tabelHeaders = useMemo(
    () => [
      t("Customer Code"),
      t("Name"),
      t("Email"),
      t("Phone"),
      t("Status"),
      t("#"),
    ],
    []
  );
  const customerTypes = useMemo(
    () => [
      t("client"),
      t("supplier"),
      t("producer"),
    ],
    []
  );
  const statuses = useMemo(
    () => [
      t("active"),
      t("inactive"),
    ],
    []
  );

  ///////////////////////// select 1  //////////////////////////////

  const getAgentCategores = useCallback(async () => {
    const data = await getAndSetAgents(
      callApi,
      setAgentsCategores,
      isAgent,
    );
    const agentNames = data.map(agent => `${agent.firstname} ${agent.lastname}`);
    setAgentsCategores(agentNames);
  }, []);

  useEffect(() => {
    getAgentCategores();
  }, []);

  ///////////////////////// select 2  //////////////////////////////

  const getCustomersCategores = useCallback(async () => {
    const data = await getAndSetAllCustomers(callApi, setCustomersCategores, {
      clientType,
      pageNumber,
      pageSize: 10,
    });
    const customersNames = data.map(customer => customer.name);
    setCustomersCategores(customersNames);
  }, []);

  useEffect(() => {
    getCustomersCategores();
  }, []);
  
  /////////////////////////  table data  //////////////////////////////

  const getAllCustomers = useCallback(async () => {
    const data = await getAndSetAllCustomers(callApi, setAllCustomers, {
      clientType,
      pageNumber,
      pageSize: 10,
    });
    return data;
  }, [pageNumber]);

  useEffect(() => {
    getAllCustomers();
  }, [pageNumber]);

  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);

  return {
    tabelHeaders,
    customersCategores,
    agentsCategores,
    customerTypes,
    statuses,
    categoryName,
    allCustomers,
    onChangeAgent,
    onChangeCustomer,
    onChangeCustomerType,
    onChangeStatus,
    setAllCustomers,
    onChangeSupplier,
  };
};
export { useCustomers };
