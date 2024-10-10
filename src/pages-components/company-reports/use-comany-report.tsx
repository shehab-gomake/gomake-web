import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAllDataPrintHousesReports } from "@/services/api-service/company-report/get-print-houses-report";
import { DirectboxSendIcon } from "@/icons";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { generateCalculateProductsExcelForPrintHousesApi } from "@/services/hooks";
import { IconButton } from "@mui/material";
import { OptionsComponent } from "@/pages-components/company-reports/options-component";
import { useRecoilState } from "recoil";
import { printHousesState } from "@/pages-components/company-reports/state";
import { IPrintHouse, PrintHousePayStatus } from "./interfaces";
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
  const { primaryColor } = useGomakeTheme();
  const { alertFaultUpdate, alertSuccessUpdate, alertFault, alertSuccess } =
    useSnackBar();
  const [, setPrintHouses] =
    useRecoilState<{ id: string; name: string }[]>(printHousesState);
  const [AllReport, setAllReport] = useState([]);
  const [patternSearch, setPatternSearch] = useState<string>("");
  const [openPaymentDetails, setOpenPaymentDetails] = useState<boolean>(false);
  const [selectedPrintHouse, setSelectedPrintHouse] = useState<IPrintHouse>(
    initialPrintHouseState
  );

  const handleOpenModal = (printHouse) => {
    setSelectedPrintHouse(printHouse);
    setOpenPaymentDetails(true);
  };

  const handleCloseModal = () => {
    setSelectedPrintHouse(initialPrintHouseState);
    setOpenPaymentDetails(false);
  };

  const tableHeaders = [
    t("companyReports.companyName"),
    t("companyReports.Domain"),
    t("companyReports.PhoneNumber"),
    t("companyReports.Email"),
    t("companyReports.StartingDate"),
    t("companyReports.Status"),
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
    t("companyReports.testCalculation"),
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
        const formattedData = res.data.map((item) => [
          item?.printHouseName,
          item?.domain,
          item?.phone,
          item?.mail,
          item.creationDate
            ? new Date(item.creationDate).toLocaleDateString()
            : "N/A",
          item.status,
          "",
          t(`companyReports.${PrintHousePayStatus[item?.printHousePayStatus]}`),
          "",
          item.lastActivity
            ? new Date(item.lastActivity).toLocaleDateString()
            : "N/A",
          item.calculationsCount,
          item?.quotesCount,
          item?.quoteItemsCount,
          item?.orderCount,
          item?.orderItemsCount,
          item?.successRate,
          <IconButton
            type="button"
            onClick={() =>
              generateCalculateProductsExcelForPrintHousesWithPrintHouseId(
                item?.id
              )
            }
          >
            <DirectboxSendIcon
              stroke={primaryColor(500)}
              width={20}
              height={20}
            />
          </IconButton>,
          <OptionsComponent
            printHouse={item}
            handleOpenModal={handleOpenModal}
            handleClickMakePayment={handleMakePaymentClick}
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
  };
};
