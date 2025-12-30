import { Divider, IconButton, MenuItem, Box } from "@mui/material";
import { MoreCircleIcon, AddIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { ConvertIcon } from "@/pages-components/quotes/more-circle/icons/convert";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { DuplicateIcon } from "@/components/icons/duplicate-icon";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { filterState, materialCategorySuppliersState, materialHeadersState, openExtraParametersModalState, selectedMaterialIdForUpdateState, selectedSupplierIdState, openChildTableState } from "../../state";
import { EMaterialsActions } from "../../enums";
import { actionMenuState } from "@/store";
import { DfxIcon } from "@/components/icons/dfx-icon";
import { PdfIcon } from "@/components/icons/pdf-icon";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InventoryIcon from "@mui/icons-material/Inventory";
import StoreIcon from "@mui/icons-material/Store";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { deleteMaterialProductApi, addMaterialProductApi } from "@/services/api-service/materials/materials-endpoints";
import { FONT_FAMILY } from "@/utils/font-family";

const MaterialMenuWidget = ({
  dataRow,
  isAdmin,
  onClickOpenDeleteTableRowModal,
  onChangeRowCheckBox,
  onClickOpenDeleteTableRowWhenHaveMoreSupplierModal,
  toggleIsActive,
  onRefreshMaterialData
}) => {
  const { clasess } = useStyle();
  const { open, anchorEl, handleClose, handleClick } = useMoreCircle({
    onChangeRowCheckBox,
    dataRow,
  });
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccessAdded, alertFaultDelete, alertFault } = useSnackBar();

  const { query } = useRouter();
  const { materialType, materialCategory } = query;
  const supplierId = useRecoilValue(selectedSupplierIdState);
  const materialFilter = useRecoilValue(filterState);
  const setSelectedMaterialIdForUpdate = useSetRecoilState(selectedMaterialIdForUpdateState);
  const materialSuppliers = useRecoilValue(materialCategorySuppliersState);
  const materialHeaders = useRecoilValue(materialHeadersState);
  const setOpenExtraParametersModal = useSetRecoilState(openExtraParametersModalState);
  const [openChildTable, setOpenChildTable] = useRecoilState(openChildTableState);

  const hasExtraParameters = materialHeaders.some(header => header.isShowInExtraParameters);
  const hasProduct = dataRow?.hasProduct;

  // Get labels from materialHeaders
  const totalInventoryHeader = materialHeaders.find(header => header.key === 'totalInventory');
  const purchasePricingHeader = materialHeaders.find(header => header.key === 'purchasePricing');

  const totalInventoryLabel = totalInventoryHeader?.value;
  const totalInventoryUnit = totalInventoryHeader?.unit ? ` (${totalInventoryHeader.unit})` : '';
  const suppliersLabel = purchasePricingHeader?.value;

  // Get totalInventory value
  const totalInventoryValue = dataRow?.rowData?.totalInventory?.value || '0';

  // Check if inventory table is open for this row
  const isInventoryExpanded = openChildTable.rowId === dataRow.id && openChildTable.tableType === 'inventory';

  // Check if purchasePricing (suppliers) table is open for this row
  const isPurchasePricingExpanded = openChildTable.rowId === dataRow.id && openChildTable.tableType === 'purchasePricing';

  // Toggle inventory table (Total Inventory)
  const toggleInventory = () => {
    if (isInventoryExpanded) {
      setOpenChildTable({ rowId: '', tableType: null });
    } else {
      setOpenChildTable({ rowId: dataRow.id, tableType: 'inventory' });
    }
    handleClose();
  };

  // Toggle purchasePricing table (Suppliers)
  const togglePurchasePricing = () => {
    if (isPurchasePricingExpanded) {
      setOpenChildTable({ rowId: '', tableType: null });
    } else {
      setOpenChildTable({ rowId: dataRow.id, tableType: 'purchasePricing' });
    }
    handleClose();
  };


  const [action, setAction] = useRecoilState<{
    action: EMaterialsActions;
    key: string;
    isUnderLine: boolean;
    text: string;
    icon: string;
  } | null>(actionMenuState);
  const onClickActionModal = () => {
    setSelectedMaterialIdForUpdate(dataRow.id);
    setAction({
      "key": "Duplicate",
      "isUnderLine": false,
      "text": "Duplicate",
      "icon": "duplicate",
      "action": EMaterialsActions.Duplicate
    });
  };

  const handleAddProduct = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
        handleClose();
        // Refresh material data to update hasProduct flag
        if (onRefreshMaterialData) {
          onRefreshMaterialData();
        }
      } else {
        const errorMessage = res?.message || res?.data?.message || res?.errors?.message || t("modal.addedfailed");
        alertFault(errorMessage);
        console.error("Add Material Product Error:", res);
      }
    };
    try {
      await addMaterialProductApi(callApi, callBack, { id: dataRow.id });
    } catch (error) {
      console.error("Add Material Product Exception:", error);
      alertFault(t("modal.addedfailed"));
    }
  };

  const handleDeleteProduct = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
        handleClose();
        // Refresh material data to update hasProduct flag
        if (onRefreshMaterialData) {
          onRefreshMaterialData();
        }
      } else {
        const errorMessage = res?.message || res?.data?.message || res?.errors?.message;
        if (errorMessage) {
          alertFault(errorMessage);
        } else {
          alertFaultDelete();
        }
        console.error("Delete Material Product Error:", res);
      }
    };
    try {
      await deleteMaterialProductApi(callApi, callBack, { id: dataRow.id });
    } catch (error) {
      console.error("Delete Material Product Exception:", error);
      alertFaultDelete();
    }
  };
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        {/* Total Inventory Menu Item */}
        <MenuItem
          style={clasess.menuItemContainer}
          onClick={toggleInventory}
        >
          <div style={clasess.menuRowStyle}>
            <InventoryIcon sx={{ fontSize: 20, color: clasess.iconColor }} />
            <div style={clasess.rowTextStyle}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{totalInventoryLabel}{totalInventoryUnit}:</span>
                  <span style={{ fontWeight: 600 }}>{totalInventoryValue}</span>
                </Box>
                {isInventoryExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
              </Box>
            </div>
          </div>
        </MenuItem>
        <Divider />

        {/* Suppliers Toggle Menu Item */}
        <MenuItem
          style={clasess.menuItemContainer}
          onClick={togglePurchasePricing}
        >
          <div style={clasess.menuRowStyle}>
            <StoreIcon sx={{ fontSize: 20, color: clasess.iconColor }} />
            <div style={clasess.rowTextStyle}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between', width: '100%' }}>
                <span>{suppliersLabel}</span>
                {isPurchasePricingExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
              </Box>
            </div>
          </div>
        </MenuItem>
        <Divider />

        {
          !isAdmin ? <div>
            <MenuItem style={clasess.menuItemContainer}>
              <div style={clasess.menuRowStyle}>
                <ConvertIcon />
                <div
                  style={clasess.rowTextStyle}
                  onClick={() => {
                    toggleIsActive(dataRow?.id, "Active", dataRow?.isActive);
                  }}
                >
                  {dataRow?.isActive
                    ? t("remainWords.convertToInactive")
                    : t("remainWords.convertToActive")}
                </div>
              </div>
            </MenuItem>
            <Divider />
          </div> : <></>
        }
        {hasExtraParameters && (
          <>
            <MenuItem
              style={clasess.menuItemContainer}
              onClick={() => {
                setOpenExtraParametersModal({
                  open: true,
                  rowData: dataRow,
                  rowId: dataRow.id,
                });
                handleClose();
              }}
            >
              <VisibilityIcon sx={{ fontSize: 20, color: clasess.iconColor }} />
              <div style={clasess.rowTextStyle}>
                {t("materials.childTable.showDetails")}
              </div>
            </MenuItem>
            <Divider />
          </>
        )}
        <MenuItem
          style={clasess.menuItemContainer}
          onClick={() => {
            onClickActionModal();
            handleClose();

          }}
        >
          <DuplicateIcon height={20} width={20} color={clasess.iconColor} />
          <div style={clasess.rowTextStyle}>
            {t("navigationButtons.duplicate")}
          </div>
        </MenuItem>
        <Divider />
        <MenuItem
          style={clasess.menuItemContainer}
          onClick={() => {
            const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1
            if (isHaveMorethanMaterialSuppliers) {
              onClickOpenDeleteTableRowWhenHaveMoreSupplierModal(dataRow)
              handleClose();
            }
            else {
              onClickOpenDeleteTableRowModal(dataRow);
              handleClose();
            }

          }}
        >
          <DeleteIcon />
          <div style={clasess.rowTextStyle}>
            {t("navigationButtons.delete")}
          </div>
        </MenuItem>
        <Divider />
        <MenuItem
          style={clasess.menuItemContainer}
          onClick={() => {
            if (hasProduct) {
              handleDeleteProduct();
            } else {
              handleAddProduct();
            }
          }}
        >
          {hasProduct ? (
            <DeleteIcon />
          ) : (
            <AddIcon color={clasess.iconColor} />
          )}
          <div style={clasess.rowTextStyle}>
            {hasProduct
              ? t("products.profits.deleteProduct")
              : t("addProduct")}
          </div>
        </MenuItem>
        {
          dataRow?.dxfUrl && <Divider />
        }
        {
          dataRow?.dxfUrl && <MenuItem style={clasess.menuItemContainer} onClick={() => {
            window.open(dataRow?.dxfUrl, '_blank');
          }}>
            <DfxIcon height={16} width={16} />
            <div style={clasess.rowTextStyle}>
              {t("products.offsetPrice.admin.viewDfx")}
            </div>
          </MenuItem>
        }
        {
          dataRow?.pdfUrl && <Divider />
        }
        {
          dataRow?.pdfUrl &&
          <MenuItem style={clasess.menuItemContainer} onClick={() => {
            window.open(dataRow?.pdfUrl, '_blank');
          }}>
            <PdfIcon height={16} width={16} color={clasess.iconColor} />
            <div style={clasess.rowTextStyle}>
              {t("products.offsetPrice.admin.viewPdf")}
            </div>
          </MenuItem>
        }
      </GoMakeMenu>
    </>
  );
};
export { MaterialMenuWidget };
