import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { getAndSetCustomer, getAndSetAllCustomers } from "@/services/hooks/get-set-customers";
import { getAndSetEmployees } from "@/services/hooks/get-set-employee";
import { getAndSetClientTypes } from "@/services/hooks/get-set-clientTypes";


const useCustomers = (clientType) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [pageNumber, setPageNumber] = useState(0);
  const [allCustomers, setAllCustomers] = useState([]);

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

  //select agent options
  const [agentsCategores, setAgentsCategores] = useState([]);

  // select status options
  const statuses = useMemo(
    () => [
      { label: t("active"), value: "true" },
      { label: t("inactive"), value: "false" },
    ],
    []
  );

  //select customer type options
  const customerTypes = useMemo(
    () => [
      // לקוח
      { label: t("client"), id: "aa0f240c-a370-41f9-9874-378f78bc46bc" },
      // מפיק
      { label: t("producer"), id: "7c561edb-1572-42ac-8c04-980441a4d3fe" },
      // סתאם לקוח
      { label: t("supp"), id: "c53226ad-e75f-49ee-a4b3-261ceb540b48" },
    ],
    []
  );

  const [name, setCustomerName] = useState("");
  const onChangeCustomer = useCallback(async (e: any, value: any) => {
    setCustomerName(e.target.value);
  }, []);

  const [agentId, setAgentId] = useState([]);
  const [agentName, setAgentName] = useState([]);
  const onChangeAgent = useCallback(async (e: any, value: any) => {
    setAgentId(value?.id);
    setAgentName(value?.label);
  }, []);

  const [isActive, setStatus] = useState([]);
  const [valStatus, setValStatus] = useState([]);
  const onChangeStatus = useCallback(async (e: any, value: any) => {
    setStatus(value?.value);
    setValStatus(value?.label);
  }, []);


  const [ClientTypeId, setClientTypeId] = useState([]);
  const [valClientType, setValClientType] = useState([]);
  const onChangeClientType = useCallback(async (e: any, value: any) => {
    setClientTypeId(value?.id);
    setValClientType(value?.label);
  }, []);

  const handleClean = useCallback(async () => {
    setCustomerName("");
    setAgentId(null);
    setAgentName(null);
    setStatus(null);
    setValStatus(null);
    setClientTypeId(null);
    setValClientType(null);
  }, []);


  ///////////////////////// select clientType //////////////////////////////

  const [clientTypesCategores, setClientTypesCategores] = useState([]);

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

  ///////////////////////// select agent //////////////////////////////

  const getAgentCategores = useCallback(async () => {
    const data = await getAndSetEmployees(
      callApi,
      setAgentsCategores,
      { isAgent: true, }
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


  /////////////////////////  table data //////////////////////////////

  const getAllCustomers = useCallback(async () => {
    const data = await getAndSetAllCustomers(callApi, setAllCustomers, {
      clientType,
      pageNumber,
      pageSize: 10,
      name,
      ClientTypeId,
      agentId,
      isActive,
    });
    console.log(data);

    return data;
  }, [pageNumber, name, ClientTypeId, agentId, isActive]);

  useEffect(() => {
    getAllCustomers();
  }, [pageNumber, name, ClientTypeId, agentId, isActive]);

  return {
    tabelHeaders,
    allCustomers,

    agentsCategores,
    clientTypesCategores,
    statuses,

    onChangeCustomer,
    onChangeAgent,
    onChangeClientType,
    onChangeStatus,

    setAllCustomers,
    handleClean,

    name,
    agentName,
    valStatus,
    valClientType,
  };
};
export { useCustomers };
