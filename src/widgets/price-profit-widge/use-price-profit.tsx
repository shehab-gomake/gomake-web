import { useEffect, useState } from "react";

const usePriceProfit = () => {
  const data = {
    "headers": [
      {
        "Qunatity": "10",
        "Total": "100"
      },
      {
        "Qunatity": "100",
        "Total": "100"
      },
      {
        "Qunatity": "300",
        "Total": "100"
      },
      {
        "Qunatity": "1000",
        "Total": "100"
      },
      {
        "Qunatity": "5000",
        "Total": "100"
      }
    ],
    "parameters": [
      {
        "ParameterName": "width",
        "ParameterId": "",
        "Type": "1",
        "defualtValue": "100",
        "values": []
      },
      {
        "ParameterName": "length",
        "ParameterId": "",
        "Type": "1",
        "defualtValue": "",
        "values": []
      },
      {
        "ParameterName": "Sheet cateogry",
        "ParameterId": "",
        "Type": "5",
        "defualtValue": "",
        "values": [
          {
            "id": "uncoted",
            "label": "uncoted",
            "isDefualt": true
          },
          {
            "id": "coted mate",
            "label": "coted mate",
            "isDefualt": false
          }
        ]
      },
      {
        "ParameterName": "Sheet weight",
        "ParameterId": "",
        "Type": "5",
        "defualtValue": "",
        "values": [
          {
            "id": "100",
            "label": "100",
            "isDefualt": false
          }
        ]
      },
    ],
    "data": [
      {
        "ProductId": "3123123212",
        "ProductName": "Paper + preprss",
        "IsSelected": true,
        "IsHidden": false,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "120",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": true
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "445ssww855",
        "ProductName": "Folding",
        "IsSelected": false,
        "IsHidden": true,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "150",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "445855",
        "ProductName": "Folding",
        "IsSelected": false,
        "IsHidden": false,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "150",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "3123123212",
        "ProductName": "Paper + preprss",
        "IsSelected": true,
        "IsHidden": false,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "120",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": true
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "445ssww855",
        "ProductName": "Folding",
        "IsSelected": false,
        "IsHidden": true,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "150",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "445855",
        "ProductName": "Folding",
        "IsSelected": false,
        "IsHidden": false,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "150",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "3123123212",
        "ProductName": "Paper + preprss",
        "IsSelected": true,
        "IsHidden": false,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "120",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": true
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "445ssww855",
        "ProductName": "Folding",
        "IsSelected": false,
        "IsHidden": true,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "150",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "445855",
        "ProductName": "Folding",
        "IsSelected": false,
        "IsHidden": false,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "150",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "3123123212",
        "ProductName": "Paper + preprss",
        "IsSelected": true,
        "IsHidden": false,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "120",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": true
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "445ssww855",
        "ProductName": "Folding",
        "IsSelected": false,
        "IsHidden": true,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "150",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "445855",
        "ProductName": "Folding",
        "IsSelected": false,
        "IsHidden": false,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "150",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "3123123212",
        "ProductName": "Paper + preprss",
        "IsSelected": true,
        "IsHidden": false,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "120",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": true
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "445ssww855",
        "ProductName": "Folding",
        "IsSelected": false,
        "IsHidden": true,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "150",
            "IsNotCalcuated": false
          }
        ]
      },
      {
        "ProductId": "445855",
        "ProductName": "Folding",
        "IsSelected": false,
        "IsHidden": false,
        "PricePerQuantity": [
          {
            "Qunatity": "10",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "100",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "300",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "1000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          },
          {
            "Qunatity": "5000",
            "PrintHousePrice": "100",
            "CalculatedPrice": "150",
            "IsNotCalcuated": false
          }
        ]
      }
    ]
  }
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  const [products, setProducts] = useState(data);

  useEffect(() => {
    setProducts(data)
  }, [])

  const handleCheckboxChange = (index: number) => {
    setProducts(prevProducts => ({
      ...prevProducts,
      data: prevProducts.data.map((product, i) =>
        i === index ? { ...product, IsSelected: !product.IsSelected } : product
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
  const handlePriceChange = (index: number, idx: number, newValue: string) => {
    setProducts((prevProducts) => {
      const updatedProducts = { ...prevProducts }; // Corrected to spread the object
      const productToUpdate = { ...updatedProducts.data[index] }; // Access the data array
      const updatedPricePerQuantity = [...productToUpdate.PricePerQuantity];

      updatedPricePerQuantity[idx] = {
        ...updatedPricePerQuantity[idx],
        CalculatedPrice: newValue
      };

      productToUpdate.PricePerQuantity = updatedPricePerQuantity;
      updatedProducts.data[index] = productToUpdate; // Update the data array

      return updatedProducts; // Return the updated object
    });
  };

  const handleHideProduct = (index: number, value: boolean) => {
    setProducts(prevProducts => {
      const updatedProducts = {
        ...prevProducts,
        data: prevProducts.data.map((product, i) =>
          i === index ? { ...product, IsHidden: !value } : product
        )
      };
      return updatedProducts;
    });
  };




  return {
    data,
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
    onBlurPriceChange,
    handlePrintClose,
    anchorElPrint,
    openPrint,
    handleOpenPrint,
    handleHideProduct
  };
};

export { usePriceProfit };