import { useState } from "react";

const usePriceProfit = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };


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

  return {
    data,
    open,
    anchorEl,
    handleClose,
    handleOpen
  };
};

export { usePriceProfit };