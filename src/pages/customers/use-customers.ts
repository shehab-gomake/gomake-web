import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { getAndSetCustomersCategores,getAndSetAgentsCategores,getAndSetAllCustomers} from "@/services/hooks/get-set-customers";


const useCustomers = () => {
    const { callApi } = useGomakeAxios();
    const { t } = useTranslation();
    const [categoryName, setCategoryName] = useState(undefined);
    const [customersCategores, setCustomersCategores] = useState([]);
    const [agentsCategores, setAgentsCategores] = useState([]);
    const [supplierId, setSupplierId] = useState("");
    const [openModal, setOpenModal] = useState(false);

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

    const tabelHeaders = useMemo(
      () => [
        t("Customer Code"),
        t("Name"),
        t("Customer Type"),
        t("Agent"),
        t("Email"),
        t("Fax"),
        t("Mobile"),
        t("Phone1"),
        t("Phone1"),
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

    ///////////////////////// select 1 data //////////////////////////////

    const getAgentsCategores = useCallback(async () => {
      const data = await getAndSetAgentsCategores(
        callApi,
        setAgentsCategores
      );
      if (!categoryName) {
        setCategoryName(data[0]);
      }
    }, [categoryName]);

    useEffect(() => {
      getAgentsCategores();
    }, []);

    ///////////////////////// select 2 data //////////////////////////////

    const getCustomersCategores = useCallback(async () => {
      const data = await getAndSetCustomersCategores(
        callApi,
        setCustomersCategores
      );
      if (!categoryName) {
        setCategoryName(data[0]);
      }
    }, [categoryName]);

    useEffect(() => {
      getCustomersCategores();
    }, []);


   // test table data 
   useEffect(() => {
    getAllCustomers();
  }, [supplierId]);

  
  const getAllCustomers = useCallback(async () => {
    const data = await getAndSetAllCustomers(callApi, setAllCustomers, {
      supplierId,
    });
    return data;
  }, [supplierId]);

  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);


    return {
        tabelHeaders,
        customersCategores,
        agentsCategores,
        categoryName,
        customerTypes,
        statuses,  

        onChangeAgent,
        onChangeCustomer,
        onChangeCustomerType,
        onChangeStatus,

        setAllCustomers,
        allCustomers,
        onChangeSupplier,


      };
    };
    export { useCustomers };
    