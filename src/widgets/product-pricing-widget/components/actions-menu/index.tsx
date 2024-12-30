import React, { useState } from "react";
import { GoMakeMenu, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const ActionsListMenu = ({
  handleClose,
  open,
  anchorEl,
  actionListDropDown,
  setActionNameSelected,
  onClickAddNewAction,
  handleCloseSectionNameListMenu,
  isUnderlined,
  isFromSetting = false,
  addActionToProduct
}: any) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredActions = actionListDropDown?.filter(action =>
    action.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { classes } = useStyle({ isUnderlined, isFromSetting });
  return (
    <GoMakeMenu
      handleClose={() => {
        handleClose()
        setSearchQuery("")
      }}
      open={open}
      anchorEl={anchorEl}
      style={classes.mainContainer}
    >
      <GomakeTextInput
        style={classes.textInputStyle}
        value={searchQuery}
        placeholder={t("pricingWidget.searchActions")}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div style={classes.bodyContainer}>

        {
          filteredActions?.map((action, index) => (
            <div key={index} style={classes.menuTabStyle} className="action-menu-item"
              onClick={() => {
                if (isFromSetting) {
                  addActionToProduct(action)
                }
                else {
                  setActionNameSelected(action)
                  onClickAddNewAction()
                  handleCloseSectionNameListMenu()
                }
                handleClose()

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
