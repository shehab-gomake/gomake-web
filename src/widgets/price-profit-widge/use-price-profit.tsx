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
            "CalculatedPrice": "100",
            "IsNotCalcuated": false
          }
        ]
      }
    ]
  }

  return {
    data
  };
};

export { usePriceProfit };