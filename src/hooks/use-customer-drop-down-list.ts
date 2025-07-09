import {
  getAndSetAllCustomers,
  getAndSetClientContacts,
  getAndSetRecentCustomers,
} from "@/services/hooks";
import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import { useDebouncedCallback } from "use-debounce";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { clientListState } from "@/store/clients-list-state";

interface UseCustomerDropDownListProps {
  clientType?: CLIENT_TYPE;
  shouldRenderOnMount?: boolean;
  isUseRecoilState?: boolean;
}

const useCustomerDropDownList = ({
  clientType = CLIENT_TYPE.CUSTOMER,
  shouldRenderOnMount = true,
  isUseRecoilState = true,
}: UseCustomerDropDownListProps) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  // const [listClient, setListClient] = useState([]);
  const [listClient, setListClient] = isUseRecoilState
    ? useRecoilState(clientListState) // not dynamic
    : useState([]);

  const [clientContactsValue, setClientContactsValue] = useState<any>([]);
  const [customer, setCustomer] = useState<{
    name: string;
    id: string;
  } | null>();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isRecentSource, setIsRecentSource] = useState<boolean>(true);

  const renderOptions = () => {
    const additionalOption = {
      name: t("general.searchMore"),
      id: "searchMore",
      isInfo: true,
    };
    const additionalOption1 = {
      name: `—— ${t("general.recentOptions")} ——`,
      id: "recentOptions",
      isInfo: true,
    };

    const noOptions = {
      name: `${
        clientType === CLIENT_TYPE.CUSTOMER
          ? t("general.addYourFirstCustomer")
          : t("general.addYourFirstSupplier")
      }`,
      id: "addClient",
      isInfo: true,
    };

    if (isRecentSource) {
      if (listClient.length === 0) {
        return [noOptions];
        // return null;
      }
      return [additionalOption1, ...listClient, additionalOption];
    }

    return listClient;
  };

  const getAllClients = useCallback(
    async (SearchTerm?: string) => {
      if (SearchTerm) {
        setIsFetching(true);
      }
      setIsRecentSource(false);
      await getAndSetAllCustomers(callApi, setListClient, {
        clientType,
        searchTerm: SearchTerm as string,
      });
      setIsFetching(false);
    },
    [clientType]
  );

  const getRecentClients = useCallback(async () => {
    setIsRecentSource(true);
    await getAndSetRecentCustomers(callApi, setListClient, {
      ClientType: clientType,
    });
  }, [clientType]);

  const debouncedGetAllClients = useDebouncedCallback((value: string) => {
    getAllClients(value);
  }, 1200);

  const checkWhatRenderArray = (e: any) => {
    const value = e.target.value.trim();
    if (value === "") {
      debouncedGetAllClients.cancel();
      getRecentClients();
    } else {
      debouncedGetAllClients(value);
    }
  };

  const handleCustomerChange = (e: any, value: any) => {
    setCustomer(value);
  };

  const getAllClientContacts = useCallback(async () => {
    if (customer?.id) {
      await getAndSetClientContacts(callApi, setClientContactsValue, {
        ClientId: customer.id,
      });
    }
  }, [customer]);

  useEffect(() => {
    if (shouldRenderOnMount) {
      getRecentClients();
    }
  }, [shouldRenderOnMount, clientType]);

  return {
    customer,
    getAllClients,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    getAllClientContacts,
    setCustomer,
    clientContactsValue,
    listClient,
    isFetching,
    getRecentClients,
  };
};

export { useCustomerDropDownList };
