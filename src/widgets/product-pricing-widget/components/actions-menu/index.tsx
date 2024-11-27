import React from "react";
import { GoMakeMenu } from "@/components";
import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SortByTypes } from "@/enums";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";

const ActionsListMenu = ({ handleClose, open, anchorEl, actionListDropDown, setActionNameSelected, onClickAddNewAction, handleCloseSectionNameListMenu }) => {

  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const selectedSort = quoteStateValue?.sortType
  const { classes } = useStyle();
  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={classes.mainContainer}
    >
      <div style={classes.bodyContainer}>
        {
          actionListDropDown?.map((action, index) => (
            <div key={index} style={{ backgroundColor: selectedSort === SortByTypes.Date ? "#EBECFF" : "", ...classes.menuTabStyle }} className="table-sorting" onClick={() => {
              setActionNameSelected(action)
              onClickAddNewAction()
              handleClose()
              handleCloseSectionNameListMenu()
            }}>
              {action?.name}
            </div>
          ))
        }
      </div>
    </GoMakeMenu>
  );
};

export { ActionsListMenu };
