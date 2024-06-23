import { IconButton, MenuItem } from "@mui/material";
import { EditIcon, MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { useSetRecoilState } from "recoil";
import { isEditCategoryModalState, openAddCategoryModalState, selectedCategoryModalState } from "../../state";

const SideLeftMenuWidget = ({
  onClickOpenDeleteRowModal,
  category,
}) => {
  const { clasess } = useStyle();
  const { open, anchorEl, handleClose, handleClick } = useMoreCircle();
  const setOpenAddCategoryModal = useSetRecoilState(openAddCategoryModalState);
  const changeEditCategoryModalState = useSetRecoilState(isEditCategoryModalState);
  const setSelectedCategoryModalState = useSetRecoilState(selectedCategoryModalState);
  const { t } = useTranslation();
  return (
    <>
      <IconButton onClick={(e) => {
        handleClick(e)
        e.stopPropagation();
      }} style={{ zIndex: 99999999 }}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          style={clasess.menuItemContainer}
          onClick={() => {
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
        {
          category.isDeletable && <MenuItem
            style={clasess.menuItemContainer}
            onClick={() => {
              onClickOpenDeleteRowModal(category);
              handleClose();
            }}
          >
            <DeleteIcon />
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
