import React, { useState } from "react";
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
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { TableCellData } from "@/widgets/materials-widget/components/table-cell-data/table-cell";
import { EDataTypeEnum } from "@/widgets/materials-widget/components/table-cell-data/data-type-enum";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { GomakePrimaryButton } from "@/components";
import { PrimaryButton } from "@/components/button/primary-button";
import { InventoryPriceInput } from "./inventory-price-input";
import { InventoryCurrencyInput } from "./inventory-currency-input";
import { useStyle as useMaterialsStyle } from "@/widgets/materials-widget/style";
import { useInventoryIntakeModal } from "./use-inventory-intake-modal";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

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
  name?: string;
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
  documentType = DOCUMENT_TYPE.purchaseOrder, // Default to purchase order type
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { primaryColor } = useGomakeTheme();

  // Use custom hook for all inventory intake modal logic
  const {
    rows,
    isAllIntaked,
    isIntaking,
    updateCellData,
    handleIntake,
    handleSplitInventoryPackages,
    handleCodeUpdate,
  } = useInventoryIntakeModal({
    open,
    inventoryData,
    purchaseOrderId,
    documentType,
    onClose,
  });

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
          <Stack spacing={1.5} sx={{ marginTop: "12px" }}>
            {rows && rows.length > 0 ? (
              rows.map((row, index) => {
                const convertedPricingUnit = row?.tableHeadingUnits?.pricingUnit;
                const convertedInventoryUnit = row?.tableHeadingUnits?.inventoryUnit;

                return (
                  <Box key={row.purchaseOrderItemId || index} >
                    {/* Name and Code Header */}
                    {(row.name || row.code) && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "6px",
                          borderRadius: "4px",

                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: primaryColor(500),
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {row.name && <span>{row.name}</span>}
                          {row.name && row.code && <span>-</span>}
                          {row.code && <span>{row.code}</span>}
                        </Typography>
                        {/* Split Inventory Packages Button */}
                        <GomakePrimaryButton
                          onClick={() => handleSplitInventoryPackages(row.purchaseOrderItemId)}
                          style={{ width: "fit-content", height: "40px" }}
                        >
                          {t("sales.purchaseOrder.splitInventoryPackages")}
                        </GomakePrimaryButton>
                      </Box>
                    )}

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
                                    {convertedPricingUnit.value}
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
                                    {convertedPricingUnit.value}
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
                                  handleCodeUpdate(row.purchaseOrderItemId, newValue);
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
