import { useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import { getClientContactsApi } from "@/services/api-service/customers/customers-api";

const useClientContactsList = () => {
  const { callApi } = useGomakeAxios();
  const [clientContacts, setClientContacts] = useState();

  const getClientContacts = async (ClientId) => {
    const callBack = (res) => {
      if (res.success) {
        const updatedClientContacts = res.data.map((contact) => ({
          label: contact.name,
          id: contact.id,
          phone: contact?.phone,
          mail: contact?.mail,
        }));
        setClientContacts(updatedClientContacts);
      }
    };
    await getClientContactsApi(callApi, callBack, { ClientId });
  };

  return {
    getClientContacts,
    clientContacts,
  };
};

export { useClientContactsList };
