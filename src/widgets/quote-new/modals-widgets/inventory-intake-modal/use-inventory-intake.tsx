import { useState, useCallback } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { calculatePriceApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { useRecoilValue } from "recoil";
import { currenciesState } from "@/widgets/materials-widget/state";

interface InventoryRowData {
  code: string;
  purchaseOrderItemId: string;
  printHouseMaterialId: string;
  purchasePrice: {
    perTon: number;
    perUnit: number;
    currency: string;
  };
  salePrice: {
    perTon: number;
    perUnit: number;
    currency: string;
  };
  quantity: number;
  tableHeadingUnits: {
    inventoryUnit: {
      key: string;
      value: string;
    };
    pricingUnit: {
      key: string;
      value: string;
    };
  };
}

const useInventoryIntake = (
  rows: InventoryRowData[],
  setRows: React.Dispatch<React.SetStateAction<InventoryRowData[]>>
) => {
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const currencies = useRecoilValue<{ label: string; value: string; exchangeRate?: number }[]>(currenciesState);

  const calculatePrice = useCallback(
    async (
      rowId: string,
      printHouseMaterialId: string,
      price: number,
      currency: string,
      priceIndex: number,
      key: string,
      exchangeRate?: number,
      originalPriceKey?: string // For currency updates, this is the original priceKey (purchasePrice or salePrice)
    ) => {
      try {
        // Use provided exchange rate or find from currency
        let finalExchangeRate = exchangeRate;
        if (!finalExchangeRate) {
          const selectedCurrency = currencies?.find((c) => c.value?.toLowerCase() === currency?.toLowerCase());
          finalExchangeRate = selectedCurrency?.exchangeRate || 1;
        }

        const callBack = (res: any) => {
          if (res?.success && res?.data) {
            // Extract the nested data object (response has data.data structure)
            const priceData = res?.data?.data || res?.data;

            // Extract price array from response - API returns price as object with "value" array
            // Example: { "price unit / M^2": { "value": ["1672.370", "267.472"] } }
            // Or: { "price Unit / ton": { "value": ["8.195", "203249.008"] } }
            let priceArray: string[] = [];

            // Find any key that contains "price" - this will match "price unit / M^2", "price Unit / ton", etc.
            const priceKeys = Object.keys(priceData || {}).filter(key =>
              key.toLowerCase().includes("price")
            );

            if (priceKeys.length > 0) {
              // Use the first price key found
              const priceKey = priceKeys[0];
              const priceObject = priceData[priceKey];
              if (priceObject?.value && Array.isArray(priceObject.value)) {
                priceArray = priceObject.value.map((v: any) => v?.toString() || "0");
              }
            } else if (priceData?.perUnit !== undefined && priceData?.perSquareMeter !== undefined) {
              // Fallback to perUnit and perSquareMeter if available
              priceArray = [priceData.perUnit?.toString(), priceData.perSquareMeter?.toString()];
            } else if (priceData?.perUnit !== undefined) {
              // Single value fallback
              priceArray = [priceData.perUnit?.toString()];
            }

            const calculatedCurrency = priceData?.currency;

            // Update the row with the calculated price
            setRows((prevRows) => {
              return prevRows.map((row) => {
                if (row.purchaseOrderItemId === rowId) {
                  const updatedRow = { ...row };

                  // Update based on the key
                  // priceIndex now refers to array index (0 = perUnit, 1 = perTon) for both purchase and sale
                  // key distinguishes between purchasePrice and salePrice
                  if (key === "currency") {
                    // When updating currency, use originalPriceKey to determine which price type to update
                    const priceTypeToUpdate = originalPriceKey || "purchasePrice";
                    if (priceTypeToUpdate === "purchasePrice" || priceTypeToUpdate === "purchase") {
                      // Purchase price
                      updatedRow.purchasePrice = {
                        ...updatedRow.purchasePrice,
                        perUnit: priceArray.length > 0 ? parseFloat(priceArray[0]) : updatedRow.purchasePrice?.perUnit || price,
                        perTon: priceArray.length > 1 ? parseFloat(priceArray[1]) : updatedRow.purchasePrice?.perTon,
                        currency: calculatedCurrency || currency,
                      };
                    } else if (priceTypeToUpdate === "salePrice" || priceTypeToUpdate === "sale") {
                      // Sale price
                      updatedRow.salePrice = {
                        ...updatedRow.salePrice,
                        perUnit: priceArray.length > 0 ? parseFloat(priceArray[0]) : updatedRow.salePrice?.perUnit || price,
                        perTon: priceArray.length > 1 ? parseFloat(priceArray[1]) : updatedRow.salePrice?.perTon,
                        currency: calculatedCurrency || currency,
                      };
                    }
                  } else if (key === "purchasePrice" || key === "purchase") {
                    updatedRow.purchasePrice = {
                      ...updatedRow.purchasePrice,
                      perUnit: priceArray.length > 0 ? parseFloat(priceArray[0]) : price,
                      perTon: priceArray.length > 1 ? parseFloat(priceArray[1]) : updatedRow.purchasePrice?.perTon,
                      currency: calculatedCurrency || currency,
                    };
                  } else if (key === "salePrice" || key === "sale") {
                    updatedRow.salePrice = {
                      ...updatedRow.salePrice,
                      perUnit: priceArray.length > 0 ? parseFloat(priceArray[0]) : price,
                      perTon: priceArray.length > 1 ? parseFloat(priceArray[1]) : updatedRow.salePrice?.perTon,
                      currency: calculatedCurrency || currency,
                    };
                  }

                  return updatedRow;
                }
                return row;
              });
            });
            alertSuccessUpdate();
          } else {
            alertFaultUpdate();
          }
        };

        await calculatePriceApi(callApi, callBack, {
          printHouseMaterialId,
          price,
          currency,
          priceIndex,
          exchangeRate: finalExchangeRate,
          key,
        });
      } catch (error) {
        console.error("Error calculating price:", error);
        alertFaultUpdate();
      }
    },
    [callApi, currencies, setRows, alertSuccessUpdate, alertFaultUpdate]
  );

  const updateCellData = useCallback(
    async (
      rowId: string,
      parameterKey: string,
      updatedValue: string | number,
      exchangeRate?: number,
      priceIndex?: number
    ) => {
      const row = rows.find((r) => r.purchaseOrderItemId === rowId);
      if (!row || !row.printHouseMaterialId) {
        return;
      }

      // Determine if we need to calculate price
      const isPriceField = parameterKey === "purchasePrice" || parameterKey === "salePrice";
      const isCurrencyField = parameterKey === "purchaseCurrency" || parameterKey === "saleCurrency";

      if (isPriceField || isCurrencyField) {
        // Determine pricing type
        const isPurchase = parameterKey.includes("purchase");
        const isSale = parameterKey.includes("sale");

        const priceKey = isPurchase ? "purchasePrice" : "salePrice";

        const currentPrice = isPurchase ? row.purchasePrice?.perUnit : row.salePrice?.perUnit;
        const currentCurrency = isPurchase ? row.purchasePrice?.currency : row.salePrice?.currency;

        // Update local state immediately for better UX
        setRows((prevRows) => {
          return prevRows.map((r) => {
            if (r.purchaseOrderItemId === rowId) {
              const updatedRow = { ...r };

              if (isPurchase) {
                if (isPriceField) {
                  // Update individual price value based on index
                  if (priceIndex !== undefined && priceIndex !== null) {
                    if (priceIndex === 0) {
                      updatedRow.purchasePrice = {
                        ...updatedRow.purchasePrice,
                        perUnit: Number(updatedValue) || 0,
                      };
                    } else if (priceIndex === 1) {
                      updatedRow.purchasePrice = {
                        ...updatedRow.purchasePrice,
                        perTon: Number(updatedValue) || 0,
                      };
                    }
                  } else {
                    // Update both if no index specified
                    updatedRow.purchasePrice = {
                      ...updatedRow.purchasePrice,
                      perUnit: Number(updatedValue) || 0,
                    };
                  }
                } else if (isCurrencyField) {
                  updatedRow.purchasePrice = {
                    ...updatedRow.purchasePrice,
                    currency: updatedValue as string,
                  };
                }
              } else if (isSale) {
                if (isPriceField) {
                  // Update individual price value based on index
                  if (priceIndex !== undefined && priceIndex !== null) {
                    if (priceIndex === 0) {
                      updatedRow.salePrice = {
                        ...updatedRow.salePrice,
                        perUnit: Number(updatedValue) || 0,
                      };
                    } else if (priceIndex === 1) {
                      updatedRow.salePrice = {
                        ...updatedRow.salePrice,
                        perTon: Number(updatedValue) || 0,
                      };
                    }
                  } else {
                    // Update both if no index specified
                    updatedRow.salePrice = {
                      ...updatedRow.salePrice,
                      perUnit: Number(updatedValue) || 0,
                    };
                  }
                } else if (isCurrencyField) {
                  updatedRow.salePrice = {
                    ...updatedRow.salePrice,
                    currency: updatedValue as string,
                  };
                }
              }

              return updatedRow;
            }
            return r;
          });
        });

        // Get the updated values after state update
        // For price fields, if priceIndex is provided, use the appropriate price value
        let newPrice = currentPrice;
        if (isPriceField) {
          if (priceIndex !== undefined && priceIndex !== null) {
            // If updating by index, use the updated value for that index
            newPrice = Number(updatedValue) || 0;
          } else {
            // If no index, use the updated value
            newPrice = Number(updatedValue) || 0;
          }
        }
        const newCurrency = isCurrencyField ? (updatedValue as string) : currentCurrency;

        // priceIndex refers to which price in the array (0 = perUnit/first price, 1 = perTon/second price)
        // This is independent of whether it's purchase or sale - both use the same index values
        // For price field updates, if priceIndex is provided, it's the array index (0 = perUnit, 1 = perTon)
        // Otherwise, use default 0 for perUnit
        const apiPriceIndex = isPriceField && priceIndex !== undefined && priceIndex !== null
          ? priceIndex
          : 0;

        // Determine the key - use "currency" for currency updates, price key for price updates
        // The key distinguishes between purchasePrice and salePrice
        // For currency updates, we still need to pass the price key to distinguish purchase vs sale
        const key = isCurrencyField ? "currency" : priceKey;

        // Use provided exchange rate or get from currency
        let finalExchangeRate = exchangeRate;
        if (!finalExchangeRate && isCurrencyField) {
          const selectedCurrency = currencies?.find(
            (c) => c.value?.toLowerCase() === newCurrency?.toLowerCase()
          );
          finalExchangeRate = selectedCurrency?.exchangeRate || 1;
        } else if (!finalExchangeRate) {
          const selectedCurrency = currencies?.find(
            (c) => c.value?.toLowerCase() === currentCurrency?.toLowerCase()
          );
          finalExchangeRate = selectedCurrency?.exchangeRate || 1;
        }

        // Call calculate price API with exchange rate
        // apiPriceIndex is the array index (0 = perUnit, 1 = perTon) for both purchase and sale
        // For currency updates, pass the original priceKey so the callback knows which price to update
        await calculatePrice(
          rowId,
          row.printHouseMaterialId,
          newPrice,
          newCurrency,
          apiPriceIndex,
          key,
          finalExchangeRate,
          isCurrencyField ? priceKey : undefined
        );
      } else {
        // For non-price fields, just update the local state
        setRows((prevRows) => {
          return prevRows.map((r) => {
            if (r.purchaseOrderItemId === rowId) {
              const updatedRow = { ...r };

              if (parameterKey === "code") {
                updatedRow.code = updatedValue as string;
              }

              return updatedRow;
            }
            return r;
          });
        });
      }
    },
    [rows, calculatePrice, setRows]
  );

  return {
    updateCellData,
    calculatePrice,
  };
};

export { useInventoryIntake };
export type { InventoryRowData };

