import { Divider, IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { ConvertIcon } from "@/pages-components/quotes/more-circle/icons/convert";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { useTableCellData } from "../table-cell-data/use-table-cell-data";
import { DuplicateIcon } from "@/components/icons/duplicate-icon";
import { useMaterialsCategories } from "../../use-materials-categories";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { filterState, selectedMaterialIdForUpdateState, selectedSupplierIdState } from "../../state";
import { EMaterialsActions } from "../../enums";
import { actionMenuState } from "@/store";

const MaterialMenuWidget = ({
  dataRow,
  isAdmin,
  onClickOpenDeleteTableRowModal,
  onChangeRowCheckBox,
}) => {
  const { clasess } = useStyle();
  const { open, anchorEl, handleClose, handleClick } = useMoreCircle({
    onChangeRowCheckBox,
    dataRow,
  });
  const { t } = useTranslation();
  const { updateCellData } = useTableCellData(isAdmin);
  const { getMaterialCategoryData } = useMaterialsCategories(isAdmin);
  const { query } = useRouter();
  const { materialType, materialCategory } = query;
  const supplierId = useRecoilValue(selectedSupplierIdState);
  const materialFilter = useRecoilValue(filterState);
  const setSelectedMaterialIdForUpdate = useSetRecoilState(selectedMaterialIdForUpdateState);

  const toggleIsActive = async (id, parameterKey, value) => {
    await updateCellData(id, parameterKey, !value);
    getMaterialCategoryData(
      materialType?.toString(),
      materialCategory?.toString(),
      materialFilter,
      supplierId
    ).then();
  };
  const [action, setAction] = useRecoilState<{
    action: EMaterialsActions;
    key: string;
  } | null>(actionMenuState);
  const onClickActionModal = () => {
    setSelectedMaterialIdForUpdate(dataRow.id);
    setAction({
      key: "Duplicate",
      action: 10,
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
            onClickOpenDeleteTableRowModal(dataRow);
            handleClose();
          }}
        >
          <DeleteIcon />
          <div style={clasess.rowTextStyle}>
            {t("navigationButtons.delete")}
          </div>
        </MenuItem>
      </GoMakeMenu>
    </>
  );
};
export { MaterialMenuWidget };
