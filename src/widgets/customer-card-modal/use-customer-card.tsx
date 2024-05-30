import { PrimaryButton } from "@/components/button/primary-button";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { selectedClientState } from "@/pages-components/quotes/states";
import { getAllSimilarCustomerApi } from "@/services/api-service/customers/customers-api";
import { FONT_FAMILY } from "@/utils/font-family";
import { useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { getAndSetAllCustomers } from "@/services/hooks";

const CLIENT_TYPE_CUSTOMER = "C";

const useCustomerCard = ({ t, setCustomer, onClose }) => {
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const [showTable, setShowTable] = useState(false);
  const [customerTableRows, setCustomerTableRows] = useState([]);
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [showOnlyActiveCustomers, setShowOnlyActiveCustomers] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState();
  const setSelectedClient = useSetRecoilState(selectedClientState);

  const customerTableHeaders = [
    t("customers.customerCode"),
    t("customers.name"),
    t("customers.email"),
    t("customers.phone"),
    t("customers.status"),
    t("home.headers.more"),
  ];

  const getAllCustomersCreateQuote = useCallback(async (searchTerm) => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      ClientType: CLIENT_TYPE_CUSTOMER,
      onlyCreateOrderClients: false,
      searchTerm,
    });
  }, [callApi]);

  const handleChooseCustomer = (customer) => {
    setSelectedId(customer?.id);
    getAllCustomersCreateQuote(customer?.name);
    onClose();
    handleHideTable();
    setCustomer(null);
  };

  const handleShowTable = () => {
    getAllSimilarCustomer();
    setShowTable(true);
  };

  const handleHideTable = () => setShowTable(false);

  const renderOptions = () => customersListCreateQuote;


  const getAllSimilarCustomer = async () => {
    const handleResponse = (res) => {
      if (res?.success) {
        const mapData = res.data?.data;
        setCustomerTableRows(mapData);
      } else {
        alertFaultGetData();
      }
    };

    await getAllSimilarCustomerApi(callApi, handleResponse, {
      clientType: CLIENT_TYPE_CUSTOMER,
      pageNumber: 0,
      pageSize: 16,
    });
  };


  const mapCustomerData = (customer) => {
    const { code, name, mail, phone, isActive } = customer;
    const statusText = isActive ? t("usersSettings.active") : t("usersSettings.inactive");
    const statusColor = isActive ? "#40CC4E" : "#D92C2C";

    return [
      code,
      name,
      mail,
      phone,
      <div style={{ display: "inline-flex", ...FONT_FAMILY.Lexend(500, 14), color: statusColor }}>
        {statusText}
      </div>,
      <PrimaryButton onClick={() => handleChooseCustomer(customer)} variant="outlined" style={{ width: "fit-content", height: "fit-content" }}>
        {t("datepicker.choose")}
      </PrimaryButton>,
    ];
  };

  const getAllSimilarCustomersData = useCallback(() => {
    let usersArray = [...customerTableRows];
    if (usersArray?.length > 0) {

      return showOnlyActiveCustomers ? usersArray.filter((user: any) => user.isActive) : usersArray;
    }
    return usersArray
  }, [customerTableRows, showOnlyActiveCustomers])

  const onShowOnlyActiveCustomers = (value: boolean) => {
    setShowOnlyActiveCustomers(value);
  }

  useEffect(() => {
    if (customersListCreateQuote.length > 0) {
      const selectedValue = renderOptions()?.find((option) => option.id === selectedId);
      selectedValue && setSelectedClient(selectedValue);
    }
  }, [customersListCreateQuote, selectedId]);


  return {
    customerTableHeaders,
    customerTableRows,
    showTable,
    handleShowTable,
    handleHideTable,
    setCustomerTableRows,
    getAllSimilarCustomersData,
    onShowOnlyActiveCustomers,
    mapCustomerData
  };
};

export { useCustomerCard };