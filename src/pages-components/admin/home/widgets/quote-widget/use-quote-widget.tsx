import { useCallback, useEffect, useState } from "react";

import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import {
  getAllProductsForDropDownList,
  getAndSetAllCustomers,
  getAndSetClientTypes,
} from "@/services/hooks";

const useQuoteWidget = () => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const [clientTypesValue, setClientTypesValues] = useState([]);
  const [productValue, setProductValues] = useState([]);
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [customersListCreateOrder, setCustomersListCreateOrder] = useState([]);
  const [canOrder, setCanOrder] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState<any>({});
  const [selectedCustomersList, setSelectedCustomersList] = useState<any>({});
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const checkWhatRenderArray = (e) => {
    if (e.target.value) {
      setCanOrder(true);
    } else {
      setCanOrder(false);
    }
  };
  const renderOptions = () => {
    if (!!!canOrder) {
      return customersListCreateOrder;
    } else return customersListCreateQuote;
  };
  const getAllClientTypes = useCallback(async () => {
    await getAndSetClientTypes(callApi, setClientTypesValues);
  }, []);
  const getAllProducts = useCallback(async () => {
    await getAllProductsForDropDownList(callApi, setProductValues);
  }, []);
  const getAllCustomersCreateQuote = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      ClientType: "C",
      onlyCreateOrderClients: false,
    });
  }, []);
  const getAllCustomersCreateOrder = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateOrder, {
      ClientType: "C",
      onlyCreateOrderClients: true,
    });
  }, []);
  useEffect(() => {
    getAllClientTypes();
    getAllProducts();
    getAllCustomersCreateQuote();
    getAllCustomersCreateOrder();
  }, []);
  const onClcikCreateQuote = () => {
    navigate(
      `/admin/products/digital-offset-price?clientTypeId=${selectedClientType?.id}&customerId=${selectedCustomersList?.id}&productId=${selectedProduct?.id}`
    );
  };
  const onClcikCreateQuoteForCustomer = () => {
    navigate(
      `/products/digital-offset-price?clientTypeId=${selectedClientType?.id}&customerId=${selectedCustomersList?.id}&productId=${selectedProduct?.id}`
    );
  };
  return {
    clientTypesValue,
    productValue,
    customersListCreateQuote,
    customersListCreateOrder,
    setSelectedClientType,
    setSelectedCustomersList,
    setSelectedProduct,
    checkWhatRenderArray,
    renderOptions,
    onClcikCreateQuote,
    onClcikCreateQuoteForCustomer,
  };
};

export { useQuoteWidget };
