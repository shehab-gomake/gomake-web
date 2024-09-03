import { useGomakeAxios } from "@/hooks";
import { useEffect, useState } from "react";

const usePrintHouseClients = () => {
  const [clients, setclients] = useState([]);
  const { callApi } = useGomakeAxios();

  useEffect(() => {
    getClients().then((res) => {
      setclients(res?.data?.data?.data);
    });
  }, []);
  
  const getClients = async () => {
    return await callApi(
      "POST",
      "/v1/crm-service/customer/get-all-customers?ClientType=C&onlyCreateOrderClients=false"
    );
  };

  return {
    getClients,
    clients,
  };
};

export { usePrintHouseClients };
