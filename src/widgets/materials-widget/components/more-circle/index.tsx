import { Divider, IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { ConvertIcon } from "@/pages-components/quotes/more-circle/icons/convert";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { DuplicateIcon } from "@/components/icons/duplicate-icon";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { filterState, materialCategorySuppliersState, materialHeadersState, openExtraParametersModalState, selectedMaterialIdForUpdateState, selectedSupplierIdState } from "../../state";
import { EMaterialsActions } from "../../enums";
import { actionMenuState } from "@/store";
import { DfxIcon } from "@/components/icons/dfx-icon";
import { PdfIcon } from "@/components/icons/pdf-icon";
import VisibilityIcon from "@mui/icons-material/Visibility";

const MaterialMenuWidget = ({
  dataRow,
  isAdmin,
  onClickOpenDeleteTableRowModal,
  onChangeRowCheckBox,
  onClickOpenDeleteTableRowWhenHaveMoreSupplierModal,
  toggleIsActive
}) => {
  const { clasess } = useStyle();
  const { open, anchorEl, handleClose, handleClick } = useMoreCircle({
    onChangeRowCheckBox,
    dataRow,
  });
  const { t } = useTranslation();

  const { query } = useRouter();
  const { materialType, materialCategory } = query;
  const supplierId = useRecoilValue(selectedSupplierIdState);
  const materialFilter = useRecoilValue(filterState);
  const setSelectedMaterialIdForUpdate = useSetRecoilState(selectedMaterialIdForUpdateState);
  const materialSuppliers = useRecoilValue(materialCategorySuppliersState);
  const materialHeaders = useRecoilValue(materialHeadersState);
  const setOpenExtraParametersModal = useSetRecoilState(openExtraParametersModalState);

  const hasExtraParameters = materialHeaders.some(header => header.isShowInExtraParameters);


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
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
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
