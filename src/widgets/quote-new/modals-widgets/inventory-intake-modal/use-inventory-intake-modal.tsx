import { useState, useEffect } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { addSupplierInventoryForPurchaseOrderApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { useInventoryIntake, InventoryRowData } from "./use-inventory-intake";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

interface UseInventoryIntakeModalProps {
  open: boolean;
  inventoryData: any[];
  purchaseOrderId?: string;
  documentType?: number;
  onClose: () => void;
}

export const useInventoryIntakeModal = ({
  open,
  inventoryData,
  purchaseOrderId,
  documentType = DOCUMENT_TYPE.purchaseOrder,
  onClose,
}: UseInventoryIntakeModalProps) => {
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate, alertRequiredFields } = useSnackBar();

  // State management
  const [rows, setRows] = useState<InventoryRowData[]>([]);
  const [isAllIntaked, setIsAllIntaked] = useState(false);
  const [isIntaking, setIsIntaking] = useState(false);

  const { updateCellData } = useInventoryIntake(rows, setRows);

  // Transform inventory data when modal opens
  useEffect(() => {
    if (open) {
      if (inventoryData && inventoryData.length > 0) {
        // Transform API data - extract price arrays using dynamic pricing unit key
        const transformedData = inventoryData.map((item: any) => {
          // Get the pricing unit key from tableHeadingUnits
          const pricingUnitKey = item.tableHeadingUnits?.pricingUnit?.key;

          // Extract price array from the structure: { "CostPerRollPerSquareMeterPerTon": { "value": ["6297.820", "25.191", "157445.500"] } }
          // Returns all values (1, 2, or 3) without padding zeros
          const extractPriceArray = (priceObj: any, unitKey: string): number[] => {
            if (!priceObj || !unitKey) return [];

            // Use the pricing unit key to get the price object
            const priceObject = priceObj[unitKey];
            if (priceObject?.value && Array.isArray(priceObject.value)) {
              // Return all values, converting to numbers and filtering out invalid values
              return priceObject.value
                .map((v: any) => parseFloat(v))
                .filter((v: number) => !isNaN(v));
            }

            // Fallback to perUnit and perTon if they exist directly
            if (priceObj?.perUnit !== undefined || priceObj?.perTon !== undefined) {
              const result: number[] = [];
              if (priceObj?.perUnit !== undefined) result.push(priceObj.perUnit);
              if (priceObj?.perTon !== undefined) result.push(priceObj.perTon);
              return result;
            }

            return [];
          };

          const purchasePriceArray = extractPriceArray(item.purchasePrice, pricingUnitKey);
          const salePriceArray = extractPriceArray(item.salePrice, pricingUnitKey);

          // For backward compatibility, keep perUnit and perTon (first two values)
          const purchasePerUnitValue = purchasePriceArray[0] || 0;
          const purchasePerTonValue = purchasePriceArray[1] || 0;
          const salePerUnitValue = salePriceArray[0] || 0;
          const salePerTonValue = salePriceArray[1] || 0;

          return {
            ...item,
            name: item.name,
            supplierId: item.supplierId,
            clients: item.clients || [],
            packagesQuantity: item.packagesQuantity,
            quantityInPackage: item.quantityInPackage,
            purchasePrice: {
              ...item.purchasePrice,
              perUnit: purchasePerUnitValue,
              perTon: purchasePerTonValue,
              priceArray: purchasePriceArray, // Store full array (1, 2, or 3 values)
              currency: item.purchasePrice?.currency || item.currency,
              // Preserve the original structure with pricing unit key
              pricingUnitKey: pricingUnitKey,
            },
            salePrice: {
              ...(item.salePrice || {}),
              perUnit: salePerUnitValue || purchasePerUnitValue,
              perTon: salePerTonValue || purchasePerTonValue,
              priceArray: salePriceArray.length > 0 ? salePriceArray : purchasePriceArray, // Store full array (1, 2, or 3 values)
              currency: item.salePrice?.currency || item.currency,
              // Preserve the original structure with pricing unit key
              pricingUnitKey: pricingUnitKey,
            },
            isSplit: false,
            splitGroupId: undefined,
            isOriginal: undefined,
          };
        });
        setRows(transformedData);
        setIsAllIntaked(false);
      } else if (inventoryData && inventoryData.length === 0) {
        // All items are already intaked
        setIsAllIntaked(true);
        setRows([]);
      } else {
        // Use mock data for development
        setIsAllIntaked(false);
      }
    }
  }, [open, inventoryData]);

  const handleIntake = async () => {
    // Validate required fields
    if (!purchaseOrderId) {
      alertRequiredFields();
      return;
    }

    if (rows.length === 0) {
      alertRequiredFields();
      return;
    }

    // Validate each row has required fields
    const invalidRows = rows.filter(row => {
      return !row.printHouseMaterialId ||
        !row.purchasePrice?.perUnit ||
        !row.salePrice?.perUnit ||
        !row.purchasePrice?.currency ||
        !row.salePrice?.currency ||
        !row.purchaseOrderItemId;
    });

    if (invalidRows.length > 0) {
      alertRequiredFields();
      return;
    }

    setIsIntaking(true);

    // Transform rows to the expected payload format
    // The body should be an array of inventory items directly
    // Each inventory item should have its own purchaseOrderItemId
    // Remove supplierId and clients from items as per new API structure
    const inventories = rows.map(row => ({
      printHouseMaterialId: row.printHouseMaterialId,
      code: row.code || "",
      quantity: row.quantity || 0,
      isActive: true,
      purchasePrice: row.purchasePrice?.perUnit || 0, // Use perUnit (first price value)
      salePrice: row.salePrice?.perUnit || 0, // Use perUnit (first price value)
      purchaseCurrency: row.purchasePrice?.currency || "USD",
      saleCurrency: row.salePrice?.currency || "USD",
      purchaseOrderItemId: row.purchaseOrderItemId, // Each item has its own purchaseOrderItemId
    }));

    const payload = {
      documentType: documentType, // Pass documentType as path parameter
      documentId: purchaseOrderId, // Use purchaseOrderId as documentId
      inventories: inventories, // Array of inventory items
    };

    const callBack = (res: any) => {
      setIsIntaking(false);
      if (res?.success) {
        alertSuccessUpdate();
        onClose();
        // Optionally refresh the data or close the modal
      } else {
        alertFaultUpdate();
      }
    };

    await addSupplierInventoryForPurchaseOrderApi(callApi, callBack, payload);
  };

  const handleSplitInventoryPackages = (purchaseOrderItemId: string) => {
    setRows((prevRows) => {
      const rowIndex = prevRows.findIndex((r) => r.purchaseOrderItemId === purchaseOrderItemId);
      if (rowIndex === -1) return prevRows;

      const row = prevRows[rowIndex];
      const packagesQuantity = row.packagesQuantity || 1;
      const quantityInPackage = row.quantityInPackage || row.quantity;

      // Validate that we can split
      if (packagesQuantity <= 1) {
        return prevRows; // Can't split if only 1 package
      }

      // Create split items
      const splitItems: InventoryRowData[] = [];
      for (let i = 0; i < packagesQuantity; i++) {
        splitItems.push({
          ...row,
          purchaseOrderItemId: `${row.purchaseOrderItemId}_split_${i}`, // Unique ID for each split item
          quantity: quantityInPackage,
          packagesQuantity: packagesQuantity, // Preserve original packagesQuantity
          quantityInPackage: quantityInPackage, // Preserve quantityInPackage
          isSplit: true,
          splitGroupId: row.purchaseOrderItemId, // Track the original item ID
          isOriginal: false,
          code: row.code || '', // Preserve original code without modification
        });
      }

      // Replace the original row with split items
      const newRows = [...prevRows];
      newRows.splice(rowIndex, 1, ...splitItems);
      return newRows;
    });
  };

  const handleMergeInventoryPackages = (splitGroupId: string) => {
    setRows((prevRows) => {
      // Find all items in the split group
      const splitItems = prevRows.filter((r) => r.splitGroupId === splitGroupId);
      if (splitItems.length === 0) return prevRows;

      // Get packagesQuantity and quantityInPackage from the first split item
      const packagesQuantity = splitItems.length;
      const quantityInPackage = splitItems[0]?.quantityInPackage || splitItems[0]?.quantity || 0;

      // Calculate quantity as quantityInPackage * packagesQuantity
      const totalQuantity = quantityInPackage * packagesQuantity;

      // Reconstruct the original item
      const originalItem: InventoryRowData = {
        ...splitItems[0],
        purchaseOrderItemId: splitGroupId, // Restore original ID
        quantity: totalQuantity, // Use quantityInPackage * packagesQuantity
        packagesQuantity: packagesQuantity,
        quantityInPackage: quantityInPackage,
        isSplit: false,
        splitGroupId: undefined,
        isOriginal: undefined,
        code: splitItems[0]?.code?.replace(/-\d+$/, '') || splitItems[0]?.code || '', // Remove package number suffix
      };

      // Remove all split items and add the merged item
      const newRows = prevRows.filter((r) => r.splitGroupId !== splitGroupId);
      const firstSplitIndex = prevRows.findIndex((r) => r.splitGroupId === splitGroupId);
      newRows.splice(firstSplitIndex, 0, originalItem);

      return newRows;
    });
  };

  const handleCodeUpdate = (rowId: string, newValue: string) => {
    // Update local state only, no API call
    setRows((prevRows) => {
      return prevRows.map((r) => {
        if (r.purchaseOrderItemId === rowId) {
          return {
            ...r,
            code: newValue,
          };
        }
        return r;
      });
    });
  };

  return {
    rows,
    isAllIntaked,
    isIntaking,
    updateCellData,
    handleIntake,
    handleSplitInventoryPackages,
    handleMergeInventoryPackages,
    handleCodeUpdate,
  };
};

