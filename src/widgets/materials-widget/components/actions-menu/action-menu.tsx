import { Checkbox, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import React from "react";
import { useTranslation } from "react-i18next";
import { EMaterialsActions } from "@/widgets/materials-widget/enums";
import { useMaterialsActions } from "@/widgets/materials-widget/components/actions-menu/use-materials-actions";
import { GoMakeAutoComplate, GoMakeDeleteModal, GoMakeModal, GomakeTextInput } from "@/components";
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
    updateModalCurrency
  } = useMaterialsActions(props.isAdmin);

  const getMaterialActions = () => {
    if (props.isAdmin) {
      return materialActions.filter(x => x.action !== EMaterialsActions.UpdateIsActive && x.action !== EMaterialsActions.UpdateIsInActive && x.action !== EMaterialsActions.CreatePurchaseOrder);
    }
    /*else {
      return materialActions.filter(x => x.action !== EMaterialsActions.DownLoadExcel && x.action !== EMaterialsActions.UploadExcel);
    }*/

  }
  return (
    <>
      <IconButton data-tour={'materialsActions'} onClick={handleMoreOptionIconClick}>
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
        {getMaterialActions()?.map((action) => (
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
      {action?.action === EMaterialsActions.Delete ?
        <GoMakeDeleteModal
          openModal={action !== null}
          onClose={handleCloseModal}
          onClickDelete={onUpdate}
        />
        :
        <GoMakeModal
          onClose={handleCloseModal}
          insideStyle={{ width: 500, height: "auto" }}
          openModal={action !== null}
          modalTitle={action?.action === EMaterialsActions.CreatePurchaseOrder ? t("materials.modals.quantityPerMaterial") : t("materialsActions." + action?.key)}
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
                    updateModalCurrency(value?.value)
                  }}
                  disableClearable
                  placeholder={t("materials.inputs.chooseCurrency")}
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
                  <div style={clasess.secondText}>{t("materials.inputs.updatePrices")}</div>
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
                          options={materialHeaders.filter(x => !x.isHideInDuplicate)}
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
                                handleChange(index, "values", v)
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
                type={action?.action === EMaterialsActions.CreatePurchaseOrder ? "number" : undefined}
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
      }

    </>
  );
};

export { ActionMenu };
