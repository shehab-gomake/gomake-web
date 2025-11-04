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
import { useRecoilValue } from "recoil";
import { currenciesState } from "@/widgets/materials-widget/state";
import { GomakePrimaryButton } from "@/components";

interface InventoryIntakeModalProps {
  open: boolean;
  onClose: () => void;
  inventoryData: any[];
  loading: boolean;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
}

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



const InventoryIntakeModal: React.FC<InventoryIntakeModalProps> = ({
  open,
  onClose,
  inventoryData,
  loading,
  purchaseOrderId,
  purchaseOrderNumber,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const currencies = useRecoilValue<{ label: string; value: string }[]>(currenciesState);

  // Use mock data if no real data is provided
  const [rows, setRows] = useState<InventoryRowData[]>([]);
  const [isAllIntaked, setIsAllIntaked] = useState(false);

  useEffect(() => {
    if (open) {
      if (inventoryData && inventoryData.length > 0) {
        // Transform API data - ensure salePrice is initialized from purchasePrice if not provided
        const transformedData = inventoryData.map((item: any) => ({
          ...item,
          salePrice: item.salePrice || {
            perTon: item.purchasePrice?.perTon || 0,
            perUnit: item.purchasePrice?.perUnit || 0,
            currency: item.purchasePrice?.currency || "USD",
          },
        }));
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

  const handleIntake = () => {
    console.log("handleIntake");
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
    >
      <Box sx={{ padding: "20px" }}>
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
                              <TableCellData
                                value={[row.purchasePrice?.perUnit?.toString() || '0']}
                                isEditable={false}
                                type={EDataTypeEnum.ARRAY_INPUT}
                                id={row.purchaseOrderItemId}
                                parameterKey="purchasePrice"
                                isAdmin={false}
                                onChangeRowCheckBox={() => { }}
                              />
                            </TableCell>
                            <TableCell sx={classes.bodyCell}>
                              <TableCellData
                                value={row.purchasePrice?.currency?.toLowerCase() || ''}
                                isEditable={false}
                                type={EDataTypeEnum.CURRENCY}
                                id={row.purchaseOrderItemId}
                                parameterKey="purchaseCurrency"
                                isAdmin={false}
                                onChangeRowCheckBox={() => { }}
                              />
                            </TableCell>
                            <TableCell sx={classes.bodyCell}>
                              <TableCellData
                                value={[row.salePrice?.perUnit?.toString() || '0']}
                                isEditable={true}
                                type={EDataTypeEnum.ARRAY_INPUT}
                                id={row.purchaseOrderItemId}
                                parameterKey="salePrice"
                                isAdmin={false}
                                onChangeRowCheckBox={() => { }}
                              />
                            </TableCell>
                            <TableCell sx={classes.bodyCell}>
                              <TableCellData
                                value={row.salePrice?.currency?.toLowerCase() || ''}
                                isEditable={true}
                                type={EDataTypeEnum.CURRENCY}
                                id={row.purchaseOrderItemId}
                                parameterKey="saleCurrency"
                                isAdmin={false}
                                onChangeRowCheckBox={() => { }}
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
