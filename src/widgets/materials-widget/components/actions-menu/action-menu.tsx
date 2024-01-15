import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { EMaterialsActions } from "@/widgets/materials-widget/enums";
import { useMaterialsActions } from "@/widgets/materials-widget/components/actions-menu/use-materials-actions";
import { GoMakeAutoComplate, GoMakeModal, GomakeTextInput } from "@/components";
import Stack from "@mui/material/Stack";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useRecoilValue } from "recoil";
import {
  currenciesState,
  materialActionState,
  materialHeadersState,
  materialsMachinesState,
} from "@/widgets/materials-widget/state";
import { rowInputs } from "../add-row/inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { useStyle } from "./style";
import { EMaterialsTabsIcon } from "@/enums";
import {
  ActiveMaterial,
  AddNewMaterial,
  CurrencyMaterial,
  DeActiveMaterial,
  DeleteMaterial,
  DownloadExcelSheet,
  DuplicateMaterial,
  PercentageMaterial,
  UnitsPriceMaterial,
  UploadExcelSheet,

} from "@/icons";
interface IActionMenuProps {
  isAdmin: boolean;
}
const ActionMenu = (props: IActionMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    onChooseAction,
    action,
    updatedValue,
    onTextInputChange,
    onInputChange,
    onUpdate,
    uploadExcelFile,
    elementRef
  } = useMaterialsActions(props.isAdmin);
  const currencies = useRecoilValue(currenciesState);
  const materialActions = useRecoilValue(materialActionState);
  const materialHeaders =
    useRecoilValue<
      { key: string; value: string; inputType: number; values: any[] }[]
    >(materialHeadersState);
  const machinesCategories = useRecoilValue<any>(materialsMachinesState);
  const [property, setProperty] = useState<any[]>();
  const [flag, setFlag] = useState<boolean>(false);

  const handleMoreOptionIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    onChooseAction(null);
    setProperty(null);
  };
  const _renderIcons = (iconName: string) => {
    if (iconName === EMaterialsTabsIcon.UPDATE_PRICE_PER_TON) {
      return <UnitsPriceMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.UPDATE_UNIT_PRICE) {
      return <UnitsPriceMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.ADD_PERCENT_TO_UNIT_PRICE) {
      return <PercentageMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.ADD_PERCENT_TO_PRICE_PER_TON) {
      return <PercentageMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.UPDATE_CURRENCY) {
      return <CurrencyMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.CHANGE_TO_ACTIVE) {
      return <ActiveMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.CHANGE_TO_INACTIVE) {
      return <DeActiveMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.ADD_NEW) {
      return <AddNewMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.DUPLICATE) {
      return <DuplicateMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.DELETE) {
      return <DeleteMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.DOWNLOAD_EXCEL) {
      return <DownloadExcelSheet />;
    }
    if (iconName === EMaterialsTabsIcon.UPLOAD_EXCEL) {
      return <UploadExcelSheet />;
    }
  };
  return (
    <>
      <IconButton onClick={handleMoreOptionIconClick}>
        <SettingsIcon stroke={"#000000"} />
      </IconButton>
      <input
          ref={elementRef}
          onChange={uploadExcelFile}
          type="file"
          accept=".xlsx"
          hidden={true}
      />
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        onClick={handleCloseMenu}
      >
        {materialActions?.map((action) => (
          <>
            <MenuItem
              style={clasess.menuItemContainer}
              key={action.action}
              onClick={() => onChooseAction(action) }
            >
              <div style={clasess.actionIconStyle}>{_renderIcons(action.icon)}</div>
              <div style={clasess.rowTextStyle}>
                {t("materialsActions." + action.key)}
              </div>
            </MenuItem>
            {action?.isUnderLine && <Divider />}
          </>
        ))}
      </Menu>
      <GoMakeModal
        onClose={handleCloseModal}
        insideStyle={{ width: "fit-content", height: "fit-content" }}
        openModal={action !== null}
        modalTitle={t("materialsActions." + action?.key)}
      >
        <Stack
          gap={3}
          alignItems={"center"}
          justifyContent={"center"}
          minWidth={"350px"}
        >
          {action?.action === EMaterialsActions.UpdateCurrency ? (
            <GoMakeAutoComplate
              style={{ width: "100%" }}
              value={updatedValue}
              options={currencies}
              onChange={(e, value) => onTextInputChange(value.value)}
            />
          ) : action?.action === EMaterialsActions.Duplicate ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: "10px",
              }}
            >
              <GoMakeAutoComplate
                placeholder={"select property"}
                getOptionLabel={(option: any) => option.key}
                options={materialHeaders}
                onChange={(event, value) => {
                  setFlag(!!value), setProperty([value]);
                }}
              />
              {flag &&
                property &&
                rowInputs(
                  updatedValue,
                  materialHeaders,
                  currencies,
                  machinesCategories,
                  property
                ).map((item) => (
                  <Stack width={"180px"}>
                    <FormInput
                      input={item as IInput}
                      changeState={onInputChange}
                      error={false}
                      readonly={false}
                    />
                  </Stack>
                ))}
            </div>
          ) : (
            <GomakeTextInput
              onChange={(e) => onTextInputChange(e.target.value)}
              value={updatedValue}
            />
          )}
          <SecondaryButton
            onClick={onUpdate}
            sx={{ width: "100%" }}
            variant={"contained"}
          >{t("profileSettings.update")}
          </SecondaryButton>
        </Stack>
      </GoMakeModal>
    </>
  );
};

export { ActionMenu };
