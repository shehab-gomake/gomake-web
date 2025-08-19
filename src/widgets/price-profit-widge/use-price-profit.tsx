import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  getAllPricingProfileSettingForDropDownListApi,
  getAllProfitProfileProductByProductIdApi,
  getProfitsProfilePdfApi,
  reCalculatePriceApi,
  resetPrintHousePriceApi,
  updatePrintHousePriceApi,
  updateProfitProfileProductHiddenApi,
  updateProfitProfileProductParameterApi,
  updateProfitProfileProductQuantitiesApi,
  updateProfitProfileProductSelectedApi,
  updateSelectedPrintHousePricesApi,
} from "@/services/api-service/products/product-endpoints";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDisplayProfitProfilesSocketIo } from "@/hooks/socket-io/use-display-profit-profiles-socket-io";
import { getProfitsChartDataApi } from "@/services/api-service/generic-doc/orders-api";
import { useAllProductsDropDownList } from "@/hooks/use-products-drop-down-list";
import { getDataForAutoPricingActionsChartApi } from "@/services/api-service/quotes/qoutes-endpoints";
import { getAllPrintHouseActions } from "@/services/hooks";
import { getAndSetProfitsPricingTables } from "@/pages-components/products/profits-new/services/get-profits-pricing-tables";
import {
  profitAutoFixApi,
  rollbackUpdatedPricingTablesAfterOptimizationApi,
} from "@/services/api-service/print-houses/profits-auto-calculation";
import { EHttpMethod } from "@/services/api-service/enums";

interface PricingProfileSetting {
  id: string;
  productId?: string;
  productName?: string;
  label: string;
  value: string;
}

type ActionOption = {
  actionId: string;
  label: string;
  value: string;
};

