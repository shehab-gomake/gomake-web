import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { agentsCategoriesState, clientTypesCategoriesState } from "./customer-states";
import { getAndSetClientTypes } from "@/services/api-service/customers/clientTypes-api";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { getAndSetCustomerById, getAndSetCustomersPagination, toggleCustomerStatus } from "@/services/api-service/customers/customers-api";
import { DEFAULT_VALUES } from "./enums";
import { useSnackBar } from "@/hooks";
export interface IStatus {
  label: string;
  value: string;
}
const useCustomers = (clientType: "C" | "S", pageNumber: number, setPageNumber: Dispatch<SetStateAction<number>>) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allCustomers, setAllCustomers] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [pagesCount, setPagesCount] = useState(0);
  const pageSize = DEFAULT_VALUES.PageSize;
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();

  const tableHeaders = [
    clientType == "C" ? t("customers.customerCode") : t("suppliers.supplierCode"),
    t("customers.name"),
    t("customers.email"),
    t("customers.phone"),
    t("customers.status"),
    t("customers.hashtag"),
  ]
    ;


  const getCustomersRows = useCallback(() => {
    return allCustomers?.map(customer => [customer?.customerCode, customer?.name, customer?.email, customer?.phone, customer?.status, customer?.hashTag])
  }, [allCustomers])

  //select status options
  const statuses = [
    { label: t("customers.active"), value: "true" },
    { label: t("customers.inactive"), value: "false" },
    { label: t("customers.all"), value: "" },
  ];

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
  const [valStatus, setValStatus] = useState<IStatus>({ label: t("customers.active"), value: "true" });  
  
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
  const [clientTypesCategories, setClientTypesCategories] = useRecoilState(clientTypesCategoriesState);
  const getClientTypesCategories = async () => {
    const callBack = (res) => {
      if (res.success) {
        const clientTypes = res.data.map(types => ({
          label: types.text,
          id: types.value
        }));
        setClientTypesCategories(clientTypes);
      }
    }
    await getAndSetClientTypes(callApi, callBack)
  }


  ///////////////////////// select agent //////////////////////////////
  const [agentsCategories, setAgentsCategories] = useRecoilState(agentsCategoriesState);
  const getAgentCategories = async () => {
    const callBack = (res) => {
      if (res.success) {
        const agentNames = res.data.map(agent => ({
          label: agent.text,
          id: agent.value
        }));
        setAgentsCategories(agentNames);
      }
    }
    await getAndSetEmployees2(callApi, callBack, { isAgent: true })
  }

  /////////////////////////  data table  //////////////////////////////
  const [customerForEdit, setCustomerForEdit] = useState([]);
  const getCustomerForEdit = async (id) => {
    const callBack = (res) => {
      if (res.success) {
        let customer = res.data;
        if (customer.contacts && customer.contacts.length > 0) {
          let index = 0;
          customer.contacts.forEach(x => {
            x.index = index;
            index++;
          });
        }
        if (customer.addresses && customer.addresses.length > 0) {
          let index = 0;
          customer.addresses.forEach(x => {
            x.index = index;
            index++;
          });
        }
        if (customer.users && customer.users.length > 0) {
          let index = 0;
          customer.users.forEach(x => {
            x.index = index;
            index++;
          });
        }
        setCustomerForEdit(customer);
        setShowCustomerModal(true)
      }
    }
    await getAndSetCustomerById(callApi, callBack, { customerId: id })
  }

  /////////////////////////  convert to active/inactive  //////////////////////////////
  const updatedStatus = useCallback(async (data: any) => {
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

  /////////////////////////  get All Customers  //////////////////////////////
  const getAllCustomers = useCallback(async () => {
    const data = await getAndSetCustomersPagination(callApi, setAllCustomers, {
      clientType,
      pageNumber,
      pageSize,
      name,
      ClientTypeId,
      agentId,
      isActive,
    }, getCustomerForEdit, updatedStatus, t("usersSettings.active"), t("usersSettings.inactive"));
    setPagesCount(Math.ceil(data / pageSize));
    return data;
  }, [pageNumber, name, ClientTypeId, agentId, isActive]);


  const handleClean = useCallback(async () => {
    setCustomerName("");
    setAgentId(null);
    setAgentName(null);
    setStatus(true);
    setValStatus({ label: t("customers.active"), value: "true" });
    setClientTypeId(null);
    setValClientType(null);
    setPageNumber(1);
  }, []);

  const isValidCustomer = (customer, filteredContacts, filteredAddresses, filteredUsers) => {
    if (!(customer && customer.name && customer.clientTypeId)) {
      return false;
    }
    for (const contact of filteredContacts) {
      if (!contact.firstName) {
        return false;
      }
    }
    for (const address of filteredAddresses) {
      if (!address.address1) {
        return false;
      }
    }
    for (const user of filteredUsers) {
      if (!user.email ) {
        return false;
      }
    }
    //new users
    for (const user of filteredUsers.filter(user => !user.id)) {
      if (!user.password) {
        return false;
      }
    }
    return true;
  };

  return {
    getAgentCategories,
    getClientTypesCategories,
    tableHeaders,
    allCustomers,
    agentsCategories,
    clientTypesCategories,
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
    getCustomersRows,
    ClientTypeId,
    agentId,
    isActive,
    pageSize,
    filters,
    clientType,
    isValidCustomer,
  };
};
export { useCustomers };