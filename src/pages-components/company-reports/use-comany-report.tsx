import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  getAllDataPrintHousesReports,
  createPrintHouseInAccountingApi,
} from "@/services/api-service/company-report/get-print-houses-report";
import { generateCalculateProductsExcelForPrintHousesApi } from "@/services/hooks";
import { OptionsComponent } from "@/pages-components/company-reports/components/options-component";
import { useRecoilState, useSetRecoilState } from "recoil";
import { printHousesState } from "@/pages-components/company-reports/components/utils/state";
import {
  IPrintHouse,
  PrintHousePayStatus,
} from "./components/utils/interfaces";
import { makePaymentApi } from "@/services/api-service/profiles/company-profile-api";

const initialPrintHouseState: IPrintHouse = {
  calculationsCount: 0,
  creationDate: "",
  domain: "",
  id: "",
  lastActivity: "",
  mail: null,
  numberOfClients: 0,
  numberOfEmployees: 0,
  numberOfSuppliers: 0,
  orderCount: 0,
  orderItemsCount: 0,
  phone: null,
  printHouseName: "",
  quoteItemsCount: 0,
  quotesCount: 0,
  status: "",
  successRate: 0,
};

export const useCompanyReport = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultUpdate, alertSuccessUpdate, alertFault, alertSuccess } =
    useSnackBar();
  const setPrintHouses =
    useSetRecoilState<{ id: string; name: string }[]>(printHousesState);
  const [AllReport, setAllReport] = useState([]);
  const [patternSearch, setPatternSearch] = useState<string>("");
  const [openPaymentDetails, setOpenPaymentDetails] = useState<boolean>(false);
  const [selectedPrintHouse, setSelectedPrintHouse] = useState<IPrintHouse>(
    initialPrintHouseState
  );
  const [selectedPrintHouseId, setSelectedPrintHouseId] = useState<string>("");
  const [countries, setCountries] = useState<{ id: string; name: string }[]>();
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleOpenModal = (printHouse) => {
    setSelectedPrintHouse(printHouse);
    setOpenPaymentDetails(true);
  };

  const handleCloseModal = () => {
    setSelectedPrintHouse(initialPrintHouseState);
    setOpenPaymentDetails(false);
  };

  const [openSendPaymentModal, setOpenSendPaymentModal] =
    useState<boolean>(false);

  const handleOpenSendPaymentModal = (printHouseId) => {
    setSelectedPrintHouseId(printHouseId);
    setOpenSendPaymentModal(true);
  };

  const handleCloseSendPaymentModal = () => {
    setSelectedPrintHouseId("");
    setOpenSendPaymentModal(false);
  };

  const tableHeaders = [
    t("companyReports.companyName"),
    t("companyReports.Domain"),
    t("profileSettings.country"),
    t("companyReports.PhoneNumber"),
    t("companyReports.Email"),
    t("companyReports.StartingDate"),
    "",
    t("Pay Status"),
    "",
    t("companyReports.lastActivity"),
    t("companyReports.calculations"),
    t("companyReports.Quote"),
    t("companyReports.QuoteItems"),
    t("companyReports.Orders"),
    t("companyReports.OrderItems"),
    t("companyReports.EstimationSuccessRate"),
    t(""),
  ];

  const handleMakePaymentClick = async (printHouseId) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getReport();
      } else {
        alertFaultUpdate();
      }
    };
    await makePaymentApi(callApi, callBack, { printHouseId });
  };

  const getReport = useCallback(async () => {
    const callBack = (res) => {
      if (res?.success) {
        setPrintHouses(
          res.data.map((printHouse) => ({
            id: printHouse.id,
            name: printHouse.printHouseName,
          }))
        );
        setCountries(
          res.data
            .map((printHouse) => printHouse?.country ?? "no")
            .filter(
              (country, index, self) =>
                country !== "no" && self.indexOf(country) === index
            )
            .map((country) => ({
              value: country,
              label: country,
            }))
        );

        const formattedData = res.data.map((item) => [
          item?.printHouseName,
          item?.domain,
          item?.country ?? "-",
          item?.phone ?? "-",
          item?.mail ?? "-",
          item.creationDate
            ? new Date(item.creationDate).toLocaleDateString()
            : "N/A",
          "",
          t(`companyReports.${PrintHousePayStatus[item?.printHousePayStatus]}`),
          "",
          item?.lastActivity
            ? new Date(item.lastActivity).toLocaleDateString()
            : "-",
          item.calculationsCount,
          item?.quotesCount,
          item?.quoteItemsCount,
          item?.orderCount,
          item?.orderItemsCount,
          item?.successRate,
          <OptionsComponent
            printHouse={item}
            handleOpenModal={handleOpenModal}
            handleClickMakePayment={handleMakePaymentClick}
            handleOpenSendPaymentModal={handleOpenSendPaymentModal}
            handleClickTestCalculation={
              generateCalculateProductsExcelForPrintHousesWithPrintHouseId
            }
          />,
        ]);
        setAllReport(formattedData);
      }
    };
    await getAllDataPrintHousesReports(callApi, callBack).then();
  }, [callApi]);

  const generateCalculateProductsExcelForPrintHouses = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccess("Email has been sent");
      } else {
        alertFault("Failed to send email");
      }
    };
    await generateCalculateProductsExcelForPrintHousesApi(
      callApi,
      callBack,
      {}
    );
  };

  const generateCalculateProductsExcelForPrintHousesWithPrintHouseId = async (
    printHouseId
  ) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccess("Email has been sent");
      } else {
        alertFault("Failed to send email");
      }
    };
    await generateCalculateProductsExcelForPrintHousesApi(callApi, callBack, {
      printHouseId: printHouseId,
    });
  };

  const payStatuses = [
    {
      label: t(`companyReports.${PrintHousePayStatus[0]}`),
      value: PrintHousePayStatus.NoPaymentDetails,
    },
    {
      label: t(`companyReports.${PrintHousePayStatus[1]}`),
      value: PrintHousePayStatus.NeedToPay,
    },
    {
      label: t(`companyReports.${PrintHousePayStatus[2]}`),
      value: PrintHousePayStatus.Payed,
    },
  ];

  const handlePayStatusChange = (e: any, value: any) => {
    setPayStatus(value);
  };

  const [payStatus, setPayStatus] = useState<{
    label: string;
    value: PrintHousePayStatus;
  } | null>();

  const handleCreatePrintHouseInAccounting = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccess("Print house created in accounting successfully");
        getReport(); // Refresh the report data
      } else {
        alertFault("Failed to create print house in accounting");
      }
    };
    await createPrintHouseInAccountingApi(callApi, callBack, {});
  };

  return {
    t,
    tableHeaders,
    AllReport,
    generateCalculateProductsExcelForPrintHouses,
    openPaymentDetails,
    handleCloseModal,
    selectedPrintHouse,
    getReport,
    payStatus,
    payStatuses,
    handlePayStatusChange,
    patternSearch,
    setPatternSearch,
    openSendPaymentModal,
    handleCloseSendPaymentModal,
    selectedPrintHouseId,
    countries,
    selectedCountry,
    setSelectedCountry,
    handleCreatePrintHouseInAccounting,
  };
};
