import { PrimaryButton } from "@/components/button/primary-button";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { selectedClientState } from "@/pages-components/quotes/states";
import { getAllSimilarCustomerApi } from "@/services/api-service/customers/customers-api";
import { FONT_FAMILY } from "@/utils/font-family";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { usePrintHouseClients } from "../properties/hooks/use-print-house-clients";

const useCustomerCard = ({ t }) => {
  const [showTable, setShowTable] = useState(false);
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();

  const customerTableHeaders = [
    t("customers.customerCode"),
    t("customers.name"),
    // t("customers.customerType"),
    t("customers.email"),
    t("customers.phone"),
    t("customers.status"),
    t("home.headers.more"),
  ];

  // const customerTableRows = [
  //   ["100" , "Client-1" , "client" , "Client-1@gomake.net","0545568623","active" , <PrimaryButton variant="outlined" style={{width:"fit-content" , height:"fit-content" }}>{t("datepicker.choose")}</PrimaryButton>],
  //   ["101" , "Client-2" , "client" , "Client-2@gomake.net","0545568623","active" , <PrimaryButton variant="outlined" style={{width:"fit-content" , height:"fit-content" }}>{t("datepicker.choose")}</PrimaryButton>],
  //   ["102" , "Client-3" , "client" , "Client-3@gomake.net","0545568623","inactive" ,<PrimaryButton variant="outlined" style={{width:"fit-content" , height:"fit-content" }}>{t("datepicker.choose")}</PrimaryButton>],
  //   ["103" , "Client-4" , "client" , "Client-4@gomake.net","0545568623","active" ,<PrimaryButton variant="outlined" style={{width:"fit-content" , height:"fit-content" }}>{t("datepicker.choose")}</PrimaryButton>],
  // ];

  const handleShowTable = () => {
    getAllSimilarCustomer();
    setShowTable(true)
  };
  const handleHideTable = () => setShowTable(false);

  const [customerTableRows, setAllSimilarCustomers] = useState();

  // const getAllSimilarCustomer = async () => {
  //   const callBack = (res) => {
  //     if (res?.success) {
  //       const mapData = res.data?.data.map((customer: any) => [
  //         customer?.code,
  //         customer?.name,
  //         customer?.mail,
  //         customer?.phone,
  //         <div>
  //           {customer?.isActive === false ? (
  //             <div
  //               style={{
  //                 display: "inline-flex",
  //                 ...FONT_FAMILY.Lexend(500, 14),
  //                 color: "#D92C2C",
  //               }}
  //             >
  //               {t("usersSettings.inactive")}
  //             </div>
  //           ) : (
  //             <div
  //               style={{
  //                 display: "inline-flex",
  //                 ...FONT_FAMILY.Lexend(500, 14),
  //                 color: "#40CC4E",
  //               }}
  //             >
  //               {t("usersSettings.active")}
  //             </div>
  //           )}
  //         </div>,
  //         <PrimaryButton onClick={() => alert(customer?.id)} variant="outlined" style={{ width: "fit-content", height: "fit-content" }}>{t("datepicker.choose")}</PrimaryButton>
  //       ]);
  //       setAllSimilarCustomers(mapData);
  //     }
  //     else {
  //       alertFaultGetData();
  //     }
  //   }
  //   await getAllSimilarCustomerApi(callApi, callBack,
  //     {
  //       clientType: "C",
  //       pageNumber: 0,
  //       pageSize: 16
  //     },
  //   );
  // }

  const [selectedClient, setSelectedClient] = useRecoilState<any>(selectedClientState);


  const handleClickToSelectedCustomer = (value)=>{
console.log("affter we choose : " , value);
console.log("prinhouse client : " , clients);
const selectedValue = clients?.find(
  (option) => option?.id === value
);
    setSelectedClient(selectedValue);
  }
  ;


  const {clients} = usePrintHouseClients();
  
  const getAllSimilarCustomer = async () => {
    const handleResponse = (res) => {
      if (res?.success) {
        const mapData = res.data?.data.map(mapCustomerData);
        setAllSimilarCustomers(mapData);
      } else {
        alertFaultGetData();
      }
    };
  
    await getAllSimilarCustomerApi(callApi, handleResponse, {
      clientType: "C",
      pageNumber: 0,
      pageSize: 16,
    });
  };
  
  const mapCustomerData = (customer) => {
    const { code, name, mail, phone, isActive, id } = customer;
    const statusClass = isActive ? 'active' : 'inactive';
    const statusText = isActive ? t("usersSettings.active") : t("usersSettings.inactive");
    const statusColor = isActive ? "#40CC4E" : "#D92C2C";
  
    return [
      code,
      name,
      mail,
      phone,
      <div className={`status ${statusClass}`} style={{ display: "inline-flex", ...FONT_FAMILY.Lexend(500, 14), color: statusColor }}>
        {statusText}
      </div>,
      <PrimaryButton onClick={() => handleClickToSelectedCustomer(id)} variant="outlined" style={{ width: "fit-content", height: "fit-content" }}>
        {t("datepicker.choose")}
      </PrimaryButton>,
    ];
  };

  return {
    customerTableHeaders,
    customerTableRows,
    handleShowTable,
    handleHideTable,
    showTable,

  };
};

export { useCustomerCard };
