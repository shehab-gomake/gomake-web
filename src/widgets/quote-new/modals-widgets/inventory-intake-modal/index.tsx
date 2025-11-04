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

  console.log("inventoryData", { inventoryData, rows, purchaseOrderId, purchaseOrderNumber, isAllIntaked });

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

  // Get units from first row if available, otherwise use defaults
  const convertedPricingUnit = rows.length > 0 ? rows[0]?.tableHeadingUnits?.pricingUnit : null;
  const convertedInventoryUnit = rows.length > 0 ? rows[0]?.tableHeadingUnits?.inventoryUnit : null;

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("sales.purchaseOrder.inventoryIntake")}
      maxWidth="lg"
      showFooter={false}
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
          <>
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
                  {rows && rows.length > 0 ? (
                    rows.map((row, index) => {
                      return (
                        <TableRow key={row.purchaseOrderItemId || index} sx={classes.bodyRow}>
                          <TableCell sx={classes.bodyCell}>
                            <TableCellData
                              value={row.code || '000'}
                              isEditable={false}
                              type={EDataTypeEnum.STRING}
                              id={row.purchaseOrderItemId}
                              parameterKey="code"
                              isAdmin={false}
                              onChangeRowCheckBox={() => { }}
                            />
                          </TableCell>
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
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ padding: "40px" }}>
                        {t("common.noData")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              sx={{ marginTop: "20px" }}
            >
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                {t("modal.cancel")}
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={rows.length === 0 || isAllIntaked}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                {t("common.save")}
              </Button>
            </Stack> */}
          </>
        )}
      </Box>
    </GoMakeDialog>
  );
};

export { InventoryIntakeModal };
