import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { getAndSetCustomer, getAndSetAllCustomers } from "@/services/hooks/get-set-customers";
import { getAndSetEmployees } from "@/services/hooks/get-set-employee";


const useCustomers = (clientType) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState(undefined);
  const [agentsCategores, setAgentsCategores] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [allCustomers, setAllCustomers] = useState([]);

  const [agentId, setAgentId] = useState("");
  const onChangeAgent = useCallback(async (e: any, value: any) => {
    setAgentId(value?.value);
  }, []);

  const [name, setCustomerName] = useState("");
  const onChangeCustomer = useCallback(async (e: any, value: any) => {
    setCustomerName(e.target.value);
    setValName(e.target.value);
  }, []);

  const [isActive, setStatus] = useState(true);
  const onChangeStatus = useCallback(async (e: any, value: any) => {
    if (value === "inactive") {
      setStatus(false);
    }
    else { setStatus(true) }
  }, []);

  /////////////////////////////////////////

  const [valAgent, setValAgent] = useState(false);
  const [valStatus, setValStatus] = useState("");
  const [valName, setValName] = useState(undefined);
  const [valCustomerType, setValCustomerType] = useState(undefined);


  const handleClean = useCallback(async () => {
    setStatus(null);
    setCustomerName(null);
    setAgentId(null);
    setCustomerType(null);

  }, []);

  /////////////////////////////////////////

  //////////////////////for later use/////////////////////////////
  const [customerType, setCustomerType] = useState("");

  const onChangeCustomerType = useCallback(async (e: any, value: any) => {
    setCustomerType(value?.value);
  }, []);


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

  ///////////////////////// select agent //////////////////////////////

  const getAgentCategores = useCallback(async () => {
    const data = await getAndSetEmployees(
      callApi,
      setAgentsCategores,
      {isAgent: true,}
    );
    const agentNames = data.map(agent => `${agent.firstname} ${agent.lastname}`);
    setAgentsCategores(agentNames);
  }, []);

  useEffect(() => {
    getAgentCategores();
  }, []);

  /////////////////////////  table data //////////////////////////////

  const getAllCustomers = useCallback(async () => {
    const data = await getAndSetAllCustomers(callApi, setAllCustomers, {
      clientType,
      pageNumber,
      pageSize: 10,
      name,
      agentId,
      isActive,
    });
    return data;
  }, [pageNumber, name, agentId, isActive]);

  useEffect(() => {
    getAllCustomers();
  }, [pageNumber, name, agentId, isActive]);

  return {
    tabelHeaders,
    agentsCategores,
    customerTypes,
    statuses,
    allCustomers,
    onChangeAgent,
    onChangeCustomer,
    onChangeCustomerType,
    onChangeStatus,
    setAllCustomers,
    handleClean,
    valAgent,
    valName,
    valStatus,
  };
};
export { useCustomers };
