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
      exchangeRate?: number
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
            const calculatedPerUnit = priceData?.perUnit;
            const calculatedCurrency = priceData?.currency;
            const calculatedPerSquareMeter = priceData?.perSquareMeter;

            // Update the row with the calculated price
            setRows((prevRows) => {
              return prevRows.map((row) => {
                if (row.purchaseOrderItemId === rowId) {
                  const updatedRow = { ...row };

                  // Update based on the key
                  if (key === "currency") {
                    // When updating currency, update both price and currency for the corresponding price type
                    // Determine which price type based on priceIndex (0 = purchase, 1 = sale)
                    if (priceIndex === 0) {
                      // Purchase price
                      updatedRow.purchasePrice = {
                        ...updatedRow.purchasePrice,
                        perUnit: calculatedPerUnit || updatedRow.purchasePrice?.perUnit || price,
                        currency: calculatedCurrency || currency,
                        perTon: calculatedPerSquareMeter || updatedRow.purchasePrice?.perTon,
                      };
                    } else if (priceIndex === 1) {
                      // Sale price
                      updatedRow.salePrice = {
                        ...updatedRow.salePrice,
                        perUnit: calculatedPerUnit || updatedRow.salePrice?.perUnit || price,
                        currency: calculatedCurrency || currency,
                        perTon: calculatedPerSquareMeter || updatedRow.salePrice?.perTon,
                      };
                    }
                  } else if (key === "purchasePrice" || key === "purchase") {
                    updatedRow.purchasePrice = {
                      ...updatedRow.purchasePrice,
                      perUnit: calculatedPerUnit || price,
                      currency: calculatedCurrency || currency,
                      perTon: calculatedPerSquareMeter || updatedRow.purchasePrice?.perTon,
                    };
                  } else if (key === "salePrice" || key === "sale") {
                    updatedRow.salePrice = {
                      ...updatedRow.salePrice,
                      perUnit: calculatedPerUnit || price,
                      currency: calculatedCurrency || currency,
                      perTon: calculatedPerSquareMeter || updatedRow.salePrice?.perTon,
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
      exchangeRate?: number
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
                  updatedRow.purchasePrice = {
                    ...updatedRow.purchasePrice,
                    perUnit: Number(updatedValue) || 0,
                  };
                } else if (isCurrencyField) {
                  updatedRow.purchasePrice = {
                    ...updatedRow.purchasePrice,
                    currency: updatedValue as string,
                  };
                }
              } else if (isSale) {
                if (isPriceField) {
                  updatedRow.salePrice = {
                    ...updatedRow.salePrice,
                    perUnit: Number(updatedValue) || 0,
                  };
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
        const newPrice = isPriceField ? (Number(updatedValue) || 0) : currentPrice;
        const newCurrency = isCurrencyField ? (updatedValue as string) : currentCurrency;

        // Determine priceIndex (0 for purchase, 1 for sale based on typical API patterns)
        // But checking the image, it seems like priceIndex might be 0 or 1
        // Let's use 0 for purchase, 1 for sale
        const priceIndex = isPurchase ? 0 : 1;

        // Determine the key - use "currency" for currency updates, price key for price updates
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
        await calculatePrice(
          rowId,
          row.printHouseMaterialId,
          newPrice,
          newCurrency,
          priceIndex,
          key,
          finalExchangeRate
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

