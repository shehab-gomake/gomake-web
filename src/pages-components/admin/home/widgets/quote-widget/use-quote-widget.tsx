import { useCallback, useEffect, useState } from "react";

import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import {
  getAllProductsForDropDownList,
  getAndSetAllCustomers,
  getAndSetClientTypes,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useRecoilState } from "recoil";
import {
  QuoteIfExistState,
  QuoteNumberState,
} from "@/pages-components/quote/store/quote";
import { getAllDocumentsApi, getIfCartExistApi, saveDocumentApi } from "@/services/api-service/generic-doc/documents-api";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { MoreMenuWidget } from "../more-circle";
import { useStyle } from "../quote-table-widget/style";
import { ITab } from "@/components/tabs/interface";
import { useDateFormat } from "@/hooks/use-date-format";
import { _renderQuoteStatus } from "@/utils/constants";
import { selectedClientState } from "@/pages-components/quotes/states";

const useQuoteWidget = () => {
  const { t } = useTranslation();
  const { errorColor } = useGomakeTheme();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { alertFaultUpdate } = useSnackBar();
  const [clientTypesValue, setClientTypesValues] = useState([]);
  const [productValue, setProductValues] = useState([]);
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [userQuote, setUserQuote] = useState<any>(null);
  const [canOrder, setCanOrder] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState<any>({});
  const [selectedClient, setSelectedClient] = useRecoilState<any>(selectedClientState);
  const [QuoteIfExist, setQuoteIfExist] = useRecoilState<any>(QuoteIfExistState);
  const [quoteNumber, setquoteNumber] = useRecoilState<any>(QuoteNumberState);
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [isDisabled, setIsDisabled] = useState(true);
  const { classes } = useStyle();
  const [allDocuments, setAllDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { getCurrencyUnitText } = useQuoteGetData();
  const { GetDateFormat } = useDateFormat();

  const onClcikOpenModal = (quoteId: any) => {
    setOpenModal(true);
  };
  //PopOver Btns
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const onClcikCloseModal = async () => {
    setOpenModal(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const checkVariables = (var1, var2, var3) => {
    if (var1?.id && var2?.id && var3?.id) {
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    const isDisabled = checkVariables(
      selectedClientType,
      selectedClient,
      selectedProduct
    );
    setIsDisabled(isDisabled);
  }, [selectedClientType, selectedClient, selectedProduct]);

  const checkWhatRenderArray = (e) => {
    if (e.target.value) {
      getAllCustomersCreateQuote(e.target.value);
    }
  };
  const renderOptions = () => {
    return customersListCreateQuote;
  };

  const getAllProducts = useCallback(async () => {
    await getAllProductsForDropDownList(callApi, setProductValues);
  }, []);
  const getAllCustomersCreateQuote = useCallback(async (SearchTerm?) => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      ClientType: "C",
      onlyCreateOrderClients: false,
      searchTerm: SearchTerm,
    });
  }, []);

  const handleClicktoSelectedCustomer = useCallback(
    async (clientIdifExist, value) => {
      setSelectedClient(value);

      const clientType = clientTypesValue.find(
        (c) => c.id == value?.clientTypeId
      );

      if (clientIdifExist != null && value?.id != null) {
        if (clientIdifExist != value?.id) {
          setOpenModal(true);
        }
      }

      if (clientType) {
        setSelectedClientType(clientType);
      } else {
        setSelectedClientType({});
      }
    },
    [clientTypesValue]
  );

  const getAndSetExistQuote = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setUserQuote(res?.data?.result)
      }
    }
    await getIfCartExistApi(callApi, callBack,
      { documentType: 0 })
  }

  const updateQuoteExist = useCallback(async () => {
    await getAndSetExistQuote();
  }, []);

  const updateCustomerList = useCallback(async () => {
    setSelectedClient(null);
    setSelectedClientType(null);
  }, []);
  const updateCustomerListSelectedAfterConfirm = useCallback(
    async (selectedCustomersList) => {
      setSelectedClient(selectedCustomersList);
    },
    []
  );

  useEffect(() => {
    getAllClientTypes();
    getAllProducts();
    getAndSetExistQuote();
  }, []);

  const onClickSaveQuote = async (quoteId) => {
    const callBack = (res) => {
      if (res?.success) {
        setquoteNumber(null);
        setQuoteIfExist(false);
        setUserQuote(null);
      } else {
        alertFaultUpdate();
      }
    }
    await saveDocumentApi(callApi, callBack, {
      documentType: 0,
      document: {
        documentId: quoteId,
      }
    })
  }

  const onClcikCreateQuote = () => {
    navigate(
      `/admin/products/digital-offset-price?clientTypeId=${selectedClientType?.id}&customerId=${selectedClient?.id}&productId=${selectedProduct?.id}`
    );
  };
  const onClcikCreateQuoteForCustomer = () => {
    navigate(
      `/products/create?clientTypeId=${selectedClientType?.id}&customerId=${selectedClient?.id}&productId=${selectedProduct?.id}`
    );
  };
  const _renderErrorMessage = () => {
    if (!selectedClient?.id) {
      return t("home.admin.pleaseSelectCustomer");
    }
    if (!selectedClientType?.id) {
      return t("home.admin.pleaseSelectClientType");
    }
    if (!selectedProduct?.id) {
      return t("home.admin.pleaseSelectProduct");
    }
  };

  // what is userQuote?.result !!!
  const getAllClientTypes = useCallback(async () => {
    try {
      await getAndSetClientTypes(callApi, setClientTypesValues);
      if (userQuote?.result) {
        getAllCustomersCreateQuote(userQuote?.result?.clientName);
      } else {
        getAllCustomersCreateQuote();
      }
    } catch (error) {
      console.error("Error fetching client types:", error);
    }
  }, [callApi, userQuote]);


  const tableHeaders = [
      t("home.headers.documentNumber"),
      t("home.headers.clientType"),
      t("home.headers.jobName"),
      t("home.headers.productDate"),
      t("home.headers.finalPrice"),
      t("home.headers.status"),
      t("home.headers.remark"),
      t("home.headers.more")
  ];

  const testRows = [
      ['10100669', 'Tester 3', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
      ['10100679', 'Tester 1', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
      ['10100689', 'Tester 2', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>]
  ];

  const getAllDocuments = async (docType) => {
      const callBack = (res) => {
        if (res?.success) {
          const data = res?.data?.data;
          const mapData = data?.map((document: any) => [
            document?.number,
            document?.clientType,
            document?.worksNames,
            GetDateFormat(document?.createdDate),
            document?.totalPrice + " " + getCurrencyUnitText(document?.currency),
            <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={document?.documentStatus == 2 ?classes.openBtnStyle :classes.closeBtnStyle }>{_renderQuoteStatus(document?.documentStatus, document, t)}</h2></div>,
            document?.notes,
            <MoreMenuWidget
              // document={document}
              // documentType={docType}
              // onClickDuplicate={onClickQuoteDuplicate}
              // onClickLoggers={() => onClickOpenLogsModal(document?.number)}
            />,
          ]);
          setAllDocuments(mapData);
        }
      };
      await getAllDocumentsApi(callApi, callBack, {documentType: docType,  data: {
          model: {
            pageNumber: page,
            pageSize: limit,
          },
          customerId: selectedClient?.id,
        }});
    };
  
    useEffect(() => {
      getAllDocuments(0)
  }, []);


  const handleTabChange = (tabIndex) => {
    getAllDocuments(tabIndex);
    
  };

  const tabs: ITab[] = [
      {
          title: t('home.tabs.Quotes'), component: 
          <PrimaryTable
              rows={allDocuments}
              headers={tableHeaders}
              variant="ClassicTable"
          />
      },
      {
          title: t('home.tabs.Orders'), component: <PrimaryTable
              rows={allDocuments}
              headers={tableHeaders}
              variant="ClassicTable"
          />
      },
      {
          title: t('home.tabs.Delivery'), component: <PrimaryTable
              rows={testRows}
              headers={tableHeaders}
              variant="ClassicTable"
          />
      },
      {
          title: t('home.tabs.Invoice'), component: <PrimaryTable
              rows={testRows}
              headers={tableHeaders}
              variant="ClassicTable"
          />
      },
      {
          title: t('home.tabs.Receipt'), component: <PrimaryTable
              rows={testRows}
              headers={tableHeaders}
              variant="ClassicTable"
          />
      }
  ];

  return {
    clientTypesValue,
    productValue,
    customersListCreateQuote,
    isDisabled,
    id,
    updateCustomerList,
    openModal,
    getAndSetExistQuote,
    userQuote,
    open,
    errorColor,
    anchorEl,
    selectedClientType,
    handleClick,
    updateQuoteExist,
    onClcikOpenModal,
    selectedProduct,
    handleClose,
    onClcikCloseModal,
    setSelectedClientType,
    setSelectedClient,
    selectedClient,
    setSelectedProduct,
    updateCustomerListSelectedAfterConfirm,
    setOpenModal,
    setUserQuote,
    handleClicktoSelectedCustomer,
    checkWhatRenderArray,
    renderOptions,
    onClcikCreateQuote,
    onClcikCreateQuoteForCustomer,
    _renderErrorMessage,
    onClickSaveQuote,
    tabs,
    handleTabChange
  };
};

export { useQuoteWidget };
