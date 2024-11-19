import { useGomakeAxios } from "@/hooks";
import { useDisplayProfitProfilesSignalr } from "@/hooks/signalr/use-display-profit-profiles-signalr";
import { EHttpMethod } from "@/services/api-service/enums";
import { getAllPricingProfileSettingForDropDownListApi, getAllProfitProfileProductByProductIdApi, updatePrintHousePriceApi, updateProfitProfileProductParameterApi, updateProfitProfileProductQuantitiesApi } from "@/services/api-service/products/product-endpoints";
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

  // const data = {
  //   "headers": [
  //     {
  //       "Qunatity": "10",
  //       "Total": "100"
  //     },
  //     {
  //       "Qunatity": "100",
  //       "Total": "100"
  //     },
  //     {
  //       "Qunatity": "300",
  //       "Total": "100"
  //     },
  //     {
  //       "Qunatity": "1000",
  //       "Total": "100"
  //     },
  //     {
  //       "Qunatity": "5000",
  //       "Total": "100"
  //     }
  //   ],
  //   "parameters": [
  //     {
  //       "ParameterName": "width",
  //       "ParameterId": "",
  //       "Type": "1",
  //       "defaultValue": "100",
  //       "values": []
  //     },
  //     {
  //       "ParameterName": "length",
  //       "ParameterId": "",
  //       "Type": "1",
  //       "defaultValue": "",
  //       "values": []
  //     },
  //     {
  //       "ParameterName": "Sheet cateogry",
  //       "ParameterId": "",
  //       "Type": "5",
  //       "defaultValue": "",
  //       "values": [
  //         {
  //           "id": "uncoted",
  //           "label": "uncoted",
  //           "isDefault": true
  //         },
  //         {
  //           "id": "coted mate",
  //           "label": "coted mate",
  //           "isDefault": false
  //         }
  //       ]
  //     },
  //     {
  //       "ParameterName": "Sheet weight",
  //       "ParameterId": "",
  //       "Type": "5",
  //       "defaultValue": "",
  //       "values": [
  //         {
  //           "id": "100",
  //           "label": "100",
  //           "isDefault": false
  //         }
  //       ]
  //     },
  //   ],
  //   "data": [
  //     {
  //       "ProductId": "3123123212",
  //       "ProductName": "Paper + preprss",
  //       "IsSelected": true,
  //       "IsHidden": false,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "120",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": true
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "445ssww855",
  //       "ProductName": "Folding",
  //       "IsSelected": false,
  //       "IsHidden": true,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "150",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "445855",
  //       "ProductName": "Folding",
  //       "IsSelected": false,
  //       "IsHidden": false,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "150",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "3123123212",
  //       "ProductName": "Paper + preprss",
  //       "IsSelected": true,
  //       "IsHidden": false,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "120",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": true
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "445ssww855",
  //       "ProductName": "Folding",
  //       "IsSelected": false,
  //       "IsHidden": true,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "150",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "445855",
  //       "ProductName": "Folding",
  //       "IsSelected": false,
  //       "IsHidden": false,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "150",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "3123123212",
  //       "ProductName": "Paper + preprss",
  //       "IsSelected": true,
  //       "IsHidden": false,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "120",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": true
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "445ssww855",
  //       "ProductName": "Folding",
  //       "IsSelected": false,
  //       "IsHidden": true,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "150",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "445855",
  //       "ProductName": "Folding",
  //       "IsSelected": false,
  //       "IsHidden": false,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "150",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "3123123212",
  //       "ProductName": "Paper + preprss",
  //       "IsSelected": true,
  //       "IsHidden": false,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "120",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": true
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "445ssww855",
  //       "ProductName": "Folding",
  //       "IsSelected": false,
  //       "IsHidden": true,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "150",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "445855",
  //       "ProductName": "Folding",
  //       "IsSelected": false,
  //       "IsHidden": false,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "150",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "3123123212",
  //       "ProductName": "Paper + preprss",
  //       "IsSelected": true,
  //       "IsHidden": false,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "120",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": true
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "445ssww855",
  //       "ProductName": "Folding",
  //       "IsSelected": false,
  //       "IsHidden": true,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "150",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     },
  //     {
  //       "ProductId": "445855",
  //       "ProductName": "Folding",
  //       "IsSelected": false,
  //       "IsHidden": false,
  //       "PricePerQuantity": [
  //         {
  //           "Qunatity": "10",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "100",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "300",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "1000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "100",
  //           "IsNotCalcuated": false
  //         },
  //         {
  //           "Qunatity": "5000",
  //           "PrintHousePrice": "100",
  //           "CalculatedPrice": "150",
  //           "IsNotCalcuated": false
  //         }
  //       ]
  //     }
  //   ]
  // }
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
    console.log('data1', data)
    // Add logic for restoring the original price
    handleClose()
  };

  const handleUpdateNewPrice = (data: any) => {
    console.log('data2', data)
    // Add logic for updating the new price
    handleClose()
  };

  const handleReviewCalculation = (data: any) => {
    console.log('data3', data)
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
      defaultValue: value?.valueId ? value?.valueId : value?.id ? value?.id : data?.defaultValue
    });
  }, [selectedPricingProfileSetting]);

  const updateProfitProfileProductQuantities = useCallback(async () => {
    const quantities = products?.headers?.map(item => item.quantity);

    const callBack = (res) => {
      if (res?.success) {
        setIsUpdateQuantity(false);
        getAllProfitProfileProductByProductId(selectedPricingProfileSetting?.productId)
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

  const updatePrintHousePrice = useCallback(async (data: any) => {
    console.log("data", data)
    const callBack = (res) => {
      if (res?.success) {
        setIsUpdate(false);
        getAllProfitProfileProductByProductId(selectedPricingProfileSetting?.productId)
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
      printHousePrice: Number(data?.calculatedPrice),
      rowId: data?.rowId
    });
  }, [selectedPricingProfileSetting, newPrintHousePrice]);

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
    updatePrintHousePrice
  };
};

export { usePriceProfit };