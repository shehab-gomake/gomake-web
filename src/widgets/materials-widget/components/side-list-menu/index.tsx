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
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          style={clasess.menuItemContainer}
          onClick={(e) => {
            e.stopPropagation();
            setOpenAddCategoryModal(true);
            changeEditCategoryModalState(true)
            setSelectedCategoryModalState(category)
            handleClose();
          }}
        >
          <EditIcon />
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
            setSelectedCategoryModalState(category)
            handleClose();
          }}
        >
          <DuplicateIcon />
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
            <DeleteIcon stroke="#2E3092" />
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
