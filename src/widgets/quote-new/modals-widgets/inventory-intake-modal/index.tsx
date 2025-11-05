import React, { useState, useEffect } from "react";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { TableCellData } from "@/widgets/materials-widget/components/table-cell-data/table-cell";
import { EDataTypeEnum } from "@/widgets/materials-widget/components/table-cell-data/data-type-enum";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { useRecoilValue } from "recoil";
import { currenciesState } from "@/widgets/materials-widget/state";
import { GomakePrimaryButton } from "@/components";
import { PrimaryButton } from "@/components/button/primary-button";
import { useInventoryIntake } from "./use-inventory-intake";
import { InventoryPriceInput } from "./inventory-price-input";
import { InventoryCurrencyInput } from "./inventory-currency-input";
import { useStyle as useMaterialsStyle } from "@/widgets/materials-widget/style";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { addSupplierInventoryForPurchaseOrderApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

interface InventoryIntakeModalProps {
  open: boolean;
  onClose: () => void;
  inventoryData: any[];
  loading: boolean;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  supplierId?: string;
  documentType?: number; // Document type (e.g., DOCUMENT_TYPE.purchaseOrder = 9)
}

interface InventoryRowData {
  code: string;
  purchaseOrderItemId: string;
  printHouseMaterialId: string;
  supplierId?: string;
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
  clients?: string[];
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

// Component for code input that updates local state only
const CodeInputCell: React.FC<{
  row: InventoryRowData;
  onCodeUpdate: (newValue: string) => void;
}> = ({ row, onCodeUpdate }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<string>(row.code);
  const { classes: materialsClasses } = useMaterialsStyle();

  // Update currentValue when row.code changes
  React.useEffect(() => {
    setCurrentValue(row.code);
  }, [row.code]);

  const handleInputChange = (newValue: string) => {
    setCurrentValue(newValue);
  };

  const handleUpdate = () => {
    onCodeUpdate(currentValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(row.code);
    setIsEditing(false);
  };

  const handleClickOutside = () => {
    if (isEditing) {
      handleUpdate();
    }
  };

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <UpdateValueInput
        value={currentValue}
        onInputChange={handleInputChange}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
        clickedOut={handleClickOutside}
        width="100%"
      />
    );
  }

  return (
    <PrimaryButton
      style={{ minWidth: "max-content", width: "100%", justifyContent: "center" }}
      sx={materialsClasses.clickableData}
      onClick={handleClick}
      variant="text"
    >
      {row.code}
    </PrimaryButton>
  );
};



const InventoryIntakeModal: React.FC<InventoryIntakeModalProps> = ({
  open,
  onClose,
  inventoryData,
  loading,
  purchaseOrderId,
  purchaseOrderNumber,
  supplierId,
  documentType = DOCUMENT_TYPE.purchaseOrder, // Default to purchase order type
}) => {

  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate, alertRequiredFields } = useSnackBar();

  // Use mock data if no real data is provided
  const [rows, setRows] = useState<InventoryRowData[]>([]);
  const [isAllIntaked, setIsAllIntaked] = useState(false);
  const [isIntaking, setIsIntaking] = useState(false);

  // Use custom hook for inventory intake operations
  const { updateCellData } = useInventoryIntake(rows, setRows);

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
            supplierId: item.supplierId, // Preserve supplierId if available
            clients: item.clients || [], // Preserve clients array if available
            purchasePrice: {
              ...item.purchasePrice,
              perUnit: purchasePerUnit,
              perTon: purchasePerTon,
              // Extract currency from item level or price object, or default to USD
              currency: item.purchasePrice?.currency ||
                item.currency ||
                item.purchasePrice?.["price unit / M^2"]?.currency ||
                item.purchasePrice?.["price Unit / ton"]?.currency ||
                "USD",
            },
            salePrice: {
              ...(item.salePrice || {}),
              perTon: salePerTon,
              perUnit: salePerUnit,
              // Extract currency from item level or sale price object, or use purchase currency
              currency: item.salePrice?.currency ||
                item.currency ||
                item.salePrice?.["price unit / M^2"]?.currency ||
                item.salePrice?.["price Unit / ton"]?.currency ||
                item.purchasePrice?.currency ||
                "USD",
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

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("sales.purchaseOrder.inventoryIntake")}
      maxWidth="lg"
      showFooter={true}
      primaryButtonLabel={t("sales.purchaseOrder.intake")}
      onPrimaryAction={handleIntake}
      primaryButtonDisabled={isIntaking || rows.length === 0}
      primaryButtonLoading={isIntaking}
    >
      <Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <CircularProgress />
          </Box>
        ) : isAllIntaked ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: "16px" }}>
              {t("sales.purchaseOrder.allItemsIntaked")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("sales.purchaseOrder.allItemsIntakedDescription")}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {rows && rows.length > 0 ? (
              rows.map((row, index) => {
                const convertedPricingUnit = row?.tableHeadingUnits?.pricingUnit;
                const convertedInventoryUnit = row?.tableHeadingUnits?.inventoryUnit;

                return (
                  <Box key={row.purchaseOrderItemId || index}>
                    {/* Split Inventory Packages Button */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: "12px",
                        marginTop: "6px",
                        width: "100%",
                      }}
                    >
                      <GomakePrimaryButton
                        onClick={() => handleSplitInventoryPackages(row.purchaseOrderItemId)}
                        style={{ width: "fit-content", height: "40px" }}
                      >
                        {t("sales.purchaseOrder.splitInventoryPackages")}
                      </GomakePrimaryButton>
                    </Box>

                    {/* Item Table */}
                    <TableContainer component={Paper} sx={classes.tableContainer}>
                      <Table sx={classes.table} stickyHeader>
                        <TableHead>
                          <TableRow sx={classes.headerRow}>
                            <TableCell sx={classes.headerCell}>
                              {t("materials.childTable.code")}
                            </TableCell>
                            <TableCell sx={classes.headerCell}>
                              {t("materials.childTable.purchasePrice")}
                              {convertedPricingUnit && (
                                <>
                                  <br />
                                  <span style={classes.headerCellPriceUnitText}>
                                    ({convertedPricingUnit.value})
                                  </span>
                                </>
                              )}
                            </TableCell>
                            <TableCell sx={classes.headerCell}>
                              {t("materials.childTable.purchaseCurrency")}
                            </TableCell>
                            <TableCell sx={classes.headerCell}>
                              {t("materials.childTable.saleCost")}
                              {convertedPricingUnit && (
                                <>
                                  <br />
                                  <span style={classes.headerCellPriceUnitText}>
                                    ({convertedPricingUnit.value})
                                  </span>
                                </>
                              )}
                            </TableCell>
                            <TableCell sx={classes.headerCell}>
                              {t("materials.childTable.saleCurrency")}
                            </TableCell>
                            <TableCell sx={classes.headerCell}>
                              {t("materials.childTable.quantity")}
                              {convertedInventoryUnit && (
                                <span style={classes.headerCellUnitText}>
                                  {" "}({convertedInventoryUnit.value})
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow sx={classes.bodyRow}>
                            <TableCell sx={classes.bodyCell}>
                              <CodeInputCell
                                row={row}
                                onCodeUpdate={(newValue) => {
                                  // Update local state only, no API call
                                  setRows((prevRows) => {
                                    return prevRows.map((r) => {
                                      if (r.purchaseOrderItemId === row.purchaseOrderItemId) {
                                        return {
                                          ...r,
                                          code: newValue,
                                        };
                                      }
                                      return r;
                                    });
                                  });
                                }}
                              />
                            </TableCell>
                            <TableCell sx={classes.bodyCell}>
                              <InventoryPriceInput
                                value={
                                  // Always display as array if both values exist, or if perUnit exists (perTon might be 0)
                                  row.purchasePrice?.perUnit !== undefined
                                    ? [
                                      row.purchasePrice.perUnit || 0,
                                      row.purchasePrice?.perTon !== undefined ? row.purchasePrice.perTon : 0
                                    ]
                                    : [0, 0]
                                }
                                isEditable={true}
                                onUpdate={async (newValue, index) => {
                                  // If index is provided, update individual price value
                                  if (index !== undefined && index !== null) {
                                    const currentPrice = row.purchasePrice;
                                    const priceArray = [
                                      index === 0 ? newValue : (currentPrice?.perUnit || 0),
                                      index === 1 ? newValue : (currentPrice?.perTon || 0),
                                    ];
                                    await updateCellData(row.purchaseOrderItemId, "purchasePrice", priceArray[index], undefined, index);
                                  } else {
                                    await updateCellData(row.purchaseOrderItemId, "purchasePrice", newValue);
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell sx={classes.bodyCell}>
                              <InventoryCurrencyInput
                                value={row.purchasePrice?.currency?.toLowerCase() || ''}
                                isEditable={true}
                                currencyLabel={t("materials.childTable.purchaseCurrency")}
                                onUpdate={async (newValue, exchangeRate) => {
                                  await updateCellData(row.purchaseOrderItemId, "purchaseCurrency", newValue, exchangeRate);
                                }}
                              />
                            </TableCell>
                            <TableCell sx={classes.bodyCell}>
                              <InventoryPriceInput
                                value={
                                  // Always display as array if both values exist, or if perUnit exists (perTon might be 0)
                                  row.salePrice?.perUnit !== undefined
                                    ? [
                                      row.salePrice.perUnit || 0,
                                      row.salePrice?.perTon !== undefined ? row.salePrice.perTon : 0
                                    ]
                                    : [0, 0]
                                }
                                isEditable={true}
                                onUpdate={async (newValue, index) => {
                                  // If index is provided, update individual price value
                                  if (index !== undefined && index !== null) {
                                    const currentPrice = row.salePrice;
                                    const priceArray = [
                                      index === 0 ? newValue : (currentPrice?.perUnit || 0),
                                      index === 1 ? newValue : (currentPrice?.perTon || 0),
                                    ];
                                    await updateCellData(row.purchaseOrderItemId, "salePrice", priceArray[index], undefined, index);
                                  } else {
                                    await updateCellData(row.purchaseOrderItemId, "salePrice", newValue);
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell sx={classes.bodyCell}>
                              <InventoryCurrencyInput
                                value={row.salePrice?.currency?.toLowerCase() || ''}
                                isEditable={true}
                                currencyLabel={t("materials.childTable.saleCurrency")}
                                onUpdate={async (newValue, exchangeRate) => {
                                  await updateCellData(row.purchaseOrderItemId, "saleCurrency", newValue, exchangeRate);
                                }}
                              />
                            </TableCell>
                            <TableCell sx={classes.bodyCell}>
                              <TableCellData
                                value={row.quantity?.toString() || ''}
                                isEditable={false}
                                type={EDataTypeEnum.NUMBER}
                                id={row.purchaseOrderItemId}
                                parameterKey="quantity"
                                isAdmin={false}
                                onChangeRowCheckBox={() => { }}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                );
              })
            ) : (
              <Box sx={{ padding: "40px", textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  {t("common.noData")}
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </GoMakeDialog>
  );
};

export { InventoryIntakeModal };
