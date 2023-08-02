import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { getAndSetAllCustomers, getAndSetCustomer, getAndSetCustomers } from "@/services/hooks/get-set-customers";
import { getAndSetEmployees } from "@/services/hooks/get-set-employee";
import { getAndSetClientTypes } from "@/services/hooks/get-set-clientTypes";

const useCustomers = (clientType, pageNumber) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allCustomers, setAllCustomers] = useState([]);
  const [customerForEdit, setCustomerForEdit] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [pagesCount, setPagesCount] = useState(0);
  const pageSize = 10;

  const tabelHeaders = useMemo(
    () => [
      t("customers.customerCode"),
      t("customers.name"),
      t("customers.email"),
      t("customers.phone"),
      t("customers.status"),
      t("customers.hashtag"),
    ],
    []
  );

  //select agent options
  const [agentsCategores, setAgentsCategores] = useState([]);
  const [customersCategores, setCustomersCategores] = useState([]);


  // select status options
  const statuses = useMemo(
    () => [
      { label: t("customers.active"), value: "true" },
      { label: t("customers.inactive"), value: "false" },
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

  ///////////////////////// select customer + get the number of customers //////////////////////////////

  const getCustomersCategores = useCallback(async () => {
    const data = await getAndSetCustomers(
      callApi,
      setCustomersCategores,
      { ClientType: clientType,
        onlyCreateOrderClients: false }
    );
    const customersNames = data.map(customer => ({
      label: customer.name,
      id: customer.id
    }));
    setCustomersCategores(customersNames);
  }, []);

  useEffect(() => {
    getCustomersCategores();
  }, []);



  /////////////////////////  table data //////////////////////////////
  const getCustomerForEdit = async (id)=> {
    await getAndSetCustomer(callApi, setCustomerForEdit, {
      customerId: id ,
    });
    setShowCustomerModal(true)
  }
  const getAllCustomers = useCallback(async () => {
    const data = await getAndSetAllCustomers(callApi, setAllCustomers, {
      clientType,
      pageNumber,
      pageSize,
      name,
      ClientTypeId,
      agentId,
      isActive,
    },getCustomerForEdit);
    setPagesCount(Math.ceil(data / pageSize));
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
    pagesCount,
    customerForEdit,
    setCustomerForEdit,
    showCustomerModal,
    setShowCustomerModal
  };
};
export { useCustomers };
