import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useDisplayProfitProfilesSignalr } from "@/hooks/signalr/use-display-profit-profiles-signalr";
import { useGomakeRouter } from "@/hooks/use-gomake-router";
import { EHttpMethod } from "@/services/api-service/enums";
import { getAllPricingProfileSettingForDropDownListApi, getAllProfitProfileProductByProductIdApi, getProfitsProfilePdfApi, updatePrintHousePriceApi, updateProfitProfileProductHiddenApi, updateProfitProfileProductParameterApi, updateProfitProfileProductQuantitiesApi, updateProfitProfileProductSelectedApi, updateSelectedPrintHousePricesApi } from "@/services/api-service/products/product-endpoints";
import { useCallback, useEffect, useState } from "react";

interface PricingProfileSetting {
  id: string;
  productId?: string;
  productName?: string;
  label: string;
  value: string;
}

const usePriceProfit = () => {
  const { callApi } = useGomakeAxios();
  const { } = useDisplayProfitProfilesSignalr()
  const { alertFaultGetData } = useSnackBar();
  const [pricingProfileSetting, setPricingProfileSetting] = useState<PricingProfileSetting[]>([])
  const [selectedPricingProfileSetting, setSelectedPricingProfileSetting] = useState<PricingProfileSetting | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUpdateQuantity, setIsUpdateQuantity] = useState(false); // New state variable
  const [isUpdate, setIsUpdate] = useState(false); // New state variable
  const [anchorElSetting, setAnchorElSetting] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openSetting = Boolean(anchorElSetting);
  const [anchorElPrint, setAnchorElPrint] = useState<null | HTMLElement>(null);
  const openPrint = Boolean(anchorElPrint);
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

  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const [products, setProducts] = useState<any>([]);
  const [requestAbortController, setRequestAbortController] =
    useState<AbortController>(null);
  // useEffect(() => {
  //   setProducts(data)
  // }, [])

  const handleCheckboxChange = (index: number) => {
    setProducts(prevProducts => ({
      ...prevProducts,
      data: prevProducts.data.map((product, i) =>
        i === index ? { ...product, isSelected: !product.isSelected } : product
      )
    }));
  };

  const handleRestoreOriginalPrice = (data: any) => {
    updatePrintHousePrice(data, false, false)
    handleClose()
  };

  const handleUpdateNewPrice = (data: any) => {
    updatePrintHousePrice(data, true,false)
    handleClose()
  };

  const handleReviewCalculation = (data: any) => {
    window.open(`/products/create?profitsProfileRowId=${data?.rowId}&quantity=${data?.quantity}`, "_blank");
    // Add logic for reviewing the calculation
    handleClose()
  };

  const onBlurPriceChange = async (item) => {
    setIsUpdate(false);
  };
  const [newPrintHousePrice, setNewPrintHousePrice] = useState(null)
  const handlePriceChange = (index: number, idx: number, newValue: string) => {
    setNewPrintHousePrice(Number(newValue))
    setProducts((prevProducts) => {
      const updatedProducts = { ...prevProducts }; // Corrected to spread the object
      const productToUpdate = { ...updatedProducts.data[index] }; // Access the data array
      const updatedPricePerQuantity = [...productToUpdate.pricePerQuantity];

      updatedPricePerQuantity[idx] = {
        ...updatedPricePerQuantity[idx],
        calculatedPrice: newValue
      };

      productToUpdate.pricePerQuantity = updatedPricePerQuantity;
      updatedProducts.data[index] = productToUpdate; // Update the data array

      return updatedProducts; // Return the updated object
    });
  };

  const handleHideProduct = (index: number, value: boolean) => {
    setProducts(prevProducts => {
      const updatedProducts = {
        ...prevProducts,
        data: prevProducts.data.map((product, i) =>
          i === index ? { ...product, isHidden: !value } : product
        )
      };
      return updatedProducts;
    });
  };

  const updateDropdownValue = (value: any, index: number) => {
    setProducts(prevProducts => {
      const updatedParameters = prevProducts.requiredParameters.map((param, i) => {
        if (i === index) {
          const updatedValues = param.values.map(val => ({
            ...val,
            isDefault: val?.id === value?.id // Set `isDefault` true only for selected item
          }));
          return { ...param, values: updatedValues };
        }
        return param;
      });
      return { ...prevProducts, requiredParameters: updatedParameters };
    });
  };

  const updateDropdownMaterialValue = (value: any, index: number) => {
    setProducts(prevProducts => {
      const updatedParameters = prevProducts.requiredParameters.map((param, i) => {
        if (i === index) {
          const updatedValues = param.materialValues.map(val => ({
            ...val,
          }));
          return { ...param, materialValues: updatedValues };
        }
        return param;
      });
      return { ...prevProducts, requiredParameters: updatedParameters };
    });
  };

  const updateTextInputValue = (value: string, index: number) => {
    console.log("aaaaaa",value)
    setProducts(prevProducts => {
      const updatedParameters = prevProducts.requiredParameters.map((param, i) => {
        if (i === index) {
          // Ensure the key name is `defaultValue` in `param`
          return { ...param, defaultValue: value };
        }
        return param;
      });

      return { ...prevProducts, requiredParameters: updatedParameters };
    });
  };
  const onBlurQuantityChange = () => {
    updateProfitProfileProductQuantities()

  };
  const handleQuantity = (index: number, value: string) => {
    setProducts(prevProducts => {
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
        setPricingProfileSetting(res?.data)
      }
    };
    await getAllPricingProfileSettingForDropDownListApi(callApi, callBack);
  }, []);

  const getAllProfitProfileProductByProductId = useCallback(async (productId: string) => {
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

  }, [requestAbortController]);
  useEffect(() => {
    getAllPricingProfileSettingForDropDownList()
  }, [])

  useEffect(() => {
    if (selectedPricingProfileSetting?.productId) {
      getAllProfitProfileProductByProductId(selectedPricingProfileSetting?.productId)
    }
  }, [selectedPricingProfileSetting])

  const updateProfitProfileProductParameter = useCallback(async (data: any, value: any) => {
    console.log("qqqqq",{value,data})
    const callBack = (res) => {
      if (res?.success) {
        getAllProfitProfileProductByProductId(selectedPricingProfileSetting?.productId)
      }
      else {
        getAllProfitProfileProductByProductId(selectedPricingProfileSetting?.productId)
      }
    };
    await updateProfitProfileProductParameterApi(callApi, callBack, {
      productId: selectedPricingProfileSetting?.productId,
      parameterId: data?.parameterId,
      parameterName: data?.parameterName,
      sectionId: data?.sectionId,
      subSectionId: data?.subSectionId,
      defaultValue: value?.valueId ? value?.valueId : value?.id ? value?.id : value
    });
  }, [selectedPricingProfileSetting]);

  const updateProfitProfileProductQuantities = useCallback(async () => {
    const quantities = products?.headers?.map(item => item.quantity);

    const callBack = (res) => {
      if (res?.success) {
        setIsUpdateQuantity(false);
        setProducts(res?.data)
      }
      else {
        setIsUpdateQuantity(false);
        getAllProfitProfileProductByProductId(selectedPricingProfileSetting?.productId)
      }
    };
    await updateProfitProfileProductQuantitiesApi(callApi, callBack, {
      productId: selectedPricingProfileSetting?.productId,
      quantities: quantities
    });
  }, [products, selectedPricingProfileSetting]);

  const updatePrintHousePrice = useCallback(async (data: any, isNewPrice: boolean, isCalculatedPrice?: boolean) => {
    const callBack = (res) => {
      if (res?.success) {
        setIsUpdate(false);
        setProducts(res?.data)
      }
      else {
        setIsUpdate(false);
        getAllProfitProfileProductByProductId(selectedPricingProfileSetting?.productId)

      }
    };
    await updatePrintHousePriceApi(callApi, callBack, {
      productId: selectedPricingProfileSetting?.productId,
      subProductId: data?.productId,
      quantity: data?.quantity,
      printHousePrice:isCalculatedPrice? Number(data?.calculatedPrice):Number(data?.printHousePrice),
      rowId: data?.rowId,
      isNewPrice:isNewPrice
    });
  }, [selectedPricingProfileSetting, newPrintHousePrice]);

  const updateProfitProfileProductHidden = useCallback(async (data: any, handleClose: () => void) => {
    const callBack = (res) => {
      if (res?.success) {
        setIsUpdate(false);
        setProducts(res?.data)
        handleClose()
      }
      else {
        handleClose()
        getAllProfitProfileProductByProductId(selectedPricingProfileSetting?.productId)
      }
    }
    await updateProfitProfileProductHiddenApi(callApi, callBack, {
      productId: selectedPricingProfileSetting?.productId,
      rowId: data?.rowId,
    });
  }, [selectedPricingProfileSetting])

  const updateProfitProfileProductSelected = useCallback(async (data: any, ) => {
    const callBack = (res) => {
      if (res?.success) {
        setIsUpdate(false);
        setProducts(res?.data)
      }
      else {
        getAllProfitProfileProductByProductId(selectedPricingProfileSetting?.productId)
      }
    }
    await updateProfitProfileProductSelectedApi(callApi, callBack, {
      productId: selectedPricingProfileSetting?.productId,
      rowId: data?.rowId,
    });
  }, [selectedPricingProfileSetting])

  const updateSelectedPrintHousePrices = useCallback(async (isNewPrice: boolean) => {
    const callBack = (res) => {
      if (res?.success) {
        setIsUpdate(false);
        setProducts(res?.data)
      }
      else {
        getAllProfitProfileProductByProductId(selectedPricingProfileSetting?.productId)
      }
    }
    await updateSelectedPrintHousePricesApi(callApi, callBack, {
      productId: selectedPricingProfileSetting?.productId,
      isNewPrice,
    });
  }, [selectedPricingProfileSetting])

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
      productId: selectedPricingProfileSetting?.productId,
      isSelectedProducts:isSelected
    });
     
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
    onClickPrint
  };
};

export { usePriceProfit };