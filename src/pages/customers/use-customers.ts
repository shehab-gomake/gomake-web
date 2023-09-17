import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { getAndSetCustomerById, getAndSetCustomersPagination } from "@/services/hooks/get-set-customers";
import { getAndSetClientTypes } from "@/services/hooks/get-set-clientTypes";
import { getAndSetAllCustomers, getAndSetEmployees2 } from "@/services/hooks";

const useCustomers = (clientType, pageNumber, setPageNumber) => {
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

  const getCustomersRows = useCallback(()=> {
    return allCustomers.map(customer => [customer?.customerCode, customer?.name, customer?.email, customer?.phone, customer?.status, customer?.hashTag])
  }, [allCustomers])

  //select agent options
  const [agentsCategores, setAgentsCategores] = useState([]);
  const [customersCategores, setCustomersCategores] = useState([]);

  //select status options
  const statuses = useMemo(
    () => [
      { label: t("customers.active"), value: "true" },
      { label: t("customers.inactive"), value: "false" },
      { label: t("customers.all"), value: "" },
    ],
    []
  );

  const [name, setCustomerName] = useState("");
  const onChangeCustomer = useCallback((value: string) => {
    setPageNumber(1);
    setCustomerName(value);
  }, []);

  const [agentId, setAgentId] = useState([]);
  const [agentName, setAgentName] = useState([]);
  const onChangeAgent = useCallback(async (e: any, value: any) => {
    setPageNumber(1);
    setAgentId(value?.id);
    setAgentName(value?.label);
  }, []);

  const [isActive, setStatus] = useState(true);
  const [valStatus, setValStatus] = useState([]);
  const onChangeStatus = useCallback(async (e: any, value: any) => {
    setPageNumber(1);
    setStatus(value?.value);
    setValStatus(value?.label);
  }, []);

  const [ClientTypeId, setClientTypeId] = useState([]);
  const [valClientType, setValClientType] = useState([]);
  const onChangeClientType = useCallback(async (e: any, value: any) => {
    setPageNumber(1);
    setClientTypeId(value?.id);
    setValClientType(value?.label);
  }, []);


  const [filters, setFilters] = useState({
    clientType,
    pageNumber,
    pageSize,
    name,
    ClientTypeId,
    agentId,
    isActive,
  });

  ///////////////////////// select clientType //////////////////////////////
  const [clientTypesCategores, setClientTypesCategores] = useState([]);
  const getClientTypesCategores = useCallback(async () => {

    const data = await getAndSetClientTypes(
      callApi,
      setClientTypesCategores,
    );
    const clientTypes = data.map(types => ({
      label: types.text, 
      id: types.value    
    }));
    setClientTypesCategores(clientTypes);
  }, []);

  useEffect(() => {
    getClientTypesCategores();
  }, []);

  ///////////////////////// select agent //////////////////////////////

  const getAgentCategores = useCallback(async () => {
    const data = await getAndSetEmployees2(
      callApi,
      setAgentsCategores,
      { isAgent: true }
    );
    const agentNames = data.map(agent => ({
      label: agent.text, 
      id: agent.value    
    }));
    setAgentsCategores(agentNames);
  }, []);

  useEffect(() => {
    getAgentCategores();
  }, []);

  ///////////////////////// select customer + get the number of customers //////////////////////////////
  const getCustomersCategores = useCallback(async () => {
    const data = await getAndSetAllCustomers(
      callApi,
      setCustomersCategores,
      {
        ClientType: clientType,
        onlyCreateOrderClients: false
      }
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

  /////////////////////////  data table  //////////////////////////////

  const getCustomerForEdit = async (id) => {
    await getAndSetCustomerById(callApi, setCustomerForEdit, {
      customerId: id,
    });
    setShowCustomerModal(true)
  }

  const updatedStatus = useCallback(async (data: any, filters) => {
    const res: any = await callApi(
      "PUT",
      "/v1/crm-service/customer/update-customer-status",
      {
        Id: data.id,
        status: !data?.isActive,
      }
    );
    if (res?.success) {
      setFilters((prevFilters) => ({
        ...prevFilters,
      }));  
          return true;
    } else {
      return false;
    }
  }, []);

  const getAllCustomers = useCallback(async () => {
    const data = await getAndSetCustomersPagination(callApi, setAllCustomers, {
      clientType,
      pageNumber,
      pageSize,
      name,
      ClientTypeId,
      agentId,
      isActive,
    }, getCustomerForEdit, updatedStatus);
    setPagesCount(Math.ceil(data / pageSize));
    return data;
  }, [pageNumber, name, ClientTypeId, agentId, isActive]);

  useEffect(() => {
    getAllCustomers();
  }, [filters, clientType, pageNumber, pageSize, name, ClientTypeId, agentId, isActive]);

  const handleClean = useCallback(async () => {
    setCustomerName("");
    setAgentId(null);
    setAgentName(null);
    setStatus(true);
    setValStatus(null);
    setClientTypeId(null);
    setValClientType(null);
    setPageNumber(1);
  }, []);

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
    setShowCustomerModal,
    getCustomerForEdit,
    getAllCustomers,
    updatedStatus,
    getCustomersRows
  };
};
export { useCustomers };
