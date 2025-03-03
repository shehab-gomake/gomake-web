import React from "react";

import { Divider } from "@mui/material";
import { GoMakeMenu } from "@/components";

import { AutoCompleteUpdatedValue } from "../auto-complete-updated";

import { useStyle } from "./style";
import { useSttingsVatListMenu } from "./use-setting-vat-menu";

const SettingVatListMenu = ({
  handleClose,
  open,
  anchorEl,
  onBlurVatStatus,
  setIsUpdateVatStatus,
  isUpdateVatStatus,
  updateVatStatus,
}) => {
  const { classes } = useStyle();
  const { vatStatus, vatStatusList, t, } = useSttingsVatListMenu()
  return (
    <>
      <GoMakeMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
        style={classes.mainContainer}
      >
        <div style={classes.bodyContainer}>

          <div style={classes.menuRowStyle}>
            <div style={classes.menuTabStyle}>{t("accounting.defaultVat")}</div>
            <AutoCompleteUpdatedValue
              value={vatStatus || t("accounting.defaultVat")}
              options={vatStatusList}
              onBlur={onBlurVatStatus}
              isUpdate={isUpdateVatStatus}
              setIsUpdate={setIsUpdateVatStatus}
              getOptionLabel={(item) => item.text}
              onChange={(e, value) => updateVatStatus(value?.value)}
            />
          </div>
          <Divider />
        </div>
      </GoMakeMenu>
    </>
  );
};

export { SettingVatListMenu };
