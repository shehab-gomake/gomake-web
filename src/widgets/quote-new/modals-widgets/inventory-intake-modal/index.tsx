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
import { PurchaseOrderStatuses } from "@/enums/document-type-enum";

interface InventoryIntakeModalProps {
  open: boolean;
  onClose: () => void;
  inventoryData: any[];
  loading: boolean;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  supplierId?: string;
  documentType?: number; // Document type (e.g., DOCUMENT_TYPE.purchaseOrder = 9)
  status?: number; // Document status (e.g., PurchaseOrderStatuses.UnderCreation = 0)
  onIntakeSuccess?: () => void; // Callback to refresh document after successful intake
}

interface InventoryRowData {
  code: string;
  name?: string;
  productName?: string;
  productCode?: string;
  details?: string;
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

// Component to display product details inline with hover tooltip
const ProductDetailsInline: React.FC<{ details: string }> = ({ details }) => {
  const { primaryColor } = useGomakeTheme();

  // Clean details - replace \n with spaces for inline display
  const formatDetails = (text: string) => {
    if (!text) return "";
    // Replace \n with spaces for inline display
    return text.split("\\n").join(" ").trim();
  };

  const formattedDetails = formatDetails(details);
  const maxLength = 80; // Character limit for display
  const shouldTruncate = formattedDetails.length > maxLength;
  const displayText = shouldTruncate
    ? formattedDetails.slice(0, maxLength) + "..."
    : formattedDetails;

  return (
    <Box
      component="span"
      title={formattedDetails} // Show full text on hover
      sx={{
        display: "inline-flex",
        alignItems: "center",
        cursor: shouldTruncate ? "help" : "default",
      }}
    >
      <Typography
        component="span"
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          color: primaryColor(500),
          lineHeight: 1.4,
        }}
      >
        {displayText}
      </Typography>
    </Box>
  );
};

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
  status,
  onIntakeSuccess,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { primaryColor } = useGomakeTheme();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPurchaseOrderInventoryDialog, setShowPurchaseOrderInventoryDialog] = useState(false);

  // Use custom hook for all inventory intake modal logic
  const {
    rows,
    isAllIntaked,
    isIntaking,
    updateCellData,
    handleIntake,
    performIntake,
    handleSplitInventoryPackages,
    handleMergeInventoryPackages,
    handleCodeUpdate,
  } = useInventoryIntakeModal({
    open,
    inventoryData,
    purchaseOrderId,
    documentType,
    onClose,
    onIntakeSuccess,
  });

  // Intercept handleIntake to show confirmation modal if status is not Received
  const handleIntakeWithConfirmation = () => {
    handleIntake(() => {
      setShowPurchaseOrderInventoryDialog(true);
    });

  };

  // Handle confirmation modal OK action (for status change)
  const handleConfirmIntake = () => {
    setShowConfirmationModal(false);
    performIntake();
  };

  // Handle confirmation modal cancel action (for status change)
  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false);
  };

  // Handle purchase order inventory dialog Yes action
  const handleConfirmPurchaseOrderInventory = () => {
    setShowPurchaseOrderInventoryDialog(false);
    performIntake();
    // if (status !== PurchaseOrderStatuses.Received) {
    //   setShowConfirmationModal(true);
    // }
    // else {
    //   performIntake();
    // }
  };

  // Handle purchase order inventory dialog No action
  const handleCancelPurchaseOrderInventory = () => {
    setShowPurchaseOrderInventoryDialog(false);
  };

  return (
    <>
      <GoMakeDialog
        open={open}
        onClose={onClose}
        title={t("sales.purchaseOrder.inventoryIntake")}
        maxWidth="lg"
        showFooter={true}
        primaryButtonLabel={t("sales.purchaseOrder.intake")}
        onPrimaryAction={handleIntakeWithConfirmation}
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
              {rows && rows.length > 0 ? (() => {
                // Group rows by splitGroupId (if split) or purchaseOrderItemId (if not split)
                const groupedRows = rows.reduce((acc, row) => {
                  const groupKey = row.splitGroupId || row.purchaseOrderItemId;
                  if (!acc[groupKey]) {
                    acc[groupKey] = [];
                  }
                  acc[groupKey].push(row);
                  return acc;
                }, {} as Record<string, typeof rows>);

                return Object.entries(groupedRows).map(([groupKey, groupRows]) => {
                  // Use the first row for header information
                  const firstRow = groupRows[0];
                  const convertedPricingUnit = firstRow?.tableHeadingUnits?.pricingUnit;
                  const convertedInventoryUnit = firstRow?.tableHeadingUnits?.inventoryUnit;
                  const isSplit = firstRow?.isSplit || false;

                  return (
                    <Box key={groupKey}>
                      {/* Name and Code Header */}
                      {(firstRow.productName || firstRow.productCode) && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "6px",
                            borderRadius: "4px",
                            gap: "12px",
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: "16px",
                                fontWeight: 600,
                                color: primaryColor(500),
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              {firstRow.productCode && <span>{firstRow.productCode}</span>}
                              {firstRow.productName && firstRow.productCode && <span>-</span>}
                              {firstRow.productName && <span>{firstRow.productName}</span>}
                              {firstRow.details && (
                                <>
                                  <span>-</span>
                                  <ProductDetailsInline details={firstRow.details} />
                                </>
                              )}
                            </Typography>
                          </Box>
                          {/* Split/Merge Inventory Packages Button */}
                          {isSplit ? (
                            <GomakePrimaryButton
                              onClick={() => handleMergeInventoryPackages(firstRow.splitGroupId || firstRow.purchaseOrderItemId)}
                              style={{ width: "fit-content", height: "40px" }}
                            >
                              {t("sales.purchaseOrder.mergeInventoryPackages")}
                            </GomakePrimaryButton>
                          ) : (
                            <GomakePrimaryButton
                              onClick={() => handleSplitInventoryPackages(firstRow.purchaseOrderItemId)}
                              style={!firstRow.packagesQuantity || firstRow.packagesQuantity <= 1 ?
                                { width: "fit-content", height: "40px", backgroundColor: "#ccc" } :
                                { width: "fit-content", height: "40px" }}
                              disabled={!firstRow.packagesQuantity || firstRow.packagesQuantity <= 1}
                            >
                              {t("sales.purchaseOrder.splitInventoryPackages")}
                            </GomakePrimaryButton>
                          )}
                        </Box>
                      )}

                      {/* Item Table - Show all rows in the same table */}
                      <TableContainer component={Paper} sx={classes.tableContainer}>
                        <Table sx={classes.table} stickyHeader>
                          <TableHead>
                            <TableRow sx={classes.headerRow}>
                              <TableCell sx={{ ...classes.headerCell, ...classes.codeCell }}>
                                {t("materials.childTable.code")}
                              </TableCell>
                              <TableCell sx={{ ...classes.headerCell, ...classes.purchasePriceCell }}>
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
                              <TableCell sx={{ ...classes.headerCell, ...classes.purchaseCurrencyCell }}>
                                {t("materials.childTable.purchaseCurrency")}
                              </TableCell>
                              <TableCell sx={{ ...classes.headerCell, ...classes.salePriceCell }}>
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
                              <TableCell sx={{ ...classes.headerCell, ...classes.saleCurrencyCell }}>
                                {t("materials.childTable.saleCurrency")}
                              </TableCell>
                              <TableCell sx={{ ...classes.headerCell, ...classes.quantityCell }}>
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
                            {groupRows.map((row) => (
                              <TableRow key={row.purchaseOrderItemId} sx={classes.bodyRow}>
                                <TableCell sx={{ ...classes.bodyCell, ...classes.codeCell }}>
                                  <CodeInputCell
                                    row={row}
                                    onCodeUpdate={(newValue) => {
                                      handleCodeUpdate(row.purchaseOrderItemId, newValue);
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ ...classes.bodyCell, ...classes.purchasePriceCell }}>
                                  <InventoryPriceInput
                                    value={
                                      row.purchasePrice?.priceArray && row.purchasePrice.priceArray.length > 0
                                        ? row.purchasePrice.priceArray
                                        : row.purchasePrice?.perUnit !== undefined
                                          ? [row.purchasePrice.perUnit || 0]
                                          : []
                                    }
                                    isEditable={true}
                                    onUpdate={async (newValue, index) => {
                                      if (index !== undefined && index !== null) {
                                        const currentPrice = row.purchasePrice;
                                        const priceArray = currentPrice?.priceArray || [currentPrice?.perUnit || 0];
                                        const updatedArray = [...priceArray];
                                        updatedArray[index] = newValue;
                                        await updateCellData(row.purchaseOrderItemId, "purchasePrice", updatedArray[index], undefined, index);
                                      } else {
                                        await updateCellData(row.purchaseOrderItemId, "purchasePrice", newValue);
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ ...classes.bodyCell, ...classes.purchaseCurrencyCell }}>
                                  <InventoryCurrencyInput
                                    value={row.purchasePrice?.currency?.toLowerCase() || ''}
                                    isEditable={true}
                                    currencyLabel={t("materials.childTable.purchaseCurrency")}
                                    onUpdate={async (newValue, exchangeRate) => {
                                      await updateCellData(row.purchaseOrderItemId, "purchaseCurrency", newValue, exchangeRate);
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ ...classes.bodyCell, ...classes.salePriceCell }}>
                                  <InventoryPriceInput
                                    value={
                                      row.salePrice?.priceArray && row.salePrice.priceArray.length > 0
                                        ? row.salePrice.priceArray
                                        : row.salePrice?.perUnit !== undefined
                                          ? [row.salePrice.perUnit || 0]
                                          : []
                                    }
                                    isEditable={true}
                                    onUpdate={async (newValue, index) => {
                                      if (index !== undefined && index !== null) {
                                        const currentPrice = row.salePrice;
                                        const priceArray = currentPrice?.priceArray || [currentPrice?.perUnit || 0];
                                        const updatedArray = [...priceArray];
                                        updatedArray[index] = newValue;
                                        await updateCellData(row.purchaseOrderItemId, "salePrice", updatedArray[index], undefined, index);
                                      } else {
                                        await updateCellData(row.purchaseOrderItemId, "salePrice", newValue);
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ ...classes.bodyCell, ...classes.saleCurrencyCell }}>
                                  <InventoryCurrencyInput
                                    value={row.salePrice?.currency?.toLowerCase() || ''}
                                    isEditable={true}
                                    currencyLabel={t("materials.childTable.saleCurrency")}
                                    onUpdate={async (newValue, exchangeRate) => {
                                      await updateCellData(row.purchaseOrderItemId, "saleCurrency", newValue, exchangeRate);
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ ...classes.bodyCell, ...classes.quantityCell }}>
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
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  );
                });
              })() : (
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
      {/* Confirmation Modal for UnderCreation status */}
      <GoMakeDialog
        open={showConfirmationModal}
        onClose={handleCancelConfirmation}
        title={t("sales.purchaseOrder.inventoryIntake")}
        maxWidth="sm"
        showFooter={true}
        primaryButtonLabel={t("common.ok")}
        cancelButtonLabel={t("common.cancel")}
        onPrimaryAction={handleConfirmIntake}
        hideCancelButton={false}
      >
        <Box sx={{ padding: "20px" }}>
          <Typography variant="body1">
            {t("sales.purchaseOrder.statusChangeConfirmation") || "This Purchase order convert status to the Received"}
          </Typography>
        </Box>
      </GoMakeDialog>
      {/* Purchase Order Inventory Confirmation Dialog */}
      <GoMakeDialog
        open={showPurchaseOrderInventoryDialog}
        onClose={handleCancelPurchaseOrderInventory}
        title={t("sales.purchaseOrder.purchaseOrderInventory") || "Purchase Order Inventory"}
        maxWidth="sm"
        showFooter={true}
        primaryButtonLabel={t("common.yes")}
        cancelButtonLabel={t("common.no")}
        onPrimaryAction={handleConfirmPurchaseOrderInventory}
        hideCancelButton={false}
      >
        <Box sx={{ paddingTop: "10px" }}>
          <Typography variant="body1">
            {t("sales.purchaseOrder.purchaseOrderInventoryMessage") || "You have purchase order inventory. Do you need to complete it?"}
          </Typography>
        </Box>
      </GoMakeDialog>
    </>
  );
};

export { InventoryIntakeModal };