const usePriceProfit = () => {
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const [pricingProfileSetting, setPricingProfileSetting] = useState<
    PricingProfileSetting[]
  >([]);
  const [selectedPricingProfileSetting, setSelectedPricingProfileSetting] =
    useState<PricingProfileSetting | null>(null);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUpdateQuantity, setIsUpdateQuantity] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [anchorElSetting, setAnchorElSetting] = useState<null | HTMLElement>(
    null
  );
  const { t } = useTranslation();
  const open = Boolean(anchorEl);
  const openSetting = Boolean(anchorElSetting);
  const [anchorElPrint, setAnchorElPrint] = useState<null | HTMLElement>(null);
  const openPrint = Boolean(anchorElPrint);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any>([]);
  const [requestAbortController, setRequestAbortController] =
    useState<AbortController>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseSetting = () => {
    setAnchorElSetting(null);
  };
  const handlePrintClose = () => {
    setAnchorElPrint(null);
  };
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleOpenSetting = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSetting(event.currentTarget);
  };
  const handleOpenPrint = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElPrint(event.currentTarget);
  };

  const [openChartModal, setOpenChartModal] = useState<boolean>(false);
  const handleOpenChartModal = () => {
    setOpenChartModal(true);
  };

  const handleCloseChartModal = () => {
    setOpenChartModal(false);
  };
  const handleCheckboxChange = (index: number) => {
    setProducts((prevProducts) => ({
      ...prevProducts,
      data: prevProducts.data.map((product, i) =>
        i === index ? { ...product, isSelected: !product.isSelected } : product
      ),
    }));
  };

  const handleRestoreOriginalPrice = (data: any) => {
    updatePrintHousePrice(data, false, false);
    handleClose();
  };

  const handleUpdateNewPrice = (data: any) => {
    updatePrintHousePrice(data, true, false);
    handleClose();
  };

  const handleReviewCalculation = (data: any) => {
    window.open(
      `/products/create?profitsProfileRowId=${data?.rowId}&quantity=${data?.quantity}`,
      "_blank"
    );
    handleClose();
  };

  const onBlurPriceChange = async (item) => {
    setIsUpdate(false);
  };
  const [newPrintHousePrice, setNewPrintHousePrice] = useState(null);
  const handlePriceChange = (index: number, idx: number, newValue: string) => {
    setNewPrintHousePrice(Number(newValue));
    setProducts((prevProducts) => {
      const updatedProducts = { ...prevProducts }; // Corrected to spread the object
      const productToUpdate = { ...updatedProducts.data[index] }; // Access the data array
      const updatedPricePerQuantity = [...productToUpdate.pricePerQuantity];

      updatedPricePerQuantity[idx] = {
        ...updatedPricePerQuantity[idx],
        calculatedPrice: newValue,
      };

      productToUpdate.pricePerQuantity = updatedPricePerQuantity;
      updatedProducts.data[index] = productToUpdate; // Update the data array

      return updatedProducts; // Return the updated object
    });
  };

  const handleHideProduct = (index: number, value: boolean) => {
    setProducts((prevProducts) => {
      const updatedProducts = {
        ...prevProducts,
        data: prevProducts.data.map((product, i) =>
          i === index ? { ...product, isHidden: !value } : product
        ),
      };
      return updatedProducts;
    });
  };

  const updateDropdownValue = (value: any, index: number) => {
    setProducts((prevProducts) => {
      const updatedParameters = prevProducts.requiredParameters.map(
        (param, i) => {
          if (i === index) {
            const updatedValues = param.values.map((val) => ({
              ...val,
              isDefault: val?.id === value?.id, // Set `isDefault` true only for selected item
            }));
            return { ...param, values: updatedValues };
          }
          return param;
        }
      );
      return { ...prevProducts, requiredParameters: updatedParameters };
    });
  };

  const updateDropdownMaterialValue = (value: any, index: number) => {
    setProducts((prevProducts) => {
      const updatedParameters = prevProducts.requiredParameters.map(
        (param, i) => {
          if (i === index) {
            const updatedValues = param.materialValues.map((val) => ({
              ...val,
            }));
            return {
              ...param,
              materialValues: updatedValues,
              defaultValue: value?.value, // Set defaultValue to the selected value
            };
          }
          return param;
        }
      );
      return { ...prevProducts, requiredParameters: updatedParameters };
    });
  };

  const updateTextInputValue = (value: string, index: number) => {
    setProducts((prevProducts) => {
      const updatedParameters = prevProducts.requiredParameters.map(
        (param, i) => {
          if (i === index) {
            // Ensure the key name is `defaultValue` in `param`
            return { ...param, defaultValue: value };
          }
          return param;
        }
      );

      return { ...prevProducts, requiredParameters: updatedParameters };
    });
  };
  const onBlurQuantityChange = () => {
    updateProfitProfileProductQuantities();
  };
  const handleQuantity = (index: number, value: string) => {
    setProducts((prevProducts) => {
      const updatedHeaders = prevProducts.headers.map((header, i) => {
        if (i === index) {
          return { ...header, quantity: Number(value) }; // Update the quantity
        }
        return header;
      });

      return { ...prevProducts, headers: updatedHeaders };
    });
  };

  const getAllPricingProfileSettingForDropDownList = useCallback(async () => {
    const callBack = (res) => {
      if (res?.success) {
        setPricingProfileSetting(res?.data);
      }
    };
    await getAllPricingProfileSettingForDropDownListApi(callApi, callBack);
  }, []);

  const getAllProfitProfileProductByProductId = useCallback(
    async (productId: string) => {
      setProducts([]);
      // Abort any ongoing request
      if (requestAbortController) {
        requestAbortController.abort();
      }

      // Create a new AbortController instance
      const newRequestAbortController = new AbortController();
      setRequestAbortController(newRequestAbortController);

      const callBack = (res) => {
        if (res?.success) {
          setProducts(res?.data);
        }
      };

      // Pass the signal from the AbortController to the API call
      await getAllProfitProfileProductByProductIdApi(
        callApi,
        callBack,
        { productId },
        false,
        newRequestAbortController // Pass the signal here
      );
    },
    [requestAbortController]
  );

  const updateProfitProfileProductParameter = useCallback(
    async (data: any, value: any) => {
      const callBack = (res) => {
        const productId = Array.isArray(router.query.productId)
          ? router.query.productId[0]
          : router.query.productId;

        if (res?.success) {
          setProducts((prevProducts) => ({
            ...prevProducts,
            requiredParameters: res?.data,
          }));
        } else {
          getAllProfitProfileProductByProductId(productId);
        }
      };
      await updateProfitProfileProductParameterApi(callApi, callBack, {
        productId: router.query.productId,
        parameterId: data?.parameterId,
        parameterName: data?.parameterName,
        sectionId: data?.sectionId,
        subSectionId: data?.subSectionId,
        defaultValue: value?.valueId
          ? value?.valueId
          : value?.id
          ? value?.id
          : value,
      });
    },
    [router]
  );

  const updateProfitProfileProductQuantities = useCallback(async () => {
    const quantities = products?.headers?.map((item) => item.quantity);
    const productId = Array.isArray(router.query.productId)
      ? router.query.productId[0]
      : router.query.productId;
    const callBack = (res) => {
      if (res?.success) {
        setIsUpdateQuantity(false);
        setProducts(res?.data);
      } else {
        setIsUpdateQuantity(false);
        getAllProfitProfileProductByProductId(productId);
      }
    };
    await updateProfitProfileProductQuantitiesApi(callApi, callBack, {
      productId: productId,
      quantities: quantities,
    });
  }, [products, router]);

  const updatePrintHousePrice = useCallback(
    async (data: any, isNewPrice: boolean, isCalculatedPrice?: boolean) => {
      const productId = Array.isArray(router.query.productId)
        ? router.query.productId[0]
        : router.query.productId;

      const callBack = (res) => {
        if (res?.success) {
          setIsUpdate(false);
          setProducts(res?.data);
        } else {
          setIsUpdate(false);
          getAllProfitProfileProductByProductId(productId);
        }
      };
      await updatePrintHousePriceApi(callApi, callBack, {
        productId: productId,
        subProductId: data?.productId,
        quantity: data?.quantity,
        printHousePrice: isCalculatedPrice
          ? Number(data?.calculatedPrice)
          : Number(data?.printHousePrice),
        rowId: data?.rowId,
        isNewPrice: isNewPrice,
      });
    },
    [router, newPrintHousePrice]
  );

  const updateProfitProfileProductHidden = useCallback(
    async (data: any, handleClose: () => void) => {
      const productId = Array.isArray(router.query.productId)
        ? router.query.productId[0]
        : router.query.productId;
      const callBack = (res) => {
        if (res?.success) {
          setIsUpdate(false);
          setProducts(res?.data);
          handleClose();
        } else {
          handleClose();
          getAllProfitProfileProductByProductId(productId);
        }
      };
      await updateProfitProfileProductHiddenApi(callApi, callBack, {
        productId: productId,
        rowId: data?.rowId,
      });
    },
    [router]
  );

  const updateProfitProfileProductSelected = useCallback(
    async (data: any) => {
      const productId = Array.isArray(router.query.productId)
        ? router.query.productId[0]
        : router.query.productId;

      const callBack = (res) => {
        if (res?.success) {
          setIsUpdate(false);
          setProducts(res?.data);
        } else {
          getAllProfitProfileProductByProductId(productId);
        }
      };
      await updateProfitProfileProductSelectedApi(callApi, callBack, {
        productId: productId,
        rowId: data?.rowId,
      });
    },
    [router]
  );

  const updateSelectedPrintHousePrices = useCallback(
    async (isNewPrice: boolean) => {
      const productId = Array.isArray(router.query.productId)
        ? router.query.productId[0]
        : router.query.productId;
      const callBack = (res) => {
        if (res?.success) {
          setIsUpdate(false);
          setProducts(res?.data);
        } else {
          getAllProfitProfileProductByProductId(productId);
        }
      };
      await updateSelectedPrintHousePricesApi(callApi, callBack, {
        productId: productId,
        isNewPrice,
      });
    },
    [router]
  );

  const onClickPrint = async (isSelected?: boolean) => {
    const downloadPdf = (url) => {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.addEventListener("click", () => {
        setTimeout(() => {
          anchor.remove();
        }, 100);
      });
      anchor.click();
    };
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
        // window.open(pdfLink, "_blank");
      } else {
        alertFaultGetData();
      }
    };

    await getProfitsProfilePdfApi(callApi, callBack, {
      productId: router.query.productId,
      isSelectedProducts: isSelected,
    });
  };
  const {} = useDisplayProfitProfilesSocketIo({ setProducts });

  const resetPrintHousePrice = useCallback(async () => {
    const productId = Array.isArray(router.query.productId)
      ? router.query.productId[0]
      : router.query.productId;
    const callBack = (res) => {
      if (res?.success) {
        setProducts(res?.data);
        handleCloseSetting();
      } else {
        getAllProfitProfileProductByProductId(productId);
        handleCloseSetting();
      }
    };
    await resetPrintHousePriceApi(callApi, callBack, {
      productId: productId,
    });
  }, [router]);

  const reCalculatePrice = async () => {
    const productId = Array.isArray(router.query.productId)
      ? router.query.productId[0]
      : router.query.productId;

    const callBack = (res) => {
      if (res.success) {
        // alertSuccessUpdate();
      }
    };
    await reCalculatePriceApi(callApi, callBack, {
      productId,
    });
  };

  // here new

  // Set default date range: 6 months ago until now
  const getDefaultDateRange = () => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    return { from: sixMonthsAgo, to: now };
  };

  const defaultDates = getDefaultDateRange();
  const [fromDate, setFromDate] = useState<Date>(defaultDates.from);
  const [toDate, setToDate] = useState<Date>(defaultDates.to);
  const onSelectDeliveryTimeDates = (value) => {
    if (value && value.length === 2) {
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      // Reset to default dates if cleared
      const defaultDates = getDefaultDateRange();
      setFromDate(defaultDates.from);
      setToDate(defaultDates.to);
    }
  };

  const dir = t("direction");
  const isRTL = dir === "rtl";
  const [action, setAction] = useState<ActionOption | null>(null);
  const [actionList, setActionList] = useState<any[]>([]);
  const [profitsPricingTables, setProfitsPricingTables] = useState<any[]>([]);
  const [selectedPricingTable, setSelectedPricingTable] = useState<any>(null);
  const [isFixed, setIsFixed] = useState<boolean>(false);

  const [chartData, setChartData] = useState({
    pointsX: [],
    pointsY: [],
    userPrices: [],
    calculatedPrices: [],
    userPricesCosts: [],
    calculatedPricesCosts: [],
  });

  const getProfitsChartData = async (productId?: string) => {
    const callBack = (res) => {
      if (res?.success) {
        setChartData(res?.data);
      }
    };
    await getProfitsChartDataApi(callApi, callBack, { productId });
  };

  const getActions = useCallback(async () => {
    await getAllPrintHouseActions(callApi, setActionList);
  }, []);

  const onChangeActionId = (_e: any, option: ActionOption | null) => {
    setAction(option);
    setSelectedPricingTable(null);
  };

  const onSelectPricingTable = (_e: any, option: any) => {
    setSelectedPricingTable(option);
  };

  const getProfitsPricingTables = useCallback(async () => {
    if (action?.actionId) {
      await getAndSetProfitsPricingTables(callApi, setProfitsPricingTables, {
        actionIdOrProductId: action.actionId,
        isOutSource: false, //!here You can make this configurable if needed
      });
    }
  }, [action, callApi]);

  const getDataForAutoPricingActionsChart = async (
    fromDate?: string,
    toDate?: string,
    actionId?: string,
    pricingTableId?: string
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        const rows =
          res?.data?.[0]?.actionChartData &&
          Array.isArray(res.data[0].actionChartData)
            ? res.data[0].actionChartData
            : [];

        // (optional) sort by cost so lines draw left→right
        rows.sort((a, b) => Number(a.cost ?? 0) - Number(b.cost ?? 0));

        const next = {
          calculatedPricesCosts: rows.map((r) => Number(r.cost ?? 0)),
          calculatedPrices: rows.map((r) => Number(r.calculatedPrice ?? 0)),

          userPricesCosts: rows.map((r) => Number(r.cost ?? 0)),
          userPrices: rows.map((r) => Number(r.userInputPrice ?? 0)),

          fixedPricesCosts: rows.map((r) => Number(r.cost ?? 0)),
          fixedPrices: rows.map((r) => Number(r.fixedPrice ?? 0)),

          // 4th line example: cost vs cost (diagonal) — remove if you don’t want it
          costLineX: rows.map((r) => Number(r.cost ?? 0)),
          costLineY: rows.map((r) => Number(r.cost ?? 0)),

          // no regression points yet
          pointsX: [],
          pointsY: [],
        };

        setChartData(next);
        setIsFixed(false);
      }
    };
    await getDataForAutoPricingActionsChartApi(callApi, callBack, {
      fromDate,
      toDate,
      actionId,
      pricingTableId,
    });
  };

  const handleAutoFix = async (
    fromDate?: string,
    toDate?: string,
    actionId?: string,
    pricingTableId?: string
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        const rows =
          res?.data?.[0]?.actionChartData &&
          Array.isArray(res.data[0].actionChartData)
            ? res.data[0].actionChartData
            : [];

        // (optional) sort by cost so lines draw left→right
        rows.sort((a, b) => Number(a.cost ?? 0) - Number(b.cost ?? 0));

        const next = {
          calculatedPricesCosts: rows.map((r) => Number(r.cost ?? 0)),
          calculatedPrices: rows.map((r) => Number(r.calculatedPrice ?? 0)),

          userPricesCosts: rows.map((r) => Number(r.cost ?? 0)),
          userPrices: rows.map((r) => Number(r.userInputPrice ?? 0)),

          fixedPricesCosts: rows.map((r) => Number(r.cost ?? 0)),
          fixedPrices: rows.map((r) => Number(r.fixedPrice ?? 0)),

          // 4th line example: cost vs cost (diagonal) — remove if you don't want it
          costLineX: rows.map((r) => Number(r.cost ?? 0)),
          costLineY: rows.map((r) => Number(r.cost ?? 0)),

          // no regression points yet
          pointsX: [],
          pointsY: [],
        };

        setChartData(next);
        setIsFixed(true);
      }
    };
    await profitAutoFixApi(callApi, callBack, {
      fromDate,
      toDate,
      actionId,
      pricingTableId,
    });
  };

  const handleRollback = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const rows =
          res?.data?.[0]?.actionChartData &&
          Array.isArray(res.data[0].actionChartData)
            ? res.data[0].actionChartData
            : [];

        // (optional) sort by cost so lines draw left→right
        rows.sort((a, b) => Number(a.cost ?? 0) - Number(b.cost ?? 0));

        const next = {
          calculatedPricesCosts: rows.map((r) => Number(r.cost ?? 0)),
          calculatedPrices: rows.map((r) => Number(r.calculatedPrice ?? 0)),

          userPricesCosts: rows.map((r) => Number(r.cost ?? 0)),
          userPrices: rows.map((r) => Number(r.userInputPrice ?? 0)),

          fixedPricesCosts: rows.map((r) => Number(r.cost ?? 0)),
          fixedPrices: rows.map((r) => Number(r.fixedPrice ?? 0)),

          // 4th line example: cost vs cost (diagonal) — remove if you don't want it
          costLineX: rows.map((r) => Number(r.cost ?? 0)),
          costLineY: rows.map((r) => Number(r.cost ?? 0)),

          // no regression points yet
          pointsX: [],
          pointsY: [],
        };

        setChartData(next);
        setIsFixed(false);
      }
    };
    await rollbackUpdatedPricingTablesAfterOptimizationApi(callApi, callBack);
  };

  const exportDataForProfitsByAction = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.GET,
      `/v1/erp-service/quote/export-data-for-profits-by-action`,
      {},
      true,
      null,
      "blob"
    );

    const downloadLink = document.createElement("a");
    const link = URL?.createObjectURL(res.data);
    downloadLink.href = link;
    downloadLink.download = `DataForProfitsByAction.xlsx`;
    downloadLink.click();
  }, []);

  const onClickDownloadExcel = () => {
    exportDataForProfitsByAction();
  };

  return {
    open,
    anchorEl,
    selectedProduct,
    products,
    anchorElSetting,
    openSetting,
    handleClose,
    handleOpen,
    handleOpenSetting,
    handleCloseSetting,
    handleCheckboxChange,
    handleRestoreOriginalPrice,
    handleUpdateNewPrice,
    handleReviewCalculation,
    setSelectedProduct,
    handlePriceChange,
    isUpdate,
    setIsUpdate,
    isUpdateQuantity,
    setIsUpdateQuantity,
    onBlurPriceChange,
    handlePrintClose,
    anchorElPrint,
    openPrint,
    handleOpenPrint,
    handleHideProduct,
    updateDropdownValue,
    updateDropdownMaterialValue,
    updateTextInputValue,
    pricingProfileSetting,
    selectedPricingProfileSetting,
    setSelectedPricingProfileSetting,
    updateProfitProfileProductParameter,
    onBlurQuantityChange,
    handleQuantity,
    updatePrintHousePrice,
    updateProfitProfileProductHidden,
    updateProfitProfileProductSelected,
    updateSelectedPrintHousePrices,
    onClickPrint,
    resetPrintHousePrice,
    reCalculatePrice,
    handleCloseChartModal,
    handleOpenChartModal,
    openChartModal,
    router,
    t,
    isRTL,
    getProfitsChartData,
    chartData,
    actionList,
    onChangeActionId,
    action,
    onSelectDeliveryTimeDates,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    getDataForAutoPricingActionsChart,
    handleAutoFix,
    handleRollback,
    isFixed,
    getActions,
    getProfitsPricingTables,
    profitsPricingTables,
    selectedPricingTable,
    onSelectPricingTable,
    onClickDownloadExcel,
  };
};

export { usePriceProfit };
