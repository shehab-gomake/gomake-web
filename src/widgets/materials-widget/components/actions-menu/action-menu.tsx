import { Checkbox, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import React, { useState } from "react";
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
import { ModalType } from "@/enums";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { SubmenuActionModal } from "../submenu-action-modal/submenu-action-modal";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
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
      if (submenuOption === 0) {
        // Update Default Sale Cost - works as before
        onChooseAction(currentSubmenuAction);
      } else {
        // Options 1 & 2 need supplier selection - will be handled by modal
        onChooseAction({ ...currentSubmenuAction, submenuOption });
      }
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
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        {getMaterialActions()?.map((actionItem) => {
          return (
            <React.Fragment key={actionItem.action}>
              <MenuItem
                style={clasess.menuItemContainer}
                onClick={(e) => handleMenuItemClick(actionItem, e)}
              >
                <div style={clasess.actionIconStyle}>
                  {_renderIcons(actionItem.icon)}
                </div>
                <div style={clasess.rowTextStyle}>
                  {t("materialsActions." + actionItem.text)}
                </div>
                {actionItem.isShowSubMenu && (
                  <ChevronRightIcon sx={{ ml: "auto" }} />
                )}
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
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <MenuItem onClick={() => handleSubmenuItemClick(0)}>
          {t("materialsActions.submenu.updateDefaultSaleCost")}
        </MenuItem>
        <MenuItem onClick={() => handleSubmenuItemClick(1)}>
          {t("materialsActions.submenu.updateInventorySaleCost")}
        </MenuItem>
        <MenuItem onClick={() => handleSubmenuItemClick(2)}>
          {t("materialsActions.submenu.updateSupplierPurchasePrice")}
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
                alignContent: "flex-start", width: "100%",
              }}>
                {action?.action === EMaterialsActions.CreatePurchaseOrder && <div style={{ marginBottom: 10, marginTop: 15 }}>{t("boardMissions.package")}</div>}
                <GomakeTextInput
                  onChange={(e) => onTextInputChange(e.target.value)}
                  value={updatedValue}
                  type={action?.action === EMaterialsActions.CreatePurchaseOrder ? "number" : undefined}
                  style={{
                    height: "100%",
                    borderBottom: !updatedValue ? "1px solid red" : "1px solid blue",
                    boxShadow: "none",
                    WebkitBoxShadow: "none",

                  }}
                />
              </div>

            )}
            <SecondaryButton
              onClick={onUpdate}
              sx={{ width: "100%" }}
              variant={"contained"}
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

      {/* Submenu Action Modal */}
      {isSubmenuModalOpen && submenuModalAction && (
        <SubmenuActionModal
          isOpen={isSubmenuModalOpen}
          onClose={handleCloseSubmenuModal}
          onSubmit={handleSubmenuAction}
          t={t}
          actionText={submenuModalAction.text}
          actionType={submenuModalAction.action}
          submenuOption={submenuModalAction.submenuOption || 0}
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
          renderOptionsSupplier={renderOptionsSupplier}
          checkWhatRenderArraySupplier={checkWhatRenderArraySupplier}
          isFetchingSupplier={isFetchingSupplier}
          setOpenSupplierModal={setOpenSupplierModal}
        />
      )}

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
