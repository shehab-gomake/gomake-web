import React from "react";
import { GoMakeMenu } from "@/components";
import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SortByTypes } from "@/enums";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { ArrowRightIcon } from "@/icons";

const SectionNameListMenu = ({ handleClose, open, anchorEl, sectionNames, handleOpen, setSectionNames }) => {

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
          sectionNames?.map((sectionName, index) => (
            <div key={index} style={classes.menuTabStyle} className="action-menu-item"
              onClick={(e) => {
                handleOpen(e)
                setSectionNames(sectionName)
              }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                {sectionName?.sectionName}
                <ArrowRightIcon />
              </div>
            </div>
          ))
        }
      </div>
    </GoMakeMenu>
  );
};

export { SectionNameListMenu };
