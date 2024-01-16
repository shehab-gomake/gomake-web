import { Checkbox, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import React from "react";
import { useTranslation } from "react-i18next";
import { EMaterialsActions } from "@/widgets/materials-widget/enums";
import { useMaterialsActions } from "@/widgets/materials-widget/components/actions-menu/use-materials-actions";
import { GoMakeAutoComplate, GoMakeModal, GomakeTextInput } from "@/components";
import Stack from "@mui/material/Stack";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useStyle } from "./style";
import { AddPlusIcon, CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { DeleteMenuIcon } from "@/pages/admin/products/parameters/widget/more-circle/icons/delete-menu";
import { rowInputs } from "../add-row/inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
interface IActionMenuProps {
  isAdmin: boolean;
}
const ActionMenu = (props: IActionMenuProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    onChooseAction,
    action,
    updatedValue,
    onTextInputChange,
    onUpdate,
    checkedPrice,
    setCheckedPrice,
    setRate,
    rate,
    uploadExcelFile,
    updateMaterialsImages,
    elementRef,
    uploadImgRef,
    handleMoreOptionIconClick,
    anchorEl,
    handleCloseMenu,
    materialActions,
    _renderIcons,
    handleCloseModal,
    currencies,
    properties,
    materialHeaders,
    handleChange,
    deleteProperty,
    addProperty,
  } = useMaterialsActions(props.isAdmin);

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
      <input
        ref={uploadImgRef}
        onChange={updateMaterialsImages}
        type="file"
        accept=".zip,.rar,.7zip"
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
              onClick={() => onChooseAction(action)}
            >
              <div style={clasess.actionIconStyle}>
                {_renderIcons(action.icon)}
              </div>
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
        insideStyle={{ width: 500, height: "auto" }}
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
            <div style={clasess.UpdateCurrencyView}>
              <GoMakeAutoComplate
                style={{ width: "100%" }}
                value={updatedValue}
                options={currencies}
                onChange={(e, value) => {
                  setCheckedPrice(true);
                  onTextInputChange(value?.value);
                }}
                disableClearable
              />
              <div style={clasess.priceCheckedContainer}>
                <Checkbox
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxCheckedIcon />}
                  onChange={() => {
                    setCheckedPrice(!checkedPrice);
                    if (!checkedPrice) {
                      setRate(null);
                    }
                  }}
                  checked={checkedPrice}
                />
                <div style={clasess.secondText}>update prices</div>
              </div>
              {rate && (
                <GomakeTextInput
                  style={{
                    border: "0px",
                    background: "#fff",
                    borderRadius: 4,
                    height: 40,
                  }}
                  onChange={(e: any) => {
                    setRate(e.target.value);
                  }}
                  value={rate}
                />
              )}
            </div>
          ) : action?.action === EMaterialsActions.Duplicate ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "100%",
                gap: 10,
              }}
            >
              {properties?.map((item, index) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      height: item?.key?.key === "image" ? 155 : "100%",
                    }}
                  >
                    <div style={{ width: "50%", height: "100%" }}>
                      <GoMakeAutoComplate
                        placeholder={"select property"}
                        getOptionLabel={(option: any) => option.key}
                        options={materialHeaders}
                        onChange={(event, value) => {
                          handleChange(index, "key", value);
                        }}
                      />
                    </div>
                    <div
                      style={{ width: "50%", marginTop: -24, height: "100%" }}
                    >
                      {properties[index].key &&
                        rowInputs(
                          properties[index].key,
                          materialHeaders,
                          currencies,
                          [],
                          [],
                          [item?.key]
                        ).map((item) => (
                          <FormInput
                            input={item as IInput}
                            changeState={(e, v) =>
                              handleChange(index, "value", v)
                            }
                            error={false}
                            readonly={false}
                          />
                        ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        marginTop: "2%",
                      }}
                      onClick={() => deleteProperty(index)}
                    >
                      <DeleteMenuIcon />
                    </div>
                  </div>
                );
              })}
              <div style={clasess.AddNewRuleDiv}>
                <AddPlusIcon />
                <span onClick={addProperty} style={clasess.spanAddNewRule}>
                  {t("properties.addNewRule")}
                </span>
              </div>
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
          >
            {t("profileSettings.update")}
          </SecondaryButton>
        </Stack>
      </GoMakeModal>
    </>
  );
};

export { ActionMenu };
