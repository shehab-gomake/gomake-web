import { PrimaryButton } from "@/components/button/primary-button";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { selectedClientState } from "@/pages-components/quotes/states";
import { getAllSimilarCustomerApi } from "@/services/api-service/customers/customers-api";
import { FONT_FAMILY } from "@/utils/font-family";
import { useCallback, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { priceOfferForSetupModalState, userQuoteState } from "@/pages-components/admin/home/widgets/quote-widget/states";


const useCustomerCard = ({ t, setCustomer, onClose }) => {
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const [showTable, setShowTable] = useState(false);
  const [customerTableRows, setCustomerTableRows] = useState([]);
  const [showOnlyActiveCustomers, setShowOnlyActiveCustomers] = useState<boolean>(false);
  const setSelectedClient = useSetRecoilState(selectedClientState);

  const customerTableHeaders = [
    t("customers.customerCode"),
    t("customers.name"),
    t("customers.email"),
    t("customers.phone"),
    t("customers.status"),
    t("home.headers.more"),
  ];

  const handleHideTable = () => setShowTable(false);

  const userQuote = useRecoilValue<any>(userQuoteState);
  const setOpenModal = useSetRecoilState<any>(priceOfferForSetupModalState);

  const handleChooseCustomer = (customer) => {
    if (customer) {
      setSelectedClient(customer);
      if (userQuote?.client?.id != null && customer?.id != null) {
        if (userQuote?.client?.id !== customer?.id) {
          setOpenModal(true);
        }
      }
      onClose();
      handleHideTable();
      setCustomer(null);
    };
  }

  // const handleShowTable = (customer) => {
  //   getAllSimilarCustomer(customer);
  //   setShowTable(true);
  // };


  const getAllSimilarCustomer = async (customer) => {
    const handleResponse = (res) => {
      if (res?.success) {
        const mapData = res.data;
        setCustomerTableRows(mapData);
      } else {
        alertFaultGetData();
      }
    };

    await getAllSimilarCustomerApi(callApi, handleResponse, customer);
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
    let customersArray = [...customerTableRows];
    if (customersArray?.length > 0) {
      return showOnlyActiveCustomers ? customersArray.filter((user: any) => user.isActive) : customersArray;
    }
    return customersArray
  }, [customerTableRows, showOnlyActiveCustomers])

  const onShowOnlyActiveCustomers = (value: boolean) => {
    setShowOnlyActiveCustomers(value);
  }


  return {
    customerTableHeaders,
    customerTableRows,
    showTable,
    handleHideTable,
    setCustomerTableRows,
    getAllSimilarCustomersData,
    onShowOnlyActiveCustomers,
    mapCustomerData,
    setShowOnlyActiveCustomers,
    getAllSimilarCustomer,
    setShowTable
  };
};

export { useCustomerCard };