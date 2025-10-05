import { Checkbox, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { EMaterialsActions } from "@/widgets/materials-widget/enums";
import { useMaterialsActions } from "@/widgets/materials-widget/components/actions-menu/use-materials-actions";
import { GoMakeAutoComplate, GoMakeDeleteModal, GoMakeModal, GomakeTextInput } from "@/components";
import Stack from "@mui/material/Stack";
import { SecondaryButton } from "@/components/button/secondary-button";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { useStyle } from "./style";
import { AddPlusIcon, CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { DeleteMenuIcon } from "@/pages/admin/products/parameters/widget/more-circle/icons/delete-menu";
import { rowInputs } from "../add-row/inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { ModalType } from "@/enums";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
interface IActionMenuProps {
  isAdmin: boolean;
}
const ActionMenu = (props: IActionMenuProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
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
    updateModalCurrency,
    openUpdatedTableRowModal,
    onClickCloseUpdatedTableRowModal,
    updatedTableRowModal,
    // Submenu handlers
    handleSubmenuAction,
    isSubmenuModalOpen,
    submenuModalAction,
    handleCloseSubmenuModal,
    selectedSupplier,
    setSelectedSupplier,
    renderOptionsSupplier,
    checkWhatRenderArraySupplier,
    isFetchingSupplier,
    setOpenSupplierModal,
    openSupplierModal,
  } = useMaterialsActions(props.isAdmin);

  const [submenuAnchorEl, setSubmenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentSubmenuAction, setCurrentSubmenuAction] = useState<any>(null);
  const [supplier, setSupplier] = useState<any>([]);

  const onSupplierAdd = (supplier) => {
    setOpenSupplierModal(false);
  };


  const onCloseSupplierModal = () => {
    setOpenSupplierModal(false);
  };

  console.log("action", action);
  const getMaterialActions = () => {
    if (props.isAdmin) {
      return materialActions.filter(x => x.action !== EMaterialsActions.UpdateIsActive && x.action !== EMaterialsActions.UpdateIsInActive && x.action !== EMaterialsActions.CreatePurchaseOrder);
    } else {
      // return [...materialActions, {
      //   "key": "UpdateNumbering",
      //   "isUnderLine": false,
      //   "icon": "purchaseOrderIcon",
      //   "action": 16
      // }];
      return materialActions;
    }
    /*else {
      return materialActions.filter(x => x.action !== EMaterialsActions.DownLoadExcel && x.action !== EMaterialsActions.UploadExcel);
    }*/

  };

  const handleMenuItemClick = (action: any, event: React.MouseEvent<HTMLLIElement>) => {
    if (action.isShowSubMenu) {
      setSubmenuAnchorEl(event.currentTarget);
      setCurrentSubmenuAction(action);
    } else {
      onChooseAction(action);
      handleCloseMenu();
    }
  };

  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
    setCurrentSubmenuAction(null);
  };

  const handleSubmenuItemClick = (submenuOption: number) => {
    if (currentSubmenuAction) {
      // All submenu options should go through the same flow with submenuOption
      onChooseAction({ ...currentSubmenuAction, submenuOption });
    }
    handleSubmenuClose();
    handleCloseMenu();
  };

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
        transformOrigin={{ horizontal: isRTL ? "left" : "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        {getMaterialActions()?.map((actionItem) => {
          return (
            <React.Fragment key={actionItem.action}>
              <MenuItem
                style={clasess.menuItemContainer}
                onClick={(e) => handleMenuItemClick(actionItem, e)}
              >
                <div style={clasess.menuItemContainer1}>
                  {actionItem.isShowSubMenu ? (
                    <>
                      {
                        isRTL ? <ChevronRightIcon sx={{ ml: "auto", color: "rgb(130, 131, 190)" }} /> : <ChevronLeftIcon sx={{ ml: "auto", color: "rgb(130, 131, 190)" }} />
                      }
                    </>

                  ) : <div style={{ width: 24, height: 24 }} />}
                  <div style={clasess.actionIconStyle}>
                    {_renderIcons(actionItem.icon)}
                  </div>
                  <div style={clasess.rowTextStyle}>
                    {t("materialsActions." + actionItem.text)}
                  </div>
                  {/* {isRTL && actionItem.isShowSubMenu && (
                    <ChevronRightIcon sx={{ ml: "auto", color: "rgb(130, 131, 190)" }} />
                  )} */}
                </div>
              </MenuItem>
              {actionItem?.isUnderLine && <Divider />}
            </React.Fragment>
          );
        })}
      </Menu>

      {/* Submenu */}
      <Menu
        open={Boolean(submenuAnchorEl)}
        anchorEl={submenuAnchorEl}
        onClose={handleSubmenuClose}
        anchorOrigin={{ horizontal: isRTL ? "right" : "left", vertical: "top" }}
        transformOrigin={{ horizontal: isRTL ? "left" : "right", vertical: "top" }}
      >
        <MenuItem onClick={() => handleSubmenuItemClick(0)} style={clasess.rowTextStyle}>
          {t("materialsActions.updateDefaultSaleCost")}
        </MenuItem>
        <MenuItem onClick={() => handleSubmenuItemClick(1)} style={clasess.rowTextStyle}>
          {t("materialsActions.updateInventorySaleCost")}
        </MenuItem>
        <MenuItem onClick={() => handleSubmenuItemClick(2)} style={clasess.rowTextStyle}>
          {t("materialsActions.updateSupplierPurchasePrice")}
        </MenuItem>
      </Menu>
      {action?.action === EMaterialsActions.Delete ?
        <GoMakeDeleteModal
          modalType={ModalType.DELETE}
          openModal={action !== null}
          onClose={handleCloseModal}
          onClickDelete={onUpdate}
        />
        :
        <GoMakeModal
          onClose={handleCloseModal}
          insideStyle={{ width: 500, height: "auto" }}
          openModal={action !== null}
          modalTitle={t("materialsActions." + action?.text)}
        >
          <Stack
            gap={3}
            alignItems={"center"}
            justifyContent={"center"}
            minWidth={"350px"}
          >
            {action?.action === EMaterialsActions.UpdateCurrency ? (
              <div style={clasess.UpdateCurrencyView}>
                {/* Supplier Selection - Show for submenu options 1 and 2 */}
                {(action?.submenuOption === 1 || action?.submenuOption === 2) && (
                  <div style={{ width: "100%" }}>
                    <div style={{ marginBottom: 8, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
                      {t("materials.childTable.supplier")}
                      <IconButton onClick={() => setOpenSupplierModal(true)} size="small">
                        <AddPlusIcon />
                      </IconButton>
                    </div>
                    <ClientAutocomplete
                      key={selectedSupplier?.id}
                      clientType={CLIENT_TYPE.SUPPLIER}
                      onChange={(e: any, supplier: any) => setSelectedSupplier(supplier)}
                      options={renderOptionsSupplier || []}
                      placeholder={t("materials.childTable.selectSupplier")}
                      style={{ width: "100%" }}
                      value={selectedSupplier}
                      onChangeTextField={checkWhatRenderArraySupplier}
                      loading={isFetchingSupplier}
                      getOptionLabel={(option: any) => `${option.name}`}
                    />
                  </div>
                )}

                <div style={{ width: "100%" }}>
                  <div style={{ marginBottom: 8, fontWeight: 500 }}>
                    {t("materials.childTable.currency")}
                  </div>
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
                </div>

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
                          getOptionLabel={(option: any) => option.value}
                          options={materialHeaders.filter(x => !x.isHideInDuplicate)}
                          onChange={(event, value) => {
                            handleChange(index, "key", value);
                          }}
                        />
                      </div>
                      <div
                        style={{ width: "50%", marginTop: -16, height: "100%" }}
                      >
                        {properties[index].key &&
                          rowInputs(
                            properties[index].key,
                            false,
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
                              hideLabel={true}
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
              <div style={{
                display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start",
                alignContent: "flex-start", width: "100%", gap: 15,
              }}>
                {action?.action === EMaterialsActions.CreatePurchaseOrder && <div style={{ marginBottom: 10, marginTop: 15 }}>{t("boardMissions.package")}</div>}

                {/* Supplier Selection - Show for submenu options 1 and 2 */}
                {(action?.submenuOption === 1 || action?.submenuOption === 2) && (
                  <div style={{ width: "100%" }}>
                    <div style={{ marginBottom: 8, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
                      {t("materials.childTable.supplier")}
                      <IconButton onClick={() => setOpenSupplierModal(true)} size="small">
                        <AddPlusIcon />
                      </IconButton>
                    </div>
                    <ClientAutocomplete
                      key={selectedSupplier?.id}
                      clientType={CLIENT_TYPE.SUPPLIER}
                      onChange={(e: any, supplier: any) => setSelectedSupplier(supplier)}
                      options={renderOptionsSupplier || []}
                      placeholder={t("materials.childTable.selectSupplier")}
                      style={{ width: "100%" }}
                      value={selectedSupplier}
                      onChangeTextField={checkWhatRenderArraySupplier}
                      loading={isFetchingSupplier}
                      getOptionLabel={(option: any) => `${option.name}`}
                    />
                  </div>
                )}

                <div style={{ width: "100%" }}>
                  {action?.submenuOption !== undefined && (
                    <div style={{ marginBottom: 8, fontWeight: 500 }}>
                      {t("materials.childTable.price")}
                    </div>
                  )}
                  <GomakeTextInput
                    onChange={(e) => onTextInputChange(e.target.value)}
                    value={updatedValue}
                    type={action?.action === EMaterialsActions.CreatePurchaseOrder ? "number" : action?.submenuOption !== undefined ? "number" : undefined}
                    placeholder={action?.submenuOption !== undefined ? t("reports.enterPrice") : undefined}
                    style={{
                      height: 40,
                      borderBottom: !updatedValue ? "1px solid red" : "1px solid blue",
                      boxShadow: "none",
                      WebkitBoxShadow: "none",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

            )}
            <SecondaryButton
              onClick={onUpdate}
              sx={{ width: "100%" }}
              variant={"contained"}
              disabled={
                !updatedValue ||
                ((action?.submenuOption === 1 || action?.submenuOption === 2) && !selectedSupplier)
              }
            >
              {action?.action === EMaterialsActions.CreatePurchaseOrder ? t("materialsActions." + action?.text) : t("profileSettings.update")}
            </SecondaryButton>
          </Stack>
        </GoMakeModal>
      }
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        openModal={openUpdatedTableRowModal}
        onClose={onClickCloseUpdatedTableRowModal}
        hideIcon
        title={t("materials.modals.updateModalTitle")}
        yesBtn={t("documentingSettings.update")}
        onClickDelete={updatedTableRowModal}
      />

      {/* Supplier Add Modal */}
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Add}
        typeClient={CLIENT_TYPE.SUPPLIER}
        onCustomerAdd={onSupplierAdd}
        openModal={openSupplierModal}
        onClose={onCloseSupplierModal}
        customer={supplier}
        setCustomer={setSupplier}
      />
    </>
  );
};


export { ActionMenu };
