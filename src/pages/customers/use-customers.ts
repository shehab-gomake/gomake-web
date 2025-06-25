import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  agentsCategoriesState,
  clientTypesCategoriesState,
} from "./customer-states";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import {
  getAndSetCustomerById,
  getAndSetCustomersPagination,
  importClientApi,
} from "@/services/api-service/customers/customers-api";
import { DEFAULT_VALUES } from "./enums";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";
import { EHttpMethod } from "@/services/api-service/enums";
import { useDebounce } from "@/utils/use-debounce";
import { useSnackBar } from "@/hooks";
import { clearPhoneNumberPrefix } from "@/utils/helpers";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { useClientTypesList } from "@/hooks/use-client-types";
import {
  printHouseSetupStepsState,
  SetupStep,
  SetupStepItem,
} from "@/store/print-house-setup-state-state";
import { useListPagination } from "@/hooks/use-list-pagination";

export interface IStatus {
  label: string;
  value: string;
}

export type ErrorMessage = {
  errorCode: number;
  lineNumber: number;
};

const useCustomers = (
  clientType: "C" | "S",
  pageNumber: number,
  setPageNumber: Dispatch<SetStateAction<number>>
) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const { alertFaultGetData, alertFaultUpdate, alertSuccessUpdate } =
    useSnackBar();
  const { CheckPermission } = useUserPermission();
  const [allCustomers, setAllCustomers] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const { pageSize, setPageSize, pagesCount, setPagesCount, initialPageSize } =
    useListPagination();

  useEffect(() => {
    if (initialPageSize && initialPageSize !== pageSize) {
      setPageSize(initialPageSize);
    }
  }, [initialPageSize]);

  const [openExportModal, setOpenExportModal] = useState<boolean>(false);

  const onOpenExportClientModal = () => {
    setOpenExportModal(true);
  };

  const onCloseExportClientModal = () => {
    setOpenExportModal(false);
  };

  const handlePageSizeChange = (event) => {
    setPageNumber(1);
    setPageSize(event.target.value);
  };

  const tableHeaders = [
    clientType == "C"
      ? t("customers.customerCode")
      : t("suppliers.supplierCode"),
    t("customers.name"),
    t("customers.email"),
    t("customers.phone"),
    t("customers.status"),
    CheckPermission(Permissions.EDIT_CLIENT) ? t("customers.hashtag") : null,
  ];

  const getCustomersRows = useCallback(() => {
    return allCustomers?.map((customer) => [
      customer?.customerCode,
      customer?.name,
      customer?.email,
      !CheckPreferenceValue(EPreferences.SHOW_PHONE_PREFIX)
        ? clearPhoneNumberPrefix(customer?.phone)
        : customer?.phone,
      customer?.status,
      customer?.hashTag,
    ]);
  }, [allCustomers]);

  //select status options
  const statuses = [
    { label: t("customers.active"), value: "true" },
    { label: t("customers.inactive"), value: "false" },
    { label: t("customers.all"), value: "" },
  ];

  const [name, setCustomerName] = useState("");
  const [finalPatternSearch, setFinalPatternSearch] = useState("");

  const debounce = useDebounce(name, 1000);
  useEffect(() => {
    setFinalPatternSearch(debounce);
  }, [debounce]);
  const onChangeCustomer = useCallback((value: string) => {
    setPageNumber(1);
    setCustomerName(value);
  }, []);

  const [agentId, setAgentId] = useState([]);
  const [agentName, setAgentName] = useState([]);
  const onChangeAgent = useCallback(async (e: any, value: any) => {
    setPageNumber(1);
    setAgentId(value?.id);
    setAgentName(value?.label);
  }, []);

  const [isActive, setStatus] = useState(true);
  const [valStatus, setValStatus] = useState<IStatus>({
    label: t("customers.active"),
    value: "true",
  });

  const onChangeStatus = useCallback(async (e: any, value: any) => {
    setPageNumber(1);
    setStatus(value?.value);
    setValStatus(value?.label);
  }, []);

  const [ClientTypeId, setClientTypeId] = useState([]);
  const [valClientType, setValClientType] = useState([]);
  const onChangeClientType = useCallback(async (e: any, value: any) => {
    setPageNumber(1);
    setClientTypeId(value?.id);
    setValClientType(value?.label);
  }, []);

  const [filters, setFilters] = useState({
    clientType,
    pageNumber,
    pageSize,
    finalPatternSearch,
    ClientTypeId,
    agentId,
    isActive,
  });

  const clientTypesCategories = useRecoilValue(clientTypesCategoriesState);
  const { getClientTypesCategories } = useClientTypesList();

  const [agentsCategories, setAgentsCategories] = useRecoilState(
    agentsCategoriesState
  );
  const getAgentCategories = async () => {
    const callBack = (res) => {
      if (res.success) {
        const agentNames = res.data.map((agent) => ({
          label: agent.text,
          id: agent.value,
        }));
        setAgentsCategories(agentNames);
      }
    };
    await getAndSetEmployees2(callApi, callBack, { isAgent: true });
  };

  const [customerForEdit, setCustomerForEdit] = useState([]);
  const getCustomerForEdit = async (id) => {
    const callBack = (res) => {
      if (res.success) {
        let customer = res.data;
        if (customer.contacts && customer.contacts.length > 0) {
          let index = 0;
          customer.contacts.forEach((x) => {
            x.index = index;
            index++;
          });
        }
        if (customer.addresses && customer.addresses.length > 0) {
          let index = 0;
          customer.addresses.forEach((x) => {
            x.index = index;
            index++;
          });
        }
        if (customer.users && customer.users.length > 0) {
          let index = 0;
          customer.users.forEach((x) => {
            x.index = index;
            index++;
          });
        }
        setCustomerForEdit(customer);
        setShowCustomerModal(true);
      }
    };
    await getAndSetCustomerById(callApi, callBack, { customerId: id });
  };

  const updatedStatus = useCallback(async (data: any) => {
    const res: any = await callApi(
      "PUT",
      "/v1/crm-service/customer/update-customer-status",
      {
        Id: data.id,
        status: !data?.isActive,
      }
    );
    if (res?.success) {
      setFilters((prevFilters) => ({
        ...prevFilters,
      }));
      return true;
    } else {
      return false;
    }
  }, []);

  const getAllCustomers = useCallback(async () => {
    const data = await getAndSetCustomersPagination(
      callApi,
      setAllCustomers,
      {
        clientType,
        pageNumber,
        pageSize,
        name: finalPatternSearch,
        ClientTypeId,
        agentId,
        isActive,
      },
      getCustomerForEdit,
      updatedStatus,
      t("usersSettings.active"),
      t("usersSettings.inactive")
    );
    setPagesCount(Math.ceil(data / pageSize));
    return data;
  }, [
    pageNumber,
    pageSize,
    finalPatternSearch,
    ClientTypeId,
    agentId,
    isActive,
  ]);

  const handleClean = useCallback(async () => {
    setCustomerName("");
    setAgentId(null);
    setAgentName(null);
    setStatus(true);
    setValStatus({ label: t("customers.active"), value: "true" });
    setClientTypeId(null);
    setValClientType(null);
    setPageNumber(1);
  }, []);

  const [openErrorsModal, setOpenErrorsModal] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<ErrorMessage[]>([]);
  const handleErrorsModalClose = () => {
    setOpenErrorsModal(false);
    setErrorMessages([]);
  };

  const onClickImportClient = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const data = new Uint8Array(arrayBuffer as ArrayBuffer);
        var base64String = btoa(
          new Uint8Array(data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
          }, "")
        );

        const callBack = (res) => {
          if (res.success) {
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
              setErrorMessages(res.data);
              setOpenErrorsModal(true);
            } else {
              alertSuccessUpdate();
            }
          } else {
            alertFaultUpdate();
          }
        };
        importClientApi(callApi, callBack, {
          fileBase64: base64String,
          clientType: clientType,
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const onClickExportClient = async (exportWithContacts: boolean) => {
    try {
      const result = await callApi(
        EHttpMethod.GET,
        "/v1/crm-service/customer/export-client",
        { clientType: clientType, exportWithContacts: exportWithContacts },
        true,
        null,
        "blob"
      );

      if (result?.success) {
        const downloadLink = document.createElement("a");
        const link = URL.createObjectURL(result?.data);
        downloadLink.href = link;
        downloadLink.download = "clients.xlsx";
        downloadLink.click();

        setOpenExportModal(false);
      } else {
        alertFaultGetData();
      }
    } catch (error) {
      alertFaultGetData();
    }
  };

  const [value, setValue] = useState(0);
  const [openClientTypeModal, setOpenClientTypeModal] = useState(false);

  const printHouseSetupSteps = useRecoilValue<SetupStepItem[]>(
    printHouseSetupStepsState
  );

  const addCustomerStep = printHouseSetupSteps.find(
    (step) => step.step === SetupStep.CONTACTS_CLIENTS
  );

  const addSupplierStep = printHouseSetupSteps.find(
    (step) => step.step === SetupStep.CONTACTS_SUPPLIERS
  );

  return {
    getAgentCategories,
    getClientTypesCategories,
    tableHeaders,
    allCustomers,
    agentsCategories,
    clientTypesCategories,
    statuses,
    onChangeCustomer,
    onChangeAgent,
    onChangeClientType,
    onChangeStatus,
    setAllCustomers,
    handleClean,
    name,
    finalPatternSearch,
    agentName,
    valStatus,
    valClientType,
    pagesCount,
    customerForEdit,
    setCustomerForEdit,
    showCustomerModal,
    setShowCustomerModal,
    getCustomerForEdit,
    getAllCustomers,
    updatedStatus,
    getCustomersRows,
    ClientTypeId,
    agentId,
    isActive,
    pageSize,
    filters,
    clientType,
    onClickExportClient,
    onClickImportClient,
    setPagesCount,
    setPageSize,
    handlePageSizeChange,
    openExportModal,
    onOpenExportClientModal,
    onCloseExportClientModal,
    openErrorsModal,
    handleErrorsModalClose,
    errorMessages,
    isRTL,
    value,
    setValue,
    openClientTypeModal,
    setOpenClientTypeModal,
    addSupplierStep,
    addCustomerStep,
    initialPageSize,
  };
};
export { useCustomers };
