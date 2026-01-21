import { IconButton, MenuItem } from "@mui/material";
import { EditIcon, MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { useSetRecoilState } from "recoil";
import { isDuplicateCategoryModalState, isEditCategoryModalState, openAddCategoryModalState, selectedCategoryModalState } from "../../state";
import { DuplicateIcon } from "@/components/icons/icons";

const SideLeftMenuWidget = ({
  onClickOpenDeleteRowModal,
  category,
}) => {
  const { clasess } = useStyle();
  const { open, anchorEl, handleClose, handleClick } = useMoreCircle();
  const setOpenAddCategoryModal = useSetRecoilState(openAddCategoryModalState);
  const changeEditCategoryModalState = useSetRecoilState(isEditCategoryModalState);
  const changeDuplicateCategoryModalState = useSetRecoilState(isDuplicateCategoryModalState);
  const setSelectedCategoryModalState = useSetRecoilState(selectedCategoryModalState);
  const { t } = useTranslation();
  return (
    <>
      <IconButton onClick={(e) => {
        handleClick(e)
        e.stopPropagation();
      }} >
        <MoreCircleIcon color={clasess.boldIconColor} />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          style={clasess.menuItemContainer}
          onClick={(e) => {
            e.stopPropagation();
            setOpenAddCategoryModal(true);
            changeEditCategoryModalState(true)
            changeDuplicateCategoryModalState(false)
            setSelectedCategoryModalState(category)
            handleClose();
          }}
        >
          <EditIcon stroke={clasess.iconColor} />
          <div style={clasess.rowTextStyle}>
            {t("navigationButtons.edit")}
          </div>
        </MenuItem>
        <MenuItem
          style={clasess.menuItemContainer}
          onClick={(e) => {
            e.stopPropagation();
            setOpenAddCategoryModal(true);
            changeDuplicateCategoryModalState(true)
            changeEditCategoryModalState(false)
            setSelectedCategoryModalState(category)
            handleClose();
          }}
        >
          <DuplicateIcon color={clasess.iconColor} />
          <div style={clasess.rowTextStyle}>
            {t("navigationButtons.duplicate")}
          </div>
        </MenuItem>
        {
          category.isDeletable && <MenuItem
            style={clasess.menuItemContainer}
            onClick={(e) => {
              e.stopPropagation();
              onClickOpenDeleteRowModal(category);
              handleClose();
            }}
          >
            <DeleteIcon stroke={clasess.iconColor} />
            <div style={clasess.rowTextStyle}>
              {t("navigationButtons.delete")}
            </div>
          </MenuItem>
        }

      </GoMakeMenu>
    </>
  );
};
export { SideLeftMenuWidget };
