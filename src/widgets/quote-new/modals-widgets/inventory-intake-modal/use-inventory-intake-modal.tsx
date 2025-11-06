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

  // Use custom hook for inventory intake operations
  const { updateCellData } = useInventoryIntake(rows, setRows);

  // Transform inventory data when modal opens
  useEffect(() => {
    if (open) {
      if (inventoryData && inventoryData.length > 0) {
        // Transform API data - extract price arrays if available and ensure salePrice is initialized
        const transformedData = inventoryData.map((item: any) => {
          // Extract purchase price array if available
          let purchasePerUnit = item.purchasePrice?.perUnit || 0;
          let purchasePerTon = item.purchasePrice?.perTon || 0;
          let salePerUnit = item.salePrice?.perUnit || 0;
          let salePerTon = item.salePrice?.perTon || 0;

          // Extract price array from the structure: { "price unit / M^2": { "value": ["1672.370", "267.472"] } }
          // Or: { "price Unit / ton": { "value": ["8.195", "203249.008"] } }
          const extractPriceArray = (priceObj: any): number[] => {
            if (!priceObj) return [0, 0];

            // Find any key that contains "price" - this will match "price unit / M^2", "price Unit / ton", etc.
            const priceKeys = Object.keys(priceObj).filter(key =>
              key.toLowerCase().includes("price")
            );

            if (priceKeys.length > 0) {
              // Use the first price key found
              const priceKey = priceKeys[0];
              const priceObject = priceObj[priceKey];
              if (priceObject?.value && Array.isArray(priceObject.value) && priceObject.value.length >= 2) {
                return [
                  parseFloat(priceObject.value[0]) || 0,
                  parseFloat(priceObject.value[1]) || 0
                ];
              } else if (priceObject?.value && Array.isArray(priceObject.value) && priceObject.value.length === 1) {
                // Single value in array
                return [
                  parseFloat(priceObject.value[0]) || 0,
                  0
                ];
              }
            }

            // Fallback to perUnit and perTon if they exist directly
            if (priceObj?.perUnit !== undefined || priceObj?.perTon !== undefined) {
              return [
                priceObj?.perUnit || 0,
                priceObj?.perTon || 0
              ];
            }

            return [0, 0];
          };

          const [purchasePerUnitValue, purchasePerTonValue] = extractPriceArray(item.purchasePrice);
          purchasePerUnit = purchasePerUnitValue;
          purchasePerTon = purchasePerTonValue;

          // Extract sale price array if available
          const [salePerUnitValue, salePerTonValue] = extractPriceArray(item.salePrice);
          salePerUnit = salePerUnitValue || purchasePerUnit;
          salePerTon = salePerTonValue || purchasePerTon;

          return {
            ...item,
            name: item.name, // Preserve name if available
            supplierId: item.supplierId, // Preserve supplierId if available
            clients: item.clients || [], // Preserve clients array if available
            purchasePrice: {
              ...item.purchasePrice,
              perUnit: purchasePerUnit,
              perTon: purchasePerTon,
              // Extract currency from item level or price object, or default to USD
              currency: item.purchasePrice?.currency ||
                item.currency
            },
            salePrice: {
              ...(item.salePrice || {}),
              perTon: salePerTon,
              perUnit: salePerUnit,
              currency: item.salePrice?.currency ||
                item.currency
            },
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
    console.log("handleSplitInventoryPackages", purchaseOrderItemId);
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
    handleCodeUpdate,
  };
};

