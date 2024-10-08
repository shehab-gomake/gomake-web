import {
  getAndSetAllCustomers,
  getAndSetClientContacts,
} from "@/services/hooks";
import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import { useDebouncedCallback } from "use-debounce";

interface UseCustomerDropDownListProps {
  shouldRenderCustomersOnMount?: boolean;
  shouldRenderSuppliersOnMount?: boolean;
}

// const useDebounce = (value: string, delay: number) => {
//   const [debouncedValue, setDebouncedValue] = useState<string>(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };

const useCustomerDropDownList = ({
  shouldRenderCustomersOnMount = true,
  shouldRenderSuppliersOnMount = false,
}: UseCustomerDropDownListProps = {}) => {
  const { callApi } = useGomakeAxios();
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [clientContactsValue, setClientContactsValue] = useState<any>([]);
  const [customer, setCustomer] = useState<{
    name: string;
    id: string;
  } | null>();

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const renderOptions = () => {
    return customersListCreateQuote;
  };

  const getAllCustomersCreateQuote = useCallback(
    async (SearchTerm?: string) => {
      if (SearchTerm) {
        setIsFetching(true); // Start fetching only if SearchTerm is provided
      }

      await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
        clientType: "C",
        searchTerm: SearchTerm as string,
        onlyCreateOrderClients: false,
      });
      setIsFetching(false); // Finish fetching
    },
    []
  );

  const getAllCustomersCreateOrder = useCallback(
    async (SearchTerm?: string) => {
      if (SearchTerm) {
        setIsFetching(true); // Start fetching only if SearchTerm is provided
      }
      await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
        clientType: "C",
        searchTerm: SearchTerm as string,
        onlyCreateOrderClients: true,
      });
      setIsFetching(false); // Finish fetching
    },
    []
  );

  const getAllSupplierList = useCallback(async (SearchTerm?: string) => {
    if (SearchTerm) {
      setIsFetching(true); // Start fetching only if SearchTerm is provided
    }
    await getAndSetAllCustomers(callApi, setSupplierList, {
      clientType: "S",
      searchTerm: SearchTerm as string,
      onlyCreateOrderClients: true,
    });
    setIsFetching(false); // Finish fetching
  }, []);

  const debouncedGetAllCustomersCreateOrder = useDebouncedCallback(
    (value: string) => {
      getAllCustomersCreateOrder(value);
    },
    1200
  );

  // ? New
  // const [inputValue, setInputValue] = useState("");
  // const debouncedSearchTerm = useDebounce(inputValue, 300);

  // useEffect(() => {
  //   if (debouncedSearchTerm === "") {
  //     getAllCustomersCreateQuote();
  //   } else {
  //     debouncedGetAllCustomersCreateOrder(debouncedSearchTerm);
  //   }
  // }, [debouncedSearchTerm]);

  // const checkWhatRenderArray = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value.trim();
  //   setInputValue(value); // Update local state
  // };
  // ? New

  const checkWhatRenderArray = (e: any) => {
    const value = e.target.value;
    // if (value && value.trim() !== "") {
    //   setIsFetching(true);
    // }
    if (value) {
      debouncedGetAllCustomersCreateOrder(value);
    } else {
      getAllCustomersCreateQuote();
    }
  };

  const handleCustomerChange = (e: any, value: any) => {
    setCustomer(value);
  };

  const getAllClientContacts = useCallback(async () => {
    await getAndSetClientContacts(callApi, setClientContactsValue, {
      ClientId: customer?.id,
    });
  }, [customer]);

  useEffect(() => {
    if (shouldRenderSuppliersOnMount) {
      getAllSupplierList();
    }
  }, [shouldRenderSuppliersOnMount, getAllSupplierList]);

  useEffect(() => {
    if (shouldRenderCustomersOnMount) {
      getAllCustomersCreateQuote();
    }
  }, [shouldRenderCustomersOnMount, getAllCustomersCreateQuote]);

  return {
    customer,
    getAllCustomersCreateQuote,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    getAllClientContacts,
    setCustomer,
    clientContactsValue,
    supplierList,
    isFetching,
  };
};

export { useCustomerDropDownList };
